
var vyu = require('..');
var domie = require('domie');

exports['vyu as object'] = function (test) {
	test.ok(vyu);
	test.equal(typeof vyu, 'object');
};

exports['associate model to document'] = function (test) {
	var document = createDocument('<div id="app"> {{ name }} </div>');
	var model = vyu.model({
		el: "#app",
		data: function () {
			return {
				name: "Adam",
				age: 800
			}
		}
	},
	document);
	
	test.ok(model);
	test.equal(model.name, "Adam");
	test.equal(model.age, 800);
	
	var div = document.getElementById('app');
	
	test.ok(div);
	test.equal(div.childNodes[0].nodeValue, ' {{ name }} ');
	test.ok(div.vyu);
	test.ok(div.vyu.fn);
	test.equal(div.vyu.fn(), " Adam ");
};

function createDocument(text) {
	var document = domie.document();
	var body = document.getElementsByTagName('body')[0];
	body.innerHTML = text;
	
	return document;
}