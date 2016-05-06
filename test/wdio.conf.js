exports.config = {
    port: 4445,
    host: 'localhost',
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,

    specs: ['./test/webdriver.js'],
    capabilities: [{
        browserName: 'firefox',
        platform: 'OS X 10.11',
        version: '45.0',
        name: 'grunt-webdriver',
        build: 'grunt-webdriver - ' + process.env.TRAVIS_BUILD_NUMBER,
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
    }],

    baseUrl: 'http://webdriver.io',
    waitforTimeout: 10000,

    framework: 'cucumber', // gets overwritten in gruntfile
    mochaOpts: {
        timeout: 30000
    },
    reporter: 'dot'
}
