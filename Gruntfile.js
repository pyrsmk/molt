module.exports = function(grunt) {

	require('jit-grunt')(grunt);

	// Get version
	var child_process=require('child_process'),
		fs=require('fs'),
		version=fs.readFileSync('README.md',{encoding:'utf8'}).match(/^\w+ ([0-9.]+)/)[1];

	grunt.initConfig({
		// Load bower file
		bower: grunt.file.readJSON('bower.json'),
		// Remove obsolete files
		clean: {
			old: ['*.min.js']
		},
		// Lint
		jshint: {
			library: ['src/*.js'],
			options: {
				browser		: true,
				predef		: ['W', '$', 'require', 'define', 'module', 'ActiveXObject', 'console', 'log'],
				boss		: true,
				curly		: true,
				eqnull		: true,
				newcap		: false,
				undef		: true,
				loopfunc	: true,
				evil		: true,
				proto		: true,
				es3			: true,
			}
		},
		// Minify
		uglify: {
			library: {
				files: {
					'molt.min.js': ['src/molt.js']
				}
			}
		},
		// Concatenate
		concat: {
			moltW: {
				src: ['lib/W*.js', 'molt.min.js'],
				dest: 'molt.W.min.js'
			}
		},
		// Prepare package.json
		'string-replace': {
			dev_define: {
				files: {'package.json':'package.json'},
				options:{
					replacements: [{
						pattern: /"version": "[0-9.]+",/,
						replacement: '"version": "'+version+'",'
					}]
				}
			}
		},
		// Publish on NPM
		shell: {
			options: {
				stderr: false
			},
			npm: {
				command: 'npm publish'
			}
		}
	});

	// Define tasks
	grunt.registerTask('default', ['clean', 'jshint', 'uglify', 'concat', 'string-replace', 'shell']);

};