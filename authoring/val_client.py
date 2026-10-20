"""VAL-only transport. Credentials travel via curl stdin, never process arguments."""
import asyncio
import base64
import json
import os
import mimetypes
from pathlib import Path
from urllib.parse import urlsplit


class ValError(RuntimeError):
    pass


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

    async def request(self, url, body=None, binary=False):
        if not self.key:
            raise ValError("Set VAL_API_KEY in authoring/.env and restart the server")
        if urlsplit(url).netloc != urlsplit(self.base).netloc:
            raise ValError("Refusing to send the VAL key to another host")
        config = ["url = " + json.dumps(url), "header = " + json.dumps("Authorization: Bearer " + self.key)]
        if body is not None:
            config += ['header = "Content-Type: application/json"', "data = " + json.dumps(json.dumps(body))]
        process = await asyncio.create_subprocess_exec(
            "/usr/bin/curl", "--config", "-", "--silent", "--show-error", "--max-time", "240",
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
        result = await self.request(self.base + "/chat/completions", {
            "model": self.claude,
            "messages": [{"role": "user", "content": (
                f"Based solely on your background knowledge, suggest up to 4 plausible frog species for {location}, Victoria, Australia. "
                "Do not call any tools or search chats or knowledge files. This is draft content, not verified occurrence data. "
                'Return ONLY JSON: {"candidates":[{"name":"common name","scientific_name":"scientific name",'
                '"description":"short identification description","habitat":"habitat",'
                '"hints":["visual feature"],"verification_note":"what site-level evidence to check"}]}. '
                "Do not invent URLs or claim a local record is verified. Do not give precise sensitive species coordinates."
            )}],
        })
        message = result.get("choices", [{}])[0].get("message", {})
        if message.get("tool_calls"):
            raise ValError("VAL requested its own search tools instead of returning a draft. Enter the species manually, or use VAL's web interface for research.")
        text = (message.get("content") or "").strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1].rsplit("```", 1)[0]
        try:
            data = json.loads(text)
            candidates = data["candidates"]
            if not isinstance(candidates, list) or not candidates:
                raise ValueError()
            for candidate in candidates:
                if not isinstance(candidate, dict) or not isinstance(candidate.get("name"), str):
                    raise ValueError()
            return {"candidates": candidates[:4], "verified": False}
        except (ValueError, KeyError, TypeError) as exc:
            raise ValError("Claude did not return a usable species list. You can still enter species manually.") from exc

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
