var MessagesListController = Composer.ListController.extend({
	xdom: true,

	elements: {
		'ul': 'el_list'
	},

	messages: null,

	init: function()
	{
		if(!this.messages) throw new Error('please provide a messages collection');
		this.render()
			.bind(this)
			.then(function() {
				this.track(this.messages, function(model, options) {
					var con = new MessagesItemController({
						inject: options.container,
						model: model
					});
					return con;
				}, {container: this.el_list});
			});
	},

	render: function()
	{
		return this.html(view.render('messages/list', {}));
	}
});

