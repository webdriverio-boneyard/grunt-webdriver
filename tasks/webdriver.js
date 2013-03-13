/*
 * grunt-webdriver
 * https://github.com/christianbromann/grunt-webdriver
 *
 * Copyright (c) 2013 Christian Bromann
 * Licensed under the MIT license.
 */

'use strict';

var buster      = require('buster'),
    webdriverjs = require('webdriverjs'),
    isSeleniumServerRunning = require('../lib/isSeleniumServerRunning');

module.exports = function(grunt) {

    grunt.registerMultiTask('webdriver', 'Your task description goes here.', function() {
        
        var that = this,
            done = this.async(),
            options = this.options();
        
        /**
         * initialize webdriver
         */
        var driver = webdriverjs.remote({desiredCapabilities:{
            "browserName":   "chrome",
            "chrome.binary": "/Applications/Browser/Google Chrome.app/Contents/MacOS/Google Chrome"
        },logLevel: 'silent'});

        driver.initTest = function(testSuite) {
            for(var test in testSuite) {
                this.addCommand(test, testSuite[test]);
            }
            return this;
        };

        isSeleniumServerRunning(function() {

            var reporter  = buster.reporters.dots.create({ color: true }),
                runner    = buster.testRunner.create(),
                testCases = grunt.file.expand(grunt.file.expand(that.data.tests));

            // get tests context
            var contexts = [];
            testCases.forEach(function(testCase) {
                var context = require('.'+testCase);

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
