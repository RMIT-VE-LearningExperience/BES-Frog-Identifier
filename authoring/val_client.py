"""VAL-only transport. Credentials travel via curl stdin, never process arguments."""
import asyncio
import base64
import json
import os
import mimetypes
from pathlib import Path
from urllib.parse import urlsplit

from pydantic import BaseModel, ConfigDict, Field, ValidationError


class ValError(RuntimeError):
    pass


class Candidate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str = Field(min_length=1, max_length=150)
    scientific_name: str = Field(default="", max_length=150)
    description: str = Field(default="", max_length=6000)
    habitat: str = Field(default="", max_length=3000)
    hints: list[str] = Field(default_factory=list, max_length=10)
    verification_note: str = Field(default="Verify a site-level species record before use.", max_length=3000)


def parse_candidates(message):
    """Accept fenced/prose-wrapped JSON, but never replace a missing answer with guesses."""
    text = message.get("content") or ""
    if not isinstance(text, str):
        raise ValueError("Claude returned non-text content")
    decoder = json.JSONDecoder()
    # raw_decode handles trailing commentary and braces inside quoted JSON text.
    for index, character in enumerate(text):
        if character != "{":
            continue
        try:
            data, _ = decoder.raw_decode(text[index:])
            candidates = data.get("candidates")
            if not isinstance(candidates, list) or not candidates:
                continue
            normalized = [Candidate.model_validate(row).model_dump() for row in candidates[:4]]
            if any(not row["name"].strip() for row in normalized):
                continue
            return {"candidates": normalized, "verified": False}
        except (ValueError, TypeError, AttributeError, ValidationError):
            continue
    raise ValueError("No valid candidate list in Claude's reply")


class ValClient:
    def __init__(self):
        self.base = os.getenv("VAL_BASE_URL", "https://val-npe.rmit.edu.au/api").rstrip("/")
        self.key = os.getenv("VAL_API_KEY", "")
        self.claude = os.getenv("VAL_CLAUDE_MODEL", "au-anthropic-claude-sonnet-5-5")
        self.image_model = os.getenv("VAL_IMAGE_MODEL", "openai-gpt-image-1.5")
        host = urlsplit(self.base)
        if host.scheme != "https" or host.hostname not in {"val-npe.rmit.edu.au", "val.rmit.edu.au", "val-sandbox.rmit.edu.au"}:
            raise ValError("Use an HTTPS RMIT VAL endpoint")
        self.origin = f"{host.scheme}://{host.netloc}"

    async def request(self, url, body=None, binary=False, timeout=240):
        if not self.key:
            raise ValError("Set VAL_API_KEY in authoring/.env and restart the server")
        if urlsplit(url).netloc != urlsplit(self.base).netloc:
            raise ValError("Refusing to send the VAL key to another host")
        config = ["url = " + json.dumps(url), "header = " + json.dumps("Authorization: Bearer " + self.key)]
        if body is not None:
            config += ['header = "Content-Type: application/json"', "data = " + json.dumps(json.dumps(body))]
        process = await asyncio.create_subprocess_exec(
            "/usr/bin/curl", "--config", "-", "--silent", "--show-error", "--max-time", str(timeout),
            "--write-out", "\nHTTP_STATUS:%{http_code}",
            stdin=asyncio.subprocess.PIPE, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await process.communicate(("\n".join(config) + "\n").encode())
        raw, _, code = stdout.rpartition(b"\nHTTP_STATUS:")
        if process.returncode or code != b"200":
            detail = raw.decode(errors="replace")[:1200].replace(self.key, "[redacted]")
            raise ValError(f"VAL returned {code.decode() or 'a connection error'}: {detail or stderr.decode(errors='replace')[:200]}")
        if binary:
            return raw
        try:
            return json.loads(raw)
        except ValueError as exc:
            raise ValError("VAL returned an unexpected response") from exc

    async def suggest(self, location):
        payload = {
            "model": self.claude,
            "messages": [{"role": "user", "content": (
                f"Based solely on your background knowledge, suggest up to 4 plausible frog species for {location}, Victoria, Australia. "
                "Do not call any tools or search chats or knowledge files. This is draft content, not verified occurrence data. "
                'Return ONLY JSON: {"candidates":[{"name":"common name","scientific_name":"scientific name",'
                '"description":"short identification description","habitat":"habitat",'
                '"hints":["visual feature"],"verification_note":"what site-level evidence to check"}]}. '
                "Do not invent URLs or claim a local record is verified. Do not give precise sensitive species coordinates."
            )}],
        }
        for attempt in range(2):
            result = await self.request(self.base + "/chat/completions", payload, timeout=75)
            choices = result.get("choices") or []
            message = choices[0].get("message", {}) if choices else {}
            try:
                return parse_candidates(message)
            except ValueError:
                if attempt:
                    if message.get("tool_calls"):
                        raise ValError("VAL requested its search tools instead of returning candidates, even after retrying. Try again or enter a species manually; no candidate list was generated.")
                    raise ValError("Claude returned an unusable candidate list after retrying. Try again or enter a species manually.")
                payload["messages"].append({"role": "user", "content": (
                    "The previous response could not be used. This client cannot execute search or knowledge tools. "
                    "Complete the offline draft directly, using exactly the requested JSON object and string fields. "
                    "Mark uncertain occurrence information in verification_note. Return no tool calls or additional commentary."
                )})

    async def image(self, prompt: str, references: list[Path]):
        images = ["data:" + (mimetypes.guess_type(p.name)[0] or "image/jpeg") + ";base64," + base64.b64encode(p.read_bytes()).decode() for p in references]
        result = await self.request(self.origin + "/api/v1/images/edit", {
            "model": self.image_model, "image": images[0] if len(images) == 1 else images,
            "prompt": prompt, "size": "1536x1024", "n": 1,
        })
        rows = result if isinstance(result, list) else result.get("data", [])
        if not rows:
            raise ValError("VAL returned no generated image")
        row = rows[0]
        if row.get("b64_json"):
            return base64.b64decode(row["b64_json"])
        url = row.get("url", "")
        if not url.startswith("/api/v1/files/") or ".." in url:
            raise ValError("VAL returned an unsupported image download address")
        return await self.request(self.origin + url, binary=True)
