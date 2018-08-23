import {EventTypes} from "./EventTypes";
import hyper from "hyperhtml";
const date = require('date-and-time');

export class PowerEvent {

	timestamp: Date;

	eventType: EventTypes;

	constructor(eventType: EventTypes) {
		this.timestamp = new Date();
		this.eventType = eventType;
	}

	getHTML() {
		let time = date.format(this.timestamp, 'HH:mm');
		let html = '';
		if (this.eventType == EventTypes.WORKING) {
			html = hyper.wire()`<span class="tag is-info">${time}</span>`;
		} else {
			html = time;
		}
		return html;
	}

}
