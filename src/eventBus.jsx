const eventBus = {
	listeners: {},
	subscribe(event, callback) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
	this.listeners[event].push(callback);
	},
	unsubscribe(event, callback) {
		if (this.listeners[event]) {
			this.listeners[event] = this.listeners[event].filter(
				(listener) => listener !== callback
			);
		}
	},
	publish(event, data) {
		if (this.listeners[event]) {
			this.listeners[event].forEach((callback) => {
				callback(data);
			});
		}
	},
};

export default eventBus;