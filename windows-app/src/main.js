// French Grammar for Windows -- the main process.
//
// One window showing the website at its own address, with every file served from
// this app (serve-local.js). The page gets no Node.js and no Electron; preload.js
// hands it a short list of actions, and each one is checked here again.
//
// Switches, for a shortcut's Target field or the command line:
//   --safe-graphics         turn GPU acceleration off (for a PC whose graphics driver misdraws)
//   --offline-test          behave as if the internet were down, without unplugging anything
//   --preview-update-card   show the top-right update card with a pretend version
//   --pdf-to=<file.pdf>     testing: a print button saves straight to that PDF, no dialogs
const { app, BrowserWindow, session, shell, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const serve = require('./serve-local');
const updater = require('./updater');
const drive = require('./drive');

const flag = f => process.argv.includes(f);
const SAFE_GRAPHICS = flag('--safe-graphics');
const OFFLINE_TEST = flag('--offline-test');
const PREVIEW_CARD = flag('--preview-update-card');
const PDF_TO = (process.argv.find(a => a.startsWith('--pdf-to=')) || '').slice(9) || null;

const CONTENT = app.isPackaged ? path.join(process.resourcesPath, 'content') : path.join(__dirname, '..', 'content');
const INJECT = path.join(__dirname, 'inject');
const PARTITION = 'persist:french10';
const ALLOWED_PERMISSIONS = ['fullscreen', 'clipboard-sanitized-write'];
/* A4 landscape at the 6mm margin print-landscape.css is measured against (inches) */
const MM6 = 6 / 25.4;
const PDF_OPTIONS = { landscape: true, printBackground: true, pageSize: 'A4', margins: { top: MM6, bottom: MM6, left: MM6, right: MM6 } };

/* Zero lag: rasterise on the GPU and skip a copy on the way to the screen. */
if (SAFE_GRAPHICS) app.disableHardwareAcceleration();
else {
  app.commandLine.appendSwitch('enable-gpu-rasterization');
  app.commandLine.appendSwitch('enable-zero-copy');
}
app.setAppUserModelId('io.github.vvisha48.french10');

let win = null;
let bookFolder = null;          // where "Print complete workbook" is saving, while it saves
let partRunning = false;        // one topic of that workbook is being rendered right now

if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', () => {
    if (!win || win.isDestroyed()) return;
    if (win.isMinimized()) win.restore();
    win.focus();
  });
  app.whenReady().then(boot);
  app.on('window-all-closed', () => app.quit());
}

function readManifest(){
  try { return JSON.parse(fs.readFileSync(path.join(CONTENT, 'manifest.json'), 'utf8')); }
  catch (_){ return null; }
}

/* only the website's own page may use the bridge */
function fromSite(e){
  try {
    const u = new URL(e.senderFrame.url);
    return u.origin === serve.SITE && u.pathname.startsWith(serve.BASE);
  } catch (_){ return false; }
}
function handle(channel, fn){
  ipcMain.handle(channel, (e, ...args) => {
    if (!fromSite(e)) throw new Error('refused');
    return fn(e, ...args);
  });
}

function openExternalSafe(url){
  try {
    const u = new URL(url);
    if (['https:', 'http:', 'mailto:'].includes(u.protocol)) shell.openExternal(u.toString());
  } catch (_){}
}

/* Firebase's Google sign-in opens its own popup; it runs inside the app, in this
   window's session, so the signed-in state comes back to the page */
function isSignInPopup(url){
  if (!url || url === 'about:blank') return true;
  try {
    const u = new URL(url);
    return (u.hostname === 'frenchgrammar-84e33.firebaseapp.com' && u.pathname.startsWith('/__/auth/')) ||
           u.hostname === 'accounts.google.com';
  } catch (_){ return false; }
}

