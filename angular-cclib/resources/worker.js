/**
 * Copyright 2014 cloudControl UG (haftungsbeschraenkt)
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
angular.module('ngCclib').factory('Worker', ['$resource', 'resourceCache', 'configurationService', function ($resource, resourceCache, configurationService) {
    'use strict';

    var Worker = $resource(configurationService.api_uri + '/app/:appname/deployment/:depname/worker/:id', {
        appname: '@appname',
        depname: '@depname',
        id: '@id'
    }, {
        get: {method: 'GET', cache: resourceCache},
        query: {method: 'GET', isArray: true, cache: resourceCache}
    });

    return Worker;
}]);
