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
