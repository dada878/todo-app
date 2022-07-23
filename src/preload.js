const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    notification: (title, body) => ipcRenderer.send('app:notification', title, body),
    quitApp: () => ipcRenderer.send('app:quit'),
    minimizeApp: () => ipcRenderer.send('app:minimize'),
})