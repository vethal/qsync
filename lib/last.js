module.exports = {
	init: function (type) {
	},
	store: function (error, result, label) {
		if (error) {
			return false;
		} else {
			this.data = result;
			return true;
		}
	},
	results: function () {
		return this.data;
	}
}
