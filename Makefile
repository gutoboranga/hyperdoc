server:
	cd scripts; node server.js;

staticContent:
	rm -rf static_content
	mkdir static_content
	mkdir static_content/html
	cd scripts; node staticContentGenerator.js
