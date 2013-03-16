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
    startSelenium = require('../lib/startSelenium'),
    inArray       = require('../lib/inArray'),
    util          = require('util');

module.exports = function(grunt) {

    grunt.registerMultiTask('webdriver', 'Your task description goes here.', function() {
        
        var that = this,
            done = this.async(),
            base = process.cwd(),
            options = this.options({
                browser: 'chrome',
                logLevel: 'silent',
                reporter: 'dots',
                capabilities: {
                    chrome: {
                        'browserName': 'chrome',
                        'chrome.binary': '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
                    },
                    firefox: {
                        'browserName': 'firefox',
                        'firefox_binary': '/Applications/Firefox.app/Contents/MacOS/firefox'
                    },
                    opera: {
                        'browserName': 'opera',
                        'opera.binary': '/Applications/Opera.app/Contents/MacOS/Opera'
                    },
                    safari: {
                        'browserName': 'safari',
                        'safari.binary': '/Applications/Safari.app/Contents/MacOS/Safari'
                    }
                }
            }),
            capabilities = [],
            output = '';

        /**
         * override util module if output file is given
         */
        if(options.output !== undefined) {
            util.print = util.log = util.puts = util.debug = util.error = function(log) {
                output += log;
            };
        }

        /**
         * display a warning and abort task immediately if test URL is not defined
         */
        if(this.data.url === undefined) {
            grunt.fail.fatal('the test url is not defined');
        }
        
        /**
         * set capabilities for webdriverjs
         */
        if(options.browser === 'phantomjs') {
            capabilities.browserName = 'phantomjs';
        } else if(options.binary === undefined) {
            capabilities = options.capabilities[options.browser];
        } else {
            var seperator = options.browser === 'firefox' ? '_' : '.';
            capabilities.browserName = options.browser,
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
            var runner    = buster.testRunner.create(),
                testCases = grunt.file.expand(grunt.file.expand(base + '/' + that.data.tests)),
                availableReporters = ['dots','specification','quiet','xml','tap','html','teamcity'],
                reporter;

            if(!inArray(availableReporters,options.reporter)) {
                grunt.fail.fatal('couldn\'t find reporter "' + options.reporter+'". Please choose one of the following reporters: ' + availableReporters.join(','));
            }

            reporter = buster.reporters[options.reporter].create({ color: true });

            // get tests context
            var contexts = [];
            testCases.forEach(function(testCase) {
                var context = require(testCase);

                context.setUp = function() {
                    this.timeout = 9999999;
                    driver.init().url(that.data.url);
                };

                context.driver = driver;
                contexts.push(context);
            });

            reporter.listen(runner);
            runner.runSuite(contexts).then(function(res) {
                
                if(options.output !== undefined) {
                    grunt.file.write(options.output, output); 
                }

                done();
            });

        },done,grunt);

    });

};
