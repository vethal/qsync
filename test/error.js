var assert = require("assert")
var qsync = require("../lib/index");

/*
	Following are the various inputs for testing. Testing its different
	combinations will be covering complete functionality.

	No input, empty input, single input, many input, variadic input
	Single task, many tasks
	Array tasks, Json tasks
	Serial, Parallel
	Error after goto
	Error while queuing
*/

suite("error", function() {
});