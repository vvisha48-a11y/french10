/* 📅 Class materials — a month calendar of what the teacher has shared, day by day.

   Data: Firestore collection daily_materials, one document per resource:
     { date:'YYYY-MM-DD', title, type, url, by, createdAt }
   Read by every approved account; written only by the teacher -- enforced by the
   rule in windows-app/firestore-daily-materials.rules.txt, not by this screen.

   The page's Firebase is the modular SDK: there is no window.firebase. This module
   imports the SAME SDK files the page imports (the desktop serves them from disk and
   writes the version in below), so getApp() is the page's own app and getAuth()
   its signed-in session -- nobody signs in twice.

   Teacher (vvisha48@gmail.com): a link form, and drag-and-drop of local files, which
   go to the teacher's own Google Drive, are shared "anyone with the link can view",
   and are published here. Everyone else: a read-only list with Open Document ↗,
   which opens in the normal browser. The Teacher/Student toggle is not touched. */
import { getApps, getApp } from '__FIREBASE_SDK__/firebase-app.js';
import { getAuth, onAuthStateChanged } from '__FIREBASE_SDK__/firebase-auth.js';
import {
  getFirestore, collection, query, where, getDocsFromServer, addDoc, deleteDoc, doc, serverTimestamp
} from '__FIREBASE_SDK__/firebase-firestore.js';

const ADMIN_EMAIL = 'vvisha48@gmail.com';
const DOC_URL = /^https:\/\/(drive|docs)\.google\.com\//;
const TYPES = ['PDF', 'Slides', 'Document', 'Worksheet', 'Image', 'Video', 'Audio', 'Link'];
const $ = (s, r) => (r || document).querySelector(s);
const pad = n => String(n).padStart(2, '0');
const keyOf = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let auth = null, db = null, user = null;
let view = new Date(); view.setDate(1);
let picked = keyOf(new Date());
const byDate = new Map();           // 'YYYY-MM-DD' -> [{ id, title, type, url }]
const months = new Map();           // 'YYYY-MM' -> 'loading' | 'ok' | error message
let root = null;

const isAdmin = () => !!(user && String(user.email || '').toLowerCase() === ADMIN_EMAIL);

/* ---------------- Firebase: the page's own app ---------------- */
async function firebase(){
  for (let i = 0; i < 100 && !getApps().length; i++) await new Promise(r => setTimeout(r, 100));
  if (!getApps().length) return false;
  const app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  onAuthStateChanged(auth, u => {
    user = u;
    months.clear(); byDate.clear();
    if (root && !root.hidden){ renderAll(); loadMonth(); }
  });
  return true;
}

function explain(e){
  const c = String((e && e.code) || '');
  if (!navigator.onLine || c === 'unavailable') return 'No internet connection. Class materials need the internet — connect, then reopen this window.';
  if (c === 'permission-denied') return isAdmin()
    ? 'Firestore refused. Publish the daily_materials rule (windows-app/firestore-daily-materials.rules.txt) in Firebase console → Firestore → Rules.'
    : 'Class materials are not available to this account yet. Ask your teacher.';
  return 'Could not load class materials: ' + ((e && e.message) || e);
}

async function loadMonth(){
  const ym = view.getFullYear() + '-' + pad(view.getMonth() + 1);
  if (!db || !user){ renderAll(); return; }
  if (months.get(ym) === 'ok' || months.get(ym) === 'loading') return;
  months.set(ym, 'loading');
  renderAll();
  try {
    /* from the server, never from the cache: offline, getDocs quietly answers with an
       empty local cache, and the month would read as "nothing published" when the
       truth is "not asked yet" */
    const snap = await getDocsFromServer(query(collection(db, 'daily_materials'),
      where('date', '>=', ym + '-01'), where('date', '<=', ym + '-31')));
    for (const k of [...byDate.keys()]) if (k.startsWith(ym)) byDate.delete(k);
    snap.forEach(d => {
      const v = d.data() || {};
      if (!v.date || !v.url) return;
      if (!byDate.has(v.date)) byDate.set(v.date, []);
      byDate.get(v.date).push({ id: d.id, title: v.title || 'Untitled', type: v.type || 'Link', url: v.url,
                                at: v.createdAt && v.createdAt.toMillis ? v.createdAt.toMillis() : 0 });
    });
    byDate.forEach(list => list.sort((a, b) => a.at - b.at));
    months.set(ym, 'ok');
  } catch (e){
    months.set(ym, explain(e));
  }
  renderAll();
}

