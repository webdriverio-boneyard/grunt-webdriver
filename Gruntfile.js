module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        
        // Configuration to be run (and then tested).
        webdriver: {
            options: {
                user: process.env.SAUCE_USERNAME,
                key: process.env.SAUCE_ACCESS_KEY,
                logLevel: 'verbose',
                updateSauceJob: true
            },
            chrome_ci: {
                tests: './test/*.js',
                options: {
                    host: 'ondemand.saucelabs.com',
                    port: 80,
                    desiredCapabilities: {
                        browserName: 'chrome',
                        platform: 'Windows 8',
                        version: '31',
                        tags: ['chrome','Windows 8','31'],
                        name: 'grunt-webdriver test',
                        build: process.env.TRAVIS_BUILD_NUMBER
                    }
                }
            },
            chrome_ciTunnel: {
                tests: './test/*.js',
                options: {
                    port: 4445,
                    desiredCapabilities: {
                        browserName: 'chrome',
                        platform: 'Windows 8',
                        version: '31',
                        tags: ['chrome','Windows 8','31','sauce connect'],
                        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
                        name: 'grunt-webdriver test',
                        build: process.env.TRAVIS_BUILD_NUMBER
                    }
                }
            },
            coverage: {
                tests: './test/*.js',
                options: {
                    output: 'lcov.info',
                    reporter: 'mocha-istanbul',
                    // quiet: false,
                    logLevel: 'silent',
                    desiredCapabilities: {
                        browserName: 'phantomjs'
                    }
                }
            },
            local: {
                tests: './test/*.js',
                options: {
                    desiredCapabilities: { 
                        browserName: 'phantomjs'
                    }
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
    grunt.registerTask('testTravis', [
        'webdriver:chrome_ci' ,'webdriver:chrome_ciTunnel',
        'webdriver:firefox_ci','webdriver:firefox_ciTunnel',
        'webdriver:ie_ci'     ,'webdriver:ie_ciTunnel',
        'webdriver:safari_ci' ,'webdriver:safari_ciTunnel',
        'webdriver:iphone_ci' ,'webdriver:iphone_ciTunnel',
        'webdriver:ipad_ci'   ,'webdriver:ipad_ciTunnel',
        'webdriver:android_ci','webdriver:android_ciTunnel',
    ]);

};
