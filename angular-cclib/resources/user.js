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
angular.module('ngCclib').factory('User', ['$q', '$resource', 'resourceCache', 'configurationService', function ($q, $resource, resourceCache, configurationService) {
    'use strict';

    var User = $resource(configurationService.api_uri + '/user/:username', {
        username: '@username'
    }, {
        update: {method: 'PUT'},
        activate: {method: 'PUT'},
        get: {method: 'GET', cache: resourceCache},
        query: {method: 'GET', isArray: true, cache: resourceCache},
        patch: {method: 'PATCH'}
    });

    // first get the list to find the username, then get the user
    User.find = function() {
        var response = new User();
        // manually setting the $promise like this is only required for the
        // tests to work, probably there is some flush, apply or something I
        // should call instead
        var deferred = $q.defer();
        response.$promise = deferred.promise;
        User.query(null, function(u) {
            User.get({username: u[0].username}, function(user) {
                angular.extend(response, user);
                deferred.resolve();
            });
        })
        return response;
    };

    return User;
}]);
