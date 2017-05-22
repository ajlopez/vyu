
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

var viewmodels = [];
var loaded = false;

function loadViewModels() {
	if (loaded)
		return;
		
	loaded = true;
	
	viewmodels.forEach(function (viewmodel) {
		var doc = viewmodel.document;
		var el = viewmodel.el;
		
		if (el && el[0] === '#') {
			var elem = doc.getElementById(el.substring(1));
			
			if (elem)
				compileTextNodes(elem, viewmodel);
		}
	});
}

function createModel(vm, doc) {
	doc = doc || document;
	var viewmodel = { nodes: [] };
	var mod = model(vm.data, { viewmodel: viewmodel }); 
	viewmodel.model = mod;
	viewmodel.document = doc;
	viewmodel.el = vm.el;
	
	viewmodel.refresh = function () {
		viewmodel.nodes.forEach(function (node) {
			node.nodeValue = node.vyu.fn();
		});
	};
	
	viewmodels.push(viewmodel);
	
	doc.addEventListener('load', loadViewModels);
	
	return mod;
}

if (typeof window === 'object')
	window.addEventListener('load', loadViewModels);

module.exports = {
	model: createModel
};

