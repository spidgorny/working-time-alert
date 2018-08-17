import {PowerEvent} from "./PowerEvent";
const {ipcRenderer, Event} = require('electron');
const Store = require('electron-store');

export class Renderer {

	store: {
		set(s: string, v: any): void;
		get(s: string): any;
	};

	events: PowerEvent[] = [];

	constructor() {
		this.store = new Store();
		this.events = this.store.get('events');
		ipcRenderer.on('PowerEvent', this.onPowerEvent.bind(this));
	}

	onPowerEvent(event: Event, data: any) {
		this.events.push(new PowerEvent(data.type));
		console.log(this.events);
		this.store.set('events', this.events);
	}

}

/*
"[{"timestamp":"2018-08-17T08:31:57.859Z","eventType":"suspend"},{"timestamp":"2018-08-17T08:32:16.455Z","eventType":"resume"}]"

*/
