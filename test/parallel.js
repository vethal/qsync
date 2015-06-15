var assert = require("assert")
var qsync = require("../lib/index");

/*
	Following are the various inputs for testing. Testing its different
	combinations will be covering complete functionality.

	No input, empty input, single input, many input, variadic input
	No task, empty task, single task, many tasks
	Array tasks, Json tasks
*/

suite("parallel", function() {
	/*
		Test to perform parallel synchronization with many json
		task and no input.
	*/
	test("manyJsonTaskNoInput", function(done) {
		var order = [];

		qsync.parallel({
			idle: function (callback) {
				setTimeout(function () {
					order.push("idle");
					callback(null, 10);
				}, 400);
			},
			start: function (callback) {
				setTimeout(function () {
					order.push("start");
					callback(null, 20);
				}, 300);
			},
			active: function (callback) {
				setTimeout(function () {
					order.push("active");
					callback(null, 30);
				}, 200);
			},
			stop: function (callback) {
				setTimeout(function () {
					order.push("stop");
					callback(null, 40);
				}, 100);
			}
		},
		function (error, results) {
			assert.equal(error, null);
			assert.deepEqual(order, ["stop", "active", "start", "idle"]);
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
		Test to perform parallel synchronization with many json
		task and single input.
	*/
	test("manyJsonTaskSingleInput", function(done) {
		var order = [];

		qsync.parallel(15, {
			idle: function (result, callback) {
				setTimeout(function () {
					order.push("idle");
					assert.equal(result, 15);
					callback(null, 10);
				}, 400);
			},
			start: function (result, callback) {
				setTimeout(function () {
					order.push("start");
					assert.equal(result, 10);
					callback(null, 20);
				}, 300);
			},
			active: function (result, callback) {
				setTimeout(function () {
					order.push("active");
					assert.equal(result, 20);
					callback(null, 30);
				}, 200);
			},
			stop: function (result, callback) {
				setTimeout(function () {
					order.push("stop");
					assert.equal(result, 30);
					callback(null, 40);
				}, 100);
			}
		},
		function (error, result) {
			assert.equal(error, null);
			assert.deepEqual(order, ["idle", "start", "active", "stop"]);
			assert.equal(result, 40);
			done();
		});
	});

	/*
		Test to perform parallel synchronization with many json
		task and many input.
	*/
	test("manyJsonTaskManyInput", function(done) {
		var input = [];
		var order = [];

		qsync.parallel([15, 25, 35], {
			idle: function (result, callback) {
				setTimeout(function () {
					order.push("idle");
					input.push(result);
					callback(null, 10);
				}, 400);
			},
			start: function (result, callback) {
				setTimeout(function () {
					order.push("start");
					assert.equal(result, 10);
					callback(null, 20);
				}, 300);
			},
			active: function (result, callback) {
				setTimeout(function () {
					order.push("active");
					assert.equal(result, 20);
					callback(null, 30);
				}, 200);
			},
			stop: function (result, callback) {
				setTimeout(function () {
					order.push("stop");
					assert.equal(result, 30);
					callback(null, 40);
				}, 100);
			}
		},
		function (error, results) {
			assert.equal(error, null);
			assert.deepEqual(order, [
				"idle", "idle", "idle",
				"start", "start", "start",
				"active", "active", "active",
				"stop", "stop", "stop"
			]);
			assert.deepEqual(input, [15, 25, 35]);
			assert.deepEqual(results, [40, 40, 40]);
			done();
		});
	});

	/*
		Test to perform parallel synchronization with many json
		task and variadic input.
	*/
	test("manyJsonTaskVariadicInput", function(done) {
		var order = [];

		qsync.parallel(15, 25, 35, {
			idle: function (input1, input2, input3, callback) {
				setTimeout(function () {
					order.push("idle");
					assert.equal(input1, 15);
					assert.equal(input2, 25);
					assert.equal(input3, 35);
					callback(null, 10);
				}, 400);
			},
			start: function (result, callback) {
				setTimeout(function () {
					order.push("start");
					assert.equal(result, 10);
					callback(null, 20);
				}, 300);
			},
			active: function (result, callback) {
				setTimeout(function () {
					order.push("active");
					assert.equal(result, 20);
					callback(null, 30);
				}, 200);
			},
			stop: function (result, callback) {
				setTimeout(function () {
					order.push("stop");
					assert.equal(result, 30);
					callback(null, 40);
				}, 100);
			}
		},
		function (error, result) {
			assert.equal(error, null);
			assert.deepEqual(order, ["idle", "start", "active", "stop"]);
			assert.equal(result, 40);
			done();
		});
	});

	/*
		Test to perform parallel synchronization with many json
		task and array input having only single element.
	*/
	test("manyJsonTaskSingleArrayInput", function(done) {
		var order = [];

		qsync.parallel([15], {
			idle: function (result, callback) {
				setTimeout(function () {
					order.push("idle");
					assert.equal(result, 15);
					callback(null, 10);
				}, 400);
			},
			start: function (result, callback) {
				setTimeout(function () {
					order.push("start");
					assert.equal(result, 10);
					callback(null, 20);
				}, 300);
			},
			active: function (result, callback) {
				setTimeout(function () {
					order.push("active");
					assert.equal(result, 20);
					callback(null, 30);
				}, 200);
			},
			stop: function (result, callback) {
				setTimeout(function () {
					order.push("stop");
					assert.equal(result, 30);
					callback(null, 40);
				}, 100);
			}
		},
		function (error, results) {
			assert.equal(error, null);
			assert.deepEqual(order, ["idle", "start", "active", "stop"]);
			assert.deepEqual(results, [40]);
			done();
		});
	});
});
