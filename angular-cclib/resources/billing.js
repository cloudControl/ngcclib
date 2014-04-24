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
angular.module('ngCclib').factory('Billing', ['$q', '$resource', 'resourceCache', 'configurationService', function ($q, $resource, resourceCache, configurationService) {
    'use strict';

    var Interceptor = {
        'response': function(response) {
            response.resource.support_plan = response.resource.support_plan.name; // flatten support_plan because we need to send it back flat
            return response || $q.when(response);
        }
    };

    var BillingAccount = $resource(configurationService.api_uri + '/user/:username/billing/:accountname', {
        username: '@user.username',
        accountname: '@name'   // The ID is the billing address name. Needed to name it this way to be REST conform
    }, {
        save: {method: 'POST', interceptor: Interceptor},
        get: {method: 'GET', interceptor: Interceptor, cache: resourceCache},
        update: {method: 'PUT', interceptor: Interceptor}
    });

    return BillingAccount;
}]);
