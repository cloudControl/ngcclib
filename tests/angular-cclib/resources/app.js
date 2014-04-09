describe("AppResource", function () {
    var $http, App;

    beforeEach(inject(function(_$httpBackend_, _App_) {
        $http = _$httpBackend_;
        App = _App_;
    }));

    it('should be called successfully and contain all services', function () {
        expect($http).toBeDefined();
        expect(App).toBeDefined();
    });

    var app_fixture = {
        "users": [
            {
                "email": "name@example.com",
                "role": "",
                "username": "examplename"
            }
        ],
        "type": {
            "name": "php"
        },
        "date_created": "2013-09-03T15:34:44",
        "owner": {
            "billing_without_payment_info": false,
            "email": "name@example.com",
            "username": "examplename",
            "last_name": "",
            "first_name": "",
            "is_active": true
        },
        "name": "appname",
        "date_modified": "2013-09-03T15:34:44",
        "repository": "ssh://appname@cloudcontrolled.com/repository.git",
        "buildpack_url": null,
        "invitations": [],
        "deployments": [
            {
                "name": "appname/default",
                "dep_id": "dep9ncfs9uk"
            },
            {
                "name": "appname/staging",
                "dep_id": "dep4aqzy6xq"
            }
        ]
    };

    var default_deployment_fixture = {
        "branch": "ssh://appname@cloudcontrolled.com/repository.git",
        "is_default": true,
        "billing_account": null,
        "users": [],
        "date_created": "2013-09-03T15:34:44",
        "state": "not deployed",
        "default_subdomain": "appname.cloudcontrolled.com",
        "date_modified": "2013-09-03T15:34:44",
        "dep_id": "dep9ncfs9uk",
        "name": "appname/default",
        "max_boxes": 1,
        "billed_addons": [
            {
                "costs": 0.0,
                "until": 1378684800,
                "hours": 129.0,
                "addon": "alias.free"
            }
        ],
        "version": "-1",
        "billed_boxes": {
            "free_boxes": 128.42,
            "costs": 0.0,
            "boxes": 0.0,
            "until": 1378684800
        },
        "stack": {
            "name": "pinky"
        },
        "min_boxes": 1,
        "static_files": "(removed)"
    };

    var staging_deployment_fixture = {
        "max_boxes": 1,
        "min_boxes": 1,
        "date_created": "2013-09-03T15:42:06",
        "users": [],
        "version": "-1",
        "dep_id": "dep4aqzy6xq",
        "is_default": false,
        "state": "not deployed",
        "static_files": "(removed)",
        "date_modified": "2013-09-03T15:42:06",
        "billing_account": null,
        "name": "appname/staging",
        "stack": {
            "name": "pinky"
        },
        "billed_boxes": {
            "until": 1378684800,
            "free_boxes": 128.3,
            "costs": 0.0,
            "boxes": 0.0
        },
        "billed_addons": [
            {
                "until": 1378684800,
                "hours": 129.0,
                "addon": "alias.free",
                "costs": 0.0
            }
        ],
        "default_subdomain": "staging-appname.cloudcontrolled.com",
        "branch": "ssh://appname@cloudcontrolled.com/repository.git"
    };

    var addon_fixture = [
        {
            "settings": {},
            "addon_option": {
                "name": "alias.free"
            }
        }
    ];

    var worker_fixture = [];

    describe("Interceptor", function () {
        it('should set id and deployments on get()', function () {
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname').respond(200, app_fixture);
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment/default').respond(200, default_deployment_fixture);
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment/staging').respond(200, staging_deployment_fixture);
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment/default/addon').respond(200, addon_fixture);
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment/default/worker').respond(200, worker_fixture);
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment/staging/addon').respond(200, addon_fixture);
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment/staging/worker').respond(200, worker_fixture);

            var app = App.get({id: 'appname'})
            $http.flush();

            expect(app.id).toEqual(app.name);
            expect(typeof(app.deployments)).toEqual(typeof(Array()));
            expect(app.deployments.length).toEqual(2);
            expect(app.deployments[0].appname).toEqual(app.name);
            expect(app.deployments[1].appname).toEqual(app.name);
            expect(app.deployments[0].depname).toEqual('default');
            expect(app.deployments[1].depname).toEqual('staging');
        });
    });

    describe("parse_dep_name", function () {
        it('should return an object with appname and id', function () {
            expect(App.parse_dep_name('appname/depname')).toEqual({appname: 'appname', id: 'depname'});
        });
    });
});
