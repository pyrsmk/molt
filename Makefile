OLD		= ls -l | grep .js | sed -r 's/.+\s(\S+)/\1/'
NAME	= ls src | sed -nr 's/(.+)\.js/\1/p'
VERSION	= grep -m 1 Version src/\`${NAME}\`.js | sed -r 's/.*:\s*(.+)/\1/'
URL		= grep -m 1 Homepage src/\`${NAME}\`.js | sed -r 's/.*Homepage\s*:\s*(.+)/\1/'
W		= ls lib

all: lint minify

lint:
	@jshint src/`${NAME}`.js --config config/jshint.json

minify:
	@rm -f `${OLD}`
	@rm -f `${OLD}`
	@echo "/*`${URL}`*/`uglifyjs -nc src/\`${NAME}\`.js`" > `${NAME}`-`${VERSION}`.min.js
	@cat lib/`${W}` `${NAME}`-`${VERSION}`.min.js > `${NAME}`-W-`${VERSION}`.min.js

instdeps:
	@npm install jshint -g
	@npm install uglify-js -g