/* ===========================================================
   Frog Explorer — one-loop prototype
   Data-driven per the GDD (Section 4.3): scenes, hotspots, and
   species are config objects, not bespoke per-encounter logic.
   All art/audio below is a placeholder — see documents/.
=========================================================== */

// Content sourced from documents/Australian_Frog_Species_Profiles.docx
// (FrogID, frogid.net.au). Calling-period scale: 0 none, 1 possible, 2 yes,
// 3 peak — see callingClassFor(). Two conservation ratings per species
// (Federal EPBC Act, IUCN Red List) since the source treats them separately
// and they don't always agree — see statusPillClass(). `hint` (quiz-label
// hover text) sourced separately from documents/Frog_ID_Hints.md.
const SPECIES = {
  banjo: {
    id: "banjo", name: "Eastern Banjo Frog", latin: "Limnodynastes dumerilii",
    photo: "../assets/frogs/04-Banjo-Frog.png",
    hint: { visual: "Orange/yellow mottling on the sides.", call: "Single deep “bonk” — the classic banjo-string pluck it's named for." },
    statusFederal: "Unlisted", statusIucn: "Least Concern",
    calling: [2,2,2,2,1,1,1,2,3,3,3,3],
    description: [
      "A large species of frog reaching up to 7.5 cm in body length. It has a brown or grey-brown back, with orange or yellow mottling on the sides. There is a pale or yellow stripe from under the eye to the shoulder. The belly is mottled brown and yellow, and the throat is sometimes yellow.",
      "The pupil is horizontal and the iris is golden-brown. Fingers are unwebbed and toes are one-quarter webbed, both without discs. Research led by the Australian Museum, published in 2024, revealed that coastal NSW populations formerly considered a subspecies (Limnodynastes dumerilii grayi) are in fact a distinct species, Limnodynastes superciliaris."
    ],
    habitat: "Occurs in many different habitats including woodland, heathland, farmland, and even suburban areas."
  },
  "striped-marsh": {
    id: "striped-marsh", name: "Striped Marsh Frog", latin: "Limnodynastes peronii",
    photo: "../assets/frogs/05-Striped-Marsh-Frog.png",
    hint: { visual: "Dark longitudinal stripes on a brown back (not spots).", call: "Single sharp “toc” — like tapping two stones together, repeated at intervals." },
    statusFederal: "Unlisted", statusIucn: "Least Concern",
    calling: [3,3,3,3,2,2,2,2,3,3,3,3],
    description: [
      "A large species of frog reaching up to 7.5 cm in body length. It has a brown back with dark brown longitudinal stripes, and sometimes a cream-coloured or reddish stripe along the middle. There is a pale stripe from under the eye to the top of the arm. The belly is white, and the male has a pale yellow throat with brown mottling.",
      "The pupil is horizontal and the iris is gold. Fingers and toes are unwebbed, both without discs. The male has distinctly larger forearms than the female."
    ],
    habitat: "Occurs in many different habitat types except deserts and alpine areas. It can even occur in suburban and polluted areas."
  },
  "spotted-marsh": {
    id: "spotted-marsh", name: "Spotted Marsh Frog", latin: "Limnodynastes tasmaniensis",
    photo: "../assets/frogs/03-Spotted-Marsh-Frog.png",
    hint: { visual: "Olive-green patches with a pale mid-back stripe, round pupil (not horizontal).", call: "Rapid “uk-uk-uk” notes in the north, or a single short “click” in the south — regional call races." },
    statusFederal: "Unlisted", statusIucn: "Least Concern",
    calling: [2,2,2,2,2,1,2,2,3,3,3,3],
    description: [
      "A medium-sized species of frog reaching up to nearly 5 cm in body length. It has a grey-brown or olive-green back with darker olive-green or brown patches. There is often a pale cream-coloured or red longitudinal stripe along the middle of the back. There is a cream-coloured stripe from under the eye to the top of the arm. The belly is white, and the male has a yellow throat during the breeding season.",
      "The pupil is nearly round and the iris is gold. Fingers are unwebbed and toes are slightly webbed, both without discs. Three vastly different call races exist throughout the range of these frogs, varying by region in pitch and note pattern, with hybrid zones where they meet."
    ],
    habitat: "Occurs near most water bodies surrounded by grassy areas, including in suburban areas and other disturbed habitat."
  },
  "brown-tree": {
    id: "brown-tree", name: "Brown Tree Frog", latin: "Rawlinsonia ewingii",
    photo: "../assets/frogs/02-Brown-Tree-Frog.png",
    hint: { visual: "Dark bifurcated stripe splitting between the eyes.", call: "Rising “weeek” followed by a series of short clicks." },
    statusFederal: "Unlisted", statusIucn: "Least Concern",
    calling: [2,2,2,2,2,3,3,3,3,3,3,2],
    description: [
      "A medium-sized species of frog reaching up to 4.5 cm in body length. It has a cream-coloured, brown, copper or occasionally lime green back, with a wide, darker bifurcated stripe along the middle that starts between the eyes. There is a black or dark brown stripe from the tip of the snout to past the arm. There is often a white stripe from below the eye to the end of the upper lip. The belly is white, and the male often has a darker throat.",
      "The pupil is horizontal, and the iris is gold. The backs of the thighs are typically orange-yellow and unpatterned. The groin region is usually plain and unpatterned. Fingers are unwebbed and toes are moderate-extensively webbed, both with discs wider than the digits. This species was previously known as Litoria ewingii."
    ],
    habitat: "Occurs in forest, heathland, alpine areas, farmland, and even suburban areas."
  },
  bell: {
    id: "bell", name: "Southern Bell Frog", latin: "Ranoidea raniformis",
    photo: "../assets/frogs/01-Southern-Bell-Frog.png",
    callAudio: "../assets/scenes/yalukit-willam-nature-reserve/frog-sound/fr-southern-bell-frog.mp4",
    hint: { visual: "Bright blue groin and thighs, gold eye.", call: "A long, rattling groan — often likened to a distant motorbike revving." },
    statusFederal: "Vulnerable", statusIucn: "Vulnerable",
    calling: [2,2,1,1,0,0,1,2,3,3,3,3], // Jan/Feb/Aug yes, Mar/Apr/Jul possible, May/Jun none, Sep-Dec peak
    description: [
      "A large species of frog that can reach up to 10 cm in body length. It has a green-brown back, with brown or bronze patches, and sometimes a pale longitudinal stripe along the middle. There is also a cream-coloured stripe from behind the eye that widens along the sides, and often a dark brown stripe from the nostril to the eye. The belly is white.",
      "The pupil is horizontal and the iris is gold. The groin and backs of the thighs are bright blue, and sometimes have small, bright yellow patches. Fingers are unwebbed and toes are fully webbed, both with small discs. This species was previously known as Litoria raniformis."
    ],
    habitat: "Occurs in woodland and near large permanent ponds that have emergent reeds and other vegetation, sometimes in suburban areas."
  },
  "baw-baw": {
    id: "baw-baw", name: "Baw Baw Frog", latin: "Philoria frosti",
    photo: "../assets/frogs/06-Baw-Baw-Frog.png",
    hint: { visual: "Dark back with a bold yellow patch over the head/shoulders.", call: "Soft, low pulsing grunt, usually muffled since it calls from under moss/logs." },
    statusFederal: "Critically Endangered", statusIucn: "Critically Endangered",
    calling: [0,0,0,0,0,0,0,0,0,2,3,2],
    description: [
      "A medium-sized species of frog reaching up to 5.5 cm in body length. It has a dark grey, dark brown, or pink-brown back. There is often a large yellow patch covering the head and upper half of the back. The belly is cream-coloured or pale yellow, with brown specks.",
      "The pupil is horizontal, and the iris is dark brown. Fingers and toes are unwebbed, both without discs. The female has large flanges on the first and second finger, which help to whip up protective foam around the eggs as they are laid."
    ],
    habitat: "Occurs in alpine forest and nearby bogs."
  },
  "spotted-tree": {
    id: "spotted-tree", name: "Spotted Tree Frog", latin: "Dryopsophus spenceri",
    photo: "../assets/frogs/07-Spotted-Tree-Frog.png",
    hint: { visual: "Yellow/orange backs of thighs and groin, found only right beside rocky mountain streams.", call: "Soft clicking trill, easy to miss over rushing water." },
    statusFederal: "Critically Endangered", statusIucn: "Critically Endangered",
    calling: [0,0,0,0,0,0,0,0,0,2,2,2],
    description: [
      "A medium-sized species of frog reaching up to 5 cm in body length. It has a brown or green back, with or without brown or olive-green mottling. There is a gold or brown stripe from the tip of the snout to past the arm, becoming spots on the side. There is often a green stripe along the upper lip if the back is brown. The belly is white or yellow.",
      "The pupil is horizontal and the iris is gold. The backs of the thighs and the groin are yellow or orange. Fingers are slightly webbed and toes are fully webbed, both with large discs. This species was previously known as Litoria spenceri."
    ],
    habitat: "Occurs near rocky streams in mountainous areas with wet or dry forest nearby."
  }
};

