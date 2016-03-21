'use strict';

var path = require('path'),
    fs = require('fs'),
    dargs = require('dargs'),
    deepmerge = require('deepmerge');

function getExecArgv() {
  var execArgv = process.execArgv
  // Remove the -e switch to avoid fork bombing ourselves.
  // https://github.com/nodejs/node/blob/v5.9.0/lib/child_process.js#L36-L43
  if (process._eval != null) {
    var index = execArgv.lastIndexOf(process._eval);
    if (index > 0) {
      execArgv = execArgv.slice();
      execArgv.splice(index - 1, 2);
    }
  }
  return execArgv;
}

module.exports = function(grunt) {

    grunt.registerMultiTask('webdriver', 'run wdio test runner', function() {

        var done = this.async(),
            base = process.cwd(),
            wdioBin = path.join(base, 'node_modules', 'webdriverio', 'bin') + '/wdio';

        var opts = deepmerge(this.options({
            nodeBin: 'node',
            wdioBin: wdioBin,
            args: {}
        }), this.data);

        /**
         * check webdriverio dependency
         */
        if (!fs.existsSync(opts.wdioBin)) {
            grunt.util.error('Haven\'t found the WebdriverIO test runner');
        }

        /**
         * require config file
         */
        if(!opts.configFile) {
            grunt.util.error('No config file found');
        }

        var args = getExecArgv().concat([opts.wdioBin, opts.configFile]).concat(dargs(opts, {
            excludes: ['nodeBin', 'wdioBin'],
            keepCamelCase: true
        }));

        grunt.log.debug('spawn wdio with these attributes:\n', args.join('\n'));
        grunt.util.spawn({
            cmd: opts.nodeBin,
            args: args,
            opts: {
                stdio: 'inherit'
            }
        }, function(error, result, code) {
            grunt.log.debug('wdio testrunner finished with exit code', code);

            if (error) {
                grunt.log.error(String(result.stderr));
            }

            done(code === 0);
            done = null;
        });
    });
};
