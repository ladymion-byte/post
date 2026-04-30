// ============================================================
//  HELPERS
// ============================================================
function $(id) { return document.getElementById(id); }

function setLoading(id, visible, text) {
  const el = $(id); if (!el) return;
  el.classList.toggle('show', visible);
  const lt = el.querySelector('.ld-text');
  if (lt && text) lt.textContent = text;
}

function disableBtn(id, v) { const el=$(id); if(el) el.disabled=v; }

function showResult(id) {
  const el=$(id); if(!el) return;
  el.classList.remove('hidden'); el.style.display='';
}

function doCopy(id, btn) {
  const text = $(id)?.textContent||'';
  navigator.clipboard.writeText(text).then(()=>{
    const orig=btn.textContent; btn.textContent='✓ Kopiert!';
    setTimeout(()=>btn.textContent=orig,2000);
  });
}

function copyEl(id) { navigator.clipboard.writeText($(id)?.textContent||''); }

function showError(msg) { alert('Fehler: '+msg); }

// ============================================================
//  PLATFORM SWITCHER
// ============================================================
document.querySelectorAll('.plat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentPlat = btn.dataset.plat;
    document.querySelectorAll('.plat-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.platform-panel').forEach(p=>p.classList.remove('active'));
    $('plat-'+currentPlat)?.classList.add('active');
    if(currentPlat==='facebook') renderFbIdeas();
  });
});

// ============================================================
//  INSTAGRAM: NISCHE
// ============================================================
document.querySelectorAll('.niche-btn[data-plat="instagram"]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.niche-btn[data-plat="instagram"]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentNiche = btn.dataset.niche;
    const ph=$('ig-v-topic'); if(ph) ph.placeholder=NICHES[currentNiche].placeholder;
    ['ig-visual-result','ig-res-cap','ig-res-plan','ig-story-result'].forEach(id=>{
      const el=$(id); if(!el) return;
      el.classList.add('hidden'); el.style.display='none';
    });
  });
});

// ============================================================
//  FACEBOOK: NISCHE
// ============================================================
document.querySelectorAll('.niche-btn[data-plat="facebook"]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.niche-btn[data-plat="facebook"]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentFbNiche = btn.dataset.niche;
    const nc = FB_NICHES[currentFbNiche];

    // Placeholders in allen FB-Modulen aktualisieren
    const fields = ['fb-p-topic','fb-st-topic','fb-g-topic'];
    fields.forEach(id => { const el=$(id); if(el) el.placeholder=nc.placeholder; });

    // Ideen-Grid neu rendern
    renderFbIdeas();

    // Alle offenen Ergebnisse zurücksetzen
    ['fb-profil-result','fb-res-gruppe','fb-res-ideen','fb-res-plan','fb-story-result'].forEach(id=>{
      const el=$(id); if(!el) return;
      el.classList.add('hidden'); el.style.display='none';
    });
  });
});

// ============================================================
//  MODULE TABS (shared logic)
// ============================================================
document.querySelectorAll('.mod-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const moduleId = tab.dataset.module;
    const section  = tab.closest('.modules-section');
    section.querySelectorAll('.mod-tab').forEach(t=>t.classList.remove('active'));
    section.querySelectorAll('.module-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    $('panel-'+moduleId)?.classList.add('active');
  });
});

// ============================================================
//  FACEBOOK: IDEEN-GRID RENDERN
// ============================================================
function renderFbIdeas() {
  const nc    = FB_NICHES[currentFbNiche];
  const grid  = $('fb-idea-grid');
  if(!grid) return;
  grid.innerHTML = nc.ideas.map(idea=>`
    <div class="idea-card" onclick="fbGenerateIdea('${idea.title.replace(/'/g,"\\'")}','${idea.sub.replace(/'/g,"\\'")}')">
      <div class="ic-title">${idea.title}</div>
      <div class="ic-sub">${idea.sub}</div>
    </div>
  `).join('');
}

// ============================================================
//  INSTAGRAM: BILD + POST
// ============================================================
$('btn-ig-visual')?.addEventListener('click', async () => {
  const topic = $('ig-v-topic').value.trim();
  if(!topic){alert('Bitte ein Thema eingeben.');return;}
  const format=$('ig-v-format').value, style=$('ig-v-style').value, color=$('ig-v-color').value.trim();
  disableBtn('btn-ig-visual',true);
  setLoading('ld-ig-visual',true,'KI generiert Bild, Post und Caption...');
  $('ig-visual-result').style.display='none';
  try {
    const d = await apiGenerateVisual(topic,format,style,color,currentNiche);
    if(!d) throw new Error('JSON konnte nicht verarbeitet werden. Bitte nochmal versuchen.');
    drawFeedCanvas('ig-canvas-feed',d,currentNiche);
    drawStoryCanvas('ig-canvas-story',{...d,body:d.subtext,total:1},currentNiche,0,1);
    $('ig-feed-cap-preview').textContent  = d.post||'';
    $('ig-feed-ht-preview').textContent   = d.hashtags||'';
    $('ig-story-cap-preview').textContent = d.caption_short||'';
    $('ig-v-fulltext').textContent        = (d.post||'')+'\n\n'+(d.hashtags||'');
    $('ig-v-tip').textContent             = '💡 Tipp: Bilder in Canva öffnen, eigene Fotos einfügen und Branding anpassen.';
    $('ig-visual-result').style.display='block';
    $('ig-visual-result').classList.add('show');
  } catch(e){showError(e.message);}
  setLoading('ld-ig-visual',false);
  disableBtn('btn-ig-visual',false);
});

