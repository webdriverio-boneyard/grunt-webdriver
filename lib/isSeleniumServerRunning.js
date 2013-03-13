/**
 *
 * grunt-webdriver
 * https://github.com/christianbromann/grunt-webdriver
 *
 * Copyright (c) 2013 Christian Bromann
 * Licensed under the MIT license.
 *
 * checks if a selenium process is running
 * @param  {Function} callback executes if selenium server is running
 * @param  {Function} done     executes grunt task
 * @return null                obsolete
 */

var exec  = require('child_process').exec,
    spawn = require('child_process').spawn,
    fs    = require('fs');

module.exports = function (callback, done, grunt) {
    exec('ps auxw | grep selenium-server-standalone | grep -v grep', [], function(error, stdout, stderr) {
        if(!stdout.length) {
            grunt.log.write('\nCouldn\'t find any selenium server process');
            grunt.log.writeln('\nStarting selenium server...');
        
            var seleniumServer = spawn('java', ['-jar', __dirname+'/../bin/selenium-server-standalone-2.31.0.jar']);
            
            seleniumServer.stdout.on('data', function (data) {
                if(data.toString().indexOf('Started SocketListener') !== -1) {
                    grunt.log.write('\nServer started successfully!');
                    grunt.log.writeln('\nStarting tests now...\n');
                    callback();
                }
            });
            
        } else {
            callback();
        }
    });
};