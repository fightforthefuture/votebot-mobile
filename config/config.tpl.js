/**
 * This file holds the main app config. It's meant not to be versioned, and can
 * hold things like API urls, error handling switches, etc...anything that can
 * change on a per-machine basis goes in there.
 */

if(!window.config) window.config = {};

config.api_url = 'http://api.votereg.dev:3000';		// NO trailing slash

