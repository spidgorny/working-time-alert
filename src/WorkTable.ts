import {PieceOfWork} from "./PieceOfWork";
import hyper from "hyperhtml";

export class WorkTable extends Array {

	// constructor(...items: PieceOfWork[]) {
	// 	super(...items);
	// 	this.__proto__ = Array.prototype;
	// }

	calculateDuration() {
		this.map((row) => {
			const duration = row.end.timestamp.getTime() - row.start.timestamp.getTime();
			// update original row
			row.duration = duration;
		});
	}

	getTotal() {
		const total = this.reduce((total, row) => {
			return total + row.duration;
		}, 0);
		return total;
	}

	getBreaks() {
		let prevEnd: number = null;
		const breaks = this.reduce((total, row) => {
			if (prevEnd) {
				total += row.start.timestamp.getTime() - prevEnd;
			}
			prevEnd = row.end.timestamp.getTime();
			return total;
		}, 0);
		return breaks;
	}

	getRemaining() {
		const remaining = 7.7 * 60 * 60 * 1000 - this.getTotal() + this.getBreaks();
		return remaining;
	}

	calculateProgress() {
		const min = this[0].start.timestamp;
		const max = this[this.length-1].end.timestamp;
		const total = max.getTime() - min.getTime();
		this.map(row => {
			row.marginLeft = (row.start.timestamp - min) / total * 100;
			row.marginRight = (row.end.timestamp - min) / total * 100;
			row.width = row.marginRight - row.marginLeft;
		});
	}

	toHTML() {
		return hyper.wire()`
<table class="table is-bordered">
	<thead>
		<tr>
			<th>Come</th>
			<th>Leave</th>
			<th width="99%" style="has-text-centered">Chart</th>
			<th>Duration</th>
			
		</tr>
	</thead>
	<tbody>
		${this.map((row) => row.toHTML())}
	</tbody>
</table>
		`;
	}

}
