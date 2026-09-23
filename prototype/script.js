/* ===========================================================
   Frog Explorer — prototype
   Data-driven per the GDD (Section 4.3): reserves, scenes,
   hotspots, and species are config objects, not bespoke
   per-encounter logic — see RESERVES below.
=========================================================== */

// Calling-period months and conservation status sourced from
// documents/Australian_Frog_Species_Profiles.docx (FrogID, frogid.net.au).
// Calling-period scale: 0 none, 1 possible, 2 yes, 3 peak — see
// callingClassFor(). Two conservation ratings per species (Federal EPBC Act,
// IUCN Red List) since the source treats them separately and they don't
// always agree — see statusPillClass(). `description`/`habitat`/`hint` (an
// array of quiz-label hover bullets, visual ID cues only — this source
// doesn't cover calls) replaced 2026-09-14 with the updated text from
// documents/Frog hints and descriptions.docx, superseding the prior
// Australian_Frog_Species_Profiles.docx description/habitat text and the
// now-deleted documents/Frog_ID_Hints.md (outdated, no longer used).
const SPECIES = {
  banjo: {
    id: "banjo", name: "Eastern Banjo Frog", latin: "Limnodynastes dumerilii",
    photo: "../assets/frogs/04-Banjo-Frog-square.jpg",
    // Wide "full image" crop (1820×1024, vs. the 1024×1024 square above) —
    // added 2026-09-18 for the Field Guide only; quiz/success keep the
    // square .photo, unchanged.
    photoFull: "../assets/frogs/04-Banjo-Frog.jpg",
    // The Jawbone Nature Conservation Reserve's target species — added when
    // wiring in that reserve. Path convention matches SPECIES.bell/.striped-marsh's
    // callAudio (frog-sound folder under that reserve's own scenes/ subfolder).
    callAudio: "../assets/scenes/jawbone-nature-conservation-reserve/jawbone-frog-sound/fr-banjo-frog-Jodi Rowley.mp4",
    hint: [
      "Brown or grey-brown back with mottling along the sides",
      "Pale or yellow stripe running from below the eye to the shoulder",
      "Golden-brown iris with a horizontal pupil"
    ],
    statusFederal: "Unlisted", statusIucn: "Least Concern",
    calling: [2,2,2,2,1,1,1,2,3,3,3,3],
    description: [
      "A large frog species that can reach 7.5 cm in body length. It has a brown to grey-brown back with distinctive mottling along the sides. A pale or yellow stripe extends from beneath the eye to the shoulder. Its eyes have horizontal pupils and golden-brown irises. The fingers are unwebbed, while the toes are only one-quarter webbed, and neither has enlarged discs.",
      "Research led by the Australian Museum and published in 2024 found that coastal New South Wales populations previously classified as the subspecies Limnodynastes dumerilii grayi are actually a separate species, Limnodynastes superciliaris. Recordings contributed through FrogID played a key role in this discovery."
    ],
    habitat: "Occupies a broad range of habitats, from natural landscapes such as woodland and heathland to agricultural and urban environments."
  },
  "striped-marsh": {
    id: "striped-marsh", name: "Striped Marsh Frog", latin: "Limnodynastes peronii",
    photo: "../assets/frogs/05-Striped-Marsh-Frog-square.jpg",
    photoFull: "../assets/frogs/05-Striped-Marsh-Frog.jpg",
    // The Rosanna Golf Club's target species — added 2026-09-18 wiring in
    // that reserve. Path convention matches SPECIES.bell.callAudio below
    // (frog-sound folder under that reserve's own scenes/ subfolder).
    callAudio: "../assets/scenes/rosanna-golf-course/rosanna-frog-sound/fr-striped-marsh-frog-Dani Kowalski.mp4",
    hint: [
      "Brown back with dark longitudinal stripes, sometimes with a cream or reddish stripe along the middle",
      "White belly and pale stripe running from below the eye to the arm",
      "Gold iris with a horizontal pupil; fingers and toes unwebbed"
    ],
    statusFederal: "Unlisted", statusIucn: "Least Concern",
    calling: [3,3,3,3,2,2,2,2,3,3,3,3],
    description: [
      "A large frog species that can grow to 7.5 cm in body length. Its back is typically brown, featuring dark brown stripes that run lengthwise along the body, and some individuals have a cream or reddish stripe down the centre of the back. A pale stripe extends from beneath the eye to the upper part of the arm. The underside is white, while males have a pale yellow throat marked with brown mottling. The eyes are characterised by horizontal pupils and gold-coloured irises. Both the fingers and toes are unwebbed and lack enlarged discs. Males can also be distinguished by their noticeably larger forearms compared with females."
    ],
    habitat: "Found in a wide variety of habitats, excluding deserts and alpine regions. It is also capable of living in suburban environments and areas affected by pollution."
  },
  "spotted-marsh": {
    id: "spotted-marsh", name: "Spotted Marsh Frog", latin: "Limnodynastes tasmaniensis",
    photo: "../assets/frogs/03-Spotted-Marsh-Frog-square.jpg",
    photoFull: "../assets/frogs/03-Spotted-Marsh-Frog.jpg",
    // Newport Lakes Reserve's target species — added when wiring in that
    // reserve. Path convention matches the other reserves' callAudio fields.
    callAudio: "../assets/scenes/newport-lakes-reserve/newport-frog-sound/fr-spotted-marsh-frog-Jodi Rowley.mp4",
    hint: [
      "Grey-brown or olive-green back with darker patches and often a pale stripe down the middle",
      "Cream stripe running from below the eye to the upper arm",
      "Gold iris with a nearly round pupil"
    ],
    statusFederal: "Unlisted", statusIucn: "Least Concern",
    calling: [2,2,2,2,2,1,2,2,3,3,3,3],
    description: [
      "A medium-sized frog that grows to almost 5 cm in body length. Its back is typically grey-brown or olive-green and patterned with darker olive-green or brown markings. Many individuals display a pale cream or reddish stripe running down the centre of the back. A cream-coloured stripe extends from beneath the eye to the upper arm. The underside is white, and males develop a yellow throat during the breeding season. The eyes have a gold iris and a pupil that is nearly round. The fingers are unwebbed and the toes are slightly webbed, with neither having enlarged discs.",
      "This species is notable for having three distinct call races across its range. In northern New South Wales, Queensland, and northern Victoria, the call consists of three to four rapid, high-pitched \"uk-uk-uk\" notes. In southern Victoria and Tasmania, the call is a short \"click\". In south-eastern South Australia, both call types occur. Frogs at the northern end of the Coorong produce a lower-pitched call of four to five \"uk-uk-uk-uk\" notes, similar to the northern form. Areas where these different call types interbreed occur in central Victoria and west of the Murray River in South Australia."
    ],
    habitat: "Usually found around ponds, wetlands, dams, and other water bodies surrounded by grassy vegetation, including suburban and disturbed environments."
  },
  "brown-tree": {
    id: "brown-tree", name: "Brown Tree Frog", latin: "Rawlinsonia ewingii",
    photo: "../assets/frogs/02-Brown-Tree-Frog-square.jpg",
    photoFull: "../assets/frogs/02-Brown-Tree-Frog.jpg",
    // Trin Warren Tam-Boore Bellbird Waterhole's target species — added when
    // wiring in that reserve. Path convention matches the other reserves'
    // callAudio fields (frog-sound folder under that reserve's own scenes/
    // subfolder).
    callAudio: "../assets/scenes/trin-warren-tam-boore-bellbird-waterhole/trin-frog-sound/fr-brown-tree-frog-Murray Littlejohn.mp4",
    hint: [
      "Cream, brown, copper or sometimes lime-green back",
      "Dark stripe running from the tip of the snout past the arm",
      "Gold iris with a horizontal pupil",
      "Unwebbed fingers and moderately to extensively webbed toes with large discs"
    ],
    statusFederal: "Unlisted", statusIucn: "Least Concern",
    calling: [2,2,2,2,2,3,3,3,3,3,3,2],
    description: [
      "A medium-sized frog that can reach 4.5 cm in body length. Its back varies in colour from cream, brown, or copper to, less commonly, lime green, and is marked by a broad, darker stripe running down the centre, beginning between the eyes. A black or dark brown stripe extends from the tip of the snout past the forelimb, and many individuals also have a white stripe running from beneath the eye to the end of the upper lip. The underside is white, while males often develop a darker-coloured throat. The eyes have gold irises with horizontal pupils. The groin area is typically plain and lacks any distinct markings or patterns. Its fingers are unwebbed, while the toes are moderately to extensively webbed, and both fingers and toes end in discs that are wider than the digits themselves."
    ],
    habitat: "This species occurs across a wide range of habitats, including forests, heathlands, alpine environments, agricultural land, and suburban areas. Its adaptability allows it to thrive in both natural and human-modified landscapes."
  },
  bell: {
    id: "bell", name: "Southern Bell Frog", latin: "Litoria raniformis",
    photo: "../assets/frogs/01-Southern-Bell-Frog-square.jpg",
    photoFull: "../assets/frogs/01-Southern-Bell-Frog.jpg",
    callAudio: "../assets/scenes/yalukit-willam-nature-reserve/frog-sound/fr-southern-bell-frog.mp4",
    hint: [
      "Green back with brown patches and a pale longitudinal stripe along the middle",
      "White belly",
      "Horizontal pupil with gold iris"
    ],
    statusFederal: "Vulnerable", statusIucn: "Vulnerable",
    calling: [2,2,1,1,0,0,1,2,3,3,3,3], // Jan/Feb/Aug yes, Mar/Apr/Jul possible, May/Jun none, Sep-Dec peak
    description: [
      "A large frog that can grow to 10 cm long, this species is recognised by its greenish-brown upper body, which is typically marked with brown or bronze blotches. Some individuals also have a pale stripe running down the centre of the back. A cream stripe begins behind the eye and expands along the sides of the body, while a dark brown stripe is often visible between the nostril and the eye. The underside is white, and the eyes feature gold irises with horizontal pupils. Its fingers lack webbing, whereas the toes are fully webbed, and both fingers and toes have small disc-shaped tips. Following a June 2025 taxonomic review of Australian treefrogs, this species was proposed for reclassification into the genus Ranoidea, with the suggested scientific name Ranoidea raniformis."
    ],
    habitat: "This species is found in woodland habitats and around large, permanent ponds with emergent reeds and other aquatic vegetation. It may also occur in suburban environments, particularly where suitable wetland habitat is available."
  },
  "baw-baw": {
    id: "baw-baw", name: "Baw Baw Frog", latin: "Philoria frosti",
    photo: "../assets/frogs/06-Baw-Baw-Frog-square.jpg",
    photoFull: "../assets/frogs/06-Baw-Baw-Frog.jpg",
    // Baw Baw National Park's target species — added when wiring in that
    // reserve. Path convention matches the other reserves' callAudio fields.
    callAudio: "../assets/scenes/baw-baw-national-park/baw-baw-frog-sound/fr-bawbaw-frog-Deon Gilbert.mp4",
    hint: [
      "Dark grey, dark brown, or pink-brown back",
      "Cream or pale-yellow belly with brown speckling",
      "Dark brown iris with a horizontal pupil"
    ],
    statusFederal: "Critically Endangered", statusIucn: "Critically Endangered",
    calling: [0,0,0,0,0,0,0,0,0,2,3,2],
    description: [
      "A medium-sized frog that can grow to 5.5 cm in body length. Its back is typically dark grey, dark brown, or pinkish-brown, and many individuals have a large yellow patch covering the head and upper portion of the back. The underside is cream to pale yellow and marked with fine brown speckling. The eyes feature horizontal pupils and dark brown irises. Both the fingers and toes are unwebbed and lack enlarged discs. Females are distinguished by large flanges on the first and second fingers, which are used to whip protective foam around the eggs during laying.",
      "This species is found only on the Mt Baw Baw Plateau east of Melbourne, Victoria. It has suffered a dramatic decline due to amphibian chytrid fungus, with populations decreasing by approximately 98% since 1985. A captive breeding program has been established to help safeguard the species from extinction."
    ],
    habitat: "Occurs in alpine forests and adjacent bog habitats on the Mt Baw Baw Plateau."
  },
  "spotted-tree": {
    id: "spotted-tree", name: "Spotted Tree Frog", latin: "Dryopsophus spenceri",
    photo: "../assets/frogs/07-Spotted-Tree-Frog-square.jpg",
    photoFull: "../assets/frogs/07-Spotted-Tree-Frog.jpg",
    // Enoch Falls' target species — added when wiring in that reserve.
    callAudio: "../assets/scenes/enoch-falls/enoch-frog-sound/fr-spotted-tree-frog-Nathan Litjens.mp4",
    hint: [
      "Brown or green back, sometimes mottled, with a gold or brown stripe running from the snout past the arm",
      "Yellow or orange groin and backs of the thighs",
      "Gold iris with a horizontal pupil; large discs on fingers and toes"
    ],
    statusFederal: "Critically Endangered", statusIucn: "Critically Endangered",
    calling: [0,0,0,0,0,0,0,0,0,2,2,2],
    description: [
      "A medium-sized frog that grows to around 5 cm in body length. Its back may be brown or green, sometimes plain and sometimes marked with brown or olive-green mottling. A distinctive gold or brown stripe runs from the tip of the snout past the forelimb, breaking into spots along the sides of the body. Individuals with a brown back often have a green stripe along the upper lip. The underside is white to yellow. The eyes have horizontal pupils and gold-coloured irises. The groin and backs of the thighs are yellow or orange. The fingers are slightly webbed and the toes are fully webbed, with both ending in large discs.",
      "This species was formerly known as Litoria spenceri."
    ],
    habitat: "Occurs near rocky creek systems in mountainous areas, with surrounding wet or dry forest habitat."
  }
};

const FIELD_GUIDE_ORDER = ["banjo","striped-marsh","spotted-marsh","brown-tree","bell","baw-baw","spotted-tree"];

