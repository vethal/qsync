module.exports = {
	init: function (type) {
		this.type = type;

		switch (this.type) {
		case Array:
			this.data = [];
			break;
		case Function:
			this.data = null;
			break;
		case Object:
			this.data = {};
			break;
		}
	},
	store: function (error, result, label) {
		if (error) {
			return false;
		} else {
			if (this.type == Array ||
				this.type == Object) {
				this.data[label] = result;
			} else {
				this.data = result;
			}

			return true;
		}
	},
	results: function () {
		return this.data;
	}
}
