/* cyberlab.js — shared utilities */

/* ── Auto-patch: kun aktiv på modul-sider (modules/) ── */
document.addEventListener('DOMContentLoaded', () => {
  const isModulePage = window.location.pathname.includes('/modules/');

  if (isModulePage) {
    // 1. Tilbake-lenke: alltid til labber.html, alltid teksten "← Tilbake"
    document.querySelectorAll('a.back-link').forEach(el => {
      el.textContent = '← Tilbake';
      if (el.href.includes('index.html')) {
        el.href = el.href.replace('index.html', 'labber.html');
      }
    });

    // 2. Bunn-nav "← Hjem" → "← Labber"
    document.querySelectorAll('a.btn.btn-ghost').forEach(el => {
      if (el.textContent.trim() === '← Hjem') {
        el.textContent = '← Labber';
        el.href = el.href.replace('index.html', 'labber.html');
      }
      if (el.textContent.includes('Tilbake til oversikten')) {
        el.textContent = '← Labber';
        el.href = el.href.replace('index.html', 'labber.html');
      }
    });
    document.querySelectorAll('a.btn.btn-success').forEach(el => {
      if (el.textContent.includes('Tilbake til oversikten')) {
        el.className = 'btn btn-ghost';
        el.textContent = '← Labber';
        el.href = el.href.replace('index.html', 'labber.html');
      }
    });
  }

  // 3. Filter-pill: "Hard" → "Vanskelig" (alle sider)
  document.querySelectorAll('.filter-pill').forEach(el => {
    if (el.textContent.trim() === 'Hard') el.textContent = 'Vanskelig';
  });

  // 4. Badges: "Hard" → "Vanskelig" (alle sider)
  document.querySelectorAll('.badge-hard').forEach(el => {
    el.textContent = el.textContent
      .replace(/: Hard$/, ': Vanskelig')
      .replace(/^Hard$/, 'Vanskelig');
  });

  loadDoneStates();
});

/* ── Task accordion ─────────────────────────────────────── */
function toggleTask(el) {
  const card = el.closest('.lab-card') || el.closest('.task-card');
  if (!card) return;
  card.classList.toggle('open');
}

/* ── Hint / solution toggles ────────────────────────────── */
function toggleHint(btn) {
  const box = btn.nextElementSibling;
  const open = box.classList.toggle('show');
  btn.classList.toggle('on', open);
  btn.textContent = open ? '▼ Skjul hint' : '▶ Hint';
}

function toggleSolution(btn) {
  const box = btn.nextElementSibling;
  const open = box.classList.toggle('show');
  btn.classList.toggle('on', open);
  btn.textContent = open ? '▼ Skjul løsning' : '▶ Vis løsning';
}

/* ── Progress tracking (localStorage) ───────────────────── */
function getProgress() {
  try { return JSON.parse(localStorage.getItem('cl_progress') || '{}'); } catch { return {}; }
}
function saveProgress(data) {
  try { localStorage.setItem('cl_progress', JSON.stringify(data)); } catch {}
}

function markTaskDone(taskId) {
  const p = getProgress();
  p[taskId] = true;
  saveProgress(p);
  const card = document.getElementById(taskId);
  if (card) card.classList.add('done');
  const banner = document.getElementById('done-' + taskId);
  if (banner) banner.classList.add('show');
  updateModuleProgress();
}

function loadDoneStates() {
  const p = getProgress();
  Object.keys(p).forEach(id => {
    const card = document.getElementById(id);
    if (card) card.classList.add('done');
    const banner = document.getElementById('done-' + id);
    if (banner) banner.classList.add('show');
  });
  updateModuleProgress();
}

function updateModuleProgress() {
  const allCards = document.querySelectorAll('.lab-card[id], .task-card[id]');
  const all  = allCards.length;
  const done = document.querySelectorAll('.lab-card[id].done, .task-card[id].done').length;
  const fill  = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  if (fill)  fill.style.width = all ? (done / all * 100) + '%' : '0%';
  if (label) label.textContent = `${done} / ${all} fullført`;
}

/* ── Difficulty filter ───────────────────────────────────── */
function setFilter(level, btn) {
  document.querySelectorAll('.filter-pill').forEach(p => p.className = 'filter-pill');
  btn.classList.add(level === 'all' ? 'active-all' : 'active-' + level);
  document.querySelectorAll('.lab-card, .task-card').forEach(card => {
    card.style.display = (level === 'all' || card.dataset.level === level) ? '' : 'none';
  });
}