// One extra "page" appended after the last species — the field guide's own
// References entry (see fgReferencesFactsHtml()/fgReferencesStoryHtml()/
// fgReferencesPageHtml() below). Deliberately a separate list rather than
// pushed into FIELD_GUIDE_ORDER itself, since that array is also used for
// the quiz/unlock logic elsewhere and "references" isn't a species.
const FIELD_GUIDE_PAGES = [...FIELD_GUIDE_ORDER, "references"];

// The set of pages actually reachable right now — References is skipped
// entirely (not just shown locked). Originally gated on "at least one
// species found" (2026-09-18); tightened 2026-09-21 to "every species
// found" per the user's explicit choice — References stays unreachable
// until all 7 species in FIELD_GUIDE_ORDER are discovered, which in
// practice means it can't unlock at all until Enoch Falls (the only source
// of the Spotted Tree Frog) is wired in as a 7th reserve. This threshold
// deliberately no longer matches the empty-state overlay's own condition
// (state.fieldGuideUnlocked.size > 0, unchanged — that overlay is about
// whether the guide has *anything* populated yet, a separate concern from
// whether References specifically should be reachable). Used everywhere
// FIELD_GUIDE_PAGES previously drove what's actually navigable/printable/
// rendered (the desktop Next/Prev cycle, the mobile sheet stack, print,
// and every page-number label) — species indices are stable either way,
// since References only ever sits at the end of the full array.
function visibleFieldGuidePages() {
  return state.fieldGuideUnlocked.size === FIELD_GUIDE_ORDER.length ? FIELD_GUIDE_PAGES : FIELD_GUIDE_ORDER;
}

// Sourced from documents/FrogID-References.docx, supplied by the user.
const FIELD_GUIDE_REFERENCES = {
  species: [
    { id: "banjo", citation: "Australian Museum (n.d.) Limnodynastes dumerilii, FrogID website, accessed 27 August 2026.", url: "https://www.frogid.net.au/frogs/limnodynastes-dumerilii/" },
    { id: "striped-marsh", citation: "Australian Museum (n.d.) Limnodynastes peronii, FrogID website, accessed 27 August 2026.", url: "https://www.frogid.net.au/frogs/limnodynastes-peronii/" },
    { id: "spotted-marsh", citation: "Australian Museum (n.d.) Limnodynastes tasmaniensis, FrogID website, accessed 27 August 2026.", url: "https://www.frogid.net.au/frogs/limnodynastes-tasmaniensis/" },
    { id: "brown-tree", citation: "Australian Museum (n.d.) Litoria ewingii, FrogID website, accessed 27 August 2026.", url: "https://www.frogid.net.au/frogs/litoria-ewingii/" },
    { id: "bell", citation: "Australian Museum (n.d.) Litoria raniformis, FrogID website, accessed 27 August 2026.", url: "https://www.frogid.net.au/frogs/litoria-raniformis/" },
    { id: "baw-baw", citation: "Australian Museum (n.d.) Philoria frosti, FrogID website, accessed 27 August 2026.", url: "https://www.frogid.net.au/frogs/philoria-frosti/" },
    { id: "spotted-tree", citation: "Australian Museum (n.d.) Litoria spenceri, FrogID website, accessed 27 August 2026.", url: "https://www.frogid.net.au/frogs/litoria-spenceri/" }
  ],
  assetGeneration: [
    { citation: "RMIT (2026). Val Open AI Chat GPT 5.1 [Large language model], accessed 10 June 2026.", url: "https://val.rmit.edu.au/" },
    { citation: "OpenAI (2026). ChatGPT-5.6 Sol [Large language model].", url: "https://chatgpt.com/" },
    { citation: "Google Flow (2026). Veo 3.1 - Fast.", url: "https://labs.google/fx/tools/flow" }
  ],
  audioSources: [
    { citation: "Envato Elements (2026). Sound Effects.", url: "https://app.envato.com/sound-effects" }
  ]
};

