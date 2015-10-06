
kunzadApp.controller("AirFreightsController", AirFreightsController);
function AirFreightsController($scope, $http, $interval, $filter, $rootScope) {
    $scope.modelName = "Air Freight";
    $scope.modelhref = "#/airfreight";
    $scope.isPrevPage = false;
    $scope.isNextPage = true;
    $scope.actionMode = "Create";
    $scope.selected = null;
    $scope.currentPage = 1;
    $scope.viewOnly = false;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.submitButtonText = "Submit";
    $scope.tabPages = ["Information", "List"];
    $scope.selectedTab = "Information";
    $scope.showMenu = false;
    $scope.airFreightItem = [];
    //$scope.airFreightList = [];
    $scope.businessUnitList = [];
    $scope.shipmentList = [];
    var pageSize = 20;

    // INITIALIZE TRUCKING ITEM
    $scope.initAirFreightItem = function () {
        $scope.airFreightItem = {
            "Id": null,
            "AirlineId": null,
            "Airline": {
                "Id": null,
                "Name": null
            },
            "AirlineWaybillNumber": null,
            "AirlineWaybillDate": null,
            "EstimatedDepartureDate": null,
            "EstimatedDepartureTime": null,
            "EstimatedArrivalDate": null,
            "EstimatedArrivalTime": null,
            "OriginBusinessUnitId": null,
            "DestinationBusinessUnitId": null,
            "DepartureDate": null,
            "DepartureTime": null,
            "ArrivalDate": null,
            "ArrivalTime": null,
            "CreatedDate": null,
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null,
            "AirFreightShipment": []
        }
    };

    $scope.addNewShipment = function () {
        $scope.shipmentList.push(
             {
                 "Id": null,
                 "TruckingId": null,
                 "ShipmentId": null,
                 "Shipment": {
                     "Id": null,
                     "BusinessUnitId": null,
                     "ServiceId": null,
                     "Service": {
                         "Id": null,
                         "Name": null
                     },
                     "ShipmentTypeId": null,
                     "ShipmentType": {
                         "Id": null,
                         "Name": null
                     },
                     "PaymentMode": null,
                     "CustomerId": null,
                     "Customer": {
                     "Id": null,
                         "Name": null
                     },
                     "Quantity": null,
                     "TotalCBM": null,
                     "Description": null,
                     "DeliverTo": null,
                     "DeliveryAddressId": null,
                     "DeliveryAddress": null,
                     "Address1": {
                         "Id": null,
                         "Line1": null,
                         "Line2": null,
                         "CityMunicipalityId": null,
                         "CityMunicipality": {
                             "Id": null,
                             "Name": null,
                             "StateProvince": {
                                 "Id": null,
                                 "Name": null,
                                 "CountryId": null,
                                 "Country": {
                                     "Id": null,
                                     "Name": null
                                 }
                             }

                         },
                         "PostalCode": null
                     }
                 },
                 "CustomerId": null,
                 "Customer": { 
                    "Id": null,
                    "Name": null 
                    },
                    "Quantity": null,
                 "CBM": null,
                 "Description": null,
                 "DeliverTo": null,
                 "DeliveryAddressId": null,
                 "DeliveryAddress": null,
                 "Address1": {
                    "Id": null,
                    "Line1": null,
                    "Line2": null,
                    "CityMunicipalityId": null,
                    "CityMunicipality": {
                        "Id": null,
                        "Name": null,
                        "StateProvince": {
                            "Id": null,
                            "Name": null,
                            "CountryId": null,
                            "Country": {
                                "Id": null,
                                "Name": null
                             }
                         }

                     },
                                "PostalCode": null
                 },
                "DeliveryDate": null,
                "DeliveryTime": null,
                "CostAllocation": null,
                "CreatedDate": null,
                "LastUpdatedDate": null,
                "CreatedByUserId": null,
                "LastUpdatedByUserId": null
             }
        );
    };

    // MODAL
    $scope.showModal = function (panel) {
        openModalPanel(panel);
    };

    // INITIALIZE BUSINESS UNITS
    $scope.initBusinessUnits = function () {
        $http.get("/api/BusinessUnits")
        .success(function (data, status) {
            $scope.businessUnitList = data;
        })
    };

    // INITIALIZE SHIPMENTS
    $scope.initShipments = function () {
        $http.get("/api/Shipments")
        .success(function (data, status) {
            $scope.shipmentList = data;
        })
    };

    // CLOSE MODAL BUSINESS UNIT FOR ORIGIN
    $scope.closeModalBusinessUnitOrigin = function (buo) {
        if (angular.isDefined(buo)) {
            $scope.airFreightItem.OriginBusinessUnitId = buo.Id;
            $scope.airFreightItem.OriginBusinessUnitName = buo.Name;
        } else {
            $scope.airFreightItem.OriginalBusinessUnitId = null;
            $scope.airFreightItem.OriginalBusinessUnitName = null;
        }
        jQuery.magnificPopup.close();
    }

    // CLOSE MODAL BUSINESS UNIT FOR DESTINATION
    $scope.closeModalBusinessUnitDestination = function (bud) {
        if (angular.isDefined(bud)) {
            $scope.airFreightItem.DestinationBusinessUnitId = bud.Id;
            $scope.airFreightItem.DestinationBusinessUnitName = bud.Name;
        } else {
            $scope.airFreightItem.DestinationBusinessUnitId = null;
            $scope.airFreightItem.DestinationBusinessUnitName = null;
        }
        jQuery.magnificPopup.close();
    }

    //Set the focus on top of the page during load
    $scope.focusOnTop = function () {
        $(document).ready(function () {
            $(this).scrollTop(0);
        });
    };

    // Initialization routines
    var init = function () {
        $scope.focusOnTop();
        $scope.initAirFreightItem();
        $scope.initBusinessUnits();
        $scope.initShipments();
        //$scope.loadData($scope.currentPage);
        $scope.addNewShipment();
    };

    init();
};