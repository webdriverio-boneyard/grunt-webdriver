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
            firefox_ci: {
                tests: './test/*.js',
                options: {
                    host: 'ondemand.saucelabs.com',
                    port: 80,
                    desiredCapabilities: {
                        browserName: 'firefox',
                        platform: 'Linux',
                        version: '25',
                        tags: ['firefox','Linux','25'],
                        name: 'grunt-webdriver test',
                        build: process.env.TRAVIS_BUILD_NUMBER
                    }
                }
            },
            firefox_ciTunnel: {
                tests: './test/*.js',
                options: {
                    port: 4445,
                    desiredCapabilities: {
                        browserName: 'firefox',
                        platform: 'Linux',
                        version: '25',
                        tags: ['firefox','Linux','25','sauce connect'],
                        name: 'grunt-webdriver test',
                        build: process.env.TRAVIS_BUILD_NUMBER
                    }
                }
            },
            ie_ci: {
                tests: './test/*.js',
                options: {
                    host: 'ondemand.saucelabs.com',
                    port: 80,
                    desiredCapabilities: {
                        browserName: 'internet explorer',
                        platform: 'Windows 8',
                        version: '10',
                        tags: ['internet explorer','Windows 8','10'],
                        name: 'grunt-webdriver test',
                        build: process.env.TRAVIS_BUILD_NUMBER
                    }
                }
            },
            ie_ciTunnel: {
                tests: './test/*.js',
                options: {
                    port: 4445,
                    desiredCapabilities: {
                        browserName: 'internet explorer',
                        platform: 'Windows 8',
                        version: '10',
                        tags: ['internet explorer','Windows 8','10','sauce connect'],
                        name: 'grunt-webdriver test',
                        build: process.env.TRAVIS_BUILD_NUMBER
                    }
                }
            },
            safari_ci: {
                tests: './test/*.js',
                options: {
                    host: 'ondemand.saucelabs.com',
                    port: 80,
                    desiredCapabilities: {
                        browserName: 'safari',
                        platform: 'Windows 7',
                        version: '5',
                        tags: ['safari','Windows 7','5'],
                        name: 'grunt-webdriver test',
                        build: process.env.TRAVIS_BUILD_NUMBER
                    }
                }
            },
            safari_ciTunnel: {
                tests: './test/*.js',
                options: {
                    port: 4445,
                    desiredCapabilities: {
                        browserName: 'safari',
                        platform: 'Windows 7',
                        version: '5',
                        tags: ['safari','Windows 7','5','sauce connect'],
                        name: 'grunt-webdriver test',
                        build: process.env.TRAVIS_BUILD_NUMBER
                    }
                }
            },
            iphone_ci: {
                tests: './test/*.js',
                options: {
                    host: 'ondemand.saucelabs.com',
                    port: 80,
                    desiredCapabilities: {
                        browserName: '',
                        app: 'safari',
                        platform: 'Mac',
                        version: '7',
                        device: 'iPhone Simulator',
                        tags: ['iphone','Mac','7'],
                        name: 'grunt-webdriver test',
                        build: process.env.TRAVIS_BUILD_NUMBER
                    }
                }
            },
            iphone_ciTunnel: {
                tests: './test/*.js',
                options: {
                    port: 4445,
                    desiredCapabilities: {
                        browserName: '',
                        app: 'safari',
                        platform: 'Mac',
                        version: '7',
                        device: 'iPhone Simulator',
                        tags: ['iphone','Mac','7','sauce connect'],
                        name: 'grunt-webdriver test',
                        build: process.env.TRAVIS_BUILD_NUMBER
                    }
                }
            },
            ipad_ci: {
                tests: './test/*.js',
                options: {
                    host: 'ondemand.saucelabs.com',
                    port: 80,
                    desiredCapabilities: {
                        browserName: '',
                        app: 'safari',
                        platform: 'Mac',
                        version: '7',
                        device: 'iPad Simulator',
                        tags: ['ipad','Mac','7'],
                        name: 'grunt-webdriver test',
                        build: process.env.TRAVIS_BUILD_NUMBER
                    }
                }
            },
            ipad_ciTunnel: {
                tests: './test/*.js',
                options: {
                    port: 4445,
                    desiredCapabilities: {
                        browserName: '',
                        app: 'safari',
                        platform: 'Mac',
                        version: '7',
                        device: 'iPad Simulator',
                        tags: ['ipad','Mac','7','sauce connect'],
                        name: 'grunt-webdriver test',
                        build: process.env.TRAVIS_BUILD_NUMBER
                    }
                }
            },
            android_ci: {
                tests: './test/*.js',
                options: {
                    host: 'ondemand.saucelabs.com',
                    port: 80,
                    desiredCapabilities: {
                        browserName: 'android',
                        platform: 'Linux',
                        version: '4.0',
                        'device-type': 'tablet',
                        tags: ['android','Linux','4.0'],
                        name: 'grunt-webdriver test',
                        build: process.env.TRAVIS_BUILD_NUMBER
                    }
                }
            },
            android_ciTunnel: {
                tests: './test/*.js',
                options: {
                    port: 4445,
                    desiredCapabilities: {
                        browserName: 'android',
                        platform: 'Linux',
                        version: '4.0',
                        'device-type': 'tablet',
                        tags: ['android','Linux','4.0','sauce connect'],
                        name: 'grunt-webdriver test',
                        build: process.env.TRAVIS_BUILD_NUMBER
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
