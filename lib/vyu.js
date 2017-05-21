
var model = require('./model');
var compiler = require('./compiler');

function createModel(vm, doc) {
	doc = doc || document;
	var mod = model(vm.data); 
	
	if (vm.el && vm.el[0] === '#') {
		var elem = doc.getElementById(vm.el.substring(1));
		
		if (elem) {
			var compiled = compiler.compileText(elem.childNodes[0].nodeValue);
			
			elem.vyu = {
				fn: function () {
					return compiled(mod);
				}
			}
		}
	}
	
	return mod;
}

module.exports = {
	model: createModel
};

