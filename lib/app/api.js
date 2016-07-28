(function() {
	this.Api = function(options)
	{
		options || (options = {});

		var call = function(method, resource, data, options)
		{
			options || (options = {});
			if(!options.getvars) options.getvars = {};

			var url = this.endpoint + resource;
			var headers = {};
			var merge = function(to, from)
			{
				Object.keys(from).forEach(function(k) { to[k] = from[k]; });
			}
			merge(headers, this.options.headers || {});
			merge(headers, options.headers || {});
			if(this.options.logger) this.options.logger('api: call: '+method+' '+url);
			return Sexhr({
				url: url,
				emulate: true,
				method: method,
				data: JSON.stringify(data),
				querydata: options.getvars || {},
				headers: headers,
				timeout: 20000
			}).bind(this)
				.spread(function(res, xhr) {
					return JSON.parse(res);
				})
		}.bind(this);

		// exports
		this.options = options;
		this.endpoint = config.api_url;
		this.call = call;
		['get', 'post', 'put', 'del'].forEach(function(fn) {
			this[fn] = call.bind(this, fn);
		}.bind(this));
	}
}).apply(typeof(module) != 'undefined' ? module.exports : window);

