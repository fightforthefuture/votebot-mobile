var MessagesItemController = Composer.Controller.extend({
	xdom: true,
	tag: 'li',
	class_name: 'message',

	model: null,

	init: function()
	{
		this.render();
		this.with_bind(this.model, 'change', this.render.bind(this));
	},

	render: function()
	{
		var data = this.model.toJSON();

		// TODO: remove once messages have data filled in
		data.username = data.user_id;

		return this.html(view.render('messages/item', {
			message: data
		}));
	}
});

