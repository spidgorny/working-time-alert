"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hyperhtml_1 = require("hyperhtml");
class PieceOfWork {
    constructor(data) {
        this.duration = 0;
        this.start = data.start;
        this.end = data.end;
        if ('duration' in data) {
            this.duration = data.duration;
        }
    }
    toHTML() {
        // 				<!--<td>${this.marginLeft.toFixed()} - ${this.marginRight.toFixed()} ${this.width.toFixed()}</td>-->
        return hyperhtml_1.default.wire() `
			<tr>
				<td>${this.start.getHTML()}</td>
				<td>${this.end.getHTML()}</td>
				<td>
				<progress class="progress is-primary" value="100" max="100" style=${{
            'margin-left': this.marginLeft + '%',
            width: this.width + '%'
        }}>${this.width}%</progress>
</td>
				<td>
				${(this.duration / 60000 / 60).toFixed(3)}h
				</td>
			</tr> 
			`;
    }
}
exports.PieceOfWork = PieceOfWork;
//# sourceMappingURL=PieceOfWork.js.map