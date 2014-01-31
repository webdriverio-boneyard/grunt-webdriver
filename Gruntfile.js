/*
 * grunt-webdriver
 * https://github.com/christianbromann/grunt-webdriver
 *
 * Copyright (c) 2013 Christian Bromann
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        
        // Configuration to be run (and then tested).
        webdriver: {
            options: {
                reporter: 'dots',
                user: process.env.SAUCE_USERNAME,
                key: process.env.SAUCE_ACCESS_KEY
            },
            ci: {
                tests: './test/*.js',
                options: {
                    port: 4445,
                    desiredCapabilities: {
                        browserName: (process.env._BROWSER || '').replace(/_/g,' '),
                        platform: (process.env._PLATFORM || '').replace(/_/g,' '),
                        version: process.env._VERSION,
                        app: process.env._APP || '',
                        device: (process.env._DEVICE || '').replace(/_/g,' '),
                        'device-type': process.env._TYPE || '',
                        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
                        'idle-timeout': 900,
                        tags: [process.env._BROWSER,process.env._PLATFORM,process.env._VERSION],
                        name: 'grunt-webdriver test',
                        build: process.env.TRAVIS_BUILD_NUMBER,
                    }
                }
            },
            local: {
                tests: './test/*.js',
                options: {
                    desiredCapabilities: { browserName: 'phantomjs' }
                }
            }
        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'webdriver']);
    // default task for testing
    grunt.registerTask('test', ['webdriver:local']);
    grunt.registerTask('testTravis', ['webdriver:ci']);

};