const FIELD_GUIDE_ORDER = ["banjo","striped-marsh","spotted-marsh","brown-tree","bell","baw-baw","spotted-tree"];

// Only these 4 appear as ID-quiz labels for this prototype's park (bell is correct)
const QUIZ_LABEL_IDS = ["striped-marsh","banjo","bell","brown-tree"];
const TARGET_SPECIES = "bell";

const SCENES = [
  { id: "gum-trees", name: "Elster Creek through the gum trees",
    photo: "../assets/scenes/yalukit-willam-nature-reserve/03-Elster Creek-Still.jpg",
    video: "../assets/scenes/yalukit-willam-nature-reserve/03-ElsterCreek.mp4",
    ambientAudio: "../assets/scenes/yalukit-willam-nature-reserve/bg-sound/03-Au-ElsterCreek.mp3",
    pannable: true,
    mapX: "24%", mapY: "58%",
    hotspots: [{ id: "gt1", x: "23%", y: "62%" }, { id: "gt2", x: "67%", y: "82%" }] },
  { id: "ponds", name: "The northern chain of ponds",
    photo: "../assets/scenes/yalukit-willam-nature-reserve/02-Northern Chain Ponds-Still.jpg",
    video: "../assets/scenes/yalukit-willam-nature-reserve/02-NorthernChain.mp4",
    ambientAudio: "../assets/scenes/yalukit-willam-nature-reserve/bg-sound/02-Au-NorthernChains.mp3",
    pannable: true,
    mapX: "60%", mapY: "28%",
    hotspots: [{ id: "p1", x: "57%", y: "50%" }, { id: "p2", x: "80%", y: "80%" }] },
  { id: "lake", name: "The southern lake",
    photo: "../assets/scenes/yalukit-willam-nature-reserve/01-Southern Lake-Still.jpg",
    video: "../assets/scenes/yalukit-willam-nature-reserve/01-SouthernLake.mp4",
    ambientAudio: "../assets/scenes/yalukit-willam-nature-reserve/bg-sound/01-Au-SouthernLake.mp3",
    pannable: true,
    mapX: "48%", mapY: "68%",
    hotspots: [{ id: "l1", x: "22%", y: "48%" }, { id: "l2", x: "39%", y: "82%" }] }
];

function setPhotoBg(el, url) {
  el.style.backgroundImage = `url('${url}')`;
  el.style.backgroundSize = "cover";
  el.style.backgroundPosition = "center";
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Collapses the months at a given calling-scale level into "Month" /
// "MonthA–MonthB" runs (handles species with more than one separate peak
// block, e.g. Striped Marsh Frog peaks Jan–Apr AND Sep–Dec). Returns null if
// no months are at that level.
function monthRangesText(calling, level) {
  const idxs = [];
  calling.forEach((lvl, i) => { if (lvl === level) idxs.push(i); });
  if (!idxs.length) return null;
  const ranges = [];
  let start = idxs[0], prev = idxs[0];
  for (let k = 1; k < idxs.length; k++) {
    const i = idxs[k];
    if (i === prev + 1) { prev = i; continue; }
    ranges.push([start, prev]);
    start = i; prev = i;
  }
  ranges.push([start, prev]);
  return ranges.map(([a, b]) => a === b ? MONTHS_FULL[a] : `${MONTHS_FULL[a]}–${MONTHS_FULL[b]}`).join(", ");
}

// Print-only text summary of the calling period, replacing the color-coded
// grid there (the on-screen facts page keeps the grid + legend). Falls back
// to the "yes" months when a species has no peak at all (e.g. Spotted Tree
// Frog), so the line is never empty.
function peakPeriodText(sp) {
  const peak = monthRangesText(sp.calling, 3);
  if (peak) return `Peak calling period: ${peak}`;
  const yes = monthRangesText(sp.calling, 2);
  if (yes) return `No peak period; calls possible: ${yes}`;
  return "No peak calling period";
}

// ===================== State =====================
const state = {
  currentSceneIdx: 0,
  targetHotspotKey: null, // "sceneIdx:hotspotId"
  crossedOut: new Set(),
  checkedHotspots: new Set(), // "sceneIdx:hotspotId" already clicked this reserve visit, for the Reserve Map pulse hint
  fieldGuideUnlocked: new Set(),
  discoveredSceneIdx: null, // scene the target was found in, for the success backdrop on a later revisit
  fgIdx: 0,
  audioCtx: null,
  callNodes: null
};

function allHotspotKeys() {
  const keys = [];
  SCENES.forEach((s, si) => s.hotspots.forEach(h => keys.push(`${si}:${h.id}`)));
  return keys;
}

function randomizeTarget(excludeKey) {
  const keys = allHotspotKeys().filter(k => k !== excludeKey);
  state.targetHotspotKey = keys[Math.floor(Math.random() * keys.length)];
}

// ===================== Screen switching =====================
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(`screen-${id}`).classList.add("active");
}

const SCREEN_TRANSITION_MS = { fade: 320, "zoom-fade": 380, "zoom-out": 380 };
let screenTransitionActive = false;

