const { app, BrowserWindow, Menu, Notification, ipcMain } = require("electron");
const path = require('path')

app.on("ready", () => {
    let win = new BrowserWindow({
        width: 600,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'src/preload.js')
        }
        // frame:false
    });
    win.setResizable(false);

    ipcMain.on("notification", (event, title, body) => {
        new Notification({ title: title, body: body }).show()
    });

    win.loadURL("///src/index.html");
});