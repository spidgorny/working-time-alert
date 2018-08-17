import {PowerEvent} from "./PowerEvent";
import {EventTypes} from "./EventTypes";

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

		this.events = this.parseEvents(
			this.store.get('events') || []
		);
		ipcRenderer.on('PowerEvent', this.onPowerEvent.bind(this));
		// because the timer is going on
		setInterval(this.render.bind(this), 1000);
	}

	parseEvents(events: any[]) {
		// need to deserialize
		for (let e of events) {
			// noinspection SuspiciousTypeOfGuard
			if ('string' == typeof e.timestamp) {
				e.timestamp = new Date(e.timestamp);
			}
		}
		return events;
	}

	onPowerEvent(event: Event, data: any) {
		this.events.push(new PowerEvent(data.type));
		console.log(this.events);
		this.saveEvents();
		this.render();
	}

	saveEvents() {
		this.store.set('events', this.events);
	}

	render() {
		const today = this.events.filter(pe => {
			return pe.timestamp.toISOString().split('T')[0]
				== new Date().toISOString().split('T')[0];
		});
		const table = this.getInOutTable(today);
		const total = table.reduce((total, row) => {
			let endTime;
			if ('string' == typeof row.end) { // Working
				endTime = new Date();
			} else {
				endTime = row.end.timestamp;
			}
			const duration = endTime - row.start.timestamp;
			return total + duration;
		}, 0);
		const breaks = 0.5;
		const html = hyperHTML.hyper(document.getElementById('table'));
		html`
<table class="table">
<tr>
<th>
Come
</th>
<th>
Leave
</th>
</tr>
		${
			table.map((row) =>
				`
				<tr>
				<td>${row.start.timestamp.getHours()}:${row.start.timestamp.getMinutes()}</td>
				<td>${'string' == typeof(row.end)
					? row.end
					: row.end.timestamp.getHours()+':'+row.end.timestamp.getMinutes()}</td>
				</tr> 
				`
			)
			}
</table>
		<p>Working time today: ${(total/60000/60).toFixed(2)}h</p>
		<p>Breaks today: ${breaks}</p>
		`;
	}

	protected getInOutTable(today: PowerEvent[]) {
		const table = [];
		let row: any = null;
		let startDay = false;	// search for the first resume event
		for (let pe of today) {
			let start = [EventTypes.RESUME, EventTypes.START].includes(pe.eventType);
			let end = [EventTypes.SUSPEND, EventTypes.SHUTDOWN].includes(pe.eventType);
			if (start) {
				startDay = true;
			}

			if (startDay) {
				if (start) {
					row = {start: pe}
				} else if (end) {
					row.end = pe;
					table.push(row);
					row = null;

				}
			}
		}
		// if started but not finished
		if (row) {
			row.end = 'Working';
			table.push(row);
		}

		return table;
	}
}

/*
re.parseEvents(JSON.parse('
[{"timestamp":"2018-08-17T08:31:57.859Z","eventType":"suspend"},{"timestamp":"2018-08-17T08:32:16.455Z","eventType":"resume"}]
'))
*/
