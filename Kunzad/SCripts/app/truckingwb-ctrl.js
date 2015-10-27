
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
                         Code: null,
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

    // MODAL
    $scope.showModal = function (panel, type) {
        if (panel == '#serviceableArea-list-modal') {
            $scope.loadServiceableAreaDataGrid();
            $scope.loadServiceableAreaFiltering();
            $scope.serviceableAreaFilteringDefinition.SetSourceToNull = true;
            $scope.serviceableAreaDataDefinition.Retrieve = true;
        }
        else {
            $scope.loadDispatchingDataGrid();
            $scope.loadDispatchingFiltering();
            $scope.dispatchingFilteringDefinition.SetSourceToNull = true;
            $scope.dispatchingDataDefinition.Retrieve = true;
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
        if (angular.isDefined($scope.dispatchingDataDefinition)) {
            $scope.dispatchingDataDefinition.DataList = [];
            $scope.dispatchingFilteringDefinition.DataList = [];
            $rootScope.removeElement("dispatchingGrid");
            $rootScope.removeElement("dispatchingFilter");
        }
    }

    //Initialize Address fields
    $scope.initializeAddressField = function (addressItem) {
        $scope.formattedAddress = addressItem.Line1 + (addressItem.Line2 == "" || addressItem.Line2 == null ? " " : ", " + addressItem.Line2) + "\n";
        $scope.formattedAddress += addressItem.CityMunicipality.Name + ", " + (addressItem.CityMunicipality.StateProvince == null ? "" : addressItem.CityMunicipality.StateProvince.Name + "\n");
        $scope.formattedAddress += $scope.country.Name + ", " + addressItem.PostalCode;
        return $scope.formattedAddress;
    };


    //same with rootScope.shipmentObj
    $scope.truckingObj = function () {
        return {
            "Trucking": [{
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

    $scope.serviceableAreaObj = function () {
        return {
            "ServiceableArea": [{
                "Id": null,
                "Name": null,
                "CityMunicipalityId": null,
                "PostalCode": null,
                "IsSerivceable": null,
                "BusinessUnitId": null,
                "CreatedDate": null,
                "LastUpdatedDate": null
            },
            {
                "Id": null,
                "Name": null,
                "CityMunicipalityId": null,
                "PostalCode": null,
                "IsSerivceable": null,
                "BusinessUnitId": null,
                "CreatedDate": null,
                "LastUpdatedDate": null
            }]
        };
    }

    //Retrieve detail
    $scope.loadDetail = function (truckingId) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0;
        $http.get("/api/TruckingDeliveries?truckingId=" + truckingId + "&page=1")
            .success(function (data, status) {
                console.log(data);
                //initialize seafreight shipments
                for (var i = 0; i < data.length; i++) {
                    data[i].Shipment[0] = data[i].Shipment;
                    //origin
                    data[i].Shipment[0].OriginAddress = $scope.initializeAddressField(data[i].Shipment[0].Address1);
                    //destination
                    data[i].Shipment[0].DeliveryAddress = $scope.initializeAddressField(data[i].Shipment[0].Address);

                    $scope.trkgDeliveryList[i] = angular.copy(data[i]);
                }
                $scope.flagOnRetrieveDetails = true;
                spinner.stop();
            })
            .error(function (error, status) {
                $scope.flagOnRetrieveDetails = true;
                $scope.seaFreightIsError = true;
                $scope.seaFreightErrorMessage = status;
                spinner.stop();
            });
    };

    $('#truckerCost', '#internalRevenue', '#costAllocation').priceFormat({
        clearPrefix: true,
        prefix: '',
        centsSeparator: '.',
        thousandsSeparator: ',',
        centsLimit: 2
    });
    $('#createdDate').datetimepicker({
        format: 'mm-dd-YYYY',
        sideBySide: false,
        pickTime: false,
        //minDate: moment()
    })

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
            "DriverName": null,
            "Driver": {
                "Id": null,
                "FirstName": null,
                "MiddleName": null,
                "LastName": null
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
            "LastUpdatedDate": null
        };
       
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
                        $scope.truckingItem.CallTime = $filter('Time')($scope.truckingItem.CallTime);
                        $scope.truckingItem.TruckerCost = $filter('number')($scope.truckingItem.TruckerCost, 2);

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
                "Url": ($scope.truckingDataDefinition.EnablePagination == true ? 'api/TruckingsWB?type=paginate&param1=' + $scope.truckingDataDefinition.CurrentPage : 'api/TruckingsWB?type=scroll&param1=' + $scope.truckingDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value
                "Source": [
                            { "Index": 0, "Label": "Dispatch No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "Document No", "Column": "DocumentNo", "Values": [], "From": null, "To": null, "Type": "ProperCase" },
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
                        $scope.truckingFilteringDefinition.Url = 'api/TruckingsWB?type=paginate&param1=' + $scope.truckingDataDefinition.CurrentPage;
                    }
                    else if ($scope.truckingDataDefinition.EnablePagination == true) {
                        $scope.truckingDataDefinition.DataList = [];
                        $scope.truckingFilteringDefinition.Url = 'api/TruckingsWB?type=paginate&param1=' + $scope.truckingDataDefinition.CurrentPage;
                    }
                        //Scroll
                    else {
                        if ($scope.truckingFilteringDefinition.ClearData)
                            $scope.truckingDataDefinition.DataList = [];
                        $scope.truckingFilteringDefinition.Url = 'api/TruckingsWB?type=scroll&param1=' + $scope.truckingDataDefinition.DataList.length;
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

    //=================================================START OF DISPATCHING MODAL=================================================
    //Load dispatching filtering for compiling
    $scope.loadDispatchingFiltering = function () {
        $scope.initDispatchingFilteringParameters();
        $scope.initDispatchingFilteringContainter();
    };

    //initialize dispatching filtering parameters
    $scope.initDispatchingFilteringContainter = function () {
        html = '<dir-filtering id="dispatchingFilter" filterdefinition="dispatchingFilteringDefinition"' +
                                'filterlistener="dispatchingDataDefinition.Retrieve"' +
                                'otheractions="dispatchingOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#dispatchingFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of business unit filtering to DOM
    $scope.initDispatchingFilteringParameters = function () {
        $scope.initDispatchingFilteringDefinition = function () {
            $scope.dispatchingFilteringDefinition = {
                "Url": ($scope.truckingDataDefinition.EnablePagination == true ? 'api/Truckings?type=paginate&param1=' + $scope.truckingDataDefinition.CurrentPage : 'api/Truckings?type=scroll&param1=' + $scope.truckingDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value
                "Source": [
                            { "Index": 0, "Label": "Dispatch No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "Document No", "Column": "DocumentNo", "Values": [], "From": null, "To": null, "Type": "ProperCase" },
                            { "Index": 2, "Label": "Origin", "Column": "OriginServiceableAreaId", "Values": ['GetServiceableAreaList'], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 3, "Label": "Destination", "Column": "DestinationServiceableAreaId", "Values": ['GetServiceableAreaList'], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 4, "Label": "Created Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 5, "Label": "Last Updated Date", "Column": "LastUpdatedDate", "Values": [], "From": null, "To": null, "Type": "Date" }
                ],//Contains the Criteria definition
                "Multiple": false,
                "AutoLoad": false,
                "ClearData": false,
                "SetSourceToNull": false

            }
        };

        $scope.dispatchingOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.dispatchingSource = $scope.dispatchingFilteringDefinition.Source;
                    //Optional in using this, can use switch if every source type has validation before filtering
                    for (var i = 0; i < $scope.dispatchingSource.length; i++) {
                        if ($scope.dispatchingSource[i].Type == "Date") {
                            $scope.dispatchingFilteringDefinition.DataItem1.Trucking[0][$scope.dispatchingSource[i].Column] = $scope.dispatchingSource[i].From;
                            $scope.dispatchingFilteringDefinition.DataItem1.Trucking[1][$scope.dispatchingSource[i].Column] = $scope.dispatchingSource[i].To;
                        }
                        else
                            $scope.dispatchingFilteringDefinition.DataItem1.Trucking[0][$scope.dispatchingSource[i].Column] = $scope.dispatchingSource[i].From;
                    }

                    if ($scope.dispatchingDataDefinition.EnablePagination == true && $scope.dispatchingFilteringDefinition.ClearData) {
                        $scope.dispatchingDataDefinition.CurrentPage = 1;
                        $scope.dispatchingFilteringDefinition.Url = 'api/Truckings?type=paginate&param1=' + $scope.dispatchingDataDefinition.CurrentPage;
                    }
                    else if ($scope.dispatchingDataDefinition.EnablePagination == true) {
                        $scope.dispatchingDataDefinition.DataList = [];
                        $scope.dispatchingFilteringDefinition.Url = 'api/Truckings?type=paginate&param1=' + $scope.dispatchingDataDefinition.CurrentPage;
                    }
                    //Scroll
                    else {
                        if ($scope.dispatchingFilteringDefinition.ClearData)
                            $scope.dispatchingDataDefinition.DataList = [];
                        $scope.dispatchingFilteringDefinition.Url = 'api/Truckings?type=scroll&param1=' + $scope.dispatchingDataDefinition.DataList.length;
                    }

                    //dispatch
                    $scope.dispatchingFilteringDefinition.DataItem1.Trucking[0].TruckingStatusId == 10;

                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize dispatchingDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize dispatchingDataDefinition DataList by pushing each value of filterDefinition DataList*/
                    //Required
                    //$scope.dispatchingFilteringDefinition.DataList = $rootScope.formatDispatching($scope.dispatchingFilteringDefinition.DataList);
                    if ($scope.dispatchingDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.dispatchingFilteringDefinition.DataList.length; j++)
                            $scope.dispatchingDataDefinition.DataList.push($scope.dispatchingFilteringDefinition.DataList[j]);
                    }

                    if ($scope.dispatchingDataDefinition.EnablePagination == true) {
                        $scope.dispatchingDataDefinition.DataList = [];
                        $scope.dispatchingDataDefinition.DataList = $scope.dispatchingFilteringDefinition.DataList;
                        $scope.dispatchingDataDefinition.DoPagination = true;
                    }
                    return true;
                default: return true;
            }
        };

        $scope.initDispatchingDataItems = function () {
            $scope.dispatchingFilteringDefinition.DataItem1 = angular.copy($scope.truckingObj());
        };

        $scope.initDispatchingFilteringDefinition();
        $scope.initDispatchingDataItems();
    };

    //Load business datagrid for compiling
    $scope.loadDispatchingDataGrid = function () {
        $scope.initDispatchingDataGrid();
        $scope.compileDispatchingDataGrid();
    };

    //initialize dispatching datagrid parameters
    $scope.initDispatchingDataGrid = function () {
        $scope.dispatchingSubmitDefinition = undefined;
        $scope.initializeDispatchingDataDefinition = function () {
            $scope.dispatchingDataDefinition = {
                "Header": ['Document No', 'Dispatch No', 'Dispatch Date', 'Dispatch Time', 'Status', 'Type', 'Plate No', 'Trucker Name', 'Driver First Name', 'Driver Last Name', 'Truck Call Date', 'Truck Call Time', 'No'],
                "Keys": ['DocumentNo', 'Id', 'DispatchDate', 'DispatchTime', 'TruckingStatusId', 'TruckingTypeId', 'Truck.PlateNo', 'Trucker.Name', 'Driver.FirstName', 'Driver.LastName', 'TruckCallDate', 'TruckCallTime'],
                "Type": ['ProperCase', 'ControlNo', 'Date', 'Time', 'TruckingStatus', 'TruckingType', 'ProperCase', 'ProperCase', 'ProperCase', 'ProperCase', 'Date', 'Time'],
                "ColWidth": [150, 150, 150, 150, 100, 100, 150, 150, 150, 150, 150, 150],
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
                "DataTarget": "DispatchingMenu",
                "DataTarget": "DispatchingMenu2",
                "ShowCreate": false,
                "ShowContextMenu": false,
                "ContextMenu": [""],
                "ContextMenuLabel": [""]
            }
            $scope.dispatchingDataDefinition.RowTemplate = '<div>' +
                                                                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                                                              '</div>';
        };
        $scope.dispatchingOtherActions = function (action) {
            switch (action) {
                case 'PostEditAction':
                    //If user choose edit-menu in listing
                  //  if (angular.isDefined($scope.truckingDataDefinition.DataItem.Id) && $scope.truckingItem.Id != $scope.truckingDataDefinition.DataItem.Id) {
                        $scope.truckingDataDefinition.DataList.splice(0, $scope.dispatchingDataDefinition.DataList.length);
                        $scope.truckingItem = angular.copy($scope.dispatchingDataDefinition.DataItem);
                        console.log($scope.truckingItem);
                        $scope.controlNoHolder = $scope.truckingItem.Id;
                        $scope.truckingItem.Id = $rootScope.formatControlNo('', 15, $scope.truckingItem.Id);
                        //$scope.truckingItem.CallDate = $filter('Date')($scope.truckingItem.CallDate);
                        //$scope.truckingItem.CallTime = $filter('Time')($scope.truckingItem.CallTime);
                        $scope.truckingItem.DriverName = $scope.truckingItem.Driver.FirstName + ' ' + $scope.truckingItem.Driver.MiddleName + ' ' + $scope.truckingItem.Driver.LastName;
                        $scope.truckingItem.TruckerCost = $filter('number')($scope.truckingItem.TruckerCost, 2);

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
                                if ($scope.trkgDeliveryList.length > 0)
                                    //Set control no holder in case user will add item in list
                                    $scope.controlNoHolder = $scope.trkgDeliveryList[$scope.trkgDeliveryList.length - 1].Id + 1;

                                else
                                    $scope.truckingResetData();
                            }
                        }, 100);
                 
                    $scope.closeModal();
                    return true;
                default: return true;
            }
        };

        $scope.initializeDispatchingDataDefinition();
    };

    //function that will be invoked during compiling of dispatching datagrid to DOM
    $scope.compileDispatchingDataGrid = function () {
        var html = '<dir-data-grid2 id="dispatchingGrid" datadefinition = "dispatchingDataDefinition"' +
                                    'submitdefinition   = "dispatchingSubmitDefinition"' +
                                    'otheractions       = "dispatchingOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#dispatchingContainer')).html(html);
        $compile($content)($scope);
    };
    //=================================================END OF DISPATCHING MODAL=================================================

    //=====================================START OF SERVICEABLE AREA MODAL/REPORT==============================
    $scope.showServiceableArea = function () {
        openModalPanel2("#serviceableArea-list-modal");
        $scope.loadServiceableAreaDataGrid();
        $scope.loadServiceableAreaFiltering();
        $scope.serviceableAreaFilteringDefinition.SetSourceToNull = true;
        $scope.serviceableAreaDataDefinition.Retrieve = true;
    };

    //Load ServiceableArea filtering for compiling
    $scope.loadServiceableAreaFiltering = function () {
        $scope.initServiceableAreaFilteringParameters();
        $scope.initServiceableAreaFilteringContainter();
    };

    //initialize ServiceableArea filtering parameters
    $scope.initServiceableAreaFilteringContainter = function () {
        html = '<dir-filtering  id="serviceableAreaFilter" filterdefinition="serviceableAreaFilteringDefinition"' +
                                'filterlistener="serviceableAreaDataDefinition.Retrieve"' +
                                'otheractions="serviceableAreaOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#serviceableAreaFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of serviceableArea unit filtering to DOM
    $scope.initServiceableAreaFilteringParameters = function () {
        $scope.initServiceableAreaFilteringDefinition = function () {
            $scope.serviceableAreaFilteringDefinition = {
                "Url": ($scope.serviceableAreaDataDefinition.EnablePagination == true ? 'api/ServiceableAreas?type=paginate&param1=' + $scope.serviceableAreaDataDefinition.CurrentPage : 'api/ServiceableAreas?type=scroll&param1=' + $scope.serviceableAreaDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index
                "Source": [
                            { "Index": 0, "Label": "Name", "Column": "Name", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "City/Municapility", "Column": "CityMunicipality", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 2, "Label": "Postal Code", "Column": "PostalCode", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 3, "Label": "Serviceable?", "Column": "IsServiceable", "Values": [{ "Id": true, "Name": "Yes" }, { "Id": false, "Name": "No" }], "From": null, "To": null, "Type": "DropDown" }
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
                        if ($scope.serviceableAreaSource[i].Column == "CityMunicipality") {
                            $scope.serviceableAreaFilteringDefinition.DataItem1.ServiceableArea[0].CityMunicipality.Name = $scope.serviceableAreaSource[i].From;
                        }
                        else if ($scope.serviceableAreaSource[i].Type == "Date") {
                            $scope.serviceableAreaFilteringDefinition.DataItem1.ServiceableArea[0][$scope.serviceableAreaSource[i].Column] = $scope.serviceableAreaSource[i].From;
                            $scope.serviceableAreaFilteringDefinition.DataItem1.ServiceableArea[1][$scope.serviceableAreaSource[i].Column] = $scope.serviceableAreaSource[i].To;
                        }
                        else
                            $scope.serviceableAreaFilteringDefinition.DataItem1.ServiceableArea[0][$scope.serviceableAreaSource[i].Column] = $scope.serviceableAreaSource[i].From;
                    }
                    //Delete keys that the value is null
                    for (var i = 0; i < $scope.serviceableAreaSource.length; i++) {
                        if ($scope.serviceableAreaFilteringDefinition.DataItem1.ServiceableArea[0][$scope.serviceableAreaSource[i].Column] == null) {
                            delete $scope.serviceableAreaFilteringDefinition.DataItem1.ServiceableArea[0][$scope.serviceableAreaSource[i].Column];
                            delete $scope.serviceableAreaFilteringDefinition.DataItem1.ServiceableArea[1][$scope.serviceableAreaSource[i].Column];
                        }
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
                    $scope.serviceableAreaFilteringDefinition.DataItem1.ServiceableArea[0].Id = 0;
                    $scope.serviceableAreaFilteringDefinition.DataItem1.ServiceableArea[1].Id = 0;
                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize DataList by pushing each value of filterDefinition DataList*/

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
            $scope.serviceableAreaFilteringDefinition.DataItem1 = {
                "ServiceableArea": [
                    { "Id": null, "Name": null, "CityMunicipality": { "Name": null }, "PostalCode": null, "IsServiceable": null },
                    { "Id": null, "Name": null, "CityMunicipality": { "Name": null }, "PostalCode": null, "IsServiceable": null }
                ]
            };
        };

        $scope.initServiceableAreaFilteringDefinition();
        $scope.initServiceableAreaDataItems();
    };

    //Load ServiceableArea datagrid for compiling
    $scope.loadServiceableAreaDataGrid = function () {
        $scope.initServiceableAreaDataGrid();
        $scope.compileServiceableAreaDataGrid();
    };

    //initialize ServiceableArea datagrid parameters
    $scope.initServiceableAreaDataGrid = function () {
        $scope.serviceableAreaSubmitDefinition = undefined;
        $scope.initializeServiceableAreaDataDefinition = function () {
            $scope.serviceableAreaDataDefinition = {
                "Header": ['Name', 'City/Municipality', 'Postal Code', 'Serviceable?', 'No.'],
                "Keys": ['Name', 'CityMunicipality.Name', 'PostalCode', 'IsServiceable'],
                "Type": ['ProperCase', 'ProperCase', 'Default', 'Bit'],
                "ColWidth": [350, 300, 200, 120],
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
                "DataTarget2": "ServiceableAreaMenu2",
                "ShowCreate": false,
                "ShowContextMenu": false,
                "ContextMenu": [""],
                "ContextMenuLabel": [""]
            }
            //Optional if row template
            $scope.serviceableAreaDataDefinition.RowTemplate = '<div>' +
                                                                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
            '</div>';
        };
        $scope.serviceableAreaOtherActions = function (action) {
            switch (action) {
                case 'PostEditAction':
                    if ($scope.modalWatcher == 'originSA') {
                        $scope.truckingItem.ServiceableArea1 = $scope.serviceableAreaDataDefinition.DataItem;
                        $scope.truckingItem.OriginServiceableAreaId = $scope.serviceableAreaDataDefinition.DataItem.Id;
                    }
                    else {
                        $scope.truckingItem.ServiceableArea = $scope.serviceableAreaDataDefinition.DataItem;
                        $scope.truckingItem.DestinationServiceableAreaId = $scope.serviceableAreaDataDefinition.DataItem.Id;
                    }
                    $scope.closeModal();
                    return true;
                default: return true;
            }
        };

        $scope.initializeServiceableAreaDataDefinition();
    };

    //function that will be invoked during compiling of datagrid to DOM
    $scope.compileServiceableAreaDataGrid = function () {
        var html = '<dir-data-grid2 id = "serviceableAreaGrid" datadefinition = "serviceableAreaDataDefinition"' +
                                    'submitdefinition   = "serviceableAreaSubmitDefinition"' +
                                    'otheractions       = "serviceableAreaOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#serviceableAreaContainer')).html(html);
        $compile($content)($scope);
    };
    //=======================================END OF SERVICEABLE AREA MODAL/REPORT==============================



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

     // Initialization routines
    var init = function () {
        $scope.focusOnTop();
        $scope.loadTruckingDataGrid();
        $scope.loadTruckingFiltering();

        $scope.truckingResetData()
     
        $scope.addNewBooking();
    };

    init();
};