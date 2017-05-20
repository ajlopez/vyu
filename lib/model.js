
module.exports = function (model) {
	if (typeof model === 'function')
		return model();
		
	return model;
};
