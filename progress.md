Original prompt: Create a branch called "Lawrence - backend generator" using VAL to generate more locations and frogs, add hotspots and upload audio.

Branch: Lawrence-backend-generator (Git does not permit spaces).

Visual thesis: A quiet field-guide workbench, warm paper and forest green, with the map or scene as the main working surface.
Content plan: Reserve library, reserve/species details, image workspace with placement tools, audio and review/publish.
Interaction thesis: Immediate marker placement, keyboard-adjustable coordinates, brief image transitions and clear job progress; respect reduced motion.

Scope: local FastAPI authoring server, server-side VAL integration, persisted drafts and assets, image/reference uploads, interactive scene points/hotspots, audio, review and publication into the static game. No hosting or analytics changes.

Implemented:
- Local authoring server with private VAL key loading, draft revisions, bounded background jobs and selective static serving.
- Claude species candidates (explicitly unverified), reference-guided GPT Image frog/map/habitat generation, uploads, map scene points and keyboard/draggable hotspots.
- Frog call and per-scene ambience uploads, attribution, review validation, playable preview, backup ZIP and local game publication.
- Static custom content loader preserves original reserves and adds published species to the field guide; source/audio notes included.
- Draft media is ignored; publication copies only game-used files into the publishable asset tree, excluding geography reference uploads.

Validation:
- Six backend tests pass (including job execution, publication, uploads and draft conflicts).
- Desktop and 390px mobile browser flow passes with no page errors: create draft, upload images/audio, place/adjust points (including keyboard-only hotspot creation/removal), preview reserve, find hotspot, identify frog, see success, publish and inspect game data.
- Screenshots inspected; fixed a relative CSS loading-image URL exposed by previewing draft assets.
- Live Claude candidate request completed through the new backend. Live habitat image generation completed through the new backend (HTTP 200). An unpublished Edithvale working draft is available locally for review; no real frog-call recording has been uploaded.

Limits:
- Single-user local authoring; no deployment/login system or remote admin service.
- Species suggestions require source verification; generated cartography/anatomy require review.
- Still scene authoring only. No video generation or synthetic animal audio.
- Job state is session-local; keep the editor open and finish/save a generation before restarting.
