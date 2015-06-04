var assert = require("assert")
var qsync = require("../lib/index");

/*
	Following are the various inputs for testing. Testing its different
	combinations will be covering complete functionality.

	No input, empty input, single input, many input, variadic input
	No task, empty task, single task, many tasks
	Array tasks, Json tasks
	Serial, Parallel
	Array store, json store
	Serial middleware, parallel middleware
	Error as blocker, error as non-blocker
*/

suite("middleware", function() {
});