var PagesController = Composer.Controller.extend({
	load: function(controller_class, params, options)
	{
		params || (params = {});
		options || (options = {});

		this.trigger('start');
		if(!options.force_reload && this.is(controller_class))
		{
			this.trigger('refresh');
			this.sub('sub').trigger('page:refresh');
			return;
		}

		var controller = this.sub('sub', function() {
			if(!params.inject) params.inject = app.main_selector;
			return new controller_class(params);
		}.bind(this));
		this.trigger('load', controller, options);
	},

	is: function(types)
	{
		var sub = this.sub('sub');
		if(!Array.isArray(types)) types = [types];
		for(var i = 0; i < types.length; i++)
		{
			var type = types[i];
			if(sub instanceof type) return true;
		}
		return false;
	}
});