// ===================== Reserves =====================
// One entry per playable reserve — each holds everything that used to be
// single global constants (SCENES/TARGET_SPECIES/QUIZ_LABEL_IDS) before
// wiring in a second reserve (The Rosanna Golf Club) made those genuinely
// ambiguous. entering a reserve (enterPark(reserveId)) copies the relevant
// fields onto `state` (state.scenes/state.targetSpecies/state.quizLabelIds/
// state.currentReserveId) — everything downstream (openScene(), openQuiz(),
// allHotspotKeys(), etc.) reads those state fields instead of a bare global,
// so scene indices/hotspot keys/target-relocation pools are automatically
// scoped to whichever reserve is actually active and can't cross over into
// the other reserve's scenes.
const RESERVES = {
  yalukit: {
    id: "yalukit",
    name: "Yalukit Willam Nature Reserve",
    mapImage: "../assets/scenes/yalukit-willam-nature-reserve/Yalukit Willam Nature Reserve Map.jpg",
    mapAlt: "Illustrated aerial map of Yalukit Willam Nature Reserve, showing a chain of ponds and wetlands connected by walking paths and bordered by scattered trees. A sports oval sits to the northwest of the reserve, and a residential street grid borders it to the east.",
    // Only these 4 appear as ID-quiz labels for this reserve (bell is correct)
    quizLabelIds: ["striped-marsh","banjo","bell","brown-tree"],
    targetSpecies: "bell",
    scenes: [
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
    ]
  },
  // Wired in 2026-09-18. Target species/quiz labels confirmed with the user;
  // scene names, map alt text, and every mapX/mapY/hotspot x/y position
  // below are read directly off documents/Rosanna_Golf_Hotspots.png (the
  // user-supplied reference image marking exactly where each scene sits on
  // the reserve map and where its 2 search hotspots sit within the scene
  // still) — detected programmatically by marker color/shape (same method
  // used for the Map Overview pins on 2026-08-25) rather than eyeballed, so
  // these should already be accurate; still worth a look in-browser since
  // it's the first time this reserve's ever been rendered at all.
  rosanna: {
    id: "rosanna",
    name: "The Rosanna Golf Club",
    mapImage: "../assets/scenes/rosanna-golf-course/Rosanna Golf Course Reserve Map.jpg",
    mapAlt: "Illustrated aerial map of The Rosanna Golf Club, showing golf fairways and sand bunkers across the course, a tree-lined creek (the Plenty River) running diagonally through the middle of the course from the northeast down to the southwest, and a clubhouse with a car park on the eastern edge.",
    quizLabelIds: ["striped-marsh","spotted-marsh","banjo","bell"],
    targetSpecies: "striped-marsh",
    scenes: [
      { id: "riverbend", name: "A quiet bend in the river",
        photo: "../assets/scenes/rosanna-golf-course/01-rosanna-quiet-riverbend-still.jpg",
        video: "../assets/scenes/rosanna-golf-course/01-rosanna-quiet-riverbend.mp4",
        ambientAudio: "../assets/scenes/rosanna-golf-course/rosanna-bg-sound/01-Au-rosanna-quiet-riverbend.mp3",
        pannable: true,
        mapX: "66.3%", mapY: "20.2%",
        hotspots: [{ id: "rb1", x: "13.1%", y: "78.3%" }, { id: "rb2", x: "69.4%", y: "61.7%" }] },
      { id: "pond", name: "A small pond fed by the river",
        photo: "../assets/scenes/rosanna-golf-course/03-rosanna-small-pond-fed-by-the-river-still.jpg",
        video: "../assets/scenes/rosanna-golf-course/03-rosanna-small-pond-fed-by-the-river.mp4",
        ambientAudio: "../assets/scenes/rosanna-golf-course/rosanna-bg-sound/03-Au-rosanna-small-pond-fed-by-the-river.mp3",
        pannable: true,
        // mapX/mapY swapped with "plenty-river" 2026-09-22, per the user's
        // request — the reserve map's dot positions themselves are
        // unchanged; this just swaps which scene each of the two existing
        // dots opens. Scene-local hotspot x/y are untouched (still this
        // scene's own search points).
        mapX: "40.1%", mapY: "85.5%",
        hotspots: [{ id: "pd1", x: "15.0%", y: "52.5%" }, { id: "pd2", x: "82.5%", y: "55.8%" }] },
      { id: "plenty-river", name: "The Plenty River",
        photo: "../assets/scenes/rosanna-golf-course/02-rosanna-Plenty-River-still.jpg",
        video: "../assets/scenes/rosanna-golf-course/02-rosanna-Plenty-River.mp4",
        ambientAudio: "../assets/scenes/rosanna-golf-course/rosanna-bg-sound/02-Au-rosanna-Plenty-River.mp3",
        pannable: true,
        // mapX/mapY swapped with "pond" — see comment above.
        mapX: "64.2%", mapY: "54.9%",
        hotspots: [{ id: "pr1", x: "63.8%", y: "53.3%" }, { id: "pr2", x: "26.3%", y: "73.3%" }] }
    ]
  },
  // Wired in following the Rosanna pattern. Target species (Eastern Banjo
  // Frog) inferred from the one new frog-call recording supplied
  // (jawbone-frog-sound/); quiz distractors confirmed with the user.
  // quizLabelIds' 3rd slot changed from "spotted-marsh" to "baw-baw"
  // 2026-09-21 (cont'd) — a full-reserve audit found this reserve's 4-species
  // quiz set was byte-for-byte identical to Rosanna's (banjo/bell/
  // spotted-marsh/striped-marsh, just a different one marked correct each
  // time). Fixed by swapping in Baw Baw Frog, per the user's direction to
  // draw replacements from species whose own reserves aren't wired in yet
  // (spotted-marsh/baw-baw/spotted-tree — the 3 species never yet used as
  // any reserve's target) rather than reshuffling among the same 4 species
  // every reserve keeps reusing. Baw Baw Frog specifically chosen over
  // Spotted Tree Frog since the latter had already appeared once (Trin
  // Warren's distractors) — this keeps every quiz distractor pool feeling
  // fresh rather than re-picking from an already-touched species.
  // Reserve name confirmed with the user too: "Jawbone Marine Sanctuary"
  // (the Map Overview pin's original placeholder label) and "Jawbone Nature
  // Conservation Reserve" (the name on the supplied map file and hotspots
  // doc) are two real, adjacent-but-distinct protected areas in
  // Williamstown, VIC — user confirmed to use the latter, matching the
  // actually-supplied assets.
  // Scene names/map alt text written after looking at the actual scene
  // stills/map, not guessed from filenames. mapX/mapY/hotspot positions
  // detected programmatically (Pillow/scipy, connected-component marker
  // detection — same method used for Rosanna and the original Map Overview
  // pins) from documents/Jawbone_Hotspots.png.
  // IMPORTANT: that reference doc's 3 scene panels are NOT in filename
  // order (its 2nd panel is actually 03-Saltmarsh-Lagoon and its 3rd panel
  // is actually 02-Wetland-Lake) — verified by directly comparing the
  // doc's panel images against the real asset files pixel-for-pixel before
  // assigning any hotspot, not assumed from the doc's or filenames' own
  // ordering. The scenes array below is ordered to match the doc's actual
  // panel order (boardwalk, lagoon, lake) for readability, same as
  // Rosanna's array above isn't in filename order either for the same
  // reason.
  jawbone: {
    id: "jawbone",
    name: "Jawbone Nature Conservation Reserve",
    mapImage: "../assets/scenes/jawbone-nature-conservation-reserve/Jawbone Nature Conservation Reserve Map.jpg",
    mapAlt: "Illustrated aerial map of Jawbone Nature Conservation Reserve, showing a rocky coastline with two inland ponds set among grassy parkland, and a sheltered reef and lagoon at the reserve's southern point. A residential street grid borders the reserve to the north and east, with a small boat harbour near its southeastern corner.",
    quizLabelIds: ["banjo","striped-marsh","baw-baw","bell"],
    targetSpecies: "banjo",
    scenes: [
      { id: "boardwalk-marsh", name: "The estuary boardwalk",
        photo: "../assets/scenes/jawbone-nature-conservation-reserve/01-Jawbone-Estuary-Boardwalk-Marsh-still.jpg",
        video: "../assets/scenes/jawbone-nature-conservation-reserve/01-Jawbone-Estuary-Boardwalk-Marsh.mp4",
        ambientAudio: "../assets/scenes/jawbone-nature-conservation-reserve/jawbone-bg-sound/01-Jawbone-Estuary-Boardwalk-Marsh.mp3",
        pannable: true,
        // mapX/mapY rotated 3-way with "saltmarsh-lagoon"/"wetland-lake"
        // 2026-09-22, per the user's request — the reserve map's 3 dot
        // positions are unchanged; this only rotates which scene each
        // existing dot opens (this one now sits where saltmarsh-lagoon's
        // dot used to be). Scene-local hotspot x/y untouched.
        mapX: "65.34%", mapY: "42.63%",
        hotspots: [{ id: "bw1", x: "33.71%", y: "68.23%" }, { id: "bw2", x: "76.83%", y: "54.92%" }] },
      { id: "saltmarsh-lagoon", name: "The saltmarsh lagoon",
        photo: "../assets/scenes/jawbone-nature-conservation-reserve/03-Jawbone-Saltmarsh-Lagoon-still.jpg",
        video: "../assets/scenes/jawbone-nature-conservation-reserve/03-Jawbone-Saltmarsh-Lagoon.mp4",
        ambientAudio: "../assets/scenes/jawbone-nature-conservation-reserve/jawbone-bg-sound/03-Jawbone-Saltmarsh-Lagoon.mp3",
        pannable: true,
        // Rotated — now sits where wetland-lake's dot used to be. See
        // comment above.
        mapX: "44.67%", mapY: "63.42%",
        hotspots: [{ id: "lg1", x: "18.71%", y: "65.73%" }, { id: "lg2", x: "71.21%", y: "75.72%" }] },
      { id: "wetland-lake", name: "The wetland lake",
        photo: "../assets/scenes/jawbone-nature-conservation-reserve/02-Jawbone-Wetland-Lake-still.jpg",
        video: "../assets/scenes/jawbone-nature-conservation-reserve/02-Jawbone-Wetland-Lake.mp4",
        ambientAudio: "../assets/scenes/jawbone-nature-conservation-reserve/jawbone-bg-sound/02-Jawbone-Wetland-Lake.mp3",
        pannable: true,
        // Rotated — now sits where boardwalk-marsh's (estuary) dot used to
        // be. See comment above.
        mapX: "25.15%", mapY: "36.51%",
        hotspots: [{ id: "wl1", x: "20.59%", y: "73.23%" }, { id: "wl2", x: "84.33%", y: "46.58%" }] }
    ]
  },
  // Wired in following the Jawbone/Rosanna pattern. Target species (Brown
  // Tree Frog) inferred from the one new frog-call recording supplied
  // (trin-frog-sound/). Quiz distractors: user asked for a randomised pick
  // (rather than reusing the same distractor pool as every other reserve)
  // — rolled once now via `random.sample` over the 6 non-target species and
  // fixed in the data below, same as every other reserve's quiz labels are
  // authored (not re-randomised at runtime; that was explicitly not what
  // was asked for).
  // Reserve name extended from the Map Overview pin's existing abbreviated
  // placeholder ("Trin Warren Tam-Boore") to the full name on the supplied
  // map file/hotspots doc ("Trin Warren Tam-Boore Bellbird Waterhole") —
  // unlike Jawbone, this isn't two distinct real places, just a shorter vs.
  // fuller form of the same reserve's name, so not treated as needing a
  // confirmation question.
  // Scene names/map alt text written after looking at the actual scene
  // stills/map. mapX/mapY/hotspot positions detected programmatically
  // (Pillow/scipy, connected-component marker detection) from
  // documents/Trin_Warren_Hotspots.png.
  // IMPORTANT: same doc/filename mismatch as Jawbone's hotspots doc — this
  // doc's 2nd scene panel is actually 03-Trin-billabong-edge and its 3rd
  // panel is actually 02-Trin-Wetland-Waterhole. Verified by directly
  // comparing the doc's cropped panel images against the real asset files
  // pixel-for-pixel before assigning any hotspot. The scenes array below is
  // ordered to match the doc's actual panel order (channel, billabong,
  // waterhole) for readability, same as Jawbone's and Rosanna's arrays.
  trin: {
    id: "trin",
    name: "Trin Warren Tam-Boore Bellbird Waterhole",
    mapImage: "../assets/scenes/trin-warren-tam-boore-bellbird-waterhole/Trin Warren Tam-Boore Bellbird Waterhole Reserve Map.jpg",
    mapAlt: "Illustrated aerial map of Trin Warren Tam-Boore Bellbird Waterhole, showing a large lake beside a road on the western side of the reserve, and a pair of smaller ponds within a wooded loop track to the east. A car park sits between the two areas, a residential street borders the reserve to the north, and a sports oval sits to the south.",
    quizLabelIds: ["brown-tree","spotted-tree","banjo","bell"],
    targetSpecies: "brown-tree",
    scenes: [
      { id: "wetland-channel", name: "The narrow wetland channel",
        photo: "../assets/scenes/trin-warren-tam-boore-bellbird-waterhole/01-Trin-narrow-wetland-channel-still.jpg",
        video: "../assets/scenes/trin-warren-tam-boore-bellbird-waterhole/01-Trin-narrow-wetland-channel.mp4",
        ambientAudio: "../assets/scenes/trin-warren-tam-boore-bellbird-waterhole/trin-bg-sound/01-Trin-narrow-wetland-channel.mp3",
        pannable: true,
        // mapX/mapY swapped with "wetland-waterhole" 2026-09-22, per the
        // user's request — dot positions unchanged, only which scene each
        // opens.
        mapX: "74.53%", mapY: "61.01%",
        hotspots: [{ id: "wc1", x: "37.46%", y: "54.91%" }, { id: "wc2", x: "80.58%", y: "74.89%" }] },
      { id: "billabong-edge", name: "The billabong edge",
        photo: "../assets/scenes/trin-warren-tam-boore-bellbird-waterhole/03-Trin-billabong-edge-still.jpg",
        video: "../assets/scenes/trin-warren-tam-boore-bellbird-waterhole/03-Trin-billabong-edge.mp4",
        ambientAudio: "../assets/scenes/trin-warren-tam-boore-bellbird-waterhole/trin-bg-sound/03-Trin-billabong-edge.mp3",
        pannable: true,
        mapX: "18.26%", mapY: "56.93%",
        hotspots: [{ id: "be1", x: "28.09%", y: "82.38%" }, { id: "be2", x: "54.34%", y: "59.07%" }] },
      { id: "wetland-waterhole", name: "The wetland waterhole",
        photo: "../assets/scenes/trin-warren-tam-boore-bellbird-waterhole/02-Trin-Wetland-Waterhole-still.jpg",
        video: "../assets/scenes/trin-warren-tam-boore-bellbird-waterhole/02-Trin-Wetland-Waterhole.mp4",
        ambientAudio: "../assets/scenes/trin-warren-tam-boore-bellbird-waterhole/trin-bg-sound/02-Trin-Wetland-Waterhole.mp3",
        pannable: true,
        // mapX/mapY swapped with "wetland-channel" — see comment above.
        mapX: "58.44%", mapY: "38.55%",
        hotspots: [{ id: "ww1", x: "33.71%", y: "49.92%" }, { id: "ww2", x: "82.45%", y: "83.21%" }] }
    ]
  },
  // Wired in following the Jawbone/Trin pattern. Target species (Spotted
  // Marsh Frog) inferred from the one new frog-call recording supplied
  // (newport-frog-sound/). Quiz distractors: rolled once at random (same
  // process as Trin Warren) over the 5 non-target species excluding Baw Baw
  // Frog — first roll included Baw Baw, but the user asked to reroll rather
  // than have it show up as a distractor in two reserves, so it was
  // excluded from the pool for the reroll rather than just discarding that
  // one result and re-including it. Reserve name matches the Map Overview
  // pin's existing label exactly (no Jawbone-style naming ambiguity here).
  // Scene names/map alt text written after looking at the actual scene
  // stills/map. mapX/mapY/hotspot positions detected programmatically
  // (Pillow/scipy) from documents/Newport_Lakes_Hotspots.png.
  // IMPORTANT: same doc/filename mismatch as every reserve's hotspots doc so
  // far — this doc's 2nd scene panel is actually 03-newport-lake-inlet and
  // its 3rd panel is actually 02-newport-rocky-lakeside-slope. Verified by
  // directly comparing the doc's cropped panel images against the real
  // asset stills pixel-for-pixel before assigning any hotspot position. The
  // scenes array below is ordered to match the doc's actual panel order
  // (quarry lake, lake inlet, rocky lakeside slope) for readability, same
  // as every other reserve's array above.
  newport: {
    id: "newport",
    name: "Newport Lakes Reserve",
    mapImage: "../assets/scenes/newport-lakes-reserve/Newport Lakes Reserve Map.jpg",
    mapAlt: "Illustrated aerial map of Newport Lakes Reserve, showing a densely wooded loop track around a small central pond and two larger connected quarry lakes to the east. A residential street grid borders the reserve on both the west and east sides.",
    quizLabelIds: ["spotted-marsh","striped-marsh","spotted-tree","bell"],
    targetSpecies: "spotted-marsh",
    scenes: [
      { id: "quarry-lake", name: "The quarry lake",
        photo: "../assets/scenes/newport-lakes-reserve/01-newport-quarry-lake-still.jpg",
        video: "../assets/scenes/newport-lakes-reserve/01-newport-quarry-lake.mp4",
        ambientAudio: "../assets/scenes/newport-lakes-reserve/newport-bg-sound/01-newport-quarry-lake.mp3",
        pannable: true,
        // mapX/mapY swapped with "lake-inlet" 2026-09-22, per the user's
        // request — dot positions unchanged, only which scene each opens.
        mapX: "51.57%", mapY: "46.72%",
        hotspots: [{ id: "ql1", x: "28.09%", y: "74.89%" }, { id: "ql2", x: "80.58%", y: "71.56%" }] },
      { id: "lake-inlet", name: "The lake inlet",
        photo: "../assets/scenes/newport-lakes-reserve/03-newport-lake-inlet-still.jpg",
        video: "../assets/scenes/newport-lakes-reserve/03-newport-lake-inlet.mp4",
        ambientAudio: "../assets/scenes/newport-lakes-reserve/newport-bg-sound/03-newport-lake-inlet.mp3",
        pannable: true,
        // mapX/mapY swapped with "quarry-lake" — see comment above.
        mapX: "77.98%", mapY: "20.19%",
        hotspots: [{ id: "li1", x: "13.09%", y: "42.42%" }, { id: "li2", x: "80.58%", y: "72.39%" }] },
      { id: "rocky-lakeside-slope", name: "The rocky lakeside slope",
        photo: "../assets/scenes/newport-lakes-reserve/02-newport-rocky-lakeside-slope-still.jpg",
        video: "../assets/scenes/newport-lakes-reserve/02-newport-rocky-lakeside-slope.mp4",
        ambientAudio: "../assets/scenes/newport-lakes-reserve/newport-bg-sound/02-newport-rocky-lakeside-slope.mp3",
        pannable: true,
        mapX: "60.75%", mapY: "73.24%",
        hotspots: [{ id: "rl1", x: "26.22%", y: "49.92%" }, { id: "rl2", x: "69.33%", y: "69.89%" }] }
    ]
  },
  // Wired in following the Jawbone/Trin/Newport pattern. Target species
  // (Baw Baw Frog) inferred from the one new frog-call recording supplied
  // (baw-baw-frog-sound/) — as flagged when Jawbone was wired in, this was
  // the one target predictable ahead of time from supplied assets, since
  // the park and the frog share a name. Quiz distractors: rolled once at
  // random over the 6 non-target species, checked programmatically against
  // all 5 other reserves' sets (no duplicates), user confirmed the roll
  // as-is rather than requesting a reroll. Reserve name matches the Map
  // Overview pin's existing label exactly — no naming ambiguity.
  // Scene names/map alt text written after looking at the actual scene
  // stills/map. mapX/mapY/hotspot positions detected programmatically
  // (Pillow/scipy) from documents/BawBaw_Hotspots.png.
  // IMPORTANT: same doc/filename mismatch as Jawbone's and Newport's docs
  // specifically (1st panel matches its filename, 2nd and 3rd are swapped)
  // — this doc's 2nd scene panel is actually 03-BawBaw-Snow-Gum-Woodland and
  // its 3rd panel is actually 02-BawBaw-Moorland-Pools-and-Snow-Gums.
  // Verified by directly comparing the doc's cropped panel images against
  // the real asset stills pixel-for-pixel before assigning any hotspot
  // position — 6th reserve hotspots doc in a row with this issue (only
  // Trin Warren's doc had a different, non-2nd/3rd-swap scramble).
  bawbaw: {
    id: "bawbaw",
    name: "Baw Baw National Park",
    mapImage: "../assets/scenes/baw-baw-national-park/Baw Baw National Park Map.jpg",
    mapAlt: "Illustrated aerial map of Baw Baw National Park, showing forested mountain ridges and valleys crossed by hiking trails, with a long narrow reservoir running north-south through a steeper, more rugged range on the eastern side.",
    quizLabelIds: ["baw-baw","banjo","spotted-marsh","bell"],
    targetSpecies: "baw-baw",
    scenes: [
      { id: "alpine-creek", name: "The alpine creek among snow gums",
        photo: "../assets/scenes/baw-baw-national-park/01-BawBaw-Alpine-Creek-Among-Snow-Gums-still.jpg",
        video: "../assets/scenes/baw-baw-national-park/01-BawBaw-Alpine-Creek-Among-Snow-Gums.mp4",
        ambientAudio: "../assets/scenes/baw-baw-national-park/baw-baw-bg-sound/01-BawBaw-Alpine-Creek-Among-Snow-Gums.mp3",
        pannable: true,
        mapX: "38.93%", mapY: "34.49%",
        hotspots: [{ id: "ac1", x: "22.46%", y: "61.57%" }, { id: "ac2", x: "76.83%", y: "49.91%" }] },
      { id: "snow-gum-woodland", name: "The snow gum woodland",
        photo: "../assets/scenes/baw-baw-national-park/03-BawBaw-Snow-Gum-Woodland-still.jpg",
        video: "../assets/scenes/baw-baw-national-park/03-BawBaw-Snow-Gum-Woodland.mp4",
        ambientAudio: "../assets/scenes/baw-baw-national-park/baw-baw-bg-sound/03-BawBaw-Snow-Gum-Woodland.mp3",
        pannable: true,
        mapX: "65.35%", mapY: "46.72%",
        hotspots: [{ id: "sg1", x: "31.84%", y: "65.73%" }, { id: "sg2", x: "88.08%", y: "69.06%" }] },
      { id: "moorland-pools", name: "The moorland pools",
        photo: "../assets/scenes/baw-baw-national-park/02-BawBaw-Moorland-Pools-and-Snow-Gums-still.jpg",
        video: "../assets/scenes/baw-baw-national-park/02-BawBaw-Moorland-Pools-and-Snow-Gums.mp4",
        ambientAudio: "../assets/scenes/baw-baw-national-park/baw-baw-bg-sound/02-BawBaw-Moorland-Pools-and-Snow-Gums.mp3",
        pannable: true,
        mapX: "23.99%", mapY: "67.11%",
        hotspots: [{ id: "mp1", x: "24.34%", y: "59.90%" }, { id: "mp2", x: "69.33%", y: "76.56%" }] }
    ]
  },
  // Wired in following the same pattern as the last 5 reserves, with one
  // deliberate difference: only `photo` stills were supplied, no
  // `video`/`ambientAudio` yet (confirmed with the user — used as
  // placeholders on purpose, animated scenes + ambient audio to follow
  // later). openScene() already handles a scene with no `video` gracefully
  // (falls back to the static <img>, per its existing `if (scene.video)`
  // branch), and no `ambientAudio` just means silence rather than an error
  // — so no code changes were needed to support this, only the data itself
  // temporarily omits those two fields. Add `video`/`ambientAudio` to each
  // scene below once supplied, same path convention as every other reserve.
  //
  // Target species (Spotted Tree Frog) confirmed by the supplied
  // `enoch-frog-sound/` recording — the only species not yet claimed by
  // another reserve, as predicted when Baw Baw was wired in. Quiz
  // distractors rolled once at random over the 6 non-target species,
  // checked programmatically against all 6 other reserves (no
  // duplicates), user confirmed the roll as-is. This is the 7th and final
  // reserve, so every one of the 7 species is now some reserve's target.
  // Scene names/map alt text written after looking at the actual stills
  // and reserve map. mapX/mapY/hotspot positions detected programmatically
  // (Pillow/scipy) from documents/Enoch_Hotspots.png — the one reference
  // doc that didn't exist yet when this reserve was first raised; supplied
  // by the user mid-conversation once asked.
  // IMPORTANT: same doc/filename mismatch as Jawbone's/Newport's/Baw Baw's
  // docs — this doc's 2nd scene panel is actually 03-Enoch-Fern-Gully-Pool
  // and its 3rd panel is actually 02-Enoch-Forest-Creek. Verified by
  // directly comparing the doc's cropped panel images against the real
  // asset stills pixel-for-pixel before assigning any hotspot — 7th
  // reserve hotspots doc, 6th with this exact issue.
  enoch: {
    id: "enoch",
    name: "Enoch Falls",
    mapImage: "../assets/scenes/enoch-falls/Enoch Falls Reserve Map.jpg",
    mapAlt: "Illustrated aerial map of Enoch Falls, showing dense forest crossed by winding creeks and walking trails, with a small cluster of huts near a creek bend in the northwest and a waterfall along a southern branch of the creek.",
    quizLabelIds: ["spotted-tree","bell","brown-tree","striped-marsh"],
    targetSpecies: "spotted-tree",
    scenes: [
      { id: "forest-waterfall", name: "The forest waterfall",
        photo: "../assets/scenes/enoch-falls/01-Enoch-Forest-Waterfall-still.jpg",
        video: "../assets/scenes/enoch-falls/01-Enoch-Forest-Waterfall.mp4",
        ambientAudio: "../assets/scenes/enoch-falls/enoch-bg-sound/01-Au-Enoch-Forest-Waterfall.mp3",
        pannable: true,
        mapX: "18.24%", mapY: "22.22%",
        hotspots: [{ id: "wf1", x: "33.71%", y: "44.92%" }, { id: "wf2", x: "80.58%", y: "74.89%" }] },
      { id: "fern-gully-pool", name: "The fern gully pool",
        photo: "../assets/scenes/enoch-falls/03-Enoch-Fern-Gully-Pool-still.jpg",
        video: "../assets/scenes/enoch-falls/03-Enoch-Fern-Gully-Pool.mp4",
        ambientAudio: "../assets/scenes/enoch-falls/enoch-bg-sound/03-Au-Enoch-Fern-Gully-Pool.mp3",
        pannable: true,
        // mapX/mapY swapped with "forest-creek" 2026-09-22, per the user's
        // request — dot positions unchanged, only which scene each opens.
        mapX: "27.43%", mapY: "75.29%",
        hotspots: [{ id: "fg1", x: "16.84%", y: "75.72%" }, { id: "fg2", x: "73.08%", y: "52.42%" }] },
      { id: "forest-creek", name: "The forest creek",
        photo: "../assets/scenes/enoch-falls/02-Enoch-Forest-Creek-still.jpg",
        video: "../assets/scenes/enoch-falls/02-Enoch-Forest-Creek.mp4",
        ambientAudio: "../assets/scenes/enoch-falls/enoch-bg-sound/02-Au-Enoch-Forest-Creek.mp3",
        pannable: true,
        // mapX/mapY swapped with "fern-gully-pool" — see comment above.
        mapX: "61.90%", mapY: "49.91%",
        hotspots: [{ id: "fc1", x: "31.84%", y: "73.22%" }, { id: "fc2", x: "61.84%", y: "63.24%" }] }
    ]
  }
};

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

