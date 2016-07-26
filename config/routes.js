/**
 * This file holds our routing table for the app. It maps regex routes to object
 * function pairs under handlers/
 */

if(!window.config) window.config = {};

config.routes = {
	'/': ['conversations', 'index']
};

