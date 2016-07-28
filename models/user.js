var User = Composer.Model.extend({
	_logged_in: true,

	loggedin: function()
	{
		return this._logged_in;
	}
});

var Users = Composer.Collection.extend({
    model: User
});