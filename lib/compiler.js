
module.exports = {
	compileExpression: function (text) {
		return new Function('$model', 'with ($model) { return ' + text + '; }');
	}
};

