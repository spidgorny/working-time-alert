"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PowerEvent = /** @class */ (function () {
    function PowerEvent(eventType) {
        this.timestamp = new Date();
        this.eventType = eventType;
    }
    return PowerEvent;
}());
exports.PowerEvent = PowerEvent;
