var ConversationsRecipientsController = Composer.Controller.extend({
	xdom: true,
	class_name: 'recipients',

	elements: {
		// TODO: change once we have multiple recipients
		'input[name=to]': 'inp_to'
	},

	events: {
		'input input[name=to]': 'update_recipient'
	},

	recipients: null,

	init: function()
	{
		if(!this.recipients) throw new Error('please provide a recipients collection');

		// TODO: change once we have multiple recipients
		var recipient = new Recipient();
		this.recipients.add(recipient);
		this.bind('update-recipient', function(number) {
			recipient.set({username: number});
		});

		this.with_bind(this.recipients, ['change', 'add', 'remove', 'reset'], this.render.bind(this));
		this.render();
	},

	render: function()
	{
		var recipients = this.recipients.toJSON();
		this.html(view.render('conversations/recipients', {
			recipients: recipients
		}));
	},

	// TODO: change once we have multiple recipients
	update_recipient: function(e)
	{
		var to = $(this.inp_to).val();
		if(to) this.trigger('update-recipient', to);
	}
});

