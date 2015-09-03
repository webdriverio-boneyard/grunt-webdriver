'use strict';

var path = require('path'),
    fs = require('fs'),
    dargs = require('dargs'),
    split = require('split'),
    through2 = require('through2'),
    deepmerge = require('deepmerge');

module.exports = function(grunt) {

    grunt.registerMultiTask('webdriver', 'run wdio test runner', function() {

        var done = this.async(),
            base = process.cwd(),
            wdioBin = path.join(base, 'node_modules', 'webdriverio', 'bin') + '/wdio';

        var opts = deepmerge(this.options({
            nodeBin: 'node',
            wdioBin: wdioBin,
            args: {},
            output: false
        }), this.data);

        /**
         * check webdriverio dependency
         */
        if (!fs.existsSync(opts.wdioBin)) {
            grunt.util.error('Haven\'t found the WebdriverIO test runner');
        }

        /**
         * require config file
         */
        if(!opts.configFile) {
            grunt.util.error('No config file found');
        }

        var args = process.execArgv.concat([wdioBin, opts.configFile]).concat(dargs(opts, {
            excludes: ['nodeBin', 'wdioBin'],
            keepCamelCase: true
        }));

        grunt.log.debug('spawn wdio with these attributes:\n', args.join('\n'));
        var child = grunt.util.spawn({
            cmd: opts.nodeBin,
            args: args,
            opts: {
                stdio:'pipe'
            }
        }, function(error, result, code) {
            grunt.log.debug('wdio testrunner finished with exit code', code);

            if (error) {
                grunt.log.error(String(result));
            }

            done();
            done = null;
        });

        process.stdin.pipe(child.stdin);
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);

        // Write the result in the output file
        if (!grunt.util._.isUndefined(opts.output) && opts.output !== false) {
            grunt.log.debug('Output test result to: ' + opts.output);
            grunt.file.mkdir(path.dirname(opts.output));

            child
                .stdout
                .pipe(split())
                .pipe(through2(function (chunk, encoding, callback) {
                    if (!(/^Using the selenium server at/).test(chunk.toString())) {
                        this.push(chunk + '\n');
                    }
                    callback();
                }))
                .pipe(fs.createWriteStream(opts.output));
        }

    });

};
