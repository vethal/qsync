# qsync
Quick sync is a two API solution to synchronize asynchronous function calls. It helps to implement common control flow scenarios easily.
## Installation
This module is originally written for nodejs. Though it's planned to port into other areas in future.
```bash
$ npm install qsync
```
##Quick Example
```js
// Synchronize with states
qsync.serial([10, 20, 30], {
    idle: function (input, callback) { ... },
    active: function (result, callback) { ... },
    close: function (result, callback) { ... }
},
function (error, results) {
});

// Classic synchronization
qsync.serial([10, 20, 30], [
    function (input, callback) { ... },
    function (result, callback) { ... }
], callback);

// Process inputs in parallel
qsync.parallel([10, 20, 30], [
    function(input, callback){ ... },
    function(result, callback){ ... }
],
function (error, results) {
});
```
##Contents

 * [`Two API`](#twoAPI)
	 * [`serial`](#serial)
	 * [`parallel`](#parallel)
 * [`Goto`](#goto)
	 * [`break`](#break)
	 * [`continue`](#continue)
	 * [`repeat`](#repeat)
	 * [`default`](#default)
 * [`Limit`](#limit)
 * [`Queue`](#queue)
 * [`Detailed Example`](#detailedExample)
 * [`Control flow examples`](#controlFlowExamples)
	 * [`while`](#while)
	 * [`do while`](#doWhile)
	 * [`for`](#for)
	 * [`for each`](#forEach)
 * [`Middleware`](#middleware)
	 * [`Input processing`](#inputProcessing)
	 * [`Flow control`](#flowControl)
	 * [`Storage`](#storage)
 * [`License`](#license)
 
<a name="twoAPI"/>
##Two API

<a name="serial"/>
### serial([input], tasks, [callback])
Run tasks serially with each provided input. If input is not given tasks executes once with no input.

<a name="parallel"/>
### parallel([input], tasks, [callback])
Run tasks serially with each provided input in parallel. If input is not given tasks executes in parallel with no input.
> **Note:** If inputs are given, tasks will not run in parallel; but all inputs will be processed in parallel. However it's possible to run tasks also in parallel by overriding middleware as explained in section `use` API. 

__Arguments__

* **`input`** - *Optional*
 * **no input** If no input is given, all `tasks` will be run only once. Also `input` argument of first task will be `null`. In parallel API, all `tasks` will be running concurrently.
 ```js
qsync.serial([
	function (input, callback) {...}
]);
 ```
 * **single input** Given data will be passed as the `input` argument of first task. It can be a number, string or a json object. All `tasks` will be run only once. In parallel API, all `tasks` will be running concurrently.
 ```js
qsync.serial(15, [
	function (input, callback) {...}
]);
 ```
 * **array input** In case of an array input, each array element will be passed as the `input` argument of first task. If array has `n` number of elements, `tasks` will be run `n` times each corresponds to a respective data in array.
In both API, a group of `tasks` are created to process each input. The groups can run either sequentially (in serial API) or concurrently (in parallel API). Though the `tasks` inside a group will be running in serial by default in both the APIs. In parallel API, each array element will be processed in parallel. Note that the tasks inside a group are still running serially and this default behavior can be modified by overriding [flow control](#flowControl) middleware. This default behavior is different in `no input` and in `single input`.
In below example, a group of task1 and task2 for processing input 10 will be created and running in serial. another group of task1 and task2 for processing input 15 will also be created and running in serial and a third task group for processing 20 will also be running similarly. But in parallel API, all these groups will be running in parallel so that all inputs will be processed in parallel. But inside any of the three group, task1 and task2 will be running in serial.
 ```js
qsync.serial([10, 15, 20], {
	task1: function (input, callback) {...},
	task2: function (result, callback) {...}
});
 ```
 * **variadic input** This input is same as `single input`. All the inputs will be passed as variadic arguments of first task. In below example, 3, 5 and 11 will be passed to first task as its 1st, 2nd and 3rd argument respectively. `callback` will be its 4th argument.
 ```js
qsync.serial(3, 5, 11, [
	function (input, callback) {...}
]);
 ```
* **`tasks`**
 * **single task** An array of functions or a json of functions or a single function. Each function has a syntax of `function (input1, input2, ..., callback)` where inputs are the result passed from previous task. In case of first task it will be `input` argument if present or null if it's absent.
 ```js
qsync.serial([10, 15, 20], function (input, callback) {...});
 ```
 * **json tasks** An array of functions or a json of functions or a single function. Each function has a syntax of `function (input1, input2, ..., callback)` where inputs are the result passed from previous task. In case of first task it will be `input` argument if present or null if it's absent.
 ```js
qsync.serial([10, 15, 20], {
	idle: function (input, callback) {...},
	active: function (result, callback) {...},
	close: function (result, callback) { ... }
});
 ```
 * **array of tasks** An array of functions or a json of functions or a single function. Each function has a syntax of `function (input1, input2, ..., callback)` where inputs are the result passed from previous task. In case of first task it will be `input` argument if present or null if it's absent.
 ```js
qsync.serial([10, 15, 20], [
	function (input, callback) {...},
	function (result, callback) {...}
]);
 ```
* **`callback(error, results)`** - *An optional* callback which is called when all inputs are processed or an error occurs. If `tasks` are json, result will also be a json and if `tasks` are array, result will also be an array. However it's possible to change this behavior by overriding middleware as explained in section `use` API.

<a name="goto"/>
##Goto

<a name="break"/>
###break

<a name="continue"/>
###continue

<a name="repeat"/>
###repeat

<a name="default"/>
###default

<a name="limit"/>
##Limit

<a name="queue"/>
##Queue

<a name="detailedExample"/>
##Detailed Example
```js
qsync.serial([5, 6, 7], {
	idle: function (result, callback) {
		setTimeout(function () {
			// Go to next ('start') state by default
			callback();
		}, 100);
	},
	start: function (result, callback) {
		setTimeout(function () {
			if (some condition) {
				// Go to stop state
				callback(null, 20, "stop");
			} else {
				// Go to next ('passive') state by default
				callback(null, 15);
			}
		}, 100);
	},
	passive: function (result, callback) {
		setTimeout(function () {
			if (some condition) {
				// Break and exit
				callback(null, 20, "break");
			} else if (some other condition) {
				// Go to first state ('idle')
				callback(null, 20, "continue");
			} else if (some other condition) {
				// Loop in the same state ('passive')
				callback(null, 20, "repeat");
			} else {
				// Go to next ('active') state by default
				callback(null, 15);
			}
		}, 100);
	},
	active: function (result, callback) {
		// On time-out go to 'start' state
		setTimeout(callback.start, 100);
	},
	standby: function (result, callback) {
		// Break and exit when time-out
		setTimeout(callback.break, 100);
	},
	stop: function (result, callback) {
		setTimeout(callback, 100);
	}
},
function (error, results) {
	/* Result will be a json in below format
	[
		// Result of input '5'
		{
			idle: undefined,
			start: 15,
			passive: 15,
			active: undefined,
			standby: undefined,
			stop: undefined
		},
		// Result of input '6'
		{
			idle: undefined,
			start: 15,
			passive: 15,
			active: undefined,
			standby: undefined,
			stop: undefined
		},
		//Result of input '7'
		{
			idle: undefined,
			start: 15,
			passive: 15,
			active: undefined,
			standby: undefined,
			stop: undefined
		}
	]*/
});
```
#####Using Arrays
```js
qsync.serial([5, 6, 7], [
	function (result, callback) {
		setTimeout(function () {
			// Go to next ('1') state by default
			callback();
		}, 100);
	},
	function (result, callback) {
		setTimeout(function () {
			if (some condition) {
				// Go to '5' state
				callback(null, 20, "5");
			} else {
				// Go to next ('2') state by default
				callback(null, 15);
			}
		}, 100);
	},
	function (result, callback) {
		setTimeout(function () {
			if (some condition) {
				// Break and exit
				callback(null, 20, "break");
			} else if (some other condition) {
				// Go to first state ('idle')
				callback(null, 20, "continue");
			} else if (some other condition) {
				// Loop in the same state ('2')
				callback(null, 20, "repeat");
			} else {
				// Go to next ('3') state by default
				callback(null, 15);
			}
		}, 100);
	},
	function (result, callback) {
		// On time-out go to '1' state
		setTimeout(callback["1"], 100);
	},
	function (result, callback) {
		// Break and exit when time-out
		setTimeout(callback.break, 100);
	},
	function (result, callback) {
		setTimeout(callback, 100);
	}
],
function (error, results) {
	/* Result will be an array in below format
	[
		// Result of input '5'
		[
			undefined,
			15,
			15,
			undefined,
			undefined,
			undefined
		],
		// Result of input '6'
		[
			undefined,
			15,
			15,
			undefined,
			undefined,
			undefined
		],
		//Result of input '7'
		[
			undefined,
			15,
			15,
			undefined,
			undefined,
			undefined
		]
	]*/
});
```

<a name="controlFlowExamples"/>
##Control flow examples

<a name="while"/>
###while

<a name="doWhile"/>
###do while

<a name="for"/>
###for

<a name="forEach"/>
###for each

<a name="middleware"/>
##Middleware

<a name="inputProcessing"/>
###Input processing

<a name="flowControl"/>
###Flow control

<a name="storage"/>
###Storage

<a name="license"/>
##License