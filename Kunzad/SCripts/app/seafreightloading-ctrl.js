kunzadApp.controller("SeaFreightLoadingController", function ($rootScope, $scope, $http, $interval, $compile, $filter) {
    $scope.modelName = "Sea Freight Loading";
    $scope.modelhref = "#/seafreightloading";
    $scope.withDirective = true;
    $scope.checkinItem = {};
    $scope.viewOnly = false;
    $scope.checkInIsError = false;
    $scope.checkInErrorMessage = "";
    $scope.submitButtonText = "Submit";
    $scope.tabPages = ["Information", "List"];
    $scope.selectedTab = "Information";
    $scope.controlNoHolder = 0;
    $scope.checkInToggle = false;
    $scope.checkInDetailsToggle = false;
    $scope.checkInTypeList = [];
    $scope.checkInShipmentHolder = [];
    $scope.controlNoHolder = 0;
    $scope.flagOnRetrieveDetails = false;
    $scope.enableSave = true;
    $scope.modalWatcher = "";

    //function that will be invoked when user click tab
    $scope.setSelectedTab = function (tab) {
        $scope.checkInIsError = false;
        $scope.checkInErrorMessage = "";
        $scope.selectedTab = tab;
    };

    //function that will be called during submit
    $scope.submit = function () {
        if ($scope.enableSave) {
            $scope.checkInIsError = false;
            $scope.checkInErrorMessage = "";
            $scope.checkInSubmitDefinition.Submit = true;
        }
    };

    //Close the modal
    $scope.closeModal = function () {
        jQuery.magnificPopup.close();
        //if (angular.isDefined($scope.courierDataDefinition)) {
        //    $scope.courierDataDefinition.DataList = [];
        //    $scope.courierFilteringDefinition.DataList = [];
        //    $rootScope.removeElement("courierGrid");
        //    $rootScope.removeElement("courierFilter");
        //}

        //if (angular.isDefined($scope.businessUnitDataDefinition)) {
        //    $scope.businessUnitDataDefinition.DataList = [];
        //    $scope.businessUnitFilteringDefinition.DataList = [];
        //    $rootScope.removeElement("businessUnitGrid");
        //    $rootScope.removeElement("businessUnitFilter");
        //}

        //if (angular.isDefined($scope.shipmentDataDefinition)) {
        //    $scope.shipmentDataDefinition.DataList = [];
        //    $scope.shipmentFilteringDefinition.DataList = [];
        //    $rootScope.removeElement("shipmentGrid");
        //    $rootScope.removeElement("shipmentFilter");
        //}
    };

    //function that focus on top of the page
    $scope.focusOnTop = function () {
        $(document).ready(function () {
            $(this).scrollTop(0);
        });
    };

    //Initialize Payment Mode List for DropDown
    $scope.initCheckInTypeList = function () {
        $http.get("/api/CheckInTypes")
        .success(function (data, status) {
            $scope.checkInTypeList = data;
        })
    };

    $scope.initPaymentModeList = function () {
        $scope.paymentModeList = $rootScope.getPaymentModeList();
    };

    //Initialize Service List for DropDown
    $scope.initServiceList = function () {
        $http.get("/api/Services")
        .success(function (data, status) {
            $scope.serviceList = data;
        })
    };

    //Initialize Shipment Type List for DropDown
    $scope.initShipmentTypeList = function () {
        $http.get("/api/ShipmentTypes")
        .success(function (data, status) {
            $scope.shipmentTypeList = [];
            $scope.shipmentTypeList = data;
        })
    };

    //get sea freight shipments
    $scope.fetchShipment = function () {
        //if ($scope.checkInShipmentsDataDefinition.DataList.length > 0) {
        //    $scope.checkInShipmentsDataDefinition.DataList = [];
        //}
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get('/api/SeaFreightShipments?blno=' + $scope.checkInItem.CheckInSourceId)
        .success(function (data, status) {
            if (data.status == "SUCCESS") {
                for (var i = 0; i < data.objParam1.length; i++) {
                    //Initialize Pickup Address
                    data.objParam1[i].Shipment.OriginAddress = $scope.initializeAddressField(data.objParam1[i].Shipment.Address1);
                    //Initalize Consignee Address
                    data.objParam1[i].Shipment.DeliveryAddress = $scope.initializeAddressField(data.objParam1[i].Shipment.Address);
                    $scope.checkInShipmentsDataDefinition.DataList.push($scope.checkInShipmentsItem);
                    $scope.checkInShipmentsDataDefinition.DataList[i] = angular.copy(data.objParam1[i]);
                }
                $scope.checkInIsError = false;
                $scope.checkInErrorMessage = "";
                spinner.stop();
            }
            else {
                $scope.checkInIsError = true;
                $scope.checkInErrorMessage = data.message;
                spinner.stop();
            }
        })
        .error(function (error, status) {
            $scope.checkInIsError = true;
            $scope.checkInErrorMessage = error;
            spinner.stop();
        })
    };

    //Initialize Address fields
    $scope.initializeAddressField = function (addressItem) {
        $scope.formattedAddress = addressItem.Line1 + (addressItem.Line2 == "" || addressItem.Line2 == null ? " " : ", " + addressItem.Line2) + "\n";
        $scope.formattedAddress += addressItem.CityMunicipality.Name + ", " + (addressItem.CityMunicipality.StateProvince == null ? "" : addressItem.CityMunicipality.StateProvince.Name + "\n");
        $scope.formattedAddress += $scope.country.Name + ", " + addressItem.PostalCode;
        return $scope.formattedAddress;
    };

    $scope.removeCheckInShipment = function () {
        $scope.checkInShipmentsDataDefinition.DataList = [];
    };

    //Function that will retrieve of a courier transaction details
    $scope.getCheckInShipments = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get('/api/CheckInShipments?length=' + $scope.checkInShipmentsDataDefinition.DataList.length + '&masterId=' + id)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    for (var i = 0; i < data.objParam1.length; i++) {
                        //Initialize Pickup Address
                        data.objParam1[i].Shipment.OriginAddress = $scope.initializeAddressField(data.objParam1[i].Shipment.Address1);
                        //Initalize Consignee Address
                        data.objParam1[i].Shipment.DeliveryAddress = $scope.initializeAddressField(data.objParam1[i].Shipment.Address);
                        $scope.checkInShipmentsDataDefinition.DataList.push($scope.checkInShipmentsItem);
                        $scope.checkInShipmentsDataDefinition.DataList[i] = angular.copy(data.objParam1[i]);
                    }
                }
                else {
                    $scope.courierDeliveryIsError = true;
                    $scope.courierDeliveryErrorMessage = data.message;
                }

                $scope.flagOnRetrieveDetails = true;
                spinner.stop();
            })
            .error(function (error, status) {
                $scope.flagOnRetrieveDetails = true;
                $scope.courierDeliveryIsError = true;
                $scope.courierDeliveryErrorMessage = status;
                spinner.stop();
            })
    };

    //Disable typing
    $('#checkindate,#checkintime,#shipmentId').keypress(function (key) {
        return false;
    });

    $('#checkindate').datetimepicker({
        format: 'MM-DD-YYYY',
        sideBySide: false,
        pickTime: false,
        //minDate: moment()
    });

    $('#checkintime').datetimepicker({
        format: 'HH:mm',
        sideBySide: false,
        pickDate: false
    });

    //====================================CHECK-IN FILTERING AND DATAGRID==========================
    //Load checkIn datagrid for compiling
    $scope.loadCheckInDataGrid = function () {
        $scope.initCheckInDataGrid();
        $scope.compileCheckInDataGrid();
    };

    //function that will be invoked during compiling datagrid to DOM
    $scope.compileCheckInDataGrid = function () {
        var html = '<dir-data-grid2 datadefinition      = "checkInDataDefinition"' +
                                    'submitdefinition   = "checkInSubmitDefinition"' +
                                    'otheractions       = "checkInOtheractions(action)"' +
                                    'resetdata          = "checkInResetData()"' +
                                    'showformerror      = "checkInShowFormError(error)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#checkInContainer')).html(html);
        $compile($content)($scope);
    };

    //initialize checkIn datagrid parameters
    $scope.initCheckInDataGrid = function () {
        $scope.initializeCheckInDataDefinition = function () {
            $scope.checkInDataDefinition = {
                "Header": ['Transaction No', 'Status', 'BL Number', 'Check-In Date', 'Check-In Time', 'Business Unit', 'Remarks', 'No.'],
                "Keys": ['Id', 'Status', 'CheckInSourceId', 'CheckInDate', 'CheckInTime', 'BusinessUnit.Name', 'Remarks'],
                "Type": ['ControlNo', 'TransportStatus', 'Default', 'Date', 'Time', 'ProperCase', 'Default'],
                "ColWidth": [150, 150, 150, 150, 150, 200, 400],
                "DataList": [],
                "RequiredFields": ['CheckInSourceId-BL Number', 'CheckInDate-Check In Date', 'CheckInTime-Check In Time', 'CheckInBusinessUnitId-Business Unit'],
                "CellTemplate": ["None"],
                "RowTemplate": "Default",
                "EnableScroll": true,
                "EnablePagination": false,
                "CurrentPage": 1, //By default
                "PageSize": 20, //Should be the same in back-end
                "DoPagination": false, //By default
                "Retrieve": false, //By default
                "DataItem": {},
                "DataTarget": "CheckInMenu",
                "DataTarget2": "CheckInMenu2",
                "ShowCreate": true,
                "ShowContextMenu": true,
                "ContextMenu": ["'Load'", "'Create'", "'Edit'", "'Delete'", "'View'", "'Find'", "'Clear'"],
                "ContextMenuLabel": ['Reload', 'Create', 'Edit', 'Cancel', 'View', 'Find', 'Clear'],
                "IsDetail": false
            }
        };

        $scope.initializeCheckInSubmitDefinition = function () {
            $scope.checkInSubmitDefinition = {
                "Submit": false, //By default
                "APIUrl": '/api/CheckIns',
                "Type": 'Create', //By Default
                "DataItem": {},
                "Index": -1 //By Default
            }
        };

        $scope.checkInOtheractions = function (action) {
            switch (action) {
                case "FormCreate":
                    $scope.submitButtonText = "Submit";
                    $scope.checkInSubmitDefinition.Type = "Create";
                    $scope.selectedTab = $scope.tabPages[0];
                    $scope.checkInResetData();
                    $scope.checkInShipmentsDataDefinition.DataList.splice(0, $scope.checkInShipmentsDataDefinition.DataList.length);
                    //$scope.checkInDetailsResetData();
                    $scope.enableSave = true;
                    $scope.viewOnly = false;
                    return true;
                case "PreAction":
                    return true;
                case "PostCreateAction":
                    $scope.submitButtonText = "Submit";
                    $scope.checkInSubmitDefinition.Type = "Create";
                    $scope.selectedTab = $scope.tabPages[0];
                    $scope.checkInResetData();
                    $scope.checkInShipmentsDataDefinition.DataList.splice(0, $scope.checkInShipmentsDataDefinition.DataList.length);
                    //$scope.checkInDetailsResetData();
                    $scope.enableSave = true;
                    $scope.viewOnly = false;
                    return true;
                case "PostEditAction":
                    //If user choose edit-menu in listing
                    if (angular.isDefined($scope.checkInDataDefinition.DataItem.Id) && $scope.checkInItem.Id != $scope.checkInDataDefinition.DataItem.Id) {
                        $scope.checkInShipmentsDataDefinition.DataList.splice(0, $scope.checkInShipmentsDataDefinition.DataList.length);
                        $scope.checkInItem = angular.copy($scope.checkInDataDefinition.DataItem);
                        $scope.checkInItem.CheckInDate = $filter('date')($scope.checkInItem.CheckInDate, "MM/dd/yyyy");
                        $scope.controlNoHolder = $scope.checkInItem.Id;
                        $scope.checkInItem.Id = $rootScope.formatControlNo('', 8, $scope.checkInItem.Id);

                        $scope.getCheckInShipments($scope.checkInItem.Id);
                        var promise = $interval(function () {
                            if ($scope.flagOnRetrieveDetails) {
                                $scope.flagOnRetrieveDetails = false;
                                $interval.cancel(promise);
                                promise = undefined;
                                $scope.submitButtonText = "Submit";
                                $scope.selectedTab = $scope.tabPages[0];
                                $scope.checkInSubmitDefinition.Type = "Edit";
                            }
                        }, 100);
                    }
                    else { //user choose edit-menu in form
                        $scope.submitButtonText = "Submit";
                        $scope.selectedTab = $scope.tabPages[0];
                        $scope.checkInSubmitDefinition.Type = "Edit";
                    }

                    if ($scope.checkInItem.Status == 10)
                        $scope.viewOnly = false;
                    else
                        $scope.viewOnly = true;
                    $scope.enableSave = true;
                    return true;
                case "PostDeleteAction":
                    //If user choose cancel-menu in listing
                    if (angular.isDefined($scope.checkInDataDefinition.DataItem.Id) && $scope.checkInItem.Id != $scope.checkInDataDefinition.DataItem.Id) {
                        $scope.checkInShipmentsDataDefinition.DataList.splice(0, $scope.checkInShipmentsDataDefinition.DataList.length);
                        $scope.checkInItem = angular.copy($scope.checkInDataDefinition.DataItem);
                        $scope.checkInItem.CheckInDate = $filter('date')($scope.checkInItem.CheckInDate, "MM/dd/yyyy");
                        $scope.controlNoHolder = $scope.checkInItem.Id;
                        $scope.checkInItem.Id = $rootScope.formatControlNo('', 8, $scope.checkInItem.Id);

                        $scope.getCheckInShipments($scope.checkInItem.Id);
                        var promise = $interval(function () {
                            if ($scope.flagOnRetrieveDetails) {
                                $scope.flagOnRetrieveDetails = false;
                                $interval.cancel(promise);
                                promise = undefined;
                                $scope.viewOnly = true;
                                $scope.submitButtonText = "Submit";
                                $scope.selectedTab = $scope.tabPages[0];
                                $scope.checkInSubmitDefinition.Type = "Edit";
                            }
                        }, 100);
                    }
                    else { //user choose cancel-menu in form
                        $scope.viewOnly = true;
                        $scope.submitButtonText = "Submit";
                        $scope.selectedTab = $scope.tabPages[0];
                        $scope.checkInSubmitDefinition.Type = "Edit";
                    }
                    //Cancel Status
                    $scope.checkInItem.Status = 50;
                    $scope.enableSave = true;
                    return true;
                case "PostViewAction":
                    //If user choose View-menu in listing
                    if (angular.isDefined($scope.checkInDataDefinition.DataItem.Id) && $scope.checkInItem.Id != $scope.checkInDataDefinition.DataItem.Id) {
                        $scope.checkInShipmentsDataDefinition.DataList.splice(0, $scope.checkInShipmentsDataDefinition.DataList.length);
                        $scope.checkInItem = angular.copy($scope.checkInDataDefinition.DataItem);
                        $scope.checkInItem.CheckInDate = $filter('date')($scope.checkInItem.CheckInDate, "MM/dd/yyyy");
                        $scope.controlNoHolder = $scope.checkInItem.Id;
                        $scope.checkInItem.Id = $rootScope.formatControlNo('', 8, $scope.checkInItem.Id);

                        $scope.getCheckInShipments($scope.checkInItem.Id);
                        var promise = $interval(function () {
                            if ($scope.flagOnRetrieveDetails) {
                                $scope.flagOnRetrieveDetails = false;
                                $interval.cancel(promise);
                                promise = undefined;
                                $scope.viewOnly = true;
                                $scope.submitButtonText = "Submit";
                                $scope.selectedTab = $scope.tabPages[0];
                                $scope.checkInSubmitDefinition.Type = "Close";
                            }
                        }, 100);
                    }
                    else { //user choose View-menu in form
                        $scope.viewOnly = true;
                        $scope.submitButtonText = "Submit";
                        $scope.selectedTab = $scope.tabPages[0];
                        $scope.checkInSubmitDefinition.Type = "Close";
                    }
                    $scope.enableSave = true;
                    return true;
                case "PreSubmit":
                    $scope.checkInSubmitDefinition.DataItem = angular.copy($scope.checkInItem);
                    $scope.checkInSubmitDefinition.DataItem.CheckInShipments = angular.copy($scope.checkInShipmentsDataDefinition.DataList);
                    return true;
                case "PreSave":
                    delete $scope.checkInSubmitDefinition.DataItem.Id;
                    delete $scope.checkInSubmitDefinition.DataItem.BusinessUnit;
                    delete $scope.checkInSubmitDefinition.DataItem.CheckInType;
                    for (var i = 0; i < $scope.checkInSubmitDefinition.DataItem.CheckInShipments.length; i++)
                    {
                        delete $scope.checkInSubmitDefinition.DataItem.CheckInShipments[i].Id;
                        delete $scope.checkInSubmitDefinition.DataItem.CheckInShipments[i].CheckInId;
                        delete $scope.checkInSubmitDefinition.DataItem.CheckInShipments[i].Shipment;
                    }
                    return true;
                case "PostSave":
                    //Initialize Courier Transaction Id
                    $scope.checkInItem.Id = $scope.checkInSubmitDefinition.DataItem.Id;
                    $scope.controlNoHolder = $scope.checkInItem.Id;
                    $scope.checkInItem.Id = $rootScope.formatControlNo('', 8, $scope.checkInItem.Id);
                    $scope.viewOnly = true;
                    $scope.checkInSubmitDefinition.Type = "Edit";
                    $scope.enableSave = false;
                    alert("Successfully Saved.");
                    return true;
                case "PreUpdate":
                    delete $scope.checkInSubmitDefinition.DataItem.BusinessUnit;
                    delete $scope.checkInSubmitDefinition.DataItem.CheckInType;
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
                    $scope.selectedTab = $scope.tabPages[1];
                    return true;
                case "Find":
                    $scope.selectedTab = $scope.tabPages[1];
                    //Animation effect in showing filter directive
                    var promise = $interval(function () {
                        if ($scope.checkInToggle == false) {
                            $("#checkInToggle").slideToggle(function () {
                                $scope.checkInToggle = true;
                            });
                        }
                        $interval.cancel(promise);
                        promise = undefined;
                    }, 200);
                    return true;
                case "Clear":
                    $scope.checkInDataDefinition.DataList = [];
                    //Required if pagination is enabled
                    if ($scope.checkInDataDefinition.EnablePagination == true) {
                        $scope.checkInDataDefinition.CurrentPage = 1;
                        $scope.checkInDataDefinition.DoPagination = true;
                    }
                    return true;
                default: return true;
            }
        };
        $scope.checkInResetData = function () {
            $scope.checkInItem = {
                "Id": null,
                "CheckInTypeId": 1,
                "CheckInType": {
                    "Id": null,
                    "Name": null
                },
                "CheckInDate": $filter('Date')(new Date()),
                "CheckInTime": $filter('Time')(new Date()),
                "CheckInBusinessUnitId": null,
                "BusinessUnit": {
                    "Id": null,
                    "Code": null,
                    "Name": null
                },
                "CheckInSourceId": null,
                "CheckInShipment": [],
                "Status": 10,
                "Remarks": null
            }
            //Temporary set BusinessUnit
            $scope.checkInItem.BusinessUnit = {
                "Id": 17,
                "Code": "BU0007",
                "Name": "Manila",
                "BusinessUnitTypeId": 1,
                "ParentBusinessUnitId": null,
                "isOperatingSite": 1,
                "hasAirPort": 0,
                "hasSeaPort": 1,
                "CreatedDate": "2015-09-22 17:53:26.650",
                "LastUpdatedDate": "2015-09-22 17:53:38.597",
                "CreatedByUserId": null,
                "LastUpdatedByUserId": null
            };
            $scope.checkInItem.CheckInBusinessUnitId = $scope.checkInItem.BusinessUnit.Id;
        };

        $scope.checkInShowFormError = function (error) {
            $scope.checkInIsError = true;
            $scope.checkInErrorMessage = error;
        };

        $scope.initializeCheckInDataDefinition();
        $scope.initializeCheckInSubmitDefinition();
    };

    //Load filtering for compiling
    $scope.loadCheckInFiltering = function () {
        $scope.initCheckInFilteringParameters();
        $scope.initCheckInFilteringContainter();
        $("#checkInToggle").slideToggle(function () { });
    };

    //initialize filtering parameters
    $scope.initCheckInFilteringContainter = function () {
        html = '<dir-filtering  filterdefinition="checkInFilteringDefinition"' +
                                'filterlistener="checkInDataDefinition.Retrieve"' +
                                'otheractions="checkInOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#checkInFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of filtering to DOM
    $scope.initCheckInFilteringParameters = function () {
        //Hide the filtering directive
        $scope.hideCheckInToggle = function () {
            var promise = $interval(function () {
                $("#checkInToggle").slideToggle(function () {
                    $scope.checkInToggle = false;
                });
                $interval.cancel(promise);
                promise = undefined;
            }, 200)
        };
        $scope.initCheckInFilteringDefinition = function () {
            $scope.checkInFilteringDefinition = {
                "Url": ($scope.checkInDataDefinition.EnablePagination == true ? 'api/CheckIns?type=paginate&param1=' + $scope.checkInDataDefinition.CurrentPage : 'api/CheckIns?type=scroll&param1=' + $scope.checkInDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index 0
                "Source": [
                            { "Index": 0, "Label": "Transaction No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "BL Number", "Column": "CheckInSourceId", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 2, "Label": "Check-In Date", "Column": "CheckInDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 3, "Label": "Business Unit", "Column": "BusinessUnitId", "Values": ['GetBusinessUnit'], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 4, "Label": "Status", "Column": "Status", "Values": [{ "Id": 10, "Name": "Open" }, { "Id": 50, "Name": "Cancelled" }], "From": null, "To": null, "Type": "DropDown" },
                ],//Contains the Criteria definition
                "Multiple": true,
                "AutoLoad": false,
                "ClearData": false,
                "SetSourceToNull": false
            }
        };

        $scope.checkInOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.selectedTab = $scope.tabPages[1];
                    $scope.checkInSource = $scope.checkInFilteringDefinition.Source;
                    //Optional in using this, can use switch if every source type has validation before filtering
                    for (var i = 0; i < $scope.checkInSource.length; i++) {
                        $scope.checkInFilteringDefinition.DataItem1.CheckIn[0][$scope.checkInSource[i].Column] = $scope.checkInSource[i].From;
                        $scope.checkInFilteringDefinition.DataItem1.CheckIn[1][$scope.checkInSource[i].Column] = $scope.checkInSource[i].To;
                    }
                    //Delete keys that the value is null
                    for (var i = 0; i < $scope.checkInSource.length; i++) {
                        if ($scope.checkInFilteringDefinition.DataItem1.CheckIn[0][$scope.checkInSource[i].Column] == null) {
                            delete $scope.checkInFilteringDefinition.DataItem1.CheckIn[0][$scope.checkInSource[i].Column];
                            delete $scope.checkInFilteringDefinition.DataItem1.CheckIn[1][$scope.checkInSource[i].Column];
                        }
                    }

                    if ($scope.checkInDataDefinition.EnablePagination == true && $scope.checkInFilteringDefinition.ClearData) {
                        $scope.checkInDataDefinition.CurrentPage = 1;
                        $scope.checkInFilteringDefinition.Url = 'api/CheckIns?type=paginate&param1=' + $scope.checkInDataDefinition.CurrentPage;
                    }
                    else if ($scope.checkInDataDefinition.EnablePagination == true) {
                        $scope.checkInDataDefinition.DataList = [];
                        $scope.checkInFilteringDefinition.Url = 'api/CheckIns?type=paginate&param1=' + $scope.checkInDataDefinition.CurrentPage;
                    }
                        //Scroll
                    else {
                        if ($scope.checkInFilteringDefinition.ClearData)
                            $scope.checkInDataDefinition.DataList = [];
                        $scope.checkInFilteringDefinition.Url = 'api/CheckIns?type=scroll&param1=' + $scope.checkInDataDefinition.DataList.length;
                    }
                    //CheckInTypeId fore sea freight loading
                    $scope.checkInFilteringDefinition.DataItem1.CheckIn[0].CheckInTypeId = 1;
                    //$scope.checkInFilteringDefinition.DataItem1.CheckIn[0].CheckInBusinessUnitId = $scope.checkInItem.CheckInBusinessUnitId;
                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize checkInDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize checkInDataDefinition DataList by pushing each value of filterDefinition DataList*/
                    //Required
                    $scope.checkInFilteringDefinition.DataList = $scope.checkInFilteringDefinition.DataList;
                    if ($scope.checkInDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.checkInFilteringDefinition.DataList.length; j++)
                            $scope.checkInDataDefinition.DataList.push($scope.checkInFilteringDefinition.DataList[j]);
                    }

                    if ($scope.checkInDataDefinition.EnablePagination == true) {
                        $scope.checkInDataDefinition.DataList = [];
                        $scope.checkInDataDefinition.DataList = $scope.checkInFilteringDefinition.DataList;
                        $scope.checkInDataDefinition.DoPagination = true;
                    }

                    if ($scope.checkInToggle == true)
                        $scope.hideCheckInToggle();
                    return true;
                case 'GetBusinessUnit':
                    $scope.modalWatcher = "GetBusinessUnit";
                    //Show modal here then after user choose a specific data to filter pass the to From field in the source where Values[0] is equal to the action, ex. GetBusinessUnitList
                    //Use if filtering criteria is modal
                    $scope.showBusinessUnit();
                    return true;
                default: return true;
            }
        };

        $scope.initCheckInDataItems = function () {
            $scope.checkInObj = {
                "CheckIn": [{
                    "Id": null,
                    "CheckInDate": null,
                    "CheckInTypeId": null,
                    "BusinessUnitId": null
                }, {
                    "Id": null,
                    "CheckInDate": null,
                    "CheckInTypeId": null,
                    "BusinessUnitId": null
                }]
            }
            $scope.checkInFilteringDefinition.DataItem1 = angular.copy($scope.checkInObj);
        };

        $scope.initCheckInFilteringDefinition();
        $scope.initCheckInDataItems();
    };
    //=====================================END OF CHECK-IN FILTERING AND DATAGRID===================


    //=====================================CHECK-IN SHIPMENTS DETAIL DATAGRID=======================
    //Load checkInShipments datagrid for compiling
    $scope.loadCheckInShipmentsDataGrid = function () {
        $scope.initCheckInShipmentsDataGrid();
        $scope.compileCheckInShipmentsDataGrid();
    };

    //initialize checkInShipments datagrid parameters
    $scope.initCheckInShipmentsDataGrid = function () {
        $scope.initializeCheckInShipmentsDataDefinition = function () {
            $scope.checkInShipmentsDataDefinition = {
                "Header": ['Shipment No', 'Transport Status', 'Booking Date', 'Business Unit', 'Operating Site', 'Service', 'Shipment Type', 'Payment Mode', 'Booking Remarks', 'Qty', 'Total CBM', 'Cargo Description', 'Pickup Address', 'Target Pickup Date', 'Target Pickup Time', 'Customer', 'Customer Address', 'Customer Contact No', 'Consignee', 'Consignee Address', 'Consignee Contact No', 'No.'],
                "Keys": ['ShipmentId', 'Shipment.TransportStatusId', 'Shipment.CreatedDate', 'Shipment.BusinessUnit.Name', 'Shipment.BusinessUnit1.Name', 'Shipment.Service.Name', 'Shipment.ShipmentType.Name', 'Shipment.PaymentMode', 'Shipment.BookingRemarks', 'Shipment.Quantity', 'Shipment.TotalCBM', 'Shipment.Description', 'Shipment.OriginAddress', 'Shipment.PickupDate', 'Shipment.PickupTime', 'Shipment.Customer.Name', 'Shipment.Customer.CustomerAddresses[0].Line1', 'Shipment.Customer.CustomerContacts[0].Contact.ContactPhones[0].ContactNumber', 'Shipment.DeliverTo', 'Shipment.DeliveryAddress', 'Shipment.DeliverToContactNo'],
                "Type": ['ControlNo', 'TransportStatus', 'Date', 'ProperCase', 'ProperCase', 'ProperCase', 'ProperCase', 'PaymentMode', 'Default', 'Default', 'Decimal', 'Default', 'ProperCase', 'Date', 'Time', 'ProperCase', 'ProperCase', 'Default', 'ProperCase', 'ProperCase', 'Default'],
                "ColWidth": [150, 150, 150, 150, 150, 150, 150, 150, 200, 100, 150, 200, 300, 150, 150, 200, 200, 200, 200, 300, 200],
                "DataList": [],
                "RequiredFields": ['ShipmentId-Shipment', 'CostAllocation-Cost'],
                "CellTemplate": ["None"],
                "RowTemplate": "Default",
                "EnableScroll": true,
                "EnablePagination": false,
                "CurrentPage": 1, //By default
                "PageSize": 20, //Should be the same in back-end
                "DoPagination": false, //By default
                "Retrieve": false, //By default
                "DataItem": {},
                "DataTarget": "CheckInShipmentsMenu",
                "DataTarget2": "CheckInShipmentsMenu2",
                "ShowCreate": false,
                "ShowContextMenu": false,
                "ContextMenu": [],
                "ContextMenuLabel": [],
                "IsDetail": true
            }
        };

        $scope.initializeCheckInShipmentsSubmitDefinition = function () {
            $scope.checkInShipmentsSubmitDefinition = {
                "Submit": false, //By default
                "APIUrl": '',
                "Type": 'Create', //By Default
                "DataItem": {},
                "Index": -1 //By Default
            }
        };

        $scope.checkInShipmentsOtheractions = function (action) {
            switch (action) {
                default: return true;
            }
        };

        $scope.checkInShipmentsResetData = function () {
            $scope.checkInShipmentsItem = {
                "Id": null,
                "CheckInId": null,
                "ShipmentId": null,
                "Shipment": {},
                "IsDisplay": true
            }
        };

        $scope.checkInShipmentsShowFormError = function (error) {
            $scope.checkInIsError = true;
            $scope.checkInErrorMessage = error;
        };

        $scope.initializeCheckInShipmentsDataDefinition();
        $scope.initializeCheckInShipmentsSubmitDefinition();
    };

    //function that will be invoked during compiling datagrid to DOM
    $scope.compileCheckInShipmentsDataGrid = function () {
        var html = '<dir-data-grid2 datadefinition      = "checkInShipmentsDataDefinition"' +
                                    'submitdefinition   = "checkInShipmentsSubmitDefinition"' +
                                    'otheractions       = "checkInShipmentsOtheractions(action)"' +
                                    'resetdata          = "checkInShipmentsResetData()"' +
                                    'showformerror      = "checkInShipmentsShowFormError(error)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#checkInShipmentsContainer')).html(html);
        $compile($content)($scope);
    };
    //=================================================END OF CHECK-IN DETAIL DATAGRID==============

    //=====================================BUSINESS UNIT MODAL======================================
    $scope.showBusinessUnit = function () {
        openModalPanel2("#businessUnit-list-modal");
        $scope.loadBusinessUnitDataGrid();
        $scope.loadBusinessUnitFiltering();

        $scope.businessUnitFilteringDefinition.SetSourceToNull = true;
        $scope.businessUnitDataDefinition.Retrieve = true;
    };

    //Load businessUnit filtering for compiling
    $scope.loadBusinessUnitFiltering = function () {
        $scope.initBusinessUnitFilteringParameters();
        $scope.initBusinessUnitFilteringContainter();
    };

    //initialize businessUnit filtering parameters
    $scope.initBusinessUnitFilteringContainter = function () {
        html = '<dir-filtering  id="businessUnitFilter" filterdefinition="businessUnitFilteringDefinition"' +
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

                    ////Delete keys that the value is null
                    //for (var i = 0; i < $scope.businessUnitSource.length; i++) {
                    //    if ($scope.businessUnitFilteringDefinition.DataItem1.BusinessUnit[0][$scope.businessUnitSource[i].Column] == null) {
                    //        delete $scope.businessUnitFilteringDefinition.DataItem1.BusinessUnit[0][$scope.businessUnitSource[i].Column];
                    //        delete $scope.businessUnitFilteringDefinition.DataItem1.BusinessUnit[1][$scope.businessUnitSource[i].Column];
                    //    }
                    //}

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
                    //$scope.businessUnitFilteringDefinition.DataItem1.BusinessUnit[0].ParentBusinessUnitId = $scope.checkInItem.BusinessUnitId;
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
                "DataTarget2": "BusinessUnitMenu2",
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
                    if ($scope.modalWatcher != "GetBusinessUnit") {
                        $scope.checkInItem.BusinessUnit[0] = $scope.businessUnitDataDefinition.DataItem;
                        $scope.checkInItem.BusinessUnitId = $scope.businessUnitDataDefinition.DataItem.Id;
                    }
                    else {
                        $scope.checkInFilteringDefinition.Source[2].From = $scope.businessUnitDataDefinition.DataItem.Id;
                        $scope.checkInFilteringDefinition.Source[2].To = $scope.businessUnitDataDefinition.DataItem.Name;
                    }
                    $scope.modalWatcher = "";
                    $scope.closeModal();
                    return true;
                default: return true;
            }
        };

        $scope.initializeBusinessUnitDataDefinition();
    };

    //function that will be invoked during compiling of businessUnit datagrid to DOM
    $scope.compileBusinessUnitDataGrid = function () {
        var html = '<dir-data-grid2 id="businessUnitGrid" datadefinition      = "businessUnitDataDefinition"' +
                                    'submitdefinition   = "businessUnitSubmitDefinition"' +
                                    'otheractions       = "businessUnitOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#businessUnitContainer')).html(html);
        $compile($content)($scope);
    };
    //=======================================END OF BUSINESS UNIT MODAL==============================

    //=====================================SHIPMENT MODAL/REPORT======================================
    //$scope.showShipment = function () {
    //    openModalPanel2("#shipment-list-modal");
    //    $scope.loadShipmentDataGrid();
    //    $scope.loadShipmentFiltering();

    //    $scope.shipmentFilteringDefinition.SetSourceToNull = true;
    //    $scope.shipmentDataDefinition.Retrieve = true;
    //};
    ////Load shipment filtering for compiling
    //$scope.loadShipmentFiltering = function () {
    //    $scope.initShipmentFilteringParameters();
    //    $scope.initShipmentFilteringContainter();
    //};

    ////initialize shipment filtering parameters
    //$scope.initShipmentFilteringContainter = function () {
    //    html = '<dir-filtering  id="shipmentFilter" filterdefinition="shipmentFilteringDefinition"' +
    //                            'filterlistener="shipmentDataDefinition.Retrieve"' +
    //                            'otheractions="shipmentOtherActionsFiltering(action)"' +
    //           '</dir-filtering>';
    //    $content = angular.element(document.querySelector('#shipmentFilterContainter')).html(html);
    //    $compile($content)($scope);
    //};

    ////function that will be called during compiling of shipment unit filtering to DOM
    //$scope.initShipmentFilteringParameters = function () {
    //    $scope.initShipmentFilteringDefinition = function () {
    //        $scope.shipmentFilteringDefinition = {
    //            "Url": ($scope.shipmentDataDefinition.EnablePagination == true ? 'api/Shipments?type=paginate&param1=' + $scope.shipmentDataDefinition.CurrentPage : 'api/Shipments?type=scroll&param1=' + $scope.shipmentDataDefinition.DataList.length),//Url for retrieve
    //            "DataList": [], //Contains the data retrieved based on the criteria
    //            "DataItem1": $scope.DataItem1, //Contains the parameter value index 
    //            "Source": [
    //                        { "Index": 0, "Label": "Shipment No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
    //                        { "Index": 1, "Label": "Booking Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
    //                        { "Index": 2, "Label": "Service", "Column": "ServiceId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
    //                        { "Index": 3, "Label": "Shipment Type", "Column": "ShipmentTypeId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
    //                        { "Index": 4, "Label": "Payment Mode", "Column": "PaymentMode", "Values": $scope.paymentModeList, "From": null, "To": null, "Type": "DropDown" },
    //                        { "Index": 5, "Label": "Target Pickup Date", "Column": "PickupDate", "Values": [], "From": null, "To": null, "Type": "Date" },
    //                        { "Index": 6, "Label": "Status", "Column": "TransportStatusId", "Values": $rootScope.getTransportStatusList(), "From": null, "To": null, "Type": "DropDown" }
    //            ],//Contains the Criteria definition
    //            "Multiple": false,
    //            "AutoLoad": false,
    //            "ClearData": false,
    //            "SetSourceToNull": false
    //        }
    //    };

    //    $scope.shipmentOtherActionsFiltering = function (action) {
    //        switch (action) {
    //            //Initialize DataItem1 and DataItem2 for data filtering
    //            case 'PreFilterData':
    //                $scope.shipmentSource = $scope.shipmentFilteringDefinition.Source;
    //                //Optional in using this, can use switch if every source type has validation before filtering
    //                for (var i = 0; i < $scope.shipmentSource.length; i++) {
    //                    if ($scope.shipmentSource[i].Type == "Date") {
    //                        $scope.shipmentFilteringDefinition.DataItem1.Shipment[0][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].From;
    //                        $scope.shipmentFilteringDefinition.DataItem1.Shipment[1][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].To;
    //                    }
    //                    else
    //                        $scope.shipmentFilteringDefinition.DataItem1.Shipment[0][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].From;
    //                }
    //                //Delete keys that the value is null
    //                for (var i = 0; i < $scope.shipmentSource.length; i++) {
    //                    if ($scope.shipmentFilteringDefinition.DataItem1.Shipment[0][$scope.shipmentSource[i].Column] == null) {
    //                        delete $scope.shipmentFilteringDefinition.DataItem1.Shipment[0][$scope.shipmentSource[i].Column];
    //                        delete $scope.shipmentFilteringDefinition.DataItem1.Shipment[1][$scope.shipmentSource[i].Column];
    //                    }
    //                }
    //                if ($scope.shipmentDataDefinition.EnablePagination == true && $scope.shipmentFilteringDefinition.ClearData) {
    //                    $scope.shipmentDataDefinition.CurrentPage = 1;
    //                    $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=paginate&param1=' + $scope.shipmentDataDefinition.CurrentPage;
    //                }
    //                else if ($scope.shipmentDataDefinition.EnablePagination == true) {
    //                    $scope.shipmentDataDefinition.DataList = [];
    //                    $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=paginate&param1=' + $scope.shipmentDataDefinition.CurrentPage;
    //                }
    //                    //Scroll
    //                else {
    //                    if ($scope.shipmentFilteringDefinition.ClearData)
    //                        $scope.shipmentDataDefinition.DataList = [];
    //                    $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=scroll&param1=' + $scope.shipmentDataDefinition.DataList.length;
    //                }
    //                //$scope.shipmentFilteringDefinition.DataItem1.Shipment[0].BusinessUnitId = $scope.checkInItem.BusinessUnitId;
    //                $scope.shipmentFilteringDefinition.DataItem1.Shipment[0].Id = 0;
    //                $scope.shipmentFilteringDefinition.DataItem1.Shipment[1].Id = 0;
    //                return true;
    //            case 'PostFilterData':
    //                /*
    //                    Note:  if pagination, initialize businessUnitDataDefinition DataList by copying the DataList of filterDefinition then set DoPagination to true
    //                           if scroll, initialize businessUnitDataDefinition DataList by pushing each value of filterDefinition DataList
    //                */
    //                //Required
    //                //$scope.shipmentFilteringDefinition.DataList = $rootScope.formatShipment($scope.shipmentFilteringDefinition.DataList);
    //                if ($scope.shipmentDataDefinition.EnableScroll == true) {
    //                    for (var j = 0; j < $scope.shipmentFilteringDefinition.DataList.length; j++)
    //                        $scope.shipmentDataDefinition.DataList.push($scope.shipmentFilteringDefinition.DataList[j]);
    //                }

    //                if ($scope.shipmentDataDefinition.EnablePagination == true) {
    //                    $scope.shipmentDataDefinition.DataList = [];
    //                    $scope.shipmentDataDefinition.DataList = $scope.shipmentFilteringDefinition.DataList;
    //                    $scope.shipmentDataDefinition.DoPagination = true;
    //                }

    //                //Format OrginAddress and Delivery Address
    //                for (var i = 0; i < $scope.shipmentDataDefinition.DataList.length; i++) {
    //                    //Initialize Pickup Address
    //                    $scope.shipmentDataDefinition.DataList[i].OriginAddress = $scope.initializeAddressField($scope.shipmentDataDefinition.DataList[i].Address1);
    //                    //Initalize Consignee Address
    //                    $scope.shipmentDataDefinition.DataList[i].DeliveryAddress = $scope.initializeAddressField($scope.shipmentDataDefinition.DataList[i].Address);
    //                }

    //                return true;
    //            default: return true;
    //        }
    //    };

    //    $scope.initShipmentDataItems = function () {
    //        $scope.shipmentFilteringDefinition.DataItem1 = angular.copy($rootScope.shipmentObj());
    //    };

    //    $scope.initShipmentFilteringDefinition();
    //    $scope.initShipmentDataItems();

    //    //Initialize filtering service
    //    var promiseServiceList = $interval(function () {
    //        if ($scope.serviceList.length > 0) {
    //            $scope.shipmentFilteringDefinition.Source[2].Values = $scope.serviceList;
    //            $interval.cancel(promiseServiceList);
    //            promiseServiceList = undefined;
    //        }
    //    }, 100);

    //    //Initialize filtering shipment type
    //    var promiseShipmentTypeList = $interval(function () {
    //        if ($scope.shipmentTypeList.length > 0) {
    //            $scope.shipmentFilteringDefinition.Source[3].Values = $scope.shipmentTypeList;
    //            $interval.cancel(promiseShipmentTypeList);
    //            promiseShipmentTypeList = undefined;
    //        }
    //    }, 100);
    //};

    ////Load shipment datagrid for compiling
    //$scope.loadShipmentDataGrid = function () {
    //    $scope.initShipmentDataGrid();
    //    $scope.compileShipmentDataGrid();
    //};

    ////initialize shipment datagrid parameters
    //$scope.initShipmentDataGrid = function () {
    //    $scope.shipmentSubmitDefinition = undefined;
    //    $scope.initializeShipmentDataDefinition = function () {
    //        $scope.shipmentDataDefinition = {
    //            "Header": ['Shipment No', 'Transport Status', 'Booking Date', 'Business Unit', 'Operating Site', 'Service', 'Shipment Type', 'Payment Mode', 'Booking Remarks', 'Qty', 'Total CBM', 'Cargo Description', 'Pickup Address', 'Target Pickup Date', 'Target Pickup Time', 'Customer', 'Customer Address', 'Customer Contact No', 'Consignee', 'Consignee Address', 'Consignee Contact No', 'No.'],
    //            "Keys": ['Id', 'TransportStatusId', 'CreatedDate', 'BusinessUnit.Name', 'BusinessUnit1.Name', 'Service.Name', 'ShipmentType.Name', 'PaymentMode', 'BookingRemarks', 'Quantity', 'TotalCBM', 'Description', 'OriginAddress', 'PickupDate', 'PickupTime', 'Customer.Name', 'Customer.CustomerAddresses[0].Line1', 'Customer.CustomerContacts[0].Contact.ContactPhones[0].ContactNumber', 'DeliverTo', 'DeliveryAddress', 'DeliverToContactNo'],
    //            "Type": ['ControlNo', 'TransportStatus', 'Date', 'ProperCase', 'ProperCase', 'ProperCase', 'ProperCase', 'PaymentMode', 'Default', 'Default', 'Decimal', 'Default', 'ProperCase', 'Date', 'Time', 'ProperCase', 'ProperCase', 'Default', 'ProperCase', 'ProperCase', 'Default'],
    //            "ColWidth": [150, 150, 150, 150, 150, 150, 150, 150, 200, 100, 150, 200, 300, 150, 150, 200, 200, 200, 200, 300, 200],
    //            "DataList": [],
    //            "RequiredFields": [],
    //            "CellTemplate": ["None"],
    //            "RowTemplate": "Default",
    //            "EnableScroll": true,
    //            "EnablePagination": false,
    //            "CurrentPage": 1, //By default
    //            "PageSize": 20, //Should be the same in back-end
    //            "DoPagination": false, //By default
    //            "Retrieve": false, //By default
    //            "DataItem": {},
    //            "DataTarget": "ShipmentMenu",
    //            "DataTarget2": "ShipmentMenu2",
    //            "ShowCreate": false,
    //            "ShowContextMenu": false,
    //            "ContextMenu": [""],
    //            "ContextMenuLabel": [""]
    //        }

    //        //Optional if row template
    //        $scope.shipmentDataDefinition.RowTemplate = '<div>' +
    //                                                            ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
    //                                                          '</div>';
    //    };
    //    $scope.shipmentOtherActions = function (action) {
    //        switch (action) {
    //            case 'PostEditAction':
    //                var originAddress = $scope.shipmentDataDefinition.DataItem.Address1;
    //                var deliveryAddress = $scope.shipmentDataDefinition.DataItem.Address;
    //                $scope.checkInItem.ShipmentId = $rootScope.formatControlNo('', 8, $scope.shipmentDataDefinition.DataItem.Id);
    //                $scope.checkInItem.Shipment = $scope.shipmentDataDefinition.DataItem;
    //                $scope.checkInItem.Shipment.OriginAddress = $scope.initializeAddressField(originAddress);
    //                $scope.checkInItem.Shipment.DeliveryAddress = $scope.initializeAddressField(deliveryAddress);
    //                $scope.checkInItem.Shipment.CreatedDate = $filter('date')($scope.shipmentDataDefinition.DataItem.CreatedDate, "MM/dd/yyyy");
    //                $scope.checkInIsError = false;
    //                $scope.checkInErrorMessage = "";
    //                $scope.closeModal();
    //                return true;
    //            default: return true;
    //        }
    //    };

    //    $scope.initializeShipmentDataDefinition();
    //};

    ////function that will be invoked during compiling of datagrid to DOM
    //$scope.compileShipmentDataGrid = function () {
    //    var html = '<dir-data-grid2 id = "shipmentGrid" datadefinition      = "shipmentDataDefinition"' +
    //                                'submitdefinition   = "shipmentSubmitDefinition"' +
    //                                'otheractions       = "shipmentOtherActions(action)">' +
    //                '</dir-data-grid2>';
    //    $content = angular.element(document.querySelector('#shipmentContainer')).html(html);
    //    $compile($content)($scope);
    //};
    //=======================================END OF SHIPMENT MODAL/REPORT==============================

    // Initialization routines
    var init = function () {
        $scope.initCheckInTypeList();
        $scope.initPaymentModeList();
        $scope.initServiceList();
        $scope.initShipmentTypeList();
        $scope.loadCheckInDataGrid();
        $scope.loadCheckInFiltering();
        $scope.loadCheckInShipmentsDataGrid();
        $scope.checkInShipmentsResetData();
        $rootScope.manipulateDOM();

        //Initialize Check In DataItem
        $scope.checkInResetData();

        if ($scope.checkInFilteringDefinition.AutoLoad == true)
            $scope.checkInDataDefinition.Retrieve = true;
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
});