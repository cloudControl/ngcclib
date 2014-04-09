describe("configurationService", function() {
    'use strict';

    var $http;
    var configurationService;
    var AppUser;
    var app_user = {appname: 'appname', username: 'username'};

    describe("defaults", function () {
        beforeEach(inject(function(_$httpBackend_, _configurationService_, _AppUser_) {
            $http = _$httpBackend_;
            configurationService = _configurationService_;
            AppUser = _AppUser_;
        }));

        it('should have correct default values', function () {
            expect(configurationService.api_uri).toEqual('https://api.cloudcontrol.com');
            expect(configurationService.parsed_api_uri).toEqual('api\\.cloudcontrol\\.com');
        });
    });
});
