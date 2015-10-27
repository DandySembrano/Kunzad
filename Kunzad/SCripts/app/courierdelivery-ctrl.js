//---------------------------------------------------------------------------------//
// Filename: courierdelivery-ctrl.js
// Description: Controller for Courier Delivery module
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//
kunzadApp.controller("CourierDeliveryController", function ($scope, $http, $interval, $filter, $rootScope, $compile) {
    $scope.modelName = "Courier Delivery";
    $scope.modelhref = "#/courierdelivery";
    $scope.withDirective = true;
    $scope.courierDeliveryItem = {};
    $scope.viewOnly = false;
    $scope.courierDeliveryIsError = false;
    $scope.courierDeliveryErrorMessage = "";
    $scope.submitButtonText = "Submit";
    $scope.tabPages = ["Information", "List"];
    $scope.selectedTab = "Information";
    $scope.controlNoHolder = 0;
    $scope.courierDeliveryToggle = false;
    $scope.courierDeliveryDetailsToggle = false;
    $scope.paymentModeList = [];
    $scope.serviceList = [];
    $scope.shipmentTypeList = [];
    $scope.controlNoHolder = 0;
    $scope.courierDeliveryDetailsTemporyId = 0;
    $scope.flagOnRetrieveDetails = false;
    $scope.enableSave = true;
    $scope.modalWatcher = "";

    //function that will be invoked when user click tab
    $scope.setSelectedTab = function (tab) {
        $scope.courierDeliveryIsError = false;
        $scope.courierDeliveryErrorMessage = "";
        $scope.selectedTab = tab;
    };

    //function that will be called during submit
    $scope.submit = function () {
        if ($scope.enableSave) {
            $scope.courierDeliveryIsError = false;
            $scope.courierDeliveryErrorMessage = "";
            $scope.courierDeliverySubmitDefinition.Submit = true;
        }
    };

    //Close the modal
    $scope.closeModal = function () {
        jQuery.magnificPopup.close();
        if (angular.isDefined($scope.courierDataDefinition)) {
            $scope.courierDataDefinition.DataList = [];
            $scope.courierFilteringDefinition.DataList = [];
            $rootScope.removeElement("courierGrid");
            $rootScope.removeElement("courierFilter");
        }

        if (angular.isDefined($scope.businessUnitDataDefinition)) {
            $scope.businessUnitDataDefinition.DataList = [];
            $scope.businessUnitFilteringDefinition.DataList = [];
            $rootScope.removeElement("businessUnitGrid");
            $rootScope.removeElement("businessUnitFilter");
        }

        if (angular.isDefined($scope.shipmentDataDefinition)) {
            $scope.shipmentDataDefinition.DataList = [];
            $scope.shipmentFilteringDefinition.DataList = [];
            $rootScope.removeElement("shipmentGrid");
            $rootScope.removeElement("shipmentFilter");
        }

    };

    //Initialize Payment Mode List for DropDown
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

    //Initialize Address fields
    $scope.initializeAddressField = function (addressItem) {
        $scope.formattedAddress = addressItem.Line1 + (addressItem.Line2 == "" || addressItem.Line2 == null ? " " : ", " + addressItem.Line2) + "\n";
        $scope.formattedAddress += addressItem.CityMunicipality.Name + ", " + (addressItem.CityMunicipality.StateProvince == null ? "" : addressItem.CityMunicipality.StateProvince.Name + "\n");
        $scope.formattedAddress += $scope.country.Name + ", " + addressItem.PostalCode;
        return $scope.formattedAddress;
    };

    //function that focus on top of the page
    $scope.focusOnTop = function () {
        $(document).ready(function () {
            $(this).scrollTop(0);
        });
    };

    //Validate courier delivery details
    $scope.validateCourierDeliveryDetails = function () {
        if ($scope.courierDeliveryDetailsDataDefinition.DataList.length == 1
            && $scope.courierDeliveryDetailsDataDefinition.DataList[0].ShipmentId == 0
            && $scope.courierDeliverySubmitDefinition.Type == "Edit")
            return true;
        for (var i = 0; i < $scope.courierDeliveryDetailsDataDefinition.DataList.length; i++)
        {
            if ($scope.courierDeliveryDetailsDataDefinition.DataList[i].ShipmentId == 0) {
                $scope.courierDeliveryIsError = true;
                $scope.courierDeliveryErrorMessage = "Shipment is required in row " + (i + 1) + ".";
                $scope.focusOnTop();
                return false;
            }
            else if ($scope.courierDeliveryDetailsDataDefinition.DataList[i].CostAllocation == null || $scope.courierDeliveryDetailsDataDefinition.DataList[i].CostAllocation == 0) {
                $scope.courierDeliveryIsError = true;
                $scope.courierDeliveryErrorMessage = "Cost Allocation must be greater than zero in row " + (i + 1) + ".";
                $scope.focusOnTop();
                return false;
            }
        }
        return true;
    };

    //Function that will retrieve of a courier transaction details
    $scope.getCourierTransactionDetails = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get('api/CourierTransactionDetails?length=' + $scope.courierDeliveryDetailsDataDefinition.DataList.length + '&masterId=' + id)
            .success(function (data, status) {
                for (var i = 0; i < data.length; i++) {
                    data[i].Shipment[0] = data[i].Shipment;
                    //Initialize Pickup Address
                    data[i].Shipment[0].OriginAddress = $scope.initializeAddressField(data[i].Shipment[0].Address1);
                    //Initalize Consignee Address
                    data[i].Shipment[0].DeliveryAddress = $scope.initializeAddressField(data[i].Shipment[0].Address);
                    $scope.courierDeliveryDetailsDataDefinition.DataList.push(data[i]);
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
    $('#businessUnit,#courier,#calldate,#calltime').keypress(function (key) {
        return false;
    });

    // NUMBERS w/ DECIMAL AND COMMA
    $('#cost').priceFormat({
        clearPrefix: true,
        prefix: '',
        centsSeparator: '.',
        thousandsSeparator: ',',
        centsLimit: 2
    });
    $('#calldate').datetimepicker({
        format: 'MM-DD-YYYY',
        sideBySide: false,
        pickTime: false,
        //minDate: moment()
    })
    $('#calltime').datetimepicker({
        format: 'HH:mm',
        sideBySide: false,
        pickDate: false
    })

    //====================================COURIER DELIVERY FILTERING AND DATAGRID==========================
    //Load courierDelivery datagrid for compiling
    $scope.loadCourierDeliveryDataGrid = function () {
        $scope.initCourierDeliveryDataGrid();
        $scope.compileCourierDeliveryDataGrid();
    };

    //function that will be invoked during compiling datagrid to DOM
    $scope.compileCourierDeliveryDataGrid = function () {
        var html = '<dir-data-grid2 datadefinition      = "courierDeliveryDataDefinition"' +
                                    'submitdefinition   = "courierDeliverySubmitDefinition"' +
                                    'otheractions       = "courierDeliveryOtheractions(action)"' +
                                    'resetdata          = "courierDeliveryResetData()"' +
                                    'showformerror      = "courierDeliveryShowFormError(error)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#courierDeliveryContainer')).html(html);
        $compile($content)($scope);
    };

    //initialize courierDelivery datagrid parameters
    $scope.initCourierDeliveryDataGrid = function () {
        $scope.initializeCourierDeliveryDataDefinition = function () {
            $scope.courierDeliveryDataDefinition = {
                "Header": ['Delivery No', 'Delivery Date', 'Courier', 'Business Unit', 'Cost', 'Call Date', 'Call Time', 'Completed Date', 'Completed Time', 'No.'],
                "Keys": ['Id', 'CreatedDate', 'Courier[0].Name', 'BusinessUnit[0].Name', 'CourierCost', 'CallDate', 'CallTime', 'CompletedDate', 'CompletedTime'],
                "Type": ['ControlNo', 'Date', 'ProperCase', 'ProperCase', 'Decimal', 'Date', 'Time', 'Date', 'Time'],
                "ColWidth": [150, 150, 200, 150, 150, 150, 150, 150, 150],
                "DataList": [],
                "RequiredFields": ['CourierId-Courier', 'BusinessUnitId-Business Unit', 'CourierCost-Cost', 'CallDate-Call Date', 'CallTime-Call Time'],
                "CellTemplate": ["None"],
                "RowTemplate": "Default",
                "EnableScroll": true,
                "EnablePagination": false,
                "CurrentPage": 1, //By default
                "PageSize": 20, //Should be the same in back-end
                "DoPagination": false, //By default
                "Retrieve": false, //By default
                "DataItem": {},
                "DataTarget": "CourierDeliveryMenu",
                "DataTarget2": "CourierDeliveryMenu2",
                "ShowCreate": true,
                "ShowContextMenu": true,
                "ContextMenu": ["'Load'", "'Create'", "'Edit'", "'Delete'", "'View'", "'Find'", "'Clear'"],
                "ContextMenuLabel": ['Reload', 'Create', 'Edit', 'Cancel', 'View', 'Find', 'Clear']
            }
        };

        $scope.initializeCourierDeliverySubmitDefinition = function () {
            $scope.courierDeliverySubmitDefinition = {
                "Submit": false, //By default
                "APIUrl": '/api/CourierTransactions',
                "Type": 'Create', //By Default
                "DataItem": {},
                "Index": -1 //By Default
            }
        };

        $scope.courierDeliveryOtheractions = function (action) {
            switch (action) {
                case "FormCreate":
                    $scope.submitButtonText = "Submit";
                    $scope.courierDeliverySubmitDefinition.Type = "Create";
                    $scope.selectedTab = $scope.tabPages[0];
                    $scope.courierDeliveryResetData();
                    $scope.courierDeliveryDetailsDataDefinition.DataList.splice(0, $scope.courierDeliveryDetailsDataDefinition.DataList.length);
                    $scope.courierDeliveryDetailsResetData();
                    $scope.enableSave = true;
                    $scope.viewOnly = false;
                    return true;
                case "PreAction":
                    return true;
                case "PostCreateAction":
                    $scope.submitButtonText = "Submit";
                    $scope.courierDeliverySubmitDefinition.Type = "Create";
                    $scope.selectedTab = $scope.tabPages[0];
                    $scope.courierDeliveryResetData();
                    $scope.courierDeliveryDetailsDataDefinition.DataList.splice(0, $scope.courierDeliveryDetailsDataDefinition.DataList.length);
                    $scope.courierDeliveryDetailsResetData();
                    $scope.enableSave = true;
                    $scope.viewOnly = false;
                    return true;
                case "PostEditAction":
                    //If user choose edit-menu in listing
                    if (angular.isDefined($scope.courierDeliveryDataDefinition.DataItem.Id) && $scope.courierDeliveryItem.Id != $scope.courierDeliveryDataDefinition.DataItem.Id) {
                        $scope.courierDeliveryDetailsDataDefinition.DataList.splice(0, $scope.courierDeliveryDetailsDataDefinition.DataList.length);
                        $scope.courierDeliveryItem = angular.copy($scope.courierDeliveryDataDefinition.DataItem);
                        $scope.controlNoHolder = $scope.courierDeliveryItem.Id;
                        $scope.courierDeliveryItem.Id = $rootScope.formatControlNo('', 15, $scope.courierDeliveryItem.Id);
                        $scope.courierDeliveryItem.CallDate = $filter('Date')($scope.courierDeliveryItem.CallDate);
                        $scope.courierDeliveryItem.CourierCost = $filter('number')($scope.courierDeliveryItem.CourierCost, 2);

                        $scope.getCourierTransactionDetails($scope.courierDeliveryItem.Id);
                        var promise = $interval(function () {
                            if ($scope.flagOnRetrieveDetails) {
                                $scope.flagOnRetrieveDetails = false;
                                $interval.cancel(promise);
                                promise = undefined;
                                $scope.viewOnly = false;
                                $scope.submitButtonText = "Submit";
                                $scope.selectedTab = $scope.tabPages[0];
                                $scope.courierDeliverySubmitDefinition.Type = "Edit";
                                if ($scope.courierDeliveryDetailsDataDefinition.DataList.length > 0)
                                    //Set control no holder in case user will add item in list
                                    $scope.controlNoHolder = $scope.courierDeliveryDetailsDataDefinition.DataList[$scope.courierDeliveryDetailsDataDefinition.DataList.length - 1].Id + 1;
                                else
                                    $scope.courierDeliveryDetailsResetData();
                            }
                        }, 100);
                    }
                    else {
                        $scope.viewOnly = false;
                        $scope.submitButtonText = "Submit";
                        $scope.selectedTab = $scope.tabPages[0];
                        $scope.courierDeliverySubmitDefinition.Type = "Edit";
                    }
                    $scope.enableSave = true;
                    return true;
                case "PostDeleteAction":
                    //If user choose edit-menu in listing
                    if (angular.isDefined($scope.courierDeliveryDataDefinition.DataItem.Id) && $scope.courierDeliveryItem.Id != $scope.courierDeliveryDataDefinition.DataItem.Id) {
                        $scope.courierDeliveryDetailsDataDefinition.DataList.splice(0, $scope.courierDeliveryDetailsDataDefinition.DataList.length);
                        $scope.courierDeliveryItem = angular.copy($scope.courierDeliveryDataDefinition.DataItem);
                        $scope.controlNoHolder = $scope.courierDeliveryItem.Id;
                        $scope.courierDeliveryItem.Id = $rootScope.formatControlNo('', 15, $scope.courierDeliveryItem.Id);
                        $scope.courierDeliveryItem.CallDate = $filter('Date')($scope.courierDeliveryItem.CallDate);
                        $scope.courierDeliveryItem.CourierCost = $filter('number')($scope.courierDeliveryItem.CourierCost, 2);

                        $scope.getCourierTransactionDetails($scope.courierDeliveryItem.Id);
                        var promise = $interval(function () {
                            if ($scope.flagOnRetrieveDetails) {
                                $scope.flagOnRetrieveDetails = false;
                                $interval.cancel(promise);
                                promise = undefined;
                                $scope.viewOnly = true;
                                $scope.submitButtonText = "Cancel";
                                $scope.selectedTab = $scope.tabPages[0];
                                $scope.courierDeliverySubmitDefinition.Type = "Edit";
                            }
                        }, 100);
                    }
                    else {
                        $scope.viewOnly = true;
                        $scope.submitButtonText = "Cancel";
                        $scope.selectedTab = $scope.tabPages[0];
                        $scope.courierDeliverySubmitDefinition.Type = "Edit";
                    }
                    $scope.enableSave = true;
                    return true;
                case "PostViewAction":
                    //If user choose edit-menu in listing
                    if (angular.isDefined($scope.courierDeliveryDataDefinition.DataItem.Id) && $scope.courierDeliveryItem.Id != $scope.courierDeliveryDataDefinition.DataItem.Id) {
                        $scope.courierDeliveryDetailsDataDefinition.DataList.splice(0, $scope.courierDeliveryDetailsDataDefinition.DataList.length);
                        $scope.courierDeliveryItem = angular.copy($scope.courierDeliveryDataDefinition.DataItem);
                        $scope.controlNoHolder = $scope.courierDeliveryItem.Id;
                        $scope.courierDeliveryItem.Id = $rootScope.formatControlNo('', 15, $scope.courierDeliveryItem.Id);
                        $scope.courierDeliveryItem.CallDate = $filter('Date')($scope.courierDeliveryItem.CallDate);
                        $scope.courierDeliveryItem.CourierCost = $filter('number')($scope.courierDeliveryItem.CourierCost, 2);

                        $scope.getCourierTransactionDetails($scope.courierDeliveryItem.Id);
                        var promise = $interval(function () {
                            if ($scope.flagOnRetrieveDetails) {
                                $scope.flagOnRetrieveDetails = false;
                                $interval.cancel(promise);
                                promise = undefined;
                                $scope.viewOnly = true;
                                $scope.submitButtonText = "Close";
                                $scope.selectedTab = $scope.tabPages[0];
                                $scope.courierDeliverySubmitDefinition.Type = "View";
                            }
                        }, 100);

                    }
                    else {
                        $scope.viewOnly = true;
                        $scope.submitButtonText = "Close";
                        $scope.selectedTab = $scope.tabPages[0];
                        $scope.courierDeliverySubmitDefinition.Type = "View";
                    }
                    return true;
                case "PreSubmit":
                    if (!$scope.validateCourierDeliveryDetails())
                        return false;
                    $scope.courierDeliverySubmitDefinition.DataItem = angular.copy($scope.courierDeliveryItem);
                    return true;
                case "PreSave":
                    $scope.courierDeliverySubmitDefinition.DataItem.CourierTransactionDetails = angular.copy($scope.courierDeliveryDetailsDataDefinition.DataList);
                    delete $scope.courierDeliverySubmitDefinition.DataItem.Id;
                    delete $scope.courierDeliverySubmitDefinition.DataItem.Courier;
                    delete $scope.courierDeliverySubmitDefinition.DataItem.BusinessUnit;
                    for (var i = 0; i < $scope.courierDeliverySubmitDefinition.DataItem.CourierTransactionDetails.length; i++){
                        delete $scope.courierDeliverySubmitDefinition.DataItem.CourierTransactionDetails[i].Id;
                        delete $scope.courierDeliverySubmitDefinition.DataItem.CourierTransactionDetails[i].Shipment;
                    }
                    return true;
                case "PostSave":
                    //Initialize Courier Transaction Id
                    $scope.courierDeliveryItem.Id = $scope.courierDeliverySubmitDefinition.DataItem.Id;
                    $scope.controlNoHolder = $scope.courierDeliveryItem.Id;
                    $scope.courierDeliveryItem.Id = $rootScope.formatControlNo('', 15, $scope.courierDeliveryItem.Id);
                    //Initialize Courier Transaction Details Id
                    for (var i = 0; i < $scope.courierDeliverySubmitDefinition.DataItem.CourierTransactionDetails.length; i++)
                        $scope.courierDeliveryDetailsDataDefinition.DataList[i].Id = $scope.courierDeliverySubmitDefinition.DataItem.CourierTransactionDetails[i].Id;
                    $scope.viewOnly = true;
                    $scope.courierDeliverySubmitDefinition.Type = "Edit";
                    $scope.enableSave = false;
                    alert("Successfully Saved.");
                    return true;
                case "PreUpdate":
                    $scope.courierDeliverySubmitDefinition.DataItem.CourierTransactionDetails = angular.copy($scope.courierDeliveryDetailsDataDefinition.DataList);
                    delete $scope.courierDeliverySubmitDefinition.DataItem.Courier;
                    delete $scope.courierDeliverySubmitDefinition.DataItem.BusinessUnit;
                    for (var i = 0; i < $scope.courierDeliverySubmitDefinition.DataItem.CourierTransactionDetails.length; i++) {
                        if ($scope.courierDeliverySubmitDefinition.DataItem.CourierTransactionDetails[i].CourierTransactionId == -1) {
                            delete $scope.courierDeliverySubmitDefinition.DataItem.CourierTransactionDetails[i].Id;
                            $scope.courierDeliverySubmitDefinition.DataItem.CourierTransactionDetails[i].CourierTransactionId = $scope.courierDeliveryItem.Id;
                        }

                        delete $scope.courierDeliverySubmitDefinition.DataItem.CourierTransactionDetails[i].Shipment;
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
                    $scope.selectedTab = $scope.tabPages[1];
                    return true;
                case "Find":
                    $scope.selectedTab = $scope.tabPages[1];
                    //Animation effect in showing filter directive
                    var promise = $interval(function () {
                        if ($scope.courierDeliveryToggle == false) {
                            $("#courierDeliveryToggle").slideToggle(function () {
                                $scope.courierDeliveryToggle = true;
                            });
                        }
                        $interval.cancel(promise);
                        promise = undefined;
                    }, 200);
                    return true;
                case "Clear":
                    $scope.courierDeliveryDataDefinition.DataList = [];
                    //Required if pagination is enabled
                    if ($scope.courierDeliveryDataDefinition.EnablePagination == true) {
                        $scope.courierDeliveryDataDefinition.CurrentPage = 1;
                        $scope.courierDeliveryDataDefinition.DoPagination = true;
                    }
                    return true;
                default: return true;
            }
        };
        $scope.courierDeliveryResetData = function () {
            $scope.courierDeliveryItem = {
                "Id": null,
                "CourierId": null,
                "Courier": [{
                    "Id": null,
                    "Name": null
                }],
                "BusinessUnitId": null,
                "BusinessUnit": [{
                    "Id": null,
                    "Code": null,
                    "Name": null
                }],
                "CourierCost": $filter('number')(0.00, 2),
                "CallDate": $filter('Date')(new Date()),
                "CallTime": $filter('Time')(new Date()),
                "CourierTransactionDetails": {}
            }
            //Temporary set BusinessUnit
            $scope.courierDeliveryItem.BusinessUnit = [{
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
            }];
            $scope.courierDeliveryItem.BusinessUnitId = $scope.courierDeliveryItem.BusinessUnit[0].Id;
        };

        $scope.courierDeliveryShowFormError = function (error) {
            $scope.courierDeliveryIsError = true;
            $scope.courierDeliveryErrorMessage = error;
        };

        $scope.initializeCourierDeliveryDataDefinition();
        $scope.initializeCourierDeliverySubmitDefinition();
    };

    //Load filtering for compiling
    $scope.loadCourierDeliveryFiltering = function () {
        $scope.initCourierDeliveryFilteringParameters();
        $scope.initCourierDeliveryFilteringContainter();
        $("#courierDeliveryToggle").slideToggle(function () { });
    };

    //initialize filtering parameters
    $scope.initCourierDeliveryFilteringContainter = function () {
        html = '<dir-filtering  filterdefinition="courierDeliveryFilteringDefinition"' +
                                'filterlistener="courierDeliveryDataDefinition.Retrieve"' +
                                'otheractions="courierDeliveryOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#courierDeliveryFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of filtering to DOM
    $scope.initCourierDeliveryFilteringParameters = function () {
        //Hide the filtering directive
        $scope.hideCourierDeliveryToggle = function () {
            var promise = $interval(function () {
                $("#courierDeliveryToggle").slideToggle(function () {
                    $scope.courierDeliveryToggle = false;
                });
                $interval.cancel(promise);
                promise = undefined;
            }, 200)
        };
        $scope.initCourierDeliveryFilteringDefinition = function () {
            $scope.courierDeliveryFilteringDefinition = {
                "Url": ($scope.courierDeliveryDataDefinition.EnablePagination == true ? 'api/CourierTransactions?type=paginate&param1=' + $scope.courierDeliveryDataDefinition.CurrentPage : 'api/CourierTransactions?type=scroll&param1=' + $scope.courierDeliveryDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index 0
                "Source": [
                            { "Index": 0, "Label": "Delivery Id", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "Delivery Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 2, "Label": "Courier", "Column": "CourierId", "Values": ["GetCourier"], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 3, "Label": "Business Unit", "Column": "BusinessUnitId", "Values": ['GetBusinessUnit'], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 4, "Label": "Call Date", "Column": "CallDate", "Values": [], "From": null, "To": null, "Type": "Date" }
                ],//Contains the Criteria definition
                "Multiple": true,
                "AutoLoad": false,
                "ClearData": false,
                "SetSourceToNull": false
            }
        };

        $scope.courierDeliveryOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.selectedTab = $scope.tabPages[1];
                    $scope.courierDeliverySource = $scope.courierDeliveryFilteringDefinition.Source;
                    //Optional in using this, can use switch if every source type has validation before filtering
                    for (var i = 0; i < $scope.courierDeliverySource.length; i++) {
                            $scope.courierDeliveryFilteringDefinition.DataItem1.CourierTransaction[0][$scope.courierDeliverySource[i].Column] = $scope.courierDeliverySource[i].From;
                            $scope.courierDeliveryFilteringDefinition.DataItem1.CourierTransaction[1][$scope.courierDeliverySource[i].Column] = $scope.courierDeliverySource[i].To;
                    }
                    //Delete keys that the value is null
                    for (var i = 0; i < $scope.courierDeliverySource.length; i++) {
                        if ($scope.courierDeliveryFilteringDefinition.DataItem1.CourierTransaction[0][$scope.courierDeliverySource[i].Column] == null) {
                            delete $scope.courierDeliveryFilteringDefinition.DataItem1.CourierTransaction[0][$scope.courierDeliverySource[i].Column];
                            delete $scope.courierDeliveryFilteringDefinition.DataItem1.CourierTransaction[1][$scope.courierDeliverySource[i].Column];
                        }
                    }

                    if ($scope.courierDeliveryDataDefinition.EnablePagination == true && $scope.courierDeliveryFilteringDefinition.ClearData) {
                        $scope.courierDeliveryDataDefinition.CurrentPage = 1;
                        $scope.courierDeliveryFilteringDefinition.Url = 'api/CourierTransactions?type=paginate&param1=' + $scope.courierDeliveryDataDefinition.CurrentPage;
                    }
                    else if ($scope.courierDeliveryDataDefinition.EnablePagination == true) {
                        $scope.courierDeliveryDataDefinition.DataList = [];
                        $scope.courierDeliveryFilteringDefinition.Url = 'api/CourierTransactions?type=paginate&param1=' + $scope.courierDeliveryDataDefinition.CurrentPage;
                    }
                    //Scroll
                    else {
                        if ($scope.courierDeliveryFilteringDefinition.ClearData)
                            $scope.courierDeliveryDataDefinition.DataList = [];
                        $scope.courierDeliveryFilteringDefinition.Url = 'api/CourierTransactions?type=scroll&param1=' + $scope.courierDeliveryDataDefinition.DataList.length;
                    }
                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize courierDeliveryDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize courierDeliveryDataDefinition DataList by pushing each value of filterDefinition DataList*/
                    //Required
                    $scope.courierDeliveryFilteringDefinition.DataList = $scope.courierDeliveryFilteringDefinition.DataList;
                    if ($scope.courierDeliveryDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.courierDeliveryFilteringDefinition.DataList.length; j++)
                            $scope.courierDeliveryDataDefinition.DataList.push($scope.courierDeliveryFilteringDefinition.DataList[j]);
                    }

                    if ($scope.courierDeliveryDataDefinition.EnablePagination == true) {
                        $scope.courierDeliveryDataDefinition.DataList = [];
                        $scope.courierDeliveryDataDefinition.DataList = $scope.courierDeliveryFilteringDefinition.DataList;
                        $scope.courierDeliveryDataDefinition.DoPagination = true;
                    }

                    if ($scope.courierDeliveryToggle == true)
                        $scope.hideCourierDeliveryToggle();
                    return true;
                case 'GetBusinessUnit':
                    $scope.modalWatcher = "GetBusinessUnit";
                    //Show modal here then after user choose a specific data to filter pass the to From field in the source where Values[0] is equal to the action, ex. GetBusinessUnitList
                    //Use if filtering criteria is modal
                    $scope.showBusinessUnit();
                    return true;
                case 'GetCourier':
                    //Show modal here then after user choose a specific data to filter pass the to From field in the source where Values[0] is equal to the action, ex. GetBusinessUnitList
                    //Use if filtering criteria is modal
                    $scope.modalWatcher = "GetCourier";
                    $scope.showCourier();
                    return true;
                default: return true;
            }
        };

        $scope.initCourierDeliveryDataItems = function () {
            $scope.courierDeliveryObj = {
                "CourierTransaction": [{
                                        "CourierId": null,
                                        "BusinessUnitId": null,
                                        "CallDate": null
                                    }, {
                                        "CourierId": null,
                                        "BusinessUnitId": null,
                                        "CallDate": null
                                    }]
            }
            $scope.courierDeliveryFilteringDefinition.DataItem1 = angular.copy($scope.courierDeliveryObj);
        };

        $scope.initCourierDeliveryFilteringDefinition();
        $scope.initCourierDeliveryDataItems();
    };
    //=====================================END OF COURIER DELIVERY FILTERING AND DATAGRID===================

    //====================================COURIER DELIVERY DETAIL DATAGRID==========================
    //Load courierDeliveryDetails datagrid for compiling
    $scope.loadCourierDeliveryDetailsDataGrid = function () {
        $scope.initCourierDeliveryDetailsDataGrid();
        $scope.compileCourierDeliveryDetailsDataGrid();
    };

    //initialize courierDeliveryDetails datagrid parameters
    $scope.initCourierDeliveryDetailsDataGrid = function () {
        $scope.initializeCourierDeliveryDetailsDataDefinition = function () {
            $scope.courierDeliveryDetailsDataDefinition = {
                "Header": ['Shipment No', 'Cost Allocation', 'Transport Status', 'Booking Date', 'Business Unit', 'Operating Site', 'Service', 'Shipment Type', 'Payment Mode', 'Booking Remarks', 'Qty', 'Total CBM', 'Cargo Description', 'Pickup Address', 'Target Pickup Date', 'Target Pickup Time', 'Customer', 'Customer Address', 'Customer Contact No', 'Consignee', 'Consignee Address', 'Consignee Contact No', 'No.'],
                "Keys": ['ShipmentId', 'CostAllocation', 'Shipment[0].TransportStatusId', 'Shipment[0].CreatedDate', 'Shipment[0].BusinessUnit.Name', 'Shipment[0].BusinessUnit1.Name', 'Shipment[0].Service.Name', 'Shipment[0].ShipmentType.Name', 'Shipment[0].PaymentMode', 'Shipment[0].BookingRemarks', 'Shipment[0].Quantity', 'Shipment[0].TotalCBM', 'Shipment[0].Description', 'Shipment[0].OriginAddress', 'Shipment[0].PickupDate', 'Shipment[0].PickupTime', 'Shipment[0].Customer.Name', 'Shipment[0].Customer.CustomerAddresses[0].Line1', 'Shipment[0].Customer.CustomerContacts[0].Contact.ContactPhones[0].ContactNumber', 'Shipment[0].DeliverTo', 'Shipment[0].DeliveryAddress', 'Shipment[0].DeliverToContactNo'],
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
                "DataTarget": "CourierDeliveryDetailsMenu",
                "DataTarget2": "CourierDeliveryDetailsMenu2",
                "ShowCreate": false,
                "ShowContextMenu": true,
                "ContextMenu": ["'Create'", "'Delete'"],
                "ContextMenuLabel": ['Add Shipment','Delete']
            }
        };

        $scope.initializeCourierDeliveryDetailsSubmitDefinition = function () {
            $scope.courierDeliveryDetailsSubmitDefinition = {
                "Submit": false, //By default
                "APIUrl": '',
                "Type": 'Create', //By Default
                "DataItem": {},
                "Index": -1 //By Default
            }
        };

        $scope.courierDeliveryDetailsOtheractions = function (action) {
            switch (action) {
                case "FormCreate":
                    return true;
                case "PreAction":
                    return true;
                case "PreCreateAction":
                    if (!$scope.viewOnly) {
                        var upperRow = $scope.courierDeliveryDetailsDataDefinition.DataList.length - 1;
                        if ($scope.courierDeliveryDetailsDataDefinition.DataList[upperRow].ShipmentId == 0) {
                            $scope.courierDeliveryIsError = true;
                            $scope.courierDeliveryErrorMessage = "Shipment is required.";
                            $scope.focusOnTop();
                            return false;
                        }
                        else if ($scope.courierDeliveryDetailsDataDefinition.DataList[upperRow].CostAllocation == null || $scope.courierDeliveryDetailsDataDefinition.DataList[upperRow].CostAllocation == 0) {
                            $scope.courierDeliveryIsError = true;
                            $scope.courierDeliveryErrorMessage = "Cost Allocation must be greater than zero.";
                            $scope.focusOnTop();
                            return false;
                        }
                        return true;
                    }
                    else
                        return false;
                case "PreEditAction":
                    if (!$scope.viewOnly)
                        return true;
                    else
                        return false;
                case "PostEditAction":
                    return true;
                case "PreDeleteAction":
                    if (!$scope.viewOnly)
                        return true;
                    else
                        return false;
                case "PostDeleteAction":
                    $scope.courierDeliveryDetailsDataDefinition.DataList.splice($scope.courierDeliveryDetailsSubmitDefinition.Index, 1);
                    if ($scope.courierDeliveryDetailsDataDefinition.DataList.length == 0)
                        $scope.courierDeliveryDetailsResetData();
                    return true;
                case "PostViewAction":
                    return true;
                case "Clear":
                    $scope.courierDeliveryDetailsDataDefinition.DataList = [];
                    //Required if pagination is enabled
                    if ($scope.courierDeliveryDetailsDataDefinition.EnablePagination == true) {
                        $scope.courierDeliveryDetailsDataDefinition.CurrentPage = 1;
                        $scope.courierDeliveryDetailsDataDefinition.DoPagination = true;
                    }
                    return true;
                case "Shipment No":
                    if(!$scope.viewOnly)
                        //if datalist is only 1 then directly insert
                        $scope.showShipment();
                    return true;
                default: return true;
            }
        };

        $scope.courierDeliveryDetailsResetData = function () {
            $scope.courierDeliveryDetailsItem = {
                "Id": null,
                "CourierTransactionId": -1,
                "ShipmentId": 0,
                "Shipment": [{}],
                "CostAllocation": null
            }

            $scope.courierDeliveryIsError = false;
            $scope.courierDeliveryErrorMessage = "";
            //Added 1 row in Courier Delivery Details
            $scope.courierDeliveryDetailsTemporyId = $scope.courierDeliveryDetailsTemporyId + 1;
            $scope.courierDeliveryDetailsItem.Id = $scope.courierDeliveryDetailsTemporyId;
            $scope.courierDeliveryDetailsDataDefinition.DataList.push($scope.courierDeliveryDetailsItem);

        };

        $scope.courierDeliveryDetailsShowFormError = function (error) {
            $scope.courierDeliveryDetailsIsError = true;
            $scope.courierDeliveryDetailsErrorMessage = error;
        };

        $scope.initializeCourierDeliveryDetailsDataDefinition();
        $scope.initializeCourierDeliveryDetailsSubmitDefinition();
    };

    //function that will be invoked during compiling datagrid to DOM
    $scope.compileCourierDeliveryDetailsDataGrid = function () {
        var html = '<dir-data-grid2 datadefinition      = "courierDeliveryDetailsDataDefinition"' +
                                    'submitdefinition   = "courierDeliveryDetailsSubmitDefinition"' +
                                    'otheractions       = "courierDeliveryDetailsOtheractions(action)"' +
                                    'resetdata          = "courierDeliveryDetailsResetData()"' +
                                    'showformerror      = "courierDeliveryDetailsShowFormError(error)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#courierDeliveryDetailsContainer')).html(html);
        $compile($content)($scope);
    };
    //=====================================END OF COURIER DELIVERY DETAIL DATAGRID===================

    //=====================================START OF COURIER MODAL/REPORT=============================
    $scope.showCourier = function () {
        openModalPanel2("#courier-list-modal");
        $scope.loadCourierDataGrid();
        $scope.loadCourierFiltering();
        $scope.courierFilteringDefinition.SetSourceToNull = true;
        $scope.courierDataDefinition.Retrieve = true;
    };

    //Load Courier filtering for compiling
    $scope.loadCourierFiltering = function () {
        $scope.initCourierFilteringParameters();
        $scope.initCourierFilteringContainter();
    };

    //initialize Courier filtering parameters
    $scope.initCourierFilteringContainter = function () {
        html = '<dir-filtering  id="courierFilter" filterdefinition="courierFilteringDefinition"' +
                                'filterlistener="courierDataDefinition.Retrieve"' +
                                'otheractions="courierOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#courierFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of courier unit filtering to DOM
    $scope.initCourierFilteringParameters = function () {
        $scope.initCourierFilteringDefinition = function () {
            $scope.courierFilteringDefinition = {
                "Url": ($scope.courierDataDefinition.EnablePagination == true ? 'api/Couriers?type=paginate&param1=' + $scope.courierDataDefinition.CurrentPage : 'api/Couriers?type=scroll&param1=' + $scope.courierDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index
                "Source": [
                            { "Index": 0, "Label": "Name", "Column": "Name", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "TIN", "Column": "TIN", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 2, "Label": "Street Address 1", "Column": "Line1", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 3, "Label": "Street Address 2", "Column": "Line2", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 4, "Label": "Postal Code", "Column": "PostalCode", "Values": [], "From": null, "To": null, "Type": "Default" },
                ],//Contains the Criteria definition
                "Multiple": false,
                "AutoLoad": false,
                "ClearData": false,
                "SetSourceToNull": false
            }
        };

        $scope.courierOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.courierSource = $scope.courierFilteringDefinition.Source;
                    //Optional in using this, can use switch if every source type has validation before filtering
                    for (var i = 0; i < $scope.courierSource.length; i++) {
                        if ($scope.courierSource[i].Type == "Date") {
                            $scope.courierFilteringDefinition.DataItem1.Courier[0][$scope.courierSource[i].Column] = $scope.courierSource[i].From;
                            $scope.courierFilteringDefinition.DataItem1.Courier[1][$scope.courierSource[i].Column] = $scope.courierSource[i].To;
                        }
                        else
                            $scope.courierFilteringDefinition.DataItem1.Courier[0][$scope.courierSource[i].Column] = $scope.courierSource[i].From;
                    }
                    //Delete keys that the value is null
                    for (var i = 0; i < $scope.courierSource.length; i++) {
                        if ($scope.courierFilteringDefinition.DataItem1.Courier[0][$scope.courierSource[i].Column] == null) {
                            delete $scope.courierFilteringDefinition.DataItem1.Courier[0][$scope.courierSource[i].Column];
                            delete $scope.courierFilteringDefinition.DataItem1.Courier[1][$scope.courierSource[i].Column];
                        }
                    }

                    if ($scope.courierDataDefinition.EnablePagination == true && $scope.courierFilteringDefinition.ClearData) {
                        $scope.courierDataDefinition.CurrentPage = 1;
                        $scope.courierFilteringDefinition.Url = 'api/Couriers?type=paginate&param1=' + $scope.courierDataDefinition.CurrentPage;
                    }
                    else if ($scope.courierDataDefinition.EnablePagination == true) {
                        $scope.courierDataDefinition.DataList = [];
                        $scope.courierFilteringDefinition.Url = 'api/Couriers?type=paginate&param1=' + $scope.courierDataDefinition.CurrentPage;
                    }
                        //Scroll
                    else {
                        if ($scope.courierFilteringDefinition.ClearData)
                            $scope.courierDataDefinition.DataList = [];
                        $scope.courierFilteringDefinition.Url = 'api/Couriers?type=scroll&param1=' + $scope.courierDataDefinition.DataList.length;
                    }
                    $scope.courierFilteringDefinition.DataItem1.Courier[0].Id = 0;
                    $scope.courierFilteringDefinition.DataItem1.Courier[1].Id = 0;
                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize businessUnitDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize businessUnitDataDefinition DataList by pushing each value of filterDefinition DataList*/
                    //Required
                    //$scope.businessUnitFilteringDefinition.DataList = $rootScope.formatBusinessUnit($scope.businessUnitFilteringDefinition.DataList);
                    if ($scope.courierDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.courierFilteringDefinition.DataList.length; j++)
                            $scope.courierDataDefinition.DataList.push($scope.courierFilteringDefinition.DataList[j]);
                    }

                    if ($scope.courierDataDefinition.EnablePagination == true) {
                        $scope.courierDataDefinition.DataList = [];
                        $scope.courierDataDefinition.DataList = $scope.courierFilteringDefinition.DataList;
                        $scope.courierDataDefinition.DoPagination = true;
                    }
                    return true;
                default: return true;
            }
        };

        $scope.initCourierDataItems = function () {
            $scope.courierFilteringDefinition.DataItem1 = angular.copy($rootScope.courierObj());
        };

        $scope.initCourierFilteringDefinition();
        $scope.initCourierDataItems();
    };

    //Load Courier datagrid for compiling
    $scope.loadCourierDataGrid = function () {
        $scope.initCourierDataGrid();
        $scope.compileCourierDataGrid();
    };

    //initialize Courier datagrid parameters
    $scope.initCourierDataGrid = function () {
        $scope.courierSubmitDefinition = undefined;
        $scope.initializeCourierDataDefinition = function () {
            $scope.courierDataDefinition = {
                "Header": ['Name', 'Street Address 1', 'Street Address 2', 'City/Municipality', 'Postal Code', 'No.'],
                "Keys": ['Name', 'Line1', 'Line2', 'CityMunicipality[0].Name', 'PostalCode'],
                "Type": ['ProperCase', 'ProperCase', 'ProperCase', 'ProperCase', 'Default'],
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
                "DataTarget": "CourierMenu",
                "DataTarget2": "CourierMenu2",
                "ShowCreate": false,
                "ShowContextMenu": false,
                "ContextMenu": [""],
                "ContextMenuLabel": [""]
            }
            //Optional if row template
            $scope.courierDataDefinition.RowTemplate = '<div>' +
                                                                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
            '</div>';
        };
        $scope.courierOtherActions = function (action) {
            switch (action) {
                case 'PostEditAction':
                    if ($scope.modalWatcher != "GetCourier") {
                        $scope.courierDeliveryItem.Courier[0].Name = $scope.courierDataDefinition.DataItem.Name;
                        $scope.courierDeliveryItem.CourierId = $scope.courierDataDefinition.DataItem.Id;
                    }
                    else {
                        $scope.courierDeliveryFilteringDefinition.Source[1].From = $scope.courierDataDefinition.DataItem.Id;
                        $scope.courierDeliveryFilteringDefinition.Source[1].To = $scope.courierDataDefinition.DataItem.Name;
                    }
                    $scope.modalWatcher = "";
                    $scope.closeModal();
                    return true;
                default: return true;
            }
        };

        $scope.initializeCourierDataDefinition();
    };

    //function that will be invoked during compiling of datagrid to DOM
    $scope.compileCourierDataGrid = function () {
        var html = '<dir-data-grid2 id = "courierGrid" datadefinition      = "courierDataDefinition"' +
                                    'submitdefinition   = "courierSubmitDefinition"' +
                                    'otheractions       = "courierOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#courierContainer')).html(html);
        $compile($content)($scope);
    };
    //=======================================END OF COURIER MODAL/REPORT==============================

    //=====================================SHIPMENT MODAL/REPORT======================================
    $scope.showShipment = function () {
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
                "Url": ($scope.shipmentDataDefinition.EnablePagination == true ? 'api/Shipments?type=paginate&source=courier&param1=' + $scope.shipmentDataDefinition.CurrentPage : 'api/Shipments?type=scroll&param1=' + $scope.shipmentDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index 
                "Source": [
                            { "Index": 0, "Label": "Shipment No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "Booking Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 2, "Label": "Service", "Column": "ServiceId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 3, "Label": "Shipment Type", "Column": "ShipmentTypeId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 4, "Label": "Payment Mode", "Column": "PaymentMode", "Values": $scope.paymentModeList, "From": null, "To": null, "Type": "DropDown" },
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
                        $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=paginate&source=courier&param1=' + $scope.shipmentDataDefinition.CurrentPage;
                    }
                    else if ($scope.shipmentDataDefinition.EnablePagination == true) {
                        $scope.shipmentDataDefinition.DataList = [];
                        $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=paginate&source=courier&param1=' + $scope.shipmentDataDefinition.CurrentPage;
                    }
                    //Scroll
                    else {
                        if ($scope.shipmentFilteringDefinition.ClearData)
                            $scope.shipmentDataDefinition.DataList = [];
                        $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=scroll&source=courier&param1=' + $scope.shipmentDataDefinition.DataList.length;
                    }
                    $scope.shipmentFilteringDefinition.DataItem1.Shipment[0].BusinessUnitId = $scope.courierDeliveryItem.BusinessUnitId;
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
                    for (var i = 0; i < $scope.courierDeliveryDetailsDataDefinition.DataList.length; i++) {
                        if ($scope.courierDeliveryDetailsDataDefinition.DataList[i].ShipmentId == $scope.shipmentDataDefinition.DataItem.Id) {
                            found = true;
                            i = $scope.courierDeliveryDetailsDataDefinition.DataList;
                        }
                    }
                    //Check if shipment is not yet in the list
                    if (!found) {
                        var shipmentHolder = [];
                        var originAddress = $scope.shipmentDataDefinition.DataItem.Address1;
                        var deliveryAddress = $scope.shipmentDataDefinition.DataItem.Address;
                        shipmentHolder.push($scope.shipmentDataDefinition.DataItem);
                        $scope.courierDeliveryDetailsItem.ShipmentId = $scope.shipmentDataDefinition.DataItem.Id;
                        $scope.courierDeliveryDetailsItem.Shipment = shipmentHolder;
                        $scope.courierDeliveryDetailsItem.Shipment[0].OriginAddress = $scope.initializeAddressField(originAddress);
                        $scope.courierDeliveryDetailsItem.Shipment[0].DeliveryAddress = $scope.initializeAddressField(deliveryAddress);
                        $scope.courierDeliveryIsError = false;
                        $scope.courierDeliveryErrorMessage = "";
                    }
                    else {
                        $scope.courierDeliveryIsError = true;
                        $scope.courierDeliveryErrorMessage = "Shipment is already in the list.";

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
                    //$scope.businessUnitFilteringDefinition.DataItem1.BusinessUnit[0].ParentBusinessUnitId = $scope.courierDeliveryItem.BusinessUnitId;
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
                        $scope.courierDeliveryItem.BusinessUnit[0]  = $scope.businessUnitDataDefinition.DataItem;
                        $scope.courierDeliveryItem.BusinessUnitId   = $scope.businessUnitDataDefinition.DataItem.Id;
                    }
                    else {
                        $scope.courierDeliveryFilteringDefinition.Source[2].From = $scope.businessUnitDataDefinition.DataItem.Id;
                        $scope.courierDeliveryFilteringDefinition.Source[2].To = $scope.businessUnitDataDefinition.DataItem.Name;
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

    // Initialization routines
    var init = function () {
        $scope.initPaymentModeList();
        $scope.initServiceList();
        $scope.initShipmentTypeList();
        $scope.loadCourierDeliveryDataGrid();
        $scope.loadCourierDeliveryFiltering();
        $scope.loadCourierDeliveryDetailsDataGrid();
        $rootScope.manipulateDOM();
        
        //Initialize Courier Delivery DataItem
        $scope.courierDeliveryResetData();
        //Initialize Courier Delivery Details DataItem
        $scope.courierDeliveryDetailsResetData();
        
        if ($scope.courierDeliveryFilteringDefinition.AutoLoad == true)
            $scope.courierDeliveryDataDefinition.Retrieve = true;
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
