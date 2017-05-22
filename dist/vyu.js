
var model = (function() {
	return function (model, options) {
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
}	
})();

var compiler = (function () {
function split(text) {
	var parts = [];
	
	for (var p = text.indexOf('{{'); p >= 0; p = text.indexOf('{{')) {
		var part = text.substring(0, p);
		parts.push(part);
		
		text = text.substring(p + 2);
		var p2 = text.indexOf('}}');
		
		if (p2 >= 0) {
			parts.push(text.substring(0, p2));
			text = text.substring(p2 + 2);
		}
		else {
			parts.push(text);
			text = '';
		}
	}
	
	if (text && text.length)
		parts.push(text);
	
	return parts;
}

return {
	compileExpression: function (text) {
		return new Function('$model', 'with ($model) { return ' + text + '; }');
	},
	
	compileText: function (text) {
		var parts = split(text);
		
		var expr = '';
		
		for (var n in parts) {
			var part = parts[n];
			
			if (!part.length)
				continue;
				
			if (expr.length)
				expr += ' + ';
				
			if (n % 2 == 0)
				expr += JSON.stringify(part);
			else
				expr += '(function() { with ($model) { return ' + part.trim() + '; }})()';
		}
		
		return new Function('$model', 'return ' + expr);
	}
};

	
})();

var vyu = (function() {
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
		window.addEventListener('load', function () {
			var elem = doc.getElementById(vm.el.substring(1));
			
			if (elem)
				compileTextNodes(elem, viewmodel);
		});
	
	return mod;
}

return {
	model: createModel
}

	
})();
