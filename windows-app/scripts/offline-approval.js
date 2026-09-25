// Offline approval: the one change the desktop app makes to its OWN COPY of app.html.
//
// On the website, every launch asks Firestore for the student's profile (loadMe ->
// getDoc users/{uid}) before the gate opens. Firestore's offline cache is off on the
// web, so with no internet that read fails ("client is offline") and the student sees
// "your profile could not be read". The desktop app keeps that live check and adds a
// memory of its last answer:
//
//   * every successful live read is saved on this PC, per account (uid);
//   * offline, the saved profile for the SAME account is used at once;
//   * online, the live read runs first -- if it is slow (over 4 s) or fails because
//     the network is down, the saved profile opens the deck, and the late live
//     answer still lands: if the teacher has changed the account since, the gate is
//     re-applied with the truth. So a removal takes effect the next time online;
//   * an account that has never signed in online on this PC has nothing saved and
//     meets the website's own "could not read your profile" screen.
//
// A saved profile is only ever a copy of what Firestore said. The Firestore rules are
// unchanged and still refuse a pending account every read and write -- this cannot
// open anything the server would not.
//
// patch(html) is pure and fails loudly: if the website's code has moved on and the
// anchors below no longer match exactly once, the sync stops instead of shipping a
// half-patched app.

const MARK = '/* ---- desktop app: offline approval ---- */';

const ANCHORS = {
  fn: 'async function loadMe(user){',
  call: 'try { ME = await loadMe(user); }',
  gate: 'function applyGate(){'
};

/* Inserted in front of the renamed original. ME and applyGate() are the module's own
   bindings, declared in the same <script type="module"> as loadMe. */
const WRAPPER = `${MARK}
const DESKTOP_WAIT_MS = 4000;
const desktopKey = uid => 'desktop.profile.' + uid;
function desktopSaved(uid){
  try {
    const p = JSON.parse(localStorage.getItem(desktopKey(uid)) || 'null');
    return p && p.uid === uid ? p : null;
  } catch (_){ return null; }
}
function desktopSave(p){
  try {
    localStorage.setItem(desktopKey(p.uid), JSON.stringify({
      uid: p.uid, email: p.email || null, label: p.label || null, role: p.role,
      status: p.status, studentId: p.studentId || null, savedAt: Date.now() }));
  } catch (_){}
}
/* only a missing network may fall back to the saved copy -- a refusal from the
   server (permission-denied and the like) is passed on exactly as on the website */
function desktopIsOffline(e){
  const c = String((e && e.code) || ''), m = String((e && e.message) || '');
  return !navigator.onLine || c === 'unavailable' || c.indexOf('network') !== -1 || /offline|network/i.test(m);
}
function desktopRecheck(saved, live){
  if (live.status !== saved.status || live.role !== saved.role){ ME = live; applyGate(); }
}
async function loadMe(user){
  const saved = desktopSaved(user.uid);
  const live = loadMeLive(user).then(p => { desktopSave(p); return p; });
  if (!saved) return live;
  if (!navigator.onLine){ live.then(p => desktopRecheck(saved, p), () => {}); return saved; }
  let timer;
  const late = new Promise(res => { timer = setTimeout(() => res(null), DESKTOP_WAIT_MS); });
  try {
    const first = await Promise.race([live, late]);
    if (first) return first;
  } catch (e){
    if (!desktopIsOffline(e)) throw e;
    return saved;
  } finally { clearTimeout(timer); }
  live.then(p => desktopRecheck(saved, p), () => {});
  return saved;
}
async function loadMeLive(user){`;

function count(hay, needle){
  let n = 0, i = -1;
  while ((i = hay.indexOf(needle, i + 1)) !== -1) n++;
  return n;
}

function patch(html){
  if (html.indexOf(MARK) !== -1) throw new Error('offline-approval: this copy is already patched');
  for (const [name, a] of Object.entries(ANCHORS)){
    const n = count(html, a);
    if (n !== 1) throw new Error('offline-approval: expected the ' + name + ' anchor "' + a + '" exactly once, found ' + n +
                                 ' -- the website code has changed; update windows-app/scripts/offline-approval.js');
  }
  return html.replace(ANCHORS.fn, () => WRAPPER);
}

module.exports = { patch, MARK, ANCHORS, WRAPPER };
