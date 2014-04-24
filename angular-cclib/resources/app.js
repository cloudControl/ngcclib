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
angular.module('ngCclib').factory('App', ['$q', '$resource', 'Deployment', 'resourceCache', 'configurationService', function ($q, $resource, Deployment, resourceCache, configurationService) {
    'use strict';

    var Interceptor = {
        'response': function(response) {
            var promises = [];
            response.resource.id = response.resource.name;
            angular.forEach(response.resource.deployments, function(dep, key) {
                response.resource.deployments[key] = Deployment.get(App.parse_dep_name(dep.name));
                promises.push(response.resource.deployments[key].$promise);
            });
            return $q.all(promises).then(function () {
                return response;
            });
        }
    };

    var App = $resource(configurationService.api_uri + '/app/:id', {
        id: '@name'
    }, {
        get: {method: 'GET', interceptor: Interceptor, cache: resourceCache},
        query: {method: 'GET', isArray: true, cache: resourceCache}
    });

    App.parse_dep_name = function(dep_name) {
        var parsed = dep_name.split('/');
        return {appname: parsed[0], id: parsed[1]}
    };

    return App;
}]);

