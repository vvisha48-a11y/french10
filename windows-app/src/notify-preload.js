// The update card's only bridge: receive its state, send one choice back, and ask for
// the window to be as tall as the card's content.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('card', {
  onState: cb => ipcRenderer.on('notify:state', (_e, s) => cb(s)),
  choose: choice => ipcRenderer.send('notify:choice', choice === 'download' ? 'download' : 'later'),
  fit: height => ipcRenderer.send('notify:fit', Math.round(Number(height) || 0))
});
