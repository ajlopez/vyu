
var compiler = require('../lib/compiler');

exports['compile using model property'] = function (test) {
	var fn = compiler.compile('name');
	
	test.ok(fn);
	test.equal(typeof fn, 'function');
	
	var result = fn({ name: 'Adam' });
	
	test.ok(result);
	test.equal(result, 'Adam');
};

exports['compile using model property and function'] = function (test) {
	var fn = compiler.compile('name.toUpperCase()');
	
	test.ok(fn);
	test.equal(typeof fn, 'function');
	
	var result = fn({ name: 'Adam' });
	
	test.ok(result);
	test.equal(result, 'ADAM');
};

