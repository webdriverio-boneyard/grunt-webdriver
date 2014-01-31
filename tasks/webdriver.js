/*
 * grunt-webdriver
 * https://github.com/christianbromann/grunt-webdriver
 *
 * Copyright (c) 2013 Christian Bromann
 * Licensed under the MIT license.
 */

'use strict';

var Mocha         = require('mocha'),
    SauceLabs     = require('saucelabs'),
    selenium      = require('selenium-standalone'),
    webdriverjs   = require('webdriverjs'),
    util          = require('util'),
    merge         = require('lodash.merge');

module.exports = function(grunt) {

    grunt.registerMultiTask('webdriver', 'Your task description goes here.', function() {
        
        var that = this,
            done = this.async(),
            base = process.cwd(),
            options = this.options({
                reporter: 'spec',
            }),
            capabilities = merge(options,this.data.options),
            output = '';

        /**
         * initialize WebdriverJS
         */
        GLOBAL.browser = webdriverjs.remote(capabilities);

        /**
         * initialize Mocha
         */
        var mocha = new Mocha({
            timeout: 1000000,
            reporter: options.reporter
        });

        grunt.file.expand(grunt.file.expand(base + '/' + this.data.tests)).forEach(function(file) {
            mocha.addFile(file);
        });

        /**
         * starts selenium standalone server if its not running
         */
        var server = selenium.start({ stdio: 'pipe' });
        server.stdout.on('data', function(output) {

            var line = output.toString().trim();
            if (line.indexOf('Started HttpContext[/wd,/wd]') > -1) {

                GLOBAL.browser.init().call(function() {

                    mocha.run(function(failures) {

                        GLOBAL.browser.end(function() {

                            if(options.user && options.key) {
                                var sauceAccount = new SauceLabs({
                                    username: options.user,
                                    password: options.key
                                });

                                sauceAccount.updateJob(GLOBAL.browser.requestHandler.sessionID, {
                                    passed: failures === 0,
                                    public: true
                                },function(err,res){
                                    process.exit(failures);
                                });
                            } else {
                                process.exit(failures);
                            }

                        });

                    });

                });

            }

        });

    });

};
