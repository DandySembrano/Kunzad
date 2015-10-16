﻿
kunzadApp.controller("SeaFreightController", SeaFreightController);
function SeaFreightController($scope, $http, $interval, $filter, $rootScope, $compile) {
    $scope.modelName = "Sea Freight";
    $scope.modelhref = "#/seafreight";
    $scope.withDirective = true; //this will remove the create and pagination buttons in list tab
    $scope.seafreightGridOptions = {};
    $scope.seafreightGridOptions.data = [];
    $scope.SeaFreightShipmentGridOptions = {};
    $scope.SeaFreightShipmentGridOptions.data = [];
    $scope.seaFreightShipmentItem = {};
    $scope.isPrevPage = false;
    $scope.isNextPage = true;
    $scope.seaFreightToggle = false;
    $scope.actionMode = "Create";
    $scope.selected = null;
    $scope.currentPage = 1;
    $scope.viewOnly = false;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.submitButtonText = "Submit";
    $scope.tabPages = ["Information", "List"];
    $scope.selectedTab = "Information";
    $scope.seafreightIDholder = 0;
    $scope.selectedseafreightIndex = 0;
    $scope.controlNoHolder = 0;
    $scope.modalType = null;
    var pageSize = 20;

        $scope.showModal = function (panel, type) {
            switch (type) {
                case 'origin':
                    $scope.loadBusinessUnitDataGrid();
                    $scope.loadBusinessUnitFiltering();
                    $scope.businessUnitFilteringDefinition.SetSourceToNull = true;
                    $scope.businessUnitDataDefinition.Retrieve = true;
                    break;
                case 'destination':
                    $scope.loadBusinessUnitDataGrid();
                    $scope.loadBusinessUnitFiltering();
                    $scope.businessUnitFilteringDefinition.SetSourceToNull = true;
                    $scope.businessUnitDataDefinition.Retrieve = true;
                    break;
                case 'shippingline':
                    $scope.loadShippingLineDataGrid();
                    $scope.loadShippingLineFiltering();
                    $scope.shippingLineFilteringDefinition.SetSourceToNull = true;
                    $scope.shippingLineDataDefinition.Retrieve = true;
                    break;
                case 'vessel':
                    $scope.loadVesselDataGrid();
                    $scope.loadVesselFiltering();
                    $scope.vesselFilteringDefinition.SetSourceToNull = true;
                    $scope.vesselDataDefinition.Retrieve = true;
                    break;
                case 'vesselVoyage':
                    $scope.loadVesselVoyageDataGrid();
                    $scope.loadVesselVoyageFiltering();
                    $scope.vesselVoyageFilteringDefinition.SetSourceToNull = true;
                    $scope.vesselVoyageDataDefinition.Retrieve = true;
                    break;
                case 'seaFreightShipment':
                    $scope.seaFreightShipmentFilteringDefinition.SetSourceToNull = true;
                    $scope.seaFreightShipmentDataDefinition.Retrieve = true;
                    break;
                case 'shipment':
                    $scope.loadShipmentDataGrid();
                    $scope.loadShipmentFiltering();
                    $scope.shipmentFilteringDefinition.SetSourceToNull = true;
                    $scope.shipmentDataDefinition.Retrieve = true;
                    break;
            }

            openModalPanel2(panel);
            $scope.modalType = type;
        };
        
        $scope.closeModal = function () {
            jQuery.magnificPopup.close();
            if (angular.isDefined($scope.businessUnitDataDefinition)) {
                $scope.businessUnitDataDefinition.DataList = [];
                $scope.businessUnitFilteringDefinition.DataList = [];
                $rootScope.removeElement("businessUnitGrid");
                $rootScope.removeElement("businessUnitFilter");
            }
            if (angular.isDefined($scope.shippingLineDataDefinition)) {
                $scope.shippingLineDataDefinition.DataList = [];
                $scope.shippingLineFilteringDefinition.DataList = [];
                $rootScope.removeElement("shippingLineGrid");
                $rootScope.removeElement("shippingLineFilter");
            }
            if (angular.isDefined($scope.vesselDataDefinition)) {
                $scope.vesselDataDefinition.DataList = [];
                $scope.vesselFilteringDefinition.DataList = [];
                $rootScope.removeElement("vesselGrid");
                $rootScope.removeElement("vesselFilter");
            }
            if (angular.isDefined($scope.vesselVoyageDataDefinition)) {
                $scope.vesselVoyageDataDefinition.DataList = [];
                $scope.vesselVoyageFilteringDefinition.DataList = [];
                $rootScope.removeElement("vesselVoyageGrid");
                $rootScope.removeElement("vesselVoyageFilter");
            }
            if (angular.isDefined($scope.shipmentDataDefinition)) {
                $scope.shipmentDataDefinition.DataList = [];
                $scope.shipmentFilteringDefinition.DataList = [];
                $rootScope.removeElement("shipmentGrid");
                $rootScope.removeElement("shipmentFilter");
            }
        };

        //same with rootScope.shipmentObj
        $scope.seaFreightObj = function () {
            return {
                "SeaFreight": [{
                    "Id": null,
                    "BLDate": null,
                    "OriginBusinessUnitId": null,
                    "DestinationBusinessUnitId": null,
                    "CreatedDate": null,
                    "LastUpdatedDate": null
                },
                {
                    "Id": null,
                    "BLDate": null,
                    "OriginBusinessUnitId": null,
                    "DestinationBusinessUnitId": null,
                    "CreatedDate": null,
                    "LastUpdatedDate": null
                }]
            };
        }

        //same with rootScope.shipmentObj
        $scope.shippingLineObj = function () {
            return {
                "ShippingLine": [{
                    "Id": null,
                    "Name": null
                },
                {
                    "Id": null,
                    "Name": null
                }]
            };
        }

        //same with rootScope.shipmentObj
        $scope.vesselObj = function () {
            return {
                "Vessel": [{
                    "Id": null,
                    "Name": null,
                    "ShippingLineId": null
                },
                {
                    "Id": null,
                    "Name": null,
                    "ShippingLineId": null
                }]
            };
        }
        
        //same with rootScope.shipmentObj
        $scope.vesselVoyageObj = function () {
            return {
                "VesselVoyage": [{
                    "Id": null,
                    "VoyageNo": null,
                    "VesselId": null,
                    "OriginBusinessUnitId": null,
                    "DestinationBusinessUnitId": null,
                    "EstimatedDepartureDate": null,
                    "EstimatedDepartureTime": null,
                    "EstimatedArrivalDate": null,
                    "EstimatedArrivalTime": null,
                    "DepartureDate": null,
                    "DepartureTime": null,
                    "ArrivalDate": null,
                    "ArrivalTime": null
                },
                {
                    "Id": null,
                    "VoyageNo": null,
                    "VesselId": null,
                    "OriginBusinessUnitId": null,
                    "DestinationBusinessUnitId": null,
                    "EstimatedDepartureDate": null,
                    "EstimatedDepartureTime": null,
                    "EstimatedArrivalDate": null,
                    "EstimatedArrivalTime": null,
                    "DepartureDate": null,
                    "DepartureTime": null,
                    "ArrivalDate": null,
                    "ArrivalTime": null
                }]
            };
        }
        
        //check if row is empty or specific field was not filled up
        $scope.validSeaFreightShipments = function () {
            for (var i = 0; i < $scope.seaFreightShipmentsDataDefinition.DataList.length; i++) {
                if ($scope.seaFreightShipmentsDataDefinition.DataList[i].ShipmentId == 0) {
                    $scope.seaFreightIsError = true;
                    $scope.seaFreightErrorMessage = "Shipment is required in row " + (i + 1) + ".";
                    $scope.focusOnTop();
                    return false;
                }
                else if ($scope.seaFreightShipmentsDataDefinition.DataList[i].CostAllocation == null || $scope.seaFreightShipmentsDataDefinition.DataList[i].CostAllocation == 0) {
                    $scope.seaFreightIsError = true;
                    $scope.seaFreightErrorMessage = "Cost Allocation must be greater than zero in row " + (i + 1) + ".";
                    $scope.focusOnTop();
                    return false;
                }
            }
            return true;
        };
        
        // NUMBERS w/ DECIMAL AND COMMA
        $('#freightCost').priceFormat({
            clearPrefix: true,
            prefix: '',
            centsSeparator: '.',
            thousandsSeparator: ',',
            centsLimit: 2
        });
        
        //Initialize Address fields
        $scope.initializeAddressField = function (addressItem) {
            $scope.formattedAddress = addressItem.Line1 + (addressItem.Line2 == "" || addressItem.Line2 == null ? " " : ", " + addressItem.Line2) + "\n";
            $scope.formattedAddress += addressItem.CityMunicipality.Name + ", " + (addressItem.CityMunicipality.StateProvince == null ? "" : addressItem.CityMunicipality.StateProvince.Name + "\n");
            $scope.formattedAddress += $scope.country.Name + ", " + addressItem.PostalCode;
            return $scope.formattedAddress;
        };
        
        //=================================================START OF SEA FREIGHT DATA GRID=================================================
        //Initialized seafreight item to it's default value
        $scope.seaFreightResetData = function () {
            $scope.seafreightItem = {
                "Id": null,
                "BLNumber": null,
                "BLDate": null,
                "VesselVoyageId": null,
                "VesselVoyage": {
                    "Id": null,
                    "VesselId": null,
                    "VesselName": null,
                    "ShippingLineId": null,
                    "ShippingLineName": null,
                    "VoyageNo": null,
                    "EstimatedDepartureDate": null,
                    "EstimatedDepartureTime": null,
                    "EstimatedArrivalDate": null,
                    "EstimatedArrivalTime": null,
                    "OriginBusinessUnitId": null,
                    "OriginBusinessUnit": {
                        "Id": null,
                        "Code": null,
                        "Name": null
                    },
                    "DestinationBusinessUnitId": null,
                    "DestinationBusinessUnit": {
                        "Id": null,
                        "Code": null,
                        "Name": null
                    },
                    "DepartureDate": null,
                    "DepartureTime": null,
                    "ArrivalDate": null,
                    "ArrivalTime": null
                },
                "OriginBusinessUnitId": null,
                "BusinessUnit1": {
                    "Id": null,
                    "Code": null,
                    "Name": null
                },
                "DestinationBusinessUnitId": null,
                "BusinessUnit": {
                    "Id": null,
                    "Code": null,
                    "Name": null
                },
                "FreightCost": null,
                "CreatedDate": null,
                "LastUpdatedDate": null,
                "CreatedByUserId": null,
                "LastUpdatedByUserId": null
            };
            //Temporary set BusinessUnit
            $scope.seafreightItem.BusinessUnit1 = {
                "Id": 17,
                "Code": "BU0007",
                "Name": "Manila"
            };
            $scope.seafreightItem.OriginBusinessUnitId = $scope.seafreightItem.BusinessUnit1.Id;


        };

        //Load variable datagrid for compiling
        $scope.loadSeaFreightDataGrid = function () {
            $scope.initSeaFreightDataGrid();
            $scope.compileSeaFreightDataGrid();
        };

        //initialized seafreight data grid
        $scope.initSeaFreightDataGrid = function () {
            $scope.initSeaFreightDataDefinition = function () {
                $scope.seaFreightDataDefinition = {
                    "Header": ['Sea Freight No', 'BL Number', 'BL Date', 'Voyage No', 'Origin', 'Destination', 'Freight Cost', 'No'],
                    "Keys": ['Id', 'BLNumber', 'BLDate', 'VesselVoyage[0].VoyageNo', 'BusinessUnit1[0].Name', 'BusinessUnit[0].Name', 'FreightCost'],
                    "Type": ['ControlNo', 'ProperCase', 'Date', 'ProperCase', 'ProperCase', 'ProperCase', 'Decimal'],
                    "ColWidth": [150, 150, 150, 150, 180, 180, 150],
                    "DataList": [],
                    "RequiredFields": [/*'BLNumber-BL Number', 'BLDate-BL Date', 'VesselVoyageId-Voyage ID', 'OriginBusinessUnitId-Origin Business Unit', 'DestinationBusinessUnitId-Destination Business Unit', 'FreightCost-Freight Cost'*/],
                    "CellTemplate": ["None"],
                    "RowTemplate": "Default",
                    "EnableScroll": true,
                    "EnablePagination": false,
                    "CurrentPage": 1,//By default
                    "PageSize": 20, //Should be the same in back-end
                    "DoPagination": false, //By default
                    "Retrieve": false, //By default
                    "DataItem": {},
                    "DataTarget": "SeaFreightMenu",
                    "DataTarget2": "SeaFreightMenu1",
                    "ShowCreate": true,
                    "ShowContextMenu": true,
                    "ContextMenu": ["'Load'", "'Create'", "'Edit'", "'Delete'", "'View'", "'Find'", "'Clear'"],
                    "ContextMenuLabel": ['Reload', 'Create', 'Edit', 'Cancel', 'View', 'Find', 'Clear']
                }
            };

            $scope.initSeaFreightSubmitDefinition = function () {
                $scope.seaFreightSubmitDefinition = {
                    "Submit": false, //By default
                    "APIUrl": '/api/SeaFreights',
                    "Type": 'Create', //By Default
                    "DataItem": {},
                    "Index": -1 //By Default
                }
            };

            $scope.seaFreightOtheractions = function (action) {
                switch (action) {
                    case "FormCreate":
                        $scope.selectedTab = $scope.tabPages[0];
                        $scope.seaFreightResetData();
                        $scope.seaFreightShipmentsDataDefinition.DataList.splice(0, $scope.seaFreightShipmentsDataDefinition.DataList.length);
                        $scope.seaFreightShipmentsResetData();
                        $scope.enableSave = true;
                        $scope.viewOnly = false;
                        return true;
                    case "PreAction":
                        return true;
                    case "PostCreateAction":
                        $scope.submitButtonText = "Submit";
                        $scope.seaFreightSubmitDefinition.Type = "Create";
                        $scope.selectedTab = $scope.tabPages[0];
                        $scope.seaFreightResetData();
                        $scope.seaFreightShipmentsDataDefinition.DataList.splice(0, $scope.seaFreightShipmentsDataDefinition.DataList.length);
                        $scope.seaFreightShipmentsResetData();
                        $scope.enableSave = true;
                        $scope.viewOnly = false;
                        return true;
                    case "PostEditAction":
                        //If user choose edit-menu in listing
                        if (angular.isDefined($scope.seaFreightDataDefinition.DataItem.Id) && $scope.seafreightItem.Id != $scope.seaFreightDataDefinition.DataItem.Id) {
                            $scope.seaFreightShipmentsDataDefinition.DataList.splice(0, $scope.seaFreightShipmentsDataDefinition.DataList.length);
                            $scope.seafreightItem = angular.copy($scope.seaFreightDataDefinition.DataItem);
                            $scope.controlNoHolder = $scope.seafreightItem.Id;
                            $scope.seafreightItem.Id = $rootScope.formatControlNo('', 15, $scope.seafreightItem.Id);
                            $scope.seafreightItem.CallDate = $filter('Date')($scope.seafreightItem.CallDate);
                            $scope.seafreightItem.CourierCost = $filter('number')($scope.seafreightItem.CourierCost, 2);

                            $scope.getCourierTransactionDetails($scope.seafreightItem.Id);
                            var promise = $interval(function () {
                                if ($scope.flagOnRetrieveDetails) {
                                    $scope.flagOnRetrieveDetails = false;
                                    $interval.cancel(promise);
                                    promise = undefined;
                                    $scope.viewOnly = false;
                                    $scope.submitButtonText = "Submit";
                                    $scope.selectedTab = $scope.tabPages[0];
                                    $scope.seaFreightSubmitDefinition.Type = "Edit";
                                    if ($scope.seaFreightShipmentsDataDefinition.DataList.length > 0)
                                        //Set control no holder in case user will add item in list
                                        $scope.controlNoHolder = $scope.seaFreightShipmentsDataDefinition.DataList[$scope.seaFreightShipmentsDataDefinition.DataList.length - 1].Id + 1;
                                    else
                                        $scope.seaFreightShipmentsResetData();
                                }
                            }, 100);
                        }
                        else {
                            $scope.viewOnly = false;
                            $scope.submitButtonText = "Submit";
                            $scope.selectedTab = $scope.tabPages[0];
                            $scope.seaFreightSubmitDefinition.Type = "Edit";
                        }
                        $scope.enableSave = true;
                        return true;
                    case "PostDeleteAction":
                        //If user choose edit-menu in listing
                        if (angular.isDefined($scope.seaFreightDataDefinition.DataItem.Id) && $scope.seafreightItem.Id != $scope.seaFreightDataDefinition.DataItem.Id) {
                            $scope.seaFreightShipmentsDataDefinition.DataList.splice(0, $scope.seaFreightShipmentsDataDefinition.DataList.length);
                            $scope.seafreightItem = angular.copy($scope.seaFreightDataDefinition.DataItem);
                            $scope.controlNoHolder = $scope.seafreightItem.Id;
                            $scope.seafreightItem.Id = $rootScope.formatControlNo('', 15, $scope.seafreightItem.Id);
                            $scope.seafreightItem.CallDate = $filter('Date')($scope.seafreightItem.CallDate);
                            $scope.seafreightItem.CourierCost = $filter('number')($scope.seafreightItem.CourierCost, 2);

                            $scope.getCourierTransactionDetails($scope.seafreightItem.Id);
                            var promise = $interval(function () {
                                if ($scope.flagOnRetrieveDetails) {
                                    $scope.flagOnRetrieveDetails = false;
                                    $interval.cancel(promise);
                                    promise = undefined;
                                    $scope.viewOnly = true;
                                    $scope.submitButtonText = "Cancel";
                                    $scope.selectedTab = $scope.tabPages[0];
                                    $scope.seaFreightSubmitDefinition.Type = "Edit";
                                }
                            }, 100);
                        }
                        else {
                            $scope.viewOnly = true;
                            $scope.submitButtonText = "Cancel";
                            $scope.selectedTab = $scope.tabPages[0];
                            $scope.seaFreightSubmitDefinition.Type = "Edit";
                        }
                        $scope.enableSave = true;
                        return true;
                    case "PostViewAction":
                        //If user choose edit-menu in listing
                        if (angular.isDefined($scope.seaFreightDataDefinition.DataItem.Id) && $scope.seafreightItem.Id != $scope.seaFreightDataDefinition.DataItem.Id) {
                            $scope.seaFreightShipmentsDataDefinition.DataList.splice(0, $scope.seaFreightShipmentsDataDefinition.DataList.length);
                            $scope.seafreightItem = angular.copy($scope.seaFreightDataDefinition.DataItem);
                            $scope.controlNoHolder = $scope.seafreightItem.Id;
                            $scope.seafreightItem.Id = $rootScope.formatControlNo('', 15, $scope.seafreightItem.Id);
                            $scope.seafreightItem.CallDate = $filter('Date')($scope.seafreightItem.CallDate);
                            $scope.seafreightItem.CourierCost = $filter('number')($scope.seafreightItem.CourierCost, 2);

                            $scope.getCourierTransactionDetails($scope.seafreightItem.Id);
                            var promise = $interval(function () {
                                if ($scope.flagOnRetrieveDetails) {
                                    $scope.flagOnRetrieveDetails = false;
                                    $interval.cancel(promise);
                                    promise = undefined;
                                    $scope.viewOnly = true;
                                    $scope.submitButtonText = "Close";
                                    $scope.selectedTab = $scope.tabPages[0];
                                    $scope.seaFreightSubmitDefinition.Type = "View";
                                }
                            }, 100);

                        }
                        else {
                            $scope.viewOnly = true;
                            $scope.submitButtonText = "Close";
                            $scope.selectedTab = $scope.tabPages[0];
                            $scope.seaFreightSubmitDefinition.Type = "View";
                        }
                        return true;
                    case "PreSubmit":
                        if (!$scope.validSeaFreightShipments())
                            return false;
                        $scope.seaFreightSubmitDefinition.DataItem = angular.copy($scope.seafreightItem);
                        return true;
                    case "PreSave":
                        $scope.seaFreightSubmitDefinition.DataItem.SeaFreightShipments = angular.copy($scope.seaFreightShipmentsDataDefinition.DataList);
                        delete $scope.seaFreightSubmitDefinition.DataItem.Id;
                        delete $scope.seaFreightSubmitDefinition.DataItem.SeaFreight;
                        delete $scope.seaFreightSubmitDefinition.DataItem.BusinessUnit;
                        delete $scope.seaFreightSubmitDefinition.DataItem.BusinessUnit1;
                        delete $scope.seaFreightSubmitDefinition.DataItem.VesselVoyage;
                        for (var i = 0; i < $scope.seaFreightSubmitDefinition.DataItem.SeaFreightShipments.length; i++) {
                            delete $scope.seaFreightSubmitDefinition.DataItem.SeaFreightShipments[i].Id;
                            delete $scope.seaFreightSubmitDefinition.DataItem.SeaFreightShipments[i].Shipment;
                        }
                        return true;
                    case "PostSave":
                        //Initialize Sea Freight Id
                        $scope.seafreightItem.Id = $scope.seaFreightSubmitDefinition.DataItem.Id;
                        $scope.seafreightItem.Id = $rootScope.formatControlNo('', 15, $scope.seafreightItem.Id);
                        //Initialize Sea Freight Shipments Id
                        for (var i = 0; i < $scope.seaFreightSubmitDefinition.DataItem.SeaFreightShipments.length; i++)
                            $scope.seaFreightShipmentsDataDefinition.DataList[i].Id = $scope.seaFreightSubmitDefinition.DataItem.SeaFreightShipments[i].Id;
                        $scope.viewOnly = true;
                        $scope.seaFreightSubmitDefinition.Type = "Edit";
                        alert("Successfully Saved.");
                        return true;
                    case "PreUpdate":
                        $scope.seaFreightSubmitDefinition.DataItem.CourierTransactionDetails = angular.copy($scope.seaFreightShipmentsDataDefinition.DataList);
                        delete $scope.seaFreightSubmitDefinition.DataItem.Courier;
                        delete $scope.seaFreightSubmitDefinition.DataItem.BusinessUnit;
                        for (var i = 0; i < $scope.seaFreightSubmitDefinition.DataItem.CourierTransactionDetails.length; i++) {
                            if ($scope.seaFreightSubmitDefinition.DataItem.CourierTransactionDetails[i].CourierTransactionId == -1) {
                                delete $scope.seaFreightSubmitDefinition.DataItem.CourierTransactionDetails[i].Id;
                                $scope.seaFreightSubmitDefinition.DataItem.CourierTransactionDetails[i].CourierTransactionId = $scope.seafreightItem.Id;
                            }

                            delete $scope.seaFreightSubmitDefinition.DataItem.CourierTransactionDetails[i].Shipment;
                        }
                        return true;
                    case "PostUpdate":
                        $scope.enableSave = false;
                        $scope.viewOnly = true;
                        alert("Successfully Updated.");
                        return true;
                    case "PreDelete":
                        return true;
                    case "PostDelete":
                        return true;
                    case "PostView":
                        return true;
                    case "Find":
                        $scope.selectedTab = $scope.tabPages[1];
                        var promise = $interval(function () {
                            if ($scope.seaFreightToggle == false) {
                                $("#seaFreightToggle").slideToggle(function () {
                                    $scope.seaFreightToggle = true;
                                });
                            }
                            $interval.cancel(promise);
                            promise = undefined;
                        }, 200);
                        return true;
                    case "Clear":
                        $scope.seaFreightDataDefinition.DataList = [];
                        //Required if pagination is enabled
                        if ($scope.seaFreightDataDefinition.EnablePagination == true) {
                            $scope.seaFreightDataDefinition.CurrentPage = 1;
                            $scope.seaFreightDataDefinition.DoPagination = true;
                        }
                        return true;
                    default: return true;
                }
            };

            $scope.seaFreightShowFormError = function (error) {
                $scope.seaFreightIsError = true;
                $scope.seaFreightErrorMessage = error;
            };

            $scope.initSeaFreightDataDefinition();
            $scope.initSeaFreightSubmitDefinition();
        };

        //function that will be invoked during compiling of SeaFreight datagrid to DOM
        $scope.compileSeaFreightDataGrid = function () {
            var html = '<dir-data-grid2 datadefinition      = "seaFreightDataDefinition"' +
                                        'submitdefinition   = "seaFreightSubmitDefinition"' +
                                        'otheractions       = "seaFreightOtheractions(action)"' +
                                        'resetdata          = "seaFreightResetData()"' +
                                        'showformerror      = "seaFreightShowFormError(error)">' +
                        '</dir-data-grid2>';
            $content = angular.element(document.querySelector('#seaFreightContainer')).html(html);
            $compile($content)($scope);
        };

        //Load SeaFreight filtering for compiling
        $scope.loadSeaFreightFiltering = function () {
            $scope.initSeaFreightFilteringParameters();
            $scope.initSeaFreightFilteringContainter();
            $("#seaFreightToggle").slideToggle(function () { });
        };

        //initialize SeaFreight filtering parameters
        $scope.initSeaFreightFilteringContainter = function () {
            html = '<dir-filtering  filterdefinition="seaFreightFilteringDefinition"' +
                                    'filterlistener="seaFreightDataDefinition.Retrieve"' +
                                    'otheractions="seaFreightOtherActionsFiltering(action)"' +
                   '</dir-filtering>';
            $content = angular.element(document.querySelector('#seaFreightFilterContainter')).html(html);
            $compile($content)($scope);
        };

        //function that will be called during compiling of SeaFreight filtering to DOM
        $scope.initSeaFreightFilteringParameters = function () {
            //Hide the SeaFreight filtering directive
            $scope.hideSeaFreightToggle = function () {
                var promise = $interval(function () {
                    $("#seaFreightToggle").slideToggle(function () {
                        $scope.seaFreightToggle = false;
                    });
                    $interval.cancel(promise);
                    promise = undefined;
                }, 200)
            };
            $scope.initSeaFreightFilteringDefinition = function () {
                $scope.seaFreightFilteringDefinition = {
                    "Url": ($scope.seaFreightDataDefinition.EnablePagination == true ? 'api/SeaFreights?type=paginate&param1=' + $scope.seaFreightDataDefinition.CurrentPage : 'api/SeaFreights?type=scroll&param1=' + $scope.seaFreightDataDefinition.DataList.length),//Url for retrieve
                    "DataList": [], //Contains the data retrieved based on the criteria
                    "DataItem1": $scope.DataItem1, //Contains the parameter value
                    "Source": [
                                { "Index": 0, "Label": "Sea Freight No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                                { "Index": 1, "Label": "Bill of Lading Date", "Column": "BLDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                                { "Index": 2, "Label": "Origin", "Column": "OriginBusinessUnitId", "Values": ['GetBusinessList'], "From": null, "To": null, "Type": "Modal" },
                                { "Index": 3, "Label": "Destination", "Column": "DestinationBusinessUnitId", "Values": ['GetBusinessList'], "From": null, "To": null, "Type": "Modal" },
                                { "Index": 4, "Label": "Created Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                                { "Index": 5, "Label": "Last Updated Date", "Column": "LastUpdatedDate", "Values": [], "From": null, "To": null, "Type": "Date" }
                    ],//Contains the Criteria definition
                    "Multiple": true,
                    "AutoLoad": false,
                    "ClearData": false,
                    "SetSourceToNull": false
                }
            };

            $scope.seaFreightOtherActionsFiltering = function (action) {
                switch (action) {
                    //Initialize DataItem1 and DataItem2 for data filtering
                    case 'PreFilterData':
                        $scope.selectedTab = $scope.tabPages[1];
                        $scope.seaFreightSource = $scope.seaFreightFilteringDefinition.Source;
                        //Optional in using this, can use switch if every source type has validation before filtering

                        for (var i = 0; i < $scope.seaFreightSource.length; i++) {
                            if ($scope.seaFreightSource[i].Type == "Date") {
                                $scope.seaFreightFilteringDefinition.DataItem1.SeaFreight[0][$scope.seaFreightSource[i].Column] = $scope.seaFreightSource[i].From;
                                $scope.seaFreightFilteringDefinition.DataItem1.SeaFreight[1][$scope.seaFreightSource[i].Column] = $scope.seaFreightSource[i].To;
                            }
                            else
                                $scope.seaFreightFilteringDefinition.DataItem1.SeaFreight[0][$scope.seaFreightSource[i].Column] = $scope.seaFreightSource[i].From;
                        }
                        //Delete keys that the value is null
                        for (var i = 0; i < $scope.seaFreightSource.length; i++) {
                            if ($scope.seaFreightFilteringDefinition.DataItem1.SeaFreight[0][$scope.seaFreightSource[i].Column] == null) {
                                delete $scope.seaFreightFilteringDefinition.DataItem1.SeaFreight[0][$scope.seaFreightSource[i].Column];
                                delete $scope.seaFreightFilteringDefinition.DataItem1.SeaFreight[1][$scope.seaFreightSource[i].Column];
                            }
                        }

                        if ($scope.seaFreightDataDefinition.EnablePagination == true && $scope.seaFreightFilteringDefinition.ClearData) {
                            $scope.seaFreightDataDefinition.CurrentPage = 1;
                            $scope.seaFreightFilteringDefinition.Url = 'api/SeaFreights?type=paginate&param1=' + $scope.seaFreightDataDefinition.CurrentPage;
                        }
                        else if ($scope.seaFreightDataDefinition.EnablePagination == true) {
                            $scope.seaFreightDataDefinition.DataList = [];
                            $scope.seaFreightFilteringDefinition.Url = 'api/SeaFreights?type=paginate&param1=' + $scope.seaFreightDataDefinition.CurrentPage;
                        }
                            //Scroll
                        else {
                            if ($scope.seaFreightFilteringDefinition.ClearData)
                                $scope.seaFreightDataDefinition.DataList = [];
                            $scope.seaFreightFilteringDefinition.Url = 'api/SeaFreights?type=scroll&param1=' + $scope.seaFreightDataDefinition.DataList.length;
                        }
                        return true;
                    case 'PostFilterData':
                        /*Note: if pagination, initialize SeaFreightDataDefinition DataList by copying the DataList of filterDefinition then 
                                set DoPagination to true
                          if scroll, initialize SeaFreightDataDefinition DataList by pushing each value of filterDefinition DataList*/
                        //Required
                        $scope.seaFreightFilteringDefinition.DataList = $scope.seaFreightFilteringDefinition.DataList;

                        if ($scope.seaFreightDataDefinition.EnableScroll == true) {
                            for (var j = 0; j < $scope.seaFreightFilteringDefinition.DataList.length; j++)
                                $scope.seaFreightDataDefinition.DataList.push($scope.seaFreightFilteringDefinition.DataList[j]);
                        }

                        if ($scope.seaFreightDataDefinition.EnablePagination == true) {
                            $scope.seaFreightDataDefinition.DataList = [];
                            $scope.seaFreightDataDefinition.DataList = $scope.seaFreightFilteringDefinition.DataList;
                            $scope.seaFreightDataDefinition.DoPagination = true;
                        }
                        if ($scope.seaFreightToggle == true)
                            $scope.hideSeaFreightToggle();
                        return true;
                    case 'GetBusinessList':
                        return true;
                    case 'GetShippingLine':
                        return true;
                    case 'GetVessel':
                        return true;
                    case 'GetVesselVoyage':
                        return true;
                    case 'GetShipment':
                        return true;
                    default: return true;
                }
            };

            $scope.initSeaFreightDataItems = function () {
                $scope.seaFreightFilteringDefinition.DataItem1 = angular.copy($scope.seaFreightObj());
            };
            $scope.initSeaFreightFilteringDefinition();
            $scope.initSeaFreightDataItems();

        };
        //=================================================END OF SEA FREIGHT DATA GRID=================================================

        //=================================================START OF BUSINESS UNIT MODAL=================================================
        //Load businessUnit filtering for compiling
        $scope.loadBusinessUnitFiltering = function () {
            $scope.initBusinessUnitFilteringParameters();
            $scope.initBusinessUnitFilteringContainter();
        };
    
        //initialize businessUnit filtering parameters
        $scope.initBusinessUnitFilteringContainter = function () {
            html = '<dir-filtering id="businessUnitFilter" filterdefinition="businessUnitFilteringDefinition"' +
                                    'filterlistener="businessUnitDataDefinition.Retrieve"' +
                                    'otheractions="businessUnitOtherActionsFiltering(action)"' +
                   '</dir-filtering>';
            $content = angular.element(document.querySelector('#businessUnitFilterContainter')).html(html);
            $compile($content)($scope);
        };

        //function that will be called during compiling of business unit filtering to DOM
        $scope.initBusinessUnitFilteringParameters = function () {
            $scope.initBusinessUnitFilteringDefinition = function () {
                $scope.businessUnitFilteringDefinition = {
                    "Url": ($scope.businessUnitDataDefinition.EnablePagination == true ? 'api/BusinessUnits?type=paginate&param1=' + $scope.businessUnitDataDefinition.CurrentPage : 'api/BusinessUnits?type=scroll&param1=' + $scope.businessUnitDataDefinition.DataList.length),//Url for retrieve
                    "DataList": [], //Contains the data retrieved based on the criteria
                    "DataItem1": $scope.DataItem1, //Contains the parameter value index
                    "Source": [
                                { "Index": 0, "Label": "Code", "Column": "Code", "Values": [], "From": null, "To": null, "Type": "Default" },
                                { "Index": 1, "Label": "Name", "Column": "Name", "Values": [], "From": null, "To": null, "Type": "Default" },
                    ],//Contains the Criteria definition
                    "Multiple": false,
                    "AutoLoad": false,
                    "ClearData": false,
                    "SetSourceToNull": false
                }
            };

            $scope.businessUnitOtherActionsFiltering = function (action) {
                switch (action) {
                    //Initialize DataItem1 and DataItem2 for data filtering
                    case 'PreFilterData':
                        $scope.businessUnitSource = $scope.businessUnitFilteringDefinition.Source;
                        //Optional in using this, can use switch if every source type has validation before filtering
                        for (var i = 0; i < $scope.businessUnitSource.length; i++) {
                            if ($scope.businessUnitSource[i].Type == "Date") {
                                $scope.businessUnitFilteringDefinition.DataItem1.BusinessUnit[0][$scope.businessUnitSource[i].Column] = $scope.businessUnitSource[i].From;
                                $scope.businessUnitFilteringDefinition.DataItem1.BusinessUnit[1][$scope.businessUnitSource[i].Column] = $scope.businessUnitSource[i].To;
                            }
                            else
                                $scope.businessUnitFilteringDefinition.DataItem1.BusinessUnit[0][$scope.businessUnitSource[i].Column] = $scope.businessUnitSource[i].From;
                        }
                        
                        if ($scope.businessUnitDataDefinition.EnablePagination == true && $scope.businessUnitFilteringDefinition.ClearData) {
                            $scope.businessUnitDataDefinition.CurrentPage = 1;
                            $scope.businessUnitFilteringDefinition.Url = 'api/BusinessUnits?type=paginate&param1=' + $scope.businessUnitDataDefinition.CurrentPage;
                        }
                        else if ($scope.businessUnitDataDefinition.EnablePagination == true) {
                            $scope.businessUnitDataDefinition.DataList = [];
                            $scope.businessUnitFilteringDefinition.Url = 'api/BusinessUnits?type=paginate&param1=' + $scope.businessUnitDataDefinition.CurrentPage;
                        }
                            //Scroll
                        else {
                            if ($scope.businessUnitFilteringDefinition.ClearData)
                                $scope.businessUnitDataDefinition.DataList = [];
                            $scope.businessUnitFilteringDefinition.Url = 'api/BusinessUnits?type=scroll&param1=' + $scope.businessUnitDataDefinition.DataList.length;
                        }
                        return true;
                    case 'PostFilterData':
                        /*Note: if pagination, initialize businessUnitDataDefinition DataList by copying the DataList of filterDefinition then 
                                set DoPagination to true
                          if scroll, initialize businessUnitDataDefinition DataList by pushing each value of filterDefinition DataList*/
                        //Required
                        //$scope.businessUnitFilteringDefinition.DataList = $rootScope.formatBusinessUnit($scope.businessUnitFilteringDefinition.DataList);
                        if ($scope.businessUnitDataDefinition.EnableScroll == true) {
                            for (var j = 0; j < $scope.businessUnitFilteringDefinition.DataList.length; j++)
                                $scope.businessUnitDataDefinition.DataList.push($scope.businessUnitFilteringDefinition.DataList[j]);
                        }

                        if ($scope.businessUnitDataDefinition.EnablePagination == true) {
                            $scope.businessUnitDataDefinition.DataList = [];
                            $scope.businessUnitDataDefinition.DataList = $scope.businessUnitFilteringDefinition.DataList;
                            $scope.businessUnitDataDefinition.DoPagination = true;
                        }
                        return true;
                    default: return true;
                }
            };

            $scope.initBusinessUnitDataItems = function () {
                $scope.businessUnitFilteringDefinition.DataItem1 = angular.copy($rootScope.businessUnitObj());
            };

            $scope.initBusinessUnitFilteringDefinition();
            $scope.initBusinessUnitDataItems();
        };

        //Load business datagrid for compiling
        $scope.loadBusinessUnitDataGrid = function () {
            $scope.initBusinessUnitDataGrid();
            $scope.compileBusinessUnitDataGrid();
        };

        //initialize businessUnit datagrid parameters
        $scope.initBusinessUnitDataGrid = function () {
            $scope.businessUnitSubmitDefinition = undefined;
            $scope.initializeBusinessUnitDataDefinition = function () {
                $scope.businessUnitDataDefinition = {
                    "Header": ['Code', 'Name', 'Main Business Unit', 'Business Unit Type', 'Is Operating Site?', 'Has Airport?', 'Has Seaport?', 'No.'],
                    "Keys": ['Code', 'Name', 'ParentBusinessUnit[0].Name', 'BusinessUnitType[0].Name', 'isOperatingSite', 'hasAirPort', 'hasSeaPort'],
                    "Type": ['Default', 'ProperCase', 'ProperCase', 'ProperCase', 'Bit', 'Bit', 'Bit'],
                    "ColWidth": [150, 200, 200, 200, 150, 150, 150],
                    "DataList": [],
                    "RequiredFields": [],
                    "CellTemplate": ["None"],
                    "RowTemplate": "Default",
                    "EnableScroll": true,
                    "EnablePagination": false,
                    "CurrentPage": 1, //By default
                    "PageSize": 20, //Should be the same in back-end
                    "DoPagination": false, //By default
                    "Retrieve": false, //By default
                    "DataItem": {},
                    "DataTarget": "BusinessUnitMenu",
                    "DataTarget2": "BusinessUnitMenu1",
                    "ShowCreate": false,
                    "ShowContextMenu": false,
                    "ContextMenu": [""],
                    "ContextMenuLabel": [""]
                }
                $scope.businessUnitDataDefinition.RowTemplate = '<div>' +
                                                                    ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                                                                  '</div>';
            };
            $scope.businessUnitOtherActions = function (action) {
                switch (action) {
                    case 'PostEditAction':
                        switch ($scope.modalType) {
                            case 'origin':
                                $scope.seafreightItem.OriginBusinessUnitId = $scope.businessUnitDataDefinition.DataItem.Id;
                                $scope.seafreightItem.BusinessUnit1.Name = $scope.businessUnitDataDefinition.DataItem.Name;
                                break;
                            case 'destination':
                                $scope.seafreightItem.DestinationBusinessUnitId = $scope.businessUnitDataDefinition.DataItem.Id;
                                $scope.seafreightItem.BusinessUnit.Name = $scope.businessUnitDataDefinition.DataItem.Name;
                                break;
                        }
                        $scope.closeModal();
                        return true;
                    default: return true;
                }
            };

            $scope.initializeBusinessUnitDataDefinition();
        };

        //function that will be invoked during compiling of businessUnit datagrid to DOM
        $scope.compileBusinessUnitDataGrid = function () {
            var html = '<dir-data-grid2 id="businessUnitGrid" datadefinition = "businessUnitDataDefinition"' +
                                        'submitdefinition   = "businessUnitSubmitDefinition"' +
                                        'otheractions       = "businessUnitOtherActions(action)">' +
                        '</dir-data-grid2>';
            $content = angular.element(document.querySelector('#businessUnitContainer')).html(html);
            $compile($content)($scope);
        };
        //=================================================END OF BUSINESS UNIT MODAL=================================================
        
        //=================================================START OF SHIPPINGLINE MODAL=================================================
        //Load shippingline filtering for compiling
        $scope.loadShippingLineFiltering = function () {
            $scope.initShippingLineFilteringParameters();
            $scope.initShippingLineFilteringContainter();
        };

        //initialize shippingline filtering parameters
        $scope.initShippingLineFilteringContainter = function () {
            html = '<dir-filtering id="shippingLineFilter"  filterdefinition="shippingLineFilteringDefinition"' +
                                    'filterlistener="shippingLineDataDefinition.Retrieve"' +
                                    'otheractions="shippingLineOtherActionsFiltering(action)"' +
                   '</dir-filtering>';
            $content = angular.element(document.querySelector('#shippingLineFilterContainter')).html(html);
            $compile($content)($scope);
        };

        //function that will be called during compiling of shippingline filtering to DOM
        $scope.initShippingLineFilteringParameters = function () {
            $scope.initShippingLineFilteringDefinition = function () {
                $scope.shippingLineFilteringDefinition = {
                    "Url": ($scope.shippingLineDataDefinition.EnablePagination == true ? 'api/ShippingLines?type=paginate&param1=' + $scope.shippingLineDataDefinition.CurrentPage : 'api/ShippingLines?type=scroll&param1=' + $scope.shippingLineDataDefinition.DataList.length),//Url for retrieve
                    "DataList": [], //Contains the data retrieved based on the criteria
                    "DataItem1": $scope.DataItem1, //Contains the parameter value index
                    "Source": [
                                { "Index": 0, "Label": "Name", "Column": "Name", "Values": [], "From": null, "To": null, "Type": "Default" }
                    ],//Contains the Criteria definition
                    "Multiple": false,
                    "AutoLoad": false,
                    "ClearData": false,
                    "SetSourceToNull": false
                }
            };

            $scope.shippingLineOtherActionsFiltering = function (action) {
                switch (action) {
                    //Initialize DataItem1 and DataItem2 for data filtering
                    case 'PreFilterData':
                        $scope.shippingLineSource = $scope.shippingLineFilteringDefinition.Source;
                        //Optional in using this, can use switch if every source type has validation before filtering
                        for (var i = 0; i < $scope.shippingLineSource.length; i++) {
                            if ($scope.shippingLineSource[i].Type == "Date") {
                                $scope.shippingLineFilteringDefinition.DataItem1.ShippingLine[0][$scope.shippingLineSource[i].Column] = $scope.shippingLineSource[i].From;
                                $scope.shippingLineFilteringDefinition.DataItem1.ShippingLine[1][$scope.shippingLineSource[i].Column] = $scope.shippingLineSource[i].To;
                            }
                            else
                                $scope.shippingLineFilteringDefinition.DataItem1.ShippingLine[0][$scope.shippingLineSource[i].Column] = $scope.shippingLineSource[i].From;
                        }

                        //Delete keys that the value is null
                        for (var i = 0; i < $scope.shippingLineSource.length; i++) {
                            if ($scope.shippingLineFilteringDefinition.DataItem1.ShippingLine[0][$scope.shippingLineSource[i].Column] == null) {
                                delete $scope.shippingLineFilteringDefinition.DataItem1.ShippingLine[0][$scope.shippingLineSource[i].Column];
                                delete $scope.shippingLineFilteringDefinition.DataItem1.ShippingLine[1][$scope.shippingLineSource[i].Column];
                            }
                        }

                        if ($scope.shippingLineDataDefinition.EnablePagination == true && $scope.shippingLineFilteringDefinition.ClearData) {
                            $scope.shippingLineDataDefinition.CurrentPage = 1;
                            $scope.shippingLineFilteringDefinition.Url = 'api/ShippingLines?type=paginate&param1=' + $scope.shippingLineDataDefinition.CurrentPage;
                        }
                        else if ($scope.shippingLineDataDefinition.EnablePagination == true) {
                            $scope.shippingLineDataDefinition.DataList = [];
                            $scope.shippingLineFilteringDefinition.Url = 'api/ShippingLines?type=paginate&param1=' + $scope.shippingLineDataDefinition.CurrentPage;
                        }
                            //Scroll
                        else {
                            if ($scope.shippingLineFilteringDefinition.ClearData)
                                $scope.shippingLineDataDefinition.DataList = [];
                            $scope.shippingLineFilteringDefinition.Url = 'api/ShippingLines?type=scroll&param1=' + $scope.shippingLineDataDefinition.DataList.length;
                        }
                        return true;
                    case 'PostFilterData':
                        /*Note: if pagination, initialize shippingLineDataDefinition DataList by copying the DataList of filterDefinition then 
                                set DoPagination to true
                          if scroll, initialize shippingLineDataDefinition DataList by pushing each value of filterDefinition DataList*/
                        //Required
                        //$scope.shippingLineFilteringDefinition.DataList = $rootScope.formatCustomer($scope.shippingLineFilteringDefinition.DataList);
                        if ($scope.shippingLineDataDefinition.EnableScroll == true) {
                            for (var j = 0; j < $scope.shippingLineFilteringDefinition.DataList.length; j++)
                                $scope.shippingLineDataDefinition.DataList.push($scope.shippingLineFilteringDefinition.DataList[j]);
                        }

                        if ($scope.shippingLineDataDefinition.EnablePagination == true) {
                            $scope.shippingLineDataDefinition.DataList = [];
                            $scope.shippingLineDataDefinition.DataList = $scope.shippingLineFilteringDefinition.DataList;
                            $scope.shippingLineDataDefinition.DoPagination = true;
                        }
                        return true;
                    default: return true;
                }
            };

            $scope.initShippingLineDataItems = function () {
                $scope.shippingLineFilteringDefinition.DataItem1 = angular.copy($scope.shippingLineObj());
            };

            $scope.initShippingLineFilteringDefinition();
            $scope.initShippingLineDataItems();
        };

        //Load shippingLine datagrid for compiling
        $scope.loadShippingLineDataGrid = function () {
            $scope.initShippingLineDataGrid();
            $scope.compileShippingLineDataGrid();
        };
        
        //initialize shippingLine datagrid parameters
        $scope.initShippingLineDataGrid = function () {
            $scope.shippingLineSubmitDefinition = undefined;
            $scope.initializeShippingLineDataDefinition = function () {
                $scope.shippingLineDataDefinition = {
                    "Header": ['Name', 'No.'],
                    "Keys": ['Name'],
                    "Type": ['ProperCase'],
                    "ColWidth": [250],
                    "DataList": [],
                    "RequiredFields": [], 
                    "CellTemplate": ["None"],
                    "RowTemplate": "Default",
                    "EnableScroll": true,
                    "EnablePagination": false,
                    "CurrentPage": 1, //By default
                    "PageSize": 20, //Should be the same in back-end
                    "DoPagination": false, //By default
                    "Retrieve": false, //By default
                    "DataItem": {},
                    "DataTarget": "ShippingLineMenu",
                    "DataTarget2": "ShippingLineMenu1",
                    "ShowCreate": false,
                    "ShowContextMenu": false,
                    "ContextMenu": [""],
                    "ContextMenuLabel": [""]
                }
                $scope.shippingLineDataDefinition.RowTemplate = '<div>' +
                                                                    ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                                                                  '</div>';
            };
            $scope.shippingLineOtherActions = function (action) {
                switch (action) {
                    case 'PostEditAction':
                        $scope.seafreightItem.VesselVoyage.ShippingLineId = $scope.shippingLineDataDefinition.DataItem.Id;
                        $scope.seafreightItem.VesselVoyage.ShippingLineName = $scope.shippingLineDataDefinition.DataItem.Name;
                        $scope.closeModal();
                        var promise = $interval(function () {
                            $interval.cancel(promise);
                            promise = undefined;
                            $scope.showModal('#vessels-list-modal', 'vessel');
                        }, 500);
                        return true;
                    default: return true;
                }
            };

            $scope.initializeShippingLineDataDefinition();
        };
        
        //function that will be invoked during compiling of shippingLine datagrid to DOM
        $scope.compileShippingLineDataGrid = function () {
            var html = '<dir-data-grid2 id="shippingLineGrid" datadefinition      = "shippingLineDataDefinition"' +
                                        'submitdefinition   = "shippingLineSubmitDefinition"' +
                                        'otheractions       = "shippingLineOtherActions(action)">' +
                        '</dir-data-grid2>';
            $content = angular.element(document.querySelector('#shippingLineContainer')).html(html);
            $compile($content)($scope);
        };
        //=================================================END OF SHIPPINGLINE MODAL=================================================

        //=================================================START OF VESSEL MODAL=================================================
        //Load vessel filtering for compiling
        $scope.loadVesselFiltering = function () {
            $scope.initVesselFilteringParameters();
            $scope.initVesselFilteringContainter();
        };

        //initialize shippingline filtering parameters
        $scope.initVesselFilteringContainter = function () {
            html = '<dir-filtering  id="vesselFilter" filterdefinition="vesselFilteringDefinition"' +
                                    'filterlistener="vesselDataDefinition.Retrieve"' +
                                    'otheractions="vesselOtherActionsFiltering(action)"' +
                   '</dir-filtering>';
            $content = angular.element(document.querySelector('#vesselFilterContainter')).html(html);
            $compile($content)($scope);
        };

        //function that will be called during compiling of shippingline filtering to DOM
        $scope.initVesselFilteringParameters = function () {
            $scope.initVesselFilteringDefinition = function () {
                $scope.vesselFilteringDefinition = {
                    "Url": ($scope.vesselDataDefinition.EnablePagination == true ? 'api/Vessels?type=paginate&param1=' + $scope.vesselDataDefinition.CurrentPage : 'api/Vessels?type=scroll&param1=' + $scope.vesselDataDefinition.DataList.length),//Url for retrieve
                    "DataList": [], //Contains the data retrieved based on the criteria
                    "DataItem1": $scope.DataItem1, //Contains the parameter value index
                    "Source": [
                                { "Index": 0, "Label": "Name", "Column": "Name", "Values": [], "From": null, "To": null, "Type": "Default" }
                    ],//Contains the Criteria definition
                    "Multiple": false,
                    "AutoLoad": false,
                    "ClearData": false,
                    "SetSourceToNull": false
                }
            };

            $scope.vesselOtherActionsFiltering = function (action) {
                switch (action) {
                    //Initialize DataItem1 and DataItem2 for data filtering
                    case 'PreFilterData':
                        $scope.vesselSource = $scope.vesselFilteringDefinition.Source;
                        //Optional in using this, can use switch if every source type has validation before filtering
                        for (var i = 0; i < $scope.vesselSource.length; i++) {
                            if ($scope.vesselSource[i].Type == "Date") {
                                $scope.vesselFilteringDefinition.DataItem1.Vessel[0][$scope.vesselSource[i].Column] = $scope.vesselSource[i].From;
                                $scope.vesselFilteringDefinition.DataItem1.Vessel[1][$scope.vesselSource[i].Column] = $scope.vesselSource[i].To;
                            }
                            else
                                $scope.vesselFilteringDefinition.DataItem1.Vessel[0][$scope.vesselSource[i].Column] = $scope.vesselSource[i].From;
                        }

                        //Delete keys that the value is null
                        for (var i = 0; i < $scope.vesselSource.length; i++) {
                            if ($scope.vesselFilteringDefinition.DataItem1.Vessel[0][$scope.vesselSource[i].Column] == null) {
                                delete $scope.vesselFilteringDefinition.DataItem1.Vessel[0][$scope.vesselSource[i].Column];
                                delete $scope.vesselFilteringDefinition.DataItem1.Vessel[1][$scope.vesselSource[i].Column];
                            }
                        }

                        if ($scope.vesselDataDefinition.EnablePagination == true && $scope.vesselFilteringDefinition.ClearData) {
                            $scope.vesselDataDefinition.CurrentPage = 1;
                            $scope.vesselFilteringDefinition.Url = 'api/Vessels?type=paginate&param1=' + $scope.vesselDataDefinition.CurrentPage;
                        }
                        else if ($scope.vesselDataDefinition.EnablePagination == true) {
                            $scope.vesselDataDefinition.DataList = [];
                            $scope.vesselFilteringDefinition.Url = 'api/Vessels?type=paginate&param1=' + $scope.vesselDataDefinition.CurrentPage;
                        }
                            //Scroll
                        else {
                            if ($scope.vesselFilteringDefinition.ClearData)
                                $scope.vesselDataDefinition.DataList = [];
                            $scope.vesselFilteringDefinition.Url = 'api/Vessels?type=scroll&param1=' + $scope.vesselDataDefinition.DataList.length;
                        }
                        $scope.vesselFilteringDefinition.DataItem1.Vessel[0].ShippingLineId = $scope.seafreightItem.VesselVoyage.ShippingLineId;

                        return true;
                    case 'PostFilterData':
                        /*Note: if pagination, initialize vesselDataDefinition DataList by copying the DataList of filterDefinition then 
                                set DoPagination to true
                          if scroll, initialize vesselDataDefinition DataList by pushing each value of filterDefinition DataList*/
                        //Required
                        //$scope.vesselFilteringDefinition.DataList = $rootScope.formatCustomer($scope.vesselFilteringDefinition.DataList);
                        if ($scope.vesselDataDefinition.EnableScroll == true) {
                            for (var j = 0; j < $scope.vesselFilteringDefinition.DataList.length; j++)
                                $scope.vesselDataDefinition.DataList.push($scope.vesselFilteringDefinition.DataList[j]);
                        }

                        if ($scope.vesselDataDefinition.EnablePagination == true) {
                            $scope.vesselDataDefinition.DataList = [];
                            $scope.vesselDataDefinition.DataList = $scope.vesselFilteringDefinition.DataList;
                            $scope.vesselDataDefinition.DoPagination = true;
                        }
                        return true;
                    default: return true;
                }
            };

            $scope.initVesselDataItems = function () {
                $scope.vesselFilteringDefinition.DataItem1 = angular.copy($scope.vesselObj());
            };

            $scope.initVesselFilteringDefinition();
            $scope.initVesselDataItems();
        };

        //Load vessel datagrid for compiling
        $scope.loadVesselDataGrid = function () {
            $scope.initVesselDataGrid();
            $scope.compileVesselDataGrid();
        };

        //initialize vessel datagrid parameters
        $scope.initVesselDataGrid = function () {
            $scope.vesselSubmitDefinition = undefined;
            $scope.initializeVesselDataDefinition = function () {
                $scope.vesselDataDefinition = {
                    "Header": ['Name', 'No.'],
                    "Keys": ['Name'],
                    "Type": ['ProperCase'],
                    "ColWidth": [250],
                    "DataList": [],
                    "RequiredFields": [],
                    "CellTemplate": ["None"],
                    "RowTemplate": "Default",
                    "EnableScroll": true,
                    "EnablePagination": false,
                    "CurrentPage": 1, //By default
                    "PageSize": 20, //Should be the same in back-end
                    "DoPagination": false, //By default
                    "Retrieve": false, //By default
                    "DataItem": {},
                    "DataTarget": "VesselMenu",
                    "DataTarget2": "VesselMenu1",
                    "ShowCreate": false,
                    "ShowContextMenu": false,
                    "ContextMenu": [""],
                    "ContextMenuLabel": [""]
                }
                $scope.vesselDataDefinition.RowTemplate = '<div>' +
                                                                    ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                                                                  '</div>';
            };
            $scope.vesselOtherActions = function (action) {
                switch (action) {
                    case 'PostEditAction':
                        $scope.seafreightItem.VesselVoyage.VesselId = $scope.vesselDataDefinition.DataItem.Id;
                        $scope.seafreightItem.VesselVoyage.VesselName = $scope.vesselDataDefinition.DataItem.Name;
                        $scope.closeModal();
                        var promise = $interval(function () {
                            $interval.cancel(promise);
                            promise = undefined;
                            $scope.showModal('#vesselVoyages-list-modal', 'vesselVoyage');
                        }, 500);
                        return true;
                    default: return true;
                }
            };

            $scope.initializeVesselDataDefinition();
        };

        //function that will be invoked during compiling of vessel datagrid to DOM
        $scope.compileVesselDataGrid = function () {
            var html = '<dir-data-grid2 id="vesselGrid" datadefinition      = "vesselDataDefinition"' +
                                        'submitdefinition   = "vesselSubmitDefinition"' +
                                        'otheractions       = "vesselOtherActions(action)">' +
                        '</dir-data-grid2>';
            $content = angular.element(document.querySelector('#vesselContainer')).html(html);
            $compile($content)($scope);
        };
        
        //=================================================END OF VESSEL MODAL=================================================

        //=================================================START OF VESSEL VOYAGE MODAL=================================================
        //Load vesselVoyage filtering for compiling
        $scope.loadVesselVoyageFiltering = function () {
            $scope.initVesselVoyageFilteringParameters();
            $scope.initVesselVoyageFilteringContainter();
        };

        //initialize shippingline filtering parameters
        $scope.initVesselVoyageFilteringContainter = function () {
            html = '<dir-filtering id="vesselVoyageFilter"  filterdefinition="vesselVoyageFilteringDefinition"' +
                                    'filterlistener="vesselVoyageDataDefinition.Retrieve"' +
                                    'otheractions="vesselVoyageOtherActionsFiltering(action)"' +
                   '</dir-filtering>';
            $content = angular.element(document.querySelector('#vesselVoyageFilterContainter')).html(html);
            $compile($content)($scope);
        };

        //function that will be called during compiling of shippingline filtering to DOM
        $scope.initVesselVoyageFilteringParameters = function () {
            $scope.initVesselVoyageFilteringDefinition = function () {
                $scope.vesselVoyageFilteringDefinition = {
                    "Url": ($scope.vesselVoyageDataDefinition.EnablePagination == true ? 'api/VesselVoyages?type=paginate&param1=' + $scope.vesselVoyageDataDefinition.CurrentPage : 'api/VesselVoyages?type=scroll&param1=' + $scope.vesselVoyageDataDefinition.DataList.length),//Url for retrieve
                    "DataList": [], //Contains the data retrieved based on the criteria
                    "DataItem1": $scope.DataItem1, //Contains the parameter value index
                    "Source": [
                                { "Index": 0, "Label": "Voyage No", "Column": "VoyageNo", "Values": [], "From": null, "To": null, "Type": "ProperCase" }
                    ],//Contains the Criteria definition
                    "Multiple": false,
                    "AutoLoad": false,
                    "ClearData": false,
                    "SetSourceToNull": false
                }
            };

            $scope.vesselVoyageOtherActionsFiltering = function (action) {
                switch (action) {
                    //Initialize DataItem1 and DataItem2 for data filtering
                    case 'PreFilterData':
                        $scope.vesselVoyageSource = $scope.vesselVoyageFilteringDefinition.Source;
                        //Optional in using this, can use switch if every source type has validation before filtering
                        for (var i = 0; i < $scope.vesselVoyageSource.length; i++) {
                            if ($scope.vesselVoyageSource[i].Type == "Date") {
                                $scope.vesselVoyageFilteringDefinition.DataItem1.VesselVoyage[0][$scope.vesselVoyageSource[i].Column] = $scope.vesselVoyageSource[i].From;
                                $scope.vesselVoyageFilteringDefinition.DataItem1.VesselVoyage[1][$scope.vesselVoyageSource[i].Column] = $scope.vesselVoyageSource[i].To;
                            }
                            else
                                $scope.vesselVoyageFilteringDefinition.DataItem1.VesselVoyage[0][$scope.vesselVoyageSource[i].Column] = $scope.vesselVoyageSource[i].From;
                        }

                        //Delete keys that the value is null
                        for (var i = 0; i < $scope.vesselVoyageSource.length; i++) {
                            if ($scope.vesselVoyageFilteringDefinition.DataItem1.VesselVoyage[0][$scope.vesselVoyageSource[i].Column] == null) {
                                delete $scope.vesselVoyageFilteringDefinition.DataItem1.VesselVoyage[0][$scope.vesselVoyageSource[i].Column];
                                delete $scope.vesselVoyageFilteringDefinition.DataItem1.VesselVoyage[1][$scope.vesselVoyageSource[i].Column];
                            }
                        }

                        if ($scope.vesselVoyageDataDefinition.EnablePagination == true && $scope.vesselVoyageFilteringDefinition.ClearData) {
                            $scope.vesselVoyageDataDefinition.CurrentPage = 1;
                            $scope.vesselVoyageFilteringDefinition.Url = 'api/VesselVoyages?type=paginate&param1=' + $scope.vesselVoyageDataDefinition.CurrentPage;
                        }
                        else if ($scope.vesselVoyageDataDefinition.EnablePagination == true) {
                            $scope.vesselVoyageDataDefinition.DataList = [];
                            $scope.vesselVoyageFilteringDefinition.Url = 'api/VesselVoyages?type=paginate&param1=' + $scope.vesselVoyageDataDefinition.CurrentPage;
                        }
                        //Scroll
                        else {
                            if ($scope.vesselVoyageFilteringDefinition.ClearData)
                                $scope.vesselVoyageDataDefinition.DataList = [];
                            $scope.vesselVoyageFilteringDefinition.Url = 'api/VesselVoyages?type=scroll&param1=' + $scope.vesselVoyageDataDefinition.DataList.length;
                        }
                        $scope.vesselVoyageFilteringDefinition.DataItem1.VesselVoyage[0].VesselId = $scope.seafreightItem.VesselVoyage.VesselId;

                        return true;
                    case 'PostFilterData':
                        /*Note: if pagination, initialize vesselVoyageDataDefinition DataList by copying the DataList of filterDefinition then 
                                set DoPagination to true
                          if scroll, initialize vesselVoyageDataDefinition DataList by pushing each value of filterDefinition DataList*/
                        //Required
                        //$scope.vesselVoyageFilteringDefinition.DataList = $rootScope.formatCustomer($scope.vesselVoyageFilteringDefinition.DataList);
                        if ($scope.vesselVoyageDataDefinition.EnableScroll == true) {
                            for (var j = 0; j < $scope.vesselVoyageFilteringDefinition.DataList.length; j++)
                                $scope.vesselVoyageDataDefinition.DataList.push($scope.vesselVoyageFilteringDefinition.DataList[j]);
                        }

                        if ($scope.vesselVoyageDataDefinition.EnablePagination == true) {
                            $scope.vesselVoyageDataDefinition.DataList = [];
                            $scope.vesselVoyageDataDefinition.DataList = $scope.vesselVoyageFilteringDefinition.DataList;
                            $scope.vesselVoyageDataDefinition.DoPagination = true;
                        }
                        return true;
                    default: return true;
                }
            };

            $scope.initVesselVoyageDataItems = function () {
                $scope.vesselVoyageFilteringDefinition.DataItem1 = angular.copy($scope.vesselVoyageObj());
            };

            $scope.initVesselVoyageFilteringDefinition();
            $scope.initVesselVoyageDataItems();
        };

        //Load vesselVoyage datagrid for compiling
        $scope.loadVesselVoyageDataGrid = function () {
            $scope.initVesselVoyageDataGrid();
            $scope.compileVesselVoyageDataGrid();
        };

        //initialize vesselVoyage datagrid parameters
        $scope.initVesselVoyageDataGrid = function () {
            $scope.vesselVoyageSubmitDefinition = undefined;
            $scope.initializeVesselVoyageDataDefinition = function () {
                $scope.vesselVoyageDataDefinition = {
                    "Header": ['Voyage No.','Origin','Destination','Departure Date','Departure Time','Arrival Date','Arrival Time', 'No.'],
                    "Keys": ['VoyageNo','Origin[0].Name','Destination[0].Name','DepartureDate','DepartureTime','ArrivalDate','ArrivalTime'],
                    "Type": ['ProperCase','ProperCase','ProperCase','Date','Time','Date','Time'],
                    "ColWidth": [150,150,150,120,100,120,100],
                    "DataList": [],
                    "RequiredFields": [],
                    "CellTemplate": ["None"],
                    "RowTemplate": "Default",
                    "EnableScroll": true,
                    "EnablePagination": false,
                    "CurrentPage": 1, //By default
                    "PageSize": 20, //Should be the same in back-end
                    "DoPagination": false, //By default
                    "Retrieve": false, //By default
                    "DataItem": {},
                    "DataTarget": "VesselVoyageMenu",
                    "DataTarget2": "VesselVoyageMenu1",
                    "ShowCreate": false,
                    "ShowContextMenu": false,
                    "ContextMenu": [""],
                    "ContextMenuLabel": [""]
                }
                $scope.vesselVoyageDataDefinition.RowTemplate = '<div>' +
                                                                    ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                                                                  '</div>';
            };
            $scope.vesselVoyageOtherActions = function (action) {
                switch (action) {
                    case 'PostEditAction':
                        $scope.seafreightItem.VesselVoyageId = $scope.vesselVoyageDataDefinition.DataItem.Id;
                        $scope.seafreightItem.VesselVoyage.DepartureDate = $scope.vesselVoyageDataDefinition.DataItem.DepartureDate;
                        $scope.seafreightItem.VesselVoyage.DepartureTime = $scope.vesselVoyageDataDefinition.DataItem.DepartureTime;
                        $scope.seafreightItem.VesselVoyage.ArrivalDate = $scope.vesselVoyageDataDefinition.DataItem.ArrivalDate;
                        $scope.seafreightItem.VesselVoyage.ArrivalTime = $scope.vesselVoyageDataDefinition.DataItem.ArrivalTime;
                        $scope.closeModal();
                        return true;
                    default: return true;
                }
            };

            $scope.initializeVesselVoyageDataDefinition();
        };

        //function that will be invoked during compiling of vesselVoyage datagrid to DOM
        $scope.compileVesselVoyageDataGrid = function () {
            var html = '<dir-data-grid2 id="vesselVoyageGrid"  datadefinition      = "vesselVoyageDataDefinition"' +
                                        'submitdefinition   = "vesselVoyageSubmitDefinition"' +
                                        'otheractions       = "vesselVoyageOtherActions(action)">' +
                        '</dir-data-grid2>';
            $content = angular.element(document.querySelector('#vesselVoyageContainer')).html(html);
            $compile($content)($scope);
        };
        
        //=================================================END OF VESSEL VOYAGE MODAL=================================================
        
        //=================================================SEA FREIGHT DETAIL DATAGRID=================================================
        //Load seaFreightShipments datagrid for compiling
        $scope.loadSeaFreightShipmentsDataGrid = function () {
            $scope.initSeaFreightShipmentsDataGrid();
            $scope.compileSeaFreightShipmentsDataGrid();
        };

        //initialize seaFreightShipments datagrid parameters
        $scope.initSeaFreightShipmentsDataGrid = function () {
            $scope.initializeSeaFreightShipmentsDataDefinition = function () {
                $scope.seaFreightShipmentsDataDefinition = {
                    "Header": ['Shipment No', 'Cost Allocation', 'Transport Status', 'Booking Date', 'Business Unit', 'Operating Site', 'Service', 'Shipment Type', 'Payment Mode', 'Booking Remarks', 'Qty', 'Total CBM', 'Cargo Description', 'Pickup Address', 'Target Pickup Date', 'Target Pickup Time', 'Customer', 'Customer Address', 'Customer Contact No', 'Consignee', 'Consignee Address', 'Consignee Contact No', 'No.'],
                    "Keys": ['ShipmentId', 'CostAllocation', 'Shipment.TransportStatusId', 'Shipment.CreatedDate', 'Shipment.BusinessUnit.Name', 'Shipment.BusinessUnit1.Name', 'Shipment.Service.Name', 'Shipment.ShipmentType.Name', 'Shipment.PaymentMode', 'Shipment.BookingRemarks', 'Shipment.Quantity', 'Shipment.TotalCBM', 'Shipment.Description', 'Shipment.OriginAddress', 'Shipment.PickupDate', 'Shipment.PickupTime', 'Shipment.Customer.Name', 'Shipment.Customer.CustomerAddresses[0].Line1', 'Shipment.Customer.CustomerContacts[0].Contact.ContactPhones[0].ContactNumber', 'Shipment.DeliverTo', 'Shipment.DeliveryAddress', 'Shipment.DeliverToContactNo'],
                    "Type": ['ControlNo', 'Decimal', 'TransportStatus', 'Date', 'ProperCase', 'ProperCase', 'ProperCase', 'ProperCase', 'PaymentMode', 'Default', 'Default', 'Decimal', 'Default', 'ProperCase', 'Date', 'Time', 'ProperCase', 'ProperCase', 'Default', 'ProperCase', 'ProperCase', 'Default'],
                    "ColWidth": [150, 150, 150, 150, 150, 150, 150, 150, 150, 200, 100, 150, 200, 300, 150, 150, 200, 200, 200, 200, 300, 200],
                    "DataList": [],
                    "RequiredFields": ['ShipmentId-Shipment', 'CostAllocation-Cost'],
                    "IsEditable": [true, true],
                    "CellTemplate": ["None"],
                    "RowTemplate": "Default",
                    "EnableScroll": true,
                    "EnablePagination": false,
                    "CurrentPage": 1, //By default
                    "PageSize": 20, //Should be the same in back-end
                    "DoPagination": false, //By default
                    "Retrieve": false, //By default
                    "DataItem": {},
                    "DataTarget": "SeaFreightShipmentsMenu",
                    "DataTarget2": "SeaFreightShipmentsMenu2",
                    "ShowCreate": false,
                    "ShowContextMenu": true,
                    "ContextMenu": ["'Create'", "'Delete'"],
                    "ContextMenuLabel": ['Add Shipment', 'Delete']
                }
            };

            $scope.initializeSeaFreightShipmentsSubmitDefinition = function () {
                $scope.seaFreightShipmentsSubmitDefinition = {
                    "Submit": false, //By default
                    "APIUrl": '',
                    "Type": 'Create', //By Default
                    "DataItem": {},
                    "Index": -1 //By Default
                }
            };

            $scope.seaFreightShipmentsOtheractions = function (action) {
                switch (action) {
                    case "FormCreate":
                        return true;

                    case "PreAction":
                        return true;

                    case "PreCreateAction":
                        if (!$scope.viewOnly) {
                            var upperRow = $scope.seaFreightShipmentsDataDefinition.DataList.length - 1;
                            if ($scope.seaFreightShipmentsDataDefinition.DataList[upperRow].ShipmentId == 0) {
                                $scope.seaFreightIsError = true;
                                $scope.seaFreightErrorMessage = "Shipment is required.";
                                $scope.focusOnTop();
                                return false;
                            }
                            else if ($scope.seaFreightShipmentsDataDefinition.DataList[upperRow].CostAllocation == null || $scope.seaFreightShipmentsDataDefinition.DataList[upperRow].CostAllocation == 0) {
                                $scope.seaFreightIsError = true;
                                $scope.seaFreightErrorMessage = "Cost Allocation must be greater than zero.";
                                $scope.focusOnTop();
                                return false;
                            }
                            return true;
                        }
                        
                    case "PostEditAction":
                        if (!$scope.viewOnly)
                            return true;
                        else
                            return false;

                    case "PreDeleteAction":
                        if (!$scope.viewOnly)
                            return true;
                        else
                            return false;

                    case "PostDeleteAction":
                        $scope.seaFreightShipmentsDataDefinition.DataList.splice($scope.seaFreightShipmentsSubmitDefinition.Index, 1);
                        if ($scope.seaFreightShipmentsDataDefinition.DataList.length == 0)
                            $scope.seaFreightShipmentsResetData();
                        return true;

                    case "PostViewAction":
                        return true;

                    case "Clear":
                        $scope.seaFreightShipmentsDataDefinition.DataList = [];
                        //Required if pagination is enabled
                        if ($scope.seaFreightShipmentsDataDefinition.EnablePagination == true) {
                            $scope.seaFreightShipmentsDataDefinition.CurrentPage = 1;
                            $scope.seaFreightShipmentsDataDefinition.DoPagination = true;
                        }
                        return true;

                    case "Shipment No":
                        //if datalist is only 1 then directly insert
                        $scope.showModal('#shipment-list-modal','shipment');
                        return true;

                    default: return true;
                }
            };

            $scope.seaFreightShipmentsResetData = function () {
                $scope.seaFreightShipmentsItem = {
                    "Id": null,
                    "SeaFreightId": -1,
                    "ShipmentId": 0,
                    "Shipment": $rootScope.shipmentObj(),
                    "CostAllocation": null
                }

                $scope.seaFreightIsError = false;
                $scope.seaFreightErrorMessage = "";
                //Added 1 row in Sea Freight Shipments
                $scope.seaFreightShipmentsTemporyId++;
                $scope.seaFreightShipmentsItem.Id = $scope.seaFreightShipmentsTemporyId;
                $scope.seaFreightShipmentsDataDefinition.DataList.push($scope.seaFreightShipmentsItem);

            };

            $scope.seaFreightShipmentsShowFormError = function (error) {
                $scope.seaFreightIsError = true;
                $scope.seaFreightErrorMessage = error;
            };

            $scope.initializeSeaFreightShipmentsDataDefinition();
            $scope.initializeSeaFreightShipmentsSubmitDefinition();
        };

        //function that will be invoked during compiling datagrid to DOM
        $scope.compileSeaFreightShipmentsDataGrid = function () {
            var html = '<dir-data-grid2 datadefinition      = "seaFreightShipmentsDataDefinition"' +
                                        'submitdefinition   = "seaFreightShipmentsSubmitDefinition"' +
                                        'otheractions       = "seaFreightShipmentsOtheractions(action)"' +
                                        'resetdata          = "seaFreightShipmentsResetData()"' +
                                        'showformerror      = "seaFreightShipmentsShowFormError(error)">' +
                        '</dir-data-grid2>';
            $content = angular.element(document.querySelector('#seaFreightShipmentsContainer')).html(html);
            $compile($content)($scope);
        };
        //=================================================END OF SEA FREIGHT DETAIL DATAGRID=================================================
        
        //=================================================SHIPMENT MODAL/REPORT=================================================
        
        //Load businessUnit filtering for compiling
        $scope.loadShipmentFiltering = function () {
            $scope.initShipmentFilteringParameters();
            $scope.initShipmentFilteringContainter();
        };

        //initialize businessUnit filtering parameters
        $scope.initShipmentFilteringContainter = function () {
            html = '<dir-filtering id="shipmentFilter"  filterdefinition="shipmentFilteringDefinition"' +
                                    'filterlistener="shipmentDataDefinition.Retrieve"' +
                                    'otheractions="shipmentOtherActionsFiltering(action)"' +
                   '</dir-filtering>';
            $content = angular.element(document.querySelector('#shipmentFilterContainter')).html(html);
            $compile($content)($scope);
        };

        //function that will be called during compiling of business unit filtering to DOM
        $scope.initShipmentFilteringParameters = function () {
            $scope.initShipmentFilteringDefinition = function () {
                $scope.shipmentFilteringDefinition = {
                    "Url": ($scope.shipmentDataDefinition.EnablePagination == true ? 'api/Shipments?type=paginate&param1=' + $scope.shipmentDataDefinition.CurrentPage : 'api/Shipments?type=scroll&param1=' + $scope.shipmentDataDefinition.DataList.length),//Url for retrieve
                    "DataList": [], //Contains the data retrieved based on the criteria
                    "DataItem1": $scope.DataItem1, //Contains the parameter value index 
                    "Source": [
                                { "Index": 0, "Label": "Shipment No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                                { "Index": 1, "Label": "Booking Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                                { "Index": 3, "Label": "Service", "Column": "ServiceId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                                { "Index": 4, "Label": "Shipment Type", "Column": "ShipmentTypeId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                                { "Index": 5, "Label": "Payment Mode", "Column": "PaymentMode", "Values": $scope.paymentModeList, "From": null, "To": null, "Type": "DropDown" },
                                { "Index": 6, "Label": "Target Pickup Date", "Column": "PickupDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                                { "Index": 7, "Label": "Status", "Column": "TransportStatusId", "Values": $rootScope.getTransportStatusList(), "From": null, "To": null, "Type": "DropDown" }
                    ],//Contains the Criteria definition
                    "Multiple": false,
                    "AutoLoad": false,
                    "ClearData": false,
                    "SetSourceToNull": false
                }
            };

            $scope.shipmentOtherActionsFiltering = function (action) {
                switch (action) {
                    //Initialize DataItem1 and DataItem2 for data filtering
                    case 'PreFilterData':
                        $scope.shipmentSource = $scope.shipmentFilteringDefinition.Source;
                        //Optional in using this, can use switch if every source type has validation before filtering
                        for (var i = 0; i < $scope.shipmentSource.length; i++) {
                            if ($scope.shipmentSource[i].Type == "Date") {
                                $scope.shipmentFilteringDefinition.DataItem1.Shipment[0][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].From;
                                $scope.shipmentFilteringDefinition.DataItem1.Shipment[1][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].To;
                            }
                            else
                                $scope.shipmentFilteringDefinition.DataItem1.Shipment[0][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].From;
                        }
                        //Delete keys that the value is null
                        for (var i = 0; i < $scope.shipmentSource.length; i++) {
                            if ($scope.shipmentFilteringDefinition.DataItem1.Shipment[0][$scope.shipmentSource[i].Column] == null) {
                                delete $scope.shipmentFilteringDefinition.DataItem1.Shipment[0][$scope.shipmentSource[i].Column];
                                delete $scope.shipmentFilteringDefinition.DataItem1.Shipment[1][$scope.shipmentSource[i].Column];
                            }
                        }
                        if ($scope.shipmentDataDefinition.EnablePagination == true && $scope.shipmentFilteringDefinition.ClearData) {
                            $scope.shipmentDataDefinition.CurrentPage = 1;
                            $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=paginate&source=sea&param1=' + $scope.shipmentDataDefinition.CurrentPage;
                        }
                        else if ($scope.shipmentDataDefinition.EnablePagination == true) {
                            $scope.shipmentDataDefinition.DataList = [];
                            $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=paginate&source=sea&param1=' + $scope.shipmentDataDefinition.CurrentPage;
                        }
                            //Scroll
                        else {
                            if ($scope.shipmentFilteringDefinition.ClearData)
                                $scope.shipmentDataDefinition.DataList = [];
                            $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=paginate&source=sea&param1=' + $scope.shipmentDataDefinition.DataList.length;
                        }
                        $scope.shipmentFilteringDefinition.DataItem1.Shipment[0].BusinessUnitId = $scope.seafreightItem.OriginBusinessUnitId;
                        alert($scope.shipmentFilteringDefinition.DataItem1.Shipment[0].BusinessUnitId);

                        return true;
                    case 'PostFilterData':
                        /*Note: if pagination, initialize businessUnitDataDefinition DataList by copying the DataList of filterDefinition then 
                                set DoPagination to true
                          if scroll, initialize businessUnitDataDefinition DataList by pushing each value of filterDefinition DataList*/
                        //Required
                        $scope.shipmentFilteringDefinition.DataList = $rootScope.formatShipment($scope.shipmentFilteringDefinition.DataList);
                        if ($scope.shipmentDataDefinition.EnableScroll == true) {
                            for (var j = 0; j < $scope.shipmentFilteringDefinition.DataList.length; j++)
                                $scope.shipmentDataDefinition.DataList.push($scope.shipmentFilteringDefinition.DataList[j]);
                        }

                        if ($scope.shipmentDataDefinition.EnablePagination == true) {
                            $scope.shipmentDataDefinition.DataList = [];
                            $scope.shipmentDataDefinition.DataList = $scope.shipmentFilteringDefinition.DataList;
                            $scope.shipmentDataDefinition.DoPagination = true;
                        }
                        return true;
                    default: return true;
                }
            };

            $scope.initShipmentDataItems = function () {
                $scope.shipmentFilteringDefinition.DataItem1 = angular.copy($rootScope.shipmentObj());
            };

            $scope.initShipmentFilteringDefinition();
            $scope.initShipmentDataItems();
        };

        //Load business datagrid for compiling
        $scope.loadShipmentDataGrid = function () {
            $scope.initShipmentDataGrid();
            $scope.compileShipmentDataGrid();
        };

        //initialize businessUnit datagrid parameters
        $scope.initShipmentDataGrid = function () {
            $scope.shipmentSubmitDefinition = undefined;
            $scope.initializeShipmentDataDefinition = function () {
                $scope.shipmentDataDefinition = {
                    "Header": ['Shipment No', 'Transport Status', 'Booking Date', 'Business Unit', 'Operating Site', 'Service', 'Shipment Type', 'Payment Mode', 'Booking Remarks', 'Qty', 'Total CBM', 'Cargo Description', 'Pickup Address', 'Target Pickup Date', 'Target Pickup Time', 'Customer', 'Customer Address', 'Customer Contact No', 'Consignee', 'Consignee Address', 'Consignee Contact No', 'No.'],
                    "Keys": ['Id', 'TransportStatusId', 'CreatedDate', 'BusinessUnit.Name', 'BusinessUnit1.Name', 'Service.Name', 'ShipmentType.Name', 'PaymentMode', 'BookingRemarks', 'Quantity', 'TotalCBM', 'Description', 'OriginAddress', 'PickupDate', 'PickupTime', 'Customer.Name', 'Customer.CustomerAddresses[0].Line1', 'Customer.CustomerContacts[0].Contact.ContactPhones[0].ContactNumber', 'DeliverTo', 'DeliveryAddress', 'DeliverToContactNo'],
                    "Type": ['ControlNo', 'TransportStatus', 'Date', 'ProperCase', 'ProperCase', 'ProperCase', 'ProperCase', 'PaymentMode', 'Default', 'Default', 'Decimal', 'Default', 'ProperCase', 'Date', 'Time', 'ProperCase', 'ProperCase', 'Default', 'ProperCase', 'ProperCase', 'Default'],
                    "ColWidth": [150, 150, 150, 150, 150, 150, 150, 150, 200, 100, 150, 200, 300, 150, 150, 200, 200, 200, 200, 300, 200],
                    "DataList": [],
                    "RequiredFields": [],
                    "CellTemplate": ["None"],
                    "RowTemplate": "Default",
                    "EnableScroll": true,
                    "EnablePagination": false,
                    "CurrentPage": 1, //By default
                    "PageSize": 20, //Should be the same in back-end
                    "DoPagination": false, //By default
                    "Retrieve": false, //By default
                    "DataItem": {},
                    "DataTarget": "ShipmentUnitMenu",
                    "DataTarget": "ShipmentUnitMenu2",
                    "ShowCreate": false,
                    "ShowContextMenu": false,
                    "ContextMenu": [""],
                    "ContextMenuLabel": [""]
                }

                //Optional if row template
                $scope.shipmentDataDefinition.RowTemplate = '<div>' +
                                                                    ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                                                                  '</div>';
            };
            $scope.shipmentOtherActions = function (action) {
                switch (action) {
                    case 'PostEditAction':
                        var found = false;
                        //Check if Shipment is already in the list
                        for (var i = 0; i < $scope.seaFreightShipmentsDataDefinition.DataList.length; i++) {
                            if ($scope.seaFreightShipmentsDataDefinition.DataList[i].ShipmentId == $scope.shipmentDataDefinition.DataItem.Id) {
                                found = true;
                                i = $scope.seaFreightShipmentsDataDefinition.DataList;
                            }
                        }
                        //Check if shipment is not yet in the list
                        if (!found) {
                            $scope.seaFreightShipmentsItem.ShipmentId = $scope.shipmentDataDefinition.DataItem.Id;
                            $scope.seaFreightShipmentsItem.Shipment = $scope.shipmentDataDefinition.DataItem;
                            var originAddress = $scope.shipmentDataDefinition.DataItem.Address1;
                            var deliveryAddress = $scope.shipmentDataDefinition.DataItem.Address;
                            $scope.seaFreightShipmentsItem.Shipment.OriginAddress = $scope.initializeAddressField(originAddress);
                            $scope.seaFreightShipmentsItem.Shipment.DeliveryAddress = $scope.initializeAddressField(deliveryAddress);
                            $scope.seaFreightIsError = false;
                            $scope.seaFreightErrorMessage = "";
                        }
                        else {
                            $scope.seaFreightIsError = true;
                            $scope.seaFreightErrorMessage = "Shipment is already in the list.";

                        }
                        $scope.closeModal();
                        return true;
                    default: return true;
                }
            };

            $scope.initializeShipmentDataDefinition();
        };

        //function that will be invoked during compiling of datagrid to DOM
        $scope.compileShipmentDataGrid = function () {
            var html = '<dir-data-grid2 id="shipmentGrid" datadefinition      = "shipmentDataDefinition"' +
                                        'submitdefinition   = "shipmentSubmitDefinition"' +
                                        'otheractions       = "shipmentOtherActions(action)">' +
                        '</dir-data-grid2>';
            $content = angular.element(document.querySelector('#shipmentContainer')).html(html);
            $compile($content)($scope);
        };
        //=================================================END OF SHIPMENT MODAL=================================================

        //Initialize Business Unit List for Modal
        $scope.initBusinessUnitList = function () {
            $http.get("/api/BusinessUnits")
            .success(function (data, status) {
                $scope.businessUnitList = data;
            })
        };
        
        //Initialize Shippingline List for Modal
        $scope.initShippingLineList = function () {
            $http.get("/api/ShippingLines")
            .success(function (data, status) {
                for (var i = 0; i < 100; i++)
                    $scope.shippingLineList = data;

            })
        };

        //Initialize Shipment List for Modal
        $scope.initShipmentList = function () {
            $http.get("/api/Shipments?page=1")
            .success(function (data, status) {
                $scope.ShipmentList = data;
            })
        };
        
  

        //Retrieve seafreight's shipments
        $scope.loadDetail = function (seaFreightId) {
            var spinner = new Spinner(opts).spin(spinnerTarget);
            var i = 0;
            $http.get("/api/SeaFreightShipments?seaFreightId=" + seaFreightId+"&page=1")
                .success(function (data, status) {
                    //initialize seafreight shipments
                    $scope.SeaFreightShipmentGridOptions.data = data;

                    //$scope.currentPage = page;
                    //if (page <= 1) {
                    //    $scope.isPrevPage = false;
                    //} else {
                    //    $scope.isPrevPage = true;
                    //}
                    //var rows = data.length;
                    //if (rows < pageSize) {
                    //    $scope.isNextPage = false;
                    //} else {
                    //    $scope.isNextPage = true;
                    //}
                    $scope.focusOnTop();
                    spinner.stop();
                })
                .error(function (data, status) {
                    spinner.stop();
                });
        };
        
        //add an empty row to sea freight shipment detail
        $scope.addSeaFreightShipmentItem = function () {
            $scope.initShipmentList();
            openModalPanel2("#shipment-list-modal");
            //$scope.SeaFreightShipmentGridOptions.data.push({ ShipmentNo: null, ShipmentType: null, CustomerName: null, ShipmentDescription: null, Quantity: null, CBM: null, Consignee : null,FreightCost: null});
        }

        //function that will be invoked when user click tab
        $scope.setSelectedTab = function (tab) {
            $scope.isError = false;
            $scope.errorMessage = "";
            $scope.selectedTab = tab;
        };

        //function that will be invoked when user delete, update or view a record in the seafreight list
        $scope.setSelected = function (id) {
            $scope.seafreightIDholder = id;
        };
        
        $scope.setSelectedDetail = function (id) {
            $scope.shipmentIDholder = id;
        };
        
        $scope.searchShipment = function (id) {
            var i = 0;
            for (i = 0; i < $scope.ShipmentList.length; i++) {
                if (id == $scope.ShipmentList[i].Id) {
                    return i;
                }
            }
            return i;
        };

        //search seafreight
        $scope.searchseafreight = function (id) {
            var i = 0;
            for (i = 0; i < $scope.seafreightGridOptions.data.length; i++) {
                if (id == $scope.seafreightGridOptions.data[i].Id) {
                    return i;
                }
            }
            return i;
        };

        //search SeaFreightShipment
        $scope.searchSeaFreightShipment = function (id) {
            var i = 0;
            for (i = 0; i < $scope.SeaFreightShipmentGridOptions.data.length; i++) {
                if (id == $scope.SeaFreightShipmentGridOptions.data[i].Id) {
                    return i;
                }
            }
            return i;
        };

        $scope.setSelectedSeaFreightShipment = function (id) {
            $scope.selectedSeaFreightShipmentIndex = $scope.searchSeaFreightShipment(id);
        };

        //Manage the submition of data base on the user action
        $scope.submit = function () {
            $scope.seaFreightIsError = false;
            $scope.seaFreightErrorMessage = "";
            $scope.seaFreightSubmitDefinition.Submit = true;
        }

        //Set the focus on top of the page during load
        $scope.focusOnTop = function () {
            $(document).ready(function () {
                $(this).scrollTop(0);
            });
        };
        
        //don't allow input
        $('#origin,#destination,#voyageNo').keypress(function (key) {
            return false;
        });
        
        // Initialization routines
        var init = function () {
            // Call function to load data during content load
            $scope.focusOnTop();
            $scope.loadSeaFreightDataGrid();
            $scope.loadSeaFreightFiltering();
            $scope.loadSeaFreightShipmentsDataGrid();
           
            $scope.seaFreightResetData()
            $scope.seaFreightShipmentsResetData();


            //console.log( );
        };

        init();

        $interval(function () {
            //For responsive modal
            var width = window.innerWidth;
            if (width < 1030) {
                $scope.modalStyle = "height:520px; max-height:100%";
            }
            else {
                $scope.modalStyle = "height:450px; max-height:100%";
            }
        }, 100);
    };