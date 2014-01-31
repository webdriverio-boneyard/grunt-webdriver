/*global describe,it,browser*/

/*
 * grunt-webdriver
 * https://github.com/christianbromann/grunt-webdriver
 *
 * Copyright (c) 2013 Christian Bromann
 * Licensed under the MIT license.
 */

'use strict';

var assert = require('assert');

describe('grunt-webdriverjs test', function () {

    it('checks if title contains the search query', function(done) {

        browser
            .url('http://github.com')
            .click('#js-command-bar-field')
            .setValue('#js-command-bar-field','grunt-webdriver')
            .submitForm('.command-bar-form')
            .getTitle(function(err,title) {
                assert(title.indexOf('grunt-webdriver') !== -1);
            })
            .end(done);

    });

});