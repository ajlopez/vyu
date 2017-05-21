
var model = require('./model');
var compiler = require('./compiler');

function compileTextNodes(node, model) {
	var n = node.childNodes.length;
	
	for (var k = 0; k < n; k++) {
		var node = node.childNodes[k];
		
		if (node.nodeType === 3) {
			var text = node.nodeValue;
			
			if (text.indexOf('{{') < 0)
				continue;
				
			var compiled = compiler.compileText(text);

			node.vyu = {
				fn: function () {
					return compiled(model);
				}
			};
		}
		else if (node.nodeType === 1)
			compileTextNode(node)
	}
}

function createModel(vm, doc) {
	doc = doc || document;
	var mod = model(vm.data); 
	
	if (vm.el && vm.el[0] === '#') 
		doc.addEventListener('load', function () {
			var elem = doc.getElementById(vm.el.substring(1));
			
			if (elem)
				compileTextNodes(elem, mod);
		});
	
	return mod;
}

module.exports = {
	model: createModel
};