// Animated alternative to showScreen(), used only for Map Overview → Reserve
// Map (zoom-fade) and Reserve Map → a scene (fade) — every other navigation
// keeps using the plain instant showScreen() above. The animation classes
// (see styles.css) layer on top of the existing .active/display toggle
// rather than replacing it, so this doesn't touch how any other screen
// transition in the app works.
function transitionShowScreen(id, type) {
  if (screenTransitionActive) return; // ignore re-entrant calls mid-transition
  const outgoing = document.querySelector(".screen.active");
  const incoming = document.getElementById(`screen-${id}`);
  if (!outgoing || outgoing === incoming) { showScreen(id); return; }

  screenTransitionActive = true;
  const duration = SCREEN_TRANSITION_MS[type];
  outgoing.classList.add(`screen-exit-${type}`);
  setTimeout(() => {
    outgoing.classList.remove("active", `screen-exit-${type}`);
    incoming.classList.add("active");
    void incoming.offsetWidth; // force a reflow so display:block is committed before the enter animation is requested
    incoming.classList.add(`screen-enter-${type}`);
    setTimeout(() => {
      incoming.classList.remove(`screen-enter-${type}`);
      screenTransitionActive = false;
    }, duration);
  }, duration);
}

// ===================== Intro instructions =====================
// Shown on every load (no persistence layer in this prototype, so there's
// no "seen it before" to check) — dismissed only via its own button, not by
// clicking the dimmed backdrop, so the player has to actually acknowledge it.
document.getElementById("intro-start-btn").addEventListener("click", () => {
  document.getElementById("intro-overlay").hidden = true;
});

document.querySelectorAll("[data-goto]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-goto");
    if (target === "fieldguide") {
      const activeScreen = document.querySelector(".screen.active");
      state.returnScreen = activeScreen ? activeScreen.id.replace("screen-", "") : "map";
      openFieldGuide();
    }
    else if (target === "park") { stopCallTone(); stopSceneMedia(); transitionShowScreen("park", "fade"); }
    else if (target === "map") { stopCallTone(); stopSceneMedia(); transitionShowScreen("map", "zoom-out"); }
  });
});

// ===================== Map Overview =====================
document.querySelectorAll(".pin.unlocked").forEach(pin => {
  pin.addEventListener("click", () => enterPark());
});

// Single-reserve, single-frog prototype: "already found this reserve" is
// currently just "already found TARGET_SPECIES", since there's only one
// possible frog and one possible reserve. NOTE: this check will need to
// become per-reserve (not just per-species) once frogs can have overlapping
// habitats across more than one reserve — finding a species in one reserve
// won't necessarily mean *this* reserve's frog has been found.
function enterPark() {
  if (state.fieldGuideUnlocked.has(TARGET_SPECIES)) {
    state.currentSceneIdx = state.discoveredSceneIdx;
    showSuccess();
    return;
  }
  state.crossedOut.clear();
  state.checkedHotspots.clear();
  randomizeTarget(null);
  renderScenePoints();
  transitionShowScreen("park", "zoom-fade");
}

function renderScenePoints() {
  const wrap = document.getElementById("map-points");
  wrap.innerHTML = "";
  SCENES.forEach((scene, idx) => {
    const hasSound = scene.hotspots.some(h => `${idx}:${h.id}` === state.targetHotspotKey);
    const point = document.createElement("div");
    point.className = "map-point" + (hasSound ? " sounding" : "");
    point.style.left = scene.mapX;
    point.style.top = scene.mapY;
    point.innerHTML = `
      <div class="map-point-dot"></div>
      <div class="scene-card">
        <div class="thumb" style="background-image:url('${scene.photo}')"></div>
        <div class="name">${scene.name}</div>
        <div class="sound-flag">${hasSound ? "🔊 a call echoes here…" : ""}</div>
      </div>
    `;
    point.addEventListener("click", () => {
      playFeedbackSound(WALKING_SOUND);
      openScene(idx);
    });
    // The reserve map is drag-pannable, so a point's on-screen position
    // shifts as the user pans — check live position at hover time rather
    // than relying on its static mapY, and flip the popup below the point
    // when there isn't enough room above it to stay on-screen.
    point.addEventListener("mouseenter", () => {
      const dot = point.querySelector(".map-point-dot");
      const card = point.querySelector(".scene-card");
      const neededSpace = card.offsetHeight + 12; // matches the CSS gap above the point
      point.classList.toggle("flip-down", dot.getBoundingClientRect().top < neededSpace);
    });
    wrap.appendChild(point);
  });
}

// Keeps a point overlay locked to an image's actual rendered box (not the
// screen), since the image letterboxes instead of cropping — so a point at
// "40%, 60%" always lands on the same visual spot regardless of window size.
// An optional `isActive` guard skips the sync when a drag-pan controller
// (see below) is driving the same overlay instead.
function lockOverlayToImage(imgId, overlayId, screenId, isActive) {
  const img = document.getElementById(imgId);
  const overlay = document.getElementById(overlayId);
  const screen = document.getElementById(screenId);
  if (!img || !overlay || !screen) return;
  function sync() {
    if (isActive && !isActive()) return;
    const imgRect = img.getBoundingClientRect();
    const screenRect = screen.getBoundingClientRect();
    if (imgRect.width === 0 || imgRect.height === 0) return;
    overlay.style.left = (imgRect.left - screenRect.left) + "px";
    overlay.style.top = (imgRect.top - screenRect.top) + "px";
    overlay.style.width = imgRect.width + "px";
    overlay.style.height = imgRect.height + "px";
  }
  if (window.ResizeObserver) new ResizeObserver(sync).observe(img);
  window.addEventListener("resize", sync);
}

