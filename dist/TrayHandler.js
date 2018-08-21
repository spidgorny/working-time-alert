"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const electron_1 = require("electron");
const path = require("path");
const AutoLaunch = require('auto-launch');
const ws = require('windows-shortcuts-appid');
class TrayHandler {
    constructor(app, window, store, favicon, faviconIco) {
        this.appId = "eu.nintendo.working-time-alert";
        this.appName = 'Working Time Alert 2.0';
        this.appSlogan = "Never miss the time to go home";
        this.app = app;
        this.window = window;
        this.store = store;
        this.autoLauncher = new AutoLaunch({
            name: this.appName,
        });
        this.favicon = favicon;
        this.faviconIco = faviconIco;
        this.handleTray();
    }
    async handleTray() {
        const appIcon = new electron_1.Tray(this.favicon);
        const autoStart = await this.autoLauncher.isEnabled();
        const contextMenu = electron_1.Menu.buildFromTemplate([
            {
                label: 'Toggle Window',
                click: this.toggleWindow.bind(this)
            },
            {
                label: 'Autostart with Windows',
                click: this.toggleAutostart.bind(this),
                type: 'checkbox',
                checked: autoStart,
            },
            /*
                        {
                            label: 'Start visible',
                            type: 'checkbox',
                            checked: this.store.get('startVisible'),
                            click: (e) => {
                                // console.log(e);
                                this.store.set('startVisible', e.checked);
                            }
                        },
            */
            {
                label: 'Create Programs Shortcut',
                click: this.createProgramsShortcut.bind(this),
                enabled: !this.hasShortcut(),
            },
            {
                label: 'Quit',
                click: this.quit.bind(this)
            },
        ]);
        appIcon.setToolTip(this.appName);
        appIcon.setContextMenu(contextMenu);
        appIcon.on('click', this.toggleWindow.bind(this));
        return appIcon;
    }
    toggleWindow() {
        this.window.isVisible()
            ? this.window.hide()
            : this.window.show();
    }
    async toggleAutostart() {
        const enabled = await this.autoLauncher.isEnabled();
        if (enabled) {
            this.autoLauncher.disable();
        }
        else {
            this.autoLauncher.enable();
        }
    }
    hasShortcut() {
        const shortcutPath = process.env.APPDATA + "\\Microsoft\\Windows\\Start Menu\\Programs\\" + this.appName + ".lnk";
        // console.log(shortcutPath);
        return fs.existsSync(shortcutPath);
    }
    createProgramsShortcut() {
        this.app.setAppUserModelId(this.appId);
        const shortcutPath = process.env.APPDATA + "\\Microsoft\\Windows\\Start Menu\\Programs\\" + this.appName + ".lnk";
        // console.log(shortcutPath);
        fs.exists(shortcutPath, (exists) => {
            if (exists) {
                // The shortcut already exists, no need to do anything
                return;
            }
            // Create the shortcut
            let properties = {
                target: process.execPath,
                args: path.resolve(__dirname + '/../..'),
                workingDir: path.resolve(__dirname + '/../..'),
                icon: this.faviconIco,
                desc: this.appSlogan,
            };
            console.log(properties);
            ws.create(shortcutPath, properties, (err) => {
                if (err)
                    throw err;
                // Add the app ID to the shortcut
                ws.addAppId(shortcutPath, this.appId, (err) => {
                    if (err)
                        throw err;
                    // Ready!
                });
            });
        });
    }
    quit() {
        this.app.quit();
        process.exit();
    }
}
exports.TrayHandler = TrayHandler;
//# sourceMappingURL=TrayHandler.js.map