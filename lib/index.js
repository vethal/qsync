var self = function () {
	return reference.clone();
}

self.serial = function (array, tasks, callback) {
	return reference.serial.apply(this, arguments);
}

self.parallel = function (array, tasks, callback) {
	return reference.parallel.apply(this, arguments);
}

self.serial.use = function (middleware) {
	reference.serial.use(middleware);
}

self.serial.array = {
	use: function (middleware) {
		reference.serial.array.use(middleware);
	}
}

self.serial.tasks = {
	use: function (middleware) {
		reference.serial.tasks.use(middleware);
	}
}

self.parallel.use = function (middleware) {
	reference.parallel.use(middleware);
}

self.parallel.array = {
	use: function (middleware) {
		reference.parallel.array.use(middleware);
	}
}

self.parallel.tasks = {
	use: function (middleware) {
		reference.parallel.tasks.use(middleware);
	}
}

module.exports = self;

var qsync = require("./qsync");
var reference = new qsync();

reference.serial.use(qsync.sync);
reference.serial.use(qsync.store);
reference.serial.array.use(qsync.sync);
reference.serial.array.use(qsync.store);
reference.serial.tasks.use(qsync.sync);
reference.serial.tasks.use(qsync.store);
reference.parallel.use(qsync.async);
reference.parallel.use(qsync.store);
reference.parallel.array.use(qsync.async);
reference.parallel.array.use(qsync.store);
reference.parallel.tasks.use(qsync.sync);
reference.parallel.tasks.use(qsync.store);
