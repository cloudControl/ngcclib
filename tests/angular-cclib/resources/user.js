describe("UserResource", function () {
    var $http, User;

    beforeEach(inject(function(_$httpBackend_, _User_) {
        $http = _$httpBackend_;
        User = _User_;
    }));

    it ('should be called successfully and contain all services', function () {
        expect($http).toBeDefined();
        expect(User).toBeDefined();
    });

    var user_list_fixture = [
        {
        "username": "username",
        "email": "username@example.com"
        }
    ];

    var user_fixture = {
        "is_active": true,
        "username": "username",
        "billing_without_payment_info": true,
        "email": "username@example.com",
        "first_name": "",
        "last_name": ""
    };

    it('find() should get the list of users and then get the specific user', function () {
        $http.expect('GET', 'https://api.cloudcontrol.com/user').respond(200, user_list_fixture);
        $http.expect('GET', 'https://api.cloudcontrol.com/user/username').respond(200, user_fixture);

        var user = User.find()
        $http.flush();

        angular.forEach(user_fixture, function(value, key) {
            expect(user[key]).toEqual(value);
        });
    });
});
