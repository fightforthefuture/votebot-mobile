Handlebars.registerHelper('equal', function(val1, val2, options) {
	if(val1 == val2)
	{
		return options.fn(this);
	}
	else
	{
		return options.inverse(this);
	}
});

Handlebars.registerHelper('contains', function(val1, val2, options) {
	if(Array.isArray(val1) && val1.contains(val2))
	{
		return options.fn(this);
	}
	else if(typeof(val1) == 'object' && val1[val2])
	{
		return options.fn(this);
	}
	else
	{
		return options.inverse(this);
	}
});

Handlebars.registerHelper('asset', function(url) {
	return asset(url);
});

