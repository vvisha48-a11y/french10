// The bridge between the page and the computer -- the only one. The page has no
// Node.js and no Electron; it gets exactly the functions below, as window.desktop,
// and only when it is the website's own page (never a sign-in popup or anything else).
//
// It also layers the desktop's additions onto the page at DOMContentLoaded (the
// website's own scripts have run by then): styles, then the plain scripts in order,
// then the calendar module. They are served from src/inject/ under the website's
// address, so they run as the page itself.
const { contextBridge, ipcRenderer, webUtils } = require('electron');

const SITE = 'https://vvisha48-a11y.github.io';
const BASE = '/french10/';

if (location.origin === SITE && location.pathname.startsWith(BASE)){
  contextBridge.exposeInMainWorld('desktop', {
    version: () => ipcRenderer.invoke('desktop:version'),
    /* job: 'topic' | 'book'. Resolves once the native print or PDF is done or cancelled. */
    print: (job, title) => ipcRenderer.invoke('desktop:print', { job: String(job), title: String(title || '') }),
    /* the complete workbook, one topic at a time; the folder is main's, not the page's */
    printPart: (index, title) => ipcRenderer.invoke('desktop:print-part', { index: Number(index) | 0, title: String(title || '') }),
    printDone: () => ipcRenderer.invoke('desktop:print-done'),
    /* opens in the normal browser; main refuses anything but Google Drive / Docs */
    openDocument: url => ipcRenderer.invoke('desktop:open-document', String(url)),
    onCommand: cb => { ipcRenderer.on('desktop:command', (_e, name) => cb(String(name))); },
    drive: {
      status: () => ipcRenderer.invoke('drive:status'),
      connect: () => ipcRenderer.invoke('drive:connect'),
      disconnect: () => ipcRenderer.invoke('drive:disconnect'),
      /* Takes the File objects of a real drop and resolves their paths HERE. The page
         can never hand over a path of its own choosing: a File it constructs itself
         has no path, and is skipped. */
      upload: files => {
        const list = Array.isArray(files) ? files : Array.prototype.slice.call(files || []);
        const paths = list.map(f => { try { return webUtils.getPathForFile(f); } catch (_){ return ''; } });
        return ipcRenderer.invoke('drive:upload', paths);
      },
      onProgress: cb => {
        const h = (_e, p) => cb(p);
        ipcRenderer.on('drive:progress', h);
        return () => ipcRenderer.removeListener('drive:progress', h);
      }
    }
  });

  window.addEventListener('DOMContentLoaded', () => {
    const at = BASE + '__desktop/';
    for (const f of ['ui-overrides.css', 'print-landscape.css', 'search.css', 'calendar.css']){
      const l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = at + f; l.dataset.desktop = '1';
      document.head.appendChild(l);
    }
    for (const f of ['ui-overrides.js', 'print-bridge.js', 'photo-preload.js', 'search.js']){
      const s = document.createElement('script');
      s.src = at + f; s.async = false; s.dataset.desktop = '1';
      document.body.appendChild(s);
    }
    const m = document.createElement('script');
    m.type = 'module'; m.src = at + 'calendar.js'; m.dataset.desktop = '1';
    document.body.appendChild(m);
  });
}
