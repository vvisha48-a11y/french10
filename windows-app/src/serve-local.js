// The Masquerade: the window shows the website's own address, but every file of the
// website is read from this app's content/ folder.
//
// The page stays at https://vvisha48-a11y.github.io/french10/, so everything that
// checks the address keeps working with no change anywhere: Firebase Auth's authorised
// domains, Firestore, and the AI Worker (it refuses any Origin not in ALLOWED_ORIGINS).
//
//   https://vvisha48-a11y.github.io/french10/app.html      content/app.html
//   https://vvisha48-a11y.github.io/french10/images/...    content/images/
//   https://vvisha48-a11y.github.io/french10/__desktop/... src/inject/ (the desktop layers)
//   https://vvisha48-a11y.github.io/french10/<anything else>  404, answered here
//   https://www.gstatic.com/firebasejs/<version>/...       content/sdk/ (so sign-in state starts offline)
//   every other https request                              the real network, untouched
//
// protocol.handle('https') sees every https request of this window's session;
// session.fetch(..., { bypassCustomProtocolHandlers: true }) sends the ones that are
// not ours to the network without coming back here.
const fs = require('fs');
const path = require('path');
const { net } = require('electron');

const SITE = 'https://vvisha48-a11y.github.io';
const BASE = '/french10/';
const START_URL = SITE + BASE + 'app.html';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.woff2': 'font/woff2'
};

/* A path inside `root`, or null. Rejects "..", absolute paths and encoded tricks. */
function inside(root, rel){
  let clean;
  try { clean = decodeURIComponent(rel); } catch (_){ return null; }
  if (!clean || clean.includes('\0')) return null;
  const full = path.resolve(root, clean);
  return full.startsWith(path.resolve(root) + path.sep) ? full : null;
}