/* ── Terminal ── uses lt-* classes ─────────────────────── */
function termRun(bodyId, cmd, responses) {
  const body = document.getElementById(bodyId);
  if (!body) return;
  const add = (text, cls) => {
    const d = document.createElement('div');
    d.className = cls;
    d.textContent = text;
    body.appendChild(d);
  };
  add('$ ' + cmd, 'lt-prompt');
  if (!cmd) { body.scrollTop = body.scrollHeight; return; }
  if (cmd.toLowerCase() === 'clear') { body.innerHTML = ''; return; }

  const key  = cmd.toLowerCase();
  const resp = responses[key] || responses[key.split(' ')[0]];
  if (resp) {
    resp.forEach(l => {
      const cls = l.t === 'info' ? 'lt-info'
                : l.t === 'err'  ? 'lt-err'
                : l.t === 'lt-err' ? 'lt-err'
                : 'lt-out';
      add(l.v, cls);
    });
  } else {
    add(`bash: ${cmd.split(' ')[0]}: command not found  (skriv 'help')`, 'lt-err');
  }
  body.scrollTop = body.scrollHeight;
}

function termInit(bodyId, inputId, responses) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const cmd = input.value.trim();
    input.value = '';
    termRun(bodyId, cmd, responses);
  });
}

/* ── Quiz ────────────────────────────────────────────────── */
function quiz(el, correct) {
  const group = el.closest('.quiz-group');
  if (!group) return;
  group.querySelectorAll('.quiz-opt').forEach(o => {
    o.style.pointerEvents = 'none';
    if (o.dataset.correct === 'true' && !correct) o.classList.add('reveal');
  });
  el.classList.add(correct ? 'correct' : 'wrong');
}

/* ── SHA-256 hash helper ─────────────────────────────────── */
async function sha256(str) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return '(crypto.subtle ikke tilgjengelig — bruk GitHub Pages)';
  }
}

/* ── Answer boxes ── TryHackMe-style typed answers ───────
   Markup:
     <div class="ans-row" data-a="1234567">
       <span class="ans-q">Hvilken statuskode kom tilbake?</span>
       <input class="ans-in" placeholder="tre siffer">
       <span class="ans-mark"></span>
     </div>
   data-a holds one or more accepted answers as hashes, comma
   separated. Generate them with clHash() in the console.
   A task card is marked done when every ans-row inside it is
   correct, so it feeds the existing progress bar for free.
──────────────────────────────────────────────────────── */

function clHash(s){
  let h = 5381;
  s = String(s).trim().toLowerCase().replace(/\s+/g,' ');
  for (let i = 0; i < s.length; i++) { h = ((h << 5) + h) + s.charCodeAt(i); h |= 0; }
  return h;
}

function getAnswers(){
  try { return JSON.parse(localStorage.getItem('cl_answers') || '{}'); } catch { return {}; }
}
function saveAnswers(d){
  try { localStorage.setItem('cl_answers', JSON.stringify(d)); } catch {}
}

function answerKey(row){
  const card = row.closest('.lab-card, .task-card');
  const rows = card ? [...card.querySelectorAll('.ans-row')] : [row];
  return (card && card.id ? card.id : 'x') + ':' + rows.indexOf(row);
}

function checkAnswerRow(row, silent){
  const input = row.querySelector('.ans-in');
  const mark  = row.querySelector('.ans-mark');
  const want  = String(row.dataset.a || '').split(',').map(x => parseInt(x, 10));
  const store = getAnswers();
  const key   = answerKey(row);
  const val   = input.value;

  if (!val.trim()) {
    input.className = 'ans-in'; mark.className = 'ans-mark'; mark.textContent = '';
    delete store[key]; saveAnswers(store); syncCard(row); return false;
  }
  if (want.includes(clHash(val))) {
    input.className = 'ans-in ok'; mark.className = 'ans-mark ok'; mark.textContent = '✓';
    store[key] = val.trim(); saveAnswers(store); syncCard(row); return true;
  }
  if (!silent) { input.className = 'ans-in bad'; mark.className = 'ans-mark bad'; mark.textContent = '✗'; }
  delete store[key]; saveAnswers(store); syncCard(row); return false;
}

function syncCard(row){
  if (row.closest('.lab-card, .task-card, .quiz-card')?.querySelector('.mcq')) return syncCardAll(row);
  const card = row.closest('.lab-card, .task-card');
  if (!card || !card.id) return;
  const rows = [...card.querySelectorAll('.ans-row')];
  const all  = rows.length > 0 && rows.every(r => r.querySelector('.ans-in').classList.contains('ok'));
  if (all) { markTaskDone(card.id); }
  else {
    card.classList.remove('done');
    const p = getProgress(); delete p[card.id]; saveProgress(p);
    const b = document.getElementById('done-' + card.id);
    if (b) b.classList.remove('show');
    updateModuleProgress();
  }
}

