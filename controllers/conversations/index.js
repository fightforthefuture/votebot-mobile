var ConversationsController = Composer.Controller.extend({
	xdom: true,
	class_name: 'conversations page',

	elements: {
		'.to': 'el_to',
		'.messages': 'el_messages',
		'.compose': 'el_compose'
	},


	conversation: null,
	message: null,

	init: function()
	{
		if(!this.conversation) this.conversation = new Conversation();
		if(!this.message) this.message = new Message();

		this.render()
			.bind(this)
			.then(function() {
				this.sub('to', function() {
					var con = new ConversationsRecipientsController({
						inject: this.el_to,
						recipients: this.conversation.get('recipients')
					});
					return con;
				}.bind(this));

				this.sub('messages', function() {
					var con = new MessagesListController({
						inject: this.el_messages,
						messages: this.conversation.get('messages')
					});
					return con;
				}.bind(this));

				this.sub('compose', function() {
					var con = new MessagesComposeController({
						inject: this.el_compose,
						model: this.message
					});
					this.with_bind(con, 'submit', this.submit.bind(this));
					return con;
				}.bind(this));
			});
	},

	render: function()
	{
		return this.html(view.render('conversations/index'));
	},

	submit: function()
	{
		this.conversation.send(this.message)
			.bind(this)
			.then(function() {
				var sub = this.sub('compose');
				if(sub) sub.trigger('clear');
			})
			.catch(function(err) {
				log.error('conversation: save: ', derr(err));
				barfr.barf('There was a problem saving your message: '+ err.message);
			});

	}
});

