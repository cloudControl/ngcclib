angular.module('ngCclib').factory('resourceCache', ['$angularCacheFactory', function ($angularCacheFactory) {
    'use strict';

    var Cache = $angularCacheFactory('ResourceCache', {
        maxAge: 300000, // Items added to this cache expire after 5 minutes
        aggressiveDelete: false
    });

    return Cache;
}]);

angular.module('ngCclib').config(['$httpProvider', function($httpProvider) {
    // push an interceptor that clears the cache on POST, PUT and DELETE requests
    $httpProvider.interceptors.push(['resourceCache', 'configurationService', function(resourceCache, configurationService) {
        return {
            'request': function(config) {
                var api_uri = configurationService.parsed_api_uri;

                if (config.url.match(RegExp(api_uri)) && !config.url.match(RegExp(api_uri + '\/token'))) {
                    var cache_url = config.url;
                    var flushing_depth = {'GET': 0, 'PUT': 1, 'POST': 3, 'DELETE': 4};

                    var i = flushing_depth[config.method];
                    while (i > 0 && cache_url !== configurationService.api_uri) {
                        resourceCache.remove(cache_url);
                        cache_url = cache_url.split('/').slice(0, -1).join('/'); // 'one/two/three' becomes 'one/two'
                        i--;
                    };
                };
                return config;
            }
        };
    }]);
}]);
