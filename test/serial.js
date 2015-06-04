var assert = require("assert")
var qsync = require("../lib/index");

/*
	Following are the various inputs for testing. Testing its different
	combinations will be covering complete functionality.

	No input, empty input, single input, many input, variadic input
	No task, empty task, single task, many tasks
	Array tasks, Json tasks
*/

suite("serial", function() {
	/*
		Test to perform serial synchronization with many json
		task and no input.
	*/
	test("manyJsonTaskNoInput", function(done) {
		var order = [];

		qsync.serial({
			idle: function (result, callback) {
				process.nextTick(function () {
					order.push("idle");
					assert.equal(result, null);
					callback(null, 10);
				});
			},
			start: function (result, callback) {
				process.nextTick(function () {
					order.push("start");
					assert.equal(result, 10);
					callback(null, 20);
				});
			},
			active: function (result, callback) {
				process.nextTick(function () {
					order.push("active");
					assert.equal(result, 20);
					callback(null, 30);
				});
			},
			stop: function (result, callback) {
				process.nextTick(function () {
					order.push("stop");
					assert.equal(result, 30);
					callback(null, 40);
				});
			}
		},
		function (error, results) {
			assert.equal(error, null);
			assert.deepEqual(order, ["idle", "start", "active", "stop"]);
			assert.deepEqual(results, {
				"idle": 10,
				"start": 20,
				"active": 30,
				"stop": 40,
			});
			done();
		});
	});

	/*
		Test to perform serial synchronization with many json
		task and single input.
	*/
	test("manyJsonTaskSingleInput", function(done) {
		var order = [];

		qsync.serial(15, {
			idle: function (result, callback) {
				process.nextTick(function () {
					order.push("idle");
					assert.equal(result, 15);
					callback(null, 10);
				});
			},
			start: function (result, callback) {
				process.nextTick(function () {
					order.push("start");
					assert.equal(result, 10);
					callback(null, 20);
				});
			},
			active: function (result, callback) {
				process.nextTick(function () {
					order.push("active");
					assert.equal(result, 20);
					callback(null, 30);
				});
			},
			stop: function (result, callback) {
				process.nextTick(function () {
					order.push("stop");
					assert.equal(result, 30);
					callback(null, 40);
				});
			}
		},
		function (error, results) {
			assert.equal(error, null);
			assert.deepEqual(order, ["idle", "start", "active", "stop"]);
			assert.deepEqual(results, {
				"idle": 10,
				"start": 20,
				"active": 30,
				"stop": 40,
			});
			done();
		});
	});

	/*
		Test to perform serial synchronization with many json
		task and many input.
	*/
	test("manyJsonTaskManyInput", function(done) {
		var input = [];
		var order = [];

		qsync.serial([15, 25, 35], {
			idle: function (result, callback) {
				process.nextTick(function () {
					order.push("idle");
					input.push(result);
					callback(null, 10);
				});
			},
			start: function (result, callback) {
				process.nextTick(function () {
					order.push("start");
					assert.equal(result, 10);
					callback(null, 20);
				});
			},
			active: function (result, callback) {
				process.nextTick(function () {
					order.push("active");
					assert.equal(result, 20);
					callback(null, 30);
				});
			},
			stop: function (result, callback) {
				process.nextTick(function () {
					order.push("stop");
					assert.equal(result, 30);
					callback(null, 40);
				});
			}
		},
		function (error, results) {
			assert.equal(error, null);
			assert.deepEqual(order, [
				"idle", "start", "active", "stop",
				"idle", "start", "active", "stop",
				"idle", "start", "active", "stop"
			]);
			assert.deepEqual(input, [15, 25, 35]);
			assert.deepEqual(results, [{
				"idle": 10,
				"start": 20,
				"active": 30,
				"stop": 40,
			}, {
				"idle": 10,
				"start": 20,
				"active": 30,
				"stop": 40,
			}, {
				"idle": 10,
				"start": 20,
				"active": 30,
				"stop": 40,
			}]);
			done();
		});
	});

	/*
		Test to perform serial synchronization with many json
		task and variadic input.
	*/
	test("manyJsonTaskVariadicInput", function(done) {
		var order = [];

		qsync.serial(15, 25, 35, {
			idle: function (input1, input2, input3, callback) {
				process.nextTick(function () {
					order.push("idle");
					assert.equal(input1, 15);
					assert.equal(input2, 25);
					assert.equal(input3, 35);
					callback(null, 10);
				});
			},
			start: function (result, callback) {
				process.nextTick(function () {
					order.push("start");
					assert.equal(result, 10);
					callback(null, 20);
				});
			},
			active: function (result, callback) {
				process.nextTick(function () {
					order.push("active");
					assert.equal(result, 20);
					callback(null, 30);
				});
			},
			stop: function (result, callback) {
				process.nextTick(function () {
					order.push("stop");
					assert.equal(result, 30);
					callback(null, 40);
				});
			}
		},
		function (error, results) {
			assert.equal(error, null);
			assert.deepEqual(order, ["idle", "start", "active", "stop"]);
			assert.deepEqual(results, {
				"idle": 10,
				"start": 20,
				"active": 30,
				"stop": 40,
			});
			done();
		});
	});

	/*
		Test to perform serial synchronization with many json
		task and array input having only single element.
	*/
	test("manyJsonTaskSingleArrayInput", function(done) {
		var order = [];

		qsync.serial([15], {
			idle: function (result, callback) {
				process.nextTick(function () {
					order.push("idle");
					assert.equal(result, 15);
					callback(null, 10);
				});
			},
			start: function (result, callback) {
				process.nextTick(function () {
					order.push("start");
					assert.equal(result, 10);
					callback(null, 20);
				});
			},
			active: function (result, callback) {
				process.nextTick(function () {
					order.push("active");
					assert.equal(result, 20);
					callback(null, 30);
				});
			},
			stop: function (result, callback) {
				process.nextTick(function () {
					order.push("stop");
					assert.equal(result, 30);
					callback(null, 40);
				});
			}
		},
		function (error, results) {
			assert.equal(error, null);
			assert.deepEqual(order, ["idle", "start", "active", "stop"]);
			assert.deepEqual(results, [{
				"idle": 10,
				"start": 20,
				"active": 30,
				"stop": 40,
			}]);
			done();
		});
	});
});
