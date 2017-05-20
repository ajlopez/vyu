
var vyu = require('..');

exports['vyu as object'] = function (test) {
	test.ok(vyu);
	test.equal(typeof vyu, 'object');
};

