
module.exports = function (model, options) {
	options = options || {};
	
	if (typeof model === 'function')
		model = model();
		
	if (options.handler)
		model = new Proxy(model, options.handler);
		
	return model;
};