// Lets the player drag-pan an image that's scaled to always cover its
// viewport (never letterboxed). `axis` is "both" or "x" (x locks the
// vertical offset centered, for panorama-style scenes).
//
// The pan is tracked as `anchorX`/`anchorY` — the fraction (0–1) of the
// *image itself* currently sitting at the viewport's center — rather than
// as a raw pixel offset. That fraction is scale-independent, so when the
// viewport resizes and the image rescales to match, re-deriving the pixel
// offset from the same anchor keeps the same part of the image centered
// instead of jumping. (A raw pixel offset carried across a scale change
// silently means something different — that was the bug: resizing changed
// the scale but not what the offset was relative to.)
//
// `panLayerId` (map overview): the image and its points share one
// positioned/transformed layer, so points just use plain CSS % and never
// need JS math to track the image.
// `mirrorId` (scene): the points layer is a separate sibling element (it
// has to be, since a scene can toggle between this drag mode and the
// older static/letterboxed mode using the same DOM) — so instead it's
// given the exact same size and transform as the image, "mirroring" it.
//
// The media element itself isn't fixed at construction time — `activate()`
// takes it — since a scene can swap between an <img> and a <video> using
// the same controller. `naturalSize()` reads whichever properties apply.
function createDragPanController({ wrapId, hintId, axis, panLayerId, mirrorId }) {
  const wrap = document.getElementById(wrapId);
  const hint = hintId ? document.getElementById(hintId) : null;
  const panLayer = panLayerId ? document.getElementById(panLayerId) : null;
  const mirror = mirrorId ? document.getElementById(mirrorId) : null;
  if (!wrap) return null;

  let media = null;
  let active = false;
  let scale = 1, panX = 0, panY = 0;
  let anchorX = 0.5, anchorY = 0.5;
  let dragging = false, lastX = 0, lastY = 0;
  let idleTimer = null;
  const resizeObserver = window.ResizeObserver ? new ResizeObserver(layout) : null;

  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

  function naturalSize() {
    if (!media) return [0, 0];
    return media.tagName === "VIDEO"
      ? [media.videoWidth, media.videoHeight]
      : [media.naturalWidth, media.naturalHeight];
  }

  function render(scaledW, scaledH) {
    const transform = `translate(${panX}px, ${panY}px)`;
    if (panLayer) {
      panLayer.style.width = scaledW + "px";
      panLayer.style.height = scaledH + "px";
      panLayer.style.transform = transform;
    } else {
      media.style.width = scaledW + "px";
      media.style.height = scaledH + "px";
      media.style.transform = transform;
    }
    if (mirror) {
      mirror.style.left = "0px";
      mirror.style.top = "0px";
      mirror.style.width = scaledW + "px";
      mirror.style.height = scaledH + "px";
      mirror.style.transform = transform;
    }
  }

  // Recomputes scale/pan from the scale-independent anchor, then re-derives
  // the anchor from the (possibly edge-clamped) result — this is what keeps
  // a resize from jumping to an unrelated crop of the image.
  function layout() {
    if (!active || !media) return;
    const [natW, natH] = naturalSize();
    const vw = wrap.clientWidth, vh = wrap.clientHeight;
    if (!natW || !natH || !vw || !vh) return;
    scale = Math.max(vw / natW, vh / natH);
    const scaledW = natW * scale, scaledH = natH * scale;
    const minX = vw - scaledW, minY = vh - scaledH;
    panX = clamp(vw / 2 - anchorX * scaledW, minX, 0);
    panY = axis === "x" ? minY / 2 : clamp(vh / 2 - anchorY * scaledH, minY, 0);
    anchorX = (vw / 2 - panX) / scaledW;
    anchorY = (vh / 2 - panY) / scaledH;
    render(scaledW, scaledH);
  }

  function panBy(dx, dy) {
    const [natW, natH] = naturalSize();
    const vw = wrap.clientWidth, vh = wrap.clientHeight;
    const scaledW = natW * scale, scaledH = natH * scale;
    const minX = vw - scaledW, minY = vh - scaledH;
    panX = clamp(panX + dx, minX, 0);
    if (axis !== "x") panY = clamp(panY + dy, minY, 0);
    anchorX = (vw / 2 - panX) / scaledW;
    anchorY = (vh / 2 - panY) / scaledH;
    render(scaledW, scaledH);
  }

  function restartIdleTimer() {
    clearTimeout(idleTimer);
    if (hint) hint.classList.remove("show");
    idleTimer = setTimeout(() => { if (hint) hint.classList.add("show"); }, 3000);
  }

  function onPointerDown(e) {
    if (!active) return;
    // Nested point markers (map pins) handle their own clicks — don't let
    // the background drag swallow a click that started on one of them.
    if (e.target.closest(".pin, .hotspot, .map-point")) return;
    dragging = true;
    wrap.classList.add("dragging");
    lastX = e.clientX; lastY = e.clientY;
    wrap.setPointerCapture(e.pointerId);
    restartIdleTimer();
  }
  function onPointerMove(e) {
    restartIdleTimer();
    if (!active || !dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    panBy(dx, dy);
  }
  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    wrap.classList.remove("dragging");
    try { wrap.releasePointerCapture(e.pointerId); } catch (err) {}
  }

  wrap.addEventListener("pointerdown", onPointerDown);
  wrap.addEventListener("pointermove", onPointerMove);
  wrap.addEventListener("pointerup", onPointerUp);
  wrap.addEventListener("pointercancel", onPointerUp);
  window.addEventListener("resize", layout);

  return {
    // `mediaEl` is the <img> or <video> to drive — passed fresh each time
    // since a scene can switch which element it is.
    activate(mediaEl) {
      media = mediaEl;
      active = true;
      anchorX = anchorY = 0.5; // start centered on the image
      if (resizeObserver) { resizeObserver.disconnect(); resizeObserver.observe(media); }
      // Video dimensions aren't known until metadata loads (unlike an
      // image's naturalWidth, which is ready as soon as it decodes).
      if (media.tagName === "VIDEO" && media.readyState < 1) {
        media.addEventListener("loadedmetadata", layout, { once: true });
      }
      layout();
      restartIdleTimer();
    },
    deactivate() {
      active = false;
      dragging = false;
      clearTimeout(idleTimer);
      wrap.classList.remove("dragging");
      if (hint) hint.classList.remove("show");
      if (resizeObserver) resizeObserver.disconnect();
      if (media) {
        const target = panLayer || media;
        target.style.transform = "";
        if (panLayer) { panLayer.style.width = ""; panLayer.style.height = ""; }
        else { media.style.width = ""; media.style.height = ""; }
      }
      if (mirror) {
        mirror.style.left = ""; mirror.style.top = "";
        mirror.style.width = ""; mirror.style.height = ""; mirror.style.transform = "";
      }
      media = null;
    },
    layout
  };
}

lockOverlayToImage("scene-photo-img", "hotspot-layer", "screen-scene",
  () => !document.getElementById("scene-bg-wrap").classList.contains("pannable"));

const mapPanController = createDragPanController({
  wrapId: "map-bg-wrap", panLayerId: "map-pan-layer",
  hintId: "map-drag-hint", axis: "both"
});
if (mapPanController) mapPanController.activate(document.getElementById("map-photo-img"));

