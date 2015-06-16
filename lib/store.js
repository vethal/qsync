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
		} else if (result.length) {
			var data = (result.length == 1) ? result[0] : result;

			if (this.type == Array ||
				this.type == Object) {
				this.data[label] = data;
			} else {
				this.data = data;
			}

			return true;
		} else {
			return true;
		}
	},
	results: function () {
		switch (this.type) {
		case Array:
			return this.data.length ? [this.data] : [];
		case Function:
			return this.data ? [this.data] : [];
			break;
		case Object:
			return Object.keys(this.data).length ? [this.data] : [];
			break;
		}
	}
}
