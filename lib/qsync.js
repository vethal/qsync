function qsync () {
	var self = this;
	var shim = require("./shim");
	var engine = require("./engine");

	this.middleware = {
		"serial": {
			"default": {},
			"array": {},
			"tasks": {}
		},
		"parallel": {
			"default": {},
			"array": {},
			"tasks": {}
		}
	};

	this.serial = function (array, tasks, callback) {
		var model = clone();

		model.select(model.middleware.serial);
		model.process(arguments);

		return model;
	}

	this.parallel = function (array, tasks, callback) {
		var model = clone();
		
		model.select(model.middleware.parallel);
		model.process(arguments);

		return model;
	}

	this.queue = function (data, callback) {
		var label, input = self.parameters;
		var label = input.array.length;

		if (input.multiplicity == "single" &&
			input.array.length > 1) {
			input.array = [input.array, data];
		} else {
			input.array.push(data);
		}
		
		input.multiplicity = "multiple";
		add([data], label.toString(), callback);
		self.nextTick();

		return self;
	}

	this.priority = function (data, priority, callback) {
		var label, input = self.parameters;
		var label = input.array.length;

		if (input.multiplicity == "single" &&
			input.array.length > 1) {
			input.array = [input.array, data];
		} else {
			input.array.push(data);
		}
		
		input.multiplicity = "multiple";
		add([data], label.toString(), callback);
		self.nextTick();

		return self;
	}

	this.pause = function () {
		if (self.handle) {
			clearImmediate(self.handle);
			self.handle = undefined;
		}

		return self;
	}

	this.resume = function () {
		if (self.handle) {
			clearImmediate(self.handle);
			self.handle = undefined;
		}

		run();
		return self;
	}

	this.nextTick = function () {
		if (!self.handle) {
			self.handle = setImmediate(function () {
				self.handle = undefined;
				run();
			});
		}

		return self;
	}

	this.select = function (middlewares) {
		self.middlewares = middlewares;
	}

	this.process = function (parameters, configure) {
		var input = self.parameters = refine(parameters);

		if (input.tasks instanceof Array) {
			self.type = Array;
		} else if (input.tasks instanceof Function) {
			self.type = Function;
		} else if (input.tasks instanceof Object) {
			self.type = Object;
		}

		self.array = new shim();
		self.tasks = new shim();

		for (var key in input.tasks) {
			self.tasks.add(key.toString());
		}

		self.engine = new engine();
		self.engine.init(self.array);
		self.engine.use(self.middlewares.array);

		switch (input.multiplicity) {
		case "none":
			input.array.push(null);
			add([], "0");
			break;
		case "single":
			add(input.array, "0");
			break;
		case "multiple":
			for (var index in input.array) {
				add([input.array[index]], index.toString());
			}
			break;
		}

		self.nextTick();
	}

	this.serial.use = function (middleware) {
		self.middleware.serial.default = configure(self.middleware.serial.default, middleware);
		return self;
	}

	this.serial.array = {
		use: function (middleware) {
			self.middleware.serial.array = configure(self.middleware.serial.array, middleware);
			return self;
		}
	}

	this.serial.tasks = {
		use: function (middleware) {
			self.middleware.serial.tasks = configure(self.middleware.serial.tasks, middleware);
			return self;
		}
	}

	this.parallel.use = function (middleware) {
		self.middleware.parallel.default = configure(self.middleware.parallel.default, middleware);
	}

	this.parallel.array = {
		use: function (middleware) {
			self.middleware.parallel.array = configure(self.middleware.parallel.array, middleware);
			return self;
		}
	}

	this.parallel.tasks = {
		use: function (middleware) {
			self.middleware.parallel.tasks = configure(self.middleware.parallel.tasks, middleware);
			return self;
		}
	}

	/* Private members */

	 function clone () {
		var clone = new qsync();

		clone.middleware.serial.default = self.middleware.serial.default;
		clone.middleware.serial.array = self.middleware.serial.array;
		clone.middleware.serial.tasks = self.middleware.serial.tasks;
		clone.middleware.parallel.default = self.middleware.parallel.default;
		clone.middleware.parallel.array = self.middleware.parallel.array;
		clone.middleware.parallel.tasks = self.middleware.parallel.tasks;

		return clone;
	}

	function refine (input) {
		var array, multiplicity, tasks, callback;
		var parameters = [].slice.call(input, 0);

		if (!parameters.length) {
			console.trace("Tasks not found");
			throw "Tasks not found";
		} else {
			var last = parameters[parameters.length - 1];
			var secondLast = parameters.length >= 2 ? parameters[parameters.length - 2] : null;

			if (isTasks(last)) {
				array = parameters;
				tasks = parameters.pop();
				callback = null;
			} else if (last instanceof Function) {
				if (isTasks(secondLast)) {
					array = parameters;
					callback = parameters.pop();
					tasks = parameters.pop();
				} else if (secondLast instanceof Function) {
					array = parameters;
					callback = parameters.pop();
					tasks = [parameters.pop()];
				} else {
					array = parameters;
					tasks = [parameters.pop()];
					callback = null;
				}
			} else {
				console.trace("Last argument has to be either tasks or callback");
				throw "Last argument has to be either tasks or callback";
			}
		}

		if (array.length == 0) {
			multiplicity = "none";
		} else if (array.length == 1) {
			if (array[0] instanceof Array) {
				array = array[0];
				multiplicity = "multiple";
			} else {
				multiplicity = "single";
			}
		}  else if (array.length > 1) {
			multiplicity = "single";
		}

		return {
			"array": array,
			"multiplicity": multiplicity,
			"tasks": tasks,
			"callback": callback
		};

		function isTasks (tasks) {
			if ((!(tasks instanceof Function) &&
				(tasks instanceof Object && Object.keys(tasks).length)) ||
				(tasks instanceof Array && tasks.length)) {
				for (var key in tasks) {
					if (!(tasks[key] instanceof Function)) {
						return false;
					}
				}
				return true;
			} else {
				return false;
			}
		}
	}

	function add (data, label, callback) {
		var tasks = new engine();
		var input = self.parameters;

		tasks.init(self.tasks, self.type);

		if (input.multiplicity == "none") {
			tasks.use(self.middlewares.default);
		} else {
			tasks.use(self.middlewares.tasks);
		}

		self.array.add(label);

		for (var key in input.tasks) {
			tasks.add(input.tasks[key], key.toString(), callback);
		}

		self.engine.add(function (callback) {
			var callback = [].slice.call(arguments, 0).pop();

			tasks.run(data, callback);
		}, label);
	}

	function run () {
		var input = self.parameters;

		self.engine.run([], function (error, results) {
			if (input.multiplicity == "multiple") {
				input.callback.apply(this, arguments);
			} else {
				if (results) {
					input.callback.apply(this, [error].concat(results));
				} else {
					input.callback(error);
				}
			}
		});
	}

	function configure (source, middleware) {
		return {
			"flow": middleware.run ? middleware : source && source.flow,
			"store": middleware.store ? middleware : source && source.store
		};
	}
}

qsync.sync = require("./serial");
qsync.async = require("./parallel");
qsync.store = require("./store");
qsync.last = require("./last");

module.exports= qsync;
