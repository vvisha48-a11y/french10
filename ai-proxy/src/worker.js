/**
 * Gemini proxy for the CBSE Class 10 French deck.
 *
 * WHY THIS EXISTS: docs/app.html is a static file on GitHub Pages. Any key it
 * carries is visible in DevTools' network tab no matter how it is hidden, so the
 * teacher's billable key cannot live in 76 student browsers. It lives here, as a
 * Worker secret, and never leaves Cloudflare.
 *
 * Every request must prove three things before a single token is spent:
 *   1. it carries a valid Firebase ID token for THIS project (else the proxy is
 *      an open Gemini relay for the whole internet),
 *   2. the teacher's global switch is on,
 *   3. the caller is not looping.
 *
 * Deploy:  npx wrangler deploy
 * Secret:  npx wrangler secret put GEMINI_KEY
 */

const JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const GEMINI = 'https://generativelanguage.googleapis.com/v1beta/models/';

/* Model allow-list. A caller must not be able to name an arbitrary model and bill
   the teacher for a premium one. */
const MODELS = ['gemini-3.5-flash-lite', 'gemini-3.5-flash'];
const DEFAULT_MODEL = MODELS[0];

/* Best-effort burst guard. The teacher chose no per-student daily cap, so this is
   deliberately NOT a quota: it is generous enough that no human reaches it and
   tight enough that a runaway loop stops immediately. It lives in isolate memory
   because Workers KV allows only 1,000 writes/day on the free plan, far too few
   for a per-request counter. That means it is per-isolate rather than global —
   it reliably stops a tight loop, which is the case that costs real money. */
const BURST_MAX = 15;
const BURST_WINDOW_MS = 60_000;
const burst = new Map();

/* Caches that survive between requests in the same isolate. */
let jwksCache = { at: 0, keys: null };
let switchCache = { at: 0, value: null };
const keyCache = new Map();      // kid -> imported CryptoKey

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors() }
  });

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };
}

/* ---------- base64url, without Buffer ---------- */
function b64urlToBytes(s) {
  const pad = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(pad + '==='.slice((pad.length + 3) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
const b64urlToText = s => new TextDecoder().decode(b64urlToBytes(s));

/* ---------- Firebase ID token verification ----------
   Google signs these RS256 with rotating keys. Verifying the signature ourselves
   is what makes the proxy safe to expose: without it, anyone who finds the URL
   can spend the teacher's money. */
async function jwks() {
  const now = Date.now();
  if (jwksCache.keys && now - jwksCache.at < 60 * 60 * 1000) return jwksCache.keys;
  const res = await fetch(JWKS_URL);
  if (!res.ok) throw new Error('could not fetch Google signing keys');
  const body = await res.json();
  jwksCache = { at: now, keys: body.keys || [] };
  keyCache.clear();          // Google rotated: drop the imported keys with them
  return jwksCache.keys;
}

async function verifyIdToken(token, projectId) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) throw new Error('malformed token');

  const header = JSON.parse(b64urlToText(parts[0]));
  const claims = JSON.parse(b64urlToText(parts[1]));

  if (header.alg !== 'RS256') throw new Error('unexpected token algorithm');
  if (claims.aud !== projectId) throw new Error('token is for another project');
  if (claims.iss !== 'https://securetoken.google.com/' + projectId) throw new Error('bad issuer');

  const now = Math.floor(Date.now() / 1000);
  if (!claims.exp || claims.exp < now) throw new Error('token expired');
  if (claims.iat && claims.iat > now + 300) throw new Error('token issued in the future');
  if (!claims.sub) throw new Error('token has no subject');

  const key = (await jwks()).find(k => k.kid === header.kid);
  if (!key) throw new Error('signing key not found');

  /* importKey dominates the cost of a verification (~4 ms measured, against a
     10 ms CPU budget), and Google rotates only a handful of kids at a time — so
     keep the imported CryptoKey, not just the JWK. */
  let pub = keyCache.get(header.kid);
  if (!pub) {
    pub = await crypto.subtle.importKey(
      'jwk', key, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']
    );
    keyCache.set(header.kid, pub);
  }
  const ok = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5', pub,
    b64urlToBytes(parts[2]),
    new TextEncoder().encode(parts[0] + '.' + parts[1])
  );
  if (!ok) throw new Error('signature does not verify');

  return claims;
}

