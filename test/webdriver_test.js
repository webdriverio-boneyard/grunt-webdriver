'use strict';

exports.name = "Hello World Test";
exports.setUp = function() {
    this.timeout = 9999999;
    buster.client
        .init()
        .url('http://google.com');
};
exports.tests = [{
    
    name: "first hello world test",
    func: function(done) {

        
    }}
];