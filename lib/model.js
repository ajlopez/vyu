
module.exports = function (model, options) {
	options = options || {};
	
	if (typeof model === 'function')
		model = model();
		
	if (!options.handler)
		options.handler = {
			get: function (target, name) {
				return target[name];
			},
			set: function (target, name, value) {
				target[name] = value;
				
				if (options.viewmodel)
					options.viewmodel.refresh();
					
				return true;
			}
		};
		
	model = new Proxy(model, options.handler);
		
	return model;
};