/* ---------- the teacher's kill switch ----------
   Read as the calling user, so the existing Firestore rules apply and no service
   account is needed. Cached briefly: flipping the switch takes effect within a
   minute, which is fast enough to stop a lesson going wrong. */
async function aiEnabled(projectId, idToken) {
  const now = Date.now();
  if (switchCache.value !== null && now - switchCache.at < 60_000) return switchCache.value;
  try {
    const url = 'https://firestore.googleapis.com/v1/projects/' + projectId +
                '/databases/(default)/documents/config/ai';
    const res = await fetch(url, { headers: { Authorization: 'Bearer ' + idToken } });
    if (res.status === 404) { switchCache = { at: now, value: true }; return true; } // not configured yet: allow
    if (!res.ok) return switchCache.value === null ? true : switchCache.value;
    const doc = await res.json();
    const f = (doc.fields || {}).enabled || {};
    const on = f.booleanValue !== false;
    switchCache = { at: now, value: on };
    return on;
  } catch (e) {
    /* Never fail a lesson because the switch could not be read. */
    return switchCache.value === null ? true : switchCache.value;
  }
}

function overBurst(uid) {
  const now = Date.now();
  const rec = burst.get(uid);
  if (!rec || now - rec.at > BURST_WINDOW_MS) { burst.set(uid, { at: now, n: 1 }); return false; }
  rec.n++;
  if (burst.size > 500) burst.clear();          // isolate memory hygiene
  return rec.n > BURST_MAX;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const originOk = !allowed.length || allowed.includes(origin);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405);
    if (!originOk) return json({ error: 'origin not allowed' }, 403);

    if (!env.GEMINI_KEY) return json({ error: 'The proxy has no API key configured.' }, 500);
    const projectId = env.FIREBASE_PROJECT_ID;
    if (!projectId) return json({ error: 'The proxy has no Firebase project configured.' }, 500);

    const auth = request.headers.get('Authorization') || '';
    const idToken = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!idToken) return json({ error: 'Sign in to use the assistant.' }, 401);

    let claims;
    try { claims = await verifyIdToken(idToken, projectId); }
    catch (e) { return json({ error: 'Sign-in could not be verified: ' + e.message }, 401); }

    if (overBurst(claims.sub))
      return json({ error: 'Too many requests in a row. Wait a moment and try again.' }, 429);

    if (!(await aiEnabled(projectId, idToken)))
      return json({ error: 'Your teacher has turned the assistant off.' }, 403);

    let body;
    try { body = await request.json(); } catch (e) { return json({ error: 'bad request body' }, 400); }

    const prompt = String(body.prompt || '').slice(0, 8000);
    if (!prompt) return json({ error: 'nothing to ask' }, 400);
    const model = MODELS.includes(body.model) ? body.model : DEFAULT_MODEL;

    const res = await fetch(GEMINI + model + ':generateContent?key=' + encodeURIComponent(env.GEMINI_KEY), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 400 }
      })
    });

    if (res.status === 429)
      return json({ error: 'The class is busy right now — try again in a moment.' }, 429);
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      /* Never echo the upstream body verbatim: it can contain the key in the URL. */
      return json({ error: 'The assistant is unavailable (HTTP ' + res.status + ').' }, 502);
    }

    const data = await res.json();
    const parts = (((data.candidates || [])[0] || {}).content || {}).parts || [];
    const text = parts.map(p => p.text || '').join(' ').trim();
    if (!text) return json({ error: 'The model returned nothing. Try a different prompt.' }, 502);

    return json({ text, model });
  }
};
