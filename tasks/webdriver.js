var Mocha         = require('mocha'),
    SauceLabs     = require('saucelabs'),
    selenium      = require('selenium-standalone'),
    webdriverjs   = require('webdriverjs'),
    util          = require('util'),
    merge         = require('lodash.merge');

module.exports = function(grunt) {

    grunt.registerMultiTask('webdriver', 'run WebdriverJS tests with Mocha', function() {

        var that = this,
            done = this.async(),
            base = process.cwd(),
            options = this.options({
                reporter: 'spec',
                ui: 'bdd',
                slow: 75,
                bail: false,
                grep: null,
                timeout: 1000000,
                updateSauceJob: false
            }),
            capabilities = merge(options,this.data.options),
            output = '';

        /**
         * initialize WebdriverJS
         */
        GLOBAL.browser = webdriverjs.remote(capabilities);

        /**
         * initialize Mocha
         */
        var mocha = new Mocha(options);

        grunt.file.expand(grunt.file.expand(base + '/' + this.data.tests)).forEach(function(file) {
            mocha.addFile(file);
        });

        /**
         * temporary remove the grunt exception handler , to make tasks continue (see also)
          - https://github.com/pghalliday/grunt-mocha-test/blob/master/tasks/mocha.js#L57
          - https://github.com/gregrperkins/grunt-mocha-hack
         */
        var uncaughtExceptionHandlers = process.listeners('uncaughtException');
        process.removeAllListeners('uncaughtException');

        var unmanageExceptions = function() {
          uncaughtExceptionHandlers.forEach(
            process.on.bind(process, 'uncaughtException'));
        };

        /**
         * starts selenium standalone server if its not running
         */
        var server = selenium.start({ stdio: 'pipe' });

        // Clear require cache to allow for multiple execution of same mocha commands
        Object.keys(require.cache).forEach(function (key) {
          delete require.cache[key];
        });

        server.stdout.on('data', function(output) {

            var line = output.toString().trim();
            if (line.indexOf('Started HttpContext[/wd,/wd]') > -1) {

                GLOBAL.browser.init().call(function() {

                    mocha.run(function(failures) {

                      // Restore grunt exception handling
                      unmanageExceptions();

                      // Close Remote sessions if needed
                      GLOBAL.browser.end(function() {

                          if(options.user && options.key && options.updateSauceJob) {
                              var sauceAccount = new SauceLabs({
                                  username: options.user,
                                  password: options.key
                              });

                              sauceAccount.updateJob(GLOBAL.browser.requestHandler.sessionID, {
                                  passed: failures === 0,
                                  public: true
                              },function(err,res){
                                  done(failures === 0);
                              });
                          } else {
                              done(failures === 0);
                          }

                      });

                    });

                });

            }

        });

    });

};
