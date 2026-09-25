// Google Drive for the teacher's PC: sign in once, then dropped files are uploaded to
// the teacher's own Drive, shared "anyone with the link can view", and their links
// handed back to the calendar, which publishes them.
//
// Nothing secret ships in the installer. The installer is public (GitHub Releases),
// so a bundled service-account key would give every student full control of that
// Drive -- and a service account cannot store files in a personal Gmail Drive anyway.
// Instead:
//   * the teacher downloads a Google Cloud OAuth client ("Desktop app") JSON once and
//     picks it on "Connect Google Drive"; it is copied into this PC's app data;
//   * sign-in happens in the normal browser (Google refuses sign-in inside embedded
//     windows), returning to a one-time listener on 127.0.0.1, with PKCE and a state
//     check;
//   * the refresh token is encrypted with Windows' own per-user protection
//     (safeStorage / DPAPI) and never leaves this PC.
// Scope: drive.file -- the app can see and change only the files it created itself,
// never the rest of the teacher's Drive.
const { app, dialog, shell, safeStorage } = require('electron');
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');

const SCOPES = ['https://www.googleapis.com/auth/drive.file', 'openid', 'email'];
const FOLDER_NAME = 'French Grammar - class materials';
const MAX_BYTES = 250 * 1024 * 1024;
const MAX_FILES = 50;
const KINDS = {
  PDF: ['pdf'],
  Slides: ['ppt', 'pptx', 'pps', 'ppsx', 'odp', 'key'],
  Document: ['doc', 'docx', 'odt', 'rtf', 'txt', 'md', 'xls', 'xlsx', 'ods', 'csv'],
  Image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'bmp', 'svg'],
  Video: ['mp4', 'mov', 'm4v', 'webm', 'avi', 'mkv'],
  Audio: ['mp3', 'm4a', 'wav', 'ogg', 'aac', 'flac']
};
const MIME = {
  pdf: 'application/pdf', ppt: 'application/vnd.ms-powerpoint', pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  pps: 'application/vnd.ms-powerpoint', ppsx: 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
  odp: 'application/vnd.oasis.opendocument.presentation', doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', odt: 'application/vnd.oasis.opendocument.text',
  rtf: 'application/rtf', txt: 'text/plain', md: 'text/markdown', csv: 'text/csv', xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', ods: 'application/vnd.oasis.opendocument.spreadsheet',
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', heic: 'image/heic',
  bmp: 'image/bmp', svg: 'image/svg+xml', mp4: 'video/mp4', mov: 'video/quicktime', m4v: 'video/x-m4v', webm: 'video/webm',
  avi: 'video/x-msvideo', mkv: 'video/x-matroska', mp3: 'audio/mpeg', m4a: 'audio/mp4', wav: 'audio/wav', ogg: 'audio/ogg',
  aac: 'audio/aac', flac: 'audio/flac', key: 'application/octet-stream'
};
const kindOf = ext => Object.keys(KINDS).find(k => KINDS[k].includes(ext)) || null;

const dir = () => app.getPath('userData');
const CLIENT_FILE = () => path.join(dir(), 'drive-oauth-client.json');
const TOKEN_FILE = () => path.join(dir(), 'drive-token.bin');

/* the libraries are loaded on first use: most PCs (every student's) never need them */
let lib = null;
function libs(){
  if (!lib) lib = { OAuth2Client: require('google-auth-library').OAuth2Client, drive: require('@googleapis/drive').drive };
  return lib;
}

function readClient(){
  try {
    const j = JSON.parse(fs.readFileSync(CLIENT_FILE(), 'utf8'));
    const c = j.installed || j.web || j;
    return c.client_id ? { id: c.client_id, secret: c.client_secret || undefined } : null;
  } catch (_){ return null; }
}
function readToken(){
  try {
    const buf = fs.readFileSync(TOKEN_FILE());
    return JSON.parse(safeStorage.decryptString(buf));
  } catch (_){ return null; }
}
function writeToken(t){
  if (!safeStorage.isEncryptionAvailable()) throw new Error('Windows could not protect the Drive sign-in on this PC.');
  fs.mkdirSync(dir(), { recursive: true });
  fs.writeFileSync(TOKEN_FILE(), safeStorage.encryptString(JSON.stringify(t)));
}

function emailFromIdToken(idToken){
  try { return JSON.parse(Buffer.from(String(idToken).split('.')[1], 'base64url').toString('utf8')).email || null; }
  catch (_){ return null; }
}

function status(){
  const t = readToken();
  return { connected: !!(t && t.tokens && t.tokens.refresh_token && readClient()), email: t ? t.email || null : null, hasClient: !!readClient() };
}

