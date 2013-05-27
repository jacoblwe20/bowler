/*
 * Bowler.js - 0.0.6 
 * Description : a simple MV framework using handlebars & jQuery 
 * Project Url : https://github.com/jacoblwe20/bowler.git 
 * Author : Jacob Lowe <jacoblowe.me> 
 * License : MIT 
 */

var jQuery = (typeof require !== 'undefined') ? require('jquery') : (jQuery) ? jQuery : null;
var Handlebars = (typeof require !== 'undefined') ? require('handlebars') : (Handlebars) ? Handlebars : null;


(function(exports){

	// Marrow Constructor
	// the first argument in the component which is just a function
	// that acts as the initial constructor function for the component.
	// the second argument is a callback function that you can pass in
	// another callback function where the first argument is the `this`
	// prototype of Marrow. returns the first prameter with an extended
	// prototype

	var Marrow = function( component, fn ){ 
		if( !( this instanceof Marrow ) ){
			return new Marrow( component );
		}

		// return it extended with our goodness
		if( typeof fn === "function" ){
			fn( this );
		}
		// extend component 
		component.prototype = this;
		

		return component;
	};

	// Marrow.plus is a mapping to the Marrow.prototype that
	// allows the extension of Marrow without using plus

	Marrow.prototype = Marrow.plus = {};

	// Marrow::getState returns the state of the component

	Marrow.prototype.getState = function(){
		return this.__state;
	};

	// Marrow::setState first parameter gets set as value of the 
	// __state which is return in getState. Need to be a Number
	// if not it will be evaluated as NaN

	Marrow.prototype.setState = function( value ){
		this.__state = +value; // + with evaluate this value a interger
	};

	exports.Marrow = Marrow;

}(this));

var Marrow = (Marrow) ? Marrow : exports.Marrow; // map if not avail

(function(Marrow){

	// Marrow::__events creates the _events object ~ can probably
	// be phased out

	Marrow.prototype.__events = function(){
		this._events = {};
	};

	// Marrow::on is a way to bind to a event emitted by the object
	// The first parameter is a String that defined what event type
	// that you want to attach to. The second parameter is a function
	// that will be queued and executed once the evnt fires

	Marrow.prototype.on = function( event, callback ){

		if(
			typeof callback === "function" &&
			typeof event === "string"
		){
			if( !this._events ){
				this.__events(); // create events object
			}

			if( typeof this._events[ event ] !== "object" ){
				this._events[ event ] = [];
			}

			if( typeof this._events[ event ].length === "number" ){
				this._events[ event ].push( callback );
			}
		}

		return this;
	};

	// Marrow::off is a way to remove a binding to an event that would
	// be attached with the on method. The first parameter is a String
	// with the name of the event you want to unbind from this is optional,
	// when omited all events will be unbound from object. The second parameter
	// is a funcion that is a referance to a function that was bound to an event
	// this will only remove that one binding. The second argument is also
	// optional and when omitted will then unbind and bindings to the specified
	// event in the first parameter

	Marrow.prototype.off = function( event, fn ){
		if(
			typeof this._events === "object" &&
			typeof event === "string" &&
			typeof this._events[ event ] === "object" && 
			this._events[ event ].length
		){

			var events = this._events[ event ];

			if( typeof fn === "function" ){

				for( var i = 0; i < events.length; i += 1 ){

					if( events[i] === fn ){ 
						delete events[ i ]; // remove specific fn
					}

				}

			}else{
				events = []; // remove all events in group
			}

		}else if( !event ){
			this._events = {}; // remove all
		}

	};

	// Marrow::emit is a way to fire off events to all the binding functions
	// The first parameter in emit is the event type as a String this is 
	// a referance used to bind the events to functions. Emit will also take
	// any other parameters passed into the emits method and will pass them to
	// the and event binds... only omiting the first parameter, the event type.
	// eg. obj.on("payload", function(payload){ /*Do stuff with payload*/});
	// obj.emit("payload", payload);

	Marrow.prototype.emit = function( event ){

		if(
			typeof this._events === "object" &&
			typeof event === "string" &&
			typeof this._events[ event ] === "object" && 
			this._events[ event ].length
		){

			var arg = [].slice.call( arguments ); // copying argument so we can pass
			// though a chunk of them

			for( var i = 0; i < this._events[event].length; i += 1 ){
				this._events[ event ][ i ].apply( this, arg.slice( 1 ) ); 
			}
		}

	};

}(Marrow));

