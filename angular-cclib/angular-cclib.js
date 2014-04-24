/**
 * Copyright 2014 cloudControl GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
angular.module('ngCclib', ['ng', 'ngResource', 'angular-cache'])

    .config(['$httpProvider', function ($httpProvider) {
        // push an interceptor that always adds the correct token auth header
        $httpProvider.interceptors.push(['configurationService', function (configurationService) {
            return {
                'request': function(config) {
                    // limit to API requests but exclude the token request
                    var uri = configurationService.parsed_api_uri;
                    if (config.url.match(RegExp(uri)) && !config.url.match(RegExp(uri + '\/token'))) {
                        var t = JSON.parse(localStorage.getItem('cc_token'));
                        if (t === null) {
                            t = {token: null};
                        };
                        config.headers = {
                            'Authorization': 'cc_auth_token="' + t.token + '"',
                            'Content-Type': 'application/json; charset=utf-8',
                            'Accept': 'application/json'
                        };
                    };
                    return config;
                }
            };
        }]);
    }]);
