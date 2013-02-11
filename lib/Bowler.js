var jQuery = (typeof require !== 'undefined') ? require('jquery') : (jQuery) ? jQuery : null;
var Handlebars = (typeof require !== 'undefined') ? require('handlebars') : (Handlebars) ? Handlebars : null;

(function(exports, $){

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
          			error: 'cannot retrieve data', 
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
          return view.view;
        }
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

    return that;
  };

  exports.Bowler = Bowler;

}(this, jQuery));
