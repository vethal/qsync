var self = {
	run: function (input, queue, callback) {
		for (var task = queue.next(); task; task = queue.next()) {
			task.task(input, (function (task) {
				return function (error, result, label) {
					if (error) {
						callback(error);
					} else if (queue.done(task.label)) {
						if (queue.pending() || queue.running()){
							if (queue.pending()) {
								self.run(input, queue, callback);
							}
						} else {
							callback(error, result);
						}
					} else {
						console.error("More than one callback on", task.label);
						throw "More than one callback on " + task.label;
					}
				}
			})(task));
		}
	}
}

module.exports = self;