// Small-screen-only off-screen pin indicators (Map Overview). Deliberately
// independent of createDragPanController's internal pan/scale state — reads
// live getBoundingClientRect() on the wrap and each pin instead, so it works
// regardless of how the pan got there (drag, resize, image load). Runs at
// every screen size; the CSS breakpoint (@media min-width:769px) is what
// actually hides it, same pattern as .drag-hint.
function setupOffscreenIndicators() {
  const wrap = document.getElementById("map-bg-wrap");
  const container = document.getElementById("map-offscreen-indicators");
  if (!wrap || !container) return;
  const pins = Array.from(document.querySelectorAll("#screen-map .pin"));
  const EDGE_MARGIN = 24;

  const indicators = pins.map(pin => {
    const el = document.createElement("div");
    el.className = "offscreen-indicator" + (pin.classList.contains("locked") ? " locked" : "");
    el.hidden = true;
    el.innerHTML = '<span class="offscreen-arrow">➤</span>';
    container.appendChild(el);
    return { pin, el, arrow: el.querySelector(".offscreen-arrow") };
  });

  function update() {
    const wrapRect = wrap.getBoundingClientRect();
    if (!wrapRect.width || !wrapRect.height) return;
    const cx = wrapRect.width / 2;
    const cy = wrapRect.height / 2;
    const halfW = Math.max(cx - EDGE_MARGIN, 1);
    const halfH = Math.max(cy - EDGE_MARGIN, 1);

    indicators.forEach(({ pin, el, arrow }) => {
      const pinRect = pin.getBoundingClientRect();
      const px = pinRect.left + pinRect.width / 2 - wrapRect.left;
      const py = pinRect.top + pinRect.height / 2 - wrapRect.top;
      const onScreen = px >= 0 && px <= wrapRect.width && py >= 0 && py <= wrapRect.height;
      if (onScreen) {
        el.hidden = true;
        return;
      }
      el.hidden = false;
      const dx = px - cx;
      const dy = py - cy;
      // Clamp the indicator to the inset rectangle's edge along the
      // center→pin direction, rather than to a circle, so it settles near a
      // corner for a diagonally off-screen pin instead of overshooting past
      // the visible viewport.
      const scale = Math.min(
        Math.abs(dx) > 0.01 ? halfW / Math.abs(dx) : Infinity,
        Math.abs(dy) > 0.01 ? halfH / Math.abs(dy) : Infinity
      );
      el.style.left = (cx + dx * scale) + "px";
      el.style.top = (cy + dy * scale) + "px";
      arrow.style.transform = `rotate(${Math.atan2(dy, dx) * 180 / Math.PI}deg)`;
    });
  }

  // The pan controller's own pointermove handler (attached earlier, above)
  // updates the transform synchronously before this listener runs, so the
  // bounding rects read here are already current for this event.
  wrap.addEventListener("pointermove", update);
  window.addEventListener("resize", update);
  if (window.ResizeObserver) {
    new ResizeObserver(update).observe(document.getElementById("map-photo-img"));
  }
  update();
}
setupOffscreenIndicators();

const parkPanController = createDragPanController({
  wrapId: "park-bg-wrap", panLayerId: "park-pan-layer",
  hintId: "park-drag-hint", axis: "both"
});
if (parkPanController) parkPanController.activate(document.getElementById("park-map-img"));

const scenePanController = createDragPanController({
  wrapId: "scene-bg-wrap", mirrorId: "hotspot-layer",
  hintId: "scene-drag-hint", axis: "x"
});

// Pauses just the current scene's (hidden, muted) video — used when the quiz
// opens: the video isn't visible behind the quiz/success/fail overlays, so
// there's no point letting it keep decoding frames, but the scene's ambient
// audio deliberately keeps playing through those overlays (see stopSceneMedia).
function stopSceneVideo() {
  document.getElementById("scene-video").pause();
}

// Pauses the current scene's video *and* ambient audio — called whenever the
// player leaves the scene (and everything that can overlay it — quiz,
// success, fail, field guide) entirely, back to the reserve or main map.
function stopSceneMedia() {
  stopSceneVideo();
  document.getElementById("scene-ambient-audio").pause();
}

// ===================== Scene =====================
function openScene(idx) {
  state.currentSceneIdx = idx;
  const scene = SCENES[idx];
  document.getElementById("scene-title").textContent = "Yalukit Willam Nature Reserve";
  document.getElementById("scene-subtitle").textContent = scene.name;

  const wrap = document.getElementById("scene-bg-wrap");
  wrap.classList.toggle("pannable", !!scene.pannable);

  const imgEl = document.getElementById("scene-photo-img");
  const videoEl = document.getElementById("scene-video");
  imgEl.classList.toggle("media-hidden", !!scene.video);
  videoEl.classList.toggle("media-hidden", !scene.video);
  if (scene.video) {
    videoEl.poster = scene.photo;
    videoEl.src = scene.video;
    videoEl.currentTime = 0;
    videoEl.play().catch(() => {});
  } else {
    videoEl.pause();
    imgEl.src = scene.photo;
  }
  document.getElementById("scene-backdrop").style.backgroundImage = `url('${scene.photo}')`;

  const ambientAudio = document.getElementById("scene-ambient-audio");
  if (scene.ambientAudio) {
    ambientAudio.src = scene.ambientAudio;
    ambientAudio.currentTime = 0;
    ambientAudio.play().catch(() => {});
  } else {
    ambientAudio.pause();
  }

  if (scene.pannable) scenePanController.activate(scene.video ? videoEl : imgEl);
  else scenePanController.deactivate();

  const layer = document.getElementById("hotspot-layer");
  layer.innerHTML = "";
  const soundingHere = scene.hotspots.some(h => `${idx}:${h.id}` === state.targetHotspotKey);

  scene.hotspots.forEach(h => {
    const key = `${idx}:${h.id}`;
    const isTarget = key === state.targetHotspotKey;
    const el = document.createElement("div");
    el.className = "hotspot" + (isTarget ? " sounding" : "");
    el.style.left = h.x;
    el.style.top = h.y;
    el.innerHTML = '<img src="../assets/buttons/Icon_Eye.png" alt="">';
    el.addEventListener("click", () => onHotspotClick(isTarget, key));
    layer.appendChild(el);
  });
  if (scene.pannable) scenePanController.layout();

  document.getElementById("call-indicator").hidden = !soundingHere;
  document.getElementById("scene-toast").hidden = true;

  if (soundingHere) startCallTone(); else stopCallTone();
  updateSceneMapPulse();

  transitionShowScreen("scene", "fade");
}

// Hints the player toward the Reserve Map once they've checked every point
// in a scene that turns out to have no frog in it — a nudge to try
// somewhere else rather than re-clicking the same two spots.
function updateSceneMapPulse() {
  const scene = SCENES[state.currentSceneIdx];
  const soundingHere = scene.hotspots.some(h => `${state.currentSceneIdx}:${h.id}` === state.targetHotspotKey);
  const allChecked = scene.hotspots.every(h => state.checkedHotspots.has(`${state.currentSceneIdx}:${h.id}`));
  document.getElementById("scene-map-btn").classList.toggle("pulse-hint", !soundingHere && allChecked);
}

function onHotspotClick(isTarget, key) {
  state.checkedHotspots.add(key);
  if (isTarget) {
    stopCallTone();
    // Ambient audio deliberately keeps playing through the quiz and its
    // success/fail result screen (and the Field Guide if opened from
    // either) — all of them still show this scene as their backdrop.
    stopSceneVideo();
    openQuiz();
    return;
  }
  updateSceneMapPulse();
  const toast = document.getElementById("scene-toast");
  toast.textContent = "Nothing here — keep searching (try another point, or another scene).";
  toast.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (toast.hidden = true), 2200);
}

