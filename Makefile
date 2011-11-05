OLD		= ls -l | grep .js | sed -r 's/.+\s(\S+)/\1/'
NAME	= ls src | sed -r 's/ender\.js|package\.json|\s+//' | sed -nr 's/(.+)\.js/\1/p'
VERSION	= grep '"version"' src/package.json | sed -r 's/.*:\s*"(.+)".*/\1/'
URL		= grep '"homepage"' src/package.json | sed -r 's/.*:\s*"(.+)".*/\1/'

all: lint minify

lint:
	@jshint src/`${NAME}`.js --config config/jshint.json

minify:
	@rm -f `${OLD}`
	@echo "/*`${URL}`*/`uglifyjs -nc src/\`${NAME}\`.js`" > `${NAME}`-`${VERSION}`.min.js

install:
	@npm install jshint -g
	@npm install uglify-js -g