// notification popup
var barfr;

// global object for tracking app state and objects
var app = {
	// holds our current user
	user: new User(),

	// holds the Composer routing object
	router: null,

	// our page controller is responsible for loading top-level controllers that
	// build our pages. basically, our router calls into a handler, and the
	// handler uses the page controller to load the corresponding page for that
	// route.
	pages: new PagesController(),

	// holds our object that talks to the API
	api: new Api({
		logger: log.info.bind(log),
		headers: {'Content-Type': 'application/json'}
	}),

	// where we inject our top-level controllers
	main_selector: '#main',

	init: function()
	{
		this.setup_router();
		this.setup_user();
	},

	/**
	 * create our app's router object from our routes (config.routes)
	 */
	setup_router: function(options)
	{
		// are we already setup? bail
		if(this.router) return;

		// merge the passed-in options with some defaults
		var opts = Composer.object.merge({
			suppress_initial_route: true
		}, options);

		// create the router, and set up some bindings
		this.router = new Composer.Router(config.routes, opts);
		this.router.bind('route', this.pages.trigger.bind(this.pages, 'route'));
		this.router.bind('preroute', this.pages.trigger.bind(this.pages, 'preroute'));
		this.router.bind('fail', function(obj) {
			log.error('route failed:', obj.url, obj);
		});
	},

	/**
	 * set up bindings to the user object (login/logout mainly)
	 */
	setup_user: function()
	{
		// TODO: handle login binding and stuff when we get there
		this.user.bind('login', function() {
			this.route('/');
		}.bind(this));
		this.user.bind('logout', function() {
		}.bind(this));

		// TODO: remove when real login system is in place
		this.user.trigger('login');
	},

	/**
	 * wrapper around app.router.route that does some checks for us (and makes
	 * it easier to route: app.route() vs app.router.route()...i'm lazy)
	 */
	route: function(url, options)
	{
		options || (options = {});
		this.setup_router(options);
		if(
			!this.user.loggedin() &&
			!url.match(/\/users\/login/) &&
			!url.match(/\/users\/join/)
		)
		{
			url = '/users/login';
		}
		this.router.route(url, options);
	}
};

$(document).ready(function() {
	// handlebars CLI is treats paths differently on OSx/*nix (at least, the old
	// version did). this is a quick fix.
	view.fix_template_paths();

	barfr = new Barfr();

	// run our app
	app.init();
});

