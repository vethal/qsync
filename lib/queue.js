module.exports = function () {
	var self = this;

	this.cursor = 0;
	this.tasks = [];
	this.active = [];
	this.maximum = 0;

	this.pending = function () {
		return self.cursor < self.tasks.length;
	}

	this.running = function () {
		return self.active.length;
	}

	this.limit = function (limit) {
		self.maximum = limit;
	}

	this.push = function (task, label, callback) {
		self.tasks.push({
			"task": task,
			"label": label,
			"callback": callback
		});
	}

	this.begin = function () {
		if (!self.maximum || self.active.length < self.maximum) {
			self.cursor = 1;
			self.active.push(self.tasks[0]);
			return self.tasks[0];
		}

		return null;
	}

	this.end = function () {
		self.cursor = self.tasks.length;
	}

	this.next = function () {
		if (self.cursor < self.tasks.length &&
			(!self.maximum || self.active.length < self.maximum)) {
			self.active.push(self.tasks[self.cursor]);
			return self.tasks[self.cursor++];
		} else {
			return null;
		}
	}

	this.goto = function (label) {
		if (!self.maximum || self.active.length < self.maximum) {
			for (var index in self.tasks) {
				if (self.tasks[index].label == label) {
					self.cursor = index + 1;
					self.active.push(self.tasks[index]);
					return self.tasks[index];
				}
			}
		}

		return null;
	}

	this.done = function (label) {
		for (var index in self.active) {
			if (self.active[index].label == label) {
				self.active.splice(index, 1);
				return true;
			}
		}

		return false;
	}

	this.remove = function (label) {
		for (var index in self.tasks) {
			if (self.tasks[index].label == label) {
				self.tasks.splice(index, 1);

				if (self.cursor > index) {
					self.cursor--;
				}

				return true;
			}
		}

		return false;
	}
}
