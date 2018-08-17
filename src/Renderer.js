"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PowerEvent_1 = require("./PowerEvent");
var ipcRenderer = require('electron').ipcRenderer;
var Renderer = /** @class */ (function () {
    function Renderer() {
        this.events = [];
        ipcRenderer.on('PowerEvent', this.onPowerEvent.bind(this));
    }
    Renderer.prototype.onPowerEvent = function (event, data) {
        this.events.push(new PowerEvent_1.PowerEvent(data.type));
        console.log(this.events);
    };
    return Renderer;
}());
exports.Renderer = Renderer;
