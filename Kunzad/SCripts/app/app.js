﻿var kunzadApp = angular.module('kunzadApp', ['ngRoute', 'ng-context-menu', 'ui.bootstrap', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.moveColumns', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.exporter', 'ui.grid.edit', 'ui.grid.cellNav', 'LocalForageModule']);
kunzadApp.run(function () {});
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

        .when('/rates', {
            templateUrl: '/References/Rates',
            controller: 'RatesController'
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

        .when('/courierdelivery', {
            templateUrl: '/References/CourierDelivery',
            controller: 'CourierDeliveryController'
        })

        .when('/consolidation/vanstuff', {
            templateUrl: '/References/Consolidation',
            controller: 'ConsolidationController'
        })

        .when('/consolidation/batch', {
            templateUrl: '/References/Consolidation',
            controller: 'ConsolidationController'
        })

        .when('/documentation', {
            templateUrl: '/References/Documentation',
            controller: 'DocumentationController'
        })

        .when('/seafreightloading', {
            templateUrl: '/References/SeaFreightLoading',
            controller: 'SeaFreightLoadingController'
        })

        .when('/seafreightarrival', {
            templateUrl: '/References/SeaFreightArrival',
            controller: 'SeaFreightArrivalController'
        })

        .when('/airfreightloading', {
            templateUrl: '/References/AirFreightLoading',
            controller: 'AirFreightLoadingController'
        })

         .when('/airfreightarrival', {
             templateUrl: '/References/AirFreightArrival',
             controller: 'AirFreightArrivalController'
         })

        .when('/pod', {
            templateUrl: '/References/POD',
            controller: 'PODController'
        })

       .when('/deliveryexception', {
           templateUrl: '/References/DeliveryException',
           controller: 'DeliveryExceptionController'
       })

       .when('/deliveryexceptionbatching', {
           templateUrl: '/References/DeliveryExceptionBatching',
           controller: 'DeliveryExceptionBatchingController'
       })

        .otherwise({
            redirectTo: '/home'
        });
}])

.config(['$localForageProvider', function ($localForageProvider) {
    $localForageProvider.config({
        name: 'myApp', // name of the database and prefix for your data, it is "lf" by default
        version: 1.0, // version of the database, you shouldn't have to use this
        storeName: 'keyvaluepairs', // name of the table
        description: 'some description'
    })
}])