async function pickClient(win){
  const r = await dialog.showOpenDialog(win, {
    title: 'Choose the Google OAuth client file (Desktop app) you downloaded from Google Cloud',
    filters: [{ name: 'OAuth client', extensions: ['json'] }], properties: ['openFile']
  });
  if (r.canceled || !r.filePaths[0]) return false;
  let j;
  try { j = JSON.parse(fs.readFileSync(r.filePaths[0], 'utf8')); } catch (_){ throw new Error('That file is not a Google OAuth client file (JSON).'); }
  if (!j.installed || !j.installed.client_id) throw new Error('That is not a "Desktop app" OAuth client. In Google Cloud, create an OAuth client ID of type Desktop app and download its JSON.');
  fs.mkdirSync(dir(), { recursive: true });
  fs.writeFileSync(CLIENT_FILE(), JSON.stringify({ installed: j.installed }, null, 2));
  return true;
}

/* one sign-in round in the normal browser, answered on a one-time loopback port */
async function connect(win){
  if (!readClient() && !(await pickClient(win))) return { error: 'Cancelled — no client file chosen.' };
  const c = readClient();
  const { OAuth2Client } = libs();
  const state = crypto.randomBytes(16).toString('hex');

  const server = http.createServer();
  await new Promise((res, rej) => { server.once('error', rej); server.listen(0, '127.0.0.1', res); });
  const redirect = 'http://127.0.0.1:' + server.address().port;
  const client = new OAuth2Client({ clientId: c.id, clientSecret: c.secret, redirectUri: redirect });
  const pkce = await client.generateCodeVerifierAsync();

  const code = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Google sign-in was not finished within 5 minutes.')), 5 * 60 * 1000);
    server.on('request', (req, res) => {
      const u = new URL(req.url, redirect);
      if (u.pathname !== '/'){ res.writeHead(404); res.end(); return; }
      const ok = u.searchParams.get('state') === state && u.searchParams.get('code');
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end('<!doctype html><meta charset="utf-8"><title>French Grammar</title><body style="font:16px system-ui;padding:40px;color:#0f172a">' +
        (ok ? '<h2 style="color:#002395">Google Drive is connected.</h2><p>You can close this tab and go back to French Grammar.</p>'
            : '<h2 style="color:#dc2626">Sign-in did not complete.</h2><p>Close this tab and press Connect Google Drive again.</p>'));
      clearTimeout(timer);
      if (ok) resolve(u.searchParams.get('code'));
      else reject(new Error(u.searchParams.get('error') === 'access_denied' ? 'Google sign-in was cancelled.' : 'Google sign-in did not complete.'));
    });
  });

  try {
    await shell.openExternal(client.generateAuthUrl({
      access_type: 'offline', prompt: 'consent', scope: SCOPES, state,
      code_challenge_method: 'S256', code_challenge: pkce.codeChallenge
    }));
    const { tokens } = await client.getToken({ code: await code, codeVerifier: pkce.codeVerifier, redirect_uri: redirect });
    if (!tokens.refresh_token) throw new Error('Google did not grant lasting access. Press Connect Google Drive again.');
    /* keep the folder this PC already used, so reconnecting does not make a second one */
    const before = readToken();
    writeToken({ tokens, email: emailFromIdToken(tokens.id_token), folderId: (before && before.folderId) || null });
    return status();
  } catch (e){
    /* a client file Google no longer accepts is thrown away, so the next Connect can
       ask for the right one instead of failing the same way for ever */
    if (/invalid_client|unauthorized_client|deleted_client/i.test(String(e && e.message || ''))){
      forget(true);
      return { error: 'Google refused that OAuth client. It has been removed — press Connect Google Drive and choose the client file again.' };
    }
    return { error: e.message };
  } finally {
    server.close();
  }
}

function disconnect(){
  const t = readToken();
  forget(false);
  if (t && t.tokens && t.tokens.refresh_token){
    /* also withdraw the grant at Google; best effort, the local copy is already gone */
    fetch('https://oauth2.googleapis.com/revoke?token=' + encodeURIComponent(t.tokens.refresh_token), { method: 'POST' }).catch(() => {});
  }
  return status();
}

async function driveClient(){
  const c = readClient(), saved = readToken();
  if (!c || !saved || !saved.tokens) throw new Error('Google Drive is not connected on this PC.');
  const { OAuth2Client, drive } = libs();
  const auth = new OAuth2Client({ clientId: c.id, clientSecret: c.secret });
  auth.setCredentials(saved.tokens);
  const epoch = forgotten;
  auth.on('tokens', t => {
    try {
      if (epoch !== forgotten) return;            // disconnected meanwhile: stay disconnected
      const s = readToken();
      if (!s) return;                             // the file is gone; never write it back
      s.tokens = Object.assign({}, s.tokens, t);
      writeToken(s);
    } catch (_){}
  });
  return { api: drive({ version: 'v3', auth }), saved, epoch };
}

/* note the folder on the stored sign-in, and only if there still is one */
function remember(folderId){
  try { const s = readToken(); if (!s) return; s.folderId = folderId; writeToken(s); } catch (_){}
}

