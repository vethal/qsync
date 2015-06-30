module.exports = function () {
	var self = this;

	self.labels = [];

	this.add = function (label) {
		self.labels.push(label);
	}

	this.remove = function (label) {
		var index = self.labels.indexOf(label);
		self.labels.splice(index, 1);
	}

	this.callback = function (callback) {
		function shim (error, result, jump) {
			var result = [].slice.call(arguments, 0);
			var error, jump = "default";

			if (result.length) {
				jump = result.pop();

				if (keywords.indexOf(jump) == -1 &&
					self.labels.indexOf(jump) == -1) {
					result.push(jump);
					jump = "default";
				}
				
				error = result.shift();
			}

			callback(error, result, jump);
		}

		for (var index in keywords) {
			(function (keyword) {
				shim[keyword] = function (error, result) {
					shim.apply(this, [].slice.call(arguments, 0).concat(keyword));
				}
			})(keywords[index]);
		}

		for (var index in self.labels) {
			(function (label) {
				shim[label] = function (error, result) {
					shim.apply(this, [].slice.call(arguments, 0).concat(label));
				}
			})(self.labels[index]);
		}

		return shim;
	}
}

var keywords = [
	"break",
	"continue",
	"repeat",
	"void",
	"default"
];