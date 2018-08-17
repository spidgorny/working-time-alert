import {PowerEvent} from "./PowerEvent";
import {EventTypes} from "./EventTypes";
import {PieceOfWork} from "./PieceOfWork";
import {WorkTable} from "./WorkTable";

const {ipcRenderer, Event} = require('electron');
const Store = require('electron-store');
const hyperHTML = require('hyperhtml');

export class Renderer {

	store: {
		set(s: string, v: any): void;
		get(s: string): any;
	};

	events: PowerEvent[] = [];

	timer: number;

	constructor() {
		this.store = new Store();

		this.events = this.parseEvents(
			this.store.get('events') || []
		);
		ipcRenderer.on('PowerEvent', this.onPowerEvent.bind(this));
		this.start();
	}

	start() {
		// because the timer is going on
		this.timer = setInterval(this.render.bind(this), 1000);
	}

	stop() {
		clearInterval(this.timer);
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
		table.calculateDuration();
		table.calculateProgress();
		const html = hyperHTML.hyper(document.getElementById('table'));
		html`
		${this.renderTotals(table)}
		${table.toHTML()}
		`;
	}

	protected getInOutTable(today: PowerEvent[]) {
		const table = new WorkTable();
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
					table.push(new PieceOfWork(row));
					row = null;
				}
			}
		}
		// if started but not finished
		if (row) {
			row.end = new PowerEvent(EventTypes.WORKING);
			table.push(new PieceOfWork(row));
		}

		return table;
	}

	renderTotals(table: WorkTable) {
		const remainingClass = (table.getRemaining() > 0)
			? 'has-text-danger' : 'has-text-success';

		return hyperHTML.wire()`
		<div class="columns is-mobile">
  <div class="column has-text-centered">
	<p class="is-size-1 has-text-weight-semibold is-marginless is-paddingless">${(table.getTotal() / 60000 / 60).toFixed(3)}h</p>
    <p class="is-marginless is-paddingless">Working time today</p> 
  </div>
  <div class="column has-text-centered">
	<p class="is-size-1 has-text-weight-semibold is-marginless is-paddingless">${(table.getBreaks() / 60000 / 60).toFixed(3)}h</p>
    <p class="is-marginless is-paddingless">Breaks today</p>
  </div>
  <div class="column has-text-centered">
	<p class=${"is-size-1 has-text-weight-semibold is-marginless is-paddingless "+remainingClass}>
		${(table.getRemaining() / 60000 / 60).toFixed(3)}h
	</p>
    <p class="is-marginless is-paddingless">Remaining</p>
  </div>
</div>`;
	}

}

/*
re.parseEvents(JSON.parse('
[{"timestamp":"2018-08-17T08:31:57.859Z","eventType":"suspend"},{"timestamp":"2018-08-17T08:32:16.455Z","eventType":"resume"}]
'))
*/
