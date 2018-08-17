"use strict";
exports.__esModule = true;
var EventTypes_1 = require("./EventTypes");
var PowerEvent = /** @class */ (function () {
    function PowerEvent(eventType) {
        this.timestamp = new Date();
        this.eventType = eventType;
    }
    PowerEvent.prototype.getHTML = function () {
        var time = this.timestamp.getHours() + ':' + this.timestamp.getMinutes();
        if (this.eventType == EventTypes_1.EventTypes.WORKING) {
            time = '<span class="tag is-info">' + time + '</span>';
        }
        return time;
    };
    return PowerEvent;
}());
exports.PowerEvent = PowerEvent;
//# sourceMappingURL=PowerEvent.js.map