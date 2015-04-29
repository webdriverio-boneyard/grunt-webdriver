'use strict';

var Mocha = require('mocha'),
    SauceLabs = require('saucelabs'),
    SauceTunnel = require('sauce-tunnel'),
    selenium = require('selenium-standalone'),
    webdriverio = require('webdriverio'),
    http = require('http'),
    async = require('async'),
    hooker = require('hooker'),
    path = require('path'),
    fs = require('fs-extra'),
    deepmerge = require('deepmerge'),
    server = null,
    isSeleniumServerRunning = false,
    tunnel = null,
    seleniumServer = null,
    isSauceTunnelRunning = false,
    isHookedUp = false;

module.exports = function(grunt) {

    grunt.registerMultiTask('webdriver', 'run WebdriverIO tests with Mocha', function() {

        var done = this.async(),
            base = process.cwd(),
            options = this.options({
                reporter: 'spec',
                ui: 'bdd',
                slow: 75,
                bail: false,
                grep: null,
                timeout: 1000000,
                updateSauceJob: false,
                output: null,
                quiet: false,
                nospawn: false,
                seleniumOptions: {},
                seleniumInstallOptions: {}
            }),
            sessionID = null,
            capabilities = deepmerge(options, this.data.options || {}),
            tunnelIdentifier = options['tunnel-identifier'] || (capabilities.desiredCapabilities ? capabilities.desiredCapabilities['tunnel-identifier'] : null) || null,
            tunnelFlags = (capabilities.desiredCapabilities ? capabilities.desiredCapabilities['tunnel-flags'] : []) || [],
            fd;

        var queue = grunt.task._queue.filter(function(task) {
            return typeof task.placeholder === 'undefined';
        });

        var isLastTask = queue.length === 0;

        /**
         * initialise tunnel
         */
        if (!tunnel && options.user && options.key && tunnelIdentifier) {
            grunt.log.debug('initialise test session using sauce tunnel from user ' + options.user);
            tunnel = new SauceTunnel(options.user, options.key, tunnelIdentifier, true, tunnelFlags);
            tunnel.on('verbose:debug', grunt.log.debug);

            capabilities.host = undefined;
            capabilities.port = 4445;
        }

        /**
         * initialize WebdriverIO
         */
        grunt.log.debug('run webdriverio with following capabilities: ' + JSON.stringify(capabilities));
        capabilities.logLevel = options.quiet ? 'silent' : capabilities.logLevel;
        GLOBAL.browser = webdriverio.remote(capabilities);

        /**
         * initialize Mocha
         */
        var mocha = new Mocha(options);

        grunt.file.setBase(base);

        grunt.file.expand(this.data.tests).forEach(function(file) {
            mocha.addFile(file);
        });

        /**
         * hook process.stdout.write to save reporter output into file
         * thanks to https://github.com/pghalliday/grunt-mocha-test
         */
        if (!isHookedUp) {
            if (options.output) {
                fs.mkdirsSync(path.dirname(options.output));
                fd = fs.openSync(options.output, 'w');
            }

            // Hook process.stdout.write
            hooker.hook(process.stdout, 'write', {

                // This gets executed before the original process.stdout.write
                pre: function(result) {

                    // Write result to file if it was opened
                    if (fd && result.slice(0, 3) !== '[D]' && result.match(/\u001b\[/g) === null) {
                        fs.writeSync(fd, result);
                    }

                    // Prevent the original process.stdout.write from executing if quiet was specified
                    if (options.quiet) {
                        return hooker.preempt();
                    }

                }

            });

            isHookedUp = true;
        }

        /**
         * temporary remove the grunt exception handler , to make tasks continue (see also)
          - https://github.com/pghalliday/grunt-mocha-test/blob/master/tasks/mocha.js#L57
          - https://github.com/gregrperkins/grunt-mocha-hack
         */
        var uncaughtExceptionHandlers = process.listeners('uncaughtException');
        process.removeAllListeners('uncaughtException');

        /*istanbul ignore next*/
        var unmanageExceptions = function() {
            uncaughtExceptionHandlers.forEach(process.on.bind(process, 'uncaughtException'));
        };

        // Clear require cache to allow for multiple execution of same mocha commands
        Object.keys(require.cache).forEach(function(key) {
            delete require.cache[key];
        });

        /**
         * helper function for asyncjs
         */
        var next = function(cb, param) {
            return function() {
                var args = Array.prototype.slice.call(arguments, 1);

                if(typeof param !== 'undefined') {
                    args.unshift(param);
                } else if (arguments.length === 1) {
                    args.unshift(arguments[0]);
                }

                args.unshift(null);
                cb.apply(null, args);
            };
        };

        async.waterfall([

            /**
             * check if selenium server is already running
             */
            function(callback) {

                if (tunnel) {
                    return callback(null);
                }

                grunt.log.debug('checking if selenium is running');

                var options = {
                    host: capabilities.host || 'localhost',
                    port: capabilities.port || 4444,
                    path: '/wd/hub/status'
                };

                http.get(options, function() {
                    grunt.log.debug('selenium is running');
                    isSeleniumServerRunning = true;
                    callback(null);
                }).on('error', function() {
                    grunt.log.debug('selenium is not running');
                    callback(null);
                });

            },
            /**
             *  install drivers if needed
             */
            function(callback) {
                if (tunnel || isSeleniumServerRunning) {
                    return callback(null);
                }

                grunt.log.debug('installing driver if needed');
                selenium.install(options.seleniumInstallOptions, function(err) {
                    if (err) {
                        return callback(err);
                    }

                    grunt.log.debug('driver installed');
                    callback(null);
                });
            },

            /**
             * start selenium server or sauce tunnel (if not already started)
             */
            function(callback) {

                if (tunnel) {

                    if (isSauceTunnelRunning) {
                        return callback(null, true);
                    }

                    grunt.log.debug('start sauce tunnel');

                    /**
                     * start sauce tunnel
                     */
                    tunnel.start(function(hasTunnelStarted) {
                        // output here means if tunnel was created successfully
                        if (hasTunnelStarted === false) {
                            callback(new Error('Sauce-Tunnel couldn\'t created successfully'));
                        }

                        grunt.log.debug('tunnel created successfully');
                        isSauceTunnelRunning = true;
                        callback(null);
                    });

                } else if (!server && !isSeleniumServerRunning && !options.nospawn) {

                    grunt.log.debug('start selenium standalone server');

                    /**
                     * starts selenium standalone server if its not running
                     */

                    server = selenium.start(options.seleniumOptions, function(err, child) {
                        if (err) {
                            return callback(err);
                        }

                        grunt.log.debug('selenium successfully started');
                        seleniumServer = child;
                        isSeleniumServerRunning = true;
                        callback(null, true);
                    });

                } else {
                    grunt.log.debug('standalone server or sauce tunnel is running');
                    callback(null, true);
                }

            },

            /**
             * init WebdriverIO instance
             */
            function() {
                var callback = arguments[arguments.length - 1];
                grunt.log.debug('init WebdriverIO instance');

                GLOBAL.browser.init(function(err) {
                    /**
                     * gracefully kill process if init fails
                     */
                    callback(err);
                });
            },

            /**
             * run mocha tests
             */
            function(callback) {
                grunt.log.debug('run mocha tests');

                /**
                 * save session ID
                 */
                sessionID = GLOBAL.browser.requestHandler.sessionID;

                mocha.run(next(callback));
            },

            /**
             * end selenium session
             */
            function(result, callback) {
                grunt.log.debug('end selenium session');

                // Restore grunt exception handling
                unmanageExceptions();

                // Close Remote sessions if needed
                GLOBAL.browser.end(next(callback, result === 0));
            },

            /**
             * destroy sauce tunnel if connected (once all tasks were executed) or
             * kill selenium server process if created
             */
            function(result) {
                var callback = arguments[arguments.length - 1];

                if (isLastTask && isSauceTunnelRunning) {
                    grunt.log.debug('destroy sauce tunnel if connected (once all tasks were executed)');
                    return tunnel.stop(next(callback, result));
                } else if (isLastTask && seleniumServer) {
                    grunt.log.debug('kill selenium server');
                    seleniumServer.kill();
                }

                callback(null, result);
            },

            /**
             * update job on Sauce Labs
             */
            function(result) {
                var callback = arguments[arguments.length - 1];

                if (!options.user && !options.key && !options.updateSauceJob) {
                    return callback(null, result);
                }

                grunt.log.debug('update job on Sauce Labs');
                var sauceAccount = new SauceLabs({
                    username: options.user,
                    password: options.key
                });

                sauceAccount.updateJob(sessionID, {
                    passed: result,
                    public: true
                }, next(callback, result));
            },

            /**
             * finish grunt task
             */
            function(result) {
                var callback = arguments[arguments.length - 1];
                grunt.log.debug('finish grunt task');

                if (isLastTask) {

                    // close the file if it was opened
                    if (fd) {
                        fs.closeSync(fd);
                    }

                    // Restore process.stdout.write to its original value
                    hooker.unhook(process.stdout, 'write');

                }

                done(result);
                callback();
            }
        ], function(err) {

            /**
             * if no error happened, we are good
             */
            if(!err) {
                return;
            }

            grunt.log.debug('An error happened, shutting down services');

            var logTunnelStopped = function() {
                grunt.log.debug('tunnel closed successfully');
                grunt.fail.warn(err);
            };

            if(sessionID) {
                return GLOBAL.browser.end(function() {
                    grunt.log.debug('Selenium session closed successfully');

                    if(isSauceTunnelRunning) {
                        return tunnel.stop(logTunnelStopped);
                    }

                    grunt.fail.warn(err);
                });
            }

            if(isSauceTunnelRunning) {
                return tunnel.stop(logTunnelStopped);
            }

            grunt.fail.warn(err);
        });

    });

};
