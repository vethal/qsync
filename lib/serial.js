var self = {
	run: function (input, queue, callback) {
		if (!queue.running()) {
			var task = queue.next();

			task.task(input, function next (error, result, label) {
				if (queue.done(task.label)) {
					if (error) {
						callback(error);
					} else {
						switch (label) {
						case "break":
							queue.end();
							callback(error, result);
							break;
						case "continue":
							task = queue.begin();
							task.task(result, next);
							break;
						case "repeat":
							task.task(result, next);
							break;
						case "void":
							if (queue.pending()) {
								task = queue.next();
								task.task([], next);
							} else {
								callback(error);
							}
							break;
						case "default":
							if (queue.pending()) {
								task = queue.next();
								task.task(result, next);
							} else {
								callback(error, result);
							}
							break;
						default:
							task = queue.goto(label);
							task.task(result, next);
							break;
						}
					}
				} else {
					console.trace("More than one callback on", task.label, input);
					throw "More than one callback on " + task.label;
				}
			});
		}
	}
}

module.exports = self;
