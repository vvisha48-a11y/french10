// Firebase layer injected into the CLONE only (docs/app.html).
// docs/index.html is never touched and stays fully offline.
//
// Design rules this layer obeys:
//  * Purely additive — no existing markup, CSS class or engine function is modified.
//  * Quiz auto-capture works by OBSERVING .score-display, so initQuizContainer is
//    left exactly as it is. Nothing about the quizzes changes when signed out.
//  * All colours come from the deck's theme variables, so the dashboard matches
//    whichever of the 7 themes is active.

/* ------------------------------------------------------------------ *
 *  1. CONFIG — replace this whole object with the one Firebase gives  *
 * ------------------------------------------------------------------ */
module.exports.CONFIG_BLOCK = `  /* ===== PASTE YOUR FIREBASE CONFIG BETWEEN THESE MARKERS ===== */
  const firebaseConfig = {
    apiKey: "PASTE_API_KEY",
    authDomain: "PASTE_PROJECT.firebaseapp.com",
    projectId: "PASTE_PROJECT_ID",
    storageBucket: "PASTE_PROJECT.appspot.com",
    messagingSenderId: "PASTE_SENDER_ID",
    appId: "PASTE_APP_ID"
  };
  /* ===== END FIREBASE CONFIG ===== */`;

/* ---- auth controls, appended inside the existing settings panel ---- */
module.exports.AUTH_HTML = `
  <div class="settings-group fb-group" id="fbAuthGroup">
    <label>Account</label>

    <div id="fbSignedOut">
      <input class="fb-input" id="fbEmail" type="email" placeholder="you@school.com" autocomplete="email">
      <input class="fb-input" id="fbPass" type="password" placeholder="password (6+ characters)" autocomplete="current-password">
      <div class="fb-row">
        <button class="fb-btn fb-primary" id="fbSignIn">Sign in</button>
        <button class="fb-btn" id="fbSignUp">Create account</button>
      </div>
      <div class="fb-or"><span>or</span></div>

      <button class="fb-btn fb-google" id="fbGoogle">
        <svg class="fb-gicon" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.1-3.8 6.6-9.4 6.6-16.1z"/>
          <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.5 46 24 46z"/>
          <path fill="#FBBC05" d="M11.8 28.2c-.4-1.3-.7-2.7-.7-4.2s.3-2.9.7-4.2v-5.7H4.5A22 22 0 0 0 2 24c0 3.6.9 6.9 2.5 9.9l7.3-5.7z"/>
          <path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.5 2 8.1 6.9 4.5 14.1l7.3 5.7c1.7-5.2 6.5-9 12.2-9z"/>
        </svg>
        Continue with Google
      </button>

      <div class="fb-phone">
        <div class="fb-row">
          <input class="fb-input" id="fbPhone" type="tel" placeholder="+91 98765 43210" autocomplete="tel">
          <button class="fb-btn" id="fbPhoneSend">Send code</button>
        </div>
        <div class="fb-row" id="fbCodeRow" hidden>
          <input class="fb-input" id="fbCode" type="text" inputmode="numeric" placeholder="6-digit code" autocomplete="one-time-code">
          <button class="fb-btn fb-primary" id="fbPhoneVerify">Verify</button>
        </div>
        <div id="fbRecaptcha"></div>
      </div>
    </div>

    <div id="fbSignedIn" hidden>
      <p class="fb-who"><span id="fbWhoEmail"></span><span class="fb-role" id="fbRole"></span></p>
      <button class="fb-btn fb-primary" id="fbDashBtn">📊 Student dashboard</button>
      <button class="fb-btn" id="fbSignOut">Sign out</button>
    </div>

    <p class="fb-msg" id="fbMsg"></p>
  </div>
`;

/* ---- dashboard modal: a new overlay, so no slide or stack changes ---- */
module.exports.DASH_HTML = `
<div class="fb-modal" id="fbDash" hidden>
  <div class="fb-dash-card">
    <div class="fb-dash-head">
      <h3 id="fbDashTitle">Student dashboard</h3>
      <button class="fb-btn" id="fbDashClose" title="Close">✕</button>
    </div>
    <div class="fb-dash-body" id="fbDashBody">
      <p class="fb-msg">Loading…</p>
    </div>
  </div>
</div>
`;

module.exports.CSS = `/* ===== FIREBASE LAYER (clone only) ===== */
.fb-input{
  width:100%; margin:4px 0; padding:8px 10px; border-radius:9px;
  border:1.5px solid var(--card-border); background:var(--card-bg);
  color:var(--text-main); font-family:inherit; font-size:.88rem;
}
.fb-row{ display:flex; gap:6px; margin-top:6px; }
.fb-btn{
  flex:1 1 auto; padding:8px 12px; border-radius:9px; cursor:pointer;
  border:1.5px solid var(--card-border); background:var(--card-bg);
  color:var(--text-main); font-family:inherit; font-size:.85rem; font-weight:700;
}
.fb-btn:hover{ border-color:var(--heading-color); }
.fb-primary{ background:var(--heading-color); border-color:var(--heading-color); color:#fff; }
.fb-who{ margin:0 0 8px; font-size:.85rem; font-weight:700; color:var(--text-main); }
.fb-role{
  margin-left:8px; padding:2px 9px; border-radius:999px; font-size:.68rem;
  background:var(--gold); color:#fff; font-weight:800; text-transform:uppercase;
}
.fb-msg{ margin:8px 0 0; font-size:.8rem; color:var(--text-muted); min-height:1em; }
.fb-msg.err{ color:var(--crimson); font-weight:700; }
.fb-msg.ok{ color:var(--green); font-weight:700; }

.fb-modal{
  position:fixed; inset:0; z-index:9500; display:flex;
  align-items:center; justify-content:center; padding:3vh 3vw;
  background:rgba(0,0,0,.62);
}
.fb-modal[hidden]{ display:none; }
.fb-dash-card{
  width:100%; max-width:1200px; max-height:92vh; display:flex; flex-direction:column;
  background:var(--card-bg); border:1px solid var(--card-border); border-radius:18px;
  box-shadow:0 24px 70px rgba(0,0,0,.45); overflow:hidden;
}
.fb-dash-head{
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:14px 20px; border-bottom:1px solid var(--card-border); flex:none;
}
.fb-dash-head h3{ margin:0; color:var(--heading-color); font-size:1.15rem; }
.fb-dash-head .fb-btn{ flex:0 0 auto; }
.fb-dash-body{ padding:16px 20px 22px; overflow-y:auto; min-height:0; text-align:left; }

.fb-tabs{ display:flex; gap:8px; margin-bottom:14px; flex-wrap:wrap; }
.fb-tab{
  padding:7px 16px; border-radius:999px; cursor:pointer; font-weight:700; font-size:.86rem;
  border:1.5px solid var(--card-border); background:var(--card-bg); color:var(--text-main);
}
.fb-tab.on{ background:var(--heading-color); border-color:var(--heading-color); color:#fff; }

.fb-table{ width:100%; border-collapse:collapse; }
.fb-table th, .fb-table td{
  padding:8px 10px; text-align:left; font-size:.88rem;
  border-bottom:1px solid var(--card-border); vertical-align:middle;
}
.fb-table th{ font-size:.74rem; text-transform:uppercase; letter-spacing:.04em; color:var(--text-muted); }
.fb-table tr:hover td{ background:var(--highlight-bg); }
.fb-name{ font-weight:700; color:var(--heading-color); cursor:pointer; }
.fb-pill{
  display:inline-block; padding:2px 10px; border-radius:999px;
  font-size:.74rem; font-weight:800; background:var(--card-border); color:var(--text-main);
}
.fb-pill.good{ background:var(--green); color:#fff; }
.fb-pill.mid{ background:var(--gold); color:#fff; }
.fb-pill.low{ background:var(--crimson); color:#fff; }
.fb-sub{ font-size:.78rem; color:var(--text-muted); }
.fb-form{ display:flex; gap:6px; flex-wrap:wrap; align-items:center; margin:10px 0 4px; }
.fb-form .fb-input{ width:auto; flex:1 1 130px; margin:0; }
.fb-form .fb-btn{ flex:0 0 auto; }
.fb-back{ cursor:pointer; color:var(--heading-color); font-weight:700; font-size:.85rem; }
/* --- extra sign-in providers --- */
.fb-row .fb-input{ width:auto; flex:1 1 8ch; margin:0; min-width:0; }
.fb-or{
  display:flex; align-items:center; gap:10px; margin:12px 0 10px;
  color:var(--text-muted); font-size:.72rem; text-transform:uppercase; letter-spacing:.08em;
}
.fb-or::before, .fb-or::after{ content:""; flex:1 1 auto; height:1px; background:var(--card-border); }
.fb-google{ display:flex; align-items:center; justify-content:center; gap:9px; width:100%; }
.fb-gicon{ width:17px; height:17px; flex:0 0 auto; }
.fb-phone{ margin-top:10px; }
.fb-phone .fb-row + .fb-row{ margin-top:6px; }
#fbRecaptcha:empty{ display:none; }
#fbRecaptcha{ margin-top:8px; }
@media print{ .fb-modal, .fb-group{ display:none !important; } }
`;

