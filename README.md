> **Warning:**
This documentation is a draft version and highly incomplete.

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
In both API, a group of `tasks` are created to process each input. The groups can run either sequentially (in serial API) or concurrently (in parallel API). Though the `tasks` inside a group will be running in serial by default in both the APIs. In parallel API, each array element will be processed in parallel. Note that the tasks inside a group are still running serially and this default behavior can be modified by overriding [flow control](#flowControl) middleware. This default behavior is different in `no input` and in `single input` scenario.
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
 * **single task** Only one function will be given as a task with following syntax.
 ```js
function (input1, input2, ..., callback) {}
 ```
 `input1`, `input2`, etc are the `input` argument provided to the API or the input passed via `callback` of previously called task.
 ```js
qsync.serial([10, 15, 20], function (input, callback) {...});
 ```
 * **json tasks** Instead of giving a single task, it's possible to give a number of labeled task so that the `input` can be processed as a state machine.
 ```js
{
	label1: function (input1, input2, ..., callback) {},
	label2: function (input1, input2, ..., callback) {},
	:
	labelN: function (input1, input2, ..., callback) {}
}
 ```
 In above syntax, all functions should have the same syntax as explained in single task.
 ```js
qsync.serial([10, 15, 20], {
	idle: function (input, callback) {...},
	active: function (result, callback) {...},
	close: function (result, callback) { ... }
});
 ```
 * **array of tasks** An array of functions can also be given as `tasks` if labels are not significant.
 ```js
[
	function (input1, input2, ..., callback) {},
	function (input1, input2, ..., callback) {},
	:
	function (input1, input2, ..., callback) {}
]
 ```
 In above syntax, all functions should have the same syntax as explained in single task.
 ```js
qsync.serial([10, 15, 20], [
	function (input, callback) {...},
	function (result, callback) {...}
]);
 ```
* **`callback(error, result)`** - *An optional* callback which is called when all inputs are processed or an error occurs. By default the `result` argument will be the result returned by last `task`. However it's possible to change this behavior by overriding middleware as explained in section  [`Storage`](#storage). If last `task` didn't pass a result, only `error` argument will be passed to this callback.

<a name="goto"/>
##Goto
ToDo
<a name="break"/>
###break
ToDo
<a name="continue"/>
###continue
ToDo
<a name="repeat"/>
###repeat
ToDo
<a name="default"/>
###default
ToDo
<a name="limit"/>
##Limit
ToDo
<a name="queue"/>
##Queue
ToDo
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
ToDo
<a name="while"/>
###while
ToDo
<a name="doWhile"/>
###do while
ToDo
<a name="for"/>
###for
ToDo
<a name="forEach"/>
###for each
ToDo
<a name="middleware"/>
##Middleware
ToDo
<a name="inputProcessing"/>
###Input processing
ToDo
<a name="flowControl"/>
###Flow control
ToDo
<a name="storage"/>
###Storage
ToDo
<a name="license"/>
##License
```
The MIT License (MIT)

Copyright (c) 2015 Fazil Vadakkumpadath

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```