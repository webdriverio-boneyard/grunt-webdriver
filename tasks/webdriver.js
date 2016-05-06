import path from 'path'
import resolve from 'resolve'
import merge from 'deepmerge'

module.exports = function (grunt) {
    grunt.registerMultiTask('webdriver', 'run wdio test runner', function () {
        const done = this.async()
        const opts = merge(this.options(), this.data)
        const Launcher = require(path.join(path.dirname(resolve.sync('webdriverio')), 'lib/launcher'))

        if (typeof opts.configFile !== 'string') {
            grunt.log.error('You need to define "configFile" property with the path to your wdio.conf.js')
            return done(1)
        }

        let wdio = new Launcher(opts.configFile, opts)

        grunt.log.debug(`spawn wdio with these attributes:\n${JSON.stringify(opts, null, 2)}`)
        return wdio.run().then(code => {
            grunt.log.debug(`wdio testrunner finished with exit code ${code}`)
            return done(code === 0)
        }, e => {
            grunt.log.error(`Something went wrong: ${e}`)
            return done(false)
        })
    })
}
