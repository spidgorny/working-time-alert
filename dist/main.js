"use strict";
exports.__esModule = true;
// Modules to control application life and create native browser window
var EventTypes_1 = require("./src/EventTypes");
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 1024, height: 768 });
    // and load the index.html of the app.
    mainWindow.loadFile('index.html');
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
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
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
app.on('ready', function () {
    var powerMonitor = require('electron').powerMonitor;
    powerMonitor.on(EventTypes_1.EventTypes.SUSPEND, function () {
        console.log('The system is going to sleep');
        mainWindow.webContents.send('PowerEvent', {
            type: EventTypes_1.EventTypes.SUSPEND
        });
    });
    powerMonitor.on(EventTypes_1.EventTypes.RESUME, function () {
        console.log('The system has to wake-up');
        mainWindow.webContents.send('PowerEvent', {
            type: EventTypes_1.EventTypes.RESUME
        });
    });
    powerMonitor.on(EventTypes_1.EventTypes.SHUTDOWN, function () {
        console.log('The system is going to shutdown');
        mainWindow.webContents.send('PowerEvent', {
            type: EventTypes_1.EventTypes.SHUTDOWN
        });
    });
});
//# sourceMappingURL=main.js.map