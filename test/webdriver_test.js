'use strict';

var driver;

exports.name = "Hello World Test";
exports.tests = [{
    
    name: "first hello world test",
    func: function(done) {

        exports.driver
            .click('.search a')
            .setValue('.search-page-input','grunt-webdriver')
            .click('#search_form .button')
            .end(done);
        
    }}
];