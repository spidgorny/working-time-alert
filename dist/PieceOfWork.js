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
        return hyperhtml_1.default.wire() `
				<tr>
				<td>${this.start.getHTML()}</td>
				<td>${this.end.getHTML()}</td>
				<td>
				<progress class="progress is-primary" value="15" max="100" style=${{
            'margin-left': '30%',
            width: '70%'
        }}>15%</progress>
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