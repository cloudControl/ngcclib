describe("resourceCache", function () {
    'use strict';

    var $http;
    var $httpBackend;
    var $scope;
    var resourceCache;

    beforeEach(inject(function(_$http_, _$httpBackend_, _$rootScope_, _resourceCache_) {
        $http = _$http_;
        $httpBackend = _$httpBackend_;
        $scope = _$rootScope_.$new();
        resourceCache = _resourceCache_;
    }));

    it('should NOT do anything for non API requests', function () {
        $httpBackend.expect('GET', 'http://www.example.com').respond(200, "");
        spyOn(resourceCache, 'remove');

        $scope.$apply(function() {
            $http.get('http://www.example.com');
        });
        $httpBackend.flush();
        expect(resourceCache.remove).not.toHaveBeenCalled();
    });

    it('should NOT do anything for TOKEN requests', function () {
        $httpBackend.expect('POST', 'https://api.cloudcontrol.com/token').respond(200, "");
        spyOn(resourceCache, 'remove');

        $scope.$apply(function() {
            $http.post('https://api.cloudcontrol.com/token');
        });
        $httpBackend.flush();
        expect(resourceCache.remove).not.toHaveBeenCalled();
    });

    it('should not do anything for GET requests', function () {
        $httpBackend.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment').respond(200, "");
        spyOn(resourceCache, 'remove');

        $scope.$apply(function() {
            $http.get('https://api.cloudcontrol.com/app/appname/deployment');
        });
        $httpBackend.flush();
        expect(resourceCache.remove).not.toHaveBeenCalled();
    });

    it('should remove 1 level of cache (resource cache) for PUT requests', function () {
        $httpBackend.expect('PUT', 'https://api.cloudcontrol.com/app/appname').respond(200, "");
        spyOn(resourceCache, 'remove');

        $scope.$apply(function() {
            $http.put('https://api.cloudcontrol.com/app/appname');
        });
        $httpBackend.flush();
        expect(resourceCache.remove).toHaveBeenCalledWith('https://api.cloudcontrol.com/app/appname');
        expect(resourceCache.remove).not.toHaveBeenCalledWith('https://api.cloudcontrol.com/app');
    });

    it('should remove 3 levels of cache for POST requests', function () {
        $httpBackend.expect('POST', 'https://api.cloudcontrol.com/app/appname/deployment').respond(200, "");
        spyOn(resourceCache, 'remove');

        $scope.$apply(function() {
            $http.post('https://api.cloudcontrol.com/app/appname/deployment');
        });
        $httpBackend.flush();
        expect(resourceCache.remove).toHaveBeenCalledWith('https://api.cloudcontrol.com/app/appname/deployment');
        expect(resourceCache.remove).toHaveBeenCalledWith('https://api.cloudcontrol.com/app/appname');
        expect(resourceCache.remove).toHaveBeenCalledWith('https://api.cloudcontrol.com/app');
        expect(resourceCache.remove).not.toHaveBeenCalledWith('https://api.cloudcontrol.com');
    });

    it('should remove up to 4 levels of cache for DELETE requests', function () {
        $httpBackend.expect('DELETE', 'https://api.cloudcontrol.com/app/appname/deployment/depname').respond(204, "");
        spyOn(resourceCache, 'remove');

        $scope.$apply(function() {
            $http.delete('https://api.cloudcontrol.com/app/appname/deployment/depname');
        });
        $httpBackend.flush();
        expect(resourceCache.remove).toHaveBeenCalledWith('https://api.cloudcontrol.com/app/appname/deployment/depname');
        expect(resourceCache.remove).toHaveBeenCalledWith('https://api.cloudcontrol.com/app/appname/deployment');
        expect(resourceCache.remove).toHaveBeenCalledWith('https://api.cloudcontrol.com/app/appname');
        expect(resourceCache.remove).toHaveBeenCalledWith('https://api.cloudcontrol.com/app');
        expect(resourceCache.remove).not.toHaveBeenCalledWith('https://api.cloudcontrol.com');
    });
});