// Text summary of the calling period for the mobile paper-sheet view and
// the print PDF (the desktop book's facts page keeps the color-coded grid +
// legend instead — see fgFactsHtml()). Returns a {label, months} pair
// instead of one combined string so the label can be styled like every
// other field's small-caps heading while the months read at normal size,
// both on the same line (merged from a separate heading + paragraph per the
// user's request, to reclaim vertical space on the printed page). Falls
// back to the "yes" months when a species has no true peak at all (e.g.
// Spotted Tree Frog) — "Peak" is dropped from the label in that case rather
// than claiming a peak that doesn't exist.
function callingPeriodParts(sp) {
  const peak = monthRangesText(sp.calling, 3);
  if (peak) return { label: "Peak Calling Period", months: peak };
  const yes = monthRangesText(sp.calling, 2);
  if (yes) return { label: "Calling Period", months: yes };
  return { label: "Calling Period", months: "Unknown" };
}

// ===================== State =====================
const state = {
  // Populated from RESERVES[reserveId] by enterPark() — see that function
  // and the comment above RESERVES. currentReserveId/scenes/targetSpecies/
  // quizLabelIds all default to Yalukit here purely so nothing is ever
  // undefined before the player's first enterPark() call; they're
  // overwritten every time a reserve is entered.
  currentReserveId: "yalukit",
  scenes: RESERVES.yalukit.scenes,
  targetSpecies: RESERVES.yalukit.targetSpecies,
  quizLabelIds: RESERVES.yalukit.quizLabelIds,
  completedReserves: new Set(), // reserve ids whose frog has been found — see enterPark()/onCorrectGuess()
  endgameShown: false, // true once the "found everything" card has been shown this session — see maybeShowEndgameCard()
  printPulseActive: false, // true from the endgame card's "Open Field Guide" click until Print is actually clicked once — see openFieldGuide()/print-fieldguide handler
  printClickedOnce: false, // one-way latch so a later endgame-card reopen (via Instructions) can't re-arm the pulse after Print was already used once
  currentSceneIdx: 0,
  targetHotspotKey: null, // "sceneIdx:hotspotId"
  crossedOut: new Set(),
  checkedHotspots: new Set(), // "sceneIdx:hotspotId" already clicked this reserve visit, for the Reserve Map pulse hint
  fieldGuideUnlocked: new Set(),
  discoveredSceneIdx: null, // scene the target was found in, for the success backdrop on a later revisit
  fgIdx: 0,
  audioCtx: null,
  callNodes: null,
  audioMuted: false // scene ambient + frog-call audio only — see toggleAudioMute()
};

// Makes a plain, click-driven <div> (map pins, reserve-map scene points,
// scene search hotspots) keyboard-operable: focusable, announced as a
// button, and activatable with Enter/Space — these can't just be real
// <button> elements since their absolute-positioned layout and existing
// styling assume a div, but they still need to work for keyboard/screen
// reader users, not just mouse and touch. `label`, when given, sets the
// accessible name explicitly rather than relying on (possibly
// hover-only-visible) descendant text content.
function makeKeyboardClickable(el, label) {
  el.tabIndex = 0;
  el.setAttribute("role", "button");
  if (label) el.setAttribute("aria-label", label);
  el.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      el.click();
    }
  });
}

// Scoped to state.scenes (the current reserve's own scene list) so a
// relocation (randomizeTarget()/showFail()) can never send the target frog
// into a scene that belongs to a different reserve — see the RESERVES
// comment above.
function allHotspotKeys() {
  const keys = [];
  state.scenes.forEach((s, si) => s.hotspots.forEach(h => keys.push(`${si}:${h.id}`)));
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
//
// Optional `onShown` runs right as the incoming screen becomes .active —
// every call site uses it to move focus onto that screen's own heading
// (same "screen hides, focus silently blurs to <body>" fix already applied
// to the intro dialog, the Field Guide, and the quiz — this closes the same
// gap for the map/park/scene transitions, which all go through here).
function transitionShowScreen(id, type, onShown) {
  if (screenTransitionActive) return; // ignore re-entrant calls mid-transition
  const outgoing = document.querySelector(".screen.active");
  const incoming = document.getElementById(`screen-${id}`);
  if (!outgoing || outgoing === incoming) { showScreen(id); if (onShown) onShown(); return; }

  screenTransitionActive = true;
  const duration = SCREEN_TRANSITION_MS[type];
  outgoing.classList.add(`screen-exit-${type}`);
  setTimeout(() => {
    outgoing.classList.remove("active", `screen-exit-${type}`);
    incoming.classList.add("active");
    void incoming.offsetWidth; // force a reflow so display:block is committed before the enter animation is requested
    incoming.classList.add(`screen-enter-${type}`);
    if (onShown) onShown();
    setTimeout(() => {
      incoming.classList.remove(`screen-enter-${type}`);
      screenTransitionActive = false;
    }, duration);
  }, duration);
}

// ===================== Staggered reveal (quiz / Field Guide open) =====================
// Two-wave reveal used when the quiz or the Field Guide opens, per the
// design agreed 2026-09-16 (see the Progress Log's Known Gaps entry): an
// immediate wave, then a second wave ~1s later. Motion is separate from
// timing — the quiz's second wave (species labels) still "pops" (translateY
// + fade) like its first wave does; the Field Guide's second wave (Close/
// Print/page-turn buttons) fades only, no motion — a deliberately quieter
// treatment for controls vs. content. Replays every time the screen opens
// (not once per session) — a deliberate choice, not an oversight.
//
// The un-revealed base state (.stagger-immediate/.stagger-delayed, and
// .stagger-motion for elements that pop rather than just fade) is baked
// directly into index.html on each element, not added here at open time —
// a first version added those classes from JS right as the screen opened,
// which left a real window (particularly around the focus() call each open
// function also makes) for the browser to commit a visible first frame
// before the hidden classes landed, so everything flashed visible, then
// hid, then staggered back in — the opposite of the intended reveal. Baking
// the classes into the HTML means the hidden state exists before any JS
// runs at all, so there's nothing left to race.
//
// Skippable: a click anywhere on the screen while mid-stagger snaps
// straight to the fully-revealed state. Not-yet-revealed elements are
// pointer-events:none for mouse/touch specifically, so an early click can't
// double as both "skip" and "activate whatever's about to appear there" —
// e.g. a click landing where a quiz label will be would otherwise register
// as an actual guess. Because pointer-events:none makes the browser's
// hit-test for that click resolve to whatever's underneath (ultimately the
// screen itself), the not-yet-visible element never receives that click at
// all — it's caught here instead, by a capture-phase listener on the
// screen. Keyboard/screen-reader access is never gated by any of this: the
// DOM content is focusable/announced from the very first frame regardless
// of animation state — only the mouse/touch visual reveal is staggered.
const STAGGER_DELAY_MS = 1000;

function revealStaggerNow(elements) {
  // "Snap" rather than fast-play: force transition:none for one frame so
  // opacity/transform jump straight to the end state instead of animating
  // there quickly, then restore normal transitions afterward — harmless,
  // since these elements get reset from scratch next time this screen opens.
  elements.forEach(el => { el.style.transition = "none"; el.classList.add("stagger-in"); });
  void document.body.offsetWidth; // force the transition:none to commit before it's removed
  elements.forEach(el => { el.style.transition = ""; });
}

// Clears a leftover .stagger-in from the *previous* open of this screen —
// these elements are reused across opens, not rebuilt each time, so a
// second (or later) open starts with them still fully revealed from last
// time. Bug found 2026-09-18: this used to happen inside runStagger()
// itself, called *after* showScreen()/.focus() — i.e. while the screen was
// already visible — which reopened the exact same "a paint can slip in
// before the class change lands" race the HTML-baked base state was meant
// to close off for good (see the comment above). On a first-ever open
// there's nothing to reset (the HTML's base state already has it hidden),
// so the race was invisible; on a reopen, the still-revealed content would
// flash visible for a frame before snapping hidden and staggering back in.
// Fixed by splitting this reset out and calling it *before* showScreen(),
// while the screen is still display:none — with nothing on it being
// rendered at all, there's no frame for any paint to catch mid-reset,
// regardless of what's happening with focus() a few statements later.
function resetStagger(screenId, immediateSelector, delayedSelector) {
  const screen = document.getElementById(`screen-${screenId}`);
  const all = [...screen.querySelectorAll(immediateSelector), ...screen.querySelectorAll(delayedSelector)];
  all.forEach(el => { el.classList.remove("stagger-in"); el.style.transition = ""; });
}

// Call resetStagger() (above) with the same arguments before showScreen(),
// then this after — see openQuiz()/openFieldGuide() for both call sites.
function runStagger(screenId, immediateSelector, delayedSelector) {
  const screen = document.getElementById(`screen-${screenId}`);
  const immediate = [...screen.querySelectorAll(immediateSelector)];
  const delayed = [...screen.querySelectorAll(delayedSelector)];
  const all = [...immediate, ...delayed];

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // No delay either, not just no animation — an artificial 1s wait with
    // nothing visibly moving would be a worse experience than this
    // preference is meant to prevent.
    revealStaggerNow(all);
    return;
  }

  let delayTimer = null;
  function skip() {
    clearTimeout(delayTimer);
    revealStaggerNow(all);
    screen.removeEventListener("click", skip, true);
  }
  screen.addEventListener("click", skip, true);

  // Two nested rAFs (not one) so the screen's hidden starting state (set by
  // resetStagger(), before showScreen() made it visible) is definitely
  // committed as a real painted frame before the transition-triggering
  // class is added — a single rAF can still land before that paint on some
  // browsers, which would silently skip the "pop in" animation entirely.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    immediate.forEach(el => el.classList.add("stagger-in"));
  }));

  delayTimer = setTimeout(() => {
    delayed.forEach(el => el.classList.add("stagger-in"));
    screen.removeEventListener("click", skip, true);
  }, STAGGER_DELAY_MS);
}

