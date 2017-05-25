
var model = require('./model');
var compiler = require('./compiler');

function compileNodes(topnode, viewmodel) {
	var n = topnode.childNodes.length;
	
	for (var k = 0; k < n; k++) {
		var node = topnode.childNodes[k];
		
		if (node.nodeType === 3) {
			var text = node.nodeValue;
			
			if (text.indexOf('{{') < 0)
				continue;
				
			var compiled = compiler.compileText(text);

			var fn = (function (node, compiled) {
				return function(model) {
					node.nodeValue = compiled(model);
				};
			})(node, compiled);
			
			viewmodel.fns.push(fn);
			
			fn(viewmodel.model);
		}
		else if (node.nodeType === 1) {
			var nattrs = node.attributes.length;
			
			var toremove = [];
			
			for (var j = 0; j < nattrs; j++) {
				var attr = node.attributes[j];
				var attrname = attr.name;
				
				if (attrname === 'v-if') {
					var exprfn = compiler.compileExpression(attr.value);
					
					var fn = (function (node, nextnode, exprfn) {
						var calculated = false;
						var value = null;
						
						return function (model) {
							var newvalue = exprfn(model);
							
							var toshow = (calculated && newvalue && !value) || (!calculated && newvalue);
							var tohide = (calculated && !newvalue && value) || (!calculated && !newvalue);
							
							value = newvalue;
							calculated = true;
							
							if (toshow)
								topnode.insertBefore(node, nextnode);
							else if (tohide)
								topnode.removeChild(node);
						};
					})(node, topnode.childNodes[k + 1], exprfn);
					
					viewmodel.fns.push(fn);
					
					fn(viewmodel.model);
					toremove.push(attrname);
				}
				else if (attrname.substring(0, 7) === "v-bind:") {
					var propname = attrname.substring(7);
					var exprfn = compiler.compileExpression(attr.value);
					
					var fn = (function (node, propname, exprfn) {
						return function(model) {
							var attr = viewmodel.document.createAttribute(propname);
							attr.value = exprfn(model);
							node.attributes.setNamedItem(attr);
						};
					})(node, propname, exprfn);
					
					viewmodel.fns.push(fn);
					
					fn(viewmodel.model);
					toremove.push(attrname);
				}
			}
			
			toremove.forEach(function (attrname) {
				node.attributes.removeNamedItem(attrname);
			});
			
			compileNodes(node, viewmodel);
		}
	}
}

var viewmodels = [];

function loadViewModels() {
	viewmodels.forEach(function (viewmodel) {
		if (viewmodel.loaded)
			return;
			
		viewmodel.loaded = true;
		
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
	var viewmodel = { fns: [] };
	var mod = model(vm.data, { viewmodel: viewmodel }); 
	viewmodel.model = mod;
	viewmodel.document = doc;
	viewmodel.el = vm.el;
	
	viewmodel.refresh = function () {
		var self = this;
		this.fns.forEach(function (fn) {
			fn(self.model);
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

