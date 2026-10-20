"""Run: python3 -m uvicorn authoring.server:app --host 127.0.0.1 --port 8787"""
import asyncio
from contextlib import asynccontextmanager
import io
import json
import os
from pathlib import Path
import shutil
import tempfile
import uuid
import zipfile

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from PIL import Image, UnidentifiedImageError

from .models import Draft, GenerateRequest, SaveDraft, asset_path
from .val_client import ValClient, ValError

ROOT = Path(__file__).resolve().parents[1]
DATA = Path(os.getenv("FROG_DATA_DIR", str(ROOT / "authoring/data")))
load_dotenv(os.getenv("FROG_VAL_ENV_FILE", str(ROOT / "authoring/.env")))
# In the VAL workspace, reuse the key the user already provided, without copying it.
load_dotenv(ROOT.parent / ".env")
MAX_UPLOAD = 30 * 1024 * 1024
JOBS = {}
LOCK = asyncio.Lock()
SLOTS = asyncio.Semaphore(2)


@asynccontextmanager
async def lifespan(app):
    DATA.mkdir(parents=True, exist_ok=True)
    yield
    tasks = [job["task"] for job in JOBS.values() if "task" in job and not job["task"].done()]
    for task in tasks:
        task.cancel()
    await asyncio.gather(*tasks, return_exceptions=True)


app = FastAPI(title="Frog Explorer authoring", lifespan=lifespan, docs_url="/api/docs")


@app.middleware("http")
async def local_only(request: Request, call_next):
    # Avoid exposing a local key-backed editor via DNS rebinding or cross-site forms.
    if request.url.hostname not in {"127.0.0.1", "localhost", "testserver"}:
        return JSONResponse({"detail": "This authoring tool is local only"}, status_code=403)
    origin = request.headers.get("origin")
    if request.method not in {"GET", "HEAD", "OPTIONS"} and origin and origin != f"{request.url.scheme}://{request.url.netloc}":
        return JSONResponse({"detail": "Cross-origin changes are not allowed"}, status_code=403)
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "no-referrer"
    if request.url.path.startswith(("/api/", "/author")):
        response.headers["Cache-Control"] = "no-store"
        response.headers["Content-Security-Policy"] = "default-src 'self'; img-src 'self' blob: data:; media-src 'self' blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'"
    return response


def document_path(draft_id):
    if len(draft_id) != 12 or any(c not in "0123456789abcdef" for c in draft_id):
        raise HTTPException(404, "Draft not found")
    return DATA / f"{draft_id}.json"


def read_draft(draft_id):
    p = document_path(draft_id)
    if not p.exists():
        raise HTTPException(404, "Draft not found")
    return Draft.model_validate_json(p.read_text())


