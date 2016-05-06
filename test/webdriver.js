var assert = require('assert')

describe('grunt-webdriverjs test', function () {
    it('should have right options', function () {
        assert.strictEqual(browser.options.waitforTimeout, 12345)
        assert.strictEqual(browser.options.coloredLogs, true)
        assert.strictEqual(browser.options.logLevel, 'command')
        assert.strictEqual(browser.options.foo, 'bar')
    })

    it('checks if title contains the search query', function () {
        browser.url('/')
        assert(browser.getTitle(), 'WebdriverIO - Selenium 2.0 javascript bindings for nodejs')
    })
})
