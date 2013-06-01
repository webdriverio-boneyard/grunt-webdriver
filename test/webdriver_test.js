/*global buster*/

/*
 * grunt-webdriver
 * https://github.com/christianbromann/grunt-webdriver
 *
 * Copyright (c) 2013 Christian Bromann
 * Licensed under the MIT license.
 */

'use strict';

exports.name = "Simple Github Test";

exports.tests = [{
    
    name: "checks if title contains the search query",
    func: function(done) {

        var query = 'grunt-webdriver';
        exports.driver
            .click('#js-command-bar-field')
            .setValue('#js-command-bar-field',query)
            .submitForm('.command-bar-form')
            .getTitle(function(title) {
                buster.assertions.assert(title.indexOf(query) !== -1);
            })
            .end(done);
        
    }}
];