
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
	
	document.loaded();
	
	var div = document.getElementById('app');
	
	test.ok(div);
	test.ok(div.childNodes);
	test.equal(div.childNodes.length, 1);
	
	var text = div.childNodes[0];
	
	test.equal(text.nodeType, 3);
	test.equal(text.nodeValue, ' Adam ');
	
	model.name = "Eve";
	test.equal(text.nodeValue, ' Eve ');
};

exports['associate model to element property'] = function (test) {
	var document = createDocument('<div id="app"><h1 v-bind:title="message">Hello</h1></div>');
	
	test.ok(document.getElementById('app'));
	
	var model = vyu.model({
		el: "#app",
		data: function () {
			return {
				message: "Hello world"
			}
		}
	},
	document);
	
	test.ok(model);
	test.equal(model.message, "Hello world");
	
	document.loaded();
	
	var h1 = document.getElementsByTagName('h1')[0];
	
	test.ok(h1);
	test.equal(h1.getAttribute('title'), "Hello world");
	test.equal(h1.getAttribute('v-bind:title'), null);
	
	model.message = "Hola mundo";

	test.equal(model.message, "Hola mundo");
	var h1 = document.getElementsByTagName('h1')[0];
	test.equal(h1.getAttribute('title'), "Hola mundo");
};

exports['using v-if'] = function (test) {
	var document = createDocument('<div id="app"><h1 v-if="show">Hello</h1><h2>World</h2></div>');
	
	test.ok(document.getElementById('app'));
	
	var model = vyu.model({
		el: "#app",
		data: function () {
			return {
				show: true
			}
		}
	},
	document);
	
	test.ok(model);
	test.ok(model.show);
	
	document.loaded();
	
	var h1 = document.getElementsByTagName('h1')[0];
	
	test.ok(h1);
	test.equal(h1.innerHTML, 'Hello');
	test.equal(h1.getAttribute('v-if'), null);
	
	var h2 = document.getElementsByTagName('h2')[0];
	
	test.ok(h2);
	test.equal(h2.innerHTML, 'World');

	model.show = false;
	test.equal(model.show, false);
	
	test.equal(document.getElementsByTagName('h1').length, 0);
	
	var h2 = document.getElementsByTagName('h2')[0];
	
	test.ok(h2);
	test.equal(h2.innerHTML, 'World');

	model.show = true;
	test.ok(model.show);
	
	var h1 = document.getElementsByTagName('h1')[0];
	
	test.ok(h1);
	test.equal(h1.innerHTML, 'Hello');
	test.equal(h1.getAttribute('v-if'), null);
	
	var h2 = document.getElementsByTagName('h2')[0];
	
	test.ok(h2);
	test.equal(h2.innerHTML, 'World');
};

function createDocument(text) {
	var document = domie.document();
	var body = document.getElementsByTagName('body')[0];
	body.innerHTML = text;
	
	return document;
}

