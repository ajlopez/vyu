
module.exports = {
	compile: function (text) {
		return new Function('$model', 'with ($model) { return ' + text + '; }');
	}
};

