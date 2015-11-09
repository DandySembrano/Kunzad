
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

    //Disable typing
    $('#dispatchId,#origin,#destination').keypress(function (key) {
        return false;
    });
    $('.deliverydate').keypress(function (key) {
        return false;
    });
    $('.deliverytime').keypress(function (key) {
        return false;
    });

    $scope.addNewBooking = function () {
        $scope.trkgDeliveryList.push(
             {
                 Id:null,
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
                 Quantity: 0,
                 CBM: 0,
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
                 DeliveryDate: $filter('Date')(new Date()),
                 DeliveryTime: $filter('Time')(new Date()),
                 CostAllocation: $filter('number')(0.00, 2),
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

    //Validate if shipment has null values
    $scope.validateDetail = function () {
        var currentIndex = $scope.trkgDeliveryList.length - 1;

        if ($scope.trkgDeliveryList[currentIndex].ShipmentId == null) {
            $scope.truckingIsError = true;
            $scope.truckingErrorMessage = "Shipment is required.";
            $scope.focusOnTop();
            return false;
        }
        else if ($scope.trkgDeliveryList[currentIndex].Quantity == null || $scope.trkgDeliveryList[currentIndex].Quantity < 1) {
            $scope.truckingIsError = true;
            $scope.truckingErrorMessage = "Quantity must be greater than 0.";
            $scope.focusOnTop();
            return false;
        }
        else if ($scope.trkgDeliveryList[currentIndex].CBM == null || $scope.trkgDeliveryList[currentIndex].CBM < 1) {
            $scope.truckingIsError = true;
            $scope.truckingErrorMessage = "CBM must be greater than 0.";
            $scope.focusOnTop();
            return false;
        }
        else if ($scope.trkgDeliveryList[currentIndex].DeliveryDate == null) {
            $scope.truckingIsError = true;
            $scope.truckingErrorMessage = "Please input the Delivery Date.";
            $scope.focusOnTop();
            return false;
        }
        else if ($scope.trkgDeliveryList[currentIndex].DeliveryTime == null) {
            $scope.truckingIsError = true;
            $scope.truckingErrorMessage = "Please input the Delivery Time.";
            $scope.focusOnTop();
            return false;
        }

        return true;
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

    //Function that will retrieve the transaction details
    $scope.getTruckingDeliveries = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get('api/TruckingDeliveries?length=' + 0 + '&masterId=' + id)
            .success(function (data, status) {
                for (var i = 0; i < data.length; i++) {
                    data[i].ShipmentId = $rootScope.formatControlNo('', 8, data[i].Shipment.Id);
                    data[i].CostAllocation = $filter('number')(data[i].CostAllocation, 2);
                    //Initialize Pickup Address
                    data[i].Shipment.OriginAddress = $scope.initializeAddressField(data[i].Shipment.Address1);
                    //Initalize Consignee Address
                    data[i].Shipment.DeliveryAddress = $scope.initializeAddressField(data[i].Shipment.Address);

                    $scope.trkgDeliveryList = angular.copy(data);
                }

                $scope.flagOnRetrieveDetails = true;
                spinner.stop();
            })
            .error(function (error, status) {
                $scope.flagOnRetrieveDetails = true;
                $scope.truckingIsError = true;
                $scope.truckingErrorMessage = status;
                spinner.stop();
            })
    };

    $('#truckerCost,#revenue,.costAllocation').priceFormat({
        clearPrefix: true,
        prefix: '',
        centsSeparator: '.',
        thousandsSeparator: ',',
        centsLimit: 2
    });

    $('#createdDate').datetimepicker({
        format: 'MM-DD-YYYY',
        sideBySide: false,
        pickTime: false,
        //minDate: moment()
    });

    $('.deliveryDate').datetimepicker({
        format: 'MM-DD-YYYY',
        sideBySide: false,
        pickTime: false,
        //minDate: moment()
    });

    $('.deliveryTime').datetimepicker({
        format: 'HH:mm',
        sideBySide: false,
        pickTime: false,
        //minDate: moment()
    });

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
            "TruckingTypeId": null,
            "TruckingType": null,
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
            "TruckerCost": $filter('number')(0.00, 2),
            "InternalRevenue": $filter('number')(0.00, 2),
            "TruckingStatusId": null,
            "TruckingStatusRemarks": null,
            "TruckCallDate": null,
            "TruckCallTime": null,
            "DispatchDate": null,
            "DispatchTime": null,
            "CompletedDate": null,
            "CompletedTime": null,
            "CreatedDate": null,
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null
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
                "APIUrl": '/api/TruckingsWB',
                "Type": 'Create', //By Default
                "DataItem": {},
                "Index": -1 //By Default
            }
        };

        $scope.truckingOtheractions = function (action) {
            switch (action) {
                case "FormCreate":
                    $scope.submitButtonText = "Submit";
                    $scope.truckingSubmitDefinition.Type = "Create";
                    $scope.selectedTab = $scope.tabPages[0];
                    $scope.truckingResetData();
                    $scope.trkgDeliveryList.splice(0, $scope.trkgDeliveryList.length);
                    $scope.addNewBooking();
                    $scope.enableSave = true;
                    $scope.viewOnly = false;
                    return true;
                case "PreAction":
                    return true;
                case "PostCreateAction":
                    $scope.submitButtonText = "Submit";
                    $scope.truckingSubmitDefinition.Type = "Create";
                    $scope.selectedTab = $scope.tabPages[0];
                    $scope.truckingResetData();
                    $scope.trkgDeliveryList.splice(0, $scope.trkgDeliveryList.length);
                    $scope.addNewBooking();
                    $scope.enableSave = true;
                    $scope.viewOnly = false;
                case "PostEditAction":
                    if (angular.isDefined($scope.truckingDataDefinition.DataItem.Id) && $scope.truckingItem.Id != $scope.truckingDataDefinition.DataItem.Id) {
                        $scope.trkgDeliveryList.splice(0, $scope.trkgDeliveryList.length);
                        $scope.truckingItem = angular.copy($scope.truckingDataDefinition.DataItem);
                        $scope.truckingItem.Id = $rootScope.formatControlNo('', 8, $scope.truckingItem.Id);
                        $scope.truckingItem.TruckingType = $filter('TruckingType')($scope.truckingItem.TruckingTypeId);
                        $scope.truckingItem.DriverName = $scope.truckingItem.Driver.FirstName + "  " + $scope.truckingItem.Driver.MiddleName + "  " + $scope.truckingItem.Driver.LastName;
                        $scope.truckingItem.DispatchDate = $filter('date')($scope.truckingItem.DispatchDate, "MM/dd/yyyy");
                        $scope.truckingItem.TruckCallDate = $filter('date')($scope.truckingItem.TruckCallDate, "MM/dd/yyyy");
                        $scope.truckingItem.TruckerCost = document.getElementById('truckerCost').value; //$filter('number')($scope.truckingItem.TruckerCost, 2);
                        $scope.truckingItem.InternalRevenue = document.getElementById('revenue').value; //$filter('number')($scope.truckingItem.InternalRevenue, 2);
                        $scope.getTruckingDeliveries($scope.truckingItem.Id);
                        var promise = $interval(function () {
                            if ($scope.flagOnRetrieveDetails) {
                                $scope.flagOnRetrieveDetails = false;
                                $interval.cancel(promise);
                                promise = undefined;
                                $scope.viewOnly = false;
                                $scope.submitButtonText = "Submit";
                                $scope.selectedTab = $scope.tabPages[0];
                                $scope.truckingSubmitDefinition.Type = "Edit";
                                if ($scope.trkgDeliveryList.length == 0)
                                    $scope.addNewBooking();
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
                    //If user choose cancel-menu in listing
                    if (angular.isDefined($scope.truckingDataDefinition.DataItem.Id) && $scope.truckingItem.Id != $scope.truckingDataDefinition.DataItem.Id) {
                        $scope.trkgDeliveryList.splice(0, $scope.trkgDeliveryList.length);
                        $scope.truckingItem = angular.copy($scope.truckingDataDefinition.DataItem);
                        $scope.truckingItem.Id = $rootScope.formatControlNo('', 8, $scope.truckingItem.Id);
                        $scope.truckingItem.TruckingType = $filter('TruckingType')($scope.truckingItem.TruckingTypeId);
                        $scope.truckingItem.DriverName = $scope.truckingItem.Driver.FirstName + "  " + $scope.truckingItem.Driver.MiddleName + "  " + $scope.truckingItem.Driver.LastName;
                        $scope.truckingItem.DispatchDate = $filter('date')($scope.truckingItem.DispatchDate, "MM/dd/yyyy");
                        $scope.truckingItem.TruckerCost = $filter('number')($scope.truckingItem.TruckerCost, 2);
                        $scope.truckingItem.InternalRevenue = $filter('number')($scope.truckingItem.InternalRevenue, 2);
                        $scope.getTruckingDeliveries($scope.truckingItem.Id);
                        var promise = $interval(function () {
                            if ($scope.flagOnRetrieveDetails) {
                                $scope.flagOnRetrieveDetails = false;
                                $interval.cancel(promise);
                                promise = undefined;
                                $scope.viewOnly = true;
                                $scope.submitButtonText = "Cancel";
                                $scope.selectedTab = $scope.tabPages[0];
                                $scope.truckingSubmitDefinition.Type = "Edit";
                                //for cancellation
                                $scope.truckingItem.TruckingStatusId = 10;
                                if ($scope.trkgDeliveryList.length == 0)
                                    $scope.addNewBooking();
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
                    //If user choose view-menu in listing
                    if (angular.isDefined($scope.truckingDataDefinition.DataItem.Id) && $scope.truckingItem.Id != $scope.truckingDataDefinition.DataItem.Id) {
                        $scope.trkgDeliveryList.splice(0, $scope.trkgDeliveryList.length);
                        $scope.truckingItem = angular.copy($scope.truckingDataDefinition.DataItem);
                        $scope.truckingItem.Id = $rootScope.formatControlNo('', 8, $scope.truckingItem.Id);
                        $scope.truckingItem.TruckingType = $filter('TruckingType')($scope.truckingItem.TruckingTypeId);
                        $scope.truckingItem.DriverName = $scope.truckingItem.Driver.FirstName + "  " + $scope.truckingItem.Driver.MiddleName + "  " + $scope.truckingItem.Driver.LastName;
                        $scope.truckingItem.DispatchDate = $filter('date')($scope.truckingItem.DispatchDate, "MM/dd/yyyy");
                        $scope.truckingItem.TruckCallDate = $filter('date')($scope.truckingItem.TruckCallDate, "MM/dd/yyyy");
                        $scope.truckingItem.TruckerCost = $filter('number')($scope.truckingItem.TruckerCost, 2);
                        $scope.truckingItem.InternalRevenue = $filter('number')($scope.truckingItem.InternalRevenue, 2);
                        $scope.getTruckingDeliveries($scope.truckingItem.Id);
                        var promise = $interval(function () {
                            if ($scope.flagOnRetrieveDetails) {
                                $scope.flagOnRetrieveDetails = false;
                                $interval.cancel(promise);
                                promise = undefined;
                                $scope.viewOnly = true;
                                $scope.submitButtonText = "Close";
                                $scope.selectedTab = $scope.tabPages[0];
                                $scope.truckingSubmitDefinition.Type = "View";
                                if ($scope.trkgDeliveryList.length == 0)
                                    $scope.addNewBooking();
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
                    if (!$scope.validateDetail())
                        return false;
                    $scope.truckingSubmitDefinition.DataItem = angular.copy($scope.truckingItem);
                    return true;
                case "PreSave":
                    $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries = angular.copy($scope.trkgDeliveryList);
                    delete $scope.truckingSubmitDefinition.DataItem.Truck;
                    delete $scope.truckingSubmitDefinition.DataItem.Driver;
                    delete $scope.truckingSubmitDefinition.DataItem.Trucker;
                    delete $scope.truckingSubmitDefinition.DataItem.ServiceableArea;
                    delete $scope.truckingSubmitDefinition.DataItem.ServiceableArea1;

                    for (var i = 0; i < $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries.length; i++) {
                        delete $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].Shipment;
                        delete $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].Customer;
                        delete $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].Address;
                    }
                    return true;
                case "PostSave":
                    $scope.viewOnly = true;
                    $scope.truckingSubmitDefinition.Type = "Edit";
                    $scope.enableSave = false;
                    //initialize trucking status = Waybill; This will help if the user will edit the newly saved transaction.
                    $scope.truckingItem.TruckingStatusId = 20;
                    alert("Successfully Saved.");
                    return true;
                case "PreUpdate":
                    $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries = angular.copy($scope.trkgDeliveryList);
                    delete $scope.truckingSubmitDefinition.DataItem.Truck;
                    delete $scope.truckingSubmitDefinition.DataItem.Driver;
                    delete $scope.truckingSubmitDefinition.DataItem.Trucker;
                    delete $scope.truckingSubmitDefinition.DataItem.ServiceableArea;
                    delete $scope.truckingSubmitDefinition.DataItem.ServiceableArea1;

                    for (var i = 0; i < $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries.length; i++) {
                        delete $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].Shipment;
                        delete $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].Customer;
                        delete $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].Address;
                    }
                    return true;
                case "PostUpdate":
                    $scope.viewOnly = true;
                    if ($scope.submitButtonText == "Cancel")
                    {
                        $scope.truckingOtheractions("FormCreate");
                        $scope.viewOnly = false;
                    }
                    $scope.enableSave = false;

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
                            { "Index": 2, "Label": "Dispatch Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 3, "Label": "Origin", "Column": "OriginServiceableAreaId", "Values": ['GetServiceableAreaList'], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 4, "Label": "Destination", "Column": "DestinationServiceableAreaId", "Values": ['GetServiceableAreaList'], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 5, "Label": "Type", "Column": "TruckingTypeId", "Values": $rootScope.getTruckingTypeList(), "From": null, "To": null, "Type": "DropDown" },
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
                    //retrieve trucking data with status = WAYBILL
                    $scope.truckingFilteringDefinition.DataItem1.Trucking[0].TruckingStatusId = 20;

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
                "Url": ($scope.dispatchingDataDefinition.EnablePagination == true ? 'api/Truckings?type=paginate&param1=' + $scope.dispatchingDataDefinition.CurrentPage : 'api/Truckings?type=scroll&param1=' + $scope.dispatchingDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value
                "Source": [
                            { "Index": 0, "Label": "Dispatch No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "Document No", "Column": "DocumentNo", "Values": [], "From": null, "To": null, "Type": "ProperCase" },
                            { "Index": 2, "Label": "Dispatch Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 3, "Label": "Origin", "Column": "OriginServiceableAreaId", "Values": ['GetServiceableAreaList'], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 4, "Label": "Destination", "Column": "DestinationServiceableAreaId", "Values": ['GetServiceableAreaList'], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 5, "Label": "Created Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 6, "Label": "Last Updated Date", "Column": "LastUpdatedDate", "Values": [], "From": null, "To": null, "Type": "Date" }
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

                    //get all truckings data where truckingStatus is DISPATCH
                    $scope.dispatchingFilteringDefinition.DataItem1.Trucking[0].TruckingStatusId = 10;

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
                "Header": ['Document No', 'Dispatch No', 'Dispatch Date', 'Dispatch Time', 'Status',           'Type',           'Plate No',      'Trucker Name', 'Driver First Name', 'Driver Last Name', 'Truck Call Date', 'Truck Call Time', 'No'],
                "Keys": [  'DocumentNo',  'Id',          'DispatchDate',  'DispatchTime',  'TruckingStatusId', 'TruckingTypeId', 'Truck.PlateNo', 'Trucker.Name', 'Driver.FirstName',  'Driver.LastName', 'TruckCallDate', 'TruckCallTime'],
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
                        $scope.controlNoHolder = $scope.truckingItem.Id;
                        $scope.truckingItem.Id = $rootScope.formatControlNo('', 8, $scope.truckingItem.Id);
                        //$scope.truckingItem.CallDate = $filter('Date')($scope.truckingItem.CallDate);
                        //$scope.truckingItem.CallTime = $filter('Time')($scope.truckingItem.CallTime);
                        $scope.truckingItem.DriverName = $scope.truckingItem.Driver.FirstName + ' ' + $scope.truckingItem.Driver.MiddleName + ' ' + $scope.truckingItem.Driver.LastName;
                        $scope.truckingItem.TruckerCost = $filter('number')($scope.truckingItem.TruckerCost, 2);
                        $scope.truckingItem.TruckingType = $filter('TruckingType')($scope.truckingItem.TruckingTypeId);
                        $scope.getTruckingDeliveries($scope.truckingItem.Id);
                        var promise = $interval(function () {
                            if ($scope.flagOnRetrieveDetails) {
                                $scope.flagOnRetrieveDetails = false;
                                $interval.cancel(promise);
                                promise = undefined;
                                $scope.viewOnly = false;
                                $scope.submitButtonText = "Submit";
                                $scope.selectedTab = $scope.tabPages[0];
                                $scope.truckingSubmitDefinition.Type = "Create";
                                if ($scope.trkgDeliveryList.length == 0)
                                    $scope.addNewBooking();
                            }
                        }, 100);
                        $scope.enableSave = true;
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
                    switch ($scope.modalType) {
                        case 'origin':
                            $scope.truckingItem.ServiceableArea1 = $scope.serviceableAreaDataDefinition.DataItem;
                            $scope.truckingItem.OriginServiceableAreaId = $scope.serviceableAreaDataDefinition.DataItem.Id;
                            break;
                        case 'destination':
                            $scope.truckingItem.ServiceableArea = $scope.serviceableAreaDataDefinition.DataItem;
                            $scope.truckingItem.DestinationServiceableAreaId = $scope.serviceableAreaDataDefinition.DataItem.Id;
                            break;
                    }
                    $scope.closeModal();
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

    //function that will be called during submit
    $scope.submit = function () {
        if ($scope.enableSave) {
            $scope.truckingIsError = false;
            $scope.truckingErrorMessage = "";
            $scope.truckingSubmitDefinition.Submit = true;
        }
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

        if ($scope.truckingFilteringDefinition.AutoLoad == true)
            $scope.truckingDataDefinition.Retrieve = true;
    };

    var listener = $interval(function () {
        //For responsive modal
        var width = window.innerWidth;
        if (width < 1030) {
            $scope.modalStyle = "height:520px; max-height:100%";
        }
        else {
            $scope.modalStyle = "height:450px; max-height:100%";
        }
    }, 100);

    $scope.listener = function () {
        $interval.cancel(listener);
        listener = undefined;
    };

    $scope.$on('$destroy', function () {
        $scope.listener();
    });


    init();
};