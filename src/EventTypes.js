"use strict";
// https://electronjs.org/docs/api/power-monitor
Object.defineProperty(exports, "__esModule", { value: true });
var EventTypes;
(function (EventTypes) {
    EventTypes["SUSPEND"] = "suspend";
    EventTypes["RESUME"] = "resume";
    EventTypes["ON_AC"] = "on-ac";
    EventTypes["ON_BATTERY"] = "on-battery";
    EventTypes["SHUTDOWN"] = "shutdown";
})(EventTypes = exports.EventTypes || (exports.EventTypes = {}));
