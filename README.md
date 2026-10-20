# Frog Explorer

A static frog-identification activity, with a local authoring workspace for adding
Victorian locations, frog species, illustrated maps, habitat scenes, hotspots and
audio. The student activity remains `bes-frog-id.html` and needs no backend.

## Run the authoring workspace

Requires Python 3.11+ and `/usr/bin/curl` (used for the operating system's trusted
certificate store).

```sh
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r authoring/requirements.txt
cp authoring/.env.example authoring/.env
```

Put your VAL key in `authoring/.env`, then run from the repository root:

```sh
python3 -m uvicorn authoring.server:app --host 127.0.0.1 --port 8787
```

Open **http://127.0.0.1:8787/author**. In the existing VAL workspace, the server
can reuse the parent folder's `.env`; an explicit `authoring/.env` or process
environment takes precedence. `FROG_VAL_ENV_FILE` can name a different private
environment file. Never commit credentials.

This is a single-user, loopback-only tool, not a publicly hosted admin service.
Keep the documented `127.0.0.1` binding. It has no remote login or hosted-user
separation. The API key is never sent to the editor or included in exports.

## Author a location

1. **Location:** enter a real reserve name, add source links/notes, and place its
   pin on the overview. Click, drag, use marker arrow keys, or enter percentages.
2. **Frog:** enter a species or ask Claude for candidates. Suggestions are based
   on background knowledge and are explicitly unverified. Check occurrence
   records, scientific names and diagnostic features yourself. Complete the
   species details and generate or upload its illustration.
3. **Reserve map:** generate a watercolour map or upload one. Optionally upload a
   real geography reference you have permission to use; it is sent as the second
   reference image, distinct from the style reference. Click to add scene points.
4. **Scenes & hotspots:** name each scene, generate/upload its habitat image, then
   click to add frog search hotspots. Drag, arrow keys and numeric coordinates
   all use percentages of the full image. The existing game randomly chooses one
   hotspot for the calling frog each visit. Remove a scene or hotspot using its
   labelled control. Scenes use still images; video authoring is not included.
5. **Audio:** upload a frog call and optional ambience per scene. MP3, WAV, OGG
   and M4A are accepted (30 MB maximum). Credit the recordist/source and record
   the licence or permission. The tool does not synthesize animal calls.
6. **Review & publish:** preview the playable draft, review the content and audio
   rights, then publish into the local game. Publication requires the map, frog
   details/image/call, source notes, a review acknowledgement, and images and
   hotspots for every scene. A draft backup ZIP contains its JSON and media;
   it is not a standalone game.

Save drafts explicitly. Switching drafts saves outstanding changes; closing a
tab warns when there is unsaved work or a VAL job. Other tabs cannot silently
overwrite a newer revision. Generation jobs last for the server session; keep
the editor open until the image is applied and saved. A restart cancels pending
jobs. Candidate results and their status are persisted separately from the draft:
reopening or reloading reconnects to an in-progress candidate request, or restores
its completed list. A server restart marks interrupted requests as failed with an
actionable message. A changed location name hides the previous location's list.
Existing image versions stay on disk so regenerating does not destroy them.
At most two VAL jobs execute concurrently, with up to four queued/running jobs.

## How VAL is used

- Claude model: `au-anthropic-claude-sonnet-5-5`, configurable with
  `VAL_CLAUDE_MODEL`.
- Image model: `openai-gpt-image-1.5`, configurable with `VAL_IMAGE_MODEL`.
- Base URL: `https://val-npe.rmit.edu.au/api` (a non-production environment).
- Species suggestions: `/chat/completions`. The request asks for a draft answer
  without tools. Prose-wrapped/fenced JSON is accepted and candidate fields are
  validated. A tool-only or unusable answer gets one offline retry; persistent
  failures are reported and manual entry remains available. No unsupported
  `tool_choice=none` parameter is sent to the Bedrock-backed VAL Claude model.
- Images: `/api/v1/images/edit`, `1536x1024`, using the existing repository
  artwork as style references. Authenticated downloads stay on the same VAL host.
- The VAL image-model listing is stale: despite listing DALL-E models, the
  working backend identifies itself as GPT Image 1.5.

Images are drafts: reference-guided generation does not guarantee species
accuracy or exact cartography. Check frog anatomy and markings, and verify real
geography before describing a map as accurate. Do not treat Claude's candidates
as biological observations or permission to access a site. RMIT's permitted
data categories, client approval and VAL usage limits still apply.

## Storage and publication

| Path | Purpose | In Git? |
| --- | --- | --- |
| `authoring/data/` | Draft documents and session-local work | Ignored |
| `assets/generated/` | Uploaded/generated draft media and generation metadata | Ignored |
| `assets/published/<draft-id>/` | Reviewed, game-used media copied at publication | Track when publishing |
| `content/generated.json` | Published reserve/species data | Yes |
| `js/generated-content.js` | Static browser-ready copy of that data | Yes |
| `authoring/.env` | VAL connection secret | Ignored |

Publication updates the two content files and copies game-used draft media into
`assets/published/`. Private geography-reference uploads are not copied into the
public game. Generated assets include a provenance JSON with the image model,
prompt and reference paths; these files contain no API keys. The original seven
reserves are kept, and custom content is added under stable `custom-…` IDs.
The field guide includes the added species, source notes and call attribution.

Publishing here **does not push, merge or deploy** anything. Review the generated
files and media in Git before committing a content update. To remove a published
reserve, remove its species/reserve entries from both content files and remove
its corresponding `assets/published/` directory in a reviewed change. There is no
destructive delete or automatic deployment action in the authoring UI.

## Checks

```sh
python3 -m unittest discover -s authoring/tests -v
node --check authoring/static/app.js
node --check js/script.js
```

Tests cover draft conflicts and coordinate validation, unsafe upload/path
rejection, cross-site requests, secret-file non-exposure, background image jobs,
audio export, publication requirements and generated game data. Browser checks
also exercise image/audio uploads, scene/hotspot placement, keyboard adjustment,
preview, answering the custom quiz, publication and mobile layout. Live VAL jobs
are manual checks and consume VAL quota; unit tests mock VAL.