// ===================== Quiz =====================
// Native HTML5 drag-and-drop (dragstart/dragover/drop, used by the label
// elements and #drop-field below) never fires from touch input on mobile
// browsers — draggable/dragstart simply don't trigger for a finger. This is
// a parallel touch-only drag implementation using Pointer Events (the same
// API the map/scene pan controllers already use elsewhere in this file), so
// mouse and pen keep using the native drag path untouched.
function startTouchDrag(e, labelEl, id) {
  if (e.pointerType === "mouse") return;
  e.preventDefault();

  const rect = labelEl.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;

  const ghost = labelEl.cloneNode(true);
  ghost.classList.add("drag-ghost");
  ghost.style.width = rect.width + "px";
  document.body.appendChild(ghost);

  function moveGhost(x, y) {
    ghost.style.left = (x - offsetX) + "px";
    ghost.style.top = (y - offsetY) + "px";
  }
  moveGhost(e.clientX, e.clientY);
  labelEl.classList.add("dragging");
  labelEl.setPointerCapture(e.pointerId);

  const dropField = document.getElementById("drop-field");
  function isOverDropField(x, y) {
    const target = document.elementFromPoint(x, y);
    return !!(target && target.closest("#drop-field"));
  }

  function cleanup() {
    labelEl.removeEventListener("pointermove", onMove);
    labelEl.removeEventListener("pointerup", onUp);
    labelEl.removeEventListener("pointercancel", onCancel);
    try { labelEl.releasePointerCapture(e.pointerId); } catch (err) {}
    labelEl.classList.remove("dragging");
    ghost.remove();
  }
  function onMove(ev) {
    moveGhost(ev.clientX, ev.clientY);
    dropField.dataset.state = isOverDropField(ev.clientX, ev.clientY) ? "over" : "empty";
  }
  function onUp(ev) {
    const dropped = isOverDropField(ev.clientX, ev.clientY);
    cleanup();
    if (dropped) handleGuess(id); else dropField.dataset.state = "empty";
  }
  function onCancel() {
    cleanup();
    dropField.dataset.state = "empty";
  }
  labelEl.addEventListener("pointermove", onMove);
  labelEl.addEventListener("pointerup", onUp);
  labelEl.addEventListener("pointercancel", onCancel);
}

function openQuiz() {
  const quizBg = document.getElementById("quiz-bg");
  quizBg.className = "scene-bg dim";
  setPhotoBg(quizBg, SCENES[state.currentSceneIdx].photo);
  const targetSp = SPECIES[TARGET_SPECIES];
  document.getElementById("quiz-frog-photo").innerHTML = `
    <img src="${targetSp.photo}" alt="${targetSp.name}">
    ${targetSp.callAudio ? `<button class="sound-btn quiz-photo-sound" data-audio="${targetSp.callAudio}" title="Play call">${SOUND_ICON_HTML}</button>` : ""}
  `;
  stopPreviewAudio();

  const dropField = document.getElementById("drop-field");
  dropField.dataset.state = "empty";
  dropField.innerHTML = '<span class="drop-hint">Drag frog name here</span>';

  const row = document.getElementById("label-row");
  row.innerHTML = "";
  QUIZ_LABEL_IDS.forEach(id => {
    const sp = SPECIES[id];
    const el = document.createElement("div");
    const isCrossed = state.crossedOut.has(id);
    el.className = "species-label" + (isCrossed ? " crossed-out" : "");
    el.draggable = !isCrossed;
    el.dataset.id = id;
    el.innerHTML = `${sp.name}<span class="latin">${sp.latin}</span>`;
    el.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", id);
      el.classList.add("dragging");
    });
    el.addEventListener("dragend", () => el.classList.remove("dragging"));
    el.addEventListener("mouseenter", () => showHint(sp.hint, el));
    el.addEventListener("mouseleave", hideHint);
    if (!isCrossed) el.addEventListener("pointerdown", e => startTouchDrag(e, el, id));
    row.appendChild(el);
  });

  dropField.ondragover = e => { e.preventDefault(); dropField.dataset.state = "over"; };
  dropField.ondragleave = () => { dropField.dataset.state = "empty"; };
  dropField.ondrop = e => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    handleGuess(id);
  };

  document.getElementById("buzz-overlay").hidden = true;
  showScreen("quiz");
}

// Cached the first time it's needed. All 4 quiz hint boxes are held to this
// height (see showHint()) so hovering different labels doesn't resize the
// box — measured from the striped marsh frog's actual rendered content
// (the longest of the 4 hints) rather than a guessed pixel value, so it
// stays correct regardless of font/rendering differences.
// Shared by showHint() and the measurement probe below, so the "Hints"
// title can't end up in one and not the other and throw off the measured
// height.
function hintHtml(hint) {
  return `
    <div class="hint-title">Hints</div>
    <div class="hint-line"><strong>Visual:</strong> ${hint.visual}</div>
    <div class="hint-line"><strong>Call:</strong> ${hint.call}</div>
  `;
}

let hintBoxMinHeight = null;
function getHintBoxMinHeight() {
  if (hintBoxMinHeight != null) return hintBoxMinHeight;
  const band = document.querySelector(".quiz-bottom-band");
  const probe = document.getElementById("hint-box").cloneNode(false);
  probe.removeAttribute("id");
  probe.hidden = false;
  probe.style.visibility = "hidden";
  probe.style.minHeight = "";
  probe.innerHTML = hintHtml(SPECIES["striped-marsh"].hint);
  band.appendChild(probe);
  hintBoxMinHeight = probe.offsetHeight;
  probe.remove();
  return hintBoxMinHeight;
}

function showHint(hint, labelEl) {
  const box = document.getElementById("hint-box");
  box.innerHTML = hintHtml(hint);
  box.style.minHeight = getHintBoxMinHeight() + "px";
  // Center the box over whichever label triggered it, measured live (like
  // the reserve-map popup fix) rather than a fixed spot in the band.
  const bandRect = document.querySelector(".quiz-bottom-band").getBoundingClientRect();
  const labelRect = labelEl.getBoundingClientRect();
  box.style.left = (labelRect.left + labelRect.width / 2 - bandRect.left) + "px";
  box.hidden = false;
}
function hideHint() {
  document.getElementById("hint-box").hidden = true;
}

function handleGuess(id) {
  if (id === TARGET_SPECIES) {
    onCorrectGuess();
  } else {
    onWrongGuess(id);
  }
}

const CORRECT_GUESS_SOUND = "../assets/overlays/feedback-sounds/correct answer.mp3";
const INCORRECT_GUESS_SOUND = "../assets/overlays/feedback-sounds/Incorrect Answer.mp3";
const WALKING_SOUND = "../assets/overlays/feedback-sounds/walking.mp3";

