/**
 * sets up Composer's sync system to use our API
 */
Composer.sync = function(action, model, options)
{
	options || (options = {});

	var methods = {
		read: 'GET',
		create: 'POST',
		update: 'PUT',
		delete: 'DELETE'
	};
	var http_method = methods[action] || 'GET';
	// allow method overriding
	if(options.force_method) http_method = options.force_method;

	var data = null;
	if(['POST', 'PUT'].indexOf(http_method) >= 0)
	{
		// if we're sending the model to an endpoint that reads it, serialize
		data = model.toJSON();
	}

	var url = model.get_url();
	var request_options = {};
	if(options.getvars) request_options.getvars = options.getvars;

	app.api.call(http_method, url, data, request_options)
		.then(options.success)
		.catch(options.error);
};