/* ---------------- the window ---------------- */
function mount(){
  root = document.createElement('div');
  root.id = 'dskCal';
  root.hidden = true;
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-labelledby', 'dskCalTitle');
  root.innerHTML = `
    <div class="dsk-cal-panel">
      <header class="dsk-cal-head">
        <div>
          <h2 id="dskCalTitle">Class materials</h2>
          <p class="dsk-cal-who"></p>
        </div>
        <button type="button" class="dsk-cal-x" aria-label="Close class materials">✕</button>
      </header>
      <div class="dsk-cal-grid">
        <section class="dsk-cal-left" aria-label="Calendar">
          <div class="dsk-cal-nav">
            <button type="button" data-nav="-1" aria-label="Previous month">‹</button>
            <h3 class="dsk-cal-month" aria-live="polite"></h3>
            <button type="button" data-nav="1" aria-label="Next month">›</button>
          </div>
          <div class="dsk-cal-dow" aria-hidden="true"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
          <div class="dsk-cal-days" role="grid"></div>
          <div class="dsk-cal-foot">
            <button type="button" class="dsk-cal-today">Today</button>
            <span class="dsk-cal-legend"><span class="dsk-dot" aria-hidden="true"></span>materials posted</span>
          </div>
        </section>
        <section class="dsk-cal-right" aria-label="Materials for the chosen day">
          <div class="dsk-cal-dayhead"><h3 class="dsk-cal-date"></h3><span class="dsk-cal-count"></span></div>
          <p class="dsk-cal-status" role="status"></p>
          <ul class="dsk-cal-list"></ul>
          <div class="dsk-cal-admin" hidden>
            <form class="dsk-cal-form" novalidate>
              <h4>Publish a link</h4>
              <div class="dsk-cal-fields">
                <label class="dsk-f-name">Resource name<input name="title" maxlength="120" autocomplete="off" placeholder="e.g. Passé composé — worksheet 3"></label>
                <label class="dsk-f-type">Type<select name="type">${TYPES.map(t => '<option>' + t + '</option>').join('')}</select></label>
                <label class="dsk-f-url">Google Drive link<input name="url" type="url" autocomplete="off" spellcheck="false" placeholder="https://drive.google.com/…"></label>
              </div>
              <div class="dsk-cal-formfoot"><button type="submit" class="dsk-cal-publish">Publish</button><span class="dsk-cal-formmsg" role="status"></span></div>
            </form>
            <div class="dsk-cal-drop">
              <strong>Drop files anywhere on this side</strong>
              <span>PowerPoint, PDF, JPEG, Word, audio or video. Each is uploaded to your Google Drive, shared as a view-only link and published to this day.</span>
              <span class="dsk-cal-drive"></span>
            </div>
            <ul class="dsk-cal-uploads"></ul>
          </div>
        </section>
      </div>
    </div>`;
  document.body.appendChild(root);

  /* Nothing typed in this window reaches the deck behind it: the deck reads bare keys
     as shortcuts (T, L, P, F, S, E) and Reveal turns the arrow keys into slide moves,
     so without this, picking a day would walk the lesson. */
  ['keydown', 'keyup', 'keypress'].forEach(t => root.addEventListener(t, e => e.stopPropagation()));
  root.addEventListener('mousedown', e => { if (e.target === root) close(); });
  $('.dsk-cal-x', root).addEventListener('click', close);
  root.querySelectorAll('[data-nav]').forEach(b => b.addEventListener('click', () => shiftMonth(+b.dataset.nav)));
  $('.dsk-cal-today', root).addEventListener('click', () => { const t = new Date(); picked = keyOf(t); view = new Date(t.getFullYear(), t.getMonth(), 1); renderAll(); loadMonth(); });
  $('.dsk-cal-days', root).addEventListener('click', e => {
    const b = e.target.closest('button[data-date]');
    if (!b) return;
    picked = b.dataset.date;
    const d = new Date(picked + 'T12:00:00');
    if (d.getMonth() !== view.getMonth()){ view = new Date(d.getFullYear(), d.getMonth(), 1); loadMonth(); }
    renderAll();
    const f = root.querySelector('.dsk-cal-days button[data-date="' + picked + '"]'); if (f) f.focus();
  });
  $('.dsk-cal-days', root).addEventListener('keydown', e => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (!step) return;
    e.preventDefault();
    const d = new Date(picked + 'T12:00:00'); d.setDate(d.getDate() + step);
    picked = keyOf(d);
    if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()){ view = new Date(d.getFullYear(), d.getMonth(), 1); loadMonth(); }
    renderAll();
    const f = root.querySelector('.dsk-cal-days button[data-date="' + picked + '"]'); if (f) f.focus();
  });
  $('.dsk-cal-list', root).addEventListener('click', onListClick);
  $('.dsk-cal-form', root).addEventListener('submit', onPublish);
  wireDrop($('.dsk-cal-right', root));
}

