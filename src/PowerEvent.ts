export class PowerEvent {

	timestamp: Date;

	eventType: string;

	constructor(eventType: string) {
		this.timestamp = new Date();
		this.eventType = eventType;
	}

}
