"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hyperHTML = require('hyperhtml');
class FabHandler {
    constructor() {
    }
    render() {
        return hyperHTML.wire() `
		<!--<a class="button is-info is-fixed-bottom">Add</a>-->
`;
    }
}
exports.FabHandler = FabHandler;
//# sourceMappingURL=FabHandler.js.map