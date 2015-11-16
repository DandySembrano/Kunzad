
kunzadApp.controller("TruckingController", TruckingController);
function TruckingController($scope, $http, $interval, $filter, $rootScope, $compile, restAPI) {
    $scope.modelName = "Dispatching";
    $scope.modelhref = "#/trucking";
    $scope.withDirective = true;
    $scope.viewOnly = false;
    $scope.truckingIsError = false;
    $scope.truckingErrorMessage = "";
    $scope.trkgDeliveryList = [];
    $scope.truckTypeList = [];
    $scope.shipmentTypeList = [];
    $scope.serviceList = [];
    $scope.submitButtonText = "Submit";
    $scope.tabPages = ["Information", "List"];
    $scope.selectedTab = "Information";
    $scope.controlNoHolder = 0;
    $scope.modalType = null;
    $scope.truckingToggle = false;
    $scope.enableSave = true;
    $scope.modalWatcher = "";

    //Disable typing
    $('#plateNo,#driverName,#origin,#destination,#shipmentNo,#dispatchdate,#truckcalldate,#dispatchtime,#truckcalltime').keypress(function (key) {
        return false;
    });

    //Initialize Address fields
    $scope.initializeAddressField = function (addressItem) {
        $scope.formattedAddress = addressItem.Line1 + (addressItem.Line2 == "" || addressItem.Line2 == null ? " " : ", " + addressItem.Line2) + "\n";
        $scope.formattedAddress += addressItem.CityMunicipality.Name + ", " + (addressItem.CityMunicipality.StateProvince == null ? "" : addressItem.CityMunicipality.StateProvince.Name + "\n");
        $scope.formattedAddress += $scope.country.Name + ", " + addressItem.PostalCode;
        return $scope.formattedAddress;
    };

    //function that will be invoked when user click tab
    $scope.setSelectedTab = function (tab) {
        $scope.truckingIsError = false;
        $scope.truckingErrorMessage = "";
        $scope.selectedTab = tab;
    };

    //function that will be called during submit
    $scope.submit = function () {
        if ($scope.enableSave) {
            $scope.truckingIsError = false;
            $scope.truckingErrorMessage = "";
            $scope.truckingSubmitDefinition.Submit = true;
        }
    };

    $scope.getTruckTypes = function () {
        //$http.get("api/TruckTypes")
        //.success(function (data, status) {
        //    //For filtering only
            
        //    for (var i = 0; i < data.length; i++)
        //    {
        //        var truckTypeItem = { "Id": null, "Name": null };
        //        truckTypeItem.Id = data[i].Id;
        //        truckTypeItem.Name = data[i].Type;
        //        $scope.truckTypeList.push(truckTypeItem);
        //    }
        //})
        restAPI.retrieve("/api/TruckTypes");
        var promise = $interval(function () {
            if (restAPI.isValid()) {
                $interval.cancel(promise);
                promise = undefined;
                var data = restAPI.getObjData();

                var truckTypeItem = { "Id": null, "Name": null };
                truckTypeItem.Id = data.Id;
                truckTypeItem.Name = data.Type;
                $scope.truckTypeList.push(truckTypeItem);
            }
        }, 100);
    };

    //Close the modal
    $scope.closeModal = function () {
        jQuery.magnificPopup.close();
        if (angular.isDefined($scope.truckDataDefinition)) {
            $scope.truckDataDefinition.DataList = [];
            $scope.truckDataDefinition.DataList = [];
            $rootScope.removeElement("truckGrid");
            $rootScope.removeElement("truckFilter");
        }

        if (angular.isDefined($scope.driverDataDefinition)) {
            $scope.driverDataDefinition.DataList = [];
            $scope.driverFilteringDefinition.DataList = [];
            $rootScope.removeElement("driverGrid");
            $rootScope.removeElement("driverFilter");
        }

        if (angular.isDefined($scope.serviceableAreaDataDefinition)) {
            $scope.serviceableAreaDataDefinition.DataList = [];
            $scope.serviceableAreaDataDefinition.DataList = [];
            $rootScope.removeElement("serviceableAreaGrid");
            $rootScope.removeElement("serviceableAreaFilter");
        }

    };

    //Set TruckingType Value
    $scope.setTruckingType = function (id) {
        for (var i = 0; i < $rootScope.getTruckingTypeList.length; i++) {
            if (id == $rootScope.getTruckingTypeList[i].Id) {
                $scope.truckingItem.TruckingType = $rootScope.getTruckingTypeList[i];
                return true;
            }
        }
    };

    //function that focus on top of the page
    $scope.focusOnTop = function () {
        $(document).ready(function () {
            $(this).scrollTop(0);
        });
    };

    //function that will be triggered when user click add new shipment button
    $scope.addNewBooking = function () {
        if ($scope.trkgDeliveryList.length == 0 ? true : $scope.validateBooking()) {
            $scope.trkgDeliveryList.push(
                 {
                     Id: -1,
                     TruckingId: -1,
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
                         Address: {
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
                     Address: {
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
                     CostAllocation: $filter('number')(0.00, 2),
                     CreatedDate: null,
                     LastUpdatedDate: null,
                     CreatedByUserId: null,
                     LastUpdatedByUserId: null
                 }
            );
        }
    };

    //function that will be triggered when user remove shipment
    $scope.removeBooking = function (index) {
        if ($scope.trkgDeliveryList.length == 1)
            alert('Unable to delete detail, At least 1 detail is required.');
        else
            $scope.trkgDeliveryList.splice(index, 1);
    };

    //Validate if shipment has null values
    $scope.validateBooking = function () {
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
        else { }
        return true;
    };

    //Function that will retrieve of a courier transaction details
    $scope.getTruckingDeliveries = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get('api/TruckingDeliveries?length=' + $scope.trkgDeliveryList.length + '&masterId=' + id)
            .success(function (data, status) {
                for (var i = 0; i < data.length; i++) {
                    data[i].ShipmentId = $rootScope.formatControlNo('', 8, data[i].Shipment.Id);
                    //Initialize Pickup Address
                    data[i].Shipment.OriginAddress = $scope.initializeAddressField(data[i].Shipment.Address1);
                    //Initalize Consignee Address
                    data[i].Shipment.DeliveryAddress = $scope.initializeAddressField(data[i].Shipment.Address);
                    $scope.trkgDeliveryList.push(data[i]);
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

    //====================================TRUCKING FILTERING AND DATAGRID===========================
    //Load trucking datagrid for compiling
    $scope.loadTruckingDataGrid = function () {
        $scope.initTruckingDataGrid();
        $scope.compileTruckingDataGrid();
    };

    //function that will be invoked during compiling datagrid to DOM
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

    //initialize trucking datagrid parameters
    $scope.initTruckingDataGrid = function () {
        $scope.initializeTruckingDataDefinition = function () {
            $scope.truckingDataDefinition = {
                "Header": ['Dispatch No', 'Dispatch Date', 'Dispatch Time', 'Status', 'Type', 'Plate No', 'Trucker Name', 'Driver First Name', 'Driver Last Name', 'Truck Call Date', 'Truck Call Time', 'No'],
                "Keys": [  'Id', 'DispatchDate', 'DispatchTime', 'TruckingStatusId', 'TruckingTypeId', 'Truck.PlateNo', 'Trucker.Name', 'Driver.FirstName', 'Driver.LastName', 'TruckCallDate', 'TruckCallTime'],
                "Type": ['ControlNo', 'Date', 'Time', 'TruckingStatus', 'TruckingType', 'Default', 'ProperCase', 'ProperCase', 'ProperCase', 'Date', 'Time'],
                "ColWidth": [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
                "DataList": [],
                "RequiredFields": ['DispatchDate-Dispatch Date', 'DispatchTime-Dispatch Time', 'TruckingTypeId-Type', 'TruckerId-Trucker Name', 'TruckId-Truck Plate No', 'DriverId-Driver', 'TruckCallDate-Truck Call Date', 'TruckCallTime-Truck Call Time'],
                "CellTemplate": ["None"],
                "RowTemplate": "Default",
                "EnableScroll": true,
                "EnablePagination": false,
                "CurrentPage": 1, //By default
                "PageSize": 20, //Should be the same in back-end
                "DoPagination": false, //By default
                "Retrieve": false, //By default
                "DataItem": {},
                "DataTarget": "TruckingMenu",
                "DataTarget2": "TruckingMenu2",
                "ShowCreate": true,
                "ShowContextMenu": true,
                "ContextMenu": ["'Load'", "'Create'", "'Edit'", "'Delete'", "'View'", "'Find'", "'Clear'"],
                "ContextMenuLabel": ['Reload', 'Create', 'Edit', 'Cancel', 'View', 'Find', 'Clear'],
                "IsDetail": false
            }
        };

        $scope.initializeTruckingSubmitDefinition = function () {
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
                    return true;
                case "PostEditAction":
                    //If user choose edit-menu in listing
                    if (angular.isDefined($scope.truckingDataDefinition.DataItem.Id) && $scope.truckingItem.Id != $scope.truckingDataDefinition.DataItem.Id) {
                        $scope.trkgDeliveryList.splice(0, $scope.trkgDeliveryList.length);
                        $scope.truckingItem = angular.copy($scope.truckingDataDefinition.DataItem);
                        $scope.truckingItem.Id = $rootScope.formatControlNo('', 8, $scope.truckingItem.Id);
                        $scope.truckingItem.DriverName = $scope.truckingItem.Driver.FirstName + "  " + $scope.truckingItem.Driver.MiddleName + "  " + $scope.truckingItem.Driver.LastName;
                        $scope.truckingItem.DispatchDate = $filter('date')($scope.truckingItem.DispatchDate, "MM/dd/yyyy");
                        $scope.truckingItem.TruckCallDate = $filter('date')($scope.truckingItem.TruckCallDate, "MM/dd/yyyy");
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
                        $scope.truckingItem.DriverName = $scope.truckingItem.Driver.FirstName + "  " + $scope.truckingItem.Driver.MiddleName + "  " + $scope.truckingItem.Driver.LastName;
                        $scope.truckingItem.DispatchDate = $filter('date')($scope.truckingItem.DispatchDate, "MM/dd/yyyy");
                        $scope.truckingItem.TruckCallDate = $filter('date')($scope.truckingItem.TruckCallDate, "MM/dd/yyyy");
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
                                $scope.truckingItem.TruckingStatusId = 40;
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
                        $scope.truckingItem.DriverName = $scope.truckingItem.Driver.FirstName + "  " + $scope.truckingItem.Driver.MiddleName + "  " + $scope.truckingItem.Driver.LastName;
                        $scope.truckingItem.DispatchDate = $filter('date')($scope.truckingItem.DispatchDate, "MM/dd/yyyy");
                        $scope.truckingItem.TruckCallDate = $filter('date')($scope.truckingItem.TruckCallDate, "MM/dd/yyyy");

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
                    if (!$scope.validateBooking())
                        return false;
                    $scope.truckingSubmitDefinition.DataItem = angular.copy($scope.truckingItem);
                    return true;
                case "PreSave":
                    $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries = angular.copy($scope.trkgDeliveryList);
                    delete $scope.truckingSubmitDefinition.DataItem.Id;
                    delete $scope.truckingSubmitDefinition.DataItem.Truck;
                    delete $scope.truckingSubmitDefinition.DataItem.Driver;
                    delete $scope.truckingSubmitDefinition.DataItem.Trucker;
                    delete $scope.truckingSubmitDefinition.DataItem.TruckerCost;
                    delete $scope.truckingSubmitDefinition.DataItem.ServiceableArea;
                    delete $scope.truckingSubmitDefinition.DataItem.ServiceableArea1;
                    delete $scope.truckingSubmitDefinition.DataItem.TruckingStatusId;

                    for (var i = 0; i < $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries.length; i++) {
                        delete $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].Id;
                        delete $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].Shipment;
                        delete $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].Customer;
                        delete $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].Address;
                        delete $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].CostAllocation;
                        delete $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].TruckingId;
                    }
                    return true;
                case "PostSave":
                    //Initialize Trucking Transaction Id
                    $scope.truckingItem.Id = $rootScope.formatControlNo('', 8, $scope.truckingSubmitDefinition.DataItem.Id);
                    $scope.truckingItem.TruckingStatusId = $scope.truckingSubmitDefinition.DataItem.TruckingStatusId;

                    //Initialize Trucking Delivery Id
                    for (var i = 0; i < $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries.length; i++)
                        $scope.trkgDeliveryList[i].Id = $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].Id;
                    $scope.viewOnly = true;
                    $scope.truckingSubmitDefinition.Type = "Edit";
                    $scope.enableSave = false;
                    alert("Successfully Saved.");
                    return true;
                case "PreUpdate":
                    $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries = angular.copy($scope.trkgDeliveryList);
                    delete $scope.truckingSubmitDefinition.DataItem.Truck;
                    delete $scope.truckingSubmitDefinition.DataItem.Driver;
                    delete $scope.truckingSubmitDefinition.DataItem.Trucker;
                    delete $scope.truckingSubmitDefinition.DataItem.TruckerCost;
                    delete $scope.truckingSubmitDefinition.DataItem.ServiceableArea;
                    delete $scope.truckingSubmitDefinition.DataItem.ServiceableArea1;

                    for (var i = 0; i < $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries.length; i++) {
                        if ($scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].TruckingId == -1) {
                            delete $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].Id;
                            $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].TruckingId = $scope.truckingItem.Id;
                        }

                        delete $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].CostAllocation;
                        delete $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].Shipment;
                        delete $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].Customer;
                        delete $scope.truckingSubmitDefinition.DataItem.TruckingDeliveries[i].Address;
                    }
                    return true;
                case "PostUpdate":
                    if ($scope.submitButtonText == "Cancel")
                        $scope.truckingOtheractions("FormCreate");
                    $scope.enableSave = false;
                    $scope.viewOnly = true;
                    alert("Successfully Updated.");
                    return true;
                case "PreDelete":
                    return true;
                case "PostDelete":
                    return true;
                case "PostView":
                    $scope.selectedTab = $scope.tabPages[1];
                    return true;
                case "Find":
                    $scope.selectedTab = $scope.tabPages[1];
                    //Animation effect in showing filter directive
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

        $scope.truckingResetData = function () {
            $scope.truckingItem = {
                "Id": null,
                "DocumentNo": 'doc01',
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
                "TruckingType": {
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
                "TruckerCost": null,
                "TruckingStatusId": null,
                "TruckingStatusRemarks": null,
                "TruckCallDate": null,
                "TruckCallTime": null,
                "DispatchDate": $filter('Date')(new Date()),
                "DispatchTime": $filter('Time')(new Date()),
                "CompletedDate": null,
                "CompletedTime": null,
                "CreatedDate": null,
                "LastUpdatedDate": null,
                "CreatedByUserId": null,
                "LastUpdatedByUserId": null
            }
        };

        $scope.truckingShowFormError = function (error) {
            $scope.truckingIsError = true;
            $scope.truckingErrorMessage = error;
        };

        $scope.initializeTruckingDataDefinition();
        $scope.initializeTruckingSubmitDefinition();
    };

    //Load filtering for compiling
    $scope.loadTruckingFiltering = function () {
        $scope.initTruckingFilteringParameters();
        $scope.initTruckingFilteringContainter();
        $("#truckingToggle").slideToggle(function () { });
    };

    //initialize filtering parameters
    $scope.initTruckingFilteringContainter = function () {
        html = '<dir-filtering  filterdefinition="truckingFilteringDefinition"' +
                                'filterlistener="truckingDataDefinition.Retrieve"' +
                                'otheractions="truckingOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#truckingFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of filtering to DOM
    $scope.initTruckingFilteringParameters = function () {
        //Hide the filtering directive
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
                "DataItem1": $scope.DataItem1, //Contains the parameter value index 0
                "Source": [
                            { "Index": 0, "Label": "Dispatch No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "Dispatch Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 2, "Label": "Type", "Column": "TruckingTypeId", "Values": $rootScope.getTruckingStatusList(), "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 3, "Label": "Status", "Column": "TruckingStatusId", "Values": $rootScope.getTruckingTypeList(), "From": null, "To": null, "Type": "DropDown" },
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
                        $scope.truckingFilteringDefinition.DataItem1.Trucking[0][$scope.truckingSource[i].Column] = $scope.truckingSource[i].From;
                        $scope.truckingFilteringDefinition.DataItem1.Trucking[1][$scope.truckingSource[i].Column] = $scope.truckingSource[i].To;
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
                    /*Note: if pagination, initialize truckingDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize truckingDataDefinition DataList by pushing each value of filterDefinition DataList*/
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
                default: return true;
            }
        };

        $scope.initTruckingDataItems = function () {
            $scope.truckingObj = {
                "Trucking": [{
                    "Id": null,
                    "CreatedDate": null,
                    "TruckingStatusId": null,
                    "TruckingTypeId": null
                }, {
                    "Id": null,
                    "CreatedDate": null,
                    "TruckingStatusId": null,
                    "TruckingTypeId": null
                }]
            }
            $scope.truckingFilteringDefinition.DataItem1 = angular.copy($scope.truckingObj);
        };

        $scope.initTruckingFilteringDefinition();
        $scope.initTruckingDataItems();
    };
    //=====================================END OF TRUCKING FILTERING AND DATAGRID===================

    //=====================================START OF TRUCK MODAL/REPORT==============================
    $scope.showTruck = function () {
        openModalPanel2("#truck-list-modal");
        $scope.loadTruckDataGrid();
        $scope.loadTruckFiltering();
        $scope.truckFilteringDefinition.SetSourceToNull = true;
        $scope.truckDataDefinition.Retrieve = true;
    };

    //Load Truck filtering for compiling
    $scope.loadTruckFiltering = function () {
        $scope.initTruckFilteringParameters();
        $scope.initTruckFilteringContainter();
    };

    //initialize Truck filtering parameters
    $scope.initTruckFilteringContainter = function () {
        html = '<dir-filtering  id="truckFilter" filterdefinition="truckFilteringDefinition"' +
                                'filterlistener="truckDataDefinition.Retrieve"' +
                                'otheractions="truckOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#truckFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of truck unit filtering to DOM
    $scope.initTruckFilteringParameters = function () {
        $scope.initTruckFilteringDefinition = function () {
            $scope.truckFilteringDefinition = {
                "Url": ($scope.truckDataDefinition.EnablePagination == true ? 'api/Trucks?type=paginate&param1=' + $scope.truckDataDefinition.CurrentPage : 'api/Trucks?type=scroll&param1=' + $scope.truckDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index
                "Source": [
                            { "Index": 0, "Label": "Plate Number", "Column": "PlateNo", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "Truck Type", "Column": "TruckTypeId", "Values": $scope.truckTypeList, "From": null, "To": null, "Type": "DropDown" }
                ],//Contains the Criteria definition
                "Multiple": false,
                "AutoLoad": false,
                "ClearData": false,
                "SetSourceToNull": false
            }
        };

        $scope.truckOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.truckSource = $scope.truckFilteringDefinition.Source;
                    //Optional in using this, can use switch if every source type has validation before filtering
                    for (var i = 0; i < $scope.truckSource.length; i++) {
                        //if ($scope.truckSource[i].Type == "Date") {
                            $scope.truckFilteringDefinition.DataItem1.Truck[0][$scope.truckSource[i].Column] = $scope.truckSource[i].From;
                            $scope.truckFilteringDefinition.DataItem1.Truck[1][$scope.truckSource[i].Column] = $scope.truckSource[i].To;
                        //}
                        //else
                        //    $scope.truckFilteringDefinition.DataItem1.Truck[0][$scope.truckSource[i].Column] = $scope.truckSource[i].From;
                    }
                    //Delete keys that the value is null
                    for (var i = 0; i < $scope.truckSource.length; i++) {
                        if ($scope.truckFilteringDefinition.DataItem1.Truck[0][$scope.truckSource[i].Column] == null) {
                            delete $scope.truckFilteringDefinition.DataItem1.Truck[0][$scope.truckSource[i].Column];
                            delete $scope.truckFilteringDefinition.DataItem1.Truck[1][$scope.truckSource[i].Column];
                        }
                    }

                    if ($scope.truckDataDefinition.EnablePagination == true && $scope.truckFilteringDefinition.ClearData) {
                        $scope.truckDataDefinition.CurrentPage = 1;
                        $scope.truckFilteringDefinition.Url = 'api/Trucks?type=paginate&param1=' + $scope.truckDataDefinition.CurrentPage;
                    }
                    else if ($scope.truckDataDefinition.EnablePagination == true) {
                        $scope.truckDataDefinition.DataList = [];
                        $scope.truckFilteringDefinition.Url = 'api/Trucks?type=paginate&param1=' + $scope.truckDataDefinition.CurrentPage;
                    }
                        //Scroll
                    else {
                        if ($scope.truckFilteringDefinition.ClearData)
                            $scope.truckDataDefinition.DataList = [];
                        $scope.truckFilteringDefinition.Url = 'api/Trucks?type=scroll&param1=' + $scope.truckDataDefinition.DataList.length;
                    }
                    $scope.truckFilteringDefinition.DataItem1.Truck[0].Id = 0;
                    $scope.truckFilteringDefinition.DataItem1.Truck[1].Id = 0;
                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize DataList by pushing each value of filterDefinition DataList*/

                    if ($scope.truckDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.truckFilteringDefinition.DataList.length; j++)
                            $scope.truckDataDefinition.DataList.push($scope.truckFilteringDefinition.DataList[j]);
                    }

                    if ($scope.truckDataDefinition.EnablePagination == true) {
                        $scope.truckDataDefinition.DataList = [];
                        $scope.truckDataDefinition.DataList = $scope.truckFilteringDefinition.DataList;
                        $scope.truckDataDefinition.DoPagination = true;
                    }
                    return true;
                default: return true;
            }
        };

        $scope.initTruckDataItems = function () {
            $scope.truckFilteringDefinition.DataItem1 = {
                "Truck": [
                    { "Id": null, "PlateNo": null, "TruckTypeId": null },
                    { "Id": null, "PlateNo": null, "TruckTypeId": null }
                ]
            };
        };

        $scope.initTruckFilteringDefinition();
        $scope.initTruckDataItems();
    };

    //Load Truck datagrid for compiling
    $scope.loadTruckDataGrid = function () {
        $scope.initTruckDataGrid();
        $scope.compileTruckDataGrid();
    };

    //initialize Truck datagrid parameters
    $scope.initTruckDataGrid = function () {
        $scope.truckSubmitDefinition = undefined;
        $scope.initializeTruckDataDefinition = function () {
            $scope.truckDataDefinition = {
                "Header": ['Plate No', 'Truck Type', 'Trucker', 'Weight', 'Volume', 'No.'],
                "Keys": ['PlateNo', 'TruckType.Type', 'Trucker.Name', 'WeightCapacity', 'VolumeCapacity'],
                "Type": ['Default', 'ProperCase', 'ProperCase', 'Decimal', 'Decimal'],
                "ColWidth": [200, 200, 200, 200, 200],
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
                "DataTarget": "TruckMenu",
                "DataTarget2": "TruckMenu2",
                "ShowCreate": false,
                "ShowContextMenu": false,
                "ContextMenu": [""],
                "ContextMenuLabel": [""],
                "IsDetail": false
            }
            //Optional if row template
            $scope.truckDataDefinition.RowTemplate = '<div>' +
                                                                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
            '</div>';
        };
        $scope.truckOtherActions = function (action) {
            switch (action) {
                case 'PostEditAction':
                    $scope.truckingItem.Truck.Name = $scope.truckDataDefinition.DataItem.Name;
                    $scope.truckingItem.TruckId = $scope.truckDataDefinition.DataItem.Id;
                    $scope.truckingItem.Truck.PlateNo = $scope.truckDataDefinition.DataItem.PlateNo;
                    $scope.truckingItem.Trucker.Name = $scope.truckDataDefinition.DataItem.Trucker.Name;
                    $scope.truckingItem.TruckerId = $scope.truckDataDefinition.DataItem.Trucker.Id;
                    $scope.closeModal();
                    return true;
                default: return true;
            }
        };

        $scope.initializeTruckDataDefinition();
    };

    //function that will be invoked during compiling of datagrid to DOM
    $scope.compileTruckDataGrid = function () {
        var html = '<dir-data-grid2 id = "truckGrid" datadefinition = "truckDataDefinition"' +
                                    'submitdefinition   = "truckSubmitDefinition"' +
                                    'otheractions       = "truckOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#truckContainer')).html(html);
        $compile($content)($scope);
    };
    //=======================================END OF TRUCK MODAL/REPORT==============================

    //=====================================START OF DRIVER MODAL/REPORT==============================
    $scope.showDriver = function () {
        openModalPanel2("#driver-list-modal");
        $scope.loadDriverDataGrid();
        $scope.loadDriverFiltering();
        $scope.driverFilteringDefinition.SetSourceToNull = true;
        $scope.driverDataDefinition.Retrieve = true;
    };

    //Load Driver filtering for compiling
    $scope.loadDriverFiltering = function () {
        $scope.initDriverFilteringParameters();
        $scope.initDriverFilteringContainter();
    };

    //initialize Driver filtering parameters
    $scope.initDriverFilteringContainter = function () {
        html = '<dir-filtering  id="driverFilter" filterdefinition="driverFilteringDefinition"' +
                                'filterlistener="driverDataDefinition.Retrieve"' +
                                'otheractions="driverOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#driverFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of driver unit filtering to DOM
    $scope.initDriverFilteringParameters = function () {
        $scope.initDriverFilteringDefinition = function () {
            $scope.driverFilteringDefinition = {
                "Url": ($scope.driverDataDefinition.EnablePagination == true ? 'api/Drivers?type=paginate&param1=' + $scope.driverDataDefinition.CurrentPage : 'api/Drivers?type=scroll&param1=' + $scope.driverDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index
                "Source": [
                            { "Index": 0, "Label": "First Name", "Column": "FirstName", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "Middle Name", "Column": "MiddleName", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 2, "Label": "Last Name", "Column": "LastName", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 3, "Label": "License No", "Column": "LicenseNo", "Values": [], "From": null, "To": null, "Type": "Default" }
                ],//Contains the Criteria definition
                "Multiple": false,
                "AutoLoad": false,
                "ClearData": false,
                "SetSourceToNull": false
            }
        };

        $scope.driverOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.driverSource = $scope.driverFilteringDefinition.Source;
                    //Optional in using this, can use switch if every source type has validation before filtering
                    for (var i = 0; i < $scope.driverSource.length; i++) {
                        //if ($scope.driverSource[i].Type == "Date") {
                            $scope.driverFilteringDefinition.DataItem1.Driver[0][$scope.driverSource[i].Column] = $scope.driverSource[i].From;
                            $scope.driverFilteringDefinition.DataItem1.Driver[1][$scope.driverSource[i].Column] = $scope.driverSource[i].To;
                        //}
                        //else
                        //    $scope.driverFilteringDefinition.DataItem1.Driver[0][$scope.driverSource[i].Column] = $scope.driverSource[i].From;
                    }
                    //Delete keys that the value is null
                    for (var i = 0; i < $scope.driverSource.length; i++) {
                        if ($scope.driverFilteringDefinition.DataItem1.Driver[0][$scope.driverSource[i].Column] == null) {
                            delete $scope.driverFilteringDefinition.DataItem1.Driver[0][$scope.driverSource[i].Column];
                            delete $scope.driverFilteringDefinition.DataItem1.Driver[1][$scope.driverSource[i].Column];
                        }
                    }

                    if ($scope.driverDataDefinition.EnablePagination == true && $scope.driverFilteringDefinition.ClearData) {
                        $scope.driverDataDefinition.CurrentPage = 1;
                        $scope.driverFilteringDefinition.Url = 'api/Drivers?type=paginate&param1=' + $scope.driverDataDefinition.CurrentPage;
                    }
                    else if ($scope.driverDataDefinition.EnablePagination == true) {
                        $scope.driverDataDefinition.DataList = [];
                        $scope.driverFilteringDefinition.Url = 'api/Drivers?type=paginate&param1=' + $scope.driverDataDefinition.CurrentPage;
                    }
                        //Scroll
                    else {
                        if ($scope.driverFilteringDefinition.ClearData)
                            $scope.driverDataDefinition.DataList = [];
                        $scope.driverFilteringDefinition.Url = 'api/Drivers?type=scroll&param1=' + $scope.driverDataDefinition.DataList.length;
                    }
                    $scope.driverFilteringDefinition.DataItem1.Driver[0].Id = 0;
                    $scope.driverFilteringDefinition.DataItem1.Driver[1].Id = 0;
                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize DataList by pushing each value of filterDefinition DataList*/

                    if ($scope.driverDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.driverFilteringDefinition.DataList.length; j++)
                            $scope.driverDataDefinition.DataList.push($scope.driverFilteringDefinition.DataList[j]);
                    }

                    if ($scope.driverDataDefinition.EnablePagination == true) {
                        $scope.driverDataDefinition.DataList = [];
                        $scope.driverDataDefinition.DataList = $scope.driverFilteringDefinition.DataList;
                        $scope.driverDataDefinition.DoPagination = true;
                    }
                    return true;
                default: return true;
            }
        };

        $scope.initDriverDataItems = function () {
            $scope.driverFilteringDefinition.DataItem1 = {
                "Driver": [
                    { "Id": null, "FirstName": null, "MiddleName": null, "LastName": null, "LicenseNo": null },
                    { "Id": null, "FirstName": null, "MiddleName": null, "LastName": null, "LicenseNo": null }
                ]
            };
        };

        $scope.initDriverFilteringDefinition();
        $scope.initDriverDataItems();
    };

    //Load Driver datagrid for compiling
    $scope.loadDriverDataGrid = function () {
        $scope.initDriverDataGrid();
        $scope.compileDriverDataGrid();
    };

    //initialize Driver datagrid parameters
    $scope.initDriverDataGrid = function () {
        $scope.driverSubmitDefinition = undefined;
        $scope.initializeDriverDataDefinition = function () {
            $scope.driverDataDefinition = {
                "Header": ['First Name', 'Middle Name', 'Last Name', 'Lincese No', 'No.'],
                "Keys": ['FirstName', 'LastName', 'MiddleName', 'LastName', 'LincenseNo'],
                "Type": ['ProperCase', 'ProperCase', 'ProperCase', 'Default'],
                "ColWidth": [300, 300, 300, 200],
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
                "DataTarget": "DriverMenu",
                "DataTarget2": "DriverMenu2",
                "ShowCreate": false,
                "ShowContextMenu": false,
                "ContextMenu": [""],
                "ContextMenuLabel": [""],
                "IsDetail": false
            }
            //Optional if row template
            $scope.driverDataDefinition.RowTemplate = '<div>' +
                                                                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
            '</div>';
        };
        $scope.driverOtherActions = function (action) {
            switch (action) {
                case 'PostEditAction':
                    $scope.truckingItem.DriverName = $scope.driverDataDefinition.DataItem.FirstName + "  " +  $scope.driverDataDefinition.DataItem.MiddleName + "  " + $scope.driverDataDefinition.DataItem.LastName;
                    $scope.truckingItem.DriverId = $scope.driverDataDefinition.DataItem.Id;
                    $scope.closeModal();
                    return true;
                default: return true;
            }
        };

        $scope.initializeDriverDataDefinition();
    };

    //function that will be invoked during compiling of datagrid to DOM
    $scope.compileDriverDataGrid = function () {
        var html = '<dir-data-grid2 id = "driverGrid" datadefinition = "driverDataDefinition"' +
                                    'submitdefinition   = "driverSubmitDefinition"' +
                                    'otheractions       = "driverOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#driverContainer')).html(html);
        $compile($content)($scope);
    };
    //=======================================END OF DRIVER MODAL/REPORT==============================

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
                "ContextMenuLabel": [""],
                "IsDetail": false
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

    //=====================================SHIPMENT MODAL/REPORT======================================
    $scope.showShipment = function (index) {
        $scope.selectedShipmentIndex = index;
        openModalPanel2("#shipment-list-modal");
        $scope.loadShipmentDataGrid();
        $scope.loadShipmentFiltering();

        $scope.shipmentFilteringDefinition.SetSourceToNull = true;
        $scope.shipmentDataDefinition.Retrieve = true;
    };
    //Load shipment filtering for compiling
    $scope.loadShipmentFiltering = function () {
        $scope.initShipmentFilteringParameters();
        $scope.initShipmentFilteringContainter();
    };

    //initialize shipment filtering parameters
    $scope.initShipmentFilteringContainter = function () {
        html = '<dir-filtering  id="shipmentFilter" filterdefinition="shipmentFilteringDefinition"' +
                                'filterlistener="shipmentDataDefinition.Retrieve"' +
                                'otheractions="shipmentOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#shipmentFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of shipment unit filtering to DOM
    $scope.initShipmentFilteringParameters = function () {
        $scope.initShipmentFilteringDefinition = function () {
            $scope.shipmentFilteringDefinition = {
                "Url": ($scope.shipmentDataDefinition.EnablePagination == true ? 'api/Shipments?type=paginate&param1=' + $scope.shipmentDataDefinition.CurrentPage : 'api/Shipments?type=scroll&param1=' + $scope.shipmentDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index 
                "Source": [
                            { "Index": 0, "Label": "Shipment No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "Booking Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 2, "Label": "Service", "Column": "ServiceId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 3, "Label": "Shipment Type", "Column": "ShipmentTypeId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 4, "Label": "Payment Mode", "Column": "PaymentMode", "Values": $rootScope.getPaymentModeList(), "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 5, "Label": "Target Pickup Date", "Column": "PickupDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 6, "Label": "Status", "Column": "TransportStatusId", "Values": $rootScope.getTransportStatusList(), "From": null, "To": null, "Type": "DropDown" }
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
                        //if ($scope.shipmentSource[i].Type == "Date") {
                            $scope.shipmentFilteringDefinition.DataItem1.Shipment[0][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].From;
                            $scope.shipmentFilteringDefinition.DataItem1.Shipment[1][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].To;
                        //}
                        //else
                        //    $scope.shipmentFilteringDefinition.DataItem1.Shipment[0][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].From;
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
                        $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=paginate&param1=' + $scope.shipmentDataDefinition.CurrentPage;
                    }
                    else if ($scope.shipmentDataDefinition.EnablePagination == true) {
                        $scope.shipmentDataDefinition.DataList = [];
                        $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=paginate&param1=' + $scope.shipmentDataDefinition.CurrentPage;
                    }
                        //Scroll
                    else {
                        if ($scope.shipmentFilteringDefinition.ClearData)
                            $scope.shipmentDataDefinition.DataList = [];
                        $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=scroll&param1=' + $scope.shipmentDataDefinition.DataList.length;
                    }
                    $scope.shipmentFilteringDefinition.DataItem1.Shipment[0].Id = 0;
                    $scope.shipmentFilteringDefinition.DataItem1.Shipment[1].Id = 0;
                    $scope.shipmentFilteringDefinition.DataItem1.Shipment[0].TransportStatusId = 10;
                    return true;
                case 'PostFilterData':
                    /*
                        Note:  if pagination, initialize businessUnitDataDefinition DataList by copying the DataList of filterDefinition then set DoPagination to true
                               if scroll, initialize businessUnitDataDefinition DataList by pushing each value of filterDefinition DataList
                    */
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

                    //Format OrginAddress and Delivery Address
                    for (var i = 0; i < $scope.shipmentDataDefinition.DataList.length; i++) {
                        //Initialize Pickup Address
                        $scope.shipmentDataDefinition.DataList[i].OriginAddress = $scope.initializeAddressField($scope.shipmentDataDefinition.DataList[i].Address1);
                        //Initalize Consignee Address
                        $scope.shipmentDataDefinition.DataList[i].DeliveryAddress = $scope.initializeAddressField($scope.shipmentDataDefinition.DataList[i].Address);
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

        //Initialize filtering service
        var promiseServiceList = $interval(function () {
            if ($scope.serviceList.length > 0) {
                $scope.shipmentFilteringDefinition.Source[2].Values = $scope.serviceList;
                $interval.cancel(promiseServiceList);
                promiseServiceList = undefined;
            }
        }, 100);

        //Initialize filtering shipment type
        var promiseShipmentTypeList = $interval(function () {
            if ($scope.shipmentTypeList.length > 0) {
                $scope.shipmentFilteringDefinition.Source[3].Values = $scope.shipmentTypeList;
                $interval.cancel(promiseShipmentTypeList);
                promiseShipmentTypeList = undefined;
            }
        }, 100);
    };

    //Load shipment datagrid for compiling
    $scope.loadShipmentDataGrid = function () {
        $scope.initShipmentDataGrid();
        $scope.compileShipmentDataGrid();
    };

    //initialize shipment datagrid parameters
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
                "DataTarget": "ShipmentMenu",
                "DataTarget2": "ShipmentMenu2",
                "ShowCreate": false,
                "ShowContextMenu": false,
                "ContextMenu": [""],
                "ContextMenuLabel": [""],
                "IsDetail": false
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
                    for (var i = 0; i < $scope.trkgDeliveryList.length; i++) {
                        if ($scope.trkgDeliveryList[i].ShipmentId == $scope.shipmentDataDefinition.DataItem.Id) {
                            found = true;
                            i = $scope.trkgDeliveryList.length;
                        }
                    }
                    //Check if shipment is not yet in the list
                    if (!found) {
                        var originAddress = $scope.shipmentDataDefinition.DataItem.Address1;
                        var deliveryAddress = $scope.shipmentDataDefinition.DataItem.Address;

                        $scope.trkgDeliveryList[$scope.selectedShipmentIndex].Shipment      = $scope.shipmentDataDefinition.DataItem;
                        $scope.trkgDeliveryList[$scope.selectedShipmentIndex].ShipmentId    = $rootScope.formatControlNo('', 8, $scope.shipmentDataDefinition.DataItem.Id);
                        $scope.trkgDeliveryList[$scope.selectedShipmentIndex].Quantity      = $scope.shipmentDataDefinition.DataItem.Quantity;
                        $scope.trkgDeliveryList[$scope.selectedShipmentIndex].CBM           = $scope.shipmentDataDefinition.DataItem.TotalCBM;
                        $scope.trkgDeliveryList[$scope.selectedShipmentIndex].CustomerId    = $scope.shipmentDataDefinition.DataItem.CustomerId;
                        $scope.trkgDeliveryList[$scope.selectedShipmentIndex].Description   = $scope.shipmentDataDefinition.DataItem.Description;
                        $scope.trkgDeliveryList[$scope.selectedShipmentIndex].DeliverTo     = $scope.shipmentDataDefinition.DataItem.DeliverTo;
                        $scope.trkgDeliveryList[$scope.selectedShipmentIndex].DeliveryAddressId = $scope.shipmentDataDefinition.DataItem.DeliveryAddressId;
                        $scope.trkgDeliveryList[$scope.selectedShipmentIndex].DeliveryDate      = $scope.shipmentDataDefinition.DataItem.DeliveryDate;
                        $scope.trkgDeliveryList[$scope.selectedShipmentIndex].DeliveryTime      = $scope.shipmentDataDefinition.DataItem.DeliveryTime;
                        $scope.trkgDeliveryList[$scope.selectedShipmentIndex].Shipment.OriginAddress    = $scope.initializeAddressField(originAddress);
                        $scope.trkgDeliveryList[$scope.selectedShipmentIndex].Shipment.DeliveryAddress  = $scope.initializeAddressField(deliveryAddress);

                        $scope.truckingIsError = false;
                        $scope.truckingErrorMessage = "";
                    }
                    else {
                        $scope.truckingIsError = true;
                        $scope.truckingErrorMessage = "Shipment is already in the list.";

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
        var html = '<dir-data-grid2 id = "shipmentGrid" datadefinition      = "shipmentDataDefinition"' +
                                    'submitdefinition   = "shipmentSubmitDefinition"' +
                                    'otheractions       = "shipmentOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#shipmentContainer')).html(html);
        $compile($content)($scope);
    };
    //=======================================END OF SHIPMENT MODAL/REPORT==============================

    // Initialization routines
    var init = function () {
        $scope.getTruckTypes();
        $scope.loadTruckingDataGrid();
        $scope.loadTruckingFiltering();
        $scope.addNewBooking();
        $rootScope.manipulateDOM();

        //Initialize Trucking DataItem
        $scope.truckingResetData();

        //init trucking type
        $scope.truckingTypeList = $rootScope.getTruckingTypeList();

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

    //Initialize needed functions during page load
    init();

};