function shiftMonth(n){ view = new Date(view.getFullYear(), view.getMonth() + n, 1); renderAll(); loadMonth(); }

function renderAll(){
  if (!root) return;
  const who = $('.dsk-cal-who', root);
  who.textContent = !user ? 'Not signed in' : (isAdmin() ? 'Teacher · ' + user.email : 'Signed in · ' + (user.email || user.phoneNumber || ''));

  /* the month */
  $('.dsk-cal-month', root).textContent = view.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const start = new Date(first); start.setDate(1 - ((first.getDay() + 6) % 7));   // back to Monday
  const today = keyOf(new Date());
  let cells = '';
  for (let i = 0; i < 42; i++){
    const d = new Date(start); d.setDate(start.getDate() + i);
    const k = keyOf(d), n = (byDate.get(k) || []).length;
    const out = d.getMonth() !== view.getMonth();
    cells += '<button type="button" role="gridcell" data-date="' + k + '" class="dsk-day' + (out ? ' is-out' : '') +
      (k === today ? ' is-today' : '') + (k === picked ? ' is-picked' : '') + '"' +
      ' tabindex="' + (k === picked ? '0' : '-1') + '"' +
      ' aria-label="' + d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) +
      (n ? ', ' + n + ' resource' + (n === 1 ? '' : 's') : '') + '"' + (k === picked ? ' aria-selected="true"' : '') + '>' +
      '<span class="dsk-day-n">' + d.getDate() + '</span>' + (n ? '<span class="dsk-dot" aria-hidden="true"></span>' : '') + '</button>';
  }
  $('.dsk-cal-days', root).innerHTML = cells;

  /* the day */
  const pd = new Date(picked + 'T12:00:00');
  $('.dsk-cal-date', root).textContent = pd.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const items = byDate.get(picked) || [];
  $('.dsk-cal-count', root).textContent = items.length ? items.length + ' resource' + (items.length === 1 ? '' : 's') : '';
  const ym = picked.slice(0, 7), state = months.get(ym);
  const status = $('.dsk-cal-status', root);
  if (!user) status.textContent = 'Sign in to see class materials.';
  else if (!navigator.onLine && state !== 'ok') status.textContent = 'No internet connection. Class materials need the internet — connect, then reopen this window.';
  else if (state === 'loading') status.textContent = 'Loading…';
  else if (state && state !== 'ok') status.textContent = state;
  else status.textContent = items.length ? '' : (isAdmin() ? 'Nothing published for this day yet.' : 'Nothing for this day.');
  status.hidden = !status.textContent;

  $('.dsk-cal-list', root).innerHTML = items.map(it =>
    '<li class="dsk-item">' +
      '<span class="dsk-type" data-type="' + esc(it.type) + '">' + esc(it.type) + '</span>' +
      '<span class="dsk-item-title">' + esc(it.title) + '</span>' +
      '<span class="dsk-item-acts">' +
        '<button type="button" class="dsk-open" data-url="' + esc(it.url) + '">Open Document ↗</button>' +
        (isAdmin() ? '<button type="button" class="dsk-del" data-id="' + esc(it.id) + '" aria-label="Remove ' + esc(it.title) + '">Remove</button>' : '') +
      '</span></li>').join('');

  const admin = $('.dsk-cal-admin', root);
  admin.hidden = !isAdmin();
  if (isAdmin()){
    $('.dsk-cal-publish', root).textContent = 'Publish to ' + pd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    refreshDrive();
  }
}

/* ---------------- everyone: open ---------------- */
async function onListClick(e){
  const open = e.target.closest('.dsk-open');
  if (open){
    const r = await window.desktop.openDocument(open.dataset.url);
    if (r && r.error) setStatus(r.error);
    return;
  }
  const del = e.target.closest('.dsk-del');
  if (del && isAdmin()){
    const it = (byDate.get(picked) || []).find(x => x.id === del.dataset.id);
    if (!it || !confirm('Remove "' + it.title + '" from ' + picked + '?\n\nThe file stays in your Google Drive.')) return;
    try {
      await inTime(deleteDoc(doc(db, 'daily_materials', it.id)), 'the connection is too slow to remove it — try again');
      byDate.set(picked, (byDate.get(picked) || []).filter(x => x.id !== it.id));
      renderAll();
    } catch (err){ setStatus(explain(err)); }
  }
}
function setStatus(t){ const s = $('.dsk-cal-status', root); s.textContent = t; s.hidden = !t; }