async function file(full, extraHeaders, transform){
  if (!full) return notFound();
  try {
    let body = await fs.promises.readFile(full);
    if (transform) body = transform(body.toString('utf8'));
    return new Response(body, { status: 200, headers: Object.assign({
      'content-type': TYPES[path.extname(full).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-cache'
    }, extraHeaders || {}) });
  } catch (_){ return notFound(); }
}
const notFound = () => new Response('Not in the desktop app', { status: 404, headers: { 'content-type': 'text/plain' } });

/* Which requests are page loads.
   The request itself cannot be trusted to say: an intercepted request reports
   mode:'cors' whatever it really is, and a page can put any Accept or
   Upgrade-Insecure-Requests header on a fetch (measured: a fetch dressed as a
   navigation is indistinguishable by headers). Chromium's own classification is
   trustworthy, and webRequest hands it over before this handler runs -- a real page,
   frame or popup is mainFrame/subFrame, while the dressed-up fetch is xhr. */
function documentTracker(ses){
  const pending = new Map();                    // url -> how many page loads are in flight
  ses.webRequest.onBeforeRequest((details, cb) => {
    if (details.resourceType === 'mainFrame' || details.resourceType === 'subFrame'){
      if (pending.size > 200) pending.clear();   // never grows without bound
      pending.set(details.url, (pending.get(details.url) || 0) + 1);
    }
    cb({});
  });
  return url => {
    const n = pending.get(url) || 0;
    if (!n) return false;
    if (n === 1) pending.delete(url); else pending.set(url, n - 1);
    return true;
  };
}

/* Who made this request. Electron puts initiatorOrigin on everything web content
   starts -- with or without a referrer -- and leaves it undefined for the browser's
   own loads (a top-level navigation). Verified on Electron 44. */
function initiatorOf(req){
  if (req.initiatorOrigin && req.initiatorOrigin !== 'null') return req.initiatorOrigin;
  if (!req.referrer || req.referrer === 'about:client') return null;
  try { const o = new URL(req.referrer).origin; return o === 'null' ? null : o; } catch (_){ return null; }
}

/* Restore what the browser would have sent, and nothing more.
   An intercepted request reaches this handler without its Origin header, and Electron
   then treats an Origin-less request as fully credentialed: it attaches every cookie
   in the session and applies no CORS check. Left alone, that hands any script running
   in this window a credentialed, unchecked read of every site the teacher is signed
   in to -- and lets it call the AI Worker as if it were the website. So every request
   that web content started goes out with its real Origin, and cross-origin ones go
   out with no cookies at all, exactly as a browser sends them. Page loads are left
   as they are: those legitimately carry cookies (the Google sign-in popup needs them). */
function prepare(req, u, isDoc){
  if (isDoc || req.headers.has('origin')) return req;
  const from = initiatorOf(req);
  if (from === u.origin) return req;                 // same-origin sub-request: no Origin, cookies fine
  if (!from) return new Request(req, { duplex: 'half', credentials: 'omit' });
  const headers = new Headers(req.headers);
  headers.set('origin', from);
  return new Request(req, { headers, duplex: 'half', credentials: 'omit' });
}

/* The first redirect of a page load, read without following it.
   session.fetch follows redirects inside itself and then reports neither the final URL
   nor that it redirected, so a redirected page would be shown under the URL it started
   from -- with the wrong origin for the scripts on it, which breaks the Google sign-in
   popup. Chromium must do the redirecting, so the Location is fetched here and handed
   back as a real 3xx. bypassCustomProtocolHandlers: without it this request would come
   straight back into this handler. */
function firstRedirect(ses, req, ms){
  return new Promise(resolve => {
    let done = false;
    const finish = v => { if (!done){ done = true; resolve(v); } };
    setTimeout(() => finish('unknown'), ms);
    try {
      const r = net.request({ method: req.method, url: req.url, session: ses, credentials: 'include',
                              redirect: 'manual', bypassCustomProtocolHandlers: true });
      for (const [k, v] of req.headers){
        if (!/^(host|content-length|cookie|connection)$/i.test(k)) { try { r.setHeader(k, v); } catch (_){} }
      }
      r.on('redirect', (status, _method, url) => { try { r.abort(); } catch (_){} finish({ status, url }); });
      r.on('response', res => { res.resume(); finish(null); });        // no redirect after all
      r.on('error', () => finish('unknown'));
      r.end();
    } catch (_){ finish('unknown'); }
  });
}

const slowRedirect = () => new Response(
  '<!doctype html><meta charset="utf-8"><body style="font:16px system-ui;padding:40px;color:#0f172a">' +
  '<h2 style="color:#002395">This page is taking too long</h2><p>The connection was too slow to follow where it leads. ' +
  'Close this window and try again.</p>',
  { status: 504, headers: { 'content-type': 'text/html; charset=utf-8' } });

async function passthrough(ses, req, u, isDoc){
  const out = prepare(req, u, isDoc);
  if (!isDoc || (req.method !== 'GET' && req.method !== 'HEAD')) return ses.fetch(out, { bypassCustomProtocolHandlers: true });
  try {
    /* the redirect mode has to be set on the Request itself; an init hint is ignored */
    return await ses.fetch(new Request(out, { redirect: 'error' }), { bypassCustomProtocolHandlers: true });
  } catch (e){
    if (!/redirect/i.test(String(e && e.message || e))) throw e;
    /* There IS a redirect; find out where to, and let Chromium follow it. If even a
       second, longer look cannot say, show a slow-connection page rather than the
       destination's content under this URL -- which is the bug this path exists to
       prevent, and which would hand a sign-in page the wrong origin. */
    let hop = await firstRedirect(ses, req, 5000);
    if (hop === 'unknown') hop = await firstRedirect(ses, req, 12000);
    if (hop === 'unknown') return slowRedirect();
    if (!hop) return ses.fetch(out, { bypassCustomProtocolHandlers: true });   // it stopped redirecting
    return new Response(null, { status: hop.status, headers: { location: hop.url } });
  }
}

function install(ses, { contentDir, injectDir, sdkVersion, offlineTest }){
  const SDK = 'https://www.gstatic.com/firebasejs/' + sdkVersion + '/';
  const takeDocument = documentTracker(ses);

  ses.protocol.handle('https', async (req) => {
    const url = req.url;
    /* read once per request, whatever the outcome, so the note never outlives it */
    const isDoc = takeDocument(url);
    let u;
    try { u = new URL(url); } catch (_){ return notFound(); }

    if (u.origin === SITE && (u.pathname === '/french10' || u.pathname.startsWith(BASE))){
      const rel = u.pathname.slice(BASE.length);
      if (rel === '' || u.pathname === '/french10' || rel === 'index.html') return Response.redirect(START_URL, 302);
      if (rel === 'app.html') return file(path.join(contentDir, 'app.html'));
      if (rel.startsWith('images/')) return file(inside(path.join(contentDir, 'images'), rel.slice(7)));
      /* a desktop module imports the SDK by the page's exact address, so it gets the
         page's own Firebase instance; the version is written in as it is served */
      if (rel.startsWith('__desktop/')) return file(inside(injectDir, rel.slice(10)), null,
        rel.endsWith('.js') ? s => s.split('__FIREBASE_SDK__').join(SDK.slice(0, -1)) : null);
      return notFound();
    }

    /* The page imports the SDK as cross-origin module scripts, which are fetched in
       CORS mode: without this header Chromium refuses to run them. gstatic sends it. */
    if (url.startsWith(SDK)) return file(inside(path.join(contentDir, 'sdk'), url.slice(SDK.length).split('?')[0]),
                                         { 'access-control-allow-origin': '*' });

    /* --offline-test: behave as if the network cable were out, without pulling it */
    if (offlineTest) return Response.error();

    return passthrough(ses, req, u, isDoc);
  });
}

module.exports = { install, SITE, BASE, START_URL };
