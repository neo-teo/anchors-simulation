export class Connection {
	constructor(spiritA, spiritB, connectedAt) {
		this.a = spiritA;
		this.b = spiritB;
		this.connectedAt = connectedAt;
	}

	getDuration(currentTime) {
		return currentTime - this.connectedAt;
	}

	includes(spirit) {
		return this.a === spirit || this.b === spirit;
	}

	getOther(spirit) {
		return this.a === spirit ? this.b : this.a;
	}
}
