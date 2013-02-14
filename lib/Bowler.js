var jQuery = (typeof require !== 'undefined') ? require('jquery') : (jQuery) ? jQuery : null;
var Handlebars = (typeof require !== 'undefined') ? require('handlebars') : (Handlebars) ? Handlebars : null;

(function(exports, $, Handlebars){

  var Bowler = function(){
    if(!(this instanceof Bowler)){
      return new Bowler();
    }
    var that = this;
    that._models = {};
    that._views = {};

    that.Model = function(name, object){
      if(!(name)){
        return name;
      }
      if(!(this instanceof that.Model)){
        return new that.Model(name, object);
      }
      if(that.model && typeof that.model._children === 'undefined'){
        that.model._children = {};
      }
      var model = this;
      model.model = {};

      model.extend = function(obj){
        if(typeof obj === 'object'){
          $.extend(model.model, obj);
          model.update();
          return model.model;
        }else{
          return null;
        }
      };

      model.get = function(path, callback){
        if(path && typeof path === 'string'){
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
          		model.extend(res);
          		callback(null, res);
          	}
          })
        }else{
          callback({error: 'path not specified'}, null);
        }
      };

      model.update = function(){
        if(that._views[name]){
          that._views[name].render();
        }
      };

      if(object){
        model.extend(object);
      }

      that._models[name] = model;

      return model;
    };

    that.View = function(name, template){
      if(!(name)){
        return name;
      }
      if(!(this instanceof that.View)){
        return new that.View(name, template);
      }
      var view = this;
      view.render = function(str){
        if(typeof str === 'undefined'){
          str = template;
        }else{
          template = str;
        }
        view.template = view.compile(str);
        if(that._models[name]){
          view.view = view.template(that._models[name].model);
          if(view.ele){
            view.ele.html(view.view);
          }
          if(that.model._children){
            that.model._children[name] = view.view;
          }
          if(that._children && typeof that._children[name] === 'string'){
            that.render();
          }
          return view.view;
        }
        view.template = view.compile(template);
        return view.template;
      };
      view.bind = function(selector){
        view.ele = $(selector);
        if(view.view){
          view.ele.html(view.view);
        }
        return view.ele;
      };
      $.extend(view, Handlebars);

      if(template){
        view.render();
      }
      that._views[name] = view;

      return view;
    };

    $.extend(that, that.Model('bowler'));
    $.extend(that, that.View('bowler'));

    Handlebars.registerHelper('child', function(context, options) {
      if(!that._children){
        that._children = {};
      }
      that._children[context] = "true";
      if(this._children && typeof this._children[context] === 'string'){
        return new Handlebars.SafeString(this._children[context].toString());
      }
    });

    return that;
  };

  exports.Bowler = Bowler;

}(this, jQuery, Handlebars));
