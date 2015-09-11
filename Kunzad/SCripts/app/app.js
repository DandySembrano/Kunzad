// app.js

var kunzadApp = angular.module('kunzadApp', ['ngRoute', 'ng-context-menu', 'ui.bootstrap', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.moveColumns', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.exporter']);
    kunzadApp.run(function ($rootScope) {
        //Triggers before actionForm function
        $rootScope.formatControlNo = function (prefix, length, value) {
            var formattedValue = prefix + value.toString();
            while (formattedValue.length < length) {
                formattedValue = "0" + formattedValue;
            }
            return formattedValue;
        };
    })
    kunzadApp.config(['$routeProvider', function ($routeProvider) {
        //Setup routes to load partial templates from server. TemplateUrl is the location for the server view (Razor .cshtml view)
        $routeProvider

            .when('/home', {
                templateUrl: '/Home/Main'
            })

            .when('/booking', {
                templateUrl: '/References/booking',
                controller: 'BookingController'
            })
            .when('/seafreight', {
                templateUrl: '/References/SeaFreight',
                controller: 'SeaFreightController'
            })

            .when('/customers', {
                templateUrl: '/References/Customers',
                controller: 'CustomerController'
            })

            .when('/customergroups', {
                templateUrl: '/References/CustomerGroups',
                controller: 'CustomerGroupController'
            })

            .when('/airlines', {
                templateUrl: '/References/Airlines',
                controller: 'AirlineController'
            })

            .when('/courier', {
                templateUrl: '/References/Courier',
                controller: 'CourierController'
            })

            .when('/truckers', {
                templateUrl: '/References/Truckers',
                controller: 'TruckerController'
            })

            .when('/trucktype', {
                templateUrl: '/References/TruckType',
                controller: 'TruckTypeController'
            })

            .when('/industry', {
                templateUrl: '/References/Industry',
                controller: 'IndustryController'
            })

            .when('/businessunittype', {
                templateUrl: '/References/BusinessUnitType',
                controller: 'BusinessUnitTypeController'
            })

            .when('/shipmenttype', {
                templateUrl: '/References/ShipmentType',
                controller: 'ShipmentTypeController'
            })
    
            .when('/servicecategory', {
                templateUrl: '/References/ServiceCategory',
                controller: 'ServiceCategoryController'
            })

            .when('/contactnotype', {
                templateUrl: '/References/ContactnoType',
                controller: 'ContactnoTypeController'
            })

            .when('/driver', {
                templateUrl: '/References/Driver',
                controller: 'DriverController'
            })

            .when('/country', {
                templateUrl: '/References/Country',
                controller: 'CountryController'
            })

            .when('/shippinglines', {
                templateUrl: '/References/ShippingLines',
                controller: 'ShippingLinesController'
            })

            .when('/businessunit', {
                templateUrl: '/References/BusinessUnit',
                controller: 'BusinessUnitController'
            })

            .when('/serviceablearea', {
                templateUrl: '/References/ServiceableArea',
                controller: 'ServiceableAreaController'
            })

            .when('/trucking', {
                templateUrl: '/References/Trucking',
                controller: 'TruckingController'
            })

            .when('/seafreight', {
                templateUrl: '/References/SeaFreight',
                controller: 'SeaFreightController'
            })

            .otherwise({
                redirectTo: '/home'
            });
    }])

        .controller('RootController', ['$rootScope', '$scope', '$route', '$routeParams', '$location', '$http',
            function ($rootScope, $scope, $route, $routeParams, $location, $http) {

                $scope.$on('$routeChangeSuccess', function (e, current, previous) {
                    $scope.activeViewPath = $location.path();
                });

                // Temporary - support one country only (Philippines)
                $rootScope.country = {
                    "Id": 1,
                    "Name": "Philippines",
                }
            
                var cityMunicipalities = [];
                $rootScope.getCityMunicipalities = function () {
                    return cityMunicipalities;
                }

                // Get List of CityMunicipalities
                var getCityMunicipalitiesFromApi = function () {
                    //alert("get");
                    $http.get("/api/CityMunicipalities?countryId=" + $rootScope.country.Id)
                        .success(function (data, status) {
                            cityMunicipalities = data;
                        })
                        .error(function (data, status) {
                        });
                }

                function init() {
                    getCityMunicipalitiesFromApi();
                }

                init();

            }]);


    // -------------------------------------------------------------------------//
    // Open Modal Panel - Use in DataTable //
    function openModalPanel (panelName) {
        //Open Modal Form/Panel
        jQuery.magnificPopup.open({
            removalDelay: 500, //delay removal by X to allow out-animation,
            items: { src: panelName },
            callbacks: {
                beforeOpen: function (e) {
                    var Animation = "mfp-flipInY";
                    this.st.mainClass = Animation;
                },
                afterClose: function () {
                }
            },
            midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
        })
    }


    // -------------------------------------------------------------------------//
    // Usage for spin.js
    var opts = {
        lines: 11, // The number of lines to draw
        length: 11, // The length of each line
        width: 4, // The line thickness
        radius: 11, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 46, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };
    var spinnerTarget = document.getElementById('spinnerTarget');