/* ---- the module script; injected just before </body> ---- */
module.exports.JS = (config) => `<script type="module">
/* ============================================================
   Firebase layer — CLONE ONLY. Additive: it observes the deck,
   it never modifies it. Signed out, the app behaves exactly as
   docs/index.html does.
   ============================================================ */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut,
  GoogleAuthProvider, signInWithPopup,
  RecaptchaVerifier, signInWithPhoneNumber
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {
  getFirestore, doc, getDoc, setDoc, addDoc, collection,
  query, where, getDocs, serverTimestamp, orderBy, limit, increment
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

${config}

const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const msg = (t, cls) => { const m = $('#fbMsg'); if (m){ m.textContent = t || ''; m.className = 'fb-msg ' + (cls || ''); } };

let app, auth, db, ME = null;      // ME = { uid, email, role, studentId }

/* The Admin is identified by email. This is only the CLIENT half — the matching
   Firestore rule (request.auth.token.email) is what actually enforces it. */
const ADMIN_EMAIL = 'vvisha48@gmail.com';
const isAdminUser = u => String((u && u.email) || '').toLowerCase() === ADMIN_EMAIL;
let signupName = null;   // name typed on the sign-up tab, stored on the user doc
let fbReady = false;     // set once Firebase has reported an auth state

try {
  if (String(firebaseConfig.apiKey).indexOf('PASTE_') === 0){
    msg('Firebase is not configured yet — paste your config into the file.', 'err');
    throw new Error('unconfigured');
  }
  app  = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db   = getFirestore(app);
} catch (e){
  console.warn('Firebase not started:', e.message);
  /* Fail CLOSED and say why, rather than letting anyone through. */
  gateShow('down', e.message === 'unconfigured'
    ? 'This app has not been connected to its Firebase project yet.'
    : 'The sign-in service could not start: ' + e.message);
}

/* ---------------- auth ---------------- */
// A user may arrive by email, by Google or by SMS, so there is no single identifier.
const label = u => u.email || u.phoneNumber || u.displayName || 'Signed in';

async function loadMe(user){
  const ref = doc(db, 'users', user.uid);
  const admin = isAdminUser(user);
  const snap = await getDoc(ref);
  if (!snap.exists()){
    // New account: ALWAYS 'student'. The teacher role is granted in the console,
    // never by self-registration — that is what stops a stranger reading the class.
    await setDoc(ref, {
      email: user.email || null, phone: user.phoneNumber || null,
      name: signupName || user.displayName || null,
      role: admin ? 'teacher' : 'student',
      /* New students land PENDING and stay locked out until the Admin approves
         them. The rules refuse any create that says otherwise. */
      status: admin ? 'approved' : 'pending',
      studentId: null, createdAt: serverTimestamp()
    });
    return { uid: user.uid, email: user.email, label: label(user),
             role: admin ? 'teacher' : 'student', status: admin ? 'approved' : 'pending', studentId: null };
  }
  const d = snap.data();
  /* An account made before approvals existed has no status: treat it as pending,
     never as approved, or the gate would be a no-op for every existing user. */
  let status = d.status || (admin ? 'approved' : 'pending');
  if (admin && status !== 'approved'){
    try { await setDoc(ref, { role: 'teacher', status: 'approved' }, { merge: true }); status = 'approved'; }
    catch (_){}
  }
  return { uid: user.uid, email: user.email, label: label(user),
           role: admin ? 'teacher' : (d.role || 'student'), status: status, studentId: d.studentId || null };
}

if (auth) onAuthStateChanged(auth, async (user) => {
  const out = $('#fbSignedOut'), inn = $('#fbSignedIn');
  fbReady = true;
  if (!user){
    ME = null;
    if (out) out.hidden = false;
    if (inn) inn.hidden = true;
    msg('');
    const ab = $('#adBtn'); if (ab) ab.hidden = true;   // signed out: no trigger
    const aib = $('#aiBtn'); if (aib) aib.hidden = true;
    aiSet(false);
    gateShow('form');
    return;
  }
  try { ME = await loadMe(user); }
  catch (e){
    msg('Signed in, but could not read your profile: ' + e.message, 'err');
    gateShow('down', 'Signed in, but your profile could not be read: ' + e.message);
    return;
  }
  if (out) out.hidden = true;
  if (inn) inn.hidden = false;
  $('#fbWhoEmail').textContent = ME.label || ME.email || 'Signed in';
  $('#fbRole').textContent = ME.role;
  msg('');
  applyGate();
});

if ($('#fbSignIn')) $('#fbSignIn').onclick = async () => {
  msg('Signing in…');
  try { await signInWithEmailAndPassword(auth, $('#fbEmail').value.trim(), $('#fbPass').value); }
  catch (e){ msg(friendly(e), 'err'); }
};
if ($('#fbSignUp')) $('#fbSignUp').onclick = async () => {
  msg('Creating account…');
  try { await createUserWithEmailAndPassword(auth, $('#fbEmail').value.trim(), $('#fbPass').value); msg('Account created.', 'ok'); }
  catch (e){ msg(friendly(e), 'err'); }
};
if ($('#fbSignOut')) $('#fbSignOut').onclick = () => { resetPhone(); signOut(auth); };

/* ---------------- Google ---------------- */
if ($('#fbGoogle')) $('#fbGoogle').onclick = async () => {
  msg('Opening Google…');
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, provider);
  } catch (e){ msg(friendly(e), 'err'); }
};

/* ---------------- Phone / SMS ----------------
   Firebase requires a reCAPTCHA before it will send an SMS. It is invisible and
   built lazily, so nothing is loaded for the many users who never touch phone
   sign-in. A failed send must clear the verifier: reCAPTCHA cannot be reused. */
let confirmation = null, recaptcha = null;
function resetPhone(){
  confirmation = null;
  if (recaptcha){ try { recaptcha.clear(); } catch (_){} recaptcha = null; }
  const row = $('#fbCodeRow'); if (row) row.hidden = true;
  const box = $('#fbRecaptcha'); if (box) box.innerHTML = '';
}
const e164 = v => String(v || '').replace(/[\\s()\\-.]/g, '');

if ($('#fbPhoneSend')) $('#fbPhoneSend').onclick = async () => {
  const num = e164($('#fbPhone').value);
  if (!/^\\+[1-9]\\d{7,14}$/.test(num)){
    msg('Use the international form, including the country code — e.g. +919876543210.', 'err');
    return;
  }
  msg('Sending code…');
  try {
    if (!recaptcha) recaptcha = new RecaptchaVerifier(auth, 'fbRecaptcha', { size: 'invisible' });
    confirmation = await signInWithPhoneNumber(auth, num, recaptcha);
    $('#fbCodeRow').hidden = false;
    $('#fbCode').focus();
    msg('Code sent by SMS.', 'ok');
  } catch (e){
    resetPhone();
    msg(friendly(e), 'err');
  }
};

if ($('#fbPhoneVerify')) $('#fbPhoneVerify').onclick = async () => {
  if (!confirmation){ msg('Send the code first.', 'err'); return; }
  const code = String($('#fbCode').value || '').trim();
  if (!/^\\d{6}$/.test(code)){ msg('The code is six digits.', 'err'); return; }
  msg('Checking code…');
  try { await confirmation.confirm(code); resetPhone(); }
  catch (e){ msg(friendly(e), 'err'); }
};

function friendly(e){
  const c = (e && e.code) || '';
  if (c.includes('invalid-credential') || c.includes('wrong-password')) return 'Wrong email or password.';
  if (c.includes('user-not-found')) return 'No account with that email — use Create account.';
  if (c.includes('email-already-in-use')) return 'That email already has an account — use Sign in.';
  if (c.includes('weak-password')) return 'Password must be at least 6 characters.';
  if (c.includes('invalid-email')) return 'That does not look like an email address.';
  if (c.includes('popup-closed-by-user')) return 'Google sign-in was cancelled.';
  if (c.includes('popup-blocked')) return 'Your browser blocked the Google popup — allow popups for this site.';
  if (c.includes('account-exists-with-different-credential')) return 'That email already has an account using a different sign-in method.';
  if (c.includes('unauthorized-domain')) return 'This domain is not on the Firebase authorised-domains list.';
  if (c.includes('operation-not-allowed')) return 'That sign-in method is not enabled in the Firebase console.';
  if (c.includes('invalid-phone-number')) return 'That phone number is not valid — include the country code.';
  if (c.includes('invalid-verification-code')) return 'That code is not correct.';
  if (c.includes('code-expired')) return 'The code expired — send a new one.';
  if (c.includes('quota-exceeded')) return 'The SMS quota for this project is used up.';
  if (c.includes('captcha-check-failed')) return 'The reCAPTCHA check failed — reload the page and try again.';
  if (c.includes('too-many-requests')) return 'Too many attempts — wait a few minutes before trying again.';
  if (c.includes('network')) return 'No network — the dashboard needs an internet connection.';
  return (e && e.message) || 'Something went wrong.';
}

/* ---------------- the sign-in gate ----------------
   Blocks the deck until an approved account is present. The overlay is opaque and
   sits at z-index 10000, above every existing layer (highest was #dropClose at 9001,
   and this layer own fb-modal at 9500), so nothing behind it is reachable. */

function gateEl(){ return $('#fbGate'); }
function gateShow(panel, why){
  const g = gateEl(); if (!g) return;
  g.hidden = false;
  document.body.classList.add('fb-locked');
  const f = $('#fbGateForm'), w = $('#fbGateWait'), d = $('#fbGateDown');
  if (f) f.hidden = panel !== 'form';
  if (w) w.hidden = panel !== 'wait';
  if (d) d.hidden = panel !== 'down';
  if (panel === 'down' && why){ const el = $('#fbDownWhy'); if (el) el.textContent = why; }
}
function gateHide(){
  const g = gateEl(); if (!g) return;
  g.hidden = true;
  document.body.classList.remove('fb-locked');
  /* the deck measured itself while covered, so let Reveal re-measure */
  try { if (window.Deck && window.Deck.layout) window.Deck.layout(); } catch (_){}
}
function gateMsg(t, cls){
  const m = $('#fbGateMsg'); if (!m) return;
  m.textContent = t || ''; m.className = 'fb-gate-msg ' + (cls || ''); m.hidden = !t;
}
function applyGate(){
  /* the admin trigger follows the account, never the other way round */
  const ab = $('#adBtn');
  if (ab) ab.hidden = !(ME && ME.role === 'teacher');
  const aib = $('#aiBtn');
  if (aib) aib.hidden = !(ME && ME.role === 'teacher' && aiKey());
  if (!ME){ gateShow('form'); return; }
  if (ME.role === 'teacher' || ME.status === 'approved'){ gateHide(); return; }
  const w = $('#fbWaitWho'); if (w) w.textContent = ME.label || ME.email || '';
  gateShow('wait');
}

let gateMode = 'in';
function setGateMode(m){
  gateMode = m;
  const ti = $('#fbTabIn'), tu = $('#fbTabUp'), nw = $('#fbGNameWrap');
  const go = $('#fbGateGo'), note = $('#fbGateNote'), pw = $('#fbGPass');
  if (ti) ti.className = 'fb-tab' + (m === 'in' ? ' is-on' : '');
  if (tu) tu.className = 'fb-tab' + (m === 'up' ? ' is-on' : '');
  if (nw) nw.hidden = m !== 'up';
  if (go) go.textContent = m === 'up' ? 'Create account' : 'Sign in';
  if (pw) pw.setAttribute('autocomplete', m === 'up' ? 'new-password' : 'current-password');
  if (note) note.textContent = m === 'up'
    ? 'Your account will wait for your teacher to approve it before the lessons open.'
    : 'New students: create an account, then wait for your teacher to let you in.';
  gateMsg('');
}

async function gateSubmit(){
  if (!auth){ gateShow('down', 'The sign-in service is not available.'); return; }
  const em = String((($('#fbGEmail') || {}).value) || '').trim();
  const pw = String((($('#fbGPass') || {}).value) || '');
  if (!em || !pw){ gateMsg('Enter your email and your password.', 'err'); return; }
  const go = $('#fbGateGo');
  if (go) go.disabled = true;
  try {
    if (gateMode === 'up'){
      const nm = String((($('#fbGName') || {}).value) || '').trim();
      if (!nm){ gateMsg('Please give your full name, so your teacher can find you on the class list.', 'err'); return; }
      signupName = nm;
      gateMsg('Creating your account...');
      await createUserWithEmailAndPassword(auth, em, pw);
    } else {
      gateMsg('Signing in...');
      await signInWithEmailAndPassword(auth, em, pw);
    }
  } catch (e){ gateMsg(friendly(e), 'err'); }
  finally { if (go) go.disabled = false; }
}

/* ---- feedback: max 150 characters, name optional ---- */
function fbkMsg(t, cls){
  const m = $('#fbFbkMsg'); if (!m) return;
  m.textContent = t || ''; m.className = 'fb-gate-msg ' + (cls || ''); m.hidden = !t;
}
function openFeedback(){
  const m = $('#fbFeedbackModal'); if (!m) return;
  m.hidden = false; fbkMsg('');
  const t = $('#fbFbText'); if (t) setTimeout(() => t.focus(), 30);
}
function closeFeedback(){ const m = $('#fbFeedbackModal'); if (m) m.hidden = true; }
async function sendFeedback(){
  const ta = $('#fbFbText'); if (!ta) return;
  const text = String(ta.value || '').trim();
  if (!text){ fbkMsg('Please write something first.', 'err'); return; }
  if (text.length > 150){ fbkMsg('150 characters maximum.', 'err'); return; }
  if (!db){ fbkMsg('No connection to the server - please try again later.', 'err'); return; }
  let last = 0;
  try { last = Number(localStorage.getItem('cbse_fr_master_fbk_at') || 0); } catch (_){}
  if (Date.now() - last < 30000){ fbkMsg('Thank you - please wait a moment before sending again.', 'err'); return; }
  const btn = $('#fbFbkSend'); if (btn) btn.disabled = true;
  fbkMsg('Sending...');
  try {
    const nm = String((($('#fbFbName') || {}).value) || '').trim().slice(0, 60);
    await addDoc(collection(db, 'feedback'), {
      text: text,
      name: nm || null,
      uid: (auth && auth.currentUser) ? auth.currentUser.uid : null,
      createdAt: serverTimestamp()
    });
    try { localStorage.setItem('cbse_fr_master_fbk_at', String(Date.now())); } catch (_){}
    ta.value = '';
    const nEl = $('#fbFbName'); if (nEl) nEl.value = '';
    const c = $('#fbFbCount'); if (c) c.textContent = '0';
    fbkMsg('Thank you - your feedback has been sent.', 'ok');
    setTimeout(closeFeedback, 1400);
  } catch (e){ fbkMsg(friendly(e), 'err'); }
  finally { if (btn) btn.disabled = false; }
}

/* ---- keyboard: the deck must not see keystrokes typed into the gate ----
   Registered in the CAPTURE phase because the engine own document handler runs
   Ctrl+K (search) and Escape BEFORE its typing guard, and that guard tests
   INPUT / SELECT / contenteditable but NOT TEXTAREA - so without this, typing
   feedback would toggle fullscreen, projector, settings and teacher mode. */
document.addEventListener('keydown', ev => {
  const g = gateEl(), m = $('#fbFeedbackModal');
  const gateOpen = g && !g.hidden;
  const fbkOpen  = m && !m.hidden;
  if (!gateOpen && !fbkOpen) return;
  if (ev.key === 'Escape' && fbkOpen){ ev.preventDefault(); closeFeedback(); }
  else if (ev.key === 'Enter' && !ev.shiftKey){
    const id = (ev.target && ev.target.id) || '';
    if (fbkOpen && id !== 'fbFbText'){ ev.preventDefault(); sendFeedback(); }
    else if (!fbkOpen && gateOpen && $('#fbGateForm') && !$('#fbGateForm').hidden){
      ev.preventDefault(); gateSubmit();
    }
  }
  ev.stopImmediatePropagation();
}, true);

(function wireGate(){
  const on = (id, fn) => { const el = $('#' + id); if (el) el.addEventListener('click', fn); };
  on('fbTabIn',  () => setGateMode('in'));
  on('fbTabUp',  () => setGateMode('up'));
  on('fbGateGo', gateSubmit);
  on('fbWaitOut', () => { try { signOut(auth); } catch (_){} });
  on('fbWaitRefresh', async () => {
    if (!auth || !auth.currentUser) return;
    gateMsg('');
    try { ME = await loadMe(auth.currentUser); applyGate(); }
    catch (e){ console.warn(e); }
  });
  on('fbDownRetry', () => location.reload());
  on('fbFeedbackBtn', openFeedback);
  on('fbFbkClose',  closeFeedback);
  on('fbFbkCancel', closeFeedback);
  on('fbFbkSend',   sendFeedback);
  const ta = $('#fbFbText'), c = $('#fbFbCount');
  if (ta && c) ta.addEventListener('input', () => {
    c.textContent = String(ta.value.length);
    if (c.parentNode) c.parentNode.className = 'fb-count' + (ta.value.length >= 150 ? ' over' : '');
  });
  const fm = $('#fbFeedbackModal');
  if (fm) fm.addEventListener('click', ev => { if (ev.target === fm) closeFeedback(); });
  /* If Firebase never answers, say so rather than locking the page silently. */
  setTimeout(() => {
    if (!fbReady && gateEl() && !gateEl().hidden){
      gateShow('down', 'The sign-in server did not answer. Check your internet connection, then press Retry.');
    }
  }, 10000);
})();

/* ---------------- Pick Student: weekly-fair selection ----------------
   Feature 2 + 3. The deck already owns the roster and the class chooser, so this
   does NOT reimplement them: it intercepts the class button in the CAPTURE phase,
   which stops the engine own spinPick (a uniform random draw with no memory) and
   runs a fair draw instead. Nothing in e-engine.html is modified. */

const PS_HOLD_MS = 3000;   // the name is held large for exactly 3 seconds
const PS_SPIN_MS = 900;    // short suspense spin before it lands
let psHold = null, psSpin = null, psLastClass = null;

/* ISO-8601 week, so the cycle turns over on Monday like the timetable does. */
function psWeekKey(d){
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = dt.getUTCDay() || 7;
  dt.setUTCDate(dt.getUTCDate() + 4 - day);
  const yr = dt.getUTCFullYear();
  const jan1 = new Date(Date.UTC(yr, 0, 1));
  const wk = Math.ceil((((dt - jan1) / 86400000) + 1) / 7);
  return yr + '-W' + (wk < 10 ? '0' + wk : String(wk));
}

function psRoster(cls){
  const R = window.__ROSTERS || {};
  return Array.isArray(R[cls]) ? R[cls].slice() : [];
}

/* Local mirror. A lesson must not stop because the wifi did, so every pick is
   written to localStorage as well and read back if Firestore is unreachable. */
function psLocalKey(week, cls){ return 'cbse_fr_master_picks_' + week + '_' + cls; }
function psLocalGet(week, cls){
  try {
    const v = JSON.parse(localStorage.getItem(psLocalKey(week, cls)) || 'null');
    if (v && Array.isArray(v.called)) return { called: v.called, last: v.last || null };
  } catch (_){}
  return { called: [], last: null };
}
function psLocalSet(week, cls, data){
  try { localStorage.setItem(psLocalKey(week, cls), JSON.stringify(data)); } catch (_){}
}

async function psLoadWeek(week, cls){
  const local = psLocalGet(week, cls);
  if (!db) return local;
  try {
    /* A lesson must never wait on the network. If Firestore has not answered in
       4 seconds, fall back to this device copy and carry on. */
    const bail = new Promise((_, rej) => setTimeout(() => rej(new Error('slow network')), 4000));
    const snap = await Promise.race([getDoc(doc(db, 'picks', week + '__' + cls)), bail]);
    if (!snap.exists()) return local;
    const d = snap.data();
    const merged = Array.isArray(d.called) ? d.called.slice() : [];
    local.called.forEach(x => { if (merged.indexOf(x) === -1) merged.push(x); });
    return { called: merged, last: d.last || local.last || null };
  } catch (e){ console.warn('[Pick Student] cloud read failed, using this device:', e.message); return local; }
}

async function psSaveWeek(week, cls, data){
  psLocalSet(week, cls, data);
  if (!db) return;
  try {
    await setDoc(doc(db, 'picks', week + '__' + cls),
      { week: week, cls: cls, called: data.called, last: data.last, updatedAt: serverTimestamp() },
      { merge: true });
  } catch (e){ console.warn('[Pick Student] cloud write failed, kept on this device:', e.message); }
}

/* THE FAIRNESS RULE: draw only from students not yet called this week. When the
   class is exhausted the cycle resets - and the student called last is held out
   of the fresh round, so nobody can be picked twice across the boundary. */
function psChoose(roster, called, last){
  let pool = roster.filter(x => called.indexOf(x) === -1);
  let cycled = false;
  if (!pool.length){
    cycled = true;
    pool = roster.slice();
    if (pool.length > 1 && last) pool = pool.filter(x => x !== last);
  }
  return { name: pool[Math.floor(Math.random() * pool.length)], cycled: cycled };
}

async function psPick(cls){
  const roster = psRoster(cls);
  if (!roster.length){ console.warn('[Pick Student] no roster for ' + cls); return; }
  psLastClass = cls;
  const week = psWeekKey(new Date());
  psStartSpin(roster);                    // react to the click at once
  const spun = new Promise(r => setTimeout(r, PS_SPIN_MS));
  const data = await psLoadWeek(week, cls);
  const res = psChoose(roster, data.called, data.last);
  const called = res.cycled ? [] : data.called.slice();
  called.push(res.name);
  const next = { called: called, last: res.name };
  psSaveWeek(week, cls, next);            // not awaited: the lesson must not wait
  await spun;                             // never land before the spin has been seen
  psLand(cls, res, roster, called.length, week);
}

/* The spin starts the instant the class is chosen, so the screen reacts to the
   click immediately and the Firestore round-trip hides inside the animation. */
function psStartSpin(roster){
  const stage = $('#psStage'), nameEl = $('#psName'), subEl = $('#psSub');
  if (!stage || !nameEl) return;
  clearInterval(psSpin); clearTimeout(psHold);
  psHideBar();
  if (subEl) subEl.textContent = '';
  stage.hidden = false;
  stage.className = 'ps-stage is-spin';
  psSpin = setInterval(() => {
    nameEl.textContent = roster[Math.floor(Math.random() * roster.length)];
  }, 70);
}

function psLand(cls, res, roster, calledCount, week){
  const stage = $('#psStage'), nameEl = $('#psName'), subEl = $('#psSub');
  if (!stage || !nameEl) return;
  clearInterval(psSpin);
  nameEl.textContent = res.name;
  stage.className = 'ps-stage is-land';
  const left = roster.length - calledCount;
  if (subEl) subEl.textContent = res.cycled
    ? 'Nouveau tour - everyone has had a turn, the cycle starts again'
    : (left === 0 ? 'That is everyone for this week' : left + ' still to be called this week');
  /* exactly 3 seconds large, then hand off to the bottom bar */
  psHold = setTimeout(() => { stage.hidden = true; psShowBar(res.name, cls, week); }, PS_HOLD_MS);
}

function psShowBar(name, cls, week){
  const bar = $('#psBar'); if (!bar) return;
  const nEl = $('#psBarName'), cEl = $('#psBarClass');
  if (nEl) nEl.textContent = name;
  if (cEl) cEl.textContent = cls;
  bar.dataset.student = name; bar.dataset.cls = cls; bar.dataset.week = week;
  bar.hidden = false;
  requestAnimationFrame(() => bar.classList.add('is-in'));
}
function psHideBar(){
  const bar = $('#psBar'); if (!bar) return;
  bar.classList.remove('is-in', 'is-ok', 'is-err');
  bar.hidden = true;
}

/* Feature 4 will replace the console line with the tiered French affirmation and
   the Firestore write. The verdict is logged in one place so there is exactly one
   thing to change. */
async function psVerdict(v){
  const bar = $('#psBar'); if (!bar || bar.hidden) return;
  const student = bar.dataset.student, cls = bar.dataset.cls, week = bar.dataset.week;
  const correct = v === 'correct';
  console.log('[Pick Student] ' + (correct ? 'CORRECT' : 'WRONG') +
              ' - ' + student + ' (' + cls + ', ' + week + ')');
  bar.classList.add(correct ? 'is-ok' : 'is-err');
  setTimeout(psHideBar, 1200);
  const count = await afRecord(week, cls, student, correct);
  if (correct) afShow(student, count);
  lbSetClass(cls, false);
  lbRender(true);
}

/* Intercept the deck own class buttons. Capture phase, so this runs BEFORE the
   per-button listener the engine attached, and stopImmediatePropagation keeps
   spinPick from ever starting. */
document.addEventListener('click', ev => {
  const t = ev.target;
  if (!t || !t.closest) return;
  const again = t.closest('#pickAgainBtn');
  const btn = t.closest('.pick-class-btn');
  if (!btn && !again) return;
  const cls = btn ? btn.getAttribute('data-class') : psLastClass;
  if (!cls) return;
  ev.preventDefault();
  ev.stopImmediatePropagation();
  const modal = document.getElementById('pickStudentModal');
  if (modal) modal.classList.remove('open');
  psPick(cls);
}, true);

/* Escape must dismiss the picker rather than reach Reveal, which would open the
   slide overview on top of the lesson. */
document.addEventListener('keydown', ev => {
  const stage = $('#psStage'), bar = $('#psBar');
  const up = (stage && !stage.hidden) || (bar && !bar.hidden);
  if (!up) return;
  if (ev.key === 'Escape'){
    ev.preventDefault(); ev.stopImmediatePropagation();
    clearTimeout(psHold); clearInterval(psSpin);
    if (stage) stage.hidden = true;
    psHideBar();
  }
}, true);

(function wirePick(){
  const on = (id, fn) => { const el = $('#' + id); if (el) el.addEventListener('click', fn); };
  on('psCorrect',  () => psVerdict('correct'));
  on('psWrong',    () => psVerdict('wrong'));
  on('psDismiss',  psHideBar);
})();

/* ---------------- Features 4 + 5: scoring, affirmations, leaderboard ----------------
   One document per class per week (scores/2026-W36__10E) holding a map of
   student -> count. That is a single read for the leaderboard and needs no
   composite index, which matters on the free Spark plan. Counts are written with
   increment(), so two open tabs cannot clobber each other. */

/* Field names may not contain dots or slashes, so names become slugs and the
   readable name is stored alongside. */
function afSlug(nm){ return String(nm).replace(/[^A-Za-z0-9]+/g, '_'); }

/* Every affirmation here is gender-invariant on purpose. "Champion !" would need
   "Championne !" for a girl, and the roster carries no gender - a French teacher
   would notice the disagreement immediately. */
const AF_TIERS = [
  { min: 8, tier: 3, emoji: '🌟', word: 'Extraordinaire !', sub: 'Tu es une star de la classe !' },
  { min: 5, tier: 3, emoji: '🏆', word: 'Magnifique !',     sub: 'Quelle semaine !' },
  { min: 3, tier: 3, emoji: '🎉', word: 'Formidable !',     sub: 'Tu es en forme !' },
  { min: 2, tier: 2, emoji: '👏', word: 'Excellent !',      sub: 'Continue comme ça' },
  { min: 1, tier: 1, emoji: '✨',     word: 'Très bien !',      sub: 'Bonne réponse' }
];
function afTierFor(count){
  for (let i = 0; i < AF_TIERS.length; i++) if (count >= AF_TIERS[i].min) return AF_TIERS[i];
  return AF_TIERS[AF_TIERS.length - 1];
}

function afLocalKey(week, cls){ return 'cbse_fr_master_scores_' + week + '_' + cls; }
function afLocalGet(week, cls){
  try {
    const v = JSON.parse(localStorage.getItem(afLocalKey(week, cls)) || 'null');
    if (v && v.counts) return { counts: v.counts, names: v.names || {}, wrong: v.wrong || {} };
  } catch (_){}
  return { counts: {}, names: {}, wrong: {} };
}
function afLocalSet(week, cls, data){
  try { localStorage.setItem(afLocalKey(week, cls), JSON.stringify(data)); } catch (_){}
}

async function afLoadScores(week, cls){
  const local = afLocalGet(week, cls);
  if (!db) return local;
  try {
    const bail = new Promise((_, rej) => setTimeout(() => rej(new Error('slow network')), 4000));
    const snap = await Promise.race([getDoc(doc(db, 'scores', week + '__' + cls)), bail]);
    if (!snap.exists()) return local;
    const d = snap.data();
    return { counts: d.counts || {}, names: d.names || {}, wrong: d.wrong || {} };
  } catch (e){ console.warn('[Scores] cloud read failed, using this device:', e.message); return local; }
}

/* Records the verdict and returns this student new weekly CORRECT count.
   Wrong answers are counted too: Feature 6 needs that history, and throwing it
   away now would mean starting the log from empty later. */
async function afRecord(week, cls, student, isCorrect){
  const slug = afSlug(student);
  const data = await afLoadScores(week, cls);
  const nextCorrect = (Number(data.counts[slug]) || 0) + (isCorrect ? 1 : 0);
  const nextWrong   = (Number(data.wrong[slug])  || 0) + (isCorrect ? 0 : 1);
  data.counts[slug] = nextCorrect;
  data.wrong[slug]  = nextWrong;
  data.names[slug]  = student;
  afLocalSet(week, cls, data);
  if (db){
    const patch = { week: week, cls: cls, updatedAt: serverTimestamp() };
    patch.names  = {}; patch.names[slug] = student;
    if (isCorrect){ patch.counts = {}; patch.counts[slug] = increment(1); }
    else          { patch.wrong  = {}; patch.wrong[slug]  = increment(1); }
    setDoc(doc(db, 'scores', week + '__' + cls), patch, { merge: true })
      .catch(e => console.warn('[Scores] cloud write failed, kept on this device:', e.message));
  }
  return nextCorrect;
}

/* ---- the affirmation pop ---- */
let afTimer = null;
function afShow(student, count){
  const pop = $('#afPop'); if (!pop) return;
  const t = afTierFor(count);
  const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  set('#afEmoji', t.emoji); set('#afWord', t.word); set('#afWho', student);
  set('#afSub', t.sub + ' — ' + count + (count === 1 ? ' bonne réponse' : ' bonnes réponses') + ' cette semaine');
  pop.className = 'af-pop t' + t.tier;
  pop.hidden = false;
  /* the deck own effects, handed over by make-firebase-clone.js */
  const fx = window.__fx || {};
  try { if (t.tier === 3 && fx.confetti) fx.confetti(); } catch (_){}
  try { if (fx.sound) fx.sound('correct'); } catch (_){}
  try { afEnrich(student, count, t); } catch (e){}
  clearTimeout(afTimer);
  afTimer = setTimeout(() => { pop.hidden = true; }, t.tier === 3 ? 2800 : 2000);
}

/* ---- the leaderboard ---- */
let lbCls = '10E', lbPinned = false, lbAutoTimer = null, lbLastTop = '';
function lbTop3(data){
  const counts = data.counts || {}, names = data.names || {};
  return Object.keys(counts)
    .map(k => ({ name: names[k] || k, n: Number(counts[k]) || 0 }))
    .filter(r => r.n > 3)          // "more than 3", exactly as specified
    .sort((a, b) => (b.n - a.n) || a.name.localeCompare(b.name))
    .slice(0, 3);
}
async function lbRender(auto){
  const week = psWeekKey(new Date());
  const wk = $('#lbWeek'); if (wk) wk.textContent = week;
  const data = await afLoadScores(week, lbCls);
  const top = lbTop3(data);
  const list = $('#lbList'), empty = $('#lbEmpty'), tabN = $('#lbTabN');
  if (tabN) tabN.textContent = String(top.length);
  if (empty) empty.hidden = top.length > 0;
  if (list){
    list.innerHTML = '';
    const medals = ['🥇', '🥈', '🥉'];
    top.forEach((r, i) => {
      const li = document.createElement('li');
      li.className = 'lb-row' + (i === 0 ? ' r1' : '');
      const m = document.createElement('span'); m.className = 'lb-medal'; m.textContent = medals[i] || '';
      const nm = document.createElement('span'); nm.className = 'lb-name'; nm.textContent = r.name;
      const sc = document.createElement('span'); sc.className = 'lb-score'; sc.textContent = String(r.n);
      li.appendChild(m); li.appendChild(nm); li.appendChild(sc);
      list.appendChild(li);
    });
  }
  /* Auto-reveal only when the standings actually changed, so it never nags. */
  const sig = top.map(r => r.name + ':' + r.n).join('|');
  if (auto && sig !== lbLastTop && top.length){
    lbOpen(true);
    clearTimeout(lbAutoTimer);
    lbAutoTimer = setTimeout(() => { if (!lbPinned) lbOpen(false); }, 4000);
  }
  lbLastTop = sig;
}
function lbOpen(on){
  const p = $('#lbPanel'); if (p) p.hidden = !on;
}
function lbSetClass(cls, render){
  lbCls = cls;
  const a = $('#lbCls10E'), b = $('#lbCls10J');
  if (a) a.className = 'lb-cls' + (cls === '10E' ? ' is-on' : '');
  if (b) b.className = 'lb-cls' + (cls === '10J' ? ' is-on' : '');
  /* render:false lets psVerdict switch class WITHOUT recording the new standings,
     which would otherwise mask the very change it is about to auto-reveal. */
  if (render !== false) lbRender(false);
}

(function wireBoard(){
  const on = (id, fn) => { const el = $('#' + id); if (el) el.addEventListener('click', fn); };
  on('lbTab', () => { const p = $('#lbPanel'); const willOpen = p.hidden; lbPinned = willOpen; lbOpen(willOpen); if (willOpen) lbRender(false); });
  on('lbClose', () => { lbPinned = false; lbOpen(false); });
  on('lbCls10E', () => lbSetClass('10E'));
  on('lbCls10J', () => lbSetClass('10J'));
  setTimeout(() => lbRender(false), 1200);   // first paint of the counter
})();

/* ================= TEACHER AI ASSISTANT (BYOK Gemini) =================
   THE GOVERNING RULE: with AI Mode off the app behaves exactly as it did before
   this feature existed, for teachers as well as students. The click listener is
   ADDED in aiSet(true) and REMOVED in aiSet(false) -- never registered and then
   early-returning, which would still sit in every click event path. The single
   style that reaches slide content lives under body.ai-mode. No engine function
   is patched. AI Mode always starts OFF on load; nothing restores it.
   ===================================================================== */

const AI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/';
const AI_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.5-flash'];

/* The engine's ls helper is inside its IIFE and invisible to this module (the
   picker and score sheet use localStorage directly for the same reason). Same
   cbse_fr_master_ prefix, so these keys sit alongside the deck own settings, and
   the same swallow-everything contract so a locked-down browser cannot throw. */
const AI_STORE = 'cbse_fr_master_';
const aiLS = {
  get(k, d){ try { const v = localStorage.getItem(AI_STORE + k); return v === null ? d : v; } catch (e){ return d; } },
  set(k, v){ try { localStorage.setItem(AI_STORE + k, v); } catch (e){} },
  del(k){ try { localStorage.removeItem(AI_STORE + k); } catch (e){} },
  getJSON(k, d){ try { const v = localStorage.getItem(AI_STORE + k); return v === null ? d : JSON.parse(v); } catch (e){ return d; } },
  setJSON(k, v){ try { localStorage.setItem(AI_STORE + k, JSON.stringify(v)); } catch (e){} }
};

/* Anything the lesson already owns. The deck holds 1,567 flip-cards, 424 fill-ins
   and 147 quizzes -- hijacking a click on those would break the lesson. */
const AI_SKIP = '.flip-card, .option-btn, .fib-input, .accent-key, .drill, .voc-mask,' +
  '.voc-speak, .voc-tools, .audio-btn, .trier-chip, .trier-bucket, .hs-dot, .hs-all,' +
  '.pm-word, .pm-photo, .quiz-container button, .topbar, .hud,' +
    /* NOT .editable-field: 1,652 of the deck's paragraphs carry that class, so
       skipping it blanket-excluded almost all slide text -- the very thing the
       assistant reads. setLiveEdit() sets contenteditable=true on exactly those
       elements while editing is on, and the guard below catches that case. */
  '.sidebar, button, a, input, select, textarea, [contenteditable="true"]';

let aiMode = false;
let aiKeyHandler = null;

const aiKey   = () => aiLS.get('ai_key', '');
const aiModel = () => {
  const v = aiLS.get('ai_model', '');
  if (!v) return AI_MODELS[0];
  /* gemini-1.x and 2.x are retired or gated: they 404 on every call */
  if (v.indexOf('gemini-1.') === 0 || v.indexOf('gemini-2.') === 0) return AI_MODELS[0];
  return v;
};

/* Whitespace without backslashes: tab, newline, carriage return, space. */
const AI_WS = new RegExp('[' + String.fromCharCode(9,10,13,32) + ']+', 'g');
const aiFlat = t => String(t == null ? '' : t).replace(AI_WS, ' ').trim();

const AI_SYS = 'You are helping a CBSE Class 10 French teacher in India. Answer in simple English that a 15-year-old can follow. Keep French words, examples and quotations in French. Be brief and concrete. No preamble, no markdown headings, no bullet characters. ';

const AI_PROMPTS = [
  { id:'simplify', label:'Simplify this rule', build: c =>
    'Rewrite this grammar explanation so a 15-year-old can understand it. At most 3 short lines. Keep the French examples in French. Explanation: ' + c.text },
  { id:'word', label:'Explain this word', needsWord:true, build: c =>
    'Explain the French word or phrase "' + c.word + '" as it is used on a slide about ' + c.topic + '. Give the word with its gender article if it is a noun, a simple English meaning, and one short French example with its English translation. At most 3 lines.' },
  { id:'examples', label:'3 more examples', build: c =>
    'Give exactly 3 new French example sentences for this rule, at CBSE Class 10 level, about school, family or food. Each with a short English translation. Rule: ' + c.text },
  { id:'wrong', label:'Why is this wrong?', build: c =>
    'A student got this wrong. In one sentence give the correct answer and why, then one short encouraging sentence saying this mistake is common and how to remember it. Material: ' + c.answers + ' Slide: ' + c.text },
  { id:'coldcall', label:'Cold-call questions', build: c =>
    'Write 3 quick oral questions on this rule, numbered and tiered: (1) a true/false or either-or warm-up, (2) a fill-in-the-blank conjugation, (3) an open sentence for the student to build. Rule: ' + c.text },
  { id:'dialogue', label:'Micro-dialogue', build: c =>
    'Write a 2-line French mini-dialogue, marked A: and B:, that two students can read aloud in about 10 seconds using the vocabulary on this slide. Add a one-line English gloss. Slide: ' + c.text },
  { id:'exit', label:'Exit ticket', build: c =>
    'Write one multiple-choice exit-ticket question with 3 options labelled a, b, c that checks whether the class understood this slide, and state which option is correct. Slide: ' + c.text },
  { id:'traps', label:'Trap detector', build: c =>
    'List the top 2 mistakes English-speaking learners make with this rule. One line each, each with a correct French example. Rule: ' + c.text }
];

/* ---- the call ---- */
async function aiAsk(promptText, timeoutMs){
  const key = aiKey();
  if (!key) throw new Error('No API key saved. Open Admin and add one.');
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs || 20000);
  try {
    const res = await fetch(AI_ENDPOINT + aiModel() + ':generateContent?key=' + encodeURIComponent(key), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: AI_SYS + promptText }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 400 }
      })
    });
    if (!res.ok){
      const body = await res.text().catch(() => '');
      if (res.status === 404)
        throw new Error('The model "' + aiModel() + '" is not available to this key. ' +
          'Open Admin then AI and press Detect models.');
      if (res.status === 400)
        throw new Error('The API key was rejected. Check it in Admin then AI. ' + aiFlat(body).slice(0, 90));
      throw new Error('HTTP ' + res.status + ' ' + aiFlat(body).slice(0, 140));
    }
    const j = await res.json();
    const parts = (((j.candidates || [])[0] || {}).content || {}).parts || [];
    const out = parts.map(p => p.text || '').join(' ').trim();
    if (!out) throw new Error('The model returned nothing. Try a different prompt.');
    return out;
  } finally { clearTimeout(t); }
}

/* Which models can THIS key use? Hardcoding ids has now broken twice (1.5-flash
   was retired, the 2.5 family is gated for newer keys), so the Admin tab can read
   the real list from the API instead of trusting a constant. */
async function aiListModels(){
  const key = aiKey();
  if (!key) throw new Error('Save a key first.');
  const res = await fetch(AI_ENDPOINT.replace('/models/', '/models') +
    '?pageSize=200&key=' + encodeURIComponent(key));
  if (!res.ok){
    const b = await res.text().catch(() => '');
    throw new Error('HTTP ' + res.status + ' ' + aiFlat(b).slice(0, 120));
  }
  const j = await res.json();
  return (j.models || [])
    .filter(m => (m.supportedGenerationMethods || []).indexOf('generateContent') > -1)
    .map(m => String(m.name || '').split('/').pop())
    .filter(x => x.indexOf('gemini') === 0 && x.indexOf('vision') === -1)
    .sort();
}

/* ---- cache: a repeat click is instant, free, and works with no network ---- */
function aiCacheGet(k){ try { return (aiLS.getJSON('ai_cache', {}) || {})[k]; } catch (e){ return null; } }
function aiCacheSet(k, v){
  try {
    const c = aiLS.getJSON('ai_cache', {}) || {};
    const keys = Object.keys(c);
    if (keys.length > 200) delete c[keys[0]];
    c[k] = v;
    aiLS.setJSON('ai_cache', c);
  } catch (e){}
}

/* ---- what is on screen ---- */
function aiContext(word){
  let sec = null;
  try { sec = (typeof Deck !== 'undefined' && Deck.getCurrentSlide) ? Deck.getCurrentSlide() : null; } catch (e){}
  if (!sec) sec = document.querySelector('section.present');
  const card = sec ? sec.querySelector('.slide-card') : null;
  const stack = sec ? sec.closest('section[data-topic]') : null;
  const answers = sec
    ? [...sec.querySelectorAll('[data-answer]')].slice(0, 8).map(e => aiFlat(e.getAttribute('data-answer'))).join(' | ')
    : '';
  return {
    word: word || '',
    topic: stack ? aiFlat(stack.getAttribute('data-topic-name') || stack.getAttribute('data-topic')) : 'French',
    step: sec ? aiFlat(sec.getAttribute('data-step')) : '',
    text: aiFlat(card ? card.innerText : (sec ? sec.innerText : '')).slice(0, 1500),
    answers: answers || '(none on this slide)',
    slideId: sec ? (sec.getAttribute('data-slide-id') || '') : ''
  };
}

/* ---- the word under the pointer, read without touching the DOM ---- */
const AI_WORD = /[A-Za-z0-9À-ſ'’-]/;
function aiWordAt(ev){
  let range = null;
  if (document.caretRangeFromPoint) range = document.caretRangeFromPoint(ev.clientX, ev.clientY);
  else if (document.caretPositionFromPoint){
    const p = document.caretPositionFromPoint(ev.clientX, ev.clientY);
    if (p){ range = document.createRange(); range.setStart(p.offsetNode, p.offset); }
  }
  if (!range) return null;
  const node = range.startContainer;
  if (!node || node.nodeType !== 3) return null;
  const text = node.nodeValue || '';
  let i = range.startOffset;
  if (!AI_WORD.test(text.charAt(i)) && !AI_WORD.test(text.charAt(i - 1))) return null;
  let a = i, b = i;
  while (a > 0 && AI_WORD.test(text.charAt(a - 1))) a--;
  while (b < text.length && AI_WORD.test(text.charAt(b))) b++;
  const w = text.slice(a, b);
  return w.length > 1 ? w : null;
}

/* ---- the tooltip ---- */
function aiClose(){
  const tip = $('#aiTip'); if (tip) tip.hidden = true;
  if (aiKeyHandler){ document.removeEventListener('keydown', aiKeyHandler, true); aiKeyHandler = null; }
}
function aiPlace(tip, x, y){
  tip.hidden = false;
  const r = tip.getBoundingClientRect();
  let left = x + 14, top = y + 16;
  if (left + r.width > innerWidth - 12) left = Math.max(12, x - r.width - 14);
  if (top + r.height > innerHeight - 12) top = Math.max(12, y - r.height - 16);
  tip.style.left = left + 'px';
  tip.style.top = top + 'px';
}
async function aiRun(promptId, ctx){
  const body = $('#aiTipBody'); if (!body) return;
  const p = AI_PROMPTS.filter(x => x.id === promptId)[0];
  if (!p) return;
  const ck = ctx.slideId + '|' + promptId + '|' + (p.needsWord ? ctx.word : '');
  const hit = aiCacheGet(ck);
  if (hit){
    body.textContent = hit;
    const tag = $('#aiTipMenu .ai-cached'); if (tag) tag.textContent = 'cached';
    return;
  }
  body.innerHTML = '';
  body.appendChild(Object.assign(document.createElement('em'), { textContent: 'Thinking...' }));
  $$('#aiTipMenu .ai-p').forEach(b => { b.disabled = true; });
  try {
    const out = await aiAsk(p.build(ctx));
    aiCacheSet(ck, out);
    body.textContent = out;
  } catch (e){
    body.innerHTML = '';
    const err = document.createElement('span');
    err.className = 'ai-err';
    err.textContent = e.message;
    body.appendChild(err);
  } finally {
    $$('#aiTipMenu .ai-p').forEach(b => { b.disabled = false; });
  }
}
function aiOpen(x, y, word){
  const tip = $('#aiTip'); if (!tip) return;
  const ctx = aiContext(word);
  const w = $('#aiTipWord'); if (w) w.textContent = word || ctx.step || 'This slide';
  const menu = $('#aiTipMenu');
  if (menu){
    menu.innerHTML = '';
    AI_PROMPTS.forEach(p => {
      if (p.needsWord && !word) return;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'ai-p'; b.textContent = p.label;
      b.addEventListener('click', () => aiRun(p.id, ctx));
      menu.appendChild(b);
    });
    const tag = document.createElement('span'); tag.className = 'ai-cached'; menu.appendChild(tag);
  }
  aiPlace(tip, x, y);
  aiRun(word ? 'word' : 'simplify', ctx);
  /* bound on open, unbound on close: nothing lingers in the key path */
  aiKeyHandler = ev => {
    if (ev.key === 'Escape'){ ev.preventDefault(); ev.stopImmediatePropagation(); aiClose(); }
  };
  document.addEventListener('keydown', aiKeyHandler, true);
}

/* ---- the click listener: exists ONLY while AI Mode is on ---- */
function onAiClick(ev){
  const t = ev.target;
  if (!t || !t.closest) return;
  if (t.closest('#aiTip') || t.closest('#aiBtn')) return;
  if (t.closest(AI_SKIP)) return;                  // the lesson owns this click
  if (!t.closest('.slide-card')) return;           // only slide content
  const word = aiWordAt(ev);
  aiOpen(ev.clientX, ev.clientY, word);
}

function aiSet(on){
  const want = !!on && !!aiKey();
  if (want === aiMode) return;
  aiMode = want;
  document.body.classList.toggle('ai-mode', aiMode);
  const b = $('#aiBtn'); if (b) b.setAttribute('aria-pressed', aiMode ? 'true' : 'false');
  if (aiMode) document.addEventListener('click', onAiClick);
  else {
    document.removeEventListener('click', onAiClick);
    aiClose();
  }
}

/* Praise must never misgender a student: the roster carries no gender field, so
   any adjective or noun that inflects is rejected and the static tier stands. */
const AI_GENDERED = ['champion','championne','meilleur','meilleure','fier','fiere','fière','doue','douee','doué','douée','fort','forte','intelligent','intelligente','heureux','heureuse','beau','belle','premier','premiere','première','pret','prete','prêt','prête','seul','seule'];
function aiGenderSafe(txt){
  const low = ' ' + String(txt).toLowerCase().replace(new RegExp('[^a-zà-ÿ]+', 'g'), ' ') + ' ';
  return !AI_GENDERED.some(w => low.indexOf(' ' + w + ' ') !== -1);
}

/* Feature 4 praise, enriched. The static tier is ALREADY on screen when this runs;
   it is only ever REPLACED, and only by a line that arrives in time and passes the
   gender check. Off, keyless or offline, this is a no-op and the class sees today’s
   behaviour exactly. */
function afEnrich(student, count, tier){
  if (!aiMode || !aiKey()) return;
  const ck = 'af|' + tier.tier + '|' + count;
  const apply = txt => {
    if (!txt) return;
    const line = aiFlat(txt).slice(0, 44);
    if (!aiGenderSafe(line)) return;
    const pop = $('#afPop'), w = $('#afWord');
    if (!pop || pop.hidden || !w) return;          // already dismissed: leave it alone
    w.textContent = line;
  };
  const hit = aiCacheGet(ck);
  if (hit) return apply(hit);
  const p = 'Give ONE short French exclamation praising a student who has just answered correctly for the ' + count + ' time this week. Two to four words, ending in an exclamation mark. It MUST be gender-neutral: never use a word that changes between masculine and feminine (so never champion, meilleur, fier, fort, doue). Output only the exclamation.';
  Promise.race([
    aiAsk(p, 4000),
    new Promise(r => setTimeout(() => r(null), 1500))   // the class never waits
  ]).then(t => { if (t && aiGenderSafe(aiFlat(t))){ aiCacheSet(ck, t); apply(t); } })
    .catch(() => {});
}

(function wireAI(){
  const b = $('#aiBtn');
  if (b) b.addEventListener('click', () => aiSet(!aiMode));
  const x = $('#aiTipClose');
  if (x) x.addEventListener('click', aiClose);
})();

/* ---------------- Feature 6: the admin dashboard ----------------
   Every value that came from a user is written with textContent. Feedback is
   typed by students, so building these rows with innerHTML would let a student
   inject markup straight into the teacher own dashboard. */

function adEl(tag, cls, text){
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined && text !== null) e.textContent = String(text);
  return e;
}
function adSay(msg){
  const b = $('#adBody'); if (!b) return;
  b.innerHTML = '';
  b.appendChild(adEl('p', 'ad-msg', msg));
}

/* --- tab 1: approvals --- */
async function adApprovals(){
  adSay('Loading the waiting list...');
  const body = $('#adBody');
  if (!db){ adSay('No connection to the server.'); return; }
  try {
    const snap = await getDocs(query(collection(db, 'users'), where('status', '==', 'pending')));
    adSetPending(snap.size);
    body.innerHTML = '';
    if (!snap.size){ body.appendChild(adEl('p', 'ad-msg', 'Nobody is waiting for approval.')); return; }
    const list = adEl('div', 'ad-list');
    snap.forEach(d => {
      const u = d.data() || {};
      const row = adEl('div', 'ad-row');
      const info = adEl('div', 'ad-info');
      info.appendChild(adEl('div', 'ad-name', u.name || '(no name given)'));
      info.appendChild(adEl('div', 'ad-sub', u.email || u.phone || d.id));
      row.appendChild(info);
      const btn = adEl('button', 'ad-approve', 'Approve');
      btn.type = 'button';
      btn.onclick = async () => {
        btn.disabled = true; btn.textContent = 'Approving...';
        try {
          await setDoc(doc(db, 'users', d.id),
            { status: 'approved', approvedAt: serverTimestamp() }, { merge: true });
          row.classList.add('is-done');
          btn.textContent = 'Approved';
          adSetPending(Math.max(0, Number(($('#adPendN') || {}).textContent || 1) - 1));
        } catch (e){
          btn.disabled = false; btn.textContent = 'Retry';
          console.warn('[Admin] approve failed:', e.message);
        }
      };
      row.appendChild(btn);
      list.appendChild(row);
    });
    body.appendChild(list);
  } catch (e){ adSay('Could not read the waiting list: ' + e.message); }
}
function adSetPending(v){
  const b = $('#adPendN'); if (!b) return;
  b.textContent = String(v);
  b.className = 'ad-badge' + (Number(v) ? '' : ' zero');
}

/* --- tab 2: scores and activity --- */
function adScoreTable(rows){
  const tbl = adEl('table', 'ad-tbl');
  const thead = document.createElement('thead');
  const htr = document.createElement('tr');
  ['Student', 'Correct', 'Wrong', 'Total'].forEach(h => htr.appendChild(adEl('th', null, h)));
  thead.appendChild(htr); tbl.appendChild(thead);
  const tb = document.createElement('tbody');
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.appendChild(adEl('td', 'ad-tname', r.name));
    tr.appendChild(adEl('td', 'ad-ok', r.ok));
    tr.appendChild(adEl('td', 'ad-no', r.no));
    tr.appendChild(adEl('td', null, r.ok + r.no));
    tb.appendChild(tr);
  });
  tbl.appendChild(tb);
  return tbl;
}
async function adScores(){
  adSay('Loading this week...');
  const body = $('#adBody');
  const week = psWeekKey(new Date());
  try {
    const out = adEl('div');
    out.appendChild(adEl('h4', 'ad-h4', 'Week ' + week));
    const classes = ['10E', '10J'];
    for (let i = 0; i < classes.length; i++){
      const cls = classes[i];
      const data = await afLoadScores(week, cls);
      const names = data.names || {}, counts = data.counts || {}, wrong = data.wrong || {};
      const rows = Object.keys(names).map(k => ({
        name: names[k] || k,
        ok: Number(counts[k]) || 0,
        no: Number(wrong[k]) || 0
      })).filter(r => r.ok || r.no)
        .sort((a, b) => (b.ok - a.ok) || a.name.localeCompare(b.name));
      out.appendChild(adEl('h5', 'ad-h5', 'Classe ' + cls + '  -  ' + rows.length + ' with activity'));
      if (!rows.length) out.appendChild(adEl('p', 'ad-msg', 'No answers recorded yet this week.'));
      else out.appendChild(adScoreTable(rows));
    }
    /* the quiz auto-capture log, if any has been written */
    try {
      const rec = await getDocs(query(collection(db, 'records'), orderBy('at', 'desc'), limit(25)));
      if (rec.size){
        out.appendChild(adEl('h5', 'ad-h5', 'Recent quiz results'));
        const tbl = adEl('table', 'ad-tbl');
        const htr = document.createElement('tr');
        ['Date', 'Student', 'Quiz', 'Score'].forEach(h => htr.appendChild(adEl('th', null, h)));
        tbl.appendChild(htr);
        rec.forEach(d => {
          const r = d.data() || {};
          const tr = document.createElement('tr');
          tr.appendChild(adEl('td', null, r.date || ''));
          tr.appendChild(adEl('td', 'ad-tname', r.studentId || r.byUid || ''));
          tr.appendChild(adEl('td', null, r.title || ''));
          tr.appendChild(adEl('td', null, (r.score === undefined ? '' : r.score + ' / ' + r.outOf)));
          tbl.appendChild(tr);
        });
        out.appendChild(tbl);
      }
    } catch (e){ console.warn('[Admin] quiz log unavailable:', e.message); }
    body.innerHTML = '';
    body.appendChild(out);
  } catch (e){ adSay('Could not read the scores: ' + e.message); }
}

/* --- tab 3: feedback --- */
async function adFeedback(){
  adSay('Loading feedback...');
  const body = $('#adBody');
  if (!db){ adSay('No connection to the server.'); return; }
  try {
    const snap = await getDocs(query(collection(db, 'feedback'), orderBy('createdAt', 'desc'), limit(50)));
    body.innerHTML = '';
    if (!snap.size){ body.appendChild(adEl('p', 'ad-msg', 'No feedback has been submitted yet.')); return; }
    const list = adEl('div', 'ad-list');
    snap.forEach(d => {
      const f = d.data() || {};
      const card = adEl('div', 'ad-fb');
      card.appendChild(adEl('p', 'ad-fbtext', f.text || ''));
      let when = '';
      try { if (f.createdAt && f.createdAt.toDate) when = f.createdAt.toDate().toLocaleString(); } catch (_){}
      card.appendChild(adEl('p', 'ad-sub', (f.name || 'Anonymous') + (when ? '  -  ' + when : '')));
      list.appendChild(card);
    });
    body.appendChild(list);
  } catch (e){ adSay('Could not read the feedback: ' + e.message); }
}

/* --- tab 4: the AI key ---
   The key stays on this machine. It is never sent to Firestore, never logged, and
   only its last 4 characters are ever displayed back. "Reset everything" does NOT
   clear it -- that list lives in the engine and this feature patches no engine code
   -- so Forget key is the way to remove it. */
function adAI(){
  const body = $('#adBody'); if (!body) return;
  body.innerHTML = '';

  const saved = aiKey();
  body.appendChild(adEl('h4', 'ad-h4', 'Gemini API key (this device only)'));

  const row = adEl('div', 'ai-row');
  const inp = document.createElement('input');
  inp.className = 'fb-input'; inp.type = 'password'; inp.id = 'aiKeyInput';
  inp.autocomplete = 'off'; inp.spellcheck = false;
  inp.placeholder = saved ? ('saved, ending ' + saved.slice(-4)) : 'Paste your key';
  row.appendChild(inp);
  const save = adEl('button', 'ad-approve', 'Save'); save.type = 'button';
  const test = adEl('button', 'fb-btn', 'Test'); test.type = 'button';
  const detect = adEl('button', 'fb-btn', 'Detect models'); detect.type = 'button';
  const forget = adEl('button', 'fb-btn', 'Forget key'); forget.type = 'button';
  row.appendChild(save); row.appendChild(test); row.appendChild(detect); row.appendChild(forget);
  body.appendChild(row);

  const msg = adEl('p', 'ai-hint', saved ? 'A key is saved on this device.' : 'No key saved yet.');
  body.appendChild(msg);

  body.appendChild(adEl('h4', 'ad-h4', 'Model'));
  const sel = document.createElement('select');
  sel.className = 'fb-input'; sel.id = 'aiModelSel';
  AI_MODELS.forEach(m => {
    const o = document.createElement('option');
    o.value = m; o.textContent = m + (m.indexOf('lite') > -1 ? '  (fastest, cheapest)' : '  (stronger reasoning)');
    /* a model saved earlier but no longer offered would otherwise vanish silently */
    if (m === aiModel()) o.selected = true;
    sel.appendChild(o);
  });
  body.appendChild(sel);
  sel.addEventListener('change', () => { aiLS.set('ai_model', sel.value); msg.textContent = 'Model set to ' + sel.value + '.'; });

  body.appendChild(adEl('p', 'ai-hint',
    'The key is billable and is stored in this browser only. Anyone who can open developer tools on this machine can read it, so do not save it on a shared student computer. AI Mode always starts OFF when the page loads.'));

  detect.onclick = async () => {
    detect.disabled = true;
    msg.textContent = 'Asking Google which models this key can use...';
    try {
      const pending = String(inp.value || "").trim();
      if (pending) aiLS.set('ai_key', pending);
      const list = await aiListModels();
      if (!list.length){ msg.textContent = 'That key returned no usable models.'; return; }
      const keep = aiModel();
      sel.innerHTML = '';
      list.forEach(m => {
        const o = document.createElement('option');
        o.value = m; o.textContent = m;
        if (m === keep) o.selected = true;
        sel.appendChild(o);
      });
      if (list.indexOf(keep) === -1){
        sel.value = list[0];
        aiLS.set('ai_model', list[0]);
      }
      msg.textContent = list.length + ' model(s) available. Using ' + sel.value + '.';
    } catch (e){ msg.textContent = 'Could not list models: ' + e.message; }
    finally { detect.disabled = false; }
  };

  save.onclick = () => {
    const v = String(inp.value || "").trim();
    if (!v){ msg.textContent = "Paste a key first."; return; }
    aiLS.set('ai_key', v);
    inp.value = "";
    inp.placeholder = 'saved, ending ' + v.slice(-4);
    msg.textContent = 'Saved. The AI Mode button is now available on the slides.';
    const aib = $('#aiBtn');
    if (aib) aib.hidden = !(ME && ME.role === 'teacher');
  };

  forget.onclick = () => {
    aiLS.del('ai_key');
    aiSet(false);
    inp.value = ""; inp.placeholder = "Paste your key";
    msg.textContent = 'Key removed from this device.';
    const aib = $('#aiBtn'); if (aib) aib.hidden = true;
  };

  test.onclick = async () => {
    test.disabled = true;
    msg.textContent = 'Testing ' + aiModel() + '...';
    try {
      const pending = String(inp.value || "").trim();
      if (pending) aiLS.set('ai_key', pending);
      const out = await aiAsk('Reply with the single word: ok', 15000);
      msg.textContent = 'Working. The model replied: ' + aiFlat(out).slice(0, 60);
    } catch (e){ msg.textContent = 'Failed: ' + e.message; }
    finally { test.disabled = false; }
  };
}

/* --- open / close / tabs --- */
let adTab = 'approve';
function adRender(){
  if (adTab === 'approve') return adApprovals();
  if (adTab === 'scores')  return adScores();
  if (adTab === 'ai')      return adAI();
  return adFeedback();
}
function adSetTab(t){
  adTab = t;
  [['adTab1','approve'],['adTab2','scores'],['adTab3','feedback'],['adTab4','ai']].forEach(pair => {
    const el = $('#' + pair[0]);
    if (el) el.className = 'ad-tab' + (pair[1] === t ? ' is-on' : '');
  });
  adRender();
}
function adOpen(on){
  const d = $('#adDash'); if (!d) return;
  /* Client-side only: the real barrier is the Firestore rules, which refuse
     every one of these reads to anyone but the admin account. */
  if (on && !(ME && ME.role === 'teacher')) return;
  d.hidden = !on;
  if (on){
    const who = $('#adWho'); if (who) who.textContent = (ME && (ME.email || ME.label)) || '';
    adSetTab('approve');
  }
}

(function wireAdmin(){
  const on = (id, fn) => { const el = $('#' + id); if (el) el.addEventListener('click', fn); };
  on('adBtn',   () => adOpen(true));
  on('adClose', () => adOpen(false));
  on('adTab1',  () => adSetTab('approve'));
  on('adTab2',  () => adSetTab('scores'));
  on('adTab3',  () => adSetTab('feedback'));
  on('adTab4',  () => adSetTab('ai'));
  const d = $('#adDash');
  if (d) d.addEventListener('click', ev => { if (ev.target === d) adOpen(false); });
  /* Escape must close the dashboard, not reach Reveal and open the overview. */
  document.addEventListener('keydown', ev => {
    const dd = $('#adDash');
    if (!dd || dd.hidden) return;
    if (ev.key === 'Escape'){ ev.preventDefault(); ev.stopImmediatePropagation(); adOpen(false); }
  }, true);
})();

/* ---------------- quiz auto-capture ----------------
   Observes .score-display instead of touching initQuizContainer. Each change is
   debounced and upserted under a deterministic id, so the LAST value (the finished
   score) is what persists and repeated attempts overwrite rather than pile up. */
const pending = new Map();
function watchQuizzes(){
  $$('.quiz-container').forEach(box => {
    const disp = $('.score-display', box);
    if (!disp) return;
    const slide = box.closest('section[data-slide-id]');
    const quizId = slide ? slide.dataset.slideId : 'unknown';
    new MutationObserver(() => {
      if (!ME || ME.role !== 'student' || !ME.studentId) return;   // signed out => nothing happens
      const m = /(\\d+)\\s*\\/\\s*(\\d+)/.exec(disp.textContent || '');
      if (!m) return;
      clearTimeout(pending.get(quizId));
      pending.set(quizId, setTimeout(() => saveQuiz(quizId, +m[1], +m[2]), 1500));
    }).observe(disp, { childList: true, characterData: true, subtree: true });
  });
}
async function saveQuiz(quizId, score, outOf){
  try {
    await setDoc(doc(db, 'records', ME.uid + '__' + quizId), {
      studentId: ME.studentId, type: 'quiz', title: quizId,
      score, outOf, date: new Date().toISOString().slice(0, 10),
      byUid: ME.uid, at: serverTimestamp()
    }, { merge: true });
  } catch (e){ console.warn('quiz save failed', e.message); }
}

/* ---------------- dashboard ---------------- */
if ($('#fbDashBtn')) $('#fbDashBtn').onclick = () => { $('#fbDash').hidden = false; renderDash(); };
if ($('#fbDashClose')) $('#fbDashClose').onclick = () => { $('#fbDash').hidden = true; };
$('#fbDash') && $('#fbDash').addEventListener('click', e => { if (e.target.id === 'fbDash') $('#fbDash').hidden = true; });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#fbDash') && !$('#fbDash').hidden) $('#fbDash').hidden = true; });

const esc = v => String(v == null ? '' : v).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pct = (s, o) => o ? Math.round(s / o * 100) : 0;
const pill = p => '<span class="fb-pill ' + (p >= 70 ? 'good' : p >= 40 ? 'mid' : 'low') + '">' + p + '%</span>';

async function renderDash(){
  const body = $('#fbDashBody');
  if (!ME){ body.innerHTML = '<p class="fb-msg">Sign in first.</p>'; return; }
  body.innerHTML = '<p class="fb-msg">Loading…</p>';
  try {
    if (ME.role === 'teacher') await renderTeacher(body);
    else await renderStudent(body, ME.studentId);
  } catch (e){
    body.innerHTML = '<p class="fb-msg err">Could not load: ' + esc(e.message) + '</p>';
  }
}

let dashClass = '10E';
async function renderTeacher(body){
  const studs = [];
  (await getDocs(query(collection(db, 'students'), where('classId', '==', dashClass)))).forEach(d => studs.push({ id: d.id, ...d.data() }));
  const recs = [];
  (await getDocs(query(collection(db, 'records'), where('classId', '==', dashClass)))).forEach(d => recs.push({ id: d.id, ...d.data() }));

  const by = {};
  recs.forEach(r => { (by[r.studentId] = by[r.studentId] || []).push(r); });

  let h = '<div class="fb-tabs">' +
    ['10E', '10J'].map(c => '<button class="fb-tab' + (c === dashClass ? ' on' : '') + '" data-class="' + c + '">Class ' + c + '</button>').join('') +
    '</div>';

  if (!studs.length){
    h += '<p class="fb-msg">No students in ' + dashClass + ' yet. Use <b>Seed roster</b> to create them from the class list already in the app.</p>' +
         '<button class="fb-btn fb-primary" id="fbSeed">Seed roster for ' + dashClass + '</button>';
  } else {
    h += '<table class="fb-table"><tr><th>Student</th><th>Quizzes</th><th>Average</th><th>Marks</th><th>Attendance</th></tr>';
    studs.sort((a, b) => (a.name || '').localeCompare(b.name || '')).forEach(s => {
      const rs = by[s.id] || [];
      const q = rs.filter(r => r.type === 'quiz');
      const mk = rs.filter(r => r.type === 'mark');
      const pa = rs.filter(r => r.type === 'participation');
      const present = pa.filter(r => r.note === 'present').length;
      const sc = q.reduce((n, r) => n + (r.score || 0), 0), ou = q.reduce((n, r) => n + (r.outOf || 0), 0);
      h += '<tr><td class="fb-name" data-student="' + esc(s.id) + '">' + esc(s.name) + '</td>' +
           '<td>' + q.length + '</td>' +
           '<td>' + (q.length ? pill(pct(sc, ou)) : '<span class="fb-sub">—</span>') + '</td>' +
           '<td>' + mk.length + '</td>' +
           '<td>' + (pa.length ? present + ' / ' + pa.length : '<span class="fb-sub">—</span>') + '</td></tr>';
    });
    h += '</table>';
  }
  body.innerHTML = h;

  $$('.fb-tab', body).forEach(b => b.onclick = () => { dashClass = b.dataset.class; renderDash(); });
  const seed = $('#fbSeed', body); if (seed) seed.onclick = seedRoster;
  $$('.fb-name', body).forEach(n => n.onclick = () => renderStudent(body, n.dataset.student));
}

async function renderStudent(body, studentId){
  if (!studentId){
    body.innerHTML = '<p class="fb-msg">Your account is not linked to a student yet. ' +
      'Ask your teacher to link it, then reopen this dashboard.</p>';
    return;
  }
  const sSnap = await getDoc(doc(db, 'students', studentId));
  const name = sSnap.exists() ? sSnap.data().name : studentId;
  const recs = [];
  (await getDocs(query(collection(db, 'records'), where('studentId', '==', studentId)))).forEach(d => recs.push({ id: d.id, ...d.data() }));

  const q = recs.filter(r => r.type === 'quiz');
  const sc = q.reduce((n, r) => n + (r.score || 0), 0), ou = q.reduce((n, r) => n + (r.outOf || 0), 0);

  let h = (ME.role === 'teacher' ? '<p class="fb-back" id="fbBack">← back to class</p>' : '') +
    '<h4 style="margin:.2em 0 .6em;color:var(--heading-color)">' + esc(name) + '</h4>' +
    '<p class="fb-sub">' + q.length + ' quizzes · overall ' + (q.length ? pct(sc, ou) + '%' : '—') + '</p>';

  if (ME.role === 'teacher'){
    h += '<div class="fb-form">' +
      '<input class="fb-input" id="fbMkTitle" placeholder="Assessment name">' +
      '<input class="fb-input" id="fbMkScore" type="number" placeholder="score" style="flex:0 0 90px">' +
      '<input class="fb-input" id="fbMkOut" type="number" placeholder="out of" style="flex:0 0 90px">' +
      '<button class="fb-btn fb-primary" id="fbAddMark">Add mark</button></div>' +
      '<div class="fb-form">' +
      '<input class="fb-input" id="fbPaDate" type="date">' +
      '<select class="fb-input" id="fbPaStatus" style="flex:0 0 150px"><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option></select>' +
      '<button class="fb-btn fb-primary" id="fbAddPart">Add attendance</button></div>';
  }

  h += '<table class="fb-table"><tr><th>Type</th><th>Title</th><th>Result</th><th>Date</th></tr>';
  recs.sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).forEach(r => {
    const res = r.type === 'participation' ? esc(r.note || '') :
      (r.outOf ? r.score + ' / ' + r.outOf + ' ' + pill(pct(r.score, r.outOf)) : '—');
    h += '<tr><td><span class="fb-pill">' + esc(r.type) + '</span></td><td>' + esc(r.title || '') + '</td><td>' + res + '</td><td class="fb-sub">' + esc(r.date || '') + '</td></tr>';
  });
  h += '</table>';
  if (!recs.length) h += '<p class="fb-msg">Nothing recorded yet.</p>';
  body.innerHTML = h;

  const back = $('#fbBack', body); if (back) back.onclick = renderDash;
  const am = $('#fbAddMark', body);
  if (am) am.onclick = async () => {
    const t = $('#fbMkTitle').value.trim(), s = +$('#fbMkScore').value, o = +$('#fbMkOut').value;
    if (!t || !o) return;
    await addDoc(collection(db, 'records'), {
      studentId, classId: sSnap.exists() ? sSnap.data().classId : null, type: 'mark',
      title: t, score: s, outOf: o, date: new Date().toISOString().slice(0, 10),
      byUid: ME.uid, at: serverTimestamp()
    });
    renderStudent(body, studentId);
  };
  const ap = $('#fbAddPart', body);
  if (ap) ap.onclick = async () => {
    await addDoc(collection(db, 'records'), {
      studentId, classId: sSnap.exists() ? sSnap.data().classId : null, type: 'participation',
      title: 'Online class', note: $('#fbPaStatus').value,
      date: $('#fbPaDate').value || new Date().toISOString().slice(0, 10),
      byUid: ME.uid, at: serverTimestamp()
    });
    renderStudent(body, studentId);
  };
}

/* Seeds the students collection from the roster already inside the app, so the
   teacher never types 76 names. Teacher-only, and safe to re-run. */
async function seedRoster(){
  const names = (window.__ROSTERS && window.__ROSTERS[dashClass]) || [];
  if (!names.length){ alert('Roster not found in the page.'); return; }
  for (const n of names){
    const id = dashClass + '__' + n.replace(/[^A-Za-z0-9]/g, '_');
    await setDoc(doc(db, 'students', id), { name: n, classId: dashClass }, { merge: true });
  }
  renderDash();
}

watchQuizzes();
</script>
`;

