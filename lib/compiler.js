

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
	
	return parts;
}

module.exports = {
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

