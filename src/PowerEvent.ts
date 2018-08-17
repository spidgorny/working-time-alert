import {EventTypes} from "./EventTypes";

export class PowerEvent {

	timestamp: Date;

	eventType: EventTypes;

	constructor(eventType: EventTypes) {
		this.timestamp = new Date();
		this.eventType = eventType;
	}

	getHTML() {
		let time = this.timestamp.getHours()+':'+this.timestamp.getMinutes();
		if (this.eventType == EventTypes.WORKING) {
			time = '<span class="tag is-info">'+time+'</span>';
		}
		return time;
	}

}
