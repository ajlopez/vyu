
var model = require('./model');
var compiler = require('./compiler');

function compileNodes(topnode, viewmodel) {
	var n = topnode.childNodes.length;
	
	console.log('processing', topnode.nodeType);
		
	for (var k = 0; k < n; k++) {
		var node = topnode.childNodes[k];
		
		console.log('processing child', node.nodeType);
		
		if (node.nodeType === 3) {
			var text = node.nodeValue;
			
			if (text.indexOf('{{') < 0)
				continue;
				
			console.log('processing', text);
				
			var compiled = compiler.compileText(text);

			node.vyu = {
				fn: function () {
					return compiled(viewmodel.model);
				}
			};
			
			node.nodeValue = node.vyu.fn();
			viewmodel.nodes.push(node);
		}
		else if (node.nodeType === 1) {
			console.log('processing', node.tagName);
			var nattrs = node.attributes.length;
			
			for (var j = 0; j < nattrs; j++) {
				var attr = node.attributes[j];
				var attrname = attr.name;
				console.log('processing', attrname);
				
				if (attrname.substring(0, 7) === "v-bind:") {
					var propname = attrname.substring(7);
					console.log('bind', propname, 'to', attr.value);
					var exprfn = compiler.compileExpression(attr.value);
					
					var fn = function(model) {
						attr.value = exprfn(model);
					}
					
					viewmodel.fns.push[fn];
				}
			}
			
			compileNodes(node, viewmodel);
		}
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
				compileNodes(elem, viewmodel);
		}
	});
}

function createModel(vm, doc) {
	doc = doc || document;
	var viewmodel = { nodes: [], fns: [] };
	var mod = model(vm.data, { viewmodel: viewmodel }); 
	viewmodel.model = mod;
	viewmodel.document = doc;
	viewmodel.el = vm.el;
	
	viewmodel.refresh = function () {
		viewmodel.fns.forEach(function (fn) {
			fn(viewmodel.model);
		});
		
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

