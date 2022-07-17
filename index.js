const { app, BrowserWindow, Menu } = require("electron");

app.on("ready", () => {
    let win = new BrowserWindow({
        width: 600,
        height: 600,
        // frame:false
    });
    win.setResizable(false);
    win.loadURL("///src/index.html")
});