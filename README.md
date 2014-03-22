# grunt-webdriver [![Build Status](https://travis-ci.org/webdriverjs/grunt-webdriver.png)](https://travis-ci.org/christian-bromann/grunt-webdriver) [![Selenium Test Status](https://saucelabs.com/buildstatus/grunt-webdriver)](https://saucelabs.com/u/grunt-webdriver) [![Dependency Status](https://gemnasium.com/webdriverjs/grunt-webdriver.png)](https://gemnasium.com/webdriverjs/grunt-webdriver)

> grunt-webdriver is a grunt plugin to run selenium tests with Mocha and [WebdriverJS](http://webdriver.io)

[![Selenium Test Status](https://saucelabs.com/browser-matrix/grunt-webdriver.svg)](https://saucelabs.com/u/grunt-webdriver)

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
        desiredCapabilities: {
            browserName: 'chrome'
        }
    },
    login: {
        tests: ['test/spec/login/*.js'],
        options: {
            // overwrite default settings
            desiredCapabilities: {
                browserName: 'firefox'
            }
        }
    },
    form: {
        tests: ['test/spec/form/*.js']
    }
    // ...
  },
})
```

#### example using [Sauce Labs](https://saucelabs.com)

If you specify a `tunnel-identifier` within your `desiredCapabilities` object, the task
will automatically try to establish a tunnel connection via [Sauce Connect](https://saucelabs.com/docs/connect).

```js
grunt.initConfig({
  webdriver: {
    options: {
        host: 'ondemand.saucelabs.com',
        port: 80,
        user: SAUCE_USERNAME,
        key: SAUCE_ACCESS_KEY,
        desiredCapabilities: {
            browserName: 'chrome',
            version: '27',
            platform: 'XP',
            'tunnel-identifier': 'my-tunnel'
        }
    },
    login: {
        tests: ['test/spec/login/*.js']
    },
    form: {
        tests: ['test/spec/form/*.js']
    }
    // ...
  },
})
```

### Options

All options get passed into the WebdriverJS `remote` function. So this is the place where
you can define your driver instance. You'll find more informations about all WebdriverJS
options [here](https://github.com/camme/webdriverjs/#options). You can overwrite these
options in any target. Also you have to define all Mocha options here. The following
are supported:

#### bail
Type: `Boolean`<br>
Default: *false*<br>

If true you are only interested in the first execption

#### ui
Type: `String`<br>
Default: *bdd*<br>
Options: *bdd* | *tdd* | *qunit* | *exports*

Specify the interface to use.

#### reporter
Type: `String`<br>
Default: *spec*<br>
Options: *Base* | *Dot* | *Doc* | *TAP* | *JSON* | *HTML* | *List* | *Min* | *Spec* | *Nyan* | *XUnit* | *Markdown* | *Progress* | *Landing* | *JSONCov* | *HTMLCov* | *JSONStream*

Allows you to specify the reporter that will be used.

#### slow
Type: `Number`<br>
Default: *75*

Specify the "slow" test threshold, defaulting to 75ms. Mocha uses this to highlight test-cases that are taking too long.

#### timeout
Type: `Number`<br>
Default: *1000000*

Specifies the test-case timeout.

#### grep
Type: `String`

When specified will trigger mocha to only run tests matching the given pattern which is internally compiled to a `RegExp`.

#### updateSauceJob
Type: `Boolean`<br>
Default: *false*

If true it will automatically update the current job and does publish it.

### Usage Examples

#### Required Options
In this example, the minimum required options are used to execute a simple
test script.

```js
grunt.initConfig({
  webdriver: {
    githubTest: {
      tests: './test/github-test.js'
    }
  },
})
```

The corresponding *Hello World* test script is using WebdriverJS API to search the
grunt-webdriver repository on GitHub. The global `browser` variable lets you access
your client instance. See more functions and test examples in the [WebdriverJS](https://github.com/Camme/webdriverjs) repository.

```js
'use strict';

var assert = require('assert');

describe('grunt-webdriverjs test', function () {

    it('checks if title contains the search query', function(done) {

        browser
            .url('http://github.com')
            .setValue('#js-command-bar-field','grunt-webdriver')
            .submitForm('.command-bar-form')
            .getTitle(function(err,title) {
                assert(title.indexOf('grunt-webdriver') !== -1);
            })
            .end(done);

    });

});
```

## Contributing
Please fork, add specs, and send pull requests! In lieu of a formal styleguide, take care to
maintain the existing coding style.

## Release History
* 2013-03-13   v0.1.1   first working version, without special features
* 2013-03-14   v0.1.2   bugfixing, enhanced task option, improved test case
* 2013-03-15   v0.1.3   added support for phantomjs, implemented reporter option
* 2013-03-16   v0.1.4   save result of busterjs reporters to a file, use travis for CI testing
* 2013-03-16   v0.1.5   added support for setUp function
* 2013-03-16   v0.1.6   fixed webdriverjs version
* 2014-02-01   v0.2.0   rewrote plugin, replaced BusterJS with Mocha
* 2014-03-13   v0.3.0   support Sauce Connect
* 2014-03-16   v0.3.1   start selenium server and Sauce Connect tunnel only once
* 2014-03-22   v0.3.2   make task work with absolute minimum required options - closes [#11](https://github.com/webdriverjs/grunt-webdriver/issues/11)

