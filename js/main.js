(function() {
  var requestAnimationFrame = window.requestAnimationFrame 
  	|| window.mozRequestAnimationFrame 
  	|| window.webkitRequestAnimationFrame 
  	|| window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();
(function($){

	var app = Bowler();
	app.render("{{{logo}}}<h1>{{title}}</h1>{{{child \"tagline\"}}}{{{child \"page\"}}}<a href={{href}} class=\"button secondary\">{{action}}</a>");
	app.bind('.eight');
	app.extend({
		"title" : "Bowler.js",
		"href" : "https://github.com/jacoblwe20/bowler",
		"action" : "View more on Github.com",
		"logo" : "<div class=\"logo\"><i class=\"background\"></i><i class=\"highlights\"></i><i class=\"band\"></i><i class=\"band-highlights\"></i></div>"
	});
	var tagline = app.Model('tagline', {tagline : "Bowler like the hat!"});
	var taglineView = app.View('tagline', "<p class=\"tagline\">{{tagline}}</p>");
	var page = app.Model('page');
	var pageView = app.View('page'); 
	pageView.render("{{#each contents}}<{{tag}}>{{{content}}}</{{tag}}>{{/each}}");

	page.get('json/main.json', function(err, res){});

	var current = 0;
	var taglines = [
		"Bowler.js is a Model / View framework for the gentleman in you.",
		"Bowler.js is a Model / View framework for the BADA55 in you.",
		"Bowler.js is a Model / View framework for the manly man in you."
	];

	var Tagline = function(){
		if(current === taglines.length){
			current = 0;
		}else{
			current += 1;
		};
		tagline.extend({tagline : taglines[current]});
		window.setTimeout(function(){

			if(window.requestAnimationFrame){
				window.requestAnimationFrame(Tagline);
			}else{
				Tagline();
			}

		},3000)
	};

	Tagline();
	
}(jQuery))