var assert = require("assert")
var qsync = require("../lib/index");

/*
	Following are the various inputs for testing. Testing its different
	combinations will be covering complete functionality.

	No input, empty input, single input, many input, variadic input
	Array tasks, Json tasks
	Serial, Parallel
	Array store, json store
	Serial middleware, parallel middleware
	Error as blocker, error as non-blocker
	Goto, break, continue, repeat, default
	While, do-while, for, for-each, map
*/

suite("controlflow", function() {
});