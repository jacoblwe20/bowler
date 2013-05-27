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