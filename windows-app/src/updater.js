// Updates: a silent check on launch; a card at the top right of the screen when a new
// version exists.
//
// Electron's own notifications cannot be positioned (Windows always puts them bottom
// right), so the card is a small frameless window of our own, shown with
// showInactive(): it appears without taking the keyboard away from the lesson.
// Nothing downloads until the teacher or student presses "Download and restart".
// Offline, or on any error, the check says nothing at all.
//
// Releases come from GitHub (package.json > build > publish); the repository is
// public, so reading them needs no token.
const { app, BrowserWindow, ipcMain, screen, net } = require('electron');
const path = require('path');

const CARD = { width: 380, height: 164, margin: 16 };
let card = null, pending = null, dismissed = false;

function showCard(state){
  pending = state;
  if (card && !card.isDestroyed()){ card.webContents.send('notify:state', state); return; }
  /* put away by hand: the download carries on quietly, and only the last word --
     "installing, the app will restart" -- is worth showing again */
  if (dismissed && state.phase !== 'ready') return;
  dismissed = false;
  const area = screen.getPrimaryDisplay().workArea;
  card = new BrowserWindow({
    width: CARD.width, height: CARD.height,
    x: area.x + area.width - CARD.width - CARD.margin, y: area.y + CARD.margin,
    frame: false, resizable: false, movable: false, minimizable: false, maximizable: false, fullscreenable: false,
    alwaysOnTop: true, skipTaskbar: true, show: false, transparent: true, hasShadow: false,
    webPreferences: { preload: path.join(__dirname, 'notify-preload.js'), contextIsolation: true, sandbox: true }
  });
  card.setAlwaysOnTop(true, 'screen-saver');
  card.loadFile(path.join(__dirname, 'notify.html'));
  card.webContents.on('did-finish-load', () => {
    card.webContents.send('notify:state', pending);
    /* shown once the card has measured itself (notify:fit); this is only the fallback */
    setTimeout(() => { if (card && !card.isDestroyed() && !card.isVisible()) card.showInactive(); }, 800);
  });
  card.on('closed', () => { card = null; });
}
function closeCard(){ dismissed = true; if (card && !card.isDestroyed()) card.close(); }

/* the card reports its content height; the window follows, its top-right corner fixed */
ipcMain.on('notify:fit', (e, height) => {
  if (!card || card.isDestroyed() || e.sender !== card.webContents) return;
  const h = Math.min(360, Math.max(120, height | 0));
  if (card.getSize()[1] !== h) card.setSize(CARD.width, h);
  if (!card.isVisible()) card.showInactive();
});

/* --preview-update-card: shows the card with a pretend version and a pretend
   download, so its look can be checked without publishing anything */
function preview(){
  showCard({ phase: 'available', version: '9.9.9', current: app.getVersion() });
  ipcMain.on('notify:choice', (_e, choice) => {
    if (choice !== 'download'){ closeCard(); return; }
    let p = 0;
    const t = setInterval(() => {
      p = Math.min(100, p + 12);
      showCard({ phase: p < 100 ? 'downloading' : 'ready', version: '9.9.9', percent: p });
      if (p === 100){ clearInterval(t); setTimeout(closeCard, 2500); }
    }, 350);
  });
}

function start({ previewCard }){
  if (previewCard) return preview();
  if (!app.isPackaged) return;                     // npm start: nothing to update

  const { autoUpdater } = require('electron-updater');
  autoUpdater.autoDownload = false;                // ask first
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.logger = null;

  autoUpdater.on('update-available', info => showCard({ phase: 'available', version: info.version, current: app.getVersion() }));
  autoUpdater.on('download-progress', p => showCard({ phase: 'downloading', version: pending && pending.version, percent: Math.round(p.percent) }));
  autoUpdater.on('update-downloaded', info => {
    showCard({ phase: 'ready', version: info.version });
    setTimeout(() => autoUpdater.quitAndInstall(true, true), 1200);
  });
  autoUpdater.on('error', () => {
    if (pending && pending.phase === 'downloading') showCard({ phase: 'error', version: pending.version });
  });

  ipcMain.on('notify:choice', (_e, choice) => {
    if (choice === 'download'){
      showCard({ phase: 'downloading', version: pending && pending.version, percent: 0 });
      autoUpdater.downloadUpdate().catch(() => showCard({ phase: 'error', version: pending && pending.version }));
    } else closeCard();
  });

  setTimeout(() => {
    if (!net.isOnline()) return;
    autoUpdater.checkForUpdates().catch(() => {});
  }, 6000);
}

module.exports = { start };
