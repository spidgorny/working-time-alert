"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
var PowerEvent_1 = require("./PowerEvent");
var EventTypes_1 = require("./EventTypes");
var _a = require('electron'), ipcRenderer = _a.ipcRenderer, Event = _a.Event;
var Store = require('electron-store');
var hyperHTML = require('hyperhtml');
var Renderer = /** @class */ (function () {
    function Renderer() {
        this.events = [];
        this.store = new Store();
        this.events = this.parseEvents(this.store.get('events') || []);
        ipcRenderer.on('PowerEvent', this.onPowerEvent.bind(this));
        // because the timer is going on
        setInterval(this.render.bind(this), 1000);
    }
    Renderer.prototype.parseEvents = function (events) {
        // need to deserialize
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var e = events_1[_i];
            // noinspection SuspiciousTypeOfGuard
            if ('string' == typeof e.timestamp) {
                e.timestamp = new Date(e.timestamp);
            }
            e = Object.setPrototypeOf(e, PowerEvent_1.PowerEvent.prototype);
        }
        return events;
    };
    Renderer.prototype.onPowerEvent = function (event, data) {
        this.events.push(new PowerEvent_1.PowerEvent(data.type));
        console.log(this.events);
        this.saveEvents();
        this.render();
    };
    Renderer.prototype.saveEvents = function () {
        this.store.set('events', this.events);
    };
    Renderer.prototype.render = function () {
        var today = this.events.filter(function (pe) {
            return pe.timestamp.toISOString().split('T')[0]
                == new Date().toISOString().split('T')[0];
        });
        var table = this.getInOutTable(today);
        var total = table.reduce(function (total, row) {
            var duration = row.end.timestamp - row.start.timestamp;
            // update original row
            row.duration = duration;
            return total + duration;
        }, 0);
        var prevEnd = null;
        var breaks = table.reduce(function (total, row) {
            if (prevEnd) {
                total += row.start.timestamp - prevEnd;
            }
            prevEnd = row.end.timestamp;
            return total;
        }, 0);
        var remaining = 7.7 * 60 * 60 * 1000 - total + breaks;
        var remainingClass = (remaining > 0)
            ? 'has-text-danger' : 'has-text-success';
        var html = hyperHTML.hyper(document.getElementById('table'));
        html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n<table class=\"table\">\n<thead>\n<tr>\n<th>\nCome\n</th>\n<th>\nLeave\n</th>\n<th>\nDuration\n</th>\n</thead>\n</tr>\n\t\t", "\n</table>\n\n<div class=\"columns is-mobile\">\n  <div class=\"column has-text-centered\">\n\t<p class=\"is-size-1 has-text-weight-semibold is-marginless is-paddingless\">", "h</p>\n    <p class=\"is-marginless is-paddingless\">Working time today</p> \n  </div>\n  <div class=\"column has-text-centered\">\n\t<p class=\"is-size-1 has-text-weight-semibold is-marginless is-paddingless\">", "h</p>\n    <p class=\"is-marginless is-paddingless\">Breaks today</p>\n  </div>\n  <div class=\"column has-text-centered\">\n\t<p class=", ">\n\t\t", "h\n\t</p>\n    <p class=\"is-marginless is-paddingless\">Remaining</p>\n  </div>\n</div>\n\t\t"], ["\n<table class=\"table\">\n<thead>\n<tr>\n<th>\nCome\n</th>\n<th>\nLeave\n</th>\n<th>\nDuration\n</th>\n</thead>\n</tr>\n\t\t",
            "\n</table>\n\n<div class=\"columns is-mobile\">\n  <div class=\"column has-text-centered\">\n\t<p class=\"is-size-1 has-text-weight-semibold is-marginless is-paddingless\">", "h</p>\n    <p class=\"is-marginless is-paddingless\">Working time today</p> \n  </div>\n  <div class=\"column has-text-centered\">\n\t<p class=\"is-size-1 has-text-weight-semibold is-marginless is-paddingless\">", "h</p>\n    <p class=\"is-marginless is-paddingless\">Breaks today</p>\n  </div>\n  <div class=\"column has-text-centered\">\n\t<p class=", ">\n\t\t", "h\n\t</p>\n    <p class=\"is-marginless is-paddingless\">Remaining</p>\n  </div>\n</div>\n\t\t"])), table.map(function (row) {
            return "\n\t\t\t\t<tr>\n\t\t\t\t<td>" + row.start.getHTML() + "</td>\n\t\t\t\t<td>" + row.end.getHTML() + "</td>\n\t\t\t\t<td>\n\t\t\t\t" + (row.duration / 60000 / 60).toFixed(3) + "h\n\t\t\t\t</td>\n\t\t\t\t</tr> \n\t\t\t\t";
        }), (total / 60000 / 60).toFixed(3), (breaks / 60000 / 60).toFixed(3), "is-size-1 has-text-weight-semibold is-marginless is-paddingless " + remainingClass, (remaining / 60000 / 60).toFixed(3));
    };
    Renderer.prototype.getInOutTable = function (today) {
        var table = [];
        var row = null;
        var startDay = false; // search for the first resume event
        for (var _i = 0, today_1 = today; _i < today_1.length; _i++) {
            var pe = today_1[_i];
            var start = [EventTypes_1.EventTypes.RESUME, EventTypes_1.EventTypes.START].includes(pe.eventType);
            var end = [EventTypes_1.EventTypes.SUSPEND, EventTypes_1.EventTypes.SHUTDOWN].includes(pe.eventType);
            if (start) {
                startDay = true;
            }
            if (startDay) {
                if (start) {
                    row = { start: pe };
                }
                else if (end) {
                    row.end = pe;
                    table.push(row);
                    row = null;
                }
            }
        }
        // if started but not finished
        if (row) {
            row.end = new PowerEvent_1.PowerEvent(EventTypes_1.EventTypes.WORKING);
            table.push(row);
        }
        return table;
    };
    return Renderer;
}());
exports.Renderer = Renderer;
var templateObject_1;
/*
re.parseEvents(JSON.parse('
[{"timestamp":"2018-08-17T08:31:57.859Z","eventType":"suspend"},{"timestamp":"2018-08-17T08:32:16.455Z","eventType":"resume"}]
'))
*/
//# sourceMappingURL=Renderer.js.map