/* ---------------- teacher: publish ---------------- */
/* A Firestore write only settles when the server acknowledges it. Behind a captive
   portal or a school proxy the connection can be gone while Windows still reports
   "online", and addDoc then waits for ever -- which would leave the Publish button
   disabled for the rest of the lesson, or hold a whole batch of uploads. Every write
   is given a deadline instead, and a missed deadline is reported as a failure. */
const WRITE_MS = 20000;
function inTime(promise, what){
  let timer;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise((_, no) => { timer = setTimeout(() => no(new Error(what)), WRITE_MS); })
  ]);
}

async function publish(entry, day){
  const data = { date: day, title: entry.title.slice(0, 120), type: entry.type, url: entry.url,
                 by: String(user.email).toLowerCase(), createdAt: serverTimestamp() };
  const ref = await inTime(addDoc(collection(db, 'daily_materials'), data),
                           'the connection is too slow to publish — try again');
  if (!byDate.has(day)) byDate.set(day, []);
  byDate.get(day).push({ id: ref.id, title: data.title, type: data.type, url: data.url, at: Date.now() });
}

let publishing = false;
async function onPublish(e){
  e.preventDefault();
  if (!isAdmin() || publishing) return;
  const f = e.currentTarget, msg = $('.dsk-cal-formmsg', root);
  const field = n => f.querySelector('[name="' + n + '"]');
  const title = field('title').value.trim(), url = field('url').value.trim(), type = field('type').value;
  if (!title){ msg.textContent = 'Give the resource a name.'; field('title').focus(); return; }
  if (!DOC_URL.test(url)){ msg.textContent = 'Use a Google Drive or Google Docs link (https://drive.google.com/… or https://docs.google.com/…).'; field('url').focus(); return; }
  /* offline, addDoc queues the write and never settles: it would look like nothing
     happened, and a second press would publish the same thing twice */
  if (!navigator.onLine){ msg.textContent = 'No internet connection — connect, then publish.'; return; }
  publishing = true;
  const button = $('.dsk-cal-publish', root);
  if (button) button.disabled = true;
  msg.textContent = 'Publishing…';
  try {
    await publish({ title, type, url }, picked);
    f.reset();
    msg.textContent = 'Published.';
    renderAll();
  } catch (err){ msg.textContent = explain(err); }
  finally { publishing = false; if (button) button.disabled = false; }
}

/* ---------------- teacher: drop files -> Drive -> published ---------------- */
let driveBusy = false;     // a Google sign-in is running: leave its message alone
async function refreshDrive(note){
  if (driveBusy && !note) return;
  const box = $('.dsk-cal-drive', root);
  let s;
  try { s = await window.desktop.drive.status(); } catch (_){ s = { connected: false }; }
  /* asked again after the wait: a sign-in may have started while this was in flight,
     and its "finish in your browser" line must not be painted over */
  if (driveBusy && !note) return;
  box.innerHTML = (note ? '<span class="dsk-cal-note">' + esc(note) + '</span> ' : '') + (s.connected
    ? 'Google Drive: connected' + (s.email ? ' as ' + esc(s.email) : '') + ' · <button type="button" class="dsk-linkbtn" data-drive="disconnect">Disconnect</button>'
    : 'Google Drive is not connected on this PC. <button type="button" class="dsk-linkbtn" data-drive="connect">Connect Google Drive</button>');
  const b = box.querySelector('[data-drive]');
  if (b) b.onclick = async () => {
    if (driveBusy) return;                 // one sign-in at a time
    const connecting = b.dataset.drive === 'connect';
    box.textContent = connecting ? 'Finish signing in to Google in your browser…' : 'Disconnecting…';
    driveBusy = true;                    // sign-in can take minutes; no re-render may wipe that line
    let problem = '';
    try {
      const r = await (connecting ? window.desktop.drive.connect() : window.desktop.drive.disconnect());
      if (r && r.error) problem = r.error;
    } catch (err){ problem = String(err && err.message || err); }
    driveBusy = false;
    refreshDrive(problem);
  };
}

