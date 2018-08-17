import {EventTypes} from "./EventTypes";

export class PowerEvent {

	timestamp: Date;

	eventType: EventTypes;

	constructor(eventType: EventTypes) {
		this.timestamp = new Date();
		this.eventType = eventType;
	}

}
