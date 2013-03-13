# grunt-webdriver

> grunt-webdriver is a grunt plugin to run selenium tests with BusterJS and webdriverjs

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains
how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as
install and use Grunt plugins. Once you're familiar with that process, you may
install this plugin with this command:

```shell
npm install grunt-webdriver --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile
with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-webdriver');
```

## The "webdriver" task

### Overview
In your project's Gruntfile, add a section named `webdriver` to the data
object passed into `grunt.initConfig()`.

_Run this task with the `grunt webdriver` command._

```js
grunt.initConfig({
  webdriver: {
    options: {
      url: '<start-url>'
    },
    tests: ['<path-to-your-testfiles>'],
  },
})
```

### Options

#### url
Type: `String`<br>
Default: *undefinded* (url is required).

Specified the url of website, the tests are running on 

#### browser
Type: `String`<br>
Default: *chrome*<br>
Options: *chrome|firefox|opera|safari*

Defines the browser

#### logLevel
Type: `String`<br>
Default: *silent*<br>
Options *silent|verbose*

Set log level of webdriverjs API

#### binary
Type: `String`<br>
Default: standard MacOSX browser path (e.g. Chrome: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome)

Specify the binary path for the indicated browser __(important for windows user)__

### Usage Examples

#### Required Options
In this example, the minimum required options are used to execute a simple
test script.

```js
grunt.initConfig({
  webdriver: {
    dev: {
      options: {
        url: 'http://github.com',
        browser: 'chrome'
      },
      tests: './test/github-test.js'
    }
  },
})
```

The corresponding *Hello World* test script, using webdriverjs API to search the
grunt-webdriver repository on github.

```js
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
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2013-03-13   v0.1.1   first working version, without special features