/* ------------------------------------------------------------------ *
 *  stripLayer — the EXACT inverse of the injection                    *
 * ------------------------------------------------------------------ *
 * Shared by make-firebase-clone.js (for idempotent rebuilds) and by
 * check-clone.js (to prove the presentation is byte-identical). It must
 * live in one place: the first attempt had the builder and the gate each
 * reconstruct the original by hand, and the gate's version collapsed
 * blank runs with /\n\n\n+/ -> '\n\n'. That is lossy, so a legitimate
 * clone was reported as having CHANGED the presentation.
 *
 * Three of the four injections are exact strings both files can compute,
 * so they are removed by exact match. The fourth embeds the Firebase
 * config, which the gate cannot know, so it is removed by marker range
 * -- including the single '\n' the injector adds after MARK_END.
 */
module.exports.MARKERS = {
  CSS_START: '/* ===== FIREBASE LAYER (clone only) ===== */',
  CSS_END:   '/* ===== END FIREBASE CSS ===== */',
  BODY:      '<!-- ===== FIREBASE LAYER (clone only) ===== -->',
  BODY_END:  '<!-- ===== END FIREBASE LAYER ===== -->',
  ROSTER:    '\nwindow.__ROSTERS = ROSTERS;',
  EFFECTS:   'window.__fx = { confetti: burstConfetti, sound: playSound };\n'
};

