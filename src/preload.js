const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    notification: (title, body) => ipcRenderer.send('notification', title, body)
})