"use strict";
const $ = (s) => document.querySelector(s);
const escapeHTML = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const steps = ["Location", "Frog", "Reserve map", "Scenes & hotspots", "Audio", "Review & publish"];
let draft = null, tab = 0, activeScene = null, selectedHotspot = null, busy = false, dirty = false, candidates = [], uploadTarget = null;
const workspace = $("#workspace");

async function api(path, options = {}) {
  const response = await fetch(path, options.body instanceof FormData ? options : {...options, headers: {"Content-Type":"application/json", ...options.headers}});
  if (!response.ok) {
    let detail;
    try { detail = (await response.json()).detail; } catch { detail = "The server could not complete this request."; }
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
  return response.json();
}
function message(text, error = false) {
  const el = $("#message"); el.hidden = !text; el.textContent = text; el.classList.toggle("error", error);
}
function markDirty(clearReview = true) {
  dirty = true;
  if (clearReview) draft.reviewed = false;
  $("#save-state").textContent = "Unsaved changes";
}
function get(path) { return path.split(".").reduce((o,k) => o?.[k], draft); }
function put(path, value) {
  const parts = path.split("."); const key = parts.pop();
  const object = parts.reduce((o,k) => o[k], draft); object[key] = value;
}
function field(label, path, options = {}) {
  const value = get(path); const attrs = `data-field="${path}" ${options.list ? 'data-list="true"' : ''}`;
  const content = options.list ? (value || []).join("\n") : value;
  const control = options.area
    ? `<textarea ${attrs} rows="${options.rows || 4}">${escapeHTML(content)}</textarea>`
    : `<input ${attrs} type="${options.number ? 'number' : 'text'}" ${options.number ? 'min="0" max="100" step="0.1"' : ''} value="${escapeHTML(content)}">`;
  return `<label class="field"><span>${label}</span>${control}${options.help ? `<p class="help">${options.help}</p>` : ''}</label>`;
}
const rootAsset = (path) => "/" + path;
function imageFrame(path, alt) {
  return path ? `<div class="image-frame"><img src="${escapeHTML(rootAsset(path))}" alt="${escapeHTML(alt)}"></div>`
    : '<div class="image-frame empty"><span>◇</span>No image yet</div>';
}
function imageActions(target) {
  return `<div class="actions"><button class="primary" data-action="generate" data-target="${target}" ${busy ? 'disabled' : ''}>Generate with VAL</button><button data-action="upload" data-target="${target}" ${busy ? 'disabled' : ''}>Upload image</button></div>`;
}
function direction() { return '<label class="field"><span>Art direction <small>(optional)</small></span><textarea id="art-direction" rows="3" placeholder="e.g. Softer watercolour edges, quieter blues, more reeds…"></textarea></label>'; }
function scene() { return draft?.scenes.find(s => s.id === activeScene) || null; }
function sceneIndex() { return draft.scenes.findIndex(s => s.id === activeScene); }

async function library() {
  const list = await api("/api/drafts");
  $("#draft-list").innerHTML = list.map(d => `<button class="draft-item ${draft?.id === d.id ? 'active' : ''}" data-open="${d.id}" ${busy ? 'disabled' : ''}>${escapeHTML(d.name)}<small>${escapeHTML(d.frog || "No species selected")}</small></button>`).join("");
  return list;
}
async function save() {
  if (!draft) return;
  if (dirty) draft = await api(`/api/drafts/${draft.id}`, {method:"PUT", body:JSON.stringify({draft})});
  dirty = false;
  $("#save-state").textContent = "Saved on this computer";
  $("#draft-title").textContent = draft.name;
  await library();
}
async function openDraft(id) {
  if (busy) return;
  if (draft && dirty) await save();
  draft = await api(`/api/drafts/${id}`); dirty = false; candidates = []; activeScene = draft.scenes[0]?.id || null; selectedHotspot = null;
  localStorage.setItem("frog-author-last-draft", id);
  message(""); render(); await library();
  await restoreSuggestions(id);
}

async function waitForJob(jobId) {
  while(true) {
    const job=await api(`/api/jobs/${jobId}`);
    if(job.status==='failed')throw new Error(job.error);
    if(job.status==='complete')return job.result;
    await new Promise(resolve=>setTimeout(resolve,1600));
  }
}

async function restoreSuggestions(id) {
  const job=await api(`/api/drafts/${id}/suggestions`);
  if(draft?.id!==id)return;
  if(job.status==='complete'){
    candidates=job.result.candidates;render();
    message(`${candidates.length} saved candidates are available in the Frog step. These are unverified suggestions.`);
  }
  if(job.status==='failed')message(job.error,true);
  if(job.status==='running'){
    busy=true;render();await library();
    message('Claude is still preparing candidates. Reconnected to the running request; you do not need to start it again.');
    try {
      const result=await waitForJob(job.id);
      if(draft?.id!==id||draft.name!==job.location)throw new Error('The location changed while Claude was working. The result was saved for the earlier location; request new candidates for this one.');
      candidates=result.candidates;tab=1;
      message(`${candidates.length} candidates generated and saved. Verify site-level records before choosing a species.`);
    }catch(error){message(error.message,true);}
    finally{busy=false;render();await library();}
  }
}
async function createDraft() {
  if (busy) return;
  if (draft && dirty) await save();
  const created = await api("/api/drafts", {method:"POST"}); tab = 0; await openDraft(created.id);
}
function render() {
  if (!draft) return;
  $("#draft-title").textContent = draft.name;
  $("#save-draft").disabled = busy;
  $("#new-draft").disabled = busy;
  $("#save-state").textContent = dirty ? "Unsaved changes" : "Saved on this computer";
  $("#steps").hidden = false;
  $("#steps").innerHTML = steps.map((s,i) => `<button data-tab="${i}" class="${i===tab?'active':''}" aria-current="${i===tab?'step':'false'}">${String(i+1).padStart(2,"0")} &nbsp;${s}${i===1&&candidates.length?` (${candidates.length})`:''}</button>`).join("");
  workspace.innerHTML = [locationView, frogView, mapView, scenesView, audioView, reviewView][tab]();
}
function locationView() {
  return `<h2>Place the next discovery.</h2><p class="lede">Name a Victorian reserve, record your sources, and place its pin on the overview. Pin positions are set by you, not guessed by AI.</p><div class="columns"><div class="inspector">${field("Reserve / location name", "name")}
    <div class="coordinate-row">${field("Overview pin · X %", "pin_x", {number:true})}${field("Overview pin · Y %", "pin_y", {number:true})}</div>
    ${field("Source links and record notes", "sources", {area:true,list:true,help:"One source per line. Include evidence that the selected frog occurs here; AI suggestions are not verified records."})}
    ${field("Working notes", "notes", {area:true})}<button data-action="next">Next: choose a frog →</button></div>
    <div class="visual">${stage("assets/scenes/victoria-map-overview.jpg", [{id:"pin",x:draft.pin_x,y:draft.pin_y,label:"Location pin"}],"pin")}<p class="image-caption">Click to place the location pin. Drag it, use its arrow keys, or enter coordinates. This illustrated overview is not a surveyed map.</p></div></div>`;
}
function frogView() {
  const suggestions = candidates.map((c,i) => `<div class="candidate"><b>${escapeHTML(c.name)}</b><p><i>${escapeHTML(c.scientific_name)}</i><br>${escapeHTML(c.verification_note || "Verify the local occurrence before use.")}</p><button data-action="candidate" data-index="${i}">Use as a draft</button></div>`).join("");
  return `<div class="section-head"><div><h2>The frog in the field guide.</h2><p class="lede">Enter a species, or ask Claude for candidates using the reserve name from the Location step. The illustrated pin does not identify a real site automatically.</p></div><button data-action="suggest" ${busy?'disabled':''}>Ask Claude for candidates</button></div>
    <div class="columns"><div class="inspector">${suggestions ? `<p class="warning-note">${candidates.length} saved candidates · unverified. Check real site records.</p>${suggestions}`:''}
    ${field("Common name", "frog.name")}${field("Scientific name", "frog.scientific_name")}${field("Identification description", "frog.description", {area:true})}${field("Visual hints", "frog.hints", {area:true,list:true,help:"One identifying feature per line. Review the generated image against these."})}${field("Habitat", "frog.habitat", {area:true})}
    <h3>Calling months</h3><p class="help">Leave unknown unless supported by a source. 0 = unknown/no activity; 1 = possible; 2 = active; 3 = peak.</p><div class="month-grid">${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m,i) => `<label>${m}<select data-field="frog.calling.${i}" data-number="true">${[0,1,2,3].map(v=>`<option value="${v}" ${draft.frog.calling[i]===v?'selected':''}>${v===0?'Unknown / none':v}</option>`).join('')}</select></label>`).join('')}</div></div>
    <div class="visual">${imageFrame(draft.frog.photo, draft.frog.name || "Frog illustration")}${imageActions("frog")}${direction()}<p class="image-caption">GPT Image through VAL · 1536 × 1024. Check anatomy, markings and pupil shape before publishing.</p></div></div>`;
}
function mapView() {
  const points = draft.scenes.map((s,i)=>({id:s.id,x:s.map_x,y:s.map_y,label:`Scene ${i+1}: ${s.name}`}));
  return `<h2>Map the reserve.</h2><p class="lede">Generate a watercolour reserve map, then click it to add scene locations. For real geography, upload a separate map reference before generating.</p><div class="columns"><div class="inspector">
    ${field("Map description / alternative text", "map_alt", {area:true})}${direction()}${imageActions("map")}
    <h3>Geography reference</h3>${draft.geography_reference?`<img class="thumbnail" src="/${escapeHTML(draft.geography_reference)}" alt="Uploaded geography reference">`:''}<button data-action="upload" data-target="geography">Upload a real site map</button><p class="help">Use a map you have permission to provide to VAL. Without it, the result is an illustrative wetland, not an accurate site map.</p>
    <h3>Scene locations</h3>${sceneList()}<button data-action="add-scene">＋ Add a scene</button>${scene()?sceneFields():''}</div>
    <div class="visual">${draft.map_image?stage(draft.map_image,points,"scene-point"):imageFrame("", "Reserve map")}<p class="image-caption">Click the map to add a scene point. Drag existing points or use arrow keys. Scene locations refer to the full image, not the browser window.</p></div></div>`;
}
function sceneList() {
  return `<div class="scene-list">${draft.scenes.map((s,i)=>`<div class="scene-row ${s.id===activeScene?'active':''}"><button class="scene-select" data-action="scene" data-id="${s.id}">${i+1}. ${escapeHTML(s.name)}</button><button class="remove" data-action="delete-scene" data-id="${s.id}" aria-label="Remove ${escapeHTML(s.name)}">×</button></div>`).join('')}</div>`;
}
function sceneFields() {
  const i=sceneIndex();return `${field("Scene name", `scenes.${i}.name`)}<div class="coordinate-row">${field("On reserve map · X %",`scenes.${i}.map_x`,{number:true})}${field("On reserve map · Y %",`scenes.${i}.map_y`,{number:true})}</div>`;
}
function scenesView() {
  const s=scene(); const i=sceneIndex(); const hotspot=s?.hotspots.find(h=>h.id===selectedHotspot); const hi=s?.hotspots.findIndex(h=>h.id===selectedHotspot);
  return `<h2>Hide the clues in the habitat.</h2><p class="lede">Choose a scene, generate or upload its habitat image, and click to place frog hotspots. The game selects one of these hotspots for the calling frog each visit.</p><div class="columns"><div class="inspector">${sceneList()}<button data-action="add-scene">＋ Add a scene</button>
    ${s?`${sceneFields()}${direction()}${imageActions("scene")}<h3>Frog hotspots · ${s.hotspots.length}</h3><button data-action="add-hotspot" ${s.photo?'':'disabled'}>＋ Add hotspot</button><p class="help">Select a marker to edit its coordinates. Drag or use arrow keys for fine adjustment.</p>
    ${hotspot?`<div class="coordinate-row">${field("Hotspot · X %",`scenes.${i}.hotspots.${hi}.x`,{number:true})}${field("Hotspot · Y %",`scenes.${i}.hotspots.${hi}.y`,{number:true})}</div><button data-action="delete-hotspot">Remove selected hotspot</button>`:'<p class="help">Click the habitat image to add a hotspot.</p>'}`:'<p class="help">Add a scene to begin.</p>'}</div>
    <div class="visual">${s?.photo?stage(s.photo,s.hotspots.map((h,j)=>({...h,label:`Hotspot ${j+1}`})),"hotspot"):imageFrame("", "Habitat scene")}<p class="image-caption">${s?escapeHTML(s.name):"No scene selected"} · ${s?.photo?'Click to place a hotspot.':'Generate or upload the scene image first.'}</p></div></div>`;
}
function audioView() {
  return `<h2>Give the habitat a voice.</h2><p class="lede">Attach a real frog call and optional ambient audio for each scene. Upload MP3, WAV, OGG or M4A, up to 30 MB per file. Audio is uploaded, not generated.</p><div class="details-grid"><div><div class="audio-block"><h3>${escapeHTML(draft.frog.name || "Frog")} · call recording</h3>${draft.frog.call_audio?`<audio controls preload="metadata" src="/${escapeHTML(draft.frog.call_audio)}"></audio>`:'<p class="help">No frog call attached.</p>'}<div class="actions"><button data-action="upload" data-target="call">Upload frog call</button>${draft.frog.call_audio?'<button data-action="clear-call">Remove</button>':''}</div>${field("Recording credit and permission", "frog.audio_credit",{area:true,help:"Include the recordist, source and licence or permission. Required for publication."})}</div></div><div>${draft.scenes.map(s=>`<div class="audio-block"><h3>${escapeHTML(s.name)} · ambience</h3>${s.ambient_audio?`<audio controls preload="metadata" src="/${escapeHTML(s.ambient_audio)}"></audio>`:'<p class="help">Optional: wind, water, birds or other habitat sound.</p>'}<div class="actions"><button data-action="upload" data-target="ambient" data-scene="${s.id}">Upload ambience</button>${s.ambient_audio?`<button data-action="clear-ambient" data-scene="${s.id}">Remove</button>`:''}</div></div>`).join('')||'<p class="help">Add scenes to attach ambient audio.</p>'}</div></div>`;
}
function reviewView() {
  const checks=[['Reserve map',!!draft.map_image],['Frog name, scientific name and illustration',!!(draft.frog.name&&draft.frog.scientific_name&&draft.frog.photo)],['Species description, habitat and identification hints',!!(draft.frog.description&&draft.frog.habitat&&draft.frog.hints.length)],['Frog call and recording permission',!!(draft.frog.call_audio&&draft.frog.audio_credit)],['Species and location sources',draft.sources.some(s=>s.trim())],['Every scene has an image and frog hotspots',!!draft.scenes.length&&draft.scenes.every(s=>s.photo&&s.hotspots.length)]];
  return `<h2>Review, then add it to the game.</h2><p class="lede">Publication adds this reserve, its scenes and frog to the existing Frog Explorer. It writes local game files; it does not deploy the site or push to GitHub.</p><div class="details-grid"><div><ul class="review-list">${checks.map(([label,ok])=>`<li><span class="${ok?'ok':'missing'}">${ok?'✓':'○'}</span>${label}</li>`).join('')}</ul>
    <label class="check-field"><input type="checkbox" data-field="reviewed" ${draft.reviewed?'checked':''}><span>I have checked the local species record, scientific details, image accuracy, hotspot placement and audio permissions. I understand an AI map is illustrative unless checked against a real site map.</span></label><div class="actions"><button class="primary" data-action="publish" ${busy?'disabled':''}>Publish into local game</button><button data-action="preview">Preview draft ↗</button><button data-action="export">Download draft & media</button></div><div class="data-note">Drafts are saved locally. The VAL key stays on the server. Generated images use RMIT VAL; institutional approval for your use and source material still applies.</div></div>
    <div><div class="review-images">${draft.frog.photo?`<div><img src="/${escapeHTML(draft.frog.photo)}" alt="Frog illustration to review"><p>${escapeHTML(draft.frog.name)}</p></div>`:''}${draft.map_image?`<div><img src="/${escapeHTML(draft.map_image)}" alt="Reserve map to review"><p>${escapeHTML(draft.name)}</p></div>`:''}</div>${draft.scenes.map(s=>`<h3>${escapeHTML(s.name)}</h3><p class="help">${s.hotspots.length} hotspots · ${s.ambient_audio?'ambience attached':'no ambient audio'}</p>`).join('')}</div></div>`;
}
function stage(path, points, mode) {
  return `<div class="stage" id="placement-stage" data-mode="${mode}"><img src="/${escapeHTML(path)}" alt="${mode==='hotspot'?'Habitat scene for placing frog hotspots':mode==='pin'?'Victoria overview for positioning the reserve':'Reserve map for placing scene locations'}">${points.map((p,i)=>`<button class="marker ${p.id===(mode==='hotspot'?selectedHotspot:activeScene)?'selected':''}" style="left:${p.x}%;top:${p.y}%" data-marker="${p.id}" aria-label="${escapeHTML(p.label)}. X ${p.x.toFixed(1)} percent, Y ${p.y.toFixed(1)} percent. Use arrow keys to move.">${i+1}</button>`).join('')}</div>`;
}
function addScene(x=50,y=50) {
  if(draft.scenes.length>=20)throw new Error("A location can contain up to 20 scenes.");
  const id="scene-"+crypto.randomUUID().slice(0,8);
  draft.scenes.push({id,name:`Habitat scene ${draft.scenes.length+1}`,photo:"",ambient_audio:"",map_x:x,map_y:y,hotspots:[]});
  activeScene=id; selectedHotspot=null; markDirty(); render();
}
function addHotspot(x=50,y=50) {
  if(!scene()?.photo)throw new Error("Add a scene image first.");
  if(scene().hotspots.length>=30)throw new Error("A scene can contain up to 30 hotspots.");
  const id='hotspot-'+crypto.randomUUID().slice(0,8);scene().hotspots.push({id,x,y});selectedHotspot=id;markDirty();render();
}
function coords(event, el) {
  const r=el.getBoundingClientRect();
  return [Math.max(0,Math.min(100,(event.clientX-r.left)/r.width*100)),Math.max(0,Math.min(100,(event.clientY-r.top)/r.height*100))].map(v=>Math.round(v*10)/10);
}
function movePoint(mode,id,x,y) {
  if(mode==='pin'){draft.pin_x=x;draft.pin_y=y;}
  if(mode==='scene-point'){const s=draft.scenes.find(s=>s.id===id);if(s){s.map_x=x;s.map_y=y;activeScene=id;}}
  if(mode==='hotspot'){const h=scene()?.hotspots.find(h=>h.id===id);if(h){h.x=x;h.y=y;selectedHotspot=id;}}
  markDirty();
}
function pickUpload(target, sceneId=null) {
  uploadTarget={target,sceneId:sceneId||activeScene};
  const input=$("#file-upload"); input.accept=['call','ambient'].includes(target)?'.mp3,.wav,.ogg,.m4a':'.png,.jpg,.jpeg,.webp';input.value="";input.click();
}
async function runJob(path, body) {
  busy=true;render();
  try {
    await save();await library();
    message(path.endsWith('/suggest')?'Claude is preparing frog candidates. This can take a minute; results will be saved even if you reload.':'VAL is generating the image. This can take a few minutes. Keep this editor open.');
    const started=await api(path,{method:"POST",...(body?{body:JSON.stringify(body)}:{})});
    return await waitForJob(started.job_id);
  } finally {busy=false;render();await library();}
}

document.addEventListener("input",event=>{
  const el=event.target;if(!el.dataset.field||!draft)return;
  let value=el.type==='checkbox'?el.checked:el.type==='number'||el.dataset.number?Number(el.value):el.value;
  if(el.dataset.list)value=value.split('\n').map(s=>s.trim()).filter(Boolean);
  put(el.dataset.field,value);markDirty(el.dataset.field!=='reviewed');
  if(el.dataset.field==='name'){
    $("#draft-title").textContent=draft.name;
    candidates=[]; // Do not present another location's candidates as this site's.
  }
  // Update coordinate markers without replacing the focused numeric input.
  const st=$("#placement-stage");
  if(st&&el.type==='number'){
    for(const marker of st.querySelectorAll('[data-marker]')){
      const id=marker.dataset.marker;let x,y;
      if(st.dataset.mode==='pin'){x=draft.pin_x;y=draft.pin_y;}
      else if(st.dataset.mode==='scene-point'){const s=draft.scenes.find(s=>s.id===id);x=s.map_x;y=s.map_y;}
      else {const h=scene().hotspots.find(h=>h.id===id);x=h.x;y=h.y;}
      marker.style.left=x+'%';marker.style.top=y+'%';
    }
  }
});

document.addEventListener("click",async event=>{
  const el=event.target.closest('button,[data-open]');
  if(!el)return;
  try {
    if(el.id==='new-draft'||el.dataset.action==='new')return await createDraft();
    if(el.id==='save-draft'){await save();message("Draft saved.");return;}
    if(el.dataset.open)return await openDraft(el.dataset.open);
    if(el.dataset.tab!==undefined){tab=Number(el.dataset.tab);message("");render();return;}
    const action=el.dataset.action;
    if(busy&&action)return;
    if(action==='next'){tab=Math.min(5,tab+1);render();}
    if(action==='scene'){activeScene=el.dataset.id;selectedHotspot=null;render();}
    if(action==='add-scene')addScene();
    if(action==='add-hotspot')addHotspot();
    if(action==='delete-scene'){
      draft.scenes=draft.scenes.filter(s=>s.id!==el.dataset.id);activeScene=draft.scenes[0]?.id||null;selectedHotspot=null;markDirty();render();
    }
    if(action==='delete-hotspot'){scene().hotspots=scene().hotspots.filter(h=>h.id!==selectedHotspot);selectedHotspot=null;markDirty();render();}
    if(action==='upload')pickUpload(el.dataset.target,el.dataset.scene);
    if(action==='clear-call'){draft.frog.call_audio="";markDirty();render();}
    if(action==='clear-ambient'){draft.scenes.find(s=>s.id===el.dataset.scene).ambient_audio="";markDirty();render();}
    if(action==='suggest'){
      const requestedLocation=draft.name;
      const result=await runJob(`/api/drafts/${draft.id}/suggest`);
      if(draft.name!==requestedLocation)throw new Error('The location changed while Claude was working. Request candidates for the new location.');
      candidates=result.candidates;tab=1;message(`${candidates.length} candidates generated and saved. Verify site-level records before choosing a species.`);render();
    }
    if(action==='candidate'){
      const c=candidates[Number(el.dataset.index)];
      Object.assign(draft.frog,{name:c.name,scientific_name:c.scientific_name||"",description:c.description||"",habitat:c.habitat||"",hints:Array.isArray(c.hints)?c.hints:[],photo:"",call_audio:"",audio_credit:""});markDirty();render();message(c.verification_note||"Verify this species at this site.");
    }
    if(action==='generate'){
      const request={target:el.dataset.target,scene_id:activeScene,prompt:$("#art-direction")?.value||""};
      const result=await runJob(`/api/drafts/${draft.id}/generate`,request);
      if(result.target==='frog')draft.frog.photo=result.path;
      if(result.target==='map')draft.map_image=result.path;
      if(result.target==='scene')draft.scenes.find(s=>s.id===result.scene_id).photo=result.path;
      markDirty();await save();render();message("Image generated through VAL and saved. Check its accuracy before publication.");
    }
    if(action==='publish'){
      await save();const result=await api(`/api/drafts/${draft.id}/publish`,{method:"POST"});
      message("Published into the local game. Open Frog Explorer to play it. Nothing has been deployed or pushed.");
      const link=document.createElement('a');link.href=result.game_url;link.target='_blank';link.rel='noopener';link.className='preview-link';link.textContent='Play this location ↗';$("#message").append(document.createElement('br'),link);
    }
    if(action==='preview'){
      await save();const link=document.createElement('a');link.href=`/api/drafts/${draft.id}/preview`;link.target='_blank';link.rel='noopener';link.click();
    }
    if(action==='export'){await save();location.href=`/api/drafts/${draft.id}/export`;}
  } catch(error){message(error.message,true);}
});

document.addEventListener("click",event=>{
  const st=event.target.closest('#placement-stage');if(!st||event.target.closest('[data-marker]')||busy)return;
  const [x,y]=coords(event,st);
  try {
    if(st.dataset.mode==='pin'){movePoint('pin','pin',x,y);render();}
    if(st.dataset.mode==='scene-point')addScene(x,y);
    if(st.dataset.mode==='hotspot'){
      addHotspot(x,y);
    }
  } catch(error){message(error.message,true);}
});
document.addEventListener('pointerdown',event=>{
  const marker=event.target.closest('[data-marker]');if(!marker||busy)return;
  const st=marker.closest('.stage');event.preventDefault();
  marker.setPointerCapture(event.pointerId);
  const update=(ev)=>{
    const [x,y]=coords(ev,st);movePoint(st.dataset.mode,marker.dataset.marker,x,y);marker.style.left=x+'%';marker.style.top=y+'%';
  };
  const finish=()=>{marker.removeEventListener('pointermove',update);marker.removeEventListener('pointerup',finish);marker.removeEventListener('pointercancel',finish);render();};
  marker.addEventListener('pointermove',update);marker.addEventListener('pointerup',finish);marker.addEventListener('pointercancel',finish);
  // Select without moving the marker on initial press.
  if(st.dataset.mode==='hotspot')selectedHotspot=marker.dataset.marker;
  if(st.dataset.mode==='scene-point')activeScene=marker.dataset.marker;
});
document.addEventListener('keydown',event=>{
  const marker=event.target.closest('[data-marker]');if(!marker||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)||busy)return;
  event.preventDefault();const st=marker.closest('.stage');let x=parseFloat(marker.style.left),y=parseFloat(marker.style.top);const delta=event.shiftKey?1:.2;
  if(event.key==='ArrowLeft')x-=delta;if(event.key==='ArrowRight')x+=delta;if(event.key==='ArrowUp')y-=delta;if(event.key==='ArrowDown')y+=delta;
  const id=marker.dataset.marker;movePoint(st.dataset.mode,id,Math.max(0,Math.min(100,+x.toFixed(1))),Math.max(0,Math.min(100,+y.toFixed(1))));render();document.querySelector(`[data-marker="${id}"]`)?.focus();
});
$("#file-upload").addEventListener('change',async event=>{
  if(!event.target.files[0]||!uploadTarget)return;
  const target={...uploadTarget};
  try {
    busy=true;render();message("Uploading media…");
    const form=new FormData();form.append('file',event.target.files[0]);
    const result=await api(`/api/drafts/${draft.id}/upload`,{method:'POST',body:form});
    if(target.target==='frog')draft.frog.photo=result.path;
    if(target.target==='map')draft.map_image=result.path;
    if(target.target==='geography')draft.geography_reference=result.path;
    if(target.target==='call')draft.frog.call_audio=result.path;
    if(target.target==='scene')draft.scenes.find(s=>s.id===target.sceneId).photo=result.path;
    if(target.target==='ambient')draft.scenes.find(s=>s.id===target.sceneId).ambient_audio=result.path;
    markDirty();await save();message("Media uploaded and draft saved.");
  } catch(error){message(error.message,true);}finally{busy=false;render();await library();}
});
window.addEventListener('beforeunload',event=>{if(dirty||busy){event.preventDefault();event.returnValue='';}});
window.render_game_to_text=()=>JSON.stringify({mode:'authoring',step:steps[tab],draft:draft?.name,scene:scene()?.name,coordinates:'percent; origin top left; x right, y down',hotspots:scene()?.hotspots||[],candidate_count:candidates.length,busy,dirty});
window.advanceTime=()=>{};
(async()=>{
  try {
    const status=await api('/api/status');$('#connection').textContent=status.configured?'VAL key configured':'VAL key not configured';$('.connection-dot').classList.toggle('ready',status.configured);
    const list=await library();const last=localStorage.getItem('frog-author-last-draft');
    if(last&&list.some(d=>d.id===last))await openDraft(last);
  }catch(error){message(error.message,true);}
})();
