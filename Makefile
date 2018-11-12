server:
	cd scripts; node server.js;

static_content:
	rm -rf static_content
	mkdir static_content
	mkdir static_content/html
	cd scripts; node staticContentGenerator.js