function initAnswers(){
  document.querySelectorAll('.ans-row').forEach(row => {
    const input = row.querySelector('.ans-in');
    if (!input || input.dataset.wired) return;
    input.dataset.wired = '1';
    const saved = getAnswers()[answerKey(row)];
    if (saved) { input.value = saved; checkAnswerRow(row, true); }
    input.addEventListener('input', () => checkAnswerRow(row, true));
    input.addEventListener('blur',  () => checkAnswerRow(row, false));
    input.addEventListener('keydown', e => { if (e.key === 'Enter') checkAnswerRow(row, false); });
  });
}

document.addEventListener('DOMContentLoaded', initAnswers);

/* ── Flervalg ── MC-spørsmål som lagrer og teller med i fremdriften ──
   Markup:
     <div class="mcq" data-c="123456">
       <div class="mcq-q">Hva betyr LISTENING?</div>
       <button class="mcq-opt">En tjeneste venter på tilkoblinger</button>
       <button class="mcq-opt">To maskiner snakker sammen nå</button>
       <button class="mcq-opt">Porten er stengt</button>
       <div class="mcq-fb"></div>
     </div>
   data-c er clHash() av teksten i det riktige alternativet, ikke en
   indeks, slik at rekkefølgen kan endres og svaret ikke ligger synlig
   som "riktig = nummer to". Feilsvar låser ikke, studenten kan prøve
   igjen, men riktig svar låser valget.
──────────────────────────────────────────────────────── */

function mcqKey(box){
  const card = box.closest('.lab-card, .task-card, .quiz-card');
  const boxes = card ? [...card.querySelectorAll('.mcq')] : [box];
  return 'mcq:' + (card && card.id ? card.id : 'x') + ':' + boxes.indexOf(box);
}

function markMcq(box, btn, silent){
  const want = parseInt(box.dataset.c, 10);
  const fb   = box.querySelector('.mcq-fb');
  const ok   = clHash(btn.textContent) === want;
  box.querySelectorAll('.mcq-opt').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel', ok ? 'ok' : 'bad');
  if (!ok) btn.classList.remove('ok'); else btn.classList.remove('bad');
  if (fb) {
    fb.textContent = ok ? (box.dataset.ok || 'Riktig.') : (box.dataset.no || 'Ikke helt. Prøv igjen.');
    fb.className = 'mcq-fb show ' + (ok ? 'ok' : 'bad');
  }
  const store = getAnswers();
  if (ok) {
    store[mcqKey(box)] = btn.textContent.trim();
    box.querySelectorAll('.mcq-opt').forEach(b => { if (b !== btn) b.disabled = true; });
  } else {
    delete store[mcqKey(box)];
  }
  saveAnswers(store);
  syncCardAll(box);
}

/* et kort er ferdig når BÅDE alle ans-row og alle mcq er riktige */
function syncCardAll(node){
  const card = node.closest('.lab-card, .task-card, .quiz-card');
  if (!card || !card.id) return;
  const rows = [...card.querySelectorAll('.ans-row')];
  const mcqs = [...card.querySelectorAll('.mcq')];
  const store = getAnswers();
  const rowsOk = rows.every(r => r.querySelector('.ans-in').classList.contains('ok'));
  const mcqsOk = mcqs.every(m => store[mcqKey(m)]);
  if ((rows.length + mcqs.length) > 0 && rowsOk && mcqsOk) { markTaskDone(card.id); }
  else {
    card.classList.remove('done');
    const p = getProgress(); delete p[card.id]; saveProgress(p);
    const b = document.getElementById('done-' + card.id);
    if (b) b.classList.remove('show');
    updateModuleProgress();
  }
}

function initMcq(){
  document.querySelectorAll('.mcq').forEach(box => {
    const saved = getAnswers()[mcqKey(box)];
    box.querySelectorAll('.mcq-opt').forEach(btn => {
      if (btn.dataset.wired) return;
      btn.dataset.wired = '1';
      btn.addEventListener('click', () => markMcq(box, btn, false));
      if (saved && btn.textContent.trim() === saved) markMcq(box, btn, true);
    });
  });
}

document.addEventListener('DOMContentLoaded', initMcq);
