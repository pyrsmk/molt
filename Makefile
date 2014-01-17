NAME	= molt
VERSION	= grep -m 1 Version src/${NAME}.js | cut -c19-
W		= ls lib | grep W

all: lint minify

lint:
	jshint src/${NAME}.js --config config/jshint.json

minify:
	rm -f ${NAME}*
	uglifyjs src/${NAME}.js > ${NAME}-`${VERSION}`.min.js
	cat lib/`${W}` ${NAME}-`${VERSION}`.min.js > ${NAME}-`${VERSION}`.W.min.js

instdeps:
	npm install jshint -g
	npm install uglify-js -g