function boot(){
  const manifest = readManifest();
  if (!manifest){
    dialog.showErrorBox('French Grammar', 'The lessons are missing from this copy of the app.\n\nDevelopers: run  npm run sync  in windows-app first.');
    app.quit();
    return;
  }

  const ses = session.fromPartition(PARTITION);
  serve.install(ses, { contentDir: CONTENT, injectDir: INJECT, sdkVersion: manifest.sdk.version, offlineTest: OFFLINE_TEST });
  ses.setPermissionRequestHandler((_wc, permission, cb) => cb(ALLOWED_PERMISSIONS.includes(permission)));
  ses.setPermissionCheckHandler((_wc, permission) => ALLOWED_PERMISSIONS.includes(permission));

  app.on('web-contents-created', (_e, contents) => {
    contents.on('will-attach-webview', ev => ev.preventDefault());
  });

  win = new BrowserWindow({
    width: 1440, height: 900, minWidth: 900, minHeight: 600,
    /* white, not the classic theme's light blue: Chromium paints the window's base
       colour into a PDF's page margins (measured: a 6mm #eef4fc frame on every sheet) */
    show: false, title: 'French Grammar', backgroundColor: '#ffffff', autoHideMenuBar: true,
    icon: app.isPackaged ? undefined : path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: {
      partition: PARTITION,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, sandbox: true, nodeIntegration: false, spellcheck: false
    }
  });
  /* maximize only once the page can be shown: on a hidden window it shows it at once,
     which is the white flash show:false is there to avoid */
  win.once('ready-to-show', () => { win.maximize(); win.show(); });
  /* the lessons are the app: when their window goes, the app goes -- otherwise an open
     update card keeps the process alive and the next launch talks to a dead window */
  win.on('closed', () => { win = null; app.quit(); });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isSignInPopup(url)) return {
      action: 'allow',
      overrideBrowserWindowOptions: { width: 520, height: 700, autoHideMenuBar: true, parent: win,
                                      webPreferences: { partition: PARTITION, contextIsolation: true, sandbox: true } }
    };
    openExternalSafe(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (url.startsWith(serve.SITE + serve.BASE)) return;
    e.preventDefault();
    openExternalSafe(url);             // a dropped file (file://) is simply ignored
  });

  /* The sign-in popup gets the same guards, and only it -- attached to the child
     itself, so the main window can never pick them up twice. It may walk Google's own
     sign-in pages and come back to Firebase, and nothing else: the window holding the
     teacher's Google cookies must not end up on some other website.
     Both events are needed -- will-navigate does not fire for a redirect the SERVER
     sends, which is exactly what a sign-in flow is made of. */
  win.webContents.on('did-create-window', (child) => {
    const guard = (e, url) => {
      if (isSignInPopup(url)) return;
      e.preventDefault();
      openExternalSafe(url);
    };
    child.webContents.on('will-navigate', guard);
    child.webContents.on('will-redirect', guard);
    child.webContents.setWindowOpenHandler(({ url }) => { openExternalSafe(url); return { action: 'deny' }; });
  });

  /* a crashed page comes back by itself, but never in a loop */
  let lastRecovery = 0;
  win.webContents.on('render-process-gone', (_e, d) => {
    if (d.reason === 'clean-exit' || Date.now() - lastRecovery < 15000) return;
    lastRecovery = Date.now();
    win.webContents.reload();
  });

  registerIpc(manifest);
  buildMenu(manifest);
  win.loadURL(serve.START_URL);
  updater.start({ previewCard: PREVIEW_CARD });
}

