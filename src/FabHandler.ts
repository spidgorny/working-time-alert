const hyperHTML = require('hyperhtml');

export class FabHandler {

	constructor() {

	}

	render() {
		return hyperHTML.wire()`
		<!--<a class="button is-info is-fixed-bottom">Add</a>-->
`;
	}

}
