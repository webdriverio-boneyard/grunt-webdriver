/*
 * grunt-webdriver
 * https://github.com/christianbromann/grunt-webdriver
 *
 * Copyright (c) 2013 Christian Bromann
 * Licensed under the MIT license.
 */

'use strict';

var buster      = require('buster'),
    webdriverjs = require('webdriverjs');
    // isSeleniumServerRunning = require('../lib/isSeleniumServerRunning');

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('webdriver', 'Your task description goes here.', function() {
        
        // Merge task-specific and/or target-specific options with these defaults.
        // var options = this.options({
        //     punctuation: '.',
        //     separator: ', '
        // });
        
        var done = this.async();
        
        /**
         * initialize webdriver
         */
        buster.client = webdriverjs.remote({desiredCapabilities:{
            "browserName":   "chrome",
            "chrome.binary": "/Applications/Browser/Google Chrome.app/Contents/MacOS/Google Chrome"
        },logLevel: 'silent'});

        buster.client.initTest = function(testSuite) {
            for(var test in testSuite) {
                this.addCommand(test, testSuite[test]);
            }
            return this;
        };

        // isSeleniumServerRunning(function() {

            var reporter  = buster.reporters.dots.create({ color: true }),
                runner    = buster.testRunner.create(),
                testCases = grunt.file.expand(grunt.file.expand(this.data.tests));

            // get tests context
            var contexts = [];
            testCases.forEach(function(testCase) {
                var context = require('.'+testCase);

                // context.baseUrl = baseUrl;
                contexts.push(context);
            });

            reporter.listen(runner);
            runner.runSuite(contexts).then(function(res) {
                done();
            });

        // },done);

    });

};
