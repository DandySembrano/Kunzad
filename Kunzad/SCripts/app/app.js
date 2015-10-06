var kunzadApp = angular.module('kunzadApp', ['ngRoute', 'ng-context-menu', 'ui.bootstrap', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.moveColumns', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.exporter', 'ui.grid.edit', 'ui.grid.cellNav', 'LocalForageModule']);
kunzadApp.run(function ($rootScope) {
    //Triggers before actionForm function
    $rootScope.formatControlNo = function (prefix, length, value) {
        var formattedValue = prefix + value.toString();
        while (formattedValue.length < length) {
            formattedValue = "0" + formattedValue;
        }
        return formattedValue;
    };

    //Reusable object for filtering shipment/booking so that other module can directly access
    $rootScope.shipmentObj = function () {
        return {
            "Shipment": [{
                "Id": null,
                "CreatedDate": null,
                "CustomerId": null,
                "BusinessUnitId": null,
                "ServiceId": null,
                "ShipmentTypeId": null,
                "PaymentMode": null,
                "PickupDate": null,
                "PickUpBussinessUnitId": null,
                "TransportStatusId": null
            },
            {
                "Id": null,
                "CreatedDate": null,
                "CustomerId": null,
                "BusinessUnitId": null,
                "ServiceId": null,
                "ShipmentTypeId": null,
                "PaymentMode": null,
                "PickupDate": null,
                "PickUpBussinessUnitId": null,
                "TransportStatusId": null
            }]
        };
    };

    //Reusable object for filtering business unit so that other module can directly access
    $rootScope.businessUnitObj = function () {
        return {
            "BusinessUnit": [{
                "Name": null,
                "Code": null,
                "ParentBusinessUnitId": null
            }, {
                "Name": null,
                "Code": null,
                "ParentBusinessUnitId": null
            }]
        };
    };

    //Reusable object for filtering customer so that other module can directly access
    $rootScope.customerObj = function () {
        return {
            "Customer": [{
                        "Name": null,
                        "Title": null
                        },
                        {
                            "Name": null,
                            "Title": null
                        }]
            
        };
    };

    //Reusable object for filtering customer contacts so that other module can directly access
    $rootScope.customerContactsObj = function () {
        return {
            "CustomerContact": [{
                "Contact": {
                    "Name": null,
                    "Title": null
                }
            }, {
                "Contact": {
                    "Name": null,
                    "Title": null
                }
            }]
        }
    };
    
    //Reusable object for filtering customer contacts so that other module can directly access
    $rootScope.customerContactPhonesObj = function () {
        return {
            "ContactPhone": [{
                "ContactNumber": null,
                "ContactId": null
            }, {
                "ContactNumber": null,
                "ContactId": null
            }]
        }
    };

    //Reusable object for filtering customer addresses so that other module can directly access
    $rootScope.customerAddressObj = function () {
        return {
            "CustomerAddress": [{
                "Line1": null,
                "Line2": null,
                "CityMunicipality": {
                    "Name": null
                },
                "PostalCode": null,
                "IsBillingAddress": null,
                "IsDeliveryAddress": null,
                "IsPickupAddress": null
            }, {
                "Line1": null,
                "Line2": null,
                "CityMunicipality": {
                    "Name": null
                },
                "PostalCode": null,
                "IsBillingAddress": null,
                "IsDeliveryAddress": null,
                "IsPickupAddress": null
            }]
        }
    };

    //Payment Mode List
    $rootScope.getPaymentModeList = function () {
        return [{ "Id": "A", "Name": "Account" },
                { "Id": "P", "Name": "Prepaid" },
                { "Id": "C", "Name": "Collect Account" },
                { "Id": "D", "Name": "Cash On Delivery" }
        ];
    };

    //Transport Status List
    $rootScope.getTransportStatusList = function () {
        return [{ "Id": "10", "Name": "Open" },
                { "Id": "20", "Name": "Partial" },
                { "Id": "30", "Name": "Dispatch" },
                { "Id": "40", "Name": "Close" },
                { "Id": "50", "Name": "Cancel" }
        ];
    };
    //Trucking Status List
    $rootScope.getTruckingStatusList = function () {
        return [{ "Id": "10", "Name": "Dispatch" },
                { "Id": "20", "Name": "Waybill" },
                { "Id": "30", "Name": "DeliveryUpdate" },
                { "Id": "40", "Name": "Cancelled" },
        ]; 
    };

    //Remove unnecessary 
    $rootScope.formatShipment = function (shipments) {
        for (var i = 0; i < shipments.length; i++) {
            var holder = {};

            //Format Address
            holder = shipments[i].Address;
            holder1 = shipments[i].Address.CityMunicipality;
            holder2 = shipments[i].Address.CityMunicipality.StateProvince;
            shipments[i].Address = {};
            shipments[i].Address = {
                "Id": holder.Id,
                "Line1": holder.Line1,
                "Line2": holder.Line2,
                "PostalCode": holder.PostalCode,
                "CityMunicipalityId": holder.CityMunicipalityId,
                "CityMunicipality": {
                    "Name": holder1.Name,
                    "StateProvince": {
                        "Name": holder2.Name
                    }
                }
            }

            //Format Address
            holder = shipments[i].Address1;
            holder1 = shipments[i].Address1.CityMunicipality;
            holder2 = shipments[i].Address1.CityMunicipality.StateProvince;
            shipments[i].Address1 = {};
            shipments[i].Address1 = {
                "Id": holder.Id,
                "Line1": holder.Line1,
                "Line2": holder.Line2,
                "PostalCode": holder.PostalCode,
                "CityMunicipalityId": holder.CityMunicipalityId,
                "CityMunicipality": {
                    "Name": holder1.Name,
                    "StateProvince": {
                        "Name": holder2.Name
                    }
                }
            }

            //BusinessUnit
            holder = shipments[i].BusinessUnit;
            shipments[i].BusinessUnit = {};
            shipments[i].BusinessUnit = {
                "Id": holder.Id,
                "Name": holder.Name
            }

            //BusinessUnit1
            holder = shipments[i].BusinessUnit1;
            shipments[i].BusinessUnit1 = {};
            shipments[i].BusinessUnit1 = {
                "Id": holder.Id,
                "Name": holder.Name
            }

            //Service
            holder = shipments[i].Service;
            shipments[i].Service = {};
            shipments[i].Service = {
                "Id": holder.Id,
                "Name": holder.Name
            }

            //ShipmentType
            holder = shipments[i].ShipmentType;
            shipments[i].ShipmentType = {};
            shipments[i].ShipmentType = {
                "Id": holder.Id,
                "Name": holder.Name
            }

            //Customer
            holder = shipments[i].Customer;
            holder1 = shipments[i].Customer.CustomerAddresses;
            holder2 = shipments[i].Customer.CustomerContacts[0].Contact;
            holder3 = shipments[i].Customer.CustomerContacts[0].Contact.ContactPhones;
            shipments[i].Customer = {};

            shipments[i].Customer = {
                "Id": holder.Id,
                "Code": holder.Code,
                "Name": holder.Name,
                //CustomerAddresses
                "CustomerAddresses": [{
                    "Id": holder1[0].Id,
                    "Line1": holder1[0].Line1,
                    "Line2": holder1[0].Line2,
                    "PostalCode": holder1[0].PostalCode,
                    "CityMunicipality": {
                        "Id": holder1[0].Id,
                        "Name": holder1[0].CityMunicipality.Name,
                        "StateProvince": {
                            "Name": holder1[0].CityMunicipality.StateProvince.Name
                        }
                    }
                }],
                //CustomerContacts
                "CustomerContacts": [{
                    "Contact": {
                        "Id": holder2.Id,
                        "Email": holder2.Email,
                        "Name": holder2.Name,
                        "Title": holder2.Title,
                        //ContactPhones
                        "ContactPhones": [{
                            "Id": holder3[0].Id,
                            "ContactNumber": holder3[0].ContactNumber
                        }]
                    }
                }]
            }
            delete shipments[i].SeaFreightShipments;
            delete shipments[i].ShipmentCharges;
            delete shipments[i].ShipmentDimensions;
            delete shipments[i].TruckingDeliveries;
            delete shipments[i].AirFreightShipments;
            delete shipments[i].CourierTransactionDetails;
        }
        return shipments;
    };

    $rootScope.getTruckingTypeList = function () {
        return [
            { "Id": 10, "Name": "Pick up" },
            { "Id": 20, "Name": "Trucking Delivery" }
        ]
    };
});
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

        .when('/truckingwb', {
            templateUrl: '/References/TruckingWB',
            controller: 'TruckingsWBController'
        })

        .when('/airfreight', {
            templateUrl: '/References/AirFreight',
            controller: 'AirFreightsController'
        })

        .otherwise({
            redirectTo: '/home'
        });
    }])

   .config(['$localForageProvider', function($localForageProvider){
        $localForageProvider.config({
            name        : 'myApp', // name of the database and prefix for your data, it is "lf" by default
            version     : 1.0, // version of the database, you shouldn't have to use this
            storeName   : 'keyvaluepairs', // name of the table
            description : 'some description'
        })
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
        shadow: true, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };
    var spinnerTarget = document.getElementById('spinnerTarget');