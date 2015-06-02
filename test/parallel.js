var assert = require("assert")
var qsync = require("../index");

suite("parallel", function() {
	test("basicParallel", function(done) {
		var order = 0;

		this.timeout(11000);
		qsync.parallel({
			idle: function (result, callback) {
				setTimeout(function () {
					assert.equal(3, order++, "'idle' called in wrong order " + order);
					callback(null, 10);
				}, 400);
			},
			start: function (result, callback) {
				setTimeout(function () {
					assert.equal(2, order++, "'start' called in wrong order " + order);
					callback(null, 20);
				}, 300);
			},
			active: function (result, callback) {
				setTimeout(function () {
					assert.equal(1, order++, "'active' called in wrong order " + order);
					callback(null, 30);
				}, 200);
			},
			stop: function (result, callback) {
				setTimeout(function () {
					assert.equal(0, order++, "'stop' called in wrong order " + order);
					callback(null, 40);
				}, 100);
			}
		},
		function (error, results) {
			assert.equal(4, order++, "'callback' called in wrong order " + order);
			assert.equal(null, error, "Unexpected error reported " + error);
			assert.equal(10, results.idle, "'idle' returned unexpected value " + results.idle);
			assert.equal(20, results.start, "'start' returned unexpected value " + results.start);
			assert.equal(30, results.active, "'active' returned unexpected value " + results.active);
			assert.equal(40, results.stop, "'stop' returned unexpected value " + results.stop);
			done();
		});
	});
});