module.exports.stripLayer = function stripLayer(h){
  const M = module.exports.MARKERS;

  // 4. dashboard + module script: marker range, plus the trailing newline
  const a = h.indexOf(M.BODY);
  if (a !== -1){
    const b = h.indexOf(M.BODY_END, a);
    if (b !== -1){
      let end = b + M.BODY_END.length;
      if (h[end] === '\n') end++;
      h = h.slice(0, a) + h.slice(end);
    }
  }

  // 3/2/1. exact strings, removed by exact match
  [ M.ROSTER, M.EFFECTS,
    module.exports.AUTH_HTML + '\n',
    '\n' + module.exports.CSS + M.CSS_END + '\n'
  ].forEach(s => {
    const i = h.indexOf(s);
    if (i !== -1) h = h.slice(0, i) + h.slice(i + s.length);
  });

  return h;
};

/* ---- the sign-in gate: a full-screen overlay OUTSIDE .reveal-shell, so it
       cannot enter Reveal's layout or stacking context. Ships VISIBLE and is
       hidden only once Firebase confirms an approved account — it fails closed. ---- */
module.exports.GATE_HTML = `
<div class="fb-gate" id="fbGate">
  <div class="fb-gate-card">
    <div class="fb-gate-bar"></div>
    <h1 class="fb-gate-h1">Master Grammar</h1>
    <p class="fb-gate-sub">Fran&ccedil;ais &middot; CBSE Classe 10 &middot; 10E &amp; 10J</p>

    <div class="fb-gate-panel" id="fbGateForm">
      <div class="fb-tabs">
        <button class="fb-tab is-on" id="fbTabIn" type="button">Sign in</button>
        <button class="fb-tab" id="fbTabUp" type="button">Create account</button>
      </div>
      <p class="fb-gate-msg" id="fbGateMsg" hidden></p>
      <div id="fbGNameWrap" hidden>
        <label class="fb-lbl" for="fbGName">Your full name</label>
        <input class="fb-input" id="fbGName" type="text" autocomplete="name" placeholder="As it appears on the class list">
      </div>
      <label class="fb-lbl" for="fbGEmail">Email</label>
      <input class="fb-input" id="fbGEmail" type="email" autocomplete="email" placeholder="you@example.com">
      <label class="fb-lbl" for="fbGPass">Password</label>
      <input class="fb-input" id="fbGPass" type="password" autocomplete="current-password" placeholder="At least 6 characters">
      <button class="fb-btn fb-primary fb-gate-go" id="fbGateGo" type="button">Sign in</button>
      <p class="fb-gate-note" id="fbGateNote">New students: create an account, then wait for your teacher to let you in.</p>
    </div>

    <div class="fb-gate-panel" id="fbGateWait" hidden>
      <div class="fb-wait-icon">&#9203;</div>
      <h2 class="fb-wait-h">Your account is waiting for approval</h2>
      <p class="fb-gate-note">Signed in as <strong id="fbWaitWho"></strong>.<br>
         Your teacher must approve you before the lessons open. This page will let you in
         automatically once that happens &mdash; try again after your next class.</p>
      <button class="fb-btn fb-gate-go" id="fbWaitRefresh" type="button">Check again</button>
      <button class="fb-btn" id="fbWaitOut" type="button">Sign out</button>
    </div>

    <div class="fb-gate-panel" id="fbGateDown" hidden>
      <div class="fb-wait-icon">&#128246;</div>
      <h2 class="fb-wait-h">Cannot reach the sign-in server</h2>
      <p class="fb-gate-note" id="fbDownWhy">Check your internet connection and try again.</p>
      <button class="fb-btn fb-primary fb-gate-go" id="fbDownRetry" type="button">Retry</button>
    </div>

    <div class="fb-gate-foot">
      <button class="fb-btn fb-fbk-open" id="fbFeedbackBtn" type="button">&#128172; Provide Feedback</button>
    </div>
  </div>
</div>

<div class="fb-fbk-modal" id="fbFeedbackModal" hidden>
  <div class="fb-fbk-card">
    <div class="fb-dash-head">
      <h3>Provide Feedback</h3>
      <button class="fb-btn" id="fbFbkClose" title="Close">&#10005;</button>
    </div>
    <label class="fb-lbl" for="fbFbName">Your name <span class="fb-opt">(optional)</span></label>
    <input class="fb-input" id="fbFbName" type="text" maxlength="60" placeholder="Leave blank to stay anonymous">
    <label class="fb-lbl" for="fbFbText">Your feedback</label>
    <textarea class="fb-input fb-ta" id="fbFbText" maxlength="150" rows="4" placeholder="What would make this app better?"></textarea>
    <p class="fb-count"><span id="fbFbCount">0</span> / 150</p>
    <p class="fb-gate-msg" id="fbFbkMsg" hidden></p>
    <div class="fb-row">
      <button class="fb-btn fb-primary" id="fbFbkSend" type="button">Send</button>
      <button class="fb-btn" id="fbFbkCancel" type="button">Cancel</button>
    </div>
  </div>
</div>
<script>try{document.body.classList.add('fb-locked');}catch(e){}</script>
`;