// ===================== Intro instructions =====================
// Shown on every load (no persistence layer in this prototype, so there's
// no "seen it before" to check) — dismissed only via its own button, not by
// clicking the dimmed backdrop, so the player has to actually acknowledge it.
//
// A dimmed backdrop + a click-does-nothing handler is enough to block a
// mouse user, but does nothing for keyboard/screen-reader users — without
// more, they could Tab or read straight past this into the Map Overview
// underneath, which is exactly what was happening (flagged: a screen
// reader started on the Map Overview and never announced this dialog at
// all). `inert` on #app-content removes everything behind the dialog from
// both the tab order and the accessibility tree while it's open — combined
// with role="dialog"/aria-modal on the overlay (index.html) and moving
// focus onto the Start button, this makes it behave like an actual modal
// for every input method, not just mouse/touch.
// Shared open/close for every full-screen single-button modal in this app
// (the intro dialog, and the endgame "found everything" card below) —
// pulled out into one place 2026-09-22 when the endgame card needed the
// exact same inert/focus/dismiss behavior the intro dialog already had.
function openModalOverlay(overlayId, focusEl) {
  document.getElementById(overlayId).hidden = false;
  document.getElementById("app-content").inert = true;
  focusEl.focus();
}
function closeModalOverlay(overlayId, focusAfterEl) {
  document.getElementById(overlayId).hidden = true;
  document.getElementById("app-content").inert = false;
  if (focusAfterEl) focusAfterEl.focus();
}
// `inert` on #app-content keeps Tab from reaching the background, but does
// nothing to stop Tab from leaving the dialog forward past its last
// focusable element (or Shift+Tab backward past its first) into the
// browser's own UI — there's nothing else in the document for focus to land
// on otherwise. Wraps it back around so Tab/Shift+Tab always stay inside
// whichever modal is currently open.
function trapTabWithinOverlay(overlayId) {
  document.getElementById(overlayId).addEventListener("keydown", e => {
    if (e.key !== "Tab") return;
    const focusable = [...document.getElementById(overlayId)
      .querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter(el => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

function showIntro() {
  openModalOverlay("intro-overlay", document.getElementById("intro-start-btn"));
}
showIntro();
document.getElementById("intro-start-btn").addEventListener("click", () => {
  closeModalOverlay("intro-overlay", document.getElementById("map-title"));
});

// Map Overview's "Instructions" button — re-opens the same intro dialog
// shown on load, so a player can re-read it later. Once every reserve's
// frog has been found, it shows the endgame card instead (confirmed with
// the user) — that's the more useful "what do I do now" answer for a
// player who's finished. Only ever reachable from the Map Overview screen,
// so the dismiss handlers' focus target (#map-title) stays correct without
// needing return-screen tracking.
document.querySelector('[data-action="show-instructions"]').addEventListener("click", () => {
  if (state.completedReserves.size >= Object.keys(RESERVES).length) showEndgameCard();
  else showIntro();
});
trapTabWithinOverlay("intro-overlay");

// ===================== Endgame card =====================
// Both "arrive at the Map Overview" call sites (the reserve screen's "Main
// Map" button and the success screen's "Return to Main Map") focus the
// title and then check whether the endgame card should appear — pulled
// into one function since a function declaration hoists regardless of
// where in the file it's called from.
function onArriveAtMapOverview() {
  document.getElementById("map-title").focus();
  maybeShowEndgameCard();
}
function showEndgameCard() {
  openModalOverlay("endgame-overlay", document.getElementById("endgame-view-btn"));
}
// Shown once, the first time the player arrives back at the Map Overview
// having found every reserve's frog — a celebratory one-off, not a repeat
// nag on every later visit to the map (confirmed with the user). Checked
// from onArriveAtMapOverview() above rather than from onCorrectGuess()
// itself, since the request was specifically "when returning to the map
// overview", not "the moment the last frog is found" (which happens on the
// Success screen, a different moment). The manual reopen via the
// Instructions button (above) calls showEndgameCard() directly instead,
// since that one's meant to show every time it's clicked, not just once.
function maybeShowEndgameCard() {
  if (state.endgameShown) return;
  if (state.completedReserves.size < Object.keys(RESERVES).length) return;
  state.endgameShown = true;
  showEndgameCard();
}
document.getElementById("endgame-view-btn").addEventListener("click", () => {
  closeModalOverlay("endgame-overlay", null); // openFieldGuide() below manages its own focus (#fg-heading)
  // Drives the print button's pulse-hint (styles.css) toward "download a
  // copy" — confirmed with the user this should persist across every
  // Field Guide open (not just this one) until Print is actually clicked
  // once, not just this specific viewing. Now that the endgame card can be
  // reopened via Instructions (see its click handler above), this must not
  // re-arm the pulse on a later reopen after Print has already been used
  // once — printClickedOnce is a one-way latch for exactly that.
  if (!state.printClickedOnce) state.printPulseActive = true;
  state.returnScreen = "map";
  openFieldGuide("references");
});
trapTabWithinOverlay("endgame-overlay");

document.querySelectorAll("[data-goto]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-goto");
    if (target === "fieldguide") {
      const activeScreen = document.querySelector(".screen.active");
      state.returnScreen = activeScreen ? activeScreen.id.replace("screen-", "") : "map";
      openFieldGuide();
    }
    else if (target === "park") {
      playFeedbackSound(OPEN_RESERVE_MAP_SOUND);
      stopCallTone();
      stopSceneMedia();
      // Re-render so the "current scene" red marker (added alongside
      // state.currentSceneIdx tracking) reflects the scene just left —
      // previously safe to skip here since nothing else about the points
      // changes on a plain return trip, but now it's the only "Reserve Map"
      // path from a scene that wasn't already re-rendering them (the Fail
      // screen's equivalent button already does, since it also relocates
      // the target).
      renderScenePoints();
      transitionShowScreen("park", "fade", () => document.getElementById("park-title").focus());
    }
    else if (target === "map") { playFeedbackSound(MAP_OVERVIEW_RETURN_SOUND); stopCallTone(); stopSceneMedia(); transitionShowScreen("map", "zoom-out", onArriveAtMapOverview); }
  });
});

// ===================== Map Overview =====================
// Reads which reserve was clicked from the pin's own data-park attribute
// (set on every reserve pin in index.html, unlocked or not — only unlocked
// pins reach this listener) rather than hardcoding a single reserve, so
// this loop needs no changes when a further reserve is unlocked later.
document.querySelectorAll(".pin.unlocked").forEach(pin => {
  pin.addEventListener("click", () => {
    // Plays on every pin click, including the "revisit an already-completed
    // reserve" shortcut inside enterPark() that skips straight to Success —
    // confirmed with the user this should still play, since it marks "you
    // selected a reserve" rather than "you're now looking at its map".
    playFeedbackSound(MAP_OVERVIEW_OPEN_SOUND);
    enterPark(pin.dataset.park);
  });
  // Locked pins are deliberately left non-interactive/unfocusable — they
  // don't do anything on click, so making them keyboard-focusable would
  // just be a dead stop for no reason.
  makeKeyboardClickable(pin);
});

function enterPark(reserveId) {
  const reserve = RESERVES[reserveId];
  state.currentReserveId = reserveId;
  state.scenes = reserve.scenes;
  state.targetSpecies = reserve.targetSpecies;
  state.quizLabelIds = reserve.quizLabelIds;
  document.getElementById("park-title").textContent = reserve.name;
  const mapImg = document.getElementById("park-map-img");
  mapImg.src = reserve.mapImage;
  mapImg.alt = reserve.mapAlt;
  // parkPanController.activate() only ever ran once before, at page load,
  // against whatever image src the HTML started with — it has no way to
  // notice a later src swap on its own, so its pan/scale math would stay
  // derived from the *previous* reserve's map dimensions (Yalukit's
  // 1624×969 vs. Rosanna's 1672×940 — different enough aspect ratios that
  // this would visibly mis-crop/mis-scale). naturalWidth/naturalHeight
  // aren't valid until the new image actually finishes loading, so
  // re-activate from its own "load" event (same technique already used for
  // video metadata in createDragPanController()'s activate()) rather than
  // just calling .layout() directly — re-activating also resets the pan
  // anchor to centered, which a plain .layout() wouldn't do, so a freshly
  // entered reserve doesn't inherit wherever the previous reserve's map was
  // left panned to.
  if (parkPanController) mapImg.addEventListener("load", () => parkPanController.activate(mapImg), { once: true });

  if (state.completedReserves.has(reserveId)) {
    state.currentSceneIdx = state.discoveredSceneIdx;
    // Revisit flow bypasses openScene() entirely (goes straight to the
    // Success screen), so it's the one path that never starts the scene's
    // ambient audio — on a first-time win it's already playing, carried
    // over from openScene(), but here nothing ever started it. Same
    // start-ambient logic openScene() uses, minus the scene-specific setup
    // (video/hotspots/frog-call tone) that doesn't apply since we're not
    // actually showing the scene itself.
    const scene = state.scenes[state.currentSceneIdx];
    const ambientAudio = document.getElementById("scene-ambient-audio");
    if (scene.ambientAudio) {
      ambientAudio.src = scene.ambientAudio;
      ambientAudio.currentTime = 0;
      if (!state.audioMuted) ambientAudio.play().catch(() => {});
    }
    showSuccess(true); // zoom-in from the Map Overview, same "diving in" feel as entering a reserve
    return;
  }
  state.crossedOut.clear();
  state.checkedHotspots.clear();
  // -1 is a deliberate "no scene entered yet this visit" sentinel, distinct
  // from any real scene index — renderScenePoints() below checks against it
  // to decide the "current scene" red marker (styles.css), so a reserve
  // that hasn't been explored yet this visit doesn't show a false "current
  // location" on scene 0. Safe against state.scenes[state.currentSceneIdx]
  // reads elsewhere: every one of those only runs after openScene() has set
  // a real index (or, on the revisit branch above, after this one already
  // set its own valid index) — never while -1 is still in effect.
  state.currentSceneIdx = -1;
  randomizeTarget(null);
  renderScenePoints();
  transitionShowScreen("park", "zoom-fade", () => document.getElementById("park-title").focus());
}

function renderScenePoints() {
  const wrap = document.getElementById("map-points");
  wrap.innerHTML = "";
  state.scenes.forEach((scene, idx) => {
    const hasSound = scene.hotspots.some(h => `${idx}:${h.id}` === state.targetHotspotKey);
    // "current" = the scene the player last entered this reserve visit — a
    // "you are here" marker. state.currentSceneIdx is reset to -1 at the
    // top of every fresh enterPark() (not the revisit-completed branch),
    // so this is false until a scene has actually been entered, rather
    // than showing a false "current location" on a reserve that hasn't
    // been explored yet this visit.
    const isCurrent = idx === state.currentSceneIdx;
    const point = document.createElement("div");
    point.className = "map-point" + (hasSound ? " sounding" : "") + (isCurrent ? " current" : "");
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
    // Explicit aria-label (not left to compute from descendant content)
    // since .scene-card is only visually revealed on hover/focus — matches
    // exactly what a sighted player sees on hover, including the "a call
    // echoes here" cue, rather than adding information beyond that.
    makeKeyboardClickable(point, `${scene.name}${hasSound ? " — a call echoes here" : ""}`);
    // The reserve map is drag-pannable, so a point's on-screen position
    // shifts as the user pans — check live position at hover time rather
    // than relying on its static mapY, and flip the popup below the point
    // when there isn't enough room above it to stay on-screen. Shared by
    // mouseenter and focus so keyboard users get the same popup placement
    // sighted/mouse users do.
    function updateCardFlip() {
      const dot = point.querySelector(".map-point-dot");
      const card = point.querySelector(".scene-card");
      const neededSpace = card.offsetHeight + 12; // matches the CSS gap above the point
      point.classList.toggle("flip-down", dot.getBoundingClientRect().top < neededSpace);
    }
    point.addEventListener("mouseenter", updateCardFlip);
    point.addEventListener("focus", updateCardFlip);
    wrap.appendChild(point);
  });
}
// WCAG 1.4.13 "Dismissible": the scene-card popup is pure CSS
// (.map-point:focus .scene-card), so for a keyboard user the only way to
// close it without moving to the next/previous point is to remove focus
// from the point that's showing it — Escape does that here. Delegated once
// rather than attached per-point, since renderScenePoints() rebuilds the
// points fresh on every reserve visit.
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  const focused = document.activeElement;
  if (focused && focused.classList.contains("map-point")) focused.blur();
});

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
function createDragPanController({ wrapId, hintId, axis, panLayerId, mirrorId, alwaysVisibleAtStart }) {
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
      // The Map Overview's hint (alwaysVisibleAtStart) shows immediately
      // rather than going through the usual hide-then-reappear-after-3s
      // idle cycle — it's meant to be visible from the very start of the
      // experience. Once the user actually interacts, the normal
      // pointerdown/pointermove-driven restartIdleTimer() below takes over
      // (hide on interaction, reappear after 3s idle), same as every other
      // pannable screen.
      if (alwaysVisibleAtStart && hint) {
        clearTimeout(idleTimer);
        hint.classList.add("show");
      } else {
        restartIdleTimer();
      }
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
  hintId: "map-drag-hint", axis: "both", alwaysVisibleAtStart: true
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
  const scene = state.scenes[idx];
  document.getElementById("scene-title").textContent = RESERVES[state.currentReserveId].name;
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
    if (!state.audioMuted) ambientAudio.play().catch(() => {});
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
    // Matches exactly what a sighted player already perceives (the pulsing
    // "sounding" ring), not revealing anything a mouse/touch player doesn't
    // already have — see .hotspot.sounding in styles.css.
    makeKeyboardClickable(el, isTarget ? "Search here — a call sounds nearby" : "Search here");
    layer.appendChild(el);
  });
  if (scene.pannable) scenePanController.layout();

  document.getElementById("call-indicator").hidden = !soundingHere;
  document.getElementById("scene-toast").hidden = true;

  if (soundingHere) startCallTone(); else stopCallTone();
  updateSceneMapPulse();

  transitionShowScreen("scene", "fade", () => document.getElementById("scene-title").focus());
}