def atomic_write(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(mode="w", dir=path.parent, delete=False, encoding="utf-8") as f:
        f.write(text)
        temp = Path(f.name)
    temp.replace(path)


def media_paths(draft):
    yield from [draft.map_image, draft.geography_reference, draft.frog.photo, draft.frog.call_audio]
    for scene in draft.scenes:
        yield scene.photo
        yield scene.ambient_audio


def validate_media(draft):
    try:
        for value in media_paths(draft):
            asset_path(value)
            if value and (not (ROOT / value).is_file() or not (ROOT / value).resolve().is_relative_to((ROOT / "assets").resolve())):
                raise ValueError("A media file is missing or outside the asset directory")
    except ValueError as exc:
        raise HTTPException(422, str(exc)) from exc


def safe_text(value):
    """The original game uses HTML templates for field-guide prose."""
    return value  # Escape at HTML sinks in the game; keep textContent labels readable.


def game_payload(draft):
    species_id = f"custom-{draft.id}"
    frog = draft.frog
    species = {
        "id": species_id, "name": safe_text(frog.name), "latin": safe_text(frog.scientific_name),
        "photo": frog.photo, "photoFull": frog.photo, "callAudio": frog.call_audio,
        "hint": [safe_text(t) for t in frog.hints], "statusFederal": "Not assessed in this activity",
        "statusIucn": "Not assessed in this activity", "calling": frog.calling,
        "description": [safe_text(t) for t in frog.description.splitlines() if t.strip()],
        "habitat": safe_text(frog.habitat), "audioCredit": safe_text(frog.audio_credit),
        "sources": [safe_text(t) for t in draft.sources],
    }
    existing_species = [
        ("banjo", "Eastern Banjo Frog", "Limnodynastes dumerilii"),
        ("striped-marsh", "Striped Marsh Frog", "Limnodynastes peronii"),
        ("spotted-marsh", "Spotted Marsh Frog", "Limnodynastes tasmaniensis"),
        ("brown-tree", "Southern Brown Tree Frog", "Litoria ewingii"),
        ("bell", "Growling Grass Frog", "Litoria raniformis"),
        ("baw-baw", "Baw Baw Frog", "Philoria frosti"),
        ("spotted-tree", "Spotted Tree Frog", "Dryopsophus spenceri"),
    ]
    # Avoid showing the same species under two IDs in the quiz.
    aliases = {"rawlinsonia ewingii": "litoria ewingii", "ranoidea raniformis": "litoria raniformis"}
    latin = aliases.get(frog.scientific_name.lower().strip(), frog.scientific_name.lower().strip())
    distractors = [key for key, name, scientific in existing_species if latin != scientific.lower() and frog.name.lower().strip() != name.lower()][:3]
    reserve = {
        "id": species_id, "name": safe_text(draft.name), "mapImage": draft.map_image,
        "mapAlt": safe_text(draft.map_alt), "targetSpecies": species_id,
        "quizLabelIds": [species_id, *distractors],
        "pinX": draft.pin_x, "pinY": draft.pin_y,
        "scenes": [{
            "id": s.id, "name": safe_text(s.name), "photo": s.photo, "video": "",
            "ambientAudio": s.ambient_audio, "pannable": True,
            "mapX": f"{s.map_x}%", "mapY": f"{s.map_y}%",
            "hotspots": [{"id": h.id, "x": f"{h.x}%", "y": f"{h.y}%"} for h in s.hotspots],
        } for s in draft.scenes],
    }
    return species_id, species, reserve


def publication_errors(draft):
    errors = []
    for name, value in [("Reserve map", draft.map_image), ("Frog name", draft.frog.name),
                        ("Scientific name", draft.frog.scientific_name), ("Frog image", draft.frog.photo),
                        ("Frog call", draft.frog.call_audio), ("Audio credit / permission", draft.frog.audio_credit),
                        ("Species description", draft.frog.description), ("Habitat", draft.frog.habitat)]:
        if not value.strip():
            errors.append(name + " is required")
    if not draft.frog.hints:
        errors.append("Add at least one visual identification hint")
    if not draft.sources or not any(s.strip() for s in draft.sources):
        errors.append("Add sources for the species and its occurrence at this location")
    if not draft.reviewed:
        errors.append("Review the species, occurrence records, map, images and audio rights before publishing")
    if not draft.scenes:
        errors.append("Add at least one habitat scene")
    for scene in draft.scenes:
        if not scene.photo or not scene.hotspots:
            errors.append(f"{scene.name}: add an image and at least one frog hotspot")
    return errors


def job_file(job_id):
    if len(job_id) != 32 or any(c not in "0123456789abcdef" for c in job_id):
        raise HTTPException(404, "Job not found")
    return DATA / "jobs" / f"{job_id}.json"


def public_job(job):
    return {k: v for k, v in job.items() if k != "task"}


def load_job(job_id):
    if job_id in JOBS:
        return public_job(JOBS[job_id])
    path = job_file(job_id)
    if not path.exists():
        raise HTTPException(404, "Job no longer available")
    job = json.loads(path.read_text())
    if job["status"] == "running":
        job.update(status="failed", error="The server restarted before this request finished. Start this request again.")
        atomic_write(path, json.dumps(job))
    return job


def launch_job(action, **metadata):
    # Retain running work and only a bounded number of finished jobs.
    if sum(j["status"] == "running" for j in JOBS.values()) >= 4:
        raise HTTPException(429, "Four jobs are already queued. Wait for one to finish.")
    for key in list(JOBS):
        if len(JOBS) <= 30:
            break
        if JOBS[key]["status"] != "running":
            del JOBS[key]
    job_id = uuid.uuid4().hex
    job = {"id": job_id, "status": "running", **metadata}
    JOBS[job_id] = job
    atomic_write(job_file(job_id), json.dumps(public_job(job)))

    async def work():
        try:
            async with SLOTS:
                job["result"] = await action()
            job["status"] = "complete"
        except Exception as exc:
            job["status"] = "failed"
            job["error"] = str(exc)[:1500] if isinstance(exc, (ValError, ValueError)) else "The job could not complete. Check the local server."
        finally:
            atomic_write(job_file(job_id), json.dumps(public_job(job)))
    job["task"] = asyncio.create_task(work())
    return {"job_id": job_id}


@app.get("/api/status")
def status():
    val = ValClient()
    return {"configured": bool(val.key), "base_url": val.base, "claude_model": val.claude, "image_model": val.image_model}


@app.get("/api/drafts")
def drafts():
    DATA.mkdir(parents=True, exist_ok=True)
    return [{"id": d.id, "name": d.name, "frog": d.frog.name} for p in sorted(DATA.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True) for d in [Draft.model_validate_json(p.read_text())]]


@app.post("/api/drafts")
def create_draft():
    draft = Draft(id=uuid.uuid4().hex[:12])
    atomic_write(document_path(draft.id), draft.model_dump_json(indent=2))
    return draft


@app.get("/api/drafts/{draft_id}")
def get_draft(draft_id: str):
    return read_draft(draft_id)


@app.put("/api/drafts/{draft_id}")
async def save_draft(draft_id: str, body: SaveDraft):
    async with LOCK:
        old = read_draft(draft_id)
        draft = body.draft
        if draft.id != draft_id:
            raise HTTPException(422, "Draft ID cannot change")
        if draft.revision != old.revision:
            raise HTTPException(409, "This draft changed in another tab. Reload it before saving.")
        validate_media(draft)
        draft.revision += 1
        atomic_write(document_path(draft_id), draft.model_dump_json(indent=2))
    return draft


@app.post("/api/drafts/{draft_id}/upload")
async def upload(draft_id: str, file: UploadFile):
    read_draft(draft_id)
    chunks, total = [], 0
    while chunk := await file.read(1024 * 1024):
        total += len(chunk)
        if total > MAX_UPLOAD:
            raise HTTPException(413, "Uploads must be 30 MB or smaller")
        chunks.append(chunk)
    raw = b"".join(chunks)
    ext = Path(file.filename or "").suffix.lower()
    if ext in {".png", ".jpg", ".jpeg", ".webp"}:
        try:
            raw = image_bytes(raw)
        except (ValueError, UnidentifiedImageError, OSError, Image.DecompressionBombError) as exc:
            raise HTTPException(422, "Upload a valid PNG, JPEG or WebP image") from exc
        ext = ".png"
    elif not audio_signature(raw, ext):
        raise HTTPException(422, "Upload a PNG/JPEG/WebP image, or MP3/WAV/OGG/M4A audio")
    relative = Path("assets/generated") / draft_id / (uuid.uuid4().hex[:16] + ext)
    (ROOT / relative).parent.mkdir(parents=True, exist_ok=True)
    (ROOT / relative).write_bytes(raw)
    return {"path": relative.as_posix()}


def image_bytes(raw):
    with Image.open(io.BytesIO(raw)) as image:
        if image.width * image.height > 30_000_000:
            raise ValueError("Image is too large")
        buffer = io.BytesIO()
        image.convert("RGB").save(buffer, format="PNG")
        return buffer.getvalue()


def audio_signature(raw, ext):
    return ((ext == ".wav" and raw[:4] == b"RIFF" and raw[8:12] == b"WAVE") or
            (ext == ".ogg" and raw[:4] == b"OggS") or
            (ext == ".m4a" and raw[4:8] == b"ftyp") or
            (ext == ".mp3" and (raw[:3] == b"ID3" or (len(raw) > 1 and raw[0] == 255 and raw[1] & 224 == 224))))


@app.post("/api/drafts/{draft_id}/suggest")
async def suggest(draft_id: str):
    async with LOCK:
        draft = read_draft(draft_id)
        pointer = DATA / "suggestions" / f"{draft_id}.json"
        if pointer.exists():
            previous = load_job(json.loads(pointer.read_text())["job_id"])
            if previous["status"] == "running" and previous.get("location") == draft.name:
                return {"job_id": previous["id"]}
        job = launch_job(lambda: ValClient().suggest(draft.name), kind="suggest", draft_id=draft_id, location=draft.name)
        atomic_write(pointer, json.dumps(job))
    return job


@app.get("/api/drafts/{draft_id}/suggestions")
def suggestions(draft_id: str):
    draft = read_draft(draft_id)
    pointer = DATA / "suggestions" / f"{draft_id}.json"
    if not pointer.exists():
        return {"status": "none"}
    job = load_job(json.loads(pointer.read_text())["job_id"])
    # A result for the old reserve name must not appear to describe a new site.
    return job if job.get("location") == draft.name else {"status": "none"}


@app.post("/api/drafts/{draft_id}/generate")
async def generate(draft_id: str, body: GenerateRequest):
    draft = read_draft(draft_id)
    validate_media(draft)
    scene = next((s for s in draft.scenes if s.id == body.scene_id), None)
    if body.target == "frog" and not draft.frog.name:
        raise HTTPException(422, "Choose a frog species first")
    if body.target == "scene" and scene is None:
        raise HTTPException(422, "Choose a scene first")
    references = [ROOT / {
        "frog": "assets/frogs/01-Growling-Grass-Frog.jpg",
        "map": "assets/scenes/yalukit-willam-nature-reserve/Yalukit Willam Nature Reserve Map.jpg",
        "scene": "assets/scenes/yalukit-willam-nature-reserve/02-Northern Chain Ponds-Still.jpg",
    }[body.target]]
    style = "Use image 1 as a STYLE reference only. Match its fine hand-painted watercolour, muted sage, olive, ochre and dusty blue palette, paper grain, and realistic natural-history detail. No text, labels, pins, borders, people or UI. Landscape composition. "
    if body.target == "frog":
        prompt = f"Create one {draft.frog.name} ({draft.frog.scientific_name}), full body side three-quarter view facing left on white paper. Correct species anatomy, natural proportions, subtle grounding shadow. Diagnostic details: {draft.frog.description}. {'; '.join(draft.frog.hints)}. Do not copy the reference species; depict the requested species."
    elif body.target == "map":
        prompt = f"Create a top-down aerial wetland reserve illustration for {draft.name}, Victoria. Habitat context: {draft.frog.habitat}. "
        if draft.geography_reference:
            references.append(ROOT / draft.geography_reference)
            prompt += "Image 2 is the GEOGRAPHY reference: preserve its real shoreline, paths, water bodies and boundaries while applying image 1's watercolour style. Do not copy image 1's geography."
        else:
            prompt += "No verified geography reference is supplied. Make an illustrative habitat map, not a claim of surveyed geography. Do not copy the reference reserve layout."
    else:
        prompt = f"Create a realistic eye-level habitat scene at {draft.name}, Victoria: {scene.name}. {draft.frog.habitat}. No frog visible: the activity will place interactive frog hotspots separately."
    prompt = style + prompt + " Additional art direction: " + body.prompt

    async def action():
        raw = await ValClient().image(prompt, references)
        raw = image_bytes(raw)
        relative = Path("assets/generated") / draft_id / (uuid.uuid4().hex[:16] + ".png")
        (ROOT / relative).parent.mkdir(parents=True, exist_ok=True)
        (ROOT / relative).write_bytes(raw)
        atomic_write((ROOT / relative).with_suffix(".provenance.json"), json.dumps({"provider": "RMIT VAL", "model": ValClient().image_model, "target": body.target, "prompt": prompt, "references": [str(p.relative_to(ROOT)) for p in references]}, indent=2))
        return {"path": relative.as_posix(), "target": body.target, "scene_id": body.scene_id}
    return launch_job(action)


@app.get("/api/jobs/{job_id}")
def job_status(job_id: str):
    return load_job(job_id)


@app.post("/api/drafts/{draft_id}/publish")
async def publish(draft_id: str):
    async with LOCK:
        draft = read_draft(draft_id)
        validate_media(draft)
        errors = publication_errors(draft)
        if errors:
            raise HTTPException(422, "\n".join(errors))
        payload = json.loads((ROOT / "content/generated.json").read_text())
        key, frog, reserve = game_payload(draft)
        # Draft media stays ignored. Only reviewed, game-used files enter the
        # publishable asset tree; geography reference uploads remain private.
        replacements = {}
        used_media = [draft.map_image, draft.frog.photo, draft.frog.call_audio]
        used_media += [value for scene in draft.scenes for value in [scene.photo, scene.ambient_audio] if value]
        for value in set(used_media):
            if not value.startswith("assets/generated/"):
                continue
            destination = Path("assets/published") / draft_id / Path(value).name
            (ROOT / destination).parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / value, ROOT / destination)
            provenance = (ROOT / value).with_suffix(".provenance.json")
            if provenance.exists():
                shutil.copyfile(provenance, (ROOT / destination).with_suffix(".provenance.json"))
            replacements[value] = destination.as_posix()

        def replace_assets(value):
            if isinstance(value, str):
                return replacements.get(value, value)
            if isinstance(value, dict):
                return {key: replace_assets(item) for key, item in value.items()}
            if isinstance(value, list):
                return [replace_assets(item) for item in value]
            return value

        frog, reserve = replace_assets(frog), replace_assets(reserve)
        payload["species"][key] = frog
        payload["reserves"][key] = reserve
        atomic_write(ROOT / "content/generated.json", json.dumps(payload, indent=2) + "\n")
        # JSON escapes '<' as a defence in depth for the script data boundary.
        js = "window.FROG_GENERATED_CONTENT = " + json.dumps(payload).replace("<", "\\u003c") + ";\n"
        atomic_write(ROOT / "js/generated-content.js", js)
    return {"published": True, "reserve_id": key, "game_url": f"/bes-frog-id.html?reserve={key}"}