function registerIpc(manifest){
  handle('desktop:version', () => ({ app: app.getVersion(), content: manifest.syncedAt, sdk: manifest.sdk.version }));

  handle('desktop:print', async (_e, req) => {
    const job = req && req.job === 'book' ? 'book' : 'topic';
    const title = String((req && req.title) || 'French Grammar').replace(/[\\/:*?"<>|]+/g, ' ').trim().slice(0, 120) || 'French Grammar';

    /* The complete workbook cannot be one print job: 950 slides is more than Windows
       will take -- measured, both ways (printToPDF: "Failed to generate PDF"; a real
       printer: "Print job canceled" after 158s). It is saved as one PDF per topic
       instead, in the same A4-landscape layout, ready to print. */
    if (job === 'book'){
      if (PDF_TO){ bookFolder = path.dirname(PDF_TO); return { parts: true, folder: bookFolder }; }
      const ask = await dialog.showMessageBox(win, {
        type: 'none', title: 'Save the complete workbook', noLink: true,
        message: 'Save the complete workbook',
        detail: 'All 950 slides are too many for one print job — Windows refuses a job that size.\n\n' +
                'The workbook can be saved instead as one PDF per topic, in the same A4 landscape layout, ' +
                'one slide per page, into a folder you choose. Print whichever topics you need from there.',
        buttons: ['Choose a folder…', 'Cancel'], defaultId: 0, cancelId: 1
      });
      if (ask.response !== 0) return {};
      const dir = await dialog.showOpenDialog(win, {
        title: 'Where should the workbook PDFs go?', buttonLabel: 'Save here',
        defaultPath: app.getPath('documents'), properties: ['openDirectory', 'createDirectory']
      });
      if (dir.canceled || !dir.filePaths[0]) return {};
      bookFolder = dir.filePaths[0];
      return { parts: true, folder: bookFolder };
    }

    if (PDF_TO){
      fs.writeFileSync(PDF_TO, await win.webContents.printToPDF(PDF_OPTIONS));
      return { message: '📄 Saved ' + path.basename(PDF_TO) };
    }
    const pick = await dialog.showMessageBox(win, {
      type: 'none', title: 'Print', noLink: true,
      message: job === 'book' ? 'Print the complete workbook' : 'Print this topic',
      detail: 'One slide per A4 landscape page, in colour' + (job === 'book' ? ' — every slide of the deck.' : '.'),
      buttons: ['Print…', 'Save as PDF…', 'Cancel'], defaultId: 0, cancelId: 2
    });
    if (pick.response === 0){
      return new Promise(resolve => {
        win.webContents.print({ silent: false, printBackground: true, landscape: true, pageSize: 'A4', margins: { marginType: 'default' } },
          (ok, reason) => resolve(ok ? { message: '🖨️ Sent to the printer.' }
                                     : (/cancel/i.test(String(reason)) ? {} : { message: 'Printing failed: ' + reason })));
      });
    }
    if (pick.response === 1){
      const r = await dialog.showSaveDialog(win, {
        title: 'Save as PDF', defaultPath: path.join(app.getPath('documents'), title + '.pdf'),
        filters: [{ name: 'PDF', extensions: ['pdf'] }]
      });
      if (r.canceled || !r.filePath) return {};
      fs.writeFileSync(r.filePath, await win.webContents.printToPDF(PDF_OPTIONS));
      shell.showItemInFolder(r.filePath);
      return { message: '📄 Saved ' + path.basename(r.filePath) };
    }
    return {};
  });

  /* One topic of the workbook. The page says WHICH topic and what it is called; the
     folder is the one chosen above and is never taken from the page. */
  handle('desktop:print-part', async (_e, req) => {
    if (!bookFolder) throw new Error('no folder chosen');
    /* one at a time: a second part while one is still rendering would capture the page
       midway through the next topic's isolation and save the wrong slides */
    if (partRunning) throw new Error('the previous topic is still being saved');
    partRunning = true;
    try {
      const n = Math.max(0, Math.min(998, (req && req.index) | 0)) + 1;
      const name = String((req && req.title) || '').replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 90) || 'Topic';
      const file = path.join(bookFolder, String(n).padStart(3, '0') + ' ' + name + '.pdf');
      fs.writeFileSync(file, await win.webContents.printToPDF(PDF_OPTIONS));
      return { file: path.basename(file) };
    } finally { partRunning = false; }
  });
  handle('desktop:print-done', async () => {
    const folder = bookFolder;
    bookFolder = null;
    if (folder) shell.openPath(folder);
    return {};
  });

  handle('desktop:open-document', async (_e, url) => {
    let u;
    try { u = new URL(String(url)); } catch (_){ return { error: 'That link is not valid.' }; }
    if (u.protocol !== 'https:' || !['drive.google.com', 'docs.google.com'].includes(u.hostname))
      return { error: 'Only Google Drive and Google Docs links open from here.' };
    await shell.openExternal(u.toString());
    return {};
  });

  handle('drive:status', () => drive.status());
  handle('drive:connect', () => drive.connect(win));
  handle('drive:disconnect', () => drive.disconnect());
  handle('drive:upload', (e, paths) => drive.upload(paths, p => { if (!e.sender.isDestroyed()) e.sender.send('drive:progress', p); }));
}

function buildMenu(manifest){
  const send = name => () => { if (win) win.webContents.send('desktop:command', name); };
  /* The page owns these shortcuts (it must stop the deck's own single-key handler
     from seeing them), so the menu only shows them: registerAccelerator:false. */
  const shortcut = (label, accelerator, cmd) => ({ label, accelerator, registerAccelerator: false, click: send(cmd) });
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: '&File', submenu: [
      shortcut('Print this topic…', 'CmdOrCtrl+P', 'print-topic'),
      { label: 'Print complete workbook…', click: send('print-book') },
      { type: 'separator' },
      { role: 'quit', label: 'Exit' }
    ] },
    { label: '&View', submenu: [
      shortcut('Search everything', 'CmdOrCtrl+Shift+F', 'search'),
      shortcut('Class materials', 'CmdOrCtrl+Shift+M', 'materials'),
      { type: 'separator' },
      { role: 'reload', label: 'Reload' },
      { type: 'separator' },
      { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
      ...(app.isPackaged ? [] : [{ role: 'toggleDevTools' }])
    ] },
    { label: '&Help', submenu: [
      { label: 'About French Grammar', click: () => dialog.showMessageBox(win, {
        type: 'none', title: 'About French Grammar', noLink: true, buttons: ['OK'],
        message: 'French Grammar ' + app.getVersion(),
        detail: 'CBSE Class 10 French.\nLessons copied from the website on ' + new Date(manifest.syncedAt).toLocaleString('en-GB') +
                '.\nFirebase SDK ' + manifest.sdk.version + ' · Electron ' + process.versions.electron +
                (SAFE_GRAPHICS ? '\nSafe graphics mode is on.' : '')
      }) }
    ] }
  ]));
}
