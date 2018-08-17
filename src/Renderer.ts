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
			e = Object.setPrototypeOf(e, PowerEvent.prototype);
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
			const duration = row.end.timestamp - row.start.timestamp;
			// update original row
			row.duration = duration;

			return total + duration;
		}, 0);
		let prevEnd: Date = null;
		const breaks = table.reduce((total, row) => {
			if (prevEnd) {
				total += row.start.timestamp - prevEnd;
			}
			prevEnd = row.end.timestamp;
			return total;
		}, 0);
		const html = hyperHTML.hyper(document.getElementById('table'));
		html`
<table class="table">
<thead>
<tr>
<th>
Come
</th>
<th>
Leave
</th>
<th>
Duration
</th>
</thead>
</tr>
		${
			table.map((row) =>
				`
				<tr>
				<td>${row.start.getHTML()}</td>
				<td>${row.end.getHTML()}</td>
				<td>${(row.duration/60000/60).toFixed(3)}h</td>
				</tr> 
				`
			)
			}
</table>
		<p>Working time today: ${(total/60000/60).toFixed(3)}h</p>
		<p>Breaks today: ${(breaks/60000/60).toFixed(3)}h</p>
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
			row.end = new PowerEvent(EventTypes.WORKING);
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
