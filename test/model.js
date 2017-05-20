var model = require('../lib/model');

exports['create model and get properties'] = function (test) {
	var result = model({ name: 'Adam', age: 800 });
	
	test.ok(result);
	test.equal(result.name, 'Adam');
	test.equal(result.age, 800);
};

exports['create model from function and get properties'] = function (test) {
	var result = model(function () { return { name: 'Adam', age: 800 }; });
	
	test.ok(result);
	test.equal(result.name, 'Adam');
	test.equal(result.age, 800);
};
 