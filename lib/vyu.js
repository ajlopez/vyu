
var model = require('./model');
var compiler = require('./compiler');

function compileTextNodes(node, viewmodel) {
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
					return compiled(viewmodel.model);
				}
			};
			
			node.nodeValue = node.vyu.fn();
			viewmodel.nodes.push(node);
		}
		else if (node.nodeType === 1)
			compileTextNode(node)
	}
}

function createModel(vm, doc) {
	doc = doc || document;
	var viewmodel = { nodes: [] };
	var mod = model(vm.data, { viewmodel: viewmodel }); 
	viewmodel.model = mod;
	
	viewmodel.refresh = function () {
		viewmodel.nodes.forEach(function (node) {
			node.nodeValue = node.vyu.fn();
		});
	};
	
	if (vm.el && vm.el[0] === '#') 
		doc.addEventListener('load', function () {
			var elem = doc.getElementById(vm.el.substring(1));
			
			if (elem)
				compileTextNodes(elem, viewmodel);
		});
	
	return mod;
}

module.exports = {
	model: createModel
};

