"""Regression checks for VAL replies that previously produced no visible candidates."""
import json
import unittest
from unittest.mock import AsyncMock, patch

from authoring.val_client import ValClient, ValError, parse_candidates


CANDIDATE = {
    "name": "Test frog", "scientific_name": "Testus frogus", "description": "Test description",
    "habitat": "Test habitat", "hints": ["Test feature"], "verification_note": "Check a site record",
}


def completion(content="", **message):
    return {"choices": [{"message": {"content": content, **message}}]}


class CandidateReplyTests(unittest.IsolatedAsyncioTestCase):
    def test_wrapped_json_and_verification_flag(self):
        text = 'Here is a draft, not a verified record:\n```json\n' + json.dumps({"candidates": [CANDIDATE], "verified": True}) + '\n```\nCheck the record.'
        parsed = parse_candidates({"content": text})
        self.assertEqual(parsed["candidates"][0]["name"], "Test frog")
        self.assertIs(parsed["verified"], False)

    async def test_tool_only_reply_gets_one_offline_retry(self):
        client = ValClient()
        with patch.object(client, "request", new=AsyncMock(side_effect=[
            completion(tool_calls=[{"function": {"name": "search_chats"}}]),
            completion(json.dumps({"candidates": [CANDIDATE]})),
        ])) as request:
            result = await client.suggest("Test reserve")
        self.assertEqual(len(result["candidates"]), 1)
        self.assertEqual(request.await_count, 2)
        self.assertNotIn("tool_choice", request.await_args.args[1])

    async def test_unusable_replies_fail_without_inventing_candidates(self):
        client = ValClient()
        with patch.object(client, "request", new=AsyncMock(return_value=completion("I cannot answer this."))) as request:
            with self.assertRaisesRegex(ValError, "after retrying"):
                await client.suggest("Test reserve")
        self.assertEqual(request.await_count, 2)

    def test_invalid_candidate_fields_are_rejected(self):
        with self.assertRaises(ValueError):
            parse_candidates({"content": json.dumps({"candidates": [{"name": "Test frog", "hints": "not a list"}]})})