// Hints the player toward the Reserve Map once they've checked every point
// in a scene that turns out to have no frog in it — a nudge to try
// somewhere else rather than re-clicking the same two spots.
function updateSceneMapPulse() {
  const scene = state.scenes[state.currentSceneIdx];
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
  hideHintNow(); // in case a hint was left open from a prior mouse hover on a hybrid touch/mouse device

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

// ===================== Quiz: click/keyboard answer =====================
// Native drag (mouse) and startTouchDrag() (finger) both require following a
// path from label to drop-field — WCAG 2.5.1 (Pointer Gestures) requires a
// single-tap/click alternative that doesn't need that path, and 2.1.1
// (Keyboard) requires the whole thing work without a pointer at all.
// Keyboard (Enter/Space on a focused label, handled directly in the keydown
// listener below) still answers in one step — the two-step "select, then
// place" was tried first, user-tested, and found less intuitive than
// expected for keyboard use. A real click (mouse or touch), though, now
// needs a second click on the same label to confirm (selectQuizLabel()) —
// added 2026-09-17 after a misclick concern (a student's stray tap/cursor
// slip shouldn't be able to submit an answer outright the way a deliberate
// Tab-then-Enter can). Tabbing to a label already previews its hint
// (focus/blur → showHint()/hideHint(), below), so keyboard users aren't
// missing a "look before you commit" step either way.

// Fisher-Yates — used to randomize the quiz's on-screen label order every
// time it opens (2026-09-22). Every reserve's quizLabelIds happens to be
// authored with the correct species first (a byproduct of how each
// reserve's distractors were picked and confirmed), and nothing shuffled
// the render order, so the correct answer was landing in the leftmost
// position almost every time — a learnable position pattern that defeats
// the point of an identification quiz. Returns a new array rather than
// shuffling in place, since state.quizLabelIds is also read elsewhere
// (e.g. the hint-box height measurement, where order doesn't matter, but
// an unexpected in-place mutation of shared state still would be a
// surprise there).
function shuffleArray(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function openQuiz() {
  const quizBg = document.getElementById("quiz-bg");
  quizBg.className = "scene-bg dim";
  setPhotoBg(quizBg, state.scenes[state.currentSceneIdx].photo);
  const targetSp = SPECIES[state.targetSpecies];
  document.getElementById("quiz-frog-photo").innerHTML = `
    <img src="${targetSp.photo}" alt="${targetSp.name}">
    ${targetSp.callAudio ? `<button class="sound-btn frog-photo-sound" data-audio="${targetSp.callAudio}" title="Play call">${SOUND_ICON_HTML}</button>` : ""}
  `;
  stopPreviewAudio();

  const dropField = document.getElementById("drop-field");
  dropField.dataset.state = "empty";
  dropField.innerHTML = '<span class="drop-hint">Drag frog name here</span>';

  const row = document.getElementById("label-row");
  row.innerHTML = "";
  // Tracks which label a real (mouse/touch) click has selected but not yet
  // confirmed — local to this attempt, since row.innerHTML is rebuilt fresh
  // every time the quiz opens/retries. Confirmed either by clicking that
  // same label again (its own click listener below) or by clicking the
  // drop field (dropField.onclick below) — both call confirmSelected().
  let selectedQuizLabel = null;
  function confirmSelected() {
    if (!selectedQuizLabel) return;
    const el = selectedQuizLabel;
    el.classList.remove("selected");
    el.setAttribute("aria-pressed", "false");
    selectedQuizLabel = null;
    handleGuess(el.dataset.id);
  }
  function selectQuizLabel(el) {
    if (selectedQuizLabel && selectedQuizLabel !== el) {
      selectedQuizLabel.classList.remove("selected");
      selectedQuizLabel.setAttribute("aria-pressed", "false");
    }
    selectedQuizLabel = el;
    el.classList.add("selected");
    el.setAttribute("aria-pressed", "true");
  }
  shuffleArray(state.quizLabelIds).forEach(id => {
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
      // Hidden explicitly (and immediately, not the delayed hideHint()) here
      // rather than relying on the mouseleave below — whether starting a
      // native drag also fires a mouseleave on the source element turns out
      // to be inconsistent across browsers, so this is the one path
      // guaranteed to run the moment a drag begins.
      hideHintNow();
      // A pending click-selection on a *different* label would otherwise be
      // left visually "selected" while this one gets dragged instead —
      // clear it so the highlight doesn't linger on the wrong label.
      if (selectedQuizLabel && selectedQuizLabel !== el) {
        selectedQuizLabel.classList.remove("selected");
        selectedQuizLabel.setAttribute("aria-pressed", "false");
        selectedQuizLabel = null;
      }
    });
    el.addEventListener("dragend", () => el.classList.remove("dragging"));
    el.addEventListener("mouseenter", () => showHint(sp.hint, el));
    el.addEventListener("mouseleave", hideHint);
    el.addEventListener("focus", () => showHint(sp.hint, el));
    el.addEventListener("blur", hideHint);
    if (!isCrossed) el.addEventListener("pointerdown", e => startTouchDrag(e, el, id));
    if (isCrossed) {
      // Kept focusable/announced rather than removed from the tab order
      // entirely — a keyboard user should be able to discover *why* one of
      // the 4 options doesn't respond, not just find it silently missing.
      makeKeyboardClickable(el, `${sp.name}, already ruled out`);
      el.setAttribute("aria-disabled", "true");
    } else {
      // Not makeKeyboardClickable() here — that helper re-fires a click via
      // el.click() on Enter/Space, which would make a keyboard answer
      // indistinguishable from a real click and pull it into the
      // select-then-confirm flow below too. Wired directly instead, so
      // keyboard keeps answering in one step regardless of what the click
      // listener does.
      el.tabIndex = 0;
      el.setAttribute("role", "button");
      el.setAttribute("aria-pressed", "false");
      el.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          handleGuess(id);
        }
      });
      el.addEventListener("click", () => {
        if (el.classList.contains("selected")) { confirmSelected(); return; }
        selectQuizLabel(el);
      });
    }
    row.appendChild(el);
  });

  dropField.ondragover = e => { e.preventDefault(); dropField.dataset.state = "over"; };
  dropField.ondragleave = () => { dropField.dataset.state = "empty"; };
  dropField.ondrop = e => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    handleGuess(id);
  };
  // Second way to confirm a click-selected label (alongside clicking that
  // same label again) — matches what the drop field already invites
  // ("Drag frog name here"), so a click-to-select user has an obvious
  // target to click to place it, not just the original label. A no-op if
  // nothing's selected (e.g. this was just a stray click on the field).
  dropField.onclick = confirmSelected;

  document.getElementById("buzz-overlay").hidden = true;
  // Reset the stagger reveal *before* the screen becomes visible — see
  // resetStagger()'s own comment for why this can't happen after
  // showScreen() without reopening a paint race on a second-or-later open.
  resetStagger("quiz", ".frog-card", ".quiz-bottom-band");
  showScreen("quiz");
  // Same "screen hides, focus silently blurs to <body>" fix as
  // showSuccess()/showFail() — lands on the question heading.
  document.getElementById("frog-card-title").focus();
  // Paired with the frog card popping in immediately below, not the
  // hotspot click itself (onHotspotClick() calls this function right after
  // that click, so the gap is imperceptible either way).
  playFeedbackSound(FROG_FOUND_SOUND);
  // Immediate wave = the frog card (title, photo, drop field — it now
  // includes the "Which frog is calling?" heading, moved in on 2026-09-02).
  // Delayed wave = the bottom band's species labels — carries
  // stagger-motion in the HTML so it pops like the first wave does, unlike
  // the Field Guide's fade-only second wave, since labels are quiz content,
  // not just chrome/controls.
  runStagger("quiz", ".frog-card", ".quiz-bottom-band");
}

