module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        // Configuration to be run (and then tested).
        webdriver: {
            options: {
                updateSauceJob: true,
                user: process.env.SAUCE_USERNAME,
                key: process.env.SAUCE_ACCESS_KEY,
                logLevel: 'verbose'
            },
            testTargetConfigFile: {
                configFile: './test/wdio.conf.js',
                cucumberOpts: {
                    require: 'lalala'
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
    grunt.registerTask('testTravis', ['webdriver:chrome_ci' ,'webdriver:chrome_ciTunnel']);

};
