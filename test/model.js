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

exports['create model with handler and get properties'] = function (test) {
	var visited = {};
	
	var result = model({ 
		name: 'Adam', 
		age: 800 
		},
		{
			handler: {
				get: function (target, name) {
					visited[name] = true;
					return target[name];
				}
			}
		});
	
	test.ok(result);
	
	test.ok(!visited.name);
	test.ok(!visited.age);
	
	test.equal(result.name, 'Adam');
	test.ok(visited.name);
	test.ok(!visited.age);

	test.equal(result.age, 800);
	test.ok(visited.name);
	test.ok(visited.age);
};

