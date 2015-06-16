module.exports = function () {
	var self = this;
	var queue = require("./queue");

	this.init = function (shim, type) {
		self.queue = new queue();
		self.shim = shim;
		self.type = type || Array;
		self.context = {};
		self.alive = true;
	}

	this.use = function (middleware) {
		self.flow = middleware.flow;
		self.store = middleware.store;

		self.store.init.bind(self.context)(self.type);
	}

	this.limit = function (limit) {
		self.queue.limit(limit);
	}

	this.add = function (task, label, callback) {
		var forward, shim = self.shim.callback(function (error, result, jump) {
			if (self.alive) {
				callback && callback.apply(this, [error].concat(result));

				if (self.store.store.bind(self.context)(error, result, label)) {
					forward(null, result, jump);
				} else {
					self.alive = false;
					forward(error, result, jump);
				}
			}
		});

		self.queue.push(function (result, next) {
			forward = next;
			task.apply(this, result.concat(shim));
		}, label, callback);
	}

	this.remove = function (label) {
		self.queue.remove(label);
	}

	this.run = function (input, callback) {
		self.flow.run.bind(self.context)(self.result || input, self.queue, function (error, result) {
			var results = self.store.results.bind(self.context)();

			self.result = result;
			callback && callback.apply(this, [error].concat(results));
		});
	}
}
