(function($){

	var app = Bowler();
	app.render("{{{logo}}}<h1>{{title}}</h1>{{{child \"page\"}}}<a href={{href}} class=\"button secondary\">{{action}}</a>");
	app.bind('.eight');
	app.extend({
		"title" : "Bowler.js",
		"href" : "https://github.com/jacoblwe20/bowler",
		"action" : "View more on Github.com",
		"logo" : "<div class=\"logo\"><i class=\"background\"></i><i class=\"highlights\"></i><i class=\"band\"></i><i class=\"band-highlights\"></i></div>"
	});
	var page = app.Model('page');
	var pageView = app.View('page'); 
	pageView.render("{{#each contents}}<{{tag}}>{{{content}}}</{{tag}}>{{/each}}");

	page.extend({
		"contents" : [
			{
				"tag" : "p",
				"content" : "Bowler.js is a Model / View framework for the gentleman in you."
			},
			{
				"tag" : "h4",
				"content" : "Use it"
			},
			{
				"tag" : "p",
				"content" : "Bowler is super simple to use. Just include the file then..."
			},
			{
				"tag" : "pre",
				"content" : "<code>var app = Bowler();\n\
app.extend({title : \"hello\"});\n\
app.render('&lt;p&gt;{{title}}&lt;/p&gt;');\n\
app.bind('body');</code>"
			},
			{
				"tag" : "h4",
				"content" : "Child Models"
			},
			{
				"tag" : "p",
				"content" : "Whats the use of only having one model. Bowler supports child models."
			},
			{
				"tag" : "pre",
				"content" : "<code>var page = app.Model('page', { world: \"universe\" });\
var pageView = app.View('page', \"&lt;b&gt;{{universe}}&lt;/b&gt;\");\n\
//changing the main models template\n\
app.render(\"&lt;h1&gt;{{title}}{{{child \"world\"}}}&lt;/h1&gt;\");</code>"
			},
		]
	});
	
}(jQuery))