@app.get("/api/drafts/{draft_id}/export")
def export(draft_id: str):
    draft = read_draft(draft_id)
    validate_media(draft)
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("draft.json", draft.model_dump_json(indent=2))
        for value in set(media_paths(draft)) - {""}:
            archive.write(ROOT / value, value)
        archive.writestr("README.txt", "Frog Explorer draft and media backup. This is not a standalone game. Publish through the authoring editor to add it to the existing game.\n")
    return Response(buffer.getvalue(), media_type="application/zip", headers={"Content-Disposition": f'attachment; filename="frog-draft-{draft_id}.zip"'})


@app.get("/api/drafts/{draft_id}/preview")
def preview(draft_id: str):
    draft = read_draft(draft_id)
    validate_media(draft)
    if not (draft.map_image and draft.frog.name and draft.frog.photo and draft.scenes and all(s.photo and s.hotspots for s in draft.scenes)):
        raise HTTPException(422, "For a playable preview, add a reserve map, frog name/image, and a scene with an image and hotspot")
    text = (ROOT / "bes-frog-id.html").read_text()
    text = text.replace('<head>', '<head><base href="/">', 1)
    text = text.replace('src="js/generated-content.js"', f'src="/api/drafts/{draft_id}/preview.js"')
    return HTMLResponse(text)


@app.get("/api/drafts/{draft_id}/preview.js")
def preview_script(draft_id: str):
    draft = read_draft(draft_id)
    validate_media(draft)
    payload = json.loads((ROOT / "content/generated.json").read_text())
    key, frog, reserve = game_payload(draft)
    payload["species"][key] = frog
    payload["reserves"][key] = reserve
    text = "window.FROG_GENERATED_CONTENT = " + json.dumps(payload).replace("<", "\\u003c") + ";\n"
    text += "window.FROG_PREVIEW_RESERVE = " + json.dumps(key) + ";\n"
    return Response(text, media_type="application/javascript")


@app.get("/")
@app.get("/author")
def editor():
    return FileResponse(ROOT / "authoring/static/index.html")


@app.get("/bes-frog-id.html")
def game():
    return FileResponse(ROOT / "bes-frog-id.html")


# Selective static mounts: never serve the repository root, .env, draft store or Git.
app.mount("/author/static", StaticFiles(directory=ROOT / "authoring/static"), name="author-static")
for name in ["assets", "css", "js"]:
    app.mount("/" + name, StaticFiles(directory=ROOT / name), name=name)
