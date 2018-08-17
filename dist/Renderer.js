"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
var PowerEvent_1 = require("./PowerEvent");
var _a = require('electron'), ipcRenderer = _a.ipcRenderer, Event = _a.Event;
var Store = require('electron-store');
var hyperHTML = require('hyperhtml');
var Renderer = /** @class */ (function () {
    function Renderer() {
        this.events = [];
        this.store = new Store();
        this.events = this.store.get('events') || [];
        // need to deserialize
        for (var _i = 0, _a = this.events; _i < _a.length; _i++) {
            var e = _a[_i];
            if ('string' == typeof e.timestamp) {
                e.timestamp = new Date(e.timestamp);
            }
        }
        ipcRenderer.on('PowerEvent', this.onPowerEvent.bind(this));
        setTimeout(this.render.bind(this), 1);
    }
    Renderer.prototype.onPowerEvent = function (event, data) {
        this.events.push(new PowerEvent_1.PowerEvent(data.type));
        console.log(this.events);
        this.store.set('events', this.events);
        this.render();
    };
    Renderer.prototype.render = function () {
        var html = hyperHTML.hyper(document.getElementById('table'));
        html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n<table class=\"table\">\n<tr>\n<th>\nTimestamp\n</th>\n<th>\nEvent\n</th>\n</tr>\n\t\t", "\n</table>\n\t\t"], ["\n<table class=\"table\">\n<tr>\n<th>\nTimestamp\n</th>\n<th>\nEvent\n</th>\n</tr>\n\t\t",
            "\n</table>\n\t\t"])), this.events.map(function (pe) {
            return "\n\t\t\t\t<tr>\n\t\t\t\t<td>" + pe.timestamp.getHours() + ":" + pe.timestamp.getMinutes() + "</td>\n\t\t\t\t<td>" + pe.eventType + "</td>\n\t\t\t\t</tr> \n\t\t\t\t";
        }));
    };
    return Renderer;
}());
exports.Renderer = Renderer;
var templateObject_1;
/*
"[{"timestamp":"2018-08-17T08:31:57.859Z","eventType":"suspend"},{"timestamp":"2018-08-17T08:32:16.455Z","eventType":"resume"}]"

*/
//# sourceMappingURL=Renderer.js.map