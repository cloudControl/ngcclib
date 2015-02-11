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
angular.module('ngCclib').factory('Deployment', ['$q', '$resource', 'Addon', 'Worker', 'resourceCache', 'configurationService', function ($q, $resource, Addon, Worker, resourceCache, configurationService) {
    'use strict';

    var Interceptor = {
        'response': function(response) {
            var promises = [];
            var defered = $q.defer();
            promises.push(defered.promise);
            var splitted = response.resource.name.split('/');
            response.resource.appname = splitted[0];
            response.resource.depname = splitted[1];
            response.resource.total = Deployment.calculate_total(response.resource);
            response.resource.stack = response.resource.stack.name; // flatten stack because we need to send it back flat
            response.resource.billing_account = Deployment.flattenBillingAccount(response.resource.billing_account); // flatten billing account because we need to send it back flat
            response.resource.addons = Addon.query({appname: response.resource.appname, dep: response.resource.depname});
            response.resource.workers = Worker.query({appname: response.resource.appname, depname: response.resource.depname}, function(workers) {
                angular.forEach(response.resource.workers, function (worker, key) {
                    response.resource.workers[key] = Worker.get({appname: response.resource.appname, depname: response.resource.depname, id: response.resource.workers[key].wrk_id});
                    promises.push(response.resource.workers[key].$promise);
                });
                defered.resolve();
            });
            return $q.all([response.resource.addons.$promise, $q.all(promises)]).then(function() {
                return response;
            });
        }
    };

    var RefreshInterceptor = {
        'response': function(response) {
            resourceCache.remove(response.config.url);
            return Interceptor['response'](response);
        }
    };

    var QueryInterceptor = {
        'response': function(response) {
            angular.forEach(response.resource, function(r) {
                var splitted = r.name.split('/');
                r.appname = splitted[0];
                r.depname = splitted[1];
            });
            return response || $q.when(response);
        }
    };

    var Deployment = $resource(configurationService.api_uri + '/app/:appname/deployment/:id', {
        appname: '@appname',
        id: '@depname'
    }, {
        deploy: {method: 'PUT', interceptor: Interceptor},
        save: {method: 'POST', interceptor: Interceptor},
        get: {method: 'GET', interceptor: Interceptor, cache: resourceCache},
        refresh: {method: 'GET', interceptor: RefreshInterceptor, cache: resourceCache}, // First clears cache in RefreshInterceptor and then caches new response from API
        query: {method: 'GET', isArray: true, interceptor: QueryInterceptor, cache: resourceCache}
    });

    // Used to calculate total in Interceptor
    Deployment.calculate_total = function(dep) {
        var total = 0;
        angular.forEach(dep.billed_addons, function(addon) {
            total += addon.costs;
        });
        total += dep.billed_boxes.costs;
        return total.toFixed(2);
    };

    Deployment.flattenBillingAccount = function(billing_account) {
        if (billing_account === null) {
            return null;
        } else {
            return billing_account.name;
        }
    };

    return Deployment;
}]);
