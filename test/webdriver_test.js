var assert = require('assert');

describe('grunt-webdriverjs test', function () {

    it('checks if title contains the search query', function(done) {

        browser
            .url('http://webdriver.io')
            .getTitle(function(err,title) {
                assert.strictEqual(title,'WebdriverJS - Selenium 2.0 javascript bindings for nodejs');
            })
            .end(done);

    });

});