/**
 * barfr.js
 * ---
 * This is a wonderful notification system box that's simple, clean, and works well. 
 * 
 * 
 * Copyright (c) 2009, Lyon Bros Enterprises, LLC. (http://www.lyonbros.com)
 * 
 * Licensed under The MIT License. 
 * Redistributions of files must retain the above copyright notice.
 * 
 * @copyright	Copyright (c) 2009, Lyon Bros Enterprises, LLC. (http://www.lyonbros.com)
 * @package		modal
 * @license		http://www.opensource.org/licenses/mit-license.php
 */

/**
 * The barfr class, using the Composer class object. 
 * 
 * @author		Jeff and Andrew Lyon <jeff@lyonbros.com>
 */
var Barfr = Composer.Controller.extend({
	class_name: 'barfr',
	inject: 'body',

	elements: {
		'ul': 'el_list'
	},

	events: {
		'mouseover ul': 'mouseover',
		'mouseout ul': 'mouseout',
		'click li': 'close_barf'
	},

	/**
	 * Configurable options - these are safe to tweak and change
	 */
	options: {
		// if true, barfs don't timeout
		persist: false,

		// the default timeout for messages
		timeout: 5000,
		
		// if true, will be verbose about errors (using alert boxes)
		debug_mode: true,

		// if true, we won't let the same message be added twice in a row
		prevent_duplicates: true
	},
	
	// ---------------------------------------------------------------
	// You probably don't want to edit anything under this line, unless you are 5uP3r 1337 h4x0r (1yk3 u5)!!
	// ---------------------------------------------------------------
	
	/**
	 * Object containing objects for the various barf messages
	 */
	barfs: {},

	/**
	 * Counts how many barfs we have open (since Object.length doesn't work right)
	 */
	barf_count: 0,

	/**
	 * Most recent barf id
	 */
	most_recent_barf_id: '',

	/**
	 * Whether the mouse cursor is over our silly list of messages
	 */
	mouse_over: false,
		
	init: function()
	{
		this.render();
	},

	render: function()
	{
		this.html([
			'<ul style="display: none;"></ul>'
		].join('\n'));
	},

	barf: function(msg, options)
	{
		options || (options = {});

		var msg = msg.replace(/<\/?script(.*?)>/ig, '');
		var merged_options = Composer.object.merge({}, this.options, options);

		if (this.options.prevent_duplicates && this.most_recent_barf_id && this.barfs[this.most_recent_barf_id] && this.barfs[this.most_recent_barf_id].msg == msg)
			return false;

		if (options.title) msg = '<h2>'+options.title+'</h2>'+msg;

		var id = new Date().getTime() + Math.random();

		var li = document.createElement('li');
		li.setAttribute('data-id', id);
		li.innerHTML = msg + '<a href="#" class="close"></a>';
		if(this.el_list.firstChild) this.el_list.insertBefore(li, this.el_list.firstChild);
		else this.el_list.appendChild(li);

		this.el_list.style.display = 'block';

		$(li).hide().slideDown();
		var timer = null;
		this.barfs[id] = {
			id: 		id,
			li: 		li,
			msg: 		msg,
			barfr: 		this,
			timer: 		null,
			options: 	merged_options,

			init_timer: function()
			{
				this.timer = setTimeout(this.timer_end.bind(this), this.options.timeout);
			},
			timer_end: function()
			{
				if (this.barfr.mouse_over)
					this.init_timer();
				else
					this.barfr.close_barf({target: li});
			}
		};
		this.barf_count++;
		this.most_recent_barf_id = id;

		this.barfs[id].init_timer();

		return id;
	},

	close_barf: function(e)
	{
		var li = Composer.find_parent('li', e.target);
		var id = li.getAttribute('data-id');
		var barf = this.barfs[id];
		if(!barf) return;
		$(barf.li).slideUp(this.destroy_barf.bind(this, id));
	},

	destroy_barf: function(id)
	{
		// the li is wrapped in a div, courtesy of the slider
		var barf = this.barfs[id];
		if(!barf) return;
		barf.li.remove()
		delete this.barfs[id];
		this.barf_count--;

		if (this.barf_count == 0)
			this.el_list.style.display = 'none';
	}
});