(function(Marrow){

	// Marrow::_extend creates a method in the prototype of the
	// object, the first parameter is type (String), which defines the name
	// of the method and allows binding to events on the method.
	// Second argument is state which is the state that gets set 
	// when the method is called, this needs to be a number. The 
	// third argument is the stored value that allows a kinda mapping
	// to the function that is going to be called, this also is a String.	
	// eg. ::to("die", function(){ele.remove()})
	// now you can bind to ::on("die")

	Marrow.prototype.__extend = function(type, state, store){
		var self = this;
		this[ type ] = function(){
			if( typeof this[ store ] === "function" ){
				self[ store ].apply( this, arguments );
			}

			if( typeof state === "number" ){
				self.__state = state;
			}

			self.emit( type );
		};
	};

	// Marrow::to creates a method that will auto fire off an event 
	// with the same name.  The first parameter is type 
	// which is the name of the method and the name of the event
	// to bind to, this is a String. The second argument is a function
	// that you would want to excute when the newly created method is
	// called. The third state parameter is state which is a Number...
	// the number of the state you want you component to go into once the
	// method is called 

	Marrow.prototype.to = function( type, fn, state ){
		if(
			typeof type === "string" &&
			typeof fn === "function"
		){
			var store = "__" + type; // a `private` variable name
			this[ store ] = fn;
			this.__extend( type, state, store );
		}

	};

}(Marrow));

(function(exports, Base, $){

  var Bowler = function(){

    if(!(this instanceof Bowler)){
      return new Bowler();
    }

    // creating some objects to store models
    // and views
    this._models = {};
    this._views = {};

    // create an app model and view 
    $.extend(this, this.View('bowler'));
    $.extend(this, this.Model('bowler'));

    this.Helper(); // add a helper for Handlebars

    return this;

  };

  Bowler = Base(Bowler); // extend with Marrow

  Bowler.prototype.Helper = function(){

    var 
    self = this; // local this

    this.registerHelper('child', function(context, options) {

      if(!self._children){
        self._children = {};
      }

      self._children[context] = "true";

      var ele = $('<span/>')
        .attr('data-bind', context)
        .html(
          ( 
            self._views[context] && 
            typeof self._views[context].view === 'string'
          ) ? 
          self._views[context].view.toString() : 
          ''
        );

      self._children[context] = true;
      return new self.SafeString($('<div/>').append(ele).html());

    });

  };

  exports.Bowler = Bowler;

}(
  // dependecies
  this, 
  Marrow, 
  jQuery
));


(function(Bowler, $){  
  
  var
  // make a local Model variable
  Model;

  Model = Bowler.prototype.Model = function(name, object, context){

    if(!(name)){
      return name;
    }

    if(!(this instanceof Model)){

      if(this instanceof Bowler){
        context = this;
      }

      return new Model(name, object, context);

    }

    this.context = context;

    if(context.model && typeof context.model._children === 'undefined'){
      context.model._children = {};
    }

    this.model = {};

    if(object){
      this.extend(object);
    }

    context._models[name] = this;

    return this;

  };

  Model.prototype.extend = function(obj){
    if(typeof obj === 'object'){
      $.extend(this.model, obj);
      this.update();
      return this.model;
    }else{
      return null;
    }
  };

  Model.prototype.get = function(path, callback){
    if(path && typeof path === 'string'){
      var self = this;
      $.ajax({
        url : path,
        dataType : 'json',
        type : 'get',
        error : function(res){
          callback({
            error: 'cannot retrieve data or was not in json format', 
            originalError : res
          }, null);
        },
        success : function(res){
          self.extend(res);
          callback(null, res);
        }
      });
    }else{
      callback({error: 'path not specified'}, null);
    }
  };

  Model.prototype.update = function(){
    console.log(this);
    if(this.context._views[name]){
      that.context._views[name].render();
    }
  };

}(Bowler, jQuery));

(function(Bowler, Handlebars){

  var
  // make a local Model variable
  View;

  View = Bowler.prototype.View = function(name, template, context){

    if(!(name)){
      return name;
    }

    if(!(this instanceof View)){

      if(this instanceof Bowler){
        context = this;
      }

      return new View(name, template, context);
    }

    this.context = context;
    
    $.extend(this, Handlebars);

    if(template){
      this.render();
    }

    context._views[name] = this;

    this.template = template;
    this.name = name;

    return this;
  };

  View.prototype.render = function(str){

    var
    // map some local variables 
    context = this.context,
    model = context.model,
    name = this.name,
    view = this.view;


    if(typeof str === 'undefined'){
      str = this.template;
    }else{
      this.template = str;
    }

    this.template = this.compile(str);

    if(context._models[name]){

      view = this.template(context._models[name].model);

      if(this.ele){
        this.ele.html(view);
      }

      if(model._children){
        model._children[name] = view;
      }

      if(
        context._children && 
        context._children[name] && 
        !this.ele
      ){
        this.bind('[data-bind="'+ name + '"]');
      }
      return view;
    }

    this.template = this.compile(template);
    return this.template;
  };

  View.prototype.bind = function(selector){

    if(selector instanceof jQuery){
      this.ele = selector;
    }else{
      this.ele = $(selector);
    }

    if(this.view){
      this.ele.html(this.view);
    }

    return this.ele;
  };

}(Bowler, Handlebars));