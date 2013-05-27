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