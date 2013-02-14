var jQuery = require('jquery');
var Bowler = require("../lib/Bowler.js").Bowler
var assert = require("assert")

describe('Bowler', function(){
	it('should be a function', function(){
		assert.equal('function', typeof Bowler)
	}); 
	it('should return an object', function(){
		assert.equal('object', typeof Bowler())
	});

	it('Extend should be a function', function(){
		var bowler = Bowler()
		assert.equal('function', typeof bowler.extend)
	})

	describe('Model', function(){

		it('should return an object', function(){
			var bowler = Bowler()
			assert.equal('object', typeof bowler.model);
		})

		it('should have a child object when there are children models', function(){
			var bowler = Bowler()
			var hello = bowler.Model('hello', {hello : 'world'})
			assert.equal('object', typeof bowler.model._children)
		})

		describe('Contructor', function(){
			it('should be a function', function(){
				var bowler = Bowler()
				assert.equal('function', typeof bowler.Model)
			})
			it('should return a null if empty', function(){
				var bowler = Bowler()
				assert.equal('undefined', typeof bowler.Model())
			})
			it('should return an object', function(){
				var bowler = Bowler()
				assert.equal('object', typeof bowler.Model('hello'));
			})
			it('should return an object', function(){
				var bowler = Bowler()
				var hello = bowler.Model('hello')
				assert.equal('object', typeof hello.model);
			})
			it('Extend should be a function', function(){
				var bowler = Bowler()
				var hello = bowler.Model('hello')
				assert.equal('function', typeof hello.extend)
			})
			it('should store value by extending', function(){
				var bowler = Bowler()
				var hello = bowler.Model('hello')
				hello.extend({title: 'world'});
				assert.equal('world', hello.model.title);
			})
			it('should store value when passing in obj as second argument', function(){
				var bowler = Bowler()
				var hello = bowler.Model('hello', {title: 'world'})
				assert.equal('world', hello.model.title);
			})
			it('should not pass value to parent by extending', function(){
				var bowler = Bowler()
				var hello = bowler.Model('hello')
				hello.extend({title: 'world'});
				assert.equal('undefined',typeof bowler.model.title);
			})
			it('Get should be a function', function(){
				var bowler = Bowler()
				var hello = bowler.Model('hello')
				assert.equal('function',typeof hello.get);
			})
			it('Get should be a function', function(){
				var bowler = Bowler()
				var hello = bowler.Model('hello')
				assert.equal('function',typeof hello.get);
			})
		})
	})

	describe('View', function(){
		describe('Contructor', function(){
			it('should be a function', function(){
				var bowler = Bowler()
				assert.equal('function', typeof bowler.View)
			})
			it('should return a null if empty', function(){
				var bowler = Bowler()
				assert.equal('undefined', typeof bowler.View())
			})
			it('should return an object', function(){
				var bowler = Bowler()
				assert.equal('object', typeof bowler.View('hello'))
			})
			//once we know this then we know handlebars is installed
			it('Compile should be a function', function(){
				var bowler = Bowler()
				var helloView = bowler.View('hello')
				assert.equal('function', typeof helloView.compile);
			})

			it('Render should be a function', function(){
				var bowler = Bowler()
				var helloView = bowler.View('hello')
				assert.equal('function', typeof helloView.render)
			})

			it('Render should return a function when no model is defined', function(){
				var bowler = Bowler()
				var helloView = bowler.View('hello')
				assert.equal('function', typeof helloView.render('<p>{{hello}}</p>'))
			})

			it('Render should return a string when a model is defined', function(){
				var bowler = Bowler()
				var hello = bowler.Model('hello')
				hello.extend({hello : 'world'})
				var helloView = bowler.View('hello')
				assert.equal('<p>world</p>', helloView.render('<p>{{hello}}</p>'))
			})

			it('Render should modify the content of bind element', function(){
				var bowler = Bowler()
				var hello = bowler.Model('hello', {hello : 'world'})
				var helloView = bowler.View('hello')
				var ele = helloView.bind('<div/>')
				helloView.render('<p>{{hello}}</p>')
				assert.equal('<p>world</p>', ele.html())
			})

			it('should set a string to view when a template is passed in as second argument', function(){
				var bowler = Bowler()
				var hello = bowler.Model('hello', {hello : 'world'})
				var helloView = bowler.View('hello', '<p>{{hello}}</p>')
				assert.equal('string', typeof helloView.view)
			})

			it('Render should update view when a model is changed', function(){
				var bowler = Bowler()
				var hello = bowler.Model('hello')
				hello.extend({hello : 'world'})
				var helloView = bowler.View('hello', '<p>{{hello}}</p>')
				assert.equal('<p>world</p>', helloView.view)
				hello.extend({hello : 'universe'})
				assert.equal('<p>universe</p>', helloView.view)
			})

			it('should modify the content of bind element when model is updated', function(){
				var bowler = Bowler()
				var hello = bowler.Model('hello', {hello : 'world'})
				var helloView = bowler.View('hello', '<p>{{hello}}</p>')
				var ele = helloView.bind('<div/>')
				hello.extend({'hello': 'universe'})
				assert.equal('<p>universe</p>', ele.html())
			})

			it('Bind should be a function', function(){
				var bowler = Bowler()
				var helloView = bowler.View('hello')
				assert.equal('function', typeof helloView.bind)
			})

			it('Bind should return a instance of jQuery', function(){
				var bowler = Bowler()
				var helloView = bowler.View('hello')
				assert.equal(true, (helloView.bind() instanceof jQuery))
			})

			it('Bind should modify the content of bind element', function(){
				var bowler = Bowler()
				var hello = bowler.Model('hello', {hello : 'world'})
				var helloView = bowler.View('hello', '<p>{{hello}}</p>')
				var ele = helloView.bind('<div/>')
				assert.equal('<p>world</p>', ele.html())
			})

			it('should pass the compiled template to parent model', function(){
				var bowler = Bowler()
				var hello = bowler.Model('hello', {hello : 'world'})
				var helloView = bowler.View('hello', '<p>{{hello}}</p>')
				assert.equal('<p>world</p>', bowler.model._children.hello)
			})

			it('template should be availble in parent model through hanldbars helper', function(){
				var bowler = Bowler()
				var hello = bowler.Model('hello', {hello : 'world'});
				var helloView = bowler.View('hello', '<p>{{hello}}</p>');
				assert.equal('<p>world</p>', bowler.render('{{child "hello"}}'))	
			})

		})
	});

})