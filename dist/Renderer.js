"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PowerEvent_1 = require("./PowerEvent");
const EventTypes_1 = require("./EventTypes");
const PieceOfWork_1 = require("./PieceOfWork");
const WorkTable_1 = require("./WorkTable");
const FabHandler_1 = require("./FabHandler");
const { ipcRenderer } = require('electron');
const Store = require('electron-store');
const hyperHTML = require('hyperhtml');
const date = require('date-and-time');
require('source-map-support').install();
class Renderer {
    constructor() {
        this.events = [];
        this.store = new Store();
        this.events = this.parseEvents(this.store.get('events') || []);
        ipcRenderer.on('PowerEvent', this.onPowerEvent.bind(this));
        this.start();
        this.fab = new FabHandler_1.FabHandler();
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
    getOnlyToday() {
        const today = this.events.filter(pe => {
            return pe.timestamp.toISOString().split('T')[0]
                == new Date().toISOString().split('T')[0];
        });
        return today;
    }
    render() {
        const today = this.getOnlyToday();
        const table = this.getInOutTable(today);
        table.calculateDuration();
        table.calculateProgress();
        const html = hyperHTML.hyper(document.getElementById('table'));
        html `
		${this.renderTotals(table)}
		${table.toHTML()}
		${this.renderLimits(table)}
		${this.fab.render()}
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
        const remainingClass = (table.getRemaining() < 0)
            ? 'has-text-danger' : 'has-text-success';
        const remainingWithSign = (table.getRemaining() > 0 ? '+' : '') +
            (table.getRemainingH()).toFixed(3);
        return hyperHTML.wire() `
		<div class="columns is-mobile">
  <div class="column has-text-centered">
	<p class="is-size-1 has-text-weight-semibold is-marginless is-paddingless">${(table.getTotalH()).toFixed(3)}h</p>
    <p class="is-marginless is-paddingless">Working time today</p> 
  </div>
  <div class="column has-text-centered">
	<p class="is-size-1 has-text-weight-semibold is-marginless is-paddingless">${(table.getBreaksH()).toFixed(3)}h</p>
    <p class="is-marginless is-paddingless">Breaks today</p>
  </div>
  <div class="column has-text-centered">
	<p class=${"is-size-1 has-text-weight-semibold is-marginless is-paddingless " + remainingClass}>
		${remainingWithSign}h
	</p>
    <p class="is-marginless is-paddingless">Remaining</p>
  </div>
</div>`;
    }
    renderLimits(table) {
        let breaksDate = new Date(table.getBreaks());
        const breaksHM = date.format(breaksDate, 'HH:mm', true);
        const come = table.getCome() || new Date();
        const minLeave = date.addMinutes(come, 7.7 * 60); // addHours is rounding
        const maxLeave = date.addHours(come, 10);
        const minLeaveBreaks = date.addMinutes(minLeave, table.getBreaksM());
        let minBreaks;
        if (table.getTotalH() > 6) {
            minBreaks = Math.max(table.getBreaksM(), 30);
        }
        else if (table.getTotalH() > 9) {
            minBreaks = Math.max(table.getBreaksM(), 45);
        }
        else {
            minBreaks = table.getBreaksM();
        }
        const minBreaksHM = date.format(new Date(minBreaks * 60 * 1000), 'HH:mm', true);
        const minBreaks10 = Math.max(table.getBreaksM(), 45);
        const minBreaks10HM = date.format(new Date(minBreaks10 * 60 * 1000), 'HH:mm', true);
        const maxLeaveBreaks = date.addMinutes(maxLeave, minBreaks10);
        return hyperHTML.wire() `
		<table>
			<tr>
    			<td>Min Leave Time (7.7h+${minBreaksHM}):</td> 
				<td>${date.format(minLeaveBreaks, 'HH:mm')}</td>
			</tr>
			<tr>
    			<td>Max Leave Time (10h+${minBreaks10HM}):</td> 
				<td>${date.format(maxLeaveBreaks, 'HH:mm')}</td>
			</tr>
		</table>	
		`;
    }
}
exports.Renderer = Renderer;
/*
re.parseEvents(JSON.parse('
[{"timestamp":"2018-08-17T08:31:57.859Z","eventType":"suspend"},{"timestamp":"2018-08-17T08:32:16.455Z","eventType":"resume"}]
'))
*/
//# sourceMappingURL=Renderer.js.map