// Cached the first time it's needed. All 4 quiz hint boxes are held to this
// height (see showHint()) so hovering different labels doesn't resize the
// box — measured from whichever of the 4 quiz species' hints renders
// tallest (currently Brown Tree Frog, with 4 bullets vs. 3 for the others)
// rather than a guessed or hardcoded species, so it stays correct if the
// hint content changes again later.
// Shared by showHint() and the measurement probe below, so the "Hints"
// title can't end up in one and not the other and throw off the measured
// height.
function hintHtml(hint) {
  return `
    <div class="hint-title">Hints</div>
    <ul class="hint-list">${hint.map(line => `<li>${line}</li>`).join("")}</ul>
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
  band.appendChild(probe);
  hintBoxMinHeight = Math.max(...state.quizLabelIds.map(id => {
    probe.innerHTML = hintHtml(SPECIES[id].hint);
    return probe.offsetHeight;
  }));
  probe.remove();
  return hintBoxMinHeight;
}

function showHint(hint, labelEl) {
  clearTimeout(hintHideTimer); // cancel any pending delayed hide from a label just left
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
// WCAG 1.4.13 (Content on Hover or Focus) — "Hoverable": a mouse user needs
// to be able to move the pointer off the label and onto the hint box itself
// (e.g. to read it more closely, or select its text) without it vanishing.
// A short delay, canceled if the pointer/focus lands on the box or another
// label before it elapses, gives that window. hideHint() is what
// mouseleave/blur call; hideHintNow() (below) is for call sites that need
// an immediate, non-cancelable hide (e.g. right as a drag starts).
let hintHideTimer = null;
function hideHint() {
  clearTimeout(hintHideTimer);
  hintHideTimer = setTimeout(hideHintNow, 200);
}
function hideHintNow() {
  clearTimeout(hintHideTimer);
  document.getElementById("hint-box").hidden = true;
}
document.getElementById("hint-box").addEventListener("mouseenter", () => clearTimeout(hintHideTimer));
document.getElementById("hint-box").addEventListener("mouseleave", hideHint);
// "Dismissible": Escape closes the hint immediately regardless of where
// hover/focus currently is.
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !document.getElementById("hint-box").hidden) hideHintNow();
});

function handleGuess(id) {
  if (id === state.targetSpecies) {
    onCorrectGuess();
  } else {
    onWrongGuess(id);
  }
}

const CORRECT_GUESS_SOUND = "../assets/overlays/feedback-sounds/correct answer.mp3";
const INCORRECT_GUESS_SOUND = "../assets/overlays/feedback-sounds/Incorrect Answer.mp3";
const WALKING_SOUND = "../assets/overlays/feedback-sounds/walking.mp3";
const FROG_ESCAPE_SOUND = "../assets/overlays/feedback-sounds/frog_escape.mp3";
const FROG_FOUND_SOUND = "../assets/overlays/feedback-sounds/frog_found.mp3";
const OPEN_BOOK_SOUND = "../assets/overlays/feedback-sounds/open_book.mp3";
const PAGE_TURN_SOUND = "../assets/overlays/feedback-sounds/page_turn.mp3";
// Added 2026-09-21. OPEN_RESERVE_MAP_SOUND covers every "open the reserve
// map" action regardless of which screen it's triggered from (the scene's
// own "Reserve Map" button, and the Fail screen's "Open the Reserve's Map"
// button — confirmed with the user both should share this sound since it's
// the same destination/action either way). MAP_OVERVIEW_OPEN_SOUND plays on
// every Map Overview pin click, including the "revisit an already-completed
// reserve" shortcut that skips straight to Success without ever showing the
// reserve map — confirmed with the user this should still play, since it
// marks "you selected a reserve" rather than "you're now looking at a
// reserve map". MAP_OVERVIEW_RETURN_SOUND covers every "back to the Map
// Overview" action (the reserve screen's "Main Map" button and the success
// screen's "Return to Main Map" button — also confirmed to share the sound
// despite the different label).
const OPEN_RESERVE_MAP_SOUND = "../assets/overlays/feedback-sounds/open_reserve_map.mp3";
const MAP_OVERVIEW_OPEN_SOUND = "../assets/overlays/feedback-sounds/map_o_open.mp3";
const MAP_OVERVIEW_RETURN_SOUND = "../assets/overlays/feedback-sounds/map_o_return.mp3";

// One-shot feedback stings — not looped, plays alongside whatever else is
// already playing (scene ambient, frog-call preview) rather than pausing it.
// Shared by every one-shot "event just happened" sound in the app (guess
// results, reserve-map navigation, the frog found/escaped moments, opening
// the Field Guide, turning its pages) — none of these are expected to
// overlap in practice (different screens, or sequenced far enough apart),
// and where a later one *could* land while an earlier one is still playing,
// cutting the earlier one off to start the new one is the right call, same
// as it already was for guess results vs. reserve-map walking.
// button_hover.mp3 is deliberately NOT on this channel — see hover-audio /
// HOVER_SOUND_SELECTOR below — a stray mouse hover shouldn't be able to cut
// one of these more meaningful stings off early.
function playFeedbackSound(src) {
  const audio = document.getElementById("feedback-audio");
  audio.pause();
  audio.src = src;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

// ===================== Interactive-element hover sound =====================
// button_hover.mp3 — a short blip when a real mouse pointer enters any
// interactive element in the experience: every nav/CTA/icon button (except
// the Field Guide's own Close button, which gets a click sound instead —
// see its handler below), "play call" buttons, the quiz's draggable
// species labels, unlocked Map Overview pins, reserve-map scene points, and
// the quiz drop field. Confirmed with the user 2026-09-17 as the broadest
// of 3 scope options discussed, deliberately including the map/scene
// markers even though they already have their own visual hover feedback
// (scale/opacity/pulse) — then narrowed 2026-09-21 to drop scene hotspots
// (the in-scene eye icons) specifically, per user feedback that they didn't
// want a hover blip while searching a scene. The Field Guide's page-turn
// arrows (desktop and mobile) are excluded too, per the same 2026-09-17
// follow-up — they don't need a hover blip.
// One delegated listener on `document` (pointerover bubbles; mouseenter/
// mouseleave don't, which is why those aren't used here) rather than one
// per element — besides being far less code, this automatically covers
// every element in HOVER_SOUND_SELECTOR that's created dynamically after
// page load (species labels, hotspots, map-points), with nothing extra to
// wire up wherever those get built.
// pointerType-gated to "mouse" only — hover has no real equivalent on
// touch/pen, and without this guard a tap would fire both this blip and
// whatever sound that tap's own action already plays.
const HOVER_SOUND_SELECTOR = '.icon-btn:not([data-action="close-fieldguide"]), .action-btn, .sound-btn, .species-label, .pin.unlocked, .map-point, #drop-field';
let hoveredSoundEl = null;
document.addEventListener("pointerover", e => {
  if (e.pointerType !== "mouse") return;
  const target = e.target.closest(HOVER_SOUND_SELECTOR);
  // The `!== hoveredSoundEl` check stops this from re-firing on every
  // pointerover bubbled up from a sub-element inside the same match (e.g.
  // moving from a button's icon to its label text) — only a genuine move
  // into a *different* matched element plays the sound again.
  if (!target || target === hoveredSoundEl) return;
  hoveredSoundEl = target;
  // #hover-audio's src is fixed in index.html (only ever plays this one
  // sound), so just reset and replay it.
  const audio = document.getElementById("hover-audio");
  audio.pause();
  audio.currentTime = 0;
  audio.play().catch(() => {});
});
document.addEventListener("pointerout", e => {
  if (e.pointerType !== "mouse" || !hoveredSoundEl) return;
  if (e.target.closest(HOVER_SOUND_SELECTOR) !== hoveredSoundEl) return;
  // relatedTarget is where the pointer actually went — if it's still
  // somewhere inside the same matched element, this isn't a real exit yet.
  if (!e.relatedTarget || !hoveredSoundEl.contains(e.relatedTarget)) {
    hoveredSoundEl = null;
  }
});

function onCorrectGuess() {
  playFeedbackSound(CORRECT_GUESS_SOUND);
  const dropField = document.getElementById("drop-field");
  dropField.dataset.state = "filled";
  dropField.textContent = SPECIES[state.targetSpecies].name;
  // Correct/incorrect otherwise only ever showed as a visual/audio cue
  // (drop-field text, buzz overlay, feedback sound) — nothing told a screen
  // reader what happened. This is a quick confirmation for the moment the
  // guess lands; showSuccess() (500ms later) gives the fuller detail once
  // focus actually moves to the new screen.
  document.getElementById("quiz-live-status").textContent = `Correct! ${SPECIES[state.targetSpecies].name} is calling here.`;
  state.fieldGuideUnlocked.add(state.targetSpecies);
  state.completedReserves.add(state.currentReserveId);
  state.discoveredSceneIdx = state.currentSceneIdx;
  updateFoundPins();
  setTimeout(showSuccess, 500);
}

// Turns the just-completed reserve's own Map Overview pin label green —
// data-park scopes this to whichever reserve was actually just finished
// (state.currentReserveId), not a single hardcoded reserve, so this needs
// no changes as further reserves are wired in.
function updateFoundPins() {
  const pin = document.querySelector(`.pin[data-park="${state.currentReserveId}"]`);
  if (pin) pin.classList.toggle("found", state.completedReserves.has(state.currentReserveId));
}

function onWrongGuess(id) {
  playFeedbackSound(INCORRECT_GUESS_SOUND);
  state.crossedOut.add(id);
  const label = document.querySelector(`.species-label[data-id="${id}"]`);
  if (label) label.classList.add("crossed-out"), (label.draggable = false);
  document.getElementById("quiz-live-status").textContent = `Not quite — ${SPECIES[id].name} has been ruled out.`;
  const buzz = document.getElementById("buzz-overlay");
  buzz.hidden = false;
  setTimeout(() => {
    buzz.hidden = true;
    showFail();
  }, 1400);
}

// ===================== Success / Fail =====================
// `useTransition` (only passed true from enterPark()'s revisit-an-
// already-found-reserve path) gives that specific hop the same zoom-fade
// "diving in" feel Map Overview → Reserve Map already has — deliberately
// scoped to just that path; the first-time win via the quiz stays an
// instant reveal, unchanged.
function showSuccess(useTransition) {
  stopPreviewAudio();
  const sp = SPECIES[state.targetSpecies];
  const successBg = document.getElementById("success-bg");
  successBg.className = "scene-bg dim";
  setPhotoBg(successBg, state.scenes[state.currentSceneIdx].photo);
  document.getElementById("success-photo").innerHTML = `
    <img src="${sp.photo}" alt="${sp.name}">
    ${sp.callAudio ? `<button class="sound-btn frog-photo-sound" data-audio="${sp.callAudio}" title="Play call">${SOUND_ICON_HTML}</button>` : ""}
  `;
  document.getElementById("success-species").textContent = `${sp.name} (${sp.latin})`;
  document.getElementById("success-text").textContent = "Woohoo! You have found the";
  // The screen this came from is now hidden (display:none), which silently
  // blurs focus to <body> with no cue anything changed — land on the
  // result text instead (already tabindex="-1" for this reason).
  const focusResult = () => document.getElementById("success-text").focus();
  if (useTransition) {
    transitionShowScreen("success", "zoom-fade", focusResult);
  } else {
    showScreen("success");
    focusResult();
  }
}

document.querySelector('[data-action="return-map"]').addEventListener("click", () => {
  // Shares MAP_OVERVIEW_RETURN_SOUND with the reserve screen's "Main Map"
  // button (data-goto="map" above) — confirmed with the user despite the
  // different label, since both land back on the Map Overview.
  playFeedbackSound(MAP_OVERVIEW_RETURN_SOUND);
  stopCallTone();
  stopSceneMedia();
  // Missing here was the actual bug: showSuccess()/showFail() both already
  // stop a mid-preview sound-button playback on entry, but this was the one
  // screen-leaving action that never stopped one on exit — a preview
  // started on the success screen's frog photo kept playing right through
  // the zoom-out into the Map Overview and beyond.
  stopPreviewAudio();
  transitionShowScreen("map", "zoom-out", onArriveAtMapOverview);
});

function showFail() {
  stopPreviewAudio();
  // Paired with the "frog has fled" image reveal on this screen — already
  // well after Incorrect Answer.mp3 (played in onWrongGuess(), 0.86s long)
  // has finished by the time this runs 1.4s later, so it naturally lands
  // "after" that sound without needing to explicitly chain the two.
  playFeedbackSound(FROG_ESCAPE_SOUND);
  const failBg = document.getElementById("fail-bg");
  failBg.className = "scene-bg dim";
  setPhotoBg(failBg, state.scenes[state.currentSceneIdx].photo);
  // Deliberately doesn't reveal which species was correct — a wrong guess
  // shouldn't hand the player the answer, since they can keep guessing.
  // Relocate the frog to a different point, preferably a different scene
  const currentKey = state.targetHotspotKey;
  const otherSceneKeys = allHotspotKeys().filter(k => !k.startsWith(`${state.currentSceneIdx}:`));
  const pool = otherSceneKeys.length ? otherSceneKeys : allHotspotKeys().filter(k => k !== currentKey);
  state.targetHotspotKey = pool[Math.floor(Math.random() * pool.length)];
  showScreen("fail");
  // Same reasoning as showSuccess()'s focus move.
  document.getElementById("fail-text").focus();
}

document.querySelector('[data-action="open-park-map"]').addEventListener("click", () => {
  // Shares OPEN_RESERVE_MAP_SOUND with the scene's "Reserve Map" button
  // (data-goto="park" above) — confirmed with the user, since both open the
  // same reserve map despite the different label/screen.
  playFeedbackSound(OPEN_RESERVE_MAP_SOUND);
  stopSceneMedia();
  renderScenePoints();
  transitionShowScreen("park", "fade", () => document.getElementById("park-title").focus());
});

// ===================== Field Guide =====================
// openToPage optionally overrides the usual "land on the current target
// species" default — used by the endgame card to jump straight to
// References instead (FIELD_GUIDE_PAGES, not FIELD_GUIDE_ORDER, since only
// the former includes "references"; every species id's index is identical
// in both lists, so the default case is unaffected).
function openFieldGuide(openToPage) {
  state.fgIdx = FIELD_GUIDE_PAGES.indexOf(openToPage || state.targetSpecies);
  renderFieldGuide();
  renderFieldGuideMobile();

  // Draws attention to "download a copy" once the endgame card has sent
  // the player here — persists across every Field Guide open (not reset
  // per-open) until Print is actually clicked once, see the
  // print-fieldguide click handler below.
  document.querySelector('[data-action="print-fieldguide"]').classList.toggle("pulse-hint", state.printPulseActive);

  // Field guide overlays onto whichever screen it was opened from, dimmed —
  // same pattern as the quiz screen's backdrop.
  // Only "map" and "success" are reachable now that the Field Guide button
  // is hidden everywhere else (park/scene) — the "park"/"scene" backdrop
  // cases this used to branch on can no longer happen.
  const fgBg = document.getElementById("fg-bg");
  fgBg.className = "scene-bg dim";
  const bgPhoto = state.returnScreen === "success"
    ? state.scenes[state.currentSceneIdx].photo
    : "../assets/scenes/victoria-map-overview.jpg";
  setPhotoBg(fgBg, bgPhoto);

  // Immediate wave = the book (desktop) / the scrollable sheet column + its
  // empty-state overlay (mobile, a sibling of the scroll column rather than
  // a descendant, so it carries the class too, in index.html — see
  // runStagger()). Delayed wave = Close, Print, and whichever page-turn
  // arrow pair is actually visible at the current breakpoint (the other
  // pair is harmlessly matched too, already hidden) — fade-only, the
  // quieter chrome treatment for controls (no stagger-motion in the HTML
  // for these, unlike the quiz's labels).
  const fgStaggerImmediate = "#fg-book, #fg-mobile-scroll, #fg-mobile-empty-overlay";
  const fgStaggerDelayed = "#screen-fieldguide .icon-btn.top-right, #fg-prev, #fg-next, #fg-mobile-up, #fg-mobile-down";
  // Reset the stagger reveal *before* the screen becomes visible — see
  // resetStagger()'s own comment for why this can't happen after
  // showScreen() without reopening a paint race on a second-or-later open.
  resetStagger("fieldguide", fgStaggerImmediate, fgStaggerDelayed);
  showScreen("fieldguide");
  // The screen this was opened from just got hidden (display:none), which
  // silently blurs focus to <body> with no cue anything changed — focus
  // the (visually hidden) heading instead so a screen reader announces
  // "Field Guide" right away.
  document.getElementById("fg-heading").focus();
  // Paired with the book/sheet-column popping in immediately below —
  // plays regardless of which layout (desktop book vs. mobile sheets) is
  // actually shown, since both pop in from the same runStagger() call.
  playFeedbackSound(OPEN_BOOK_SOUND);
  runStagger("fieldguide", fgStaggerImmediate, fgStaggerDelayed);
}
document.querySelector('[data-action="close-fieldguide"]').addEventListener("click", () => {
  // Reuses open_book.mp3 rather than a distinct "close" sound — confirmed
  // as the intended choice, not a placeholder — instead of the hover blip
  // this button would otherwise get (excluded from HOVER_SOUND_SELECTOR).
  playFeedbackSound(OPEN_BOOK_SOUND);
  stopPreviewAudio();
  const returnScreen = state.returnScreen || "map";
  showScreen(returnScreen);
  // Same reasoning as the focus move on open, in reverse — land on
  // whichever heading/text is the natural orientation point for wherever
  // we're returning to, rather than losing focus to <body>.
  const anchor = document.getElementById(returnScreen === "success" ? "success-text" : "map-title");
  if (anchor) anchor.focus();
});

// One-shot audio preview system, shared by every "play this frog's call"
// button (Field Guide facts page, quiz frog photo) — a single <audio>
// element and one delegated click handler rather than duplicating the
// play/stop toggle per screen. Buttons opt in via the shared .sound-btn
// class plus a data-audio URL; only species with a real recording
// (SPECIES[..].callAudio) get a button rendered at all.
const SOUND_ICON_HTML = '<img src="../assets/buttons/Btn_Sound.png" alt="Play call">';
const SOUND_STOP_ICON = "⏹";

// Field Guide buttons carry a data-species-name attribute (set in
// fgFactsHtml() only — not the quiz/success buttons) so this shared handler
// can give just that one button a species-specific name ("Play Southern
// Bell Frog call") while the quiz/success buttons keep the generic "Play
// call" — same shared audio/toggle logic either way, just a different name.
function soundIconHtml(label) {
  return `<img src="../assets/buttons/Btn_Sound.png" alt="${label}">`;
}

function resetSoundButtons() {
  document.querySelectorAll(".sound-btn.playing").forEach(b => {
    b.classList.remove("playing");
    const name = b.dataset.speciesName;
    if (name) {
      b.innerHTML = soundIconHtml(`Play ${name} call`);
      b.setAttribute("aria-label", `Play ${name} call`);
    } else {
      b.innerHTML = SOUND_ICON_HTML;
      b.setAttribute("aria-label", "Play call");
    }
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
  // Set explicitly (aria-label wins over text-content in accessible-name
  // computation) so a screen reader announces "Stop call" (or, for the
  // Field Guide's button, "Stop [Species] call"), not the "⏹" glyph left
  // behind once the play icon's <img alt="..."> is gone.
  const name = btn.dataset.speciesName;
  btn.setAttribute("aria-label", name ? `Stop ${name} call` : "Stop call");
});
document.getElementById("preview-audio").addEventListener("ended", resetSoundButtons);
document.querySelector('[data-action="print-fieldguide"]').addEventListener("click", () => {
  // Stops the endgame card's pulse-hint for good once Print is actually
  // clicked once — confirmed with the user this shouldn't come back even
  // on a later Field Guide open, including one reached via reopening the
  // endgame card itself (see printClickedOnce in the endgame-view-btn
  // handler above).
  state.printPulseActive = false;
  state.printClickedOnce = true;
  document.querySelector('[data-action="print-fieldguide"]').classList.remove("pulse-hint");
  // Print isn't just the on-screen 2-frog spread — build every species (in
  // its current locked/unlocked state) plus the References entry, one page
  // per sheet. visibleFieldGuidePages() leaves References out of the
  // printed set too if nothing's been found yet, matching what's actually
  // reachable on screen at print time.
  const printPages = document.getElementById("fg-print-pages");
  printPages.innerHTML = visibleFieldGuidePages()
    .map(id => `<div class="fg-print-page">${id === "references" ? fgReferencesPageHtml() : fgPageHtml(id)}</div>`)
    .join("");
  window.print();
});
window.addEventListener("afterprint", () => {
  document.getElementById("fg-print-pages").innerHTML = "";
});
// Simple opacity dip to simulate a page turn on the desktop book (fg-prev/
// fg-next only — the mobile paper-sheet view scrolls rather than swapping
// page content, so there's nothing to fade there). Fades both pages out,
// swaps the content (renderFieldGuide()) while invisible, then lets the
// same CSS transition fade them back in when .fg-page-turning is removed.
const FG_PAGE_TURN_FADE_MS = 150;
// Ignores a click that lands while a turn is already mid-fade-out, rather
// than letting a second call queue its own setTimeout — without this, a
// second click inside the first click's 150ms window would render its page
// while the *first* click's fade-in was still only partway through,
// making that swap visible instead of hidden. Cleared once the content
// swap happens, not after the fade-in visually finishes, so a fast but not
// overlapping run of clicks (each after the previous one's swap) still
// feels responsive rather than rate-limited.
let fgPageTurning = false;
function turnFieldGuidePage(dir) {
  if (fgPageTurning) return;
  fgPageTurning = true;
  playFeedbackSound(PAGE_TURN_SOUND);
  const left = document.getElementById("fg-page-left");
  const right = document.getElementById("fg-page-right");
  left.classList.add("fg-page-turning");
  right.classList.add("fg-page-turning");
  setTimeout(() => {
    const total = visibleFieldGuidePages().length;
    state.fgIdx = (state.fgIdx + dir + total) % total;
    renderFieldGuide();
    announceFieldGuidePage();
    left.classList.remove("fg-page-turning");
    right.classList.remove("fg-page-turning");
    fgPageTurning = false;
  }, FG_PAGE_TURN_FADE_MS);
}
document.getElementById("fg-prev").addEventListener("click", () => turnFieldGuidePage(-1));
document.getElementById("fg-next").addEventListener("click", () => turnFieldGuidePage(1));

// Each species now gets its own two-page spread on screen — facts (photo,
// calling period, conservation status) on the left, the descriptive text
// (species description, habitat) on the right — instead of the previous
// one-page-per-species layout, so a long description no longer needs to
// scroll. The References entry (FIELD_GUIDE_PAGES' final stop) follows the
// same facts/story split — citations on the left, asset/audio credits on
// the right. Print is unaffected: it still uses fgPageHtml()/
// fgReferencesPageHtml() to build one full page per entry, matching the
// original on-screen layout.
//
// Book page numbers are plain sequential physical-page numbers (1–14 for
// the 7 species, 15–16 for References once it's reachable at all — see
// visibleFieldGuidePages()) rather than "X of Y" — one spread is 2 pages,
// left = odd, right = even — unlike the mobile/print page numbers
// (fgPageHtml()/fgReferencesPageHtml()), which read "X of 7" until a
// species is found and "X of 8" after, since each of those genuinely
// renders as a single page per entry.
function renderFieldGuide() {
  stopPreviewAudio();
  const id = visibleFieldGuidePages()[state.fgIdx];
  if (id === "references") {
    document.getElementById("fg-page-left").innerHTML = fgReferencesFactsHtml();
    document.getElementById("fg-page-right").innerHTML = fgReferencesStoryHtml();
  } else {
    document.getElementById("fg-page-left").innerHTML = fgFactsHtml(id);
    document.getElementById("fg-page-right").innerHTML = fgStoryHtml(id);
  }
  document.getElementById("fg-empty-overlay").hidden = state.fieldGuideUnlocked.size > 0;
  document.getElementById("fg-page-num-left").textContent = state.fgIdx * 2 + 1;
  document.getElementById("fg-page-num-right").textContent = state.fgIdx * 2 + 2;
}

// Turning a page (fg-prev/fg-next) swaps the visible content silently —
// nothing else signals a screen reader that anything changed. A short,
// separate aria-live announcement (not making the page content itself
// live) so each turn reads one concise line rather than the whole entry.
// Only called from the prev/next handlers below, not from the initial
// openFieldGuide() render — that already gets a clear announcement via
// focus moving to #fg-heading, so this would just double up on it.
function announceFieldGuidePage() {
  const pages = visibleFieldGuidePages();
  const id = pages[state.fgIdx];
  const name = id === "references" ? "References" : (state.fieldGuideUnlocked.has(id) ? SPECIES[id].name : "Not yet discovered");
  document.getElementById("fg-live-status").textContent =
    `${name}, page ${state.fgIdx + 1} of ${pages.length}`;
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
    <div class="fg-photo"><img src="${sp.photoFull}" alt="${sp.name}"></div>
    <div class="fg-name-row">
      <h2 class="fg-name">${sp.name}</h2>
      ${sp.callAudio ? `<button class="sound-btn fg-sound-btn" data-audio="${sp.callAudio}" data-species-name="${sp.name}" title="Play ${sp.name} call">${soundIconHtml(`Play ${sp.name} call`)}</button>` : ""}
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

// ===================== Field Guide: References =====================
// A fixed, non-species entry appended after the last species (see
// FIELD_GUIDE_PAGES above). Originally always shown regardless of discovery
// progress; changed 2026-09-18 so it's skipped from the navigable set
// entirely (visibleFieldGuidePages()) until at least one species has been
// found, at the user's request — the empty-state overlay's shrink to a
// small card (earlier the same day) meant a player could flip to it and
// peek at real citations before finding anything, which wasn't intended
// once the overlay stopped fully blocking the page behind it.
function referenceListHtml(items, withNames) {
  return `<ul class="fg-ref-list">${items.map(r => `
    <li>${withNames && r.id ? `<strong>${SPECIES[r.id].name}:</strong> ` : ""}${r.citation} <a href="${r.url}" target="_blank" rel="noopener">${r.url}</a></li>
  `).join("")}</ul>`;
}
// Left page (book) / first half (mobile+print, via fgReferencesPageHtml):
// the species profile citations, one per FrogID page.
function fgReferencesFactsHtml() {
  return `
    <h2 class="fg-name">References</h2>
    <div class="fg-field">
      <div class="fg-field-label">Species Profiles</div>
      ${referenceListHtml(FIELD_GUIDE_REFERENCES.species, true)}
    </div>
  `;
}
// Right page (book) / second half (mobile+print): credits for the tools
// used to generate the prototype's other assets, not species content.
function fgReferencesStoryHtml() {
  return `
    <div class="fg-field">
      <div class="fg-field-label">Asset Generation</div>
      ${referenceListHtml(FIELD_GUIDE_REFERENCES.assetGeneration, false)}
    </div>
    <div class="fg-field">
      <div class="fg-field-label">Additional Audio Source</div>
      ${referenceListHtml(FIELD_GUIDE_REFERENCES.audioSources, false)}
    </div>
  `;
}
// Mobile sheet / print page: both halves combined onto one page, since
// those views render one page per entry rather than a facts/story spread.
function fgReferencesPageHtml() {
  // Only ever rendered once References is actually unlocked/visible, so
  // visibleFieldGuidePages() here always equals the full FIELD_GUIDE_PAGES
  // — using the helper anyway for consistency with fgPageHtml() below.
  const pages = visibleFieldGuidePages();
  const pageNum = `<div class="fg-page-num">${pages.indexOf("references") + 1} of ${pages.length}</div>`;
  return `
    <h2 class="fg-name">References</h2>
    <div class="fg-field">
      <div class="fg-field-label">Species Profiles</div>
      ${referenceListHtml(FIELD_GUIDE_REFERENCES.species, true)}
    </div>
    <div class="fg-field">
      <div class="fg-field-label">Asset Generation</div>
      ${referenceListHtml(FIELD_GUIDE_REFERENCES.assetGeneration, false)}
    </div>
    <div class="fg-field">
      <div class="fg-field-label">Additional Audio Source</div>
      ${referenceListHtml(FIELD_GUIDE_REFERENCES.audioSources, false)}
    </div>
    ${pageNum}
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
  // Shared by both the mobile paper-sheet view and the print PDF, since
  // both render through this same function. Bottom corner, per species'
  // position in FIELD_GUIDE_ORDER (not tied to locked/unlocked state) —
  // the *total* does depend on discovery progress though, via
  // visibleFieldGuidePages() (excludes References until something's found).
  const pages = visibleFieldGuidePages();
  const pageNum = `<div class="fg-page-num">${pages.indexOf(id) + 1} of ${pages.length}</div>`;
  const calling = unlocked ? callingPeriodParts(sp) : null;
  if (!unlocked) {
    return `
      <div class="fg-locked-photo">?</div>
      <h2 class="fg-name">???</h2>
      <p class="fg-latin">&nbsp;</p>
      <div class="fg-field">
        <p class="calling-period-text"><span class="fg-field-label">Calling Period:</span> ???</p>
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
      ${pageNum}
    `;
  }
  return `
    <div class="fg-photo"><img src="${sp.photoFull}" alt="${sp.name}"></div>
    <h2 class="fg-name">${sp.name}</h2>
    <p class="fg-latin">${sp.latin}</p>
    <div class="fg-field">
      <p class="calling-period-text"><span class="fg-field-label">${calling.label}:</span> ${calling.months}</p>
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
    ${pageNum}
  `;
}

