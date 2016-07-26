/**
 * A dumping ground for helper functions
 */

/**
 * stop a DOM event from running. silently ignores non-DOM args passed
 */
function stopevent(e)
{
	if(!e) return false;
	if(e.preventDefault) e.preventDefault();
	if(e.stopPropagation) e.stopPropagation();
	return e;
}

/**
 * wrapper for asset loading. instead of embedding paths directly, use this
 * function. it will make things much easier down the road if scaling to a CDN
 * or something
 */
function asset(path)
{
	return path;
}

/**
 * wraps grabbing the true intent of an error message
 */
function derr(error)
{
	return error;
}

// view helpers
var view = {
	render: function(tpl, data, options)
	{
		data || (data = {});
		options || (options = {});

		if(!ViewTemplates[tpl]) throw new Error('missing template: '+ tpl);
		return ViewTemplates[tpl](data);
	},

	fix_template_paths: function()
	{
		// handlebars CLI is different on linux vs mac wrt how it treats slashes
		// in the recursive view directory soo we have to run a fix here
		Object.keys(ViewTemplates).forEach(function(key) {
			var path = key.replace(/^\//, '');
			ViewTemplates[path] = ViewTemplates[key];
		});
	},
};

