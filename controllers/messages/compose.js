var MessagesComposeController = Composer.Controller.extend({
	xdom: true,
	class_name: 'message-compose',

	elements: {
		'input[name=body]': 'inp_body'
	},

	events: {
		'submit form': 'submit'
	},

	model: null,

	init: function()
	{
		if(!this.model) throw new Error('please provide a Message model');

		this.render();
		this.bind('clear', this.clear.bind(this));
	},

	render: function()
	{
		return this.html(view.render('messages/compose', {
			message: this.model.toJSON()
		}));
	},

	submit: function(e)
	{
		stopevent(e);
		var body = $(this.inp_body).val().trim();
		if(!body) return;
		this.model.set({body: body});
		this.trigger('submit');
	},

	clear: function()
	{
		$(this.inp_body).val('');
	}
});