// ===================== Field Guide: small-screen paper-sheet view =====================
// Below 769px the two-page book is swapped for one paper-textured sheet per
// species (see styles.css), stacked in a single scrollable column instead of
// a facts/story spread — same content grouping as the print layout, so this
// reuses fgPageHtml() rather than duplicating markup. Rebuilt fresh each time
// the Field Guide opens; unlocked species can't change while it's open, so no
// separate live-update path is needed.
function renderFieldGuideMobile() {
  const container = document.getElementById("fg-mobile-scroll");
  container.innerHTML = visibleFieldGuidePages()
    .map(id => `<div class="fg-sheet">${id === "references" ? fgReferencesPageHtml() : fgPageHtml(id)}</div>`)
    .join("");
  document.getElementById("fg-mobile-empty-overlay").hidden = state.fieldGuideUnlocked.size > 0;
  container.scrollTop = 0;
}

// Jumps to the previous/next full sheet (by measured position, not a fixed
// pixel amount) since a locked "???" sheet is much shorter than an unlocked
// one — mirrors how the book's own page arrows step by whole page.
function scrollFieldGuideMobile(dir) {
  const container = document.getElementById("fg-mobile-scroll");
  const sheets = [...container.querySelectorAll(".fg-sheet")];
  if (!sheets.length) return;
  const pos = container.scrollTop;
  let target;
  if (dir > 0) {
    target = sheets.find(el => el.offsetTop > pos + 4) || sheets[sheets.length - 1];
  } else {
    const before = sheets.filter(el => el.offsetTop < pos - 4);
    target = before.length ? before[before.length - 1] : sheets[0];
  }
  container.scrollTo({ top: target.offsetTop, behavior: "smooth" });
}
document.getElementById("fg-mobile-up").addEventListener("click", () => { playFeedbackSound(PAGE_TURN_SOUND); scrollFieldGuideMobile(-1); });
document.getElementById("fg-mobile-down").addEventListener("click", () => { playFeedbackSound(PAGE_TURN_SOUND); scrollFieldGuideMobile(1); });

// ===================== Frog call (looping search audio) =====================
// Prefers the target species' real call recording (SPECIES[..].callAudio)
// when one has been supplied; falls back to a synthesized placeholder tone
// for species that don't have a recording yet (per the GDD's data-driven
// design, other parks/species can be added before their audio is ready).
function startCallTone() {
  stopCallTone();
  if (state.audioMuted) return;
  const sp = SPECIES[state.targetSpecies];
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

// WCAG 1.4.2 (Audio Control): both the ambient background track and the
// frog-call search tone auto-play and can run well past 3 seconds with no
// other way to stop them, so a single mute button covers both together as
// "this scene's sound" rather than adding two separate controls. State is a
// simple session-wide preference — it isn't reset per-scene, so muting
// doesn't need to be repeated on every new scene.
// Originally the scene screen's own control only; extended 2026-09-22 to a
// shared `.mute-btn` class present on the Map Overview and Reserve Map
// screens too, so a player can mute proactively before ever entering a
// scene rather than only from inside one. All instances share the one
// `state.audioMuted` flag and are kept in sync — toggling from any screen
// updates every button's icon/label together via querySelectorAll, not
// just the one that was clicked.
function toggleAudioMute() {
  state.audioMuted = !state.audioMuted;
  const label = state.audioMuted ? "Unmute sound" : "Mute sound";
  const iconSrc = state.audioMuted ? "../assets/buttons/Btn_SoundOff.png" : "../assets/buttons/Btn_Sound.png";
  document.querySelectorAll(".mute-btn").forEach(btn => {
    btn.title = label;
    btn.setAttribute("aria-label", label);
    const icon = btn.querySelector(".mute-icon");
    icon.src = iconSrc;
    icon.alt = label;
  });

  const ambientAudio = document.getElementById("scene-ambient-audio");
  const callAudio = document.getElementById("frog-call-audio");
  if (state.audioMuted) {
    ambientAudio.pause();
    callAudio.pause();
    stopSynthTone();
  } else {
    // Resuming ambient/call audio only makes sense if a scene is actually
    // on screen right now — toggling from the Map Overview or Reserve Map
    // (where nothing scene-specific is playing) has nothing to resume, and
    // state.scenes/state.currentSceneIdx may not even point at a valid
    // scene yet (e.g. before any reserve has been entered this session).
    const onSceneScreen = document.getElementById("screen-scene").classList.contains("active");
    if (onSceneScreen) {
      const scene = state.scenes[state.currentSceneIdx];
      if (scene.ambientAudio) ambientAudio.play().catch(() => {});
      const soundingHere = scene.hotspots.some(h => `${state.currentSceneIdx}:${h.id}` === state.targetHotspotKey);
      if (soundingHere) startCallTone();
    }
  }
}
document.querySelectorAll(".mute-btn").forEach(btn => btn.addEventListener("click", toggleAudioMute));

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
