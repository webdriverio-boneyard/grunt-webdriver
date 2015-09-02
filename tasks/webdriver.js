'use strict';

var path = require('path'),
    fs = require('fs'),
    dargs = require('dargs'),
    deepmerge = require('deepmerge');

module.exports = function(grunt) {

    grunt.registerMultiTask('webdriver', 'run wdio test runner', function() {

        var done = this.async(),
            base = process.cwd(),
            wdioBin = path.join(base, '..', 'webdriverio', 'bin') + '/wdio';

        var opts = deepmerge(this.options({
            nodeBin: 'node',
            wdioBin: wdioBin,
            args: {}
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

        var args = dargs(opts, {
            excludes: ['nodeBin', 'wdioBin'],
            keepCamelCase: true
        });

        console.log(opts, args);
        return done();

    });

};
