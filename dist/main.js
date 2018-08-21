"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Modules to control application life and create native browser window
const EventTypes_1 = require("./src/EventTypes");
const TrayHandler_1 = require("./src/TrayHandler");
const { app, BrowserWindow } = require('electron');
const path = require('path');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let favicon = path.resolve(__dirname + '/../public/thumb_14790852260Close_Lid.png');
favicon = favicon.replace('%USERPROFILE%', require('os').homedir());
// console.log(favicon);
let faviconIco = path.resolve(__dirname + '/../public/favicon.ico');
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        useContentSize: true,
        autoHideMenuBar: true,
        icon: favicon,
        show: false,
    });
    // and load the index.html of the app.
    mainWindow.loadFile('index.html');
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
    mainWindow.on('close', (e) => {
        e.preventDefault();
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        //this.mainWindow = null;
        //this.quit();
        mainWindow.hide();
    });
    // Emitted when the window is closed.
    mainWindow.on('closed', (e) => {
        e.preventDefault();
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        // commented because we only minimize the window
        //mainWindow = null;
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
app.on('before-quit', (e) => {
    // Handle menu-item or keyboard shortcut quit here
    e.preventDefault();
    mainWindow.hide();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
app.on('ready', () => {
    const { powerMonitor } = require('electron');
    // if the computer is just booted
    // so the app will be started from autostart
    // we need the boot event as well
    mainWindow.webContents.send('PowerEvent', {
        type: EventTypes_1.EventTypes.START,
    });
    powerMonitor.on(EventTypes_1.EventTypes.SUSPEND, () => {
        console.log('The system is going to sleep');
        mainWindow.webContents.send('PowerEvent', {
            type: EventTypes_1.EventTypes.SUSPEND,
        });
    });
    powerMonitor.on(EventTypes_1.EventTypes.RESUME, () => {
        console.log('The system has to wake-up');
        mainWindow.webContents.send('PowerEvent', {
            type: EventTypes_1.EventTypes.RESUME,
        });
    });
    powerMonitor.on(EventTypes_1.EventTypes.SHUTDOWN, () => {
        console.log('The system is going to shutdown');
        mainWindow.webContents.send('PowerEvent', {
            type: EventTypes_1.EventTypes.SHUTDOWN,
        });
    });
});
app.on('ready', () => {
    const Store = require('electron-store');
    new TrayHandler_1.TrayHandler(app, mainWindow, new Store(), favicon, faviconIco);
});
//# sourceMappingURL=main.js.map