// One-shot feedback stings — not looped, plays alongside whatever else is
// already playing (scene ambient, frog-call preview) rather than pausing it.
// Shared by quiz guess results and reserve-map navigation clicks, since the
// two never happen on the same screen at the same time.
function playFeedbackSound(src) {
  const audio = document.getElementById("feedback-audio");
  audio.pause();
  audio.src = src;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function onCorrectGuess() {
  playFeedbackSound(CORRECT_GUESS_SOUND);
  const dropField = document.getElementById("drop-field");
  dropField.dataset.state = "filled";
  dropField.textContent = SPECIES[TARGET_SPECIES].name;
  state.fieldGuideUnlocked.add(TARGET_SPECIES);
  state.discoveredSceneIdx = state.currentSceneIdx;
  updateFoundPins();
  setTimeout(showSuccess, 500);
}

// Turns a reserve's Map Overview pin label green once its frog has been
// found. Same single-reserve/single-frog assumption as enterPark() above —
// revisit alongside that once overlapping habitats are possible.
function updateFoundPins() {
  const pin = document.querySelector('.pin[data-park="yalukit"]');
  if (pin) pin.classList.toggle("found", state.fieldGuideUnlocked.has(TARGET_SPECIES));
}

function onWrongGuess(id) {
  playFeedbackSound(INCORRECT_GUESS_SOUND);
  state.crossedOut.add(id);
  const label = document.querySelector(`.species-label[data-id="${id}"]`);
  if (label) label.classList.add("crossed-out"), (label.draggable = false);
  const buzz = document.getElementById("buzz-overlay");
  buzz.hidden = false;
  setTimeout(() => {
    buzz.hidden = true;
    showFail();
  }, 1400);
}

// ===================== Success / Fail =====================
function showSuccess() {
  stopPreviewAudio();
  const sp = SPECIES[TARGET_SPECIES];
  const successBg = document.getElementById("success-bg");
  successBg.className = "scene-bg dim";
  setPhotoBg(successBg, SCENES[state.currentSceneIdx].photo);
  document.getElementById("success-photo").innerHTML = `<img src="${sp.photo}" alt="${sp.name}">`;
  document.getElementById("success-species").textContent = `${sp.name} (${sp.latin})`;
  document.getElementById("success-text").textContent = `You've found the ${sp.name}!`;
  showScreen("success");
}

document.querySelector('[data-action="return-map"]').addEventListener("click", () => {
  stopCallTone();
  stopSceneMedia();
  showScreen("map");
});

function showFail() {
  stopPreviewAudio();
  const failBg = document.getElementById("fail-bg");
  failBg.className = "scene-bg dim";
  setPhotoBg(failBg, SCENES[state.currentSceneIdx].photo);
  // Deliberately doesn't reveal which species was correct — a wrong guess
  // shouldn't hand the player the answer, since they can keep guessing.
  // Relocate the frog to a different point, preferably a different scene
  const currentKey = state.targetHotspotKey;
  const otherSceneKeys = allHotspotKeys().filter(k => !k.startsWith(`${state.currentSceneIdx}:`));
  const pool = otherSceneKeys.length ? otherSceneKeys : allHotspotKeys().filter(k => k !== currentKey);
  state.targetHotspotKey = pool[Math.floor(Math.random() * pool.length)];
  showScreen("fail");
}

document.querySelector('[data-action="open-park-map"]').addEventListener("click", () => {
  stopSceneMedia();
  renderScenePoints();
  transitionShowScreen("park", "fade");
});

// ===================== Field Guide =====================
function openFieldGuide() {
  state.fgIdx = FIELD_GUIDE_ORDER.indexOf(TARGET_SPECIES);
  renderFieldGuide();

  // Field guide overlays onto whichever screen it was opened from, dimmed —
  // same pattern as the quiz screen's backdrop.
  // Only "map" and "success" are reachable now that the Field Guide button
  // is hidden everywhere else (park/scene) — the "park"/"scene" backdrop
  // cases this used to branch on can no longer happen.
  const fgBg = document.getElementById("fg-bg");
  fgBg.className = "scene-bg dim";
  const bgPhoto = state.returnScreen === "success"
    ? SCENES[state.currentSceneIdx].photo
    : "../assets/scenes/victoria-map-overview.jpg";
  setPhotoBg(fgBg, bgPhoto);

  showScreen("fieldguide");
}
document.querySelector('[data-action="close-fieldguide"]').addEventListener("click", () => {
  stopPreviewAudio();
  showScreen(state.returnScreen || "map");
});

// One-shot audio preview system, shared by every "play this frog's call"
// button (Field Guide facts page, quiz frog photo) — a single <audio>
// element and one delegated click handler rather than duplicating the
// play/stop toggle per screen. Buttons opt in via the shared .sound-btn
// class plus a data-audio URL; only species with a real recording
// (SPECIES[..].callAudio) get a button rendered at all.
const SOUND_ICON_HTML = '<img src="../assets/buttons/Btn_Sound.png" alt="Play call">';
const SOUND_STOP_ICON = "⏹";

function resetSoundButtons() {
  document.querySelectorAll(".sound-btn.playing").forEach(b => {
    b.classList.remove("playing");
    b.innerHTML = SOUND_ICON_HTML;
  });
}

function stopPreviewAudio() {
  const audio = document.getElementById("preview-audio");
  audio.pause();
  audio.currentTime = 0;
  resetSoundButtons();
}

// Delegated on the whole document so it keeps working across re-renders
// (renderFieldGuide(), openQuiz()) regardless of which screen the button is
// on. Plays once as a preview (not looping, unlike the in-scene search cue);
// clicking the same button again while it's playing stops it instead of
// restarting it.
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".sound-btn");
  if (!btn) return;
  const audio = document.getElementById("preview-audio");
  const wasPlayingThis = btn.classList.contains("playing");
  resetSoundButtons();
  if (wasPlayingThis) {
    audio.pause();
    audio.currentTime = 0;
    return;
  }
  audio.src = btn.dataset.audio;
  audio.currentTime = 0;
  audio.play().catch(() => {});
  btn.classList.add("playing");
  btn.textContent = SOUND_STOP_ICON;
});
document.getElementById("preview-audio").addEventListener("ended", resetSoundButtons);
document.querySelector('[data-action="print-fieldguide"]').addEventListener("click", () => {
  // Print isn't just the on-screen 2-frog spread — build every species (in
  // its current locked/unlocked state) as its own full page, one per sheet.
  const printPages = document.getElementById("fg-print-pages");
  printPages.innerHTML = FIELD_GUIDE_ORDER
    .map(id => `<div class="fg-print-page">${fgPageHtml(id)}</div>`)
    .join("");
  window.print();
});
window.addEventListener("afterprint", () => {
  document.getElementById("fg-print-pages").innerHTML = "";
});
document.getElementById("fg-prev").addEventListener("click", () => {
  const total = FIELD_GUIDE_ORDER.length;
  state.fgIdx = (state.fgIdx - 1 + total) % total;
  renderFieldGuide();
});
document.getElementById("fg-next").addEventListener("click", () => {
  const total = FIELD_GUIDE_ORDER.length;
  state.fgIdx = (state.fgIdx + 1) % total;
  renderFieldGuide();
});

// Each species now gets its own two-page spread on screen — facts (photo,
// calling period, conservation status) on the left, the descriptive text
// (species description, habitat) on the right — instead of the previous
// one-page-per-species layout, so a long description no longer needs to
// scroll. Print is unaffected: it still uses fgPageHtml() below to build one
// full page per species, matching the original on-screen layout.
function renderFieldGuide() {
  stopPreviewAudio();
  const id = FIELD_GUIDE_ORDER[state.fgIdx];
  document.getElementById("fg-page-left").innerHTML = fgFactsHtml(id);
  document.getElementById("fg-page-right").innerHTML = fgStoryHtml(id);
  document.getElementById("fg-empty-overlay").hidden = state.fieldGuideUnlocked.size > 0;
}

// Calling-period likelihood scale: 0 none (grey/default), 1 possible
// (orange), 2 yes (yellow), 3 peak (green) — shared by the on-screen facts
// page and the print layout so both interpret SPECIES[..].calling the same way.
function callingClassFor(lvl) {
  return lvl === 3 ? "peak" : lvl === 2 ? "yes" : lvl === 1 ? "possible" : "";
}

// Federal (EPBC Act) and IUCN Red List ratings don't always agree (e.g. a
// species can be Federally "Unlisted" but IUCN "Least Concern"), so both are
// shown rather than picking one. "critical" is a step more alarming than the
// existing "vulnerable" pill styling.
function statusPillClass(status) {
  if (/critically endangered/i.test(status)) return "critical";
  if (/vulnerable/i.test(status)) return "vulnerable";
  return "";
}

function statusRowsHtml(sp) {
  return `
    <div class="status-row">
      <span class="status-caption">Federal (EPBC Act)</span>
      <span class="status-pill ${statusPillClass(sp.statusFederal)}">${sp.statusFederal}</span>
    </div>
    <div class="status-row">
      <span class="status-caption">IUCN Red List</span>
      <span class="status-pill ${statusPillClass(sp.statusIucn)}">${sp.statusIucn}</span>
    </div>
  `;
}

function fgFactsHtml(id) {
  const sp = SPECIES[id];
  const unlocked = state.fieldGuideUnlocked.has(id);
  if (!unlocked) {
    return `
      <div class="fg-locked-photo">?</div>
      <h2 class="fg-name">???</h2>
      <p class="fg-latin">&nbsp;</p>
      <div class="fg-field">
        <div class="fg-field-label">Conservation Status</div>
        <span class="status-pill">???</span>
      </div>
      <div class="fg-field">
        <div class="fg-field-label">Calling Period</div>
        <div class="calling-grid">${MONTHS.map(() => `<div>???</div>`).join("")}</div>
      </div>
    `;
  }
  return `
    <div class="fg-photo"><img src="${sp.photo}" alt="${sp.name}"></div>
    <div class="fg-name-row">
      <h2 class="fg-name">${sp.name}</h2>
      ${sp.callAudio ? `<button class="sound-btn fg-sound-btn" data-audio="${sp.callAudio}" title="Play call">${SOUND_ICON_HTML}</button>` : ""}
    </div>
    <p class="fg-latin">${sp.latin}</p>
    <div class="fg-field">
      <div class="fg-field-label">Conservation Status</div>
      ${statusRowsHtml(sp)}
    </div>
    <div class="fg-field">
      <div class="fg-field-label">Calling Period</div>
      <div class="calling-grid">
        ${MONTHS.map((m, i) => `<div class="${callingClassFor(sp.calling[i])}">${m}</div>`).join("")}
      </div>
      <div class="calling-legend">
        <span class="legend-item"><span class="legend-swatch peak"></span>Peak</span>
        <span class="legend-item"><span class="legend-swatch yes"></span>Yes</span>
        <span class="legend-item"><span class="legend-swatch possible"></span>Possible</span>
        <span class="legend-item"><span class="legend-swatch none"></span>None</span>
      </div>
    </div>
  `;
}

function fgStoryHtml(id) {
  const unlocked = state.fieldGuideUnlocked.has(id);
  if (!unlocked) {
    return `
      <div class="fg-field">
        <div class="fg-field-label">Description</div>
        <div class="locked-lines">
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
      <div class="fg-field">
        <div class="fg-field-label">Habitat</div>
        <p style="opacity:.5">???</p>
      </div>
    `;
  }
  const sp = SPECIES[id];
  return `
    <div class="fg-field">
      <div class="fg-field-label">Description</div>
      ${sp.description.map(p => `<p>${p}</p>`).join("")}
    </div>
    <div class="fg-field">
      <div class="fg-field-label">Habitat</div>
      <p>${sp.habitat}</p>
    </div>
  `;
}

// Print-only: still builds one full page per species (facts + story
// together), unchanged in layout/order from before the on-screen split —
// only the underlying data shape (two conservation ratings, multi-paragraph
// description) was updated here since it reads the same SPECIES fields.
function fgPageHtml(id) {
  if (!id) return "";
  const sp = SPECIES[id];
  const unlocked = state.fieldGuideUnlocked.has(id);
  if (!unlocked) {
    return `
      <div class="fg-locked-photo">?</div>
      <h2 class="fg-name">???</h2>
      <p class="fg-latin">&nbsp;</p>
      <div class="fg-field">
        <div class="fg-field-label">Calling Period</div>
        <p class="calling-period-text">???</p>
      </div>
      <div class="fg-field">
        <div class="fg-field-label">Conservation Status</div>
        <span class="status-pill">???</span>
      </div>
      <div class="fg-field">
        <div class="fg-field-label">Description</div>
        <div class="locked-lines">
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
      <div class="fg-field">
        <div class="fg-field-label">Habitat</div>
        <p style="opacity:.5">???</p>
      </div>
    `;
  }
  return `
    <div class="fg-photo"><img src="${sp.photo}" alt="${sp.name}"></div>
    <h2 class="fg-name">${sp.name}</h2>
    <p class="fg-latin">${sp.latin}</p>
    <div class="fg-field">
      <div class="fg-field-label">Calling Period</div>
      <p class="calling-period-text">${peakPeriodText(sp)}</p>
    </div>
    <div class="fg-field">
      <div class="fg-field-label">Conservation Status</div>
      ${statusRowsHtml(sp)}
    </div>
    <div class="fg-field">
      <div class="fg-field-label">Description</div>
      ${sp.description.map(p => `<p>${p}</p>`).join("")}
    </div>
    <div class="fg-field">
      <div class="fg-field-label">Habitat</div>
      <p>${sp.habitat}</p>
    </div>
  `;
}

// ===================== Frog call (looping search audio) =====================
// Prefers the target species' real call recording (SPECIES[..].callAudio)
// when one has been supplied; falls back to a synthesized placeholder tone
// for species that don't have a recording yet (per the GDD's data-driven
// design, other parks/species can be added before their audio is ready).
function startCallTone() {
  stopCallTone();
  const sp = SPECIES[TARGET_SPECIES];
  if (sp.callAudio) {
    const audio = document.getElementById("frog-call-audio");
    audio.src = sp.callAudio;
    audio.currentTime = 0;
    audio.play().catch(() => {});
    return;
  }
  startSynthTone();
}

function stopCallTone() {
  const audio = document.getElementById("frog-call-audio");
  audio.pause();
  stopSynthTone();
}

function startSynthTone() {
  const ctx = state.audioCtx || (state.audioCtx = new (window.AudioContext || window.webkitAudioContext)());
  if (ctx.state === "suspended") ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.value = 110; // low "crawark"-ish placeholder tone
  gain.gain.value = 0;
  osc.connect(gain).connect(ctx.destination);
  osc.start();

  // Simple repeating croak envelope, ~1.6s period
  let running = true;
  function pulse() {
    if (!running) return;
    const t = ctx.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.08);
    gain.gain.linearRampToValueAtTime(0, t + 0.35);
    setTimeout(() => running && pulse(), 1600);
  }
  pulse();

  state.callNodes = { osc, gain, stop: () => { running = false; osc.stop(); } };
}

function stopSynthTone() {
  if (state.callNodes) {
    try { state.callNodes.stop(); } catch (e) {}
    state.callNodes = null;
  }
}

// ===================== Init =====================
showScreen("map");
