import {PowerEvent} from "./PowerEvent";
import hyper from "hyperhtml";

export class PieceOfWork {

	start: PowerEvent;
	end: PowerEvent;
	duration: number = 0;

	constructor(data: any) {
		this.start = data.start;
		this.end = data.end;
		if ('duration' in data) {
			this.duration = data.duration;
		}
	}

	toHTML() {
		return hyper.wire()`
				<tr>
				<td>${this.start.getHTML()}</td>
				<td>${this.end.getHTML()}</td>
				<td>
				<progress class="progress is-primary" value="15" max="100" style=${{
			'margin-left': '30%',
			width: '70%'}}>15%</progress>
</td>
				<td>
				${(this.duration / 60000 / 60).toFixed(3)}h
				</td>
				</tr> 
				`

	}

}
