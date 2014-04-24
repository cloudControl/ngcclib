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
angular.module('ngCclib').factory('Invoice', ['$rootScope', '$resource', 'configurationService', function ($rootScope, $resource, configurationService) {
    'use strict';

    return $resource(configurationService.api_uri + '/user/:username/billing/:accountname/invoice/:id', {
        username: '@username',
        accountname: '@name',
        id: '@id'
    });
}]);