/* ---- gate CSS appended so the marker-wrapped block stays one string ---- */
module.exports.CSS += `
/* ===== AUTH GATE ===== */
body.fb-locked .topbar, body.fb-locked .hud, body.fb-locked .sidebar,
body.fb-locked .topic-progress{ visibility:hidden !important; }
.fb-gate{
  position:fixed; inset:0; z-index:10100;   /* above the picker (10000): the gate must always win */
  display:flex; align-items:center; justify-content:center;
  padding:24px; overflow-y:auto;
  /* Must be FULLY opaque: --card-bg is rgba(...,0.95), which let the slides ghost
     through. --bg-gradient is the app own backdrop and is defined by all 7 themes. */
  background-color:var(--box-blue-bg,#f1f5f9);
  background-image:var(--bg-gradient);
  color:var(--text-main);
  font-family:inherit;
}
.fb-gate[hidden]{ display:none !important; }
.fb-gate-card{
  width:min(430px,100%); background:var(--card-bg); color:var(--text-main);
  border:1.5px solid var(--card-border); border-radius:18px;
  padding:0 28px 24px; box-shadow:0 18px 50px rgba(0,0,0,.22);
  overflow:hidden; text-align:center;
}
.fb-gate-bar{ height:7px; margin:0 -28px 20px;
  background:linear-gradient(90deg,#0055A4 33.3%,#FFFFFF 33.3% 66.6%,#EF4135 66.6%); }
.fb-gate-h1{ margin:0; font-size:1.6rem; font-weight:800; color:var(--heading-color); }
.fb-gate-sub{ margin:4px 0 18px; font-size:.8rem; color:var(--text-muted); }
.fb-gate-panel{ text-align:left; }
.fb-gate-panel[hidden]{ display:none !important; }
.fb-tabs{ display:flex; gap:6px; margin-bottom:14px;
  background:var(--highlight-bg); padding:4px; border-radius:11px; }
.fb-tab{ flex:1 1 0; padding:8px 6px; border:0; border-radius:8px; cursor:pointer;
  background:transparent; color:var(--text-muted); font:inherit; font-weight:700; font-size:.85rem; }
.fb-tab.is-on{ background:var(--card-bg); color:var(--heading-color); box-shadow:0 1px 4px rgba(0,0,0,.12); }
.fb-lbl{ display:block; margin:10px 0 2px; font-size:.74rem; font-weight:700;
  text-transform:uppercase; letter-spacing:.06em; color:var(--text-muted); }
.fb-opt{ text-transform:none; letter-spacing:0; font-weight:400; }
.fb-gate-go{ width:100%; margin-top:16px; padding:11px; font-size:.95rem; }
.fb-gate-note{ margin:12px 0 0; font-size:.78rem; line-height:1.5; color:var(--text-muted); }
.fb-gate-msg{ margin:0 0 10px; padding:9px 11px; border-radius:9px; font-size:.8rem;
  background:var(--highlight-bg); color:var(--text-main); border:1px solid var(--card-border); }
.fb-gate-msg[hidden]{ display:none !important; }
.fb-gate-msg.err{ background:rgba(220,53,69,.12); border-color:var(--crimson); color:var(--crimson); }
.fb-gate-msg.ok{ background:rgba(25,135,84,.12); border-color:var(--green); color:var(--green); }
.fb-wait-icon{ font-size:2.6rem; text-align:center; }
.fb-wait-h{ margin:6px 0 8px; font-size:1.06rem; text-align:center; color:var(--heading-color); }
.fb-gate-foot{ margin-top:20px; padding-top:16px; border-top:1px solid var(--card-border); }
.fb-fbk-open{ width:100%; }
/* feedback modal sits ABOVE the gate */
.fb-fbk-modal{ position:fixed; inset:0; z-index:10110; display:flex;
  align-items:center; justify-content:center; padding:24px; overflow-y:auto;
  background:rgba(0,0,0,.5); }
.fb-fbk-modal[hidden]{ display:none !important; }
.fb-fbk-card{ width:min(420px,100%); background:var(--card-bg); color:var(--text-main);
  border:1.5px solid var(--card-border); border-radius:16px; padding:18px 20px 20px;
  box-shadow:0 18px 50px rgba(0,0,0,.3); }
.fb-ta{ resize:vertical; min-height:88px; font-family:inherit; line-height:1.45; }
.fb-count{ margin:4px 0 10px; text-align:right; font-size:.74rem; color:var(--text-muted); }
.fb-count.over{ color:var(--crimson); font-weight:700; }
@media print{ .fb-gate, .fb-fbk-modal{ display:none !important; } }
`;