function wireDrop(zone){
  const hasFiles = e => e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') !== -1;
  let depth = 0;
  zone.addEventListener('dragenter', e => { if (!isAdmin() || !hasFiles(e)) return; depth++; zone.classList.add('is-over'); });
  zone.addEventListener('dragleave', () => { if (--depth <= 0){ depth = 0; zone.classList.remove('is-over'); } });
  zone.addEventListener('dragover', e => { if (!isAdmin() || !hasFiles(e)) return; e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
  zone.addEventListener('drop', e => {
    depth = 0; zone.classList.remove('is-over');
    if (!isAdmin() || !hasFiles(e)) return;
    e.preventDefault();
    upload(Array.from(e.dataTransfer.files));
  });
}

let uploading = false;
async function upload(files){
  if (!files.length) return;
  const list = $('.dsk-cal-uploads', root);
  /* one batch at a time: two overlapping drops write into the same progress list and
     their rows would chase each other */
  if (uploading){
    list.insertAdjacentHTML('beforeend', '<li class="dsk-up is-err">Wait for the files already uploading to finish, then drop these.</li>');
    return;
  }
  uploading = true;
  try { await runUpload(files, list); } finally { uploading = false; }
}

async function runUpload(files, list){
  const s = await window.desktop.drive.status().catch(() => ({ connected: false }));
  if (!s.connected){
    list.innerHTML = '<li class="dsk-up is-err">Connect Google Drive first (the button above), then drop the files again.</li>';
    return;
  }
  const day = picked;
  list.innerHTML = files.map((f, i) => '<li class="dsk-up" data-i="' + i + '"><span class="dsk-up-name">' + esc(f.name) +
    '</span><span class="dsk-up-state">waiting</span></li>').join('');
  const row = i => list.querySelector('.dsk-up[data-i="' + i + '"]');
  const say = (i, text, cls) => { const r = row(i); if (!r) return; r.querySelector('.dsk-up-state').textContent = text; if (cls) r.className = 'dsk-up ' + cls; };
  const off = window.desktop.drive.onProgress(p => {
    if (p.phase === 'uploading') say(p.index, 'uploading ' + (p.percent != null ? p.percent + '%' : '…'));
    else if (p.phase === 'sharing') say(p.index, 'sharing…');
  });
  let results = [];
  try { results = await window.desktop.drive.upload(files); }
  catch (err){ files.forEach((_, i) => say(i, String(err && err.message || err), 'is-err')); }
  finally { off(); }
  for (let i = 0; i < results.length; i++){
    const r = results[i];
    if (!r.ok){ say(i, r.error || 'failed', 'is-err'); continue; }
    if (!navigator.onLine){ say(i, 'in your Drive, but not published — no internet', 'is-err'); continue; }
    try {
      await publish({ title: r.title, type: r.type, url: r.url }, day);   // the day they were dropped on
      say(i, 'published ✓', 'is-ok');
    } catch (err){ say(i, explain(err), 'is-err'); }
  }
  renderAll();
}

/* ---------------- open / close ---------------- */
function open(){
  if (document.body.classList.contains('fb-locked')) return;
  if (!root) mount();
  root.hidden = false;
  renderAll();
  loadMonth();
  const f = root.querySelector('.dsk-day.is-picked'); if (f) f.focus();
}
function close(){ if (root) root.hidden = true; const b = document.getElementById('dskCalBtn'); if (b) b.focus(); }

function addButton(){
  if (document.getElementById('dskCalBtn')) return;
  const settings = document.getElementById('settingsBtn');
  if (!settings) return;
  const b = document.createElement('button');
  b.type = 'button';
  b.id = 'dskCalBtn';
  b.className = 'tb-btn dsk-cal-btn';
  b.title = 'Class materials (Ctrl+Shift+M)';
  b.setAttribute('aria-label', 'Class materials');
  b.textContent = '📅';
  b.addEventListener('click', open);
  settings.parentNode.insertBefore(b, settings);
}

window.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && !e.altKey && e.code === 'KeyM'){
    e.preventDefault(); e.stopImmediatePropagation();
    if (root && !root.hidden) close(); else open();
  } else if (e.key === 'Escape' && root && !root.hidden){
    e.preventDefault(); e.stopImmediatePropagation(); close();
  }
}, true);
window.addEventListener('online', () => { if (root && !root.hidden){ months.clear(); loadMonth(); } });
if (window.desktop) window.desktop.onCommand(name => { if (name === 'materials') open(); });

addButton();
window.__dskCalendar = { open, close };
firebase().then(ok => { if (!ok) console.warn('[desktop] calendar: Firebase app not found'); });
