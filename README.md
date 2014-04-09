[![Build Status](https://travis-ci.org/cloudControl/ngcclib.svg?branch=master)](https://travis-ci.org/cloudControl/ngcclib)

# ngCclib

ngCclib is an [AngularJS](http://angularjs.org/) wrapper for the cloudControl RESTful API. For more information about the cloudControl API, please check out [this page](https://api.cloudcontrol.com/doc/).

## Dependencies

- AngularJS 1.2.x
- AngularJS modules:
    - ngResource 1.2.x
- angular-cache 1.2.x

The tests require Karma, Karma-PhantomJS-Launcher and Karma-Jasmine to be installed.

Download and install [NodeJS](http://nodejs.org/download/), then run:

	$ npm install
	
This will install [Bower](http://bower.io/) and call `bower install`, which in turn will install the desired dependencies.

## Installation and Usage

The ngCclib module is meant to be used as a regular AngularJS module. Authentication relies on a API token. The **cc_token** object gets loaded from local storage and should be of the following format: `{"token":"aAbBcC..."}`.

(Note that the */token* endpoint of the cloudControl API returns the appropriate object.)

The module also provides a configuration service which allows the user to change the URI of the API to the calls are to be made. The defaut URI is set to be https://api.cloudcontrol.com, but can be changed in the configuration phase of the initialisation.

```
angular.module('myApp').config(['configurationServiceProvider', function (configurationServiceProvider) {
    configurationServiceProvider.setApiUri('https://api.example.com');
}]);
```

The set API URI can then be accessed using `configurationService.api_uri`.

## Tests

The /tests/app folder contains the unittests for ngCclib. Those are written using the [Jasmine](http://jasmine.github.io/1.3/introduction.html) framework. The above mentionned folder follows a structure similar to the one of our source code.

The tests are run using [Karma](http://karma-runner.github.io/0.12/index.html). To run the tests, type:

    $ npm test

## License

This library is distributed under the Apapche License.
