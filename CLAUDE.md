# BES Frog Identifier (Frog Explorer)

Browser-based 2D point-and-click frog identification game for RMIT students. Players pick a reserve on a Victoria map, find a calling frog in a looping video scene, then identify the species by sound and visual hints. Correct IDs unlock Field Guide entries. Seven reserves and seven species, all wired in.

## Layout
- `bes-frog-id.html` (repo root, so the Pages URL is `/BES-Frog-Identifier/bes-frog-id.html`), `css/styles.css`, `js/script.js`: the whole game, plain HTML/CSS/JS with no build step. Open the HTML file directly, or serve the folder statically. Asset paths in the HTML and `script.js` are relative to the HTML (`assets/...`); paths in the CSS are relative to `css/` (`../assets/...`).
- `assets/`: images, per-reserve scene videos and ambient audio, buttons, overlays. Already compressed; keep new assets in the same formats (JPEG for photos and maps, PNG only where alpha is needed, MP3/AAC audio, MP4 video).
- `documents/`: **gitignored and not in this repo** (the repo is public). It holds the source material and is only on the author's machine.

## Local-only context (not in the repo)
These files are not available in a web session unless the user attaches them:
- `documents/Progress_Log.md`: the full history of decisions, verification status and open items. If the user attaches it, read the "Known gaps / open items" section at the end first.
- `documents/Frog_Game_GDD.md`: the game design document (core loop, scope).
- `documents/*.docx` and `*_Hotspots.png`: species profiles, hints, references, and the hotspot position reference images that `script.js` data was built from.

If one of these is needed and not attached, ask the user for it. Do not guess species facts or hotspot coordinates.

## Conventions and gotchas
- Accessibility is a priority: keyboard-operable quiz, modal/focus management, `prefers-reduced-motion`, WCAG 1.4.13 hover/focus content. Do not regress these when changing UI.
- The game is used on phones as well as desktop; check changes at phone width.
- Google Analytics 4 is live (ID in the HTML). Events: `page_view`, `game_start`, `game_complete`. Do not add tracking or new events without asking.
- Each scene's video and audio are separate looping elements of the same length. They are not muxed.
- Hotspot reference docs have often had panel order that does not match the real asset filenames. Verify against the asset files before wiring in positions.
- The user declined runtime-randomised quiz distractors; each reserve's distractors are fixed in its data.
- Browser, screen-reader and physical-touch testing have been limited. Say plainly when something was only checked by reading the code.
