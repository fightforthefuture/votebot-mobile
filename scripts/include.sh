#!/bin/bash

export LC_COLLATE=C

function print_css() {
	cssfile=$1
	echo -ne "\n<link rel=\"stylesheet\" href=\"/$cssfile\">"
}

function print_js() {
	jsfile=$1
	jsfile="`echo $jsfile | sed 's|___| |g'`"
	echo -ne "\n<script src=\"/$jsfile\"></script>"
}

function path_to_js() {
	path=$1
	find $path -name '*.js' | sort | sed 's| |___|g'
}

function all_css() {
	# we want these in a specific order
	echo 'css/reset.css'
	echo 'css/template.css'
	echo 'css/general.css'
	cssfiles="`find css/ -name '*.css' \
		| grep -v 'template.css' \
		| grep -v 'general.css' \
		| grep -v 'common.css' \
		| grep -v 'reset.css' \
		| sort`"
	for cssfile in $cssfiles; do
		echo $cssfile
	done
}

function all_js() {
	type=$1

	if [ "$type" == "" ] || [ "$type" == "vendor" ]; then
		# make sure jquery is first
		ls lib/vnd/jquery-*.*.*.js
		find lib/vnd -name '*.js' \
			| grep -v 'jquery-[0-9\.]\+\.js' \
			| sort
	fi
	
	if [ "$type" == "" ] || [ "$type" == "app" ]; then
		find lib/app -name '*.js' \
			| grep -v 'ignore' \
			| grep -v 'templates' \
			| grep -v '\.thread\.' \
			| sort \
			| sed 's| |___|g'
		for jsfile in $jsfiles; do print_js $jsfile; done

		path_to_js 'config' | grep -v 'config\.tpl\.js'
		path_to_js 'controllers'
		path_to_js 'models'
		path_to_js 'handlers'

		echo 'lib/app/templates.js'
		echo 'main.js'
	fi
}

function do_replace() {
	template=$1
	from=$2
	to=$3

	echo "$template" | awk -v r="${to//$'\n'/\\n}" "{gsub(/${from}/,r)}1"
}

