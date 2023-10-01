const { app, BrowserWindow, Menu, Notification, ipcMain, Tray, nativeImage } = require("electron");
const path = require('path');
const { shell } = require('electron');
const AutoLaunch = require('auto-launch');

let tray;

app.on("ready", () => {

    let autoLaunch = new AutoLaunch({
        name: 'TODO Master',
        path: app.getPath('exe'),
    });
    autoLaunch.isEnabled().then((isEnabled) => {
        if (!isEnabled) autoLaunch.enable();
    });

    let win = new BrowserWindow({
        width: 300,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'src/preload.js')
        },
        frame: false,
    });
    win.setResizable(false);

    // win.webContents.openDevTools();

    ipcMain.on("app:notification", (event, title, body) => {
        const notification = new Notification({ title: title, body: body });
        notification.on("click", () => {
            console.log("clicked");
        });
        notification.show();
    });

    ipcMain.on("app:quit", (event) => {
        win.hide();
        // app.quit();
    });

    ipcMain.on("app:minimize", (event) => {
        win.minimize();
    });

    win.loadURL("///src/index.html");

    const icon = nativeImage.createFromPath('app.ico');
    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: '關於', click: async () => {
                await shell.openExternal('https://electronjs.org');
            }
        },
        { type: 'separator' },
        { label: '首頁' },
        { label: '任務' },
        { label: '設定', },
        { type: 'separator' },
        { role: 'quit', label: '離開' }
    ]);

    tray.setToolTip('TODO Master');
    tray.on("click", (e) => {
        win.show();
    });
    tray.setContextMenu(contextMenu);
});