// ============================================================
//  INSTAGRAM: STORY-SEQUENZ
// ============================================================
$('btn-ig-st')?.addEventListener('click', async () => {
  const topic=$('ig-st-topic').value.trim();
  if(!topic){alert('Bitte ein Thema eingeben.');return;}
  const count=parseInt($('ig-st-count').value), style=$('ig-st-style').value;
  disableBtn('btn-ig-st',true);
  setLoading('ld-ig-st',true,`Generiere ${count}-teilige Story-Sequenz...`);
  const container=$('ig-story-result');
  container.innerHTML=''; container.classList.add('hidden');
  try {
    const stories = await apiGenerateStory(topic,count,style,currentNiche);
    if(!stories||!Array.isArray(stories)) throw new Error('Story-Daten konnten nicht verarbeitet werden.');
    buildStoryGrid(container,stories,currentNiche,'ig-story-texts');
    container.classList.remove('hidden'); container.style.display='block';
  } catch(e){showError(e.message);}
  setLoading('ld-ig-st',false);
  disableBtn('btn-ig-st',false);
});

// ============================================================
//  INSTAGRAM: CAPTION
// ============================================================
$('btn-ig-cap')?.addEventListener('click', async () => {
  const desc=$('ig-cap-desc').value.trim();
  if(!desc){alert('Bitte beschreibe deinen Post.');return;}
  disableBtn('btn-ig-cap',true);
  setLoading('ld-ig-cap',true,'Generiere Caption...');
  $('ig-res-cap').classList.add('hidden');
  try {
    const result = await apiGenerateCaption(desc,$('ig-cap-cta').value,$('ig-cap-ht').value,currentNiche);
    $('ig-res-cap-text').textContent=result;
    showResult('ig-res-cap');
  } catch(e){showError(e.message);}
  setLoading('ld-ig-cap',false);
  disableBtn('btn-ig-cap',false);
});

// ============================================================
//  INSTAGRAM: 4-WOCHEN-PLAN
// ============================================================
$('btn-ig-pl')?.addEventListener('click', async () => {
  disableBtn('btn-ig-pl',true);
  setLoading('ld-ig-pl',true,'Erstelle 4-Wochen-Plan...');
  $('ig-res-plan').classList.add('hidden');
  try {
    const result = await apiGeneratePlan($('ig-pl-freq').value,$('ig-pl-goal').value.trim(),currentNiche);
    $('ig-res-plan-text').textContent=result;
    showResult('ig-res-plan');
  } catch(e){showError(e.message);}
  setLoading('ld-ig-pl',false);
  disableBtn('btn-ig-pl',false);
});

// ============================================================
//  FACEBOOK: PROFIL-POST + BILD
// ============================================================
$('btn-fb-profil')?.addEventListener('click', async () => {
  const topic=$('fb-p-topic').value.trim();
  if(!topic){alert('Bitte ein Thema eingeben.');return;}
  const format=$('fb-p-format').value, tone=$('fb-p-tone').value, style=$('fb-p-style').value;
  const nc=FB_NICHES[currentFbNiche];
  disableBtn('btn-fb-profil',true);
  setLoading('ld-fb-profil',true,'Generiere Facebook-Post und Bild...');
  $('fb-profil-result').style.display='none';
  try {
    const d = await apiFbGenerateProfilPost(topic,format,tone,style,currentFbNiche);
    if(!d) throw new Error('Konnte nicht verarbeitet werden. Bitte nochmal versuchen.');

    // Post-Bild (1.91:1)
    drawFbPostCanvas('fb-canvas-post', d, currentFbNiche);
    // Cover-Bild (16:9)
    drawFbCoverCanvas('fb-canvas-cover', d, currentFbNiche);

    $('fb-post-text-preview').textContent = d.post||'';
    $('fb-profil-tip').textContent = '💡 Tipp: Facebook-Posts performen besser mit echten Fotos. Nutze das generierte Bild als Canva-Vorlage und füge ein persönliches Bild ein.';
    $('fb-profil-result').style.display='block';
    $('fb-profil-result').classList.add('show');
  } catch(e){showError(e.message);}
  setLoading('ld-fb-profil',false);
  disableBtn('btn-fb-profil',false);
});

// ============================================================
//  FACEBOOK: STORY-SEQUENZ
// ============================================================
$('btn-fb-story')?.addEventListener('click', async () => {
  const topic=$('fb-st-topic').value.trim();
  if(!topic){alert('Bitte ein Thema eingeben.');return;}
  const count=parseInt($('fb-st-count').value), style=$('fb-st-style').value;
  disableBtn('btn-fb-story',true);
  setLoading('ld-fb-story',true,`Generiere ${count} Facebook Stories...`);
  const container=$('fb-story-result');
  container.innerHTML=''; container.classList.add('hidden');
  try {
    const stories = await apiFbGenerateStory(topic,count,style,currentFbNiche);
    if(!stories||!Array.isArray(stories)) throw new Error('Stories konnten nicht verarbeitet werden.');
    buildStoryGrid(container,stories,currentFbNiche,'fb-story-texts',true);
    container.classList.remove('hidden'); container.style.display='block';
  } catch(e){showError(e.message);}
  setLoading('ld-fb-story',false);
  disableBtn('btn-fb-story',false);
});

// ============================================================
//  FACEBOOK: GRUPPEN-POST
// ============================================================
$('btn-fb-gruppe')?.addEventListener('click', async () => {
  const topic=$('fb-g-topic').value.trim();
  if(!topic){alert('Bitte ein Thema eingeben.');return;}
  disableBtn('btn-fb-gruppe',true);
  setLoading('ld-fb-gruppe',true,'Generiere Gruppen-Post...');
  $('fb-res-gruppe').classList.add('hidden');
  try {
    const result = await apiFbGenerateGruppenPost(
      topic, $('fb-g-type').value, $('fb-g-name').value.trim(),
      $('fb-g-goal').value.trim(), currentFbNiche
    );
    $('fb-res-gruppe-text').textContent=result;
    showResult('fb-res-gruppe');
  } catch(e){showError(e.message);}
  setLoading('ld-fb-gruppe',false);
  disableBtn('btn-fb-gruppe',false);
});

// ============================================================
//  FACEBOOK: IDEEN
// ============================================================
async function fbGenerateIdea(title, sub) {
  setLoading('ld-fb-ideen',true,'Generiere Post...');
  $('fb-res-ideen').classList.add('hidden');
  try {
    const result = await apiFbGenerateIdeaPost(title,sub,currentFbNiche);
    $('fb-res-ideen-label').textContent=title;
    $('fb-res-ideen-text').textContent=result;
    showResult('fb-res-ideen');
  } catch(e){showError(e.message);}
  setLoading('ld-fb-ideen',false);
}

// ============================================================
//  FACEBOOK: MONATSPLAN
// ============================================================
$('btn-fb-plan')?.addEventListener('click', async () => {
  disableBtn('btn-fb-plan',true);
  setLoading('ld-fb-plan',true,'Erstelle Facebook-Monatsplan...');
  $('fb-res-plan').classList.add('hidden');
  try {
    const result = await apiFbGeneratePlan(
      $('fb-pl-freq').value, $('fb-pl-channels').value,
      $('fb-pl-goal').value.trim(), currentFbNiche
    );
    $('fb-res-plan-text').textContent=result;
    showResult('fb-res-plan');
  } catch(e){showError(e.message);}
  setLoading('ld-fb-plan',false);
  disableBtn('btn-fb-plan',false);
});

// ============================================================
//  SHARED: STORY GRID BUILDER
// ============================================================
function buildStoryGrid(container, stories, nicheKey, textId, isFacebook) {
  const grid=document.createElement('div');
  grid.className='story-grid';
  stories.forEach((st,i)=>{
    const card=document.createElement('div'); card.className='story-card';
    const lbl=document.createElement('div'); lbl.className='story-card-label';
    lbl.textContent=`Story ${i+1} / ${stories.length}`;
    const cvs=document.createElement('canvas'); cvs.width=200; cvs.height=355;
    const dlDiv=document.createElement('div'); dlDiv.className='story-card-dl';
    const dlBtn=document.createElement('button'); dlBtn.textContent='↓ Bild laden';
    dlBtn.onclick=()=>downloadCanvas(cvs,`story-${i+1}.png`);
    dlDiv.appendChild(dlBtn); card.appendChild(lbl); card.appendChild(cvs); card.appendChild(dlDiv);
    grid.appendChild(card);
    if(isFacebook) {
      drawFbStoryCanvas(cvs,{...st,total:stories.length},nicheKey,i,stories.length);
    } else {
      drawStoryCanvas(cvs,{...st,total:stories.length},nicheKey,i,stories.length);
    }
  });
  container.appendChild(grid);
  const textBlock=document.createElement('div'); textBlock.className='result-block';
  textBlock.innerHTML=`
    <div class="result-label">Story-Texte zum Kopieren</div>
    <div class="result-text" id="${textId}">${stories.map((s,i)=>
      `Story ${i+1}: ${s.headline}\n${s.body}${s.cta?'\nCTA: '+s.cta:''}`
    ).join('\n\n')}</div>
    <button class="copy-btn" onclick="doCopy('${textId}',this)">Alle kopieren</button>
  `;
  container.appendChild(textBlock);
}

// ============================================================
//  INIT
// ============================================================
renderFbIdeas();
const igPh=$('ig-v-topic');
if(igPh) igPh.placeholder=NICHES[currentNiche].placeholder;

// Facebook placeholders beim Start setzen
const fbInitPh = FB_NICHES[currentFbNiche]?.placeholder || '';
['fb-p-topic','fb-st-topic','fb-g-topic'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.placeholder = fbInitPh;
});
