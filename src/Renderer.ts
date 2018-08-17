import {PowerEvent} from "./PowerEvent";

const {ipcRenderer, Event} = require('electron');
const Store = require('electron-store');
const hyperHTML = require('hyperhtml');

export class Renderer {

	store: {
		set(s: string, v: any): void;
		get(s: string): any;
	};

	events: PowerEvent[] = [];

	constructor() {
		this.store = new Store();

		this.events = this.store.get('events') || [];

		// need to deserialize
		for (let e of this.events) {
			if ('string' == typeof e.timestamp) {
				e.timestamp = new Date(e.timestamp);
			}
		}
		ipcRenderer.on('PowerEvent', this.onPowerEvent.bind(this));
		setTimeout(this.render.bind(this), 1);
	}

	onPowerEvent(event: Event, data: any) {
		this.events.push(new PowerEvent(data.type));
		console.log(this.events);
		this.store.set('events', this.events);
		this.render();
	}

	render() {
		const html = hyperHTML.hyper(document.getElementById('table'));
		html`
<table class="table">
<tr>
<th>
Timestamp
</th>
<th>
Event
</th>
</tr>
		${
			this.events.map((pe: PowerEvent) => 
				`
				<tr>
				<td>${pe.timestamp.getHours()}:${pe.timestamp.getMinutes()}</td>
				<td>${pe.eventType}</td>
				</tr> 
				`
			)
		}
</table>
		`;
	}

}

/*
"[{"timestamp":"2018-08-17T08:31:57.859Z","eventType":"suspend"},{"timestamp":"2018-08-17T08:32:16.455Z","eventType":"resume"}]"

*/