.controller('RootController', ['$rootScope', '$scope', '$route', '$routeParams', '$location', '$http', '$localForage', '$compile',
    function ($rootScope, $scope, $route, $routeParams, $location, $http, $localForage, $compile) {

        $rootScope.isLogged = true;
        $rootScope.flag = false;

        $scope.checkAccess = function (e, currentUrl) {
            $localForage.getItem("Token").then(function (value) {
                if (angular.isUndefined(value)) {
                    alert("Session Expired. Please re-login(Temporarily redirected to " + document.URL.split("#")[0] + ")")
                    window.location = document.URL.split("#")[0];
                }
                else {
                    
                    if ($scope.hasAccess(currentUrl) == false) {
                        e.preventDefault();
                        window.location = document.URL.split("#")[0] + "Authentication/Denied";
                    }
                }
            });
        }

        $scope.$on('$routeChangeStart', function (angularEvent, current, next) {
            if (angular.isUndefined(current.$$route)) {
                $rootScope.flag = true;
            }
            else {
                if ($rootScope.flag)
                    $rootScope.flag = false;
                else {
                    if ($rootScope.isLogged) { //Check if user has logged in
                        if (current.$$route.originalPath != "/home")
                            $scope.checkAccess(angularEvent, current.$$route.originalPath);
                    }
                    else//Redirect to login page
                        window.location = document.URL.split("#")[0];
                }
            }
        });
        
        //----------------------------------------SignalR Socketing-----------------------------------------
        $rootScope.baseUrl = "http://localhost/";
        $rootScope.scanning = null;
        $rootScope.scannedData = null;
        $rootScope.scannerWatcher = false;

        $rootScope.scanning = $.connection.scanningHub;
        $.connection.hub.url = "http://localhost/signalr";

        //remove the connection id
        $rootScope.removeClient = function () {
            $.connection.hub.start().done(function () {
                $rootScope.scanning.server.removeClient($.connection.hub.id)
                .done(function () { })
                .fail(function () { });
            })
        };
        $rootScope.connectoToHub = function () {
            if ($rootScope.scanning != null) {
                //Add user to hub
                $.connection.hub.start()
                .done(function () {
                    $rootScope.scanning.server.addClient($.connection.hub.id, "KENNETHCY").done(function () {
                        console.log("Success");
                        console.log($.connection.hub.id);
                    })
                    .fail(function () {
                        $rootScope.scanning = $.connection.scanningHub;
                        console.log("Failed to add user in the hub.");
                    });
                })
                .fail(function () {
                    console.log("Connection to hub failed.");
                })

                //Receiver function from scanningHub that broadcast shipmentDetails
                $rootScope.scanning.client.broadcastShipmentDetails = function (text, access, connectionId) {
                    if (access == "AUTHENTICATED") {
                        $rootScope.scannerWatcher = true;
                        $rootScope.scannedText = text;
                        $rootScope.scannerConnectionId = connectionId;
                    }
                };
            }
            else
                console.log("Hub not found.");
        };

        //-------------------------------------End of SignalR Socketing-------------------------------------

        //-------------------------------------Menu Manipulation--------------------------------------------
        $scope.userMenuList = [];
        $scope.groupMenu = [];
        $scope.groupMenuItem = [];

        $scope.hasAccess = function (url) {
            console.log($scope.userMenuList);
            for (var i = 0; i < $scope.userMenuList.length; i++) {
                if ($scope.userMenuList[i].Link.toString().replace('#/', '') == url.toString().replace('/', ''))
                    return true;
            }
            return false;
        }

        $scope.checkIfHasAccess = function (menuId) {
            for (var i = 0; i < $scope.userMenuAccess.length; i++) {
                if ($scope.userMenuAccess[i].MenuId == menuId)
                    return true;
            }
            return false;
        };

        $scope.getUserMenu = function () {
            for (var i = 0; i < $scope.menu.length; i++) {
                if ($scope.checkIfHasAccess($scope.menu[i].Id)) {
                    $scope.userMenuList.push($scope.menu[i]);
                }
                if ($scope.menu[i].ParentId == null)
                    $scope.groupMenu.push($scope.menu[i]);
                if($scope.menu[i].ParentId != null && $scope.menu[i].IsParent == "Y")
                    $scope.groupMenuItem.push($scope.menu[i]);
            }
        };

        $scope.hasMenu = function (menuId) {
            for (var i = 0; i < $scope.userMenuList.length; i++) {
                if ($scope.userMenuList[i].Id == menuId)
                    return true;
            }
            return false;
        };

        $scope.hasChild = function (menuId) {
            for (var i = 0; i < $scope.userMenuList.length; i++) {
                if ($scope.userMenuList[i].ParentId == menuId)
                    return true;
            }
            return false;
        };

        $scope.showGroupMenu = function (menuId) {
            //Show Group Menu if at least one of it's item(Group Menu Item) has child
            for (var i = 0; i < $scope.groupMenuItem.length; i++) {
                if ($scope.hasChild($scope.groupMenuItem[i].Id))
                    return true;
            }
            return false;
        };

        //------------------------------End of Menu Manipulation--------------------------------------------

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

        //Reusable object for filtering courier so that other module can directly access
        $rootScope.courierObj = function () {
            return {
                "Courier": [
                    {
                        "Id": null,
                        "Name": null,
                        "TIN": null,
                        "Line1": null,
                        "Line2": null,
                        "PostalCode": null
                    },
                    {
                        "Id": null,
                        "Name": null,
                        "TIN": null,
                        "Line1": null,
                        "Line2": null,
                        "PostalCode": null
                    }]
            }
        };

        //Reusable object for filtering airline so that other module can directly access
        $rootScope.airlineObj = function () {
            return {
                "AirLine": [
                    {
                        "Name": "Philippine Airlines",
                        "CreatedDate": "2015-06-05T10:44:07.767",
                        "LastUpdatedDate": "2015-06-07T08:29:35.213",
                        "CreatedByUserId": null,
                        "LastUpdatedByUserId": null
                    },
                    {
                        "Name": "Philippine Airlines",
                        "CreatedDate": "2015-06-05T10:44:07.767",
                        "LastUpdatedDate": "2015-06-07T08:29:35.213",
                        "CreatedByUserId": null,
                        "LastUpdatedByUserId": null
                    }]
            };
        };

        //Reusable object for filtering airfreight so that other module can directly access

        $rootScope.airFreightObj = function () {
            return {
                "AirFreight": [{
                    "Id": null,
                    "CreatedDate": null
                },
                {
                    "Id": null,
                    "CreatedDate": null
                }]
            };
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
                    { "Id": "30", "Name": "Dispatched" },
                    { "Id": "40", "Name": "Closed" },
                    { "Id": "50", "Name": "Cancelled" }
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

        //Manipulate DOM for removing an element
        $rootScope.manipulateDOM = function () {
            Element.prototype.remove = function () {
                this.parentElement.removeChild(this);
            }
            NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
                for (var i = this.length - 1; i >= 0; i--) {
                    if (this[i] && this[i].parentElement) {
                        this[i].parentElement.removeChild(this[i]);
                    }
                }
            }
        };

        //Remove element in DOM
        $rootScope.removeElement = function (id) {
            var element = document.getElementById(id);
            if (element != null) {
                element.parentNode.removeChild(element);
            }
        };

        $rootScope.token = null;
        // Get List of CityMunicipalities
        var getCityMunicipalitiesFromApi = function () {
            $http.defaults.headers.common['Token'] = $rootScope.token.toString();
            $http.get("api/CityMunicipalities?countryId=" + $rootScope.country.Id)
                .success(function (data, status) {
                    cityMunicipalities = data;
                })
                .error(function (data, status) {
                });
        }

        var cityMunicipalities = [];
        $rootScope.getCityMunicipalities = function () {
            return cityMunicipalities;
        };

        function init() {
            //Use UserId number 1 temporarily
            $http.get("/api/users?id=1")
            .success(function (response, status) {
                if (response.status == "SUCCESS") {
                    $scope.menu = response.objParam2;
                    $scope.userMenuAccess = response.objParam1;
                    $scope.getUserMenu();
                    $http.defaults.headers.common.Authorization = 'Basic ' + response.stringParam1;
                    $http.get("/api/authenticate")
                    .success(function (response, status, headers) {
                        $localForage.getItem("Token").then(function (value) {
                            if (angular.isUndefined(value)) {
                                $localForage.setItem("Token", headers().token);
                                $rootScope.token = headers().token;
                                // Temporary - support one country only (Philippines)
                                $rootScope.country = {
                                    "Id": 1,
                                    "Name": "Philippines",
                                }
                                getCityMunicipalitiesFromApi();
                                //$rootScope.connectoToHub();
                            }
                        })
                    })
                    .error(function (err) {
                        console.log("Login failure");
                    })
                }
            })
            .error(function (err) { })
        }

        init();
    }]);


// -------------------------------------------------------------------------//
// Open Modal Panel - Use in DataTable //
function openModalPanel(panelName) {
    //Open Modal Form/Panel
    jQuery.magnificPopup.open({
        //removalDelay: 500, //delay removal by X to allow out-animation,
        items: { src: panelName },
        //callbacks: {
        //    beforeOpen: function (e) {
        //        var Animation = "mfp-flipInY";
        //        this.st.mainClass = Animation;
        //    },
        //    afterClose: function () {

        //    }
        //},
        midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    })
}

// -------------------------------------------------------------------------//
// Open Modal Panel - Use if popup will be close only by triggering the jQuery.magnificPopup.close(); //
function openModalPanel2(panelName) {
    //Open Modal Form/Panel
    jQuery.magnificPopup.open({
        //removalDelay: 500, //delay removal by X to allow out-animation,
        items: { src: panelName },
        modal: true, //the popup will have a modal-like behavior: it won’t be possible to dismiss it by usual means (close button, escape key, or clicking in the overlay).
        //callbacks: {
        //    beforeOpen: function (e) {
        //        var Animation = "mfp-flipInY";
        //        this.st.mainClass = Animation;
        //    },
        //    afterClose: function () {

        //    }
        //},
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