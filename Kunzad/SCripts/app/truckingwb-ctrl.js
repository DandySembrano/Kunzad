
kunzadApp.controller("TruckingsWBController", TruckingsWBController);
function TruckingsWBController($scope, $http, $interval, $filter, $rootScope, $compile) {
    $scope.modelName = "Trucking Info";
    $scope.modelhref = "#/truckingwb";
    $scope.isPrevPage = false;
    $scope.isNextPage = true;
    $scope.actionMode = "Create";
    $scope.selected = null;
    $scope.currentPage = 1;
    $scope.truckingToggle = false;
    $scope.viewOnly = false;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.submitButtonText = "Submit";
    $scope.tabPages = ["Information", "List"];
    $scope.selectedTab = "Information";
    $scope.showMenu = false;
    $scope.truckingList = [];
    $scope.businessUnitList = [];
    $scope.trkgDeliveryList = [];
    $scope.withDirective = true;
    $scope.modalType = null;
    var pageSize = 20;

    // LOAD TRUCKINGS DATA WITH STATUS = 20
    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/TruckingsWB?p=" + page + "&status=20")
            .success(function (data, status) {
                for (var i = 0; i < data.length; i++) {
                    // assign Drivers Name - CONCAT
                    data[i].Driver.Name = data[i].Driver.FirstName + ' ' + data[i].Driver.MiddleName + ' ' + data[i].Driver.LastName;
                    // format Created Date
                    data[i].CreatedDateDesc = $filter('date')(data[i].CreatedDate, 'yyyy-MM-dd');
                }
                $scope.gridOptionsTruckings.data = data;
                $scope.currentPage = page;
                if (page <= 1) {
                    $scope.isPrevPage = false;
                } else {
                    $scope.isPrevPage = true;
                }
                var rows = data.length;
                if (rows < pageSize) {
                    $scope.isNextPage = false;
                } else {
                    $scope.isNextPage = true;
                }
                $scope.focusOnTop
                spinner.stop();
            })
            .error(function (data, status) {
                spinner.stop();
            });
    };

    $scope.addNewBooking = function () {
        $scope.trkgDeliveryList.push(
             {
                 Id: null,
                 TruckingId: null,
                 ShipmentId: null,
                 Shipment: {
                     Id: null,
                     BusinessUnitId: null,
                     ServiceId: null,
                     Service: {
                         Id: null,
                         Name: null
                     },
                     ShipmentTypeId: null,
                     ShipmentType: {
                         Id: null,
                         Name: null
                     },
                     PaymentMode: null,
                     CustomerId: null,
                     Customer: {
                         Id: null,
                         Name: null
                     },
                     Quantity: null,
                     TotalCBM: null,
                     Description: null,
                     DeliverTo: null,
                     DeliveryAddressId: null,
                     DeliveryAddress: null,
                     Address1: {
                         Id: null,
                         Line1: null,
                         Line2: null,
                         CityMunicipalityId: null,
                         CityMunicipality: {
                             Id: null,
                             Name: null,
                             StateProvince: {
                                 Id: null,
                                 Name: null,
                                 CountryId: null,
                                 Country: {
                                     Id: null,
                                     Name: null
                                 }
                             }

                         },
                         PostalCode: null
                     }
                 },
                 CustomerId: null,
                 Customer: { Id: null, Name: null },
                 Quantity: null,
                 CBM: null,
                 Description: null,
                 DeliverTo: null,
                 DeliveryAddressId: null,
                 DeliveryAddress: null,
                 Address1: {
                     Id: null,
                     Line1: null,
                     Line2: null,
                     CityMunicipalityId: null,
                     CityMunicipality: {
                         Id: null,
                         Name: null,
                         StateProvince: {
                             Id: null,
                             Name: null,
                             CountryId: null,
                             Country: {
                                 Id: null,
                                 Name: null
                             }
                         }

                     },
                     PostalCode: null
                 },
                 DeliveryDate: null,
                 DeliveryTime: null,
                 CostAllocation: null,
                 CreatedDate: null,
                 LastUpdatedDate: null,
                 CreatedByUserId: null,
                 LastUpdatedByUserId: null
             }
        );
    };

    $scope.removeBooking = function (index) {
        if ($scope.trkgDeliveryList.length == 1)
            alert('Unable to delete, At least 1 detail is required.');
        else
            $scope.trkgDeliveryList.splice(index, 1);
    };

    // INITIALIZE BUSINESS UNITS
    $scope.initBusinessUnits = function () {
        $http.get("/api/BusinessUnits")
        .success(function (data, status) {
            $scope.businessUnitList = data;
        })
    };

    // MODAL
    $scope.showModal = function (panel, type) {
        if (panel == '#serviceableArea-list-modal') {
            $scope.loadServiceableAreaDataGrid();
            $scope.loadServiceableAreaFiltering();
            $scope.serviceableAreaFilteringDefinition.SetSourceToNull = true;
            $scope.serviceableAreaDataDefinition.Retrieve = true;
        }
        else {
            $scope.loadBusinessUnitDataGrid();
            $scope.loadBusinessUnitFiltering();
            $scope.businessUnitFilteringDefinition.SetSourceToNull = true;
            $scope.businessUnitDataDefinition.Retrieve = true;
        }
        openModalPanel2(panel);
        $scope.modalType = type;
    }

    $scope.closeModal = function () {
        jQuery.magnificPopup.close();
        if (angular.isDefined($scope.serviceableAreaDataDefinition)) {
            $scope.serviceableAreaDataDefinition.DataList = [];
            $scope.serviceableAreaFilteringDefinition.DataList = [];
            $rootScope.removeElement("serviceableAreaGrid");
            $rootScope.removeElement("serviceableAreaFilter");
        }
        if (angular.isDefined($scope.shippingLineDataDefinition)) {
            $scope.shippingLineDataDefinition.DataList = [];
            $scope.shippingLineFilteringDefinition.DataList = [];
            $rootScope.removeElement("dispatchingGrid");
            $rootScope.removeElement("dispatchingFilter");
        }
    }

    //same with rootScope.shipmentObj
    $scope.truckingObj = function () {
        return {
            "Truckung": [{
                "Id": null,
                "DocumentNo": null,
                "OriginServiceableAreaId": null,
                "DestinationServiceableAreaId": null,
                "CreatedDate": null,
                "LastUpdatedDate": null
            },
            {
                "Id": null,
                "DocumentNo": null,
                "OriginServiceableAreaId": null,
                "DestinationServiceableAreaId": null,
                "CreatedDate": null,
                "LastUpdatedDate": null
            }]
        };
    }

    //=================================================START OF TRUCKING INFORMATION MASTER GRID=================================================
    //Initialized trucking item to it's default value
    $scope.truckingResetData = function () {
        $scope.truckingItem = {
            "Id": null,
            "DocumentNo": null,
            "TruckerId": null,
            "Trucker": {
                "Id": null,
                "Name": null
            },
            "TruckId": null,
            "Truck": {
                "Id": null,
                "PlateNo": null,
            },
            "DriverId": null,
            "Driver": {
                "Id": null,
                "Name": null
            },
            "OriginServiceableAreaId": null,
            "ServiceableArea1": {
                "Id": null,
                "Name": null
            },
            "DestinationServiceableAreaId": null,
            "ServiceableArea": {
                "Id": null,
                "Name": null
            },
            "TruckingStatusId": null,
            "CreatedDate": null,
            "CreatedDateDesc": null,
            "LastUpdatedDate": null,
            "TruckingDeliveries": []
        };
        // TEMPORARY DEFAULT ORIGIN BUSINESS UNIT
        $scope.truckingItem.BusinessUnit = {
            "Id": 9,
            "Code": "BU0005",
            "Name": "Cebu",
            "BusinessUnitTypeId": 1,
            "ParentBusinessUnitId": 3,
            "isOperatingSite": false,
            "hasAirPort": false,
            "hasSeaPort": false,
            "CreatedDate": "2015-06-08T14:18:39.237",
            "LastUpdatedDate": "2015-08-26T17:56:00.533",
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null
        };
        $scope.truckingItem.OriginServiceableAreaId = $scope.truckingItem.BusinessUnit.Id;
        $scope.truckingItem.ServiceableArea1.Name = $scope.truckingItem.BusinessUnit.Name;
    };

    //Load variable datagrid for compiling
    $scope.loadTruckingDataGrid = function () {
        $scope.initTruckingDataGrid();
        $scope.compileTruckingDataGrid();
    };

    //initialized trucking data grid
    $scope.initTruckingDataGrid = function () {
        $scope.initTruckingDataDefinition = function () {
            $scope.truckingDataDefinition = {
                "Header":   ['Document No','Dispatch No', 'Dispatch Date', 'Dispatch Time', 'Status',           'Type',           'Plate No',      'Trucker Name', 'Driver First Name','Driver Last Name', 'Truck Call Date', 'Truck Call Time', 'No'],
                "Keys":     ['DocumentNo', 'Id',          'DispatchDate',  'DispatchTime',  'TruckingStatusId', 'TruckingTypeId', 'Truck.PlateNo', 'Trucker.Name', 'Driver.FirstName', 'Driver.LastName',  'TruckCallDate',   'TruckCallTime'],
                "Type":     ['ProperCase', 'ControlNo',   'Date',          'Time',          'TruckingStatus',   'TruckingType',   'ProperCase',     'ProperCase',  'ProperCase',       'ProperCase',       'Date',            'Time'],
                "ColWidth": [150,               150,           150,             150,             100,                100,              150,             150,            150,                150,                150,               150],
                "DataList": [],
                "RequiredFields": ['DocumentNo-Document No', 'Id-Dispatch No', 'OriginServiceableAreaId-Origin', 'DestinationServiceableAreaId-Destination', 'TruckerCost-Trucker Cost', 'InternalRevenue-Revenue'],
                "CellTemplate": ["None"],
                "RowTemplate": "Default",
                "EnableScroll": true,
                "EnablePagination": false,
                "CurrentPage": 1,//By default
                "PageSize": 20, //Should be the same in back-end
                "DoPagination": false, //By default
                "Retrieve": false, //By default
                "DataItem": {},
                "DataTarget": "TruckingMenu",
                "DataTarget2": "TruckingMenu1",
                "ShowCreate": true,
                "ShowContextMenu": true,
                "ContextMenu": ["'Load'", "'Create'", "'Edit'", "'Delete'", "'View'", "'Find'", "'Clear'"],
                "ContextMenuLabel": ['Reload', 'Create', 'Edit', 'Cancel', 'View', 'Find', 'Clear']
            }
        };

        $scope.initTruckingSubmitDefinition = function () {
            $scope.truckingSubmitDefinition = {
                "Submit": false, //By default
                "APIUrl": '/api/Truckings',
                "Type": 'Create', //By Default
                "DataItem": {},
                "Index": -1 //By Default
            }
        };

        $scope.truckingOtheractions = function (action) {
            switch (action) {
                case "FormCreate":
                    $scope.selectedTab = $scope.tabPages[0];
                    $scope.truckingResetData();
                    //$scope.truckingShipmentsDataDefinition.DataList.splice(0, $scope.truckingShipmentsDataDefinition.DataList.length);
                    //$scope.truckingShipmentsResetData();
                    $scope.enableSave = true;
                    $scope.viewOnly = false;
                    return true;
                case "PreAction":
                    return true;
                case "PostCreateAction":
                    $scope.submitButtonText = "Submit";
                    //$scope.truckingSubmitDefinition.Type = "Create";
                    $scope.selectedTab = $scope.tabPages[0];
                    $scope.truckingResetData();
                    //$scope.truckingShipmentsDataDefinition.DataList.splice(0, $scope.truckingShipmentsDataDefinition.DataList.length);
                    //$scope.truckingShipmentsResetData();
                    $scope.enableSave = true;
                    $scope.viewOnly = false;
                    return true;
                case "PostEditAction":
                    //If user choose edit-menu in listing
                    if (angular.isDefined($scope.truckingDataDefinition.DataItem.Id) && $scope.truckingItem.Id != $scope.truckingDataDefinition.DataItem.Id) {
                        $scope.truckingShipmentsDataDefinition.DataList.splice(0, $scope.truckingShipmentsDataDefinition.DataList.length);
                        $scope.truckingItem = angular.copy($scope.truckingDataDefinition.DataItem);
                        $scope.controlNoHolder = $scope.truckingItem.Id;
                        $scope.truckingItem.Id = $rootScope.formatControlNo('', 15, $scope.truckingItem.Id);
                        $scope.truckingItem.CallDate = $filter('Date')($scope.truckingItem.CallDate);
                        $scope.truckingItem.CourierCost = $filter('number')($scope.truckingItem.CourierCost, 2);

                        $scope.loadDetail($scope.truckingItem.Id);
                        var promise = $interval(function () {
                            if ($scope.flagOnRetrieveDetails) {
                                $scope.flagOnRetrieveDetails = false;
                                $interval.cancel(promise);
                                promise = undefined;
                                $scope.viewOnly = false;
                                $scope.submitButtonText = "Submit";
                                $scope.selectedTab = $scope.tabPages[0];
                                $scope.truckingSubmitDefinition.Type = "Edit";
                                if ($scope.truckingShipmentsDataDefinition.DataList.length > 0)
                                    //Set control no holder in case user will add item in list
                                    $scope.controlNoHolder = $scope.truckingShipmentsDataDefinition.DataList[$scope.truckingShipmentsDataDefinition.DataList.length - 1].Id + 1;
                                else
                                    $scope.truckingShipmentsResetData();
                            }
                        }, 100);
                    }
                    else {
                        $scope.viewOnly = false;
                        $scope.submitButtonText = "Submit";
                        $scope.selectedTab = $scope.tabPages[0];
                        $scope.truckingSubmitDefinition.Type = "Edit";
                    }
                    $scope.enableSave = true;
                    return true;
                case "PostDeleteAction":
                    //If user choose edit-menu in listing
                    if (angular.isDefined($scope.truckingDataDefinition.DataItem.Id) && $scope.truckingItem.Id != $scope.truckingDataDefinition.DataItem.Id) {
                        $scope.truckingShipmentsDataDefinition.DataList.splice(0, $scope.truckingShipmentsDataDefinition.DataList.length);
                        $scope.truckingItem = angular.copy($scope.truckingDataDefinition.DataItem);
                        $scope.controlNoHolder = $scope.truckingItem.Id;
                        $scope.truckingItem.Id = $rootScope.formatControlNo('', 15, $scope.truckingItem.Id);
                        $scope.truckingItem.CallDate = $filter('Date')($scope.truckingItem.CallDate);
                        $scope.truckingItem.CourierCost = $filter('number')($scope.truckingItem.CourierCost, 2);

                        $scope.loadDetail($scope.truckingItem.Id);
                        var promise = $interval(function () {
                            if ($scope.flagOnRetrieveDetails) {
                                $scope.flagOnRetrieveDetails = false;
                                $interval.cancel(promise);
                                promise = undefined;
                                $scope.viewOnly = true;
                                $scope.submitButtonText = "Cancel";
                                $scope.selectedTab = $scope.tabPages[0];
                                $scope.truckingSubmitDefinition.Type = "Edit";
                            }
                        }, 100);
                    }
                    else {
                        $scope.viewOnly = true;
                        $scope.submitButtonText = "Cancel";
                        $scope.selectedTab = $scope.tabPages[0];
                        $scope.truckingSubmitDefinition.Type = "Edit";
                    }
                    $scope.enableSave = true;
                    return true;
                case "PostViewAction":
                    //If user choose edit-menu in listing
                    if (angular.isDefined($scope.truckingDataDefinition.DataItem.Id) && $scope.truckingItem.Id != $scope.truckingDataDefinition.DataItem.Id) {
                        $scope.truckingShipmentsDataDefinition.DataList.splice(0, $scope.truckingShipmentsDataDefinition.DataList.length);
                        $scope.truckingItem = angular.copy($scope.truckingDataDefinition.DataItem);
                        $scope.controlNoHolder = $scope.truckingItem.Id;
                        $scope.truckingItem.Id = $rootScope.formatControlNo('', 15, $scope.truckingItem.Id);
                        $scope.truckingItem.CallDate = $filter('Date')($scope.truckingItem.CallDate);
                        $scope.truckingItem.CourierCost = $filter('number')($scope.truckingItem.CourierCost, 2);

                        $scope.loadDetail($scope.truckingItem.Id);
                        var promise = $interval(function () {
                            if ($scope.flagOnRetrieveDetails) {
                                $scope.flagOnRetrieveDetails = false;
                                $interval.cancel(promise);
                                promise = undefined;
                                $scope.viewOnly = true;
                                $scope.submitButtonText = "Close";
                                $scope.selectedTab = $scope.tabPages[0];
                                $scope.truckingSubmitDefinition.Type = "View";
                            }
                        }, 100);

                    }
                    else {
                        $scope.viewOnly = true;
                        $scope.submitButtonText = "Close";
                        $scope.selectedTab = $scope.tabPages[0];
                        $scope.truckingSubmitDefinition.Type = "View";
                    }
                    return true;
                case "PreSubmit":
                    if (!$scope.validTruckingShipments())
                        return false;
                    $scope.truckingSubmitDefinition.DataItem = angular.copy($scope.truckingItem);
                    return true;
                case "PreSave":
                    $scope.truckingSubmitDefinition.DataItem.TruckingShipments = angular.copy($scope.truckingShipmentsDataDefinition.DataList);
                    delete $scope.truckingSubmitDefinition.DataItem.Id;
                    delete $scope.truckingSubmitDefinition.DataItem.Trucking;
                    delete $scope.truckingSubmitDefinition.DataItem.BusinessUnit;
                    delete $scope.truckingSubmitDefinition.DataItem.BusinessUnit1;
                    delete $scope.truckingSubmitDefinition.DataItem.VesselVoyage;
                    for (var i = 0; i < $scope.truckingSubmitDefinition.DataItem.TruckingShipments.length; i++) {
                        delete $scope.truckingSubmitDefinition.DataItem.TruckingShipments[i].Id;
                        delete $scope.truckingSubmitDefinition.DataItem.TruckingShipments[i].Shipment;
                    }
                    return true;
                case "PostSave":
                    //Initialize Sea Freight Id
                    $scope.truckingItem.Id = $scope.truckingSubmitDefinition.DataItem.Id;
                    $scope.truckingItem.Id = $rootScope.formatControlNo('', 15, $scope.truckingItem.Id);
                    //Initialize Sea Freight Shipments Id
                    for (var i = 0; i < $scope.truckingSubmitDefinition.DataItem.TruckingShipments.length; i++)
                        $scope.truckingShipmentsDataDefinition.DataList[i].Id = $scope.truckingSubmitDefinition.DataItem.TruckingShipments[i].Id;
                    $scope.viewOnly = true;
                    $scope.truckingSubmitDefinition.Type = "Edit";
                    alert("Successfully Saved.");
                    return true;
                case "PreUpdate":
                    $scope.truckingSubmitDefinition.DataItem.CourierTransactionDetails = angular.copy($scope.truckingShipmentsDataDefinition.DataList);
                    delete $scope.truckingSubmitDefinition.DataItem.Courier;
                    delete $scope.truckingSubmitDefinition.DataItem.BusinessUnit;
                    for (var i = 0; i < $scope.truckingSubmitDefinition.DataItem.CourierTransactionDetails.length; i++) {
                        if ($scope.truckingSubmitDefinition.DataItem.CourierTransactionDetails[i].CourierTransactionId == -1) {
                            delete $scope.truckingSubmitDefinition.DataItem.CourierTransactionDetails[i].Id;
                            $scope.truckingSubmitDefinition.DataItem.CourierTransactionDetails[i].CourierTransactionId = $scope.truckingItem.Id;
                        }

                        delete $scope.truckingSubmitDefinition.DataItem.CourierTransactionDetails[i].Shipment;
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
                        if ($scope.truckingToggle == false) {
                            $("#truckingToggle").slideToggle(function () {
                                $scope.truckingToggle = true;
                            });
                        }
                        $interval.cancel(promise);
                        promise = undefined;
                    }, 200);
                    return true;
                case "Clear":
                    $scope.truckingDataDefinition.DataList = [];
                    //Required if pagination is enabled
                    if ($scope.truckingDataDefinition.EnablePagination == true) {
                        $scope.truckingDataDefinition.CurrentPage = 1;
                        $scope.truckingDataDefinition.DoPagination = true;
                    }
                    return true;
                default: return true;
            }
        };

        $scope.truckingShowFormError = function (error) {
            $scope.truckingIsError = true;
            $scope.truckingErrorMessage = error;
        };

        $scope.initTruckingDataDefinition();
        $scope.initTruckingSubmitDefinition();
    };

    //function that will be invoked during compiling of Trucking datagrid to DOM
    $scope.compileTruckingDataGrid = function () {
        var html = '<dir-data-grid2 datadefinition      = "truckingDataDefinition"' +
                                    'submitdefinition   = "truckingSubmitDefinition"' +
                                    'otheractions       = "truckingOtheractions(action)"' +
                                    'resetdata          = "truckingResetData()"' +
                                    'showformerror      = "truckingShowFormError(error)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#truckingContainer')).html(html);
        $compile($content)($scope);
    };

    //Load Trucking filtering for compiling
    $scope.loadTruckingFiltering = function () {
        $scope.initTruckingFilteringParameters();
        $scope.initTruckingFilteringContainter();
        $("#truckingToggle").slideToggle(function () { });
    };

    //initialize Trucking filtering parameters
    $scope.initTruckingFilteringContainter = function () {
        html = '<dir-filtering  filterdefinition="truckingFilteringDefinition"' +
                                'filterlistener="truckingDataDefinition.Retrieve"' +
                                'otheractions="truckingOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#truckingFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of Trucking filtering to DOM
    $scope.initTruckingFilteringParameters = function () {
        //Hide the Trucking filtering directive
        $scope.hideTruckingToggle = function () {
            var promise = $interval(function () {
                $("#truckingToggle").slideToggle(function () {
                    $scope.truckingToggle = false;
                });
                $interval.cancel(promise);
                promise = undefined;
            }, 200)
        };
        $scope.initTruckingFilteringDefinition = function () {
            $scope.truckingFilteringDefinition = {
                "Url": ($scope.truckingDataDefinition.EnablePagination == true ? 'api/Truckings?type=paginate&param1=' + $scope.truckingDataDefinition.CurrentPage : 'api/Truckings?type=scroll&param1=' + $scope.truckingDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value
                "Source": [
                            { "Index": 0, "Label": "Document No", "Column": "DocumentNo", "Values": [], "From": null, "To": null, "Type": "ProperCase" },
                            { "Index": 1, "Label": "Dispatch No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 2, "Label": "Origin", "Column": "OriginServiceableAreaId", "Values": ['GetServiceableAreaList'], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 3, "Label": "Destination", "Column": "DestinationServiceableAreaId", "Values": ['GetServiceableAreaList'], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 4, "Label": "Created Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 5, "Label": "Last Updated Date", "Column": "LastUpdatedDate", "Values": [], "From": null, "To": null, "Type": "Date" }
                ],//Contains the Criteria definition
                "Multiple": true,
                "AutoLoad": false,
                "ClearData": false,
                "SetSourceToNull": false
            }
        };

        $scope.truckingOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.selectedTab = $scope.tabPages[1];
                    $scope.truckingSource = $scope.truckingFilteringDefinition.Source;
                    //Optional in using this, can use switch if every source type has validation before filtering

                    for (var i = 0; i < $scope.truckingSource.length; i++) {
                        if ($scope.truckingSource[i].Type == "Date") {
                            $scope.truckingFilteringDefinition.DataItem1.Trucking[0][$scope.truckingSource[i].Column] = $scope.truckingSource[i].From;
                            $scope.truckingFilteringDefinition.DataItem1.Trucking[1][$scope.truckingSource[i].Column] = $scope.truckingSource[i].To;
                        }
                        else
                            $scope.truckingFilteringDefinition.DataItem1.Trucking[0][$scope.truckingSource[i].Column] = $scope.truckingSource[i].From;
                    }
                    //Delete keys that the value is null
                    for (var i = 0; i < $scope.truckingSource.length; i++) {
                        if ($scope.truckingFilteringDefinition.DataItem1.Trucking[0][$scope.truckingSource[i].Column] == null) {
                            delete $scope.truckingFilteringDefinition.DataItem1.Trucking[0][$scope.truckingSource[i].Column];
                            delete $scope.truckingFilteringDefinition.DataItem1.Trucking[1][$scope.truckingSource[i].Column];
                        }
                    }

                    if ($scope.truckingDataDefinition.EnablePagination == true && $scope.truckingFilteringDefinition.ClearData) {
                        $scope.truckingDataDefinition.CurrentPage = 1;
                        $scope.truckingFilteringDefinition.Url = 'api/Truckings?type=paginate&param1=' + $scope.truckingDataDefinition.CurrentPage;
                    }
                    else if ($scope.truckingDataDefinition.EnablePagination == true) {
                        $scope.truckingDataDefinition.DataList = [];
                        $scope.truckingFilteringDefinition.Url = 'api/Truckings?type=paginate&param1=' + $scope.truckingDataDefinition.CurrentPage;
                    }
                        //Scroll
                    else {
                        if ($scope.truckingFilteringDefinition.ClearData)
                            $scope.truckingDataDefinition.DataList = [];
                        $scope.truckingFilteringDefinition.Url = 'api/Truckings?type=scroll&param1=' + $scope.truckingDataDefinition.DataList.length;
                    }
                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize TruckingDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize TruckingDataDefinition DataList by pushing each value of filterDefinition DataList*/
                    //Required
                    $scope.truckingFilteringDefinition.DataList = $scope.truckingFilteringDefinition.DataList;

                    if ($scope.truckingDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.truckingFilteringDefinition.DataList.length; j++)
                            $scope.truckingDataDefinition.DataList.push($scope.truckingFilteringDefinition.DataList[j]);
                    }

                    if ($scope.truckingDataDefinition.EnablePagination == true) {
                        $scope.truckingDataDefinition.DataList = [];
                        $scope.truckingDataDefinition.DataList = $scope.truckingFilteringDefinition.DataList;
                        $scope.truckingDataDefinition.DoPagination = true;
                    }
                    if ($scope.truckingToggle == true)
                        $scope.hideTruckingToggle();
                    return true;
                case 'GetServiceableAreaList':
                    return true;
                case 'GetDispatch':
                    return true;
                default: return true;
            }
        };

        $scope.initTruckingDataItems = function () {
            $scope.truckingFilteringDefinition.DataItem1 = angular.copy($scope.truckingObj());
        };
        $scope.initTruckingFilteringDefinition();
        $scope.initTruckingDataItems();

    };
    //=================================================END OF TRUCKING INFORMATION MASTER GRID=================================================

    //=================================================START OF SERVICEABLE AREA MODAL=================================================
    //Load serviceableArea filtering for compiling
    $scope.loadServiceableAreaFiltering = function () {
        $scope.initServiceableAreaFilteringParameters();
        $scope.initServiceableAreaFilteringContainter();
    };

    //initialize serviceableArea filtering parameters
    $scope.initServiceableAreaFilteringContainter = function () {
        html = '<dir-filtering id="serviceableAreaFilter" filterdefinition="serviceableAreaFilteringDefinition"' +
                                'filterlistener="serviceableAreaDataDefinition.Retrieve"' +
                                'otheractions="serviceableAreaOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#serviceableAreaFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of business unit filtering to DOM
    $scope.initServiceableAreaFilteringParameters = function () {
        $scope.initServiceableAreaFilteringDefinition = function () {
            $scope.serviceableAreaFilteringDefinition = {
                "Url": ($scope.serviceableAreaDataDefinition.EnablePagination == true ? 'api/ServiceableAreas?type=paginate&param1=' + $scope.serviceableAreaDataDefinition.CurrentPage : 'api/ServiceableAreas?type=scroll&param1=' + $scope.serviceableAreaDataDefinition.DataList.length),//Url for retrieve
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

        $scope.serviceableAreaOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.serviceableAreaSource = $scope.serviceableAreaFilteringDefinition.Source;
                    //Optional in using this, can use switch if every source type has validation before filtering
                    for (var i = 0; i < $scope.serviceableAreaSource.length; i++) {
                        if ($scope.serviceableAreaSource[i].Type == "Date") {
                            $scope.serviceableAreaFilteringDefinition.DataItem1.ServiceableArea[0][$scope.serviceableAreaSource[i].Column] = $scope.serviceableAreaSource[i].From;
                            $scope.serviceableAreaFilteringDefinition.DataItem1.ServiceableArea[1][$scope.serviceableAreaSource[i].Column] = $scope.serviceableAreaSource[i].To;
                        }
                        else
                            $scope.serviceableAreaFilteringDefinition.DataItem1.ServiceableArea[0][$scope.serviceableAreaSource[i].Column] = $scope.serviceableAreaSource[i].From;
                    }

                    if ($scope.serviceableAreaDataDefinition.EnablePagination == true && $scope.serviceableAreaFilteringDefinition.ClearData) {
                        $scope.serviceableAreaDataDefinition.CurrentPage = 1;
                        $scope.serviceableAreaFilteringDefinition.Url = 'api/ServiceableAreas?type=paginate&param1=' + $scope.serviceableAreaDataDefinition.CurrentPage;
                    }
                    else if ($scope.serviceableAreaDataDefinition.EnablePagination == true) {
                        $scope.serviceableAreaDataDefinition.DataList = [];
                        $scope.serviceableAreaFilteringDefinition.Url = 'api/ServiceableAreas?type=paginate&param1=' + $scope.serviceableAreaDataDefinition.CurrentPage;
                    }
                        //Scroll
                    else {
                        if ($scope.serviceableAreaFilteringDefinition.ClearData)
                            $scope.serviceableAreaDataDefinition.DataList = [];
                        $scope.serviceableAreaFilteringDefinition.Url = 'api/ServiceableAreas?type=scroll&param1=' + $scope.serviceableAreaDataDefinition.DataList.length;
                    }
                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize serviceableAreaDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize serviceableAreaDataDefinition DataList by pushing each value of filterDefinition DataList*/
                    //Required
                    //$scope.serviceableAreaFilteringDefinition.DataList = $rootScope.formatServiceableArea($scope.serviceableAreaFilteringDefinition.DataList);
                    if ($scope.serviceableAreaDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.serviceableAreaFilteringDefinition.DataList.length; j++)
                            $scope.serviceableAreaDataDefinition.DataList.push($scope.serviceableAreaFilteringDefinition.DataList[j]);
                    }

                    if ($scope.serviceableAreaDataDefinition.EnablePagination == true) {
                        $scope.serviceableAreaDataDefinition.DataList = [];
                        $scope.serviceableAreaDataDefinition.DataList = $scope.serviceableAreaFilteringDefinition.DataList;
                        $scope.serviceableAreaDataDefinition.DoPagination = true;
                    }
                    return true;
                default: return true;
            }
        };

        $scope.initServiceableAreaDataItems = function () {
            $scope.serviceableAreaFilteringDefinition.DataItem1 = angular.copy($rootScope.serviceableAreaObj());
        };

        $scope.initServiceableAreaFilteringDefinition();
        $scope.initServiceableAreaDataItems();
    };

    //Load business datagrid for compiling
    $scope.loadServiceableAreaDataGrid = function () {
        $scope.initServiceableAreaDataGrid();
        $scope.compileServiceableAreaDataGrid();
    };

    //initialize serviceableArea datagrid parameters
    $scope.initServiceableAreaDataGrid = function () {
        $scope.serviceableAreaSubmitDefinition = undefined;
        $scope.initializeServiceableAreaDataDefinition = function () {
            $scope.serviceableAreaDataDefinition = {
                "Header": ['Name',       'City/Municipality',     'Postal Code', 'Is Serviceable?', 'Business Unit?','No.'],
                "Keys": [  'Name',       'CityMunicipality.Name', 'PostalCode',  'isServiceable',   'BusinessUnit.Name'],
                "Type": [  'ProperCase', 'ProperCase',            'ProperCase',  'Bit',             'ProperCase'],
                "ColWidth": [200,        200,                     200,           150,               150],
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
                "DataTarget": "ServiceableAreaMenu",
                "DataTarget2": "ServiceableAreaMenu1",
                "ShowCreate": false,
                "ShowContextMenu": false,
                "ContextMenu": [""],
                "ContextMenuLabel": [""]
            }
            $scope.serviceableAreaDataDefinition.RowTemplate = '<div>' +
                                                                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                                                              '</div>';
        };
        $scope.serviceableAreaOtherActions = function (action) {
            switch (action) {
                case 'PostEditAction':
                    switch ($scope.modalType) {
                        case 'origin':
                            $scope.truckingItem.OriginServiceableAreaId = $scope.serviceableAreaDataDefinition.DataItem.Id;
                            $scope.truckingItem.ServiceableArea1[0].Name = $scope.serviceableAreaDataDefinition.DataItem.Name;
                            break;
                        case 'destination':
                            $scope.truckingItem.DestinationServiceableAreaId = $scope.serviceableAreaDataDefinition.DataItem.Id;
                            $scope.truckingItem.ServiceableArea[0].Name = $scope.serviceableAreaDataDefinition.DataItem.Name;
                            break;
                    }
                    $scope.closeModal();
                    return true;
                default: return true;
            }
        };

        $scope.initializeServiceableAreaDataDefinition();
    };

    //function that will be invoked during compiling of serviceableArea datagrid to DOM
    $scope.compileServiceableAreaDataGrid = function () {
        var html = '<dir-data-grid2 id="serviceableAreaGrid" datadefinition = "serviceableAreaDataDefinition"' +
                                    'submitdefinition   = "serviceableAreaSubmitDefinition"' +
                                    'otheractions       = "serviceableAreaOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#serviceableAreaContainer')).html(html);
        $compile($content)($scope);
    };
    //=================================================END OF SERVICEABLE AREA MODAL=================================================









    $scope.gridOptionsTruckings = {
        enableSorting: true,
        columnDefs: [
          {
              field: 'No',
              enableSorting: false,
              width: 40,
              enableColumnResizing: true,
              enableColumnMenu: false,
              enableColumnMoving: false,
              cellTemplate: '<div class="ui-grid-cell-contents text-center">{{row.entity.No = (grid.appScope.currentPage == 1 ? (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) : ((grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.currentPage - 1) * grid.appScope.pageSize)))}}</div>'
          },
          { name: 'DocumentNo' },
          { name: 'Trucker', field: 'Trucker.Name' },
          { name: 'Truck', field: 'Truck.PlateNo' },
          { name: 'Driver', field: 'Driver.Name' }
          
        ],
        rowTemplate: '<div>' +
        ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelectedDispatch(row.entity.Id)"  context-menu="grid.appScope.setSelectedDispatch(row.entity.Id)" data-target= "DataTableMenu"></div>' +
        '</div>',
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        },
        enableColumnResizing: true,
        enableGridMenu: true,
        enableSelectAll: true,
        exporterCsvFilename: 'TruckingWB.csv' + Date.now() + '.csv',
        exporterPdfDefaultStyle: { fontSize: 9 },
        exporterPdfTableStyle: { margin: [0, 0, 0, 0] },
        exporterPdfTableHeaderStyle: { fontSize: 12, bold: true, italics: true, color: 'black' },
        exporterPdfHeader: { text: "Fast Cargo", style: 'headerStyle' },
        exporterPdfFooter: function (currentPage, pageCount) {
            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function (docDefinition) {
            docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
            docDefinition.styles.footerStyle = { fontSize: 22, bold: true };
            return docDefinition;
        },
        exporterPdfOrientation: 'landscape',
        exporterPdfPageSize: 'a4',
        exporterPdfMaxGridWidth: 500,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    // LOAD TRUCKINGS DATA WITH STATUS = 10
    $scope.loadDataTruckings = function () {
        $http.get("/api/TruckingsWB")
            .success(function (data, status) {
                for (var i = 0; i < data.length; i++) {
                    // assign Drivers Name - CONCAT
                    data[i].Driver.Name = data[i].Driver.FirstName + ' ' + data[i].Driver.MiddleName + ' ' + data[i].Driver.LastName;
                    // format Created Date
                    data[i].CreatedDateDesc = $filter('date')(data[i].CreatedDate, 'yyyy-MM-dd HH:mm:ss');
                }
                $scope.truckingList = data;
            })
    };

    //close Trucking List Modal
    $scope.closeModalTrucking = function (trucking) {
        if (angular.isDefined(trucking)) {
            $scope.truckingItem = trucking;
            //$scope.trkgDeliveryList = [];
            //$scope.TruckingDeliveries = [];

            for (var i = 0; i < $scope.businessUnitList.length; i++) {
                if ($scope.businessUnitList[i].Id == trucking.OriginServiceableAreaId) {
                    $scope.truckingItem.OriginServiceableAreaName = $scope.businessUnitList[i].Name;
                }
            }

            for (var i = 0; i < $scope.businessUnitList.length; i++) {
                if ($scope.businessUnitList[i].Id == trucking.DestinationServiceableAreaId) {
                    $scope.truckingItem.DestinationServiceableAreaName = $scope.businessUnitList[i].Name;
                }
            }

            for (var i = 0; i < $scope.truckingList.length; i++) {
                if ($scope.truckingList[i].Id == trucking.Id) {
                    $scope.TruckingDeliveries = $scope.truckingList[i].TruckingDeliveries;
                    i = $scope.truckingList.length;
                }
            }
            $scope.trkgDeliveryList = $scope.TruckingDeliveries;
            console.log($scope.trkgDeliveryList);
        }
        jQuery.magnificPopup.close();
    };

    // CLOSE MODAL BUSINESS UNIT FOR ORIGIN
    $scope.closeModalBusinessUnitOrigin = function (buo) {
        if (angular.isDefined(buo)) {
            $scope.truckingItem.OriginServiceableAreaId = buo.Id;
            $scope.truckingItem.OriginServiceableAreaName = buo.Name;
        } else {
            $scope.truckingItem.OriginServiceableAreaId = null;
            $scope.truckingItem.OriginServiceableAreaName = null;
        }
        jQuery.magnificPopup.close();
    }

    // CLOSE MODAL BUSINESS UNIT FOR DESTINATION
    $scope.closeModalBusinessUnitDestination = function (bud) {
        if (angular.isDefined(bud)) {
            $scope.truckingItem.DestinationServiceableAreaId = bud.Id;
            $scope.truckingItem.DestinationServiceableAreaName = bud.Name;
        } else {
            $scope.truckingItem.DestinationServiceableAreaId = null;
            $scope.truckingItem.DestinationServiceableAreaName = null;
        }
        jQuery.magnificPopup.close();
    }

    //function that will be invoked when user click tab
    $scope.setSelectedTab = function (tab) {
        $scope.isError = false;
        $scope.errorMessage = "";
        $scope.selectedTab = tab;
    };

    $scope.setSelectedDispatch = function (id) {
        $scope.selectedDispatchId = id;
    };

    //Triggers when user create, delete, update or view a Shipping Line in the list
    $scope.actionForm = function (action) {
        $scope.actionMode = action;
        $scope.selectedTab = $scope.tabPages[0];
        $scope.isError = false;
        $scope.errorMessage = "";
        switch ($scope.actionMode) {
            case "Create":
                    $scope.viewOnly = false;
                    $scope.submitButtonText = "Submit";
                break;
        }
    };

    $scope.submit = function () {
        switch ($scope.actionMode) {
            case "Create":
                    $scope.focusOnTop();
                    $scope.apiUpdateTruckingWB();
                break;
        }
    }

    // Update
    $scope.apiUpdateTruckingWB = function () {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var dataModel = angular.copy($scope.truckingItem);
        
        delete dataModel.Trucker;
        delete dataModel.Truck;
        delete dataModel.Driver;
        delete dataModel.OriginServiceableAreaName;
        delete dataModel.DestinationServiceableAreaName;
        //delete dataModel.TruckingDeliveries;

        for (var i = 0; i < dataModel.TruckingDeliveries.length; i++) {
            delete dataModel.TruckingDeliveries[i].Shipment;
            delete dataModel.TruckingDeliveries[i].Address1;
            delete dataModel.TruckingDeliveries[i].Customer;
        }

        dataModel.DocumentNo = $scope.truckingItem.DocumentNo;
        dataModel.TruckingStatusId = 20;
        //console.log(dataModel);

        $http.put("/api/TruckingsWB/" + dataModel.Id, dataModel)
             .success(function (data, status) {
                 spinner.stop();
                 $scope.loadData($scope.currentPage);
                 $scope.setSelectedTab("List");
             })
             .error(function (data, status) {
                $scope.showFormError("Error: " + status);
                spinner.stop();
             })
    };

    //manage the error message
    $scope.showFormError = function (message) {
        $scope.isError = true;
        $scope.errorMessage = message;
    };

    //Set the focus on top of the page during load
    $scope.focusOnTop = function () {
        $(document).ready(function () {
            $(this).scrollTop(0);
        });
    };

    //Displays Modal
    $scope.showModal = function (panel, type) {
        openModalPanel(panel);
        $scope.modalType = type;
    };

    // Initialization routines
    var init = function () {
        $scope.focusOnTop();
        $scope.loadTruckingDataGrid();
        $scope.loadTruckingFiltering();

        $scope.truckingResetData()
      
        $scope.initBusinessUnits();
        $scope.addNewBooking();
    };

    init();
};