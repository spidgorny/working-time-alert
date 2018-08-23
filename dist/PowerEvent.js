"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventTypes_1 = require("./EventTypes");
const hyperhtml_1 = require("hyperhtml");
const date = require('date-and-time');
class PowerEvent {
    constructor(eventType) {
        this.timestamp = new Date();
        this.eventType = eventType;
    }
    getHTML() {
        let time = date.format(this.timestamp, 'HH:mm');
        let html = '';
        if (this.eventType == EventTypes_1.EventTypes.WORKING) {
            html = hyperhtml_1.default.wire() `<span class="tag is-info is-loading">${time}</span>`;
        }
        else {
            html = time;
        }
        return html;
    }
}
exports.PowerEvent = PowerEvent;
//# sourceMappingURL=PowerEvent.js.map