/* ---- Pick Student: the big centre stage and the bottom hand-off bar.
       Both are position:fixed siblings of .reveal-shell, so they never enter
       Reveal layout. The bar clears the existing HUD rather than covering it. ---- */
module.exports.PICK_HTML = `
<div class="ps-stage" id="psStage" hidden>
  <div class="ps-inner">
    <p class="ps-kicker">Au tableau&nbsp;!</p>
    <div class="ps-name" id="psName">&mdash;</div>
    <p class="ps-sub" id="psSub"></p>
  </div>
</div>

<div class="ps-bar" id="psBar" hidden>
  <span class="ps-bar-badge" id="psBarClass">10E</span>
  <span class="ps-bar-name" id="psBarName">&mdash;</span>
  <button class="ps-btn ps-ok"  id="psCorrect" type="button" title="Correct (C)">&#10004;</button>
  <button class="ps-btn ps-err" id="psWrong"   type="button" title="Wrong (X)">&#10008;</button>
  <button class="ps-btn ps-x"   id="psDismiss" type="button" title="Dismiss (Esc)">&#10005;</button>
</div>
`;

module.exports.CSS += `
/* ===== PICK STUDENT ===== */
.ps-stage{
  position:fixed; inset:0; z-index:10000;
  display:flex; align-items:center; justify-content:center; padding:5vh 4vw;
  background-color:var(--box-blue-bg,#f1f5f9); background-image:var(--bg-gradient);
}
.ps-stage[hidden]{ display:none !important; }
.ps-inner{ text-align:center; max-width:92vw; }
.ps-kicker{ margin:0 0 1.4vh; font-size:clamp(.9rem,2.4vh,1.4rem); font-weight:700;
  letter-spacing:.14em; text-transform:uppercase; color:var(--crimson); }
.ps-name{
  font-weight:900; line-height:1.06; color:var(--heading-color);
  font-size:clamp(2.2rem,11vh,8rem); word-break:break-word;
}
.ps-stage.is-spin .ps-name{ opacity:.45; filter:blur(1px); }
.ps-stage.is-land .ps-name{ opacity:1; filter:none; animation:psPop .38s cubic-bezier(.2,1.5,.4,1) both; }
@keyframes psPop{ from{ transform:scale(.72); } to{ transform:scale(1); } }
.ps-sub{ margin:2.2vh 0 0; font-size:clamp(.85rem,2.2vh,1.25rem); color:var(--text-muted); }

/* the bar sits ABOVE the existing HUD so Back/Next/Projector stay clickable */
.ps-bar{
  position:fixed; left:16px; bottom:calc(var(--hud-h,54px) + 12px); z-index:10000;
  display:flex; align-items:center; gap:9px;
  padding:7px 9px 7px 12px; border-radius:999px;
  background:var(--hud-bg,#fff); color:var(--text-main);
  border:1.5px solid var(--card-border); box-shadow:0 6px 22px rgba(0,0,0,.18);
  opacity:0; transform:translateY(10px); transition:opacity .22s ease, transform .22s ease;
  max-width:min(560px,calc(100vw - 32px));
}
.ps-bar[hidden]{ display:none !important; }
.ps-bar.is-in{ opacity:1; transform:none; }
.ps-bar.is-ok{ border-color:var(--green); box-shadow:0 0 0 3px rgba(25,135,84,.22); }
.ps-bar.is-err{ border-color:var(--crimson); box-shadow:0 0 0 3px rgba(220,53,69,.20); }
.ps-bar-badge{ flex:0 0 auto; padding:3px 9px; border-radius:999px; font-size:.7rem; font-weight:800;
  letter-spacing:.05em; background:var(--heading-color); color:#fff; }
.ps-bar-name{ flex:1 1 auto; min-width:0; font-weight:800; font-size:.98rem;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ps-btn{ flex:0 0 auto; width:34px; height:34px; border-radius:50%; cursor:pointer;
  border:1.5px solid var(--card-border); background:var(--card-bg); color:var(--text-main);
  font-size:1rem; line-height:1; font-family:inherit; }
.ps-btn:hover{ transform:translateY(-1px); }
.ps-btn:focus-visible{ outline:2px solid var(--heading-color); outline-offset:2px; }
.ps-ok{ color:var(--green); border-color:var(--green); }
.ps-ok:hover{ background:var(--green); color:#fff; }
.ps-err{ color:var(--crimson); border-color:var(--crimson); }
.ps-err:hover{ background:var(--crimson); color:#fff; }
.ps-x{ width:28px; height:28px; font-size:.8rem; color:var(--text-muted); }
@media (prefers-reduced-motion:reduce){
  .ps-bar{ transition:none; } .ps-stage.is-land .ps-name{ animation:none; }
}
@media print{ .ps-stage, .ps-bar{ display:none !important; } }
`;

/* ---- Feature 4/5: the affirmation pop and the weekly leaderboard. Both are
       fixed siblings of .reveal-shell. The affirmation is pointer-events:none so
       it can never swallow a click while the teacher keeps working. ---- */
module.exports.AFFIRM_HTML = `
<div class="af-pop" id="afPop" hidden>
  <div class="af-card" id="afCard">
    <div class="af-emoji" id="afEmoji">✨</div>
    <div class="af-word"  id="afWord">Tr&egrave;s bien&nbsp;!</div>
    <div class="af-who"   id="afWho"></div>
    <div class="af-sub"   id="afSub"></div>
  </div>
</div>

<div class="lb-wrap" id="lbWrap">
  <button class="lb-tab" id="lbTab" type="button" title="Weekly leaderboard">
    <span class="lb-cup">🏆</span><span class="lb-n" id="lbTabN">0</span>
  </button>
  <div class="lb-panel" id="lbPanel" hidden>
    <div class="lb-head">
      <strong>Top 3 &middot; <span id="lbWeek"></span></strong>
      <button class="lb-x" id="lbClose" type="button" title="Close">&#10005;</button>
    </div>
    <div class="lb-classes">
      <button class="lb-cls is-on" id="lbCls10E" type="button" data-cls="10E">10E</button>
      <button class="lb-cls"       id="lbCls10J" type="button" data-cls="10J">10J</button>
    </div>
    <ol class="lb-list" id="lbList"></ol>
    <p class="lb-empty" id="lbEmpty" hidden>Personne n&rsquo;a encore plus de 3 bonnes r&eacute;ponses cette semaine.</p>
  </div>
</div>
`;

module.exports.CSS += `
/* ===== AFFIRMATIONS ===== */
.af-pop{
  position:fixed; inset:0; z-index:10020;
  display:flex; align-items:center; justify-content:center;
  pointer-events:none;   /* never steals a click from the lesson */
}
.af-pop[hidden]{ display:none !important; }
.af-card{
  text-align:center; padding:3vh 5vw; border-radius:26px;
  background:var(--card-bg); border:3px solid var(--green);
  box-shadow:0 22px 70px rgba(0,0,0,.28);
  animation:afIn .34s cubic-bezier(.2,1.5,.4,1) both;
}
.af-pop.t3 .af-card{ border-color:var(--gold,#f59e0b); }
@keyframes afIn{ from{ transform:scale(.7); opacity:0; } to{ transform:scale(1); opacity:1; } }
.af-emoji{ font-size:clamp(2.4rem,7vh,4.4rem); line-height:1; }
.af-pop.t3 .af-emoji{ animation:afSpin .9s ease-in-out both; }
@keyframes afSpin{ 0%{ transform:rotate(-14deg) scale(.8); } 60%{ transform:rotate(12deg) scale(1.18); } 100%{ transform:none; } }
.af-word{ margin-top:1vh; font-weight:900; line-height:1.05; color:var(--green);
  font-size:clamp(1.9rem,8vh,5.4rem); }
.af-pop.t3 .af-word{ color:var(--gold,#f59e0b); }
.af-who{ margin-top:1.2vh; font-weight:800; color:var(--heading-color);
  font-size:clamp(1rem,3vh,1.9rem); }
.af-sub{ margin-top:.5vh; color:var(--text-muted); font-size:clamp(.8rem,2vh,1.1rem); }
@media (prefers-reduced-motion:reduce){
  .af-card, .af-pop.t3 .af-emoji{ animation:none; }
}

/* ===== LEADERBOARD ===== */
.lb-wrap{ position:fixed; left:16px; top:calc(var(--topbar-h,56px) + 12px); z-index:10010;
  display:flex; flex-direction:column; align-items:flex-start; gap:8px; }
.lb-tab{ display:flex; align-items:center; gap:6px; cursor:pointer;
  padding:6px 12px 6px 10px; border-radius:999px; font:inherit; font-weight:800; font-size:.82rem;
  background:var(--hud-bg,#fff); color:var(--text-main);
  border:1.5px solid var(--card-border); box-shadow:0 5px 18px rgba(0,0,0,.14); }
.lb-tab:hover{ transform:translateY(-1px); }
.lb-tab:focus-visible{ outline:2px solid var(--heading-color); outline-offset:2px; }
.lb-cup{ font-size:1rem; line-height:1; }
.lb-n{ min-width:1.1em; text-align:center; padding:0 5px; border-radius:999px;
  background:var(--gold,#f59e0b); color:#1f2937; font-size:.72rem; }
.lb-panel{ width:250px; max-width:calc(100vw - 32px);
  background:var(--card-bg); color:var(--text-main); border:1.5px solid var(--card-border);
  border-radius:14px; padding:12px 13px; box-shadow:0 14px 40px rgba(0,0,0,.2); }
.lb-panel[hidden]{ display:none !important; }
.lb-head{ display:flex; align-items:center; justify-content:space-between; gap:8px;
  font-size:.85rem; color:var(--heading-color); }
.lb-x{ border:0; background:transparent; cursor:pointer; color:var(--text-muted);
  font-size:.8rem; font-family:inherit; padding:2px 4px; }
.lb-classes{ display:flex; gap:5px; margin:9px 0 8px; }
.lb-cls{ flex:1 1 0; padding:5px 0; border-radius:8px; cursor:pointer; font:inherit;
  font-weight:700; font-size:.76rem; background:var(--highlight-bg); color:var(--text-muted);
  border:1.5px solid transparent; }
.lb-cls.is-on{ background:var(--heading-color); color:#fff; }
.lb-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:6px; }
.lb-row{ display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:9px;
  background:var(--highlight-bg); font-size:.82rem; }
.lb-row.r1{ background:rgba(245,158,11,.20); }
.lb-medal{ flex:0 0 auto; font-size:.95rem; }
.lb-name{ flex:1 1 auto; min-width:0; font-weight:700; white-space:nowrap;
  overflow:hidden; text-overflow:ellipsis; }
.lb-score{ flex:0 0 auto; font-weight:900; color:var(--green); }
.lb-empty{ margin:2px 0 0; font-size:.76rem; line-height:1.45; color:var(--text-muted); }
.lb-empty[hidden]{ display:none !important; }
@media print{ .af-pop, .lb-wrap{ display:none !important; } }
`;

/* ---- Feature 6: the admin trigger and dashboard. The button ships hidden and
       is revealed only for the admin account. That is a convenience, not the
       security boundary -- the Firestore rules are. ---- */
module.exports.ADMIN_HTML = `
<button class="ad-btn" id="adBtn" type="button" hidden title="Admin dashboard">&#128737;</button>
<div class="ad-dash" id="adDash" hidden>
  <div class="ad-card">
    <div class="ad-head">
      <strong class="ad-title">Admin</strong>
      <span class="ad-who" id="adWho"></span>
      <button class="ad-x" id="adClose" type="button" title="Close (Esc)">&#10005;</button>
    </div>
    <div class="ad-tabs">
      <button class="ad-tab is-on" id="adTab1" type="button" data-tab="approve">Approvals <span class="ad-badge zero" id="adPendN">0</span></button>
      <button class="ad-tab"       id="adTab2" type="button" data-tab="scores">Scores &amp; Activity</button>
      <button class="ad-tab"       id="adTab3" type="button" data-tab="feedback">Feedback</button>
      <button class="ad-tab"       id="adTab4" type="button" data-tab="ai">AI</button>
    </div>
    <div class="ad-body" id="adBody"></div>
  </div>
</div>
`;

module.exports.CSS += `
/* ===== ADMIN DASHBOARD ===== */
.ad-btn{
  position:fixed; right:16px; bottom:calc(var(--hud-h,54px) + 12px); z-index:10030;
  width:36px; height:36px; border-radius:50%; cursor:pointer; font-size:1rem; line-height:1;
  background:var(--hud-bg,#fff); color:var(--text-muted);
  border:1.5px solid var(--card-border); box-shadow:0 5px 16px rgba(0,0,0,.15);
  opacity:.45; transition:opacity .18s ease, transform .18s ease;
}
.ad-btn:hover{ opacity:1; transform:translateY(-1px); color:var(--heading-color); }
.ad-btn:focus-visible{ opacity:1; outline:2px solid var(--heading-color); outline-offset:2px; }
.ad-btn[hidden]{ display:none !important; }

.ad-dash{
  position:fixed; inset:0; z-index:10050;
  display:flex; align-items:center; justify-content:center; padding:3vh 3vw;
  background-color:var(--box-blue-bg,#f1f5f9); background-image:var(--bg-gradient);
}
.ad-dash[hidden]{ display:none !important; }
.ad-card{
  width:min(880px,100%); max-height:94vh; display:flex; flex-direction:column;
  background:var(--card-bg); color:var(--text-main); border:1.5px solid var(--card-border);
  border-radius:16px; box-shadow:0 20px 60px rgba(0,0,0,.24); overflow:hidden;
}
.ad-head{ display:flex; align-items:center; gap:10px; padding:13px 16px;
  border-bottom:1px solid var(--card-border); }
.ad-title{ font-size:1rem; color:var(--heading-color); }
.ad-who{ flex:1 1 auto; min-width:0; font-size:.76rem; color:var(--text-muted);
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ad-x{ border:1.5px solid var(--card-border); background:var(--card-bg); color:var(--text-main);
  width:30px; height:30px; border-radius:50%; cursor:pointer; font-family:inherit; font-size:.8rem; }
.ad-tabs{ display:flex; gap:6px; padding:10px 16px 0; }
.ad-tab{ padding:8px 13px; border:0; border-bottom:3px solid transparent; cursor:pointer;
  background:transparent; color:var(--text-muted); font:inherit; font-weight:700; font-size:.84rem; }
.ad-tab.is-on{ color:var(--heading-color); border-bottom-color:var(--heading-color); }
.ad-badge{ display:inline-block; min-width:1.1em; padding:0 5px; margin-left:4px; border-radius:999px;
  background:var(--crimson); color:#fff; font-size:.68rem; }
.ad-badge.zero{ background:var(--card-border); color:var(--text-muted); }
.ad-body{ flex:1 1 auto; overflow-y:auto; padding:14px 16px 18px; }
.ad-msg{ margin:6px 0; font-size:.85rem; color:var(--text-muted); }
.ad-h4{ margin:0 0 10px; font-size:.9rem; color:var(--heading-color); }
.ad-h5{ margin:16px 0 7px; font-size:.8rem; text-transform:uppercase; letter-spacing:.06em;
  color:var(--text-muted); }
.ad-list{ display:flex; flex-direction:column; gap:8px; }
.ad-row{ display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:10px;
  background:var(--highlight-bg); }
.ad-row.is-done{ opacity:.55; }
.ad-info{ flex:1 1 auto; min-width:0; }
.ad-name{ font-weight:700; font-size:.88rem; }
.ad-sub{ font-size:.75rem; color:var(--text-muted); margin-top:2px; }
.ad-approve{ flex:0 0 auto; padding:7px 15px; border-radius:999px; cursor:pointer;
  border:1.5px solid var(--green); background:var(--green); color:#fff;
  font:inherit; font-weight:700; font-size:.8rem; }
.ad-approve:disabled{ opacity:.6; cursor:default; }
.ad-tbl{ width:100%; border-collapse:collapse; font-size:.82rem; }
.ad-tbl th{ text-align:left; padding:6px 8px; border-bottom:1.5px solid var(--card-border);
  font-size:.72rem; text-transform:uppercase; letter-spacing:.05em; color:var(--text-muted); }
.ad-tbl td{ padding:6px 8px; border-bottom:1px solid var(--card-border); }
.ad-tname{ font-weight:600; }
.ad-ok{ color:var(--green); font-weight:800; }
.ad-no{ color:var(--crimson); font-weight:800; }
.ad-fb{ padding:10px 12px; border-radius:10px; background:var(--highlight-bg); }
.ad-fbtext{ margin:0; font-size:.88rem; line-height:1.45; white-space:pre-wrap; word-break:break-word; }
@media print{ .ad-btn, .ad-dash{ display:none !important; } }
`;

/* ---- Teacher AI assistant. Both nodes ship hidden; the button is revealed only
       for the admin account WITH a key saved, and the tooltip only on demand. ---- */
module.exports.AI_HTML = `
<button class="ai-btn" id="aiBtn" type="button" hidden aria-pressed="false"
        title="AI Mode — click a word on a slide">&#129302; AI Mode</button>

<div class="ai-tip" id="aiTip" hidden>
  <div class="ai-tip-head">
    <span class="ai-tip-word" id="aiTipWord"></span>
    <button class="ai-tip-x" id="aiTipClose" type="button" title="Close (Esc)">&#10005;</button>
  </div>
  <div class="ai-tip-body" id="aiTipBody"></div>
  <div class="ai-tip-menu" id="aiTipMenu"></div>
</div>
`;

module.exports.CSS += `
/* ===== TEACHER AI ASSISTANT ===== */
.ai-btn{
  /* right:16px belongs to .ad-btn; sit beside it, never on top of it */
  position:fixed; right:60px; bottom:calc(var(--hud-h,54px) + 12px); z-index:10030;
  padding:7px 13px; border-radius:999px; cursor:pointer;
  font-family:inherit; font-weight:700; font-size:.78rem; line-height:1;
  background:var(--hud-bg,#fff); color:var(--text-muted);
  border:1.5px solid var(--card-border); box-shadow:0 5px 16px rgba(0,0,0,.15);
  opacity:.55; transition:opacity .18s ease, transform .18s ease;
}
.ai-btn:hover{ opacity:1; transform:translateY(-1px); }
.ai-btn:focus-visible{ opacity:1; outline:2px solid var(--heading-color); outline-offset:2px; }
.ai-btn[hidden]{ display:none !important; }
.ai-btn[aria-pressed="true"]{
  opacity:1; background:var(--heading-color); color:#fff; border-color:var(--heading-color);
}

/* the only rule that touches slide content, and only while the mode is ON */
body.ai-mode .slide-card{ cursor:help; }

.ai-tip{
  position:fixed; z-index:10040; width:min(340px, calc(100vw - 32px));
  max-height:min(56vh, 460px); overflow-y:auto;
  background:var(--card-bg); color:var(--text-main);
  border:1.5px solid var(--card-border); border-radius:14px;
  box-shadow:0 14px 44px rgba(0,0,0,.26); padding:11px 13px 12px;
  font-family:inherit;   /* inherit the active theme font, never introduce one */
  font-size:.86rem; line-height:1.5;
}
.ai-tip[hidden]{ display:none !important; }
.ai-tip-head{ display:flex; align-items:center; gap:8px; margin-bottom:7px; }
.ai-tip-word{ flex:1 1 auto; min-width:0; font-weight:800; font-size:.92rem;
  color:var(--heading-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ai-tip-x{ flex:0 0 auto; width:24px; height:24px; border-radius:50%; cursor:pointer;
  border:1.5px solid var(--card-border); background:var(--card-bg); color:var(--text-muted);
  font-family:inherit; font-size:.7rem; line-height:1; }
.ai-tip-body{ white-space:pre-wrap; word-break:break-word; min-height:1.4em; }
.ai-tip-body em{ color:var(--text-muted); font-style:italic; }
.ai-tip-body .ai-err{ color:var(--crimson); }
.ai-tip-menu{ display:flex; flex-wrap:wrap; gap:5px; margin-top:10px;
  padding-top:9px; border-top:1px solid var(--card-border); }
.ai-p{ padding:4px 9px; border-radius:999px; cursor:pointer;
  border:1.5px solid var(--card-border); background:var(--highlight-bg);
  color:var(--text-main); font-family:inherit; font-weight:600; font-size:.7rem; }
.ai-p:hover{ background:var(--heading-color); color:#fff; border-color:var(--heading-color); }
.ai-p[disabled]{ opacity:.5; cursor:default; }
.ai-cached{ font-size:.66rem; color:var(--text-muted); margin-left:auto; align-self:center; }

/* admin AI tab */
.ai-row{ display:flex; gap:6px; align-items:center; margin-top:8px; flex-wrap:wrap; }
.ai-row .fb-input{ flex:1 1 12ch; margin:0; }
.ai-hint{ margin:8px 0 0; font-size:.75rem; line-height:1.5; color:var(--text-muted); }
.ai-saved{ font-weight:700; color:var(--green); }
@media print{ .ai-btn, .ai-tip{ display:none !important; } }
`;
