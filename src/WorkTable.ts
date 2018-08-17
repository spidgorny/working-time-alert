import {PieceOfWork} from "./PieceOfWork";

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

}
