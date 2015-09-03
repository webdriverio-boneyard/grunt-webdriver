module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                'test/*.js'
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        webdriver: {
            options: {
                logLevel: 'command',
                updateJob: true,
                waitforTimeout: 12345,
                framework: 'mocha'
            },
            testTargetConfigFile: {
                configFile: './test/wdio.conf.js',
                cucumberOpts: {
                    require: 'nothing'
                }
            }
        },

    });

    // load this plugin's task
    grunt.loadTasks('tasks');
    // load helper tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // default task for testing
    grunt.registerTask('test', ['jshint', 'webdriver']);

};
