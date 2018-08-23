import {PowerEvent} from "./PowerEvent";
import hyper from "hyperhtml";
const date = require('date-and-time');

export class PieceOfWork {

	start: PowerEvent;
	end: PowerEvent;
	duration: number = 0;
	marginLeft: number;
	marginRight: number;
	width: number;

	constructor(data: any) {
		this.start = data.start;
		this.end = data.end;
		if ('duration' in data) {
			this.duration = data.duration;
		}
	}

	toHTML() {
// 				<!--<td>${this.marginLeft.toFixed()} - ${this.marginRight.toFixed()} ${this.width.toFixed()}</td>-->
		return hyper.wire()`
			<tr>
				<td>${this.start.getHTML()}</td>
				<td>${this.end.getHTML()}</td>
				<td>
				<progress class="progress is-primary" value="100" max="100" style=${{
			'margin-left': this.marginLeft + '%',
			width: this.width + '%'}}>${this.width}%</progress>
</td>
				<td>
				${(this.duration / 60000 / 60).toFixed(3)}h
				</td>
			</tr> 
			`;

	}

}
