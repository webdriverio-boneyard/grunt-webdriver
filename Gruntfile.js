module.exports = function (grunt) {
    grunt.initConfig({
        pkgFile: 'package.json',
        clean: ['tasks'],
        babel: {
            options: {
                sourceMap: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: './src',
                    src: ['*.js'],
                    dest: 'tasks',
                    ext: '.js'
                }]
            }
        },
        watch: {
            dist: {
                files: ['./src/*.js'],
                tasks: ['babel:dist']
            }
        },
        eslint: {
            options: {
                parser: 'babel-eslint'
            },
            target: ['./src/*.js']
        },
        contributors: {
            options: {
                commitMessage: 'update contributors'
            }
        },
        bump: {
            options: {
                commitMessage: 'v%VERSION%',
                pushTo: 'upstream'
            }
        },
        webdriver: {
            options: {
                logLevel: 'command',
                waitforTimeout: 12345,
                framework: 'mocha',
                coloredLogs: true
            },
            testTargetConfigFile: {
                configFile: './test/wdio.conf.js',
                foo: 'bar'
            }
        }
    })

    require('load-grunt-tasks')(grunt)
    grunt.loadTasks('tasks')
    grunt.registerTask('default', ['build'])
    grunt.registerTask('build', 'Build grunt-webdriver', function () {
        grunt.task.run([
            'eslint',
            'clean',
            'babel'
        ])
    })
    grunt.registerTask('release', 'Bump and tag version', function (type) {
        grunt.task.run([
            'build',
            'contributors',
            'bump:' + (type || 'patch')
        ])
    })
}
