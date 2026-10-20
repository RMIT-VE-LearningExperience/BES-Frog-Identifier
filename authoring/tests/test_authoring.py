"""Storage, upload, publication and VAL integration boundary checks."""
import io
import json
from pathlib import Path
import tempfile
import time
import unittest
from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient
from PIL import Image

from authoring import server


class AuthoringTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        for folder in ["assets", "content", "js", "data"]:
            (self.root / folder).mkdir()
        (self.root / "content/generated.json").write_text('{"schemaVersion":1,"species":{},"reserves":{}}')
        (self.root / "bes-frog-id.html").write_text('<head></head><script src="js/generated-content.js"></script>')
        self.patch_root = patch.object(server, "ROOT", self.root)
        self.patch_data = patch.object(server, "DATA", self.root / "data")
        self.patch_root.start()
        self.patch_data.start()
        self.client = TestClient(server.app)
        self.client.__enter__()
        self.draft = self.client.post("/api/drafts").json()

    def tearDown(self):
        self.client.__exit__(None, None, None)
        self.patch_data.stop()
        self.patch_root.stop()
        self.temp.cleanup()

    def image(self):
        buffer = io.BytesIO()
        Image.new("RGB", (16, 12), "green").save(buffer, format="PNG")
        return buffer.getvalue()

    def upload_image(self):
        response = self.client.post(f'/api/drafts/{self.draft["id"]}/upload', files={"file": ("field.png", self.image(), "image/png")})
        self.assertEqual(response.status_code, 200)
        return response.json()["path"]

    def save(self):
        return self.client.put(f'/api/drafts/{self.draft["id"]}', json={"draft": self.draft})

    def complete_draft(self):
        media = self.upload_image()
        audio = "assets/test-call.wav"
        (self.root / audio).write_bytes(b"RIFF" + b"\0" * 4 + b"WAVE" + b"\0" * 32)
        self.draft.update({"name": "Test & review reserve", "map_image": media, "sources": ["A verified test record"], "reviewed": True,
            "scenes": [{"id": "pond", "name": "Pond", "photo": media, "map_x": 10, "map_y": 20, "hotspots": [{"id": "reed", "x": 33.3, "y": 88}]}]})
        self.draft["frog"].update({"name": 'Brown <frog> "test"', "scientific_name": "Litoria ewingii", "photo": media,
            "description": "Brown frog", "habitat": "Reed bed", "hints": ["Dark eye stripe"], "call_audio": audio, "audio_credit": "Test audio, authorised"})
        response = self.save()
        self.assertEqual(response.status_code, 200)
        self.draft = response.json()

    def test_save_conflict_and_coordinates(self):
        response = self.save()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.save().status_code, 409)
        self.draft = response.json()
        self.draft["pin_x"] = 101
        self.assertEqual(self.save().status_code, 422)

    def test_reject_unsafe_uploads_and_paths(self):
        self.assertEqual(self.client.post(f'/api/drafts/{self.draft["id"]}/upload', files={"file": ("call.mp3", b"not audio", "audio/mpeg")}).status_code, 422)
        self.assertEqual(self.client.post(f'/api/drafts/{self.draft["id"]}/upload', files={"file": ("image.svg", b"<svg onload='alert(1)'>", "image/svg+xml")}).status_code, 422)
        self.draft["map_image"] = "assets/../../.env"
        self.assertEqual(self.save().status_code, 422)
        self.assertEqual(self.client.get("/authoring/.env").status_code, 404)

    def test_publication_requires_review_then_preserves_media(self):
        path = f'/api/drafts/{self.draft["id"]}/publish'
        self.assertEqual(self.client.post(path).status_code, 422)
        self.complete_draft()
        self.assertEqual(self.client.post(path).status_code, 200)
        published = json.loads((self.root / "content/generated.json").read_text())
        key = "custom-" + self.draft["id"]
        scene = published["reserves"][key]["scenes"][0]
        self.assertEqual(scene["hotspots"][0]["x"], "33.3%")
        self.assertEqual(scene["mapY"], "20.0%")
        self.assertEqual(published["species"][key]["callAudio"], "assets/test-call.wav")
        self.assertNotIn("brown-tree", published["reserves"][key]["quizLabelIds"])
        # Preview contains custom data without needing publication a second time.
        preview = self.client.get(f'/api/drafts/{self.draft["id"]}/preview')
        self.assertEqual(preview.status_code, 200)
        self.assertIn('base href="/"', preview.text)
        self.assertNotIn("VAL_API_KEY", (self.root / "js/generated-content.js").read_text())

    def test_cross_site_requests_are_rejected(self):
        response = self.client.post("/api/drafts", headers={"Origin": "https://unrelated.example"})
        self.assertEqual(response.status_code, 403)
        response = self.client.get("/api/status", headers={"Host": "unrelated.example"})
        self.assertEqual(response.status_code, 403)

    def test_async_generation_runs_and_saves_image(self):
        self.draft["frog"]["name"] = "Test frog"
        self.draft = self.save().json()
        with patch("authoring.server.ValClient.image", new=AsyncMock(return_value=self.image())) as image:
            response = self.client.post(f'/api/drafts/{self.draft["id"]}/generate', json={"target": "frog"})
            self.assertEqual(response.status_code, 200)
            for _ in range(50):
                job = self.client.get('/api/jobs/' + response.json()["job_id"]).json()
                if job["status"] != "running":
                    break
                time.sleep(.02)
            self.assertEqual(job["status"], "complete", job)
            self.assertTrue((self.root / job["result"]["path"]).is_file())
            self.assertEqual(image.await_count, 1)

    def test_audio_upload_and_draft_export(self):
        raw = b"RIFF" + b"\0" * 4 + b"WAVE" + b"\0" * 32
        response = self.client.post(f'/api/drafts/{self.draft["id"]}/upload', files={"file": ("call.wav", raw, "audio/wav")})
        self.assertEqual(response.status_code, 200)
        self.draft["frog"]["call_audio"] = response.json()["path"]
        self.draft = self.save().json()
        response = self.client.get(f'/api/drafts/{self.draft["id"]}/export')
        self.assertEqual(response.status_code, 200)
        import zipfile
        with zipfile.ZipFile(io.BytesIO(response.content)) as archive:
            self.assertIn(self.draft["frog"]["call_audio"], archive.namelist())
            self.assertNotIn(".env", archive.namelist())

    def test_candidates_survive_reopen_and_job_eviction(self):
        result = {"candidates": [{"name": "Test frog"}], "verified": False}
        with patch("authoring.server.ValClient.suggest", new=AsyncMock(return_value=result)):
            response = self.client.post(f'/api/drafts/{self.draft["id"]}/suggest')
            self.assertEqual(response.status_code, 200)
            job_id = response.json()["job_id"]
            for _ in range(50):
                job = self.client.get('/api/jobs/' + job_id).json()
                if job["status"] != "running":
                    break
                time.sleep(.02)
        self.assertEqual(job["status"], "complete")
        # Reopening a draft must recover results without another paid VAL call.
        server.JOBS.pop(job_id)
        reopened = self.client.get(f'/api/drafts/{self.draft["id"]}/suggestions').json()
        self.assertEqual(reopened["result"], result)
        self.draft["name"] = "Another location"
        self.draft = self.save().json()
        self.assertEqual(self.client.get(f'/api/drafts/{self.draft["id"]}/suggestions').json()["status"], "none")

    def test_interrupted_candidate_job_has_actionable_status(self):
        job_id = "b" * 32
        server.atomic_write(server.job_file(job_id), json.dumps({"id": job_id, "status": "running", "kind": "suggest", "location": self.draft["name"]}))
        server.atomic_write(self.root / "data/suggestions" / f'{self.draft["id"]}.json', json.dumps({"job_id": job_id}))
        job = self.client.get(f'/api/drafts/{self.draft["id"]}/suggestions').json()
        self.assertEqual(job["status"], "failed")
        self.assertIn("server restarted", job["error"])


if __name__ == "__main__":
    unittest.main()