async function folder(api, saved){
  if (saved.folderId){
    try {
      const f = await api.files.get({ fileId: saved.folderId, fields: 'id,trashed' });
      if (!f.data.trashed) return saved.folderId;
    } catch (_){}
  }
  /* look for the folder this app made before creating another one: reconnecting Drive
     forgets the id, and a second folder of the same name helps nobody. drive.file only
     ever shows this app's own files, so this cannot find anything else */
  try {
    const found = await api.files.list({
      q: "mimeType = 'application/vnd.google-apps.folder' and name = '" + FOLDER_NAME.replace(/'/g, "\\'") + "' and trashed = false",
      fields: 'files(id)', pageSize: 1, spaces: 'drive'
    });
    if (found.data.files && found.data.files[0]){
      remember(found.data.files[0].id);
      return found.data.files[0].id;
    }
  } catch (_){}
  const f = await api.files.create({ requestBody: { name: FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' }, fields: 'id' });
  remember(f.data.id);
  return f.data.id;
}

/* Google has stopped accepting the stored sign-in (expired, revoked, or the client it
   belongs to was deleted). Throw the local copy away so the calendar says "not
   connected" and Connect can start a fresh sign-in instead of failing for ever. */
function isDeadGrant(e){
  const s = JSON.stringify((e && e.response && e.response.data) || {}) + ' ' + String(e && e.message || '');
  return /invalid_grant|invalid_client|unauthorized_client|deleted_client|invalid_rapt/i.test(s);
}
/* Bumped by forget(). A sign-in that was live when the teacher pressed Disconnect
   still holds an OAuth client whose refresh listener would otherwise write the token
   file back out -- reconnecting the account nobody asked to reconnect. */
let forgotten = 0;
function forget(alsoClient){
  forgotten++;
  try { fs.unlinkSync(TOKEN_FILE()); } catch (_){}
  if (alsoClient){ try { fs.unlinkSync(CLIENT_FILE()); } catch (_){} }
}

/* paths come from preload, resolved from the File objects of a real drop */
async function upload(paths, progress){
  const all = Array.isArray(paths) ? paths : [];
  const list = all.slice(0, MAX_FILES);
  let api, saved;
  try {
    ({ api, saved } = await driveClient());
  } catch (e){
    if (isDeadGrant(e)) forget(/invalid_client|unauthorized_client|deleted_client/i.test(String(e && e.message || '')));
    throw e;
  }
  let parent;
  try {
    parent = await folder(api, saved);
  } catch (e){
    if (isDeadGrant(e)){ forget(false); throw new Error('The Google Drive sign-in on this PC has expired — press Connect Google Drive again.'); }
    throw e;
  }
  const out = [];
  for (let i = 0; i < list.length; i++){
    const p = typeof list[i] === 'string' ? list[i] : '';
    const name = path.basename(p || '');
    const ext = path.extname(name).slice(1).toLowerCase();
    try {
      if (!p || !path.isAbsolute(p)) throw new Error('not a file from this PC');
      const st = fs.statSync(p);
      if (!st.isFile()) throw new Error('folders cannot be uploaded — drop the files inside it');
      const kind = kindOf(ext);
      if (!kind) throw new Error('.' + (ext || '?') + ' files are not accepted');
      if (st.size > MAX_BYTES) throw new Error('larger than ' + (MAX_BYTES / 1048576) + ' MB');

      let sent = 0, lastPct = -1;
      const body = fs.createReadStream(p);
      body.on('data', chunk => {
        sent += chunk.length;
        const pct = Math.floor(sent * 100 / Math.max(1, st.size));
        if (pct !== lastPct && pct % 5 === 0){ lastPct = pct; progress({ index: i, phase: 'uploading', percent: pct }); }
      });
      progress({ index: i, phase: 'uploading', percent: 0 });
      const f = await api.files.create({
        requestBody: { name, parents: [parent] },
        media: { mimeType: MIME[ext] || 'application/octet-stream', body },
        fields: 'id,name,webViewLink'
      });
      progress({ index: i, phase: 'sharing' });
      await api.permissions.create({ fileId: f.data.id, requestBody: { role: 'reader', type: 'anyone' } });
      out.push({ ok: true, name, title: name.replace(/\.[^.]+$/, ''), type: kind,
                 url: f.data.webViewLink || ('https://drive.google.com/file/d/' + f.data.id + '/view') });
    } catch (e){
      if (isDeadGrant(e)) forget(false);
      const msg = isDeadGrant(e)
        ? 'the Google Drive sign-in on this PC has expired — press Connect Google Drive again'
        : (e && e.response && e.response.data && e.response.data.error && e.response.data.error.message) || e.message;
      out.push({ ok: false, name, error: msg });
    }
  }
  /* anything past the limit is reported, never left silently "waiting" */
  for (let i = list.length; i < all.length; i++){
    out.push({ ok: false, name: path.basename(String(all[i] || '')), error: 'only ' + MAX_FILES + ' files at a time — drop the rest after these' });
  }
  return out;
}

module.exports = { status, connect, disconnect, upload };
