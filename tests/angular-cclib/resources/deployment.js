describe("DeploymentResource", function () {
    var $http;
    var Deployment;

    beforeEach(inject(function(_$httpBackend_, _Deployment_) {
        $http = _$httpBackend_;
        Deployment = _Deployment_;
    }));

    it ('should be called successfully and contain all services', function () {
        expect($http).toBeDefined();
        expect(Deployment).toBeDefined();
    });

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

        var check_interceptor_expectations = function(dep) {
            expect(dep.appname).toEqual('appname');
            expect(dep.depname).toEqual('default');
            expect(dep.total).toEqual('0.00');
            expect(dep.stack).toEqual('pinky');
            expect(typeof(dep.addons)).toEqual(typeof(Array()));
            expect(dep.addons.length).toEqual(1);
            expect(dep.addons[0].addon_option.name).toEqual('alias.free');
            expect(dep.addons[0].settings).toEqual({});
            expect(typeof(dep.workers)).toEqual(typeof(Array()));
            expect(dep.workers.length).toEqual(0);
        };

        it('should set appname, depname, total, stack and addons on get()', function () {
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment/default').respond(200, default_deployment_fixture);
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment/default/addon').respond(200, addon_fixture);
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment/default/worker').respond(200, worker_fixture);

            var dep = Deployment.get({appname: 'appname', id: 'default'})
            $http.flush();

            check_interceptor_expectations(dep);
        });

        it('should set appname, depname, total, stack and addons on refresh()', function () {
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment/default').respond(200, default_deployment_fixture);
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment/default/addon').respond(200, addon_fixture);
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment/default/worker').respond(200, worker_fixture);

            var dep = Deployment.refresh({appname: 'appname', id: 'default'})
            $http.flush();

            check_interceptor_expectations(dep);
        });

        it('should set appname, depname, total, stack and addons on save()', function () {
            $http.expect('POST', 'https://api.cloudcontrol.com/app/appname/deployment').respond(200, default_deployment_fixture);
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment/default/addon').respond(200, addon_fixture);
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment/default/worker').respond(200, worker_fixture);

            var dep = Deployment.save({appname: 'appname', id: 'default'})
            $http.flush();

            check_interceptor_expectations(dep);
        });

        it('should set appname, depname, total, stack and addons on deploy()', function () {
            var updated_default_deployment_fixture = default_deployment_fixture;
            updated_default_deployment_fixture.min_boxes = 3;
            updated_default_deployment_fixture.max_boxes = 8;
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment/default').respond(200, default_deployment_fixture);
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment/default/addon').respond(200, addon_fixture);
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment/default/worker').respond(200, worker_fixture);
            $http.expect('PUT', 'https://api.cloudcontrol.com/app/appname/deployment/default').respond(200, updated_default_deployment_fixture);

            var dep = Deployment.get({appname: 'appname', id: 'default'})
            dep.$promise.then(function() {
                dep.min_boxes = 3;
                dep.max_boxes = 8;
                var updated_dep = dep.$deploy();
                updated_dep.then(function(response) {
                    check_interceptor_expectations(response.resource);
                    expect(response.resource.min_boxes).toEqual(3);
                    expect(response.resource.max_boxes).toEqual(8);
                });
            });

            $http.flush();
        });

    });

    describe("QueryInterceptor", function () {

        it('should set appname and depname on query()', function () {
            $http.expect('GET', 'https://api.cloudcontrol.com/app/appname/deployment').respond(200, [
                {
                    "name": "appname/depname",
                    "dep_id": "dep12345678"
                }
            ]);

            var deps = Deployment.query({appname: 'appname'})
            $http.flush();

            angular.forEach(deps, function(d) {
                expect(d.appname).toEqual('appname');
                expect(d.depname).toEqual('depname');
                expect(d.dep_id).toEqual('dep12345678');
            });
        });

    });

    describe("calculate_total", function() {
        it('should be correct with no billed boxes and no billed addons', function () {
            var total = Deployment.calculate_total(
                {"billed_addons": [
                    {
                        "costs": 0.0,
                        "until": 1378684800,
                        "hours": 129.0,
                        "addon": "alias.free"
                    }
                ],
                "billed_boxes": {
                    "free_boxes": 128.42,
                    "costs": 0.0,
                    "boxes": 0.0,
                    "until": 1378684800
                }
            });
            expect(total).toEqual('0.00');
        });

        it('should be correct with billed boxes and one billed addon', function () {
            var total = Deployment.calculate_total(
                {"billed_addons": [
                    {
                        "costs": 129.0,
                        "until": 1378684800,
                        "hours": 129.0,
                        "addon": "oneeuro.perhour"
                    }
                ],
                "billed_boxes": {
                    "free_boxes": 750,
                    "costs": 1.0,
                    "boxes": 100.0,
                    "until": 1378684800
                }
            });
            expect(total).toEqual('130.00');
        });

        it('should be correct with billed boxes and multiple billed addons', function () {
            var total = Deployment.calculate_total(
                {"billed_addons": [
                    {
                        "costs": 129.0,
                        "until": 1378684800,
                        "hours": 129.0,
                        "addon": "oneeuro.perhour"
                    },
                    {
                        "costs": 260.0,
                        "until": 1378684800,
                        "hours": 130.0,
                        "addon": "twoeuro.perhour"
                    }
                ],
                "billed_boxes": {
                    "free_boxes": 750,
                    "costs": 1.0,
                    "boxes": 100.0,
                    "until": 1378684800
                }
            });
            expect(total).toEqual('390.00');
        });
    });
});
