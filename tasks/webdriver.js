/*
 * grunt-webdriver
 * https://github.com/christianbromann/grunt-webdriver
 *
 * Copyright (c) 2013 Christian Bromann
 * Licensed under the MIT license.
 */

'use strict';

var buster        = require('buster'),
    webdriverjs   = require('webdriverjs'),
    startSelenium = require('../lib/startSelenium');

module.exports = function(grunt) {

    grunt.registerMultiTask('webdriver', 'Your task description goes here.', function() {
        
        var that = this,
            done = this.async(),
            base = process.cwd(),
            options = this.options({
                browser: 'chrome',
                logLevel: 'silent',
                capabilities: {
                    chrome: {
                        'browserName': 'chrome',
                        'chrome.binary': '/Applications/Browser/Google Chrome.app/Contents/MacOS/Google Chrome'
                    },
                    firefox: {
                        'browserName': 'firefox',
                        'firefox_binary': '/Applications/Browser/Firefox.app/Contents/MacOS/firefox'
                    },
                    opera: {
                        'browserName': 'opera',
                        'opera.binary': '/Applications/Browser/Opera.app/Contents/MacOS/Opera'
                    },
                    safari: {
                        'browserName': 'safari',
                        'safari.binary': '/Applications/Browser/Safari.app/Contents/MacOS/Safari'
                    }
                }
            }),
            capabilities = [];
        
        /**
         * set capabilities for webdriverjs
         */
        if(options.binary === undefined) {
            capabilities = options.capabilities[options.browser];
        } else {
            var seperator = options.browser === 'firefox' ? '_' : '.';
            capabilities['browserName'] = options.browser,
            capabilities[options.browser+seperator+'binary'] = options.binary;
        }

        /**
         * initialize webdriver
         */
        var driver = webdriverjs.remote({desiredCapabilities:capabilities,logLevel: options.logLevel});

        /**
         * specify special driver commands
         * @param  {Function} testSuite  command function
         * @return {Object}              driver object
         */
        driver.initTest = function(testSuite) {
            for(var test in testSuite) {
                this.addCommand(test, testSuite[test]);
            }
            return this;
        };

        /**
         * starts selenium standalone server if its not running
         * @param  {Function}        callback function on success
         * @param  {Function} done   grunt done function for async callbacks
         * @param  {Object}   grunt  grunt object
         * @return null
         */
        startSelenium(function() {

            /**
             * require given test files and run buster
             */
            var reporter  = buster.reporters.dots.create({ color: true }),
                runner    = buster.testRunner.create(),
                testCases = grunt.file.expand(grunt.file.expand(base + '/' + that.data.tests));

            // get tests context
            var contexts = [];
            testCases.forEach(function(testCase) {
                var context = require(testCase);

                context.setUp = function() {
                    this.timeout = 9999999;
                    driver.init().url(options.url);
                };

                context.driver = driver;
                contexts.push(context);
            });

            reporter.listen(runner);
            runner.runSuite(contexts).then(function(res) {
                done();
            });

        },done,grunt);

    });

};
