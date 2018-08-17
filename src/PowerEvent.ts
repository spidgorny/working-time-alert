import {EventTypes} from "./EventTypes";
import hyper from "hyperhtml";

export class PowerEvent {

	timestamp: Date;

	eventType: EventTypes;

	constructor(eventType: EventTypes) {
		this.timestamp = new Date();
		this.eventType = eventType;
	}

	getHTML() {
		let time = this.timestamp.getHours()+':'+this.timestamp.getMinutes();
		let html = '';
		if (this.eventType == EventTypes.WORKING) {
			html = hyper.wire()`<span class="tag is-info">${time}</span>`;
		} else {
			html = time;
		}
		return html;
	}

}
