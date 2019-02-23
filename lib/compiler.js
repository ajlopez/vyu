
function split(text) {
	const parts = [];
	
	for (var p = text.indexOf('{{'); p >= 0; p = text.indexOf('{{')) {
		const part = text.substring(0, p);
		parts.push(part);
		
		text = text.substring(p + 2);
		const p2 = text.indexOf('}}');
		
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

module.exports = {
	compileExpression: function (text) {
		return new Function('$model', 'with ($model) { return ' + text + '; }');
	},
	
	compileText: function (text) {
		const parts = split(text);
		
		var expr = '';
		
		for (var n in parts) {
			const part = parts[n];
			
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

