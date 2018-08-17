"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PowerEvent_1 = require("./PowerEvent");
const EventTypes_1 = require("./EventTypes");
const PieceOfWork_1 = require("./PieceOfWork");
const WorkTable_1 = require("./WorkTable");
const { ipcRenderer, Event } = require('electron');
const Store = require('electron-store');
const hyperHTML = require('hyperhtml');
class Renderer {
    constructor() {
        this.events = [];
        this.store = new Store();
        this.events = this.parseEvents(this.store.get('events') || []);
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
    parseEvents(events) {
        // need to deserialize
        for (let e of events) {
            // noinspection SuspiciousTypeOfGuard
            if ('string' == typeof e.timestamp) {
                e.timestamp = new Date(e.timestamp);
            }
            e = Object.setPrototypeOf(e, PowerEvent_1.PowerEvent.prototype);
        }
        return events;
    }
    onPowerEvent(event, data) {
        this.events.push(new PowerEvent_1.PowerEvent(data.type));
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
        html `
		${this.renderTotals(table)}
		${table.toHTML()}
		`;
        document.title = `${(table.getRemaining() / 60000 / 60).toFixed(3)}h Remaining`;
    }
    getInOutTable(today) {
        const table = new WorkTable_1.WorkTable();
        let row = null;
        let startDay = false; // search for the first resume event
        for (let pe of today) {
            let start = [EventTypes_1.EventTypes.RESUME, EventTypes_1.EventTypes.START].includes(pe.eventType);
            let end = [EventTypes_1.EventTypes.SUSPEND, EventTypes_1.EventTypes.SHUTDOWN].includes(pe.eventType);
            if (start) {
                startDay = true;
            }
            if (startDay) {
                if (start) {
                    row = { start: pe };
                }
                else if (end) {
                    row.end = pe;
                    table.push(new PieceOfWork_1.PieceOfWork(row));
                    row = null;
                }
            }
        }
        // if started but not finished
        if (row) {
            row.end = new PowerEvent_1.PowerEvent(EventTypes_1.EventTypes.WORKING);
            table.push(new PieceOfWork_1.PieceOfWork(row));
        }
        return table;
    }
    renderTotals(table) {
        const remainingClass = (table.getRemaining() > 0)
            ? 'has-text-danger' : 'has-text-success';
        return hyperHTML.wire() `
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
	<p class=${"is-size-1 has-text-weight-semibold is-marginless is-paddingless " + remainingClass}>
		${(table.getRemaining() / 60000 / 60).toFixed(3)}h
	</p>
    <p class="is-marginless is-paddingless">Remaining</p>
  </div>
</div>`;
    }
}
exports.Renderer = Renderer;
/*
re.parseEvents(JSON.parse('
[{"timestamp":"2018-08-17T08:31:57.859Z","eventType":"suspend"},{"timestamp":"2018-08-17T08:32:16.455Z","eventType":"resume"}]
'))
*/
//# sourceMappingURL=Renderer.js.map