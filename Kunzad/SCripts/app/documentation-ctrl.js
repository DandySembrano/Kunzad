﻿kunzadApp.controller("DocumentationController", BookingController);
function BookingController($scope, $http, $interval, $filter, $rootScope, $compile) {
    $scope.modelName = "Documentation";
    $scope.modelhref = "#/documentation";
    $scope.isPrevPage = false;
    $scope.isNextPage = true;
    $scope.actionMode = "Create";
    $scope.selected = null;
    $scope.currentPage = 1;
    $scope.viewOnly = false;
    $scope.shipmentIsError = false;
    $scope.shipmentErrorMessage = "";
    $scope.shipmentIsErrorAddress = false;
    $scope.shipmentErrorMessageAddress = "";
    $scope.submitButtonText = "Submit";
    $scope.tabPages = ["Information", "List"];
    $scope.selectedTab = $scope.tabPages[0];
    $scope.tabPages1 = ["Booking Info", "Revenue"];
    $scope.selectedTab1 = $scope.tabPages1[0];
    $scope.modalType = null;
    $scope.showMenu = false;
    $scope.shipmentToggle = false;
    $scope.isRevenue = false;
    $scope.isTaxInclusive = false;
    var pageSize = 20;

    //function that will be called during submit
    $scope.submit = function () {
        $scope.shipmentIsError = false;
        $scope.shipmentErrorMessage = "";
        $scope.shipmentSubmitDefinition.Submit = true;
    };

    //function that will be invoked when user click tab
    $scope.setSelectedTab = function (tab) {
        $scope.shipmentIsError = false;
        $scope.shipmentErrorMessage = "";
        $scope.selectedTab = tab;
    };

    //function that will be invoked when user click tab
    $scope.setSelectedTab1 = function (tab1) {
        $scope.shipmentIsError = false;
        $scope.shipmentErrorMessage = "";
        $scope.selectedTab1 = tab1;
    };

    //Set the focus on top of the page during load
    $scope.focusOnTop = function () {
        $(document).ready(function () {
            $(this).scrollTop(0);
        });
    };

    //Initialize address field
    $scope.initializeAddressField = function (addressItem, type) {
        $scope.formattedAddress = addressItem.Line1 + (addressItem.Line2 == "" || addressItem.Line2 == null ? " " : ", " + addressItem.Line2) + "\n";
        $scope.formattedAddress += addressItem.CityMunicipality.Name + ", " + (addressItem.CityMunicipality.StateProvince == null ? "" : addressItem.CityMunicipality.StateProvince.Name + "\n");
        $scope.formattedAddress += $scope.country.Name + ", " + addressItem.PostalCode;
        if ($scope.modalType == "Pickup")
            $scope.shipmentItem.OriginAddress = $scope.formattedAddress;
        else if ($scope.modalType == "Consignee")
            $scope.shipmentItem.DeliveryAddress = $scope.formattedAddress;
        else {//MasterList Display
            return $scope.formattedAddress;
        }
    };

    $scope.setSelected = function (id) {
        alert(id);
        $scope.setSelectedShipmentId = id;
    };

    //Function that will trigger during Edit,Delete and View Action
    $scope.onEDV = function () {
        $scope.shipmentItem = [];
        $scope.shipmentItem = angular.copy($scope.shipmentDataDefinition.DataItem);
        $scope.shipmentItem.CustomerAddress = $scope.shipmentItem.Customer.CustomerAddresses[0].Line1 + "," + $scope.shipmentItem.Customer.CustomerAddresses[0].Line2 + "\n" + $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.Name + "," + $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.StateProvince.Name + "\n" + $scope.shipmentItem.Customer.CustomerAddresses[0].PostalCode + ", " + $scope.country.Name;
        $scope.shipmentItem.PickupDate = $filter('Date')($scope.shipmentItem.PickupDate);
        $scope.controlNoHolder = $scope.shipmentItem.Id;
        $scope.shipmentItem.Id = $rootScope.formatControlNo('', 15, $scope.shipmentItem.Id);
    };

    //====================================SHIPMENT FILTERING AND DATAGRID==========================
    //Load shipment datagrid for compiling
    $scope.loadShipmentDataGrid = function () {
        $scope.initShipmentDataGrid();
        $scope.compileShipmentDataGrid();
    };

    //initialize shipment datagrid parameters
    $scope.initShipmentDataGrid = function () {
        $scope.initializeShipmentDataDefinition = function () {
            $scope.shipmentDataDefinition = {
                "Header": ['Shipment No', 'Transport Status', 'Booking Date', 'Business Unit', 'Operating Site', 'Service', 'Shipment Type', 'Payment Mode', 'Booking Remarks', 'Qty', 'Total CBM', 'Cargo Description', 'Pickup Address', 'Target Pickup Date', 'Target Pickup Time', 'Customer', 'Customer Address', 'Customer Contact No', 'Consignee', 'Consignee Address', 'Consignee Contact No', 'No.'],
                "Keys": ['Id', 'TransportStatusId', 'CreatedDate', 'BusinessUnit.Name', 'BusinessUnit1.Name', 'Service.Name', 'ShipmentType.Name', 'PaymentMode', 'BookingRemarks', 'Quantity', 'TotalCBM', 'Description', 'OriginAddress', 'PickupDate', 'PickupTime', 'Customer.Name', 'Customer.CustomerAddresses[0].Line1', 'Customer.CustomerContacts[0].Contact.ContactPhones[0].ContactNumber', 'DeliverTo', 'DeliveryAddress', 'DeliverToContactNo'],
                "Type": ['ControlNo', 'TransportStatus', 'Date', 'ProperCase', 'ProperCase', 'ProperCase', 'ProperCase', 'PaymentMode', 'Default', 'Default', 'Decimal', 'Default', 'ProperCase', 'Date', 'Time', 'ProperCase', 'ProperCase', 'Default', 'ProperCase', 'ProperCase', 'Default'],
                "ColWidth": [150, 150, 150, 150, 150, 150, 150, 150, 200, 100, 150, 200, 300, 150, 150, 200, 200, 200, 200, 300, 200],
                "DataList": [],
                "RequiredFields": ['ServiceId-Service', 'ShipmentTypeId-Shipment Type', 'CustomerId-Customer', 'Quantity-Quantity', 'TotalCBM-Total CBM', 'Description-Cargo Description', 'PaymentMode-Payment Mode', 'DeliverTo-Consignee', 'DeliveryAddress-Consignee address', 'PickUpBussinessUnitId-Operation Site', 'OriginAddress-Pickup address'],
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
                "ShowContextMenu": true,
                "ContextMenu": ["'Edit'", "'Find'"],
                "ContextMenuLabel": ['Edit', 'Find']
            }
        };

        $scope.initializeShipmentSubmitDefinition = function () {
            $scope.shipmentSubmitDefinition = {
                "Submit": false, //By default
                "APIUrl": '/api/Shipments',
                "Type": 'Create', //By Default
                "DataItem": {},
                "Index": -1 //By Default
            }
        };

        $scope.shipmentOtheractions = function (action) {
            switch (action) {
                case "FormCreate":
                    $scope.shipmentResetData();
                    $scope.viewOnly = false;
                    $scope.submitButtonText = "Submit";
                    $scope.shipmentSubmitDefinition.Type = "Create";
                    $scope.deliveryAddressDataDefinition.ViewOnly = false;
                    $scope.deliveryAddressDataDefinition.ActionMode = "Create";
                    $scope.pickupAddressDataDefinition.ViewOnly = false;
                    $scope.pickupAddressDataDefinition.ActionMode = "Create";
                    return true;
                //case "PreAction":
                //    $scope.selectedTab = $scope.tabPages[0];
                //    $scope.shipmentIsError = false;
                //    $scope.shipmentErrorMessage = "";
                //    return true;
                //case "PostCreateAction":
                //    $scope.viewOnly = false;
                //    $scope.submitButtonText = "Submit";
                //    $scope.shipmentSubmitDefinition.Type = "Create";
                //    $scope.deliveryAddressDataDefinition.ViewOnly = false;
                //    $scope.deliveryAddressDataDefinition.ActionMode = "Create";
                //    $scope.pickupAddressDataDefinition.ViewOnly = false;
                //    $scope.pickupAddressDataDefinition.ActionMode = "Create";
                //    return true;
                case "PostEditAction":
                    $scope.onEDV();
                    $scope.viewOnly = false;
                    $scope.submitButtonText = "Submit";
                    $scope.shipmentSubmitDefinition.Type = "Edit";
                    $scope.setSelectedTab = $scope.tabPages[0];
                    return true;
                //case "PostDeleteAction":
                //    $scope.onEDV();
                //    $scope.viewOnly = true;
                //    $scope.submitButtonText = "Cancel";
                //    $scope.shipmentSubmitDefinition.Type = "Delete";
                //    $scope.deliveryAddressDataDefinition.ViewOnly = true;
                //    $scope.deliveryAddressDataDefinition.ActionMode = "Delete";
                //    $scope.pickupAddressDataDefinition.ViewOnly = true;
                //    $scope.pickupAddressDataDefinition.ActionMode = "Delete";
                //    return true;
                //case "PostViewAction":
                //    $scope.onEDV();
                //    $scope.viewOnly = true;
                //    $scope.submitButtonText = "Close";
                //    $scope.shipmentSubmitDefinition.Type = "View";
                //    $scope.deliveryAddressDataDefinition.ViewOnly = true;
                //    $scope.deliveryAddressDataDefinition.ActionMode = "View";
                //    $scope.pickupAddressDataDefinition.ViewOnly = true;
                //    $scope.pickupAddressDataDefinition.ActionMode = "View";
                //    return true;
                //case "PreSubmit":
                //    $scope.shipmentItem.Id = $scope.controlNoHolder;
                //    $scope.shipmentItem.PickupDate = $filter('date')(document.getElementById('pickupdate').value, "yyyy-MM-dd");
                //    $scope.shipmentItem.PickupTime = $filter('date')(document.getElementById('pickuptime').value, "hh:mm:ss");
                //    $scope.shipmentItem.TotalCBM = $filter('number')($scope.shipmentItem.TotalCBM, 4);
                //    $scope.shipmentSubmitDefinition.DataItem = angular.copy($scope.shipmentItem);
                //    return true;
                //case "PreSave":
                //    delete $scope.shipmentSubmitDefinition.DataItem.Id;
                //    delete $scope.shipmentSubmitDefinition.DataItem.TransportStatusId;
                //    delete $scope.shipmentSubmitDefinition.DataItem.DeliveryAddressId;
                //    delete $scope.shipmentSubmitDefinition.DataItem.OriginAddressId;
                //    delete $scope.shipmentSubmitDefinition.DataItem.BusinessUnit;
                //    delete $scope.shipmentSubmitDefinition.DataItem.BusinessUnit1;
                //    delete $scope.shipmentSubmitDefinition.DataItem.Service;
                //    delete $scope.shipmentSubmitDefinition.DataItem.ShipmentType;
                //    delete $scope.shipmentSubmitDefinition.DataItem.Customer;
                //    delete $scope.shipmentSubmitDefinition.DataItem.Address.Id;
                //    delete $scope.shipmentSubmitDefinition.DataItem.Address1.Id;
                //    delete $scope.shipmentSubmitDefinition.DataItem.Address.CityMunicipality;
                //    delete $scope.shipmentSubmitDefinition.DataItem.Address1.CityMunicipality;
                //    return true;
                //case "PostSave":
                //    var addressHolder = $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality;
                //    $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality = {};
                //    $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.Id = addressHolder[0].Id;
                //    $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.Name = addressHolder[0].Name;
                //    $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.StateProvince = {};
                //    $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.StateProvince.Id = addressHolder[0].StateProvince.Id;
                //    $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.StateProvince.Name = addressHolder[0].StateProvince.Name;
                //    addressHolder = {};
                //    $scope.shipmentItem.Id = $scope.shipmentSubmitDefinition.DataItem.Id;
                //    $scope.shipmentItem.TransportStatusId = $scope.shipmentSubmitDefinition.DataItem.TransportStatusId;
                //    $scope.shipmentItem.DeliveryAddressId = $scope.shipmentSubmitDefinition.DataItem.DeliveryAddressId;
                //    $scope.shipmentItem.OriginAddressId = $scope.shipmentSubmitDefinition.DataItem.OriginAddressId;
                //    $scope.shipmentItem.Address.Id = $scope.shipmentSubmitDefinition.DataItem.Address.Id;
                //    $scope.shipmentItem.Address1.Id = $scope.shipmentSubmitDefinition.DataItem.Address1.Id;
                //    $scope.shipmentDataDefinition.DataItem = $scope.shipmentItem;
                //    alert("Successfully Saved.");
                //    $scope.onEDV();
                //    $scope.submitButtonText = "Submit";
                //    $scope.shipmentSubmitDefinition.Type = "Edit";
                //    $scope.viewOnly = true;
                //    return true;
                case "PreUpdate":
                    delete $scope.shipmentSubmitDefinition.DataItem.BusinessUnit;
                    delete $scope.shipmentSubmitDefinition.DataItem.BusinessUnit1;
                    delete $scope.shipmentSubmitDefinition.DataItem.Service;
                    delete $scope.shipmentSubmitDefinition.DataItem.ShipmentType;
                    delete $scope.shipmentSubmitDefinition.DataItem.Customer;
                    delete $scope.shipmentSubmitDefinition.DataItem.Address.CityMunicipality;
                    delete $scope.shipmentSubmitDefinition.DataItem.Address1.CityMunicipality;
                    return true;
                case "PostUpdate":
                    if ($scope.shipmentSubmitDefinition.Index != -1)
                        $scope.shipmentDataDefinition.DataList[$scope.shipmentSubmitDefinition.Index] = $scope.shipmentItem;
                    $scope.shipmentDataDefinition.DataItem = $scope.shipmentItem;
                    $scope.onEDV();
                    $scope.viewOnly = true;
                    alert("Successfully Updated.");
                    return true;
                //case "PreDelete":
                //    return true;
                //case "PostDelete":
                //    $scope.shipmentItem.TrasportStatusId = $scope.shipmentSubmitDefinition.DataItem.TrasportStatusId;
                //    if ($scope.shipmentSubmitDefinition.Index != -1)
                //        $scope.shipmentDataDefinition.DataList[$scope.shipmentSubmitDefinition.Index].TransportStatusId = $scope.shipmentSubmitDefinition.DataItem.TransportStatusId;
                //    $scope.shipmentDataDefinition.DataItem.TransportStatusId = $scope.shipmentSubmitDefinition.DataItem.TransportStatusId;
                //    $scope.onEDV();
                //    $scope.viewOnly = true;
                //    alert("Successfully Cancelled.");
                //    return true;
                //case "PostView":
                //    $scope.selectedTab = $scope.tabPages[1];
                //    return true;
                case "Find":
                    $scope.selectedTab = $scope.tabPages[1];
                    var promise = $interval(function () {
                        if ($scope.shipmentToggle == false) {
                            $("#shipmentToggle").slideToggle(function () {
                                $scope.shipmentToggle = true;
                            });
                        }
                        $interval.cancel(promise);
                        promise = undefined;
                    }, 200);
                    return true;
                //case "Clear":
                //    $scope.selectedTab = $scope.tabPages[1];
                //    $scope.shipmentDataDefinition.DataList = [];
                //    //Required if pagination is enabled
                //    if ($scope.shipmentDataDefinition.EnablePagination == true) {
                //        $scope.shipmentDataDefinition.CurrentPage = 1;
                //        $scope.shipmentDataDefinition.DoPagination = true;
                //    }
                //    return true;
                default: return true;
            }
        };

        $scope.shipmentResetData = function () {
            $scope.shipmentItem = {
                "Id": null,
                "BusinessUnitId": null,
                "BusinessUnit": {
                    "Id": null,
                    "Code": null,
                    "Name": null
                },
                "PickUpBussinessUnitId": null,
                "BusinessUnit1": {
                    "Id": null,
                    "Code": null,
                    "Name": null
                },
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
                "CustomerContactId": null,
                "CustomerContactPhoneId": null,
                "CustomerAddressId": null,
                "CustomerAddress": null,
                "Customer": {
                    "Id": null,
                    "Code": null,
                    "Name": null,
                    "TIN": null,
                    "CustomerAddresses": [{
                        "Line1": null,
                        "Line2": null,
                        "PostalCode": null,
                        "CityMunicipality": {
                            "Id": null,
                            "Name": null,
                            "StateProvince": {
                                "Id": null,
                                "Name": null
                            }
                        },
                    }],
                    "CustomerContacts": [{
                        "Contact": {
                            "ContactPhones": [{
                                "ContactNumber": null
                            }]
                        }
                    }],
                },
                "DeliverTo": null,
                "DeliveryAddressId": -1,
                "DeliveryAddress": null,
                //DeliveryAddress
                "Address": {
                    "Id": null,
                    "Line1": null,
                    "Line2": null,
                    "CityMunicipalityId": null,
                    "CityMunicipality": {
                        "Id": null,
                        "Name": null,
                        "StateProvince": {
                            "Id": null,
                            "Name": null
                        }
                    },
                    "PostalCode": null,
                    "CreatedDate": null,
                    "LastUpdatedDate": null,
                    "CreatedByUserId": null,
                    "LastUpdatedByUserId": null
                },
                "DeliverToContactNo": null,
                "Description": null,
                "OriginAddressId": -1,
                "OriginAddress": null,
                //OriginAddress
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
                            "Name": null
                        }
                    },
                    "PostalCode": null
                },
                "Quantity": 0,
                "TotalCBM": 0,
                "Description": null,
                "BookingRemarks": null,
                "PickupDate": null,
                "PickupTime": null,
                "TransportStatusId": null,
                "TransportStatusRemarks": null,
                "CreatedDate": null,
                "LastUpdatedDate": null,
                "CreatedByUserId": null,
                "LastUpdatedByUserId": null
            }
            //Temporary set BusinessUnit
            $scope.shipmentItem.BusinessUnit = {
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
            $scope.shipmentItem.BusinessUnitId = $scope.shipmentItem.BusinessUnit.Id;
        };

        $scope.shipmentShowFormError = function (error) {
            $scope.shipmentIsError = true;
            $scope.shipmentErrorMessage = error;
        };

        $scope.initializeShipmentDataDefinition();
        $scope.initializeShipmentSubmitDefinition();
    };

    //function that will be invoked during compiling of shipment datagrid to DOM
    $scope.compileShipmentDataGrid = function () {
        var html = '<dir-data-grid2 datadefinition      = "shipmentDataDefinition"' +
                                    'submitdefinition   = "shipmentSubmitDefinition"' +
                                    'otheractions       = "shipmentOtheractions(action)"' +
                                    'resetdata          = "shipmentResetData()"' +
                                    'showformerror      = "shipmentShowFormError(error)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#shipmentContainer')).html(html);
        $compile($content)($scope);
    };

    //Load shipment filtering for compiling
    $scope.loadShipmentFiltering = function () {
        $scope.initShipmentFilteringParameters();
        $scope.initShipmentFilteringContainter();
        $("#shipmentToggle").slideToggle(function () { });
    };

    //initialize shipment filtering parameters
    $scope.initShipmentFilteringContainter = function () {
        html = '<dir-filtering  filterdefinition="shipmentFilteringDefinition"' +
                                'filterlistener="shipmentDataDefinition.Retrieve"' +
                                'otheractions="shipmentOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#shipmentFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of shipment filtering to DOM
    $scope.initShipmentFilteringParameters = function () {
        //Hide the shipment filtering directive
        $scope.hideShipmentToggle = function () {
            var promise = $interval(function () {
                $("#shipmentToggle").slideToggle(function () {
                    $scope.shipmentToggle = false;
                });
                $interval.cancel(promise);
                promise = undefined;
            }, 200)
        };
        $scope.initShipmentFilteringDefinition = function () {
            $scope.shipmentFilteringDefinition = {
                "Url": ($scope.shipmentDataDefinition.EnablePagination == true ? 'api/Shipments?type=paginate&param1=' + $scope.shipmentDataDefinition.CurrentPage : 'api/Shipments?type=scroll&param1=' + $scope.shipmentDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value
                "Source": [
                            { "Index": 0, "Label": "Shipment No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "Booking Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            //{ "Index": 7, "Label": "Customer", "Column": "CustomerId", "Values": ['GetCustomers'], "From": null, "To": null, "Type": "Modal" },
                            //{ "Index": 8, "Label": "BusinessUnit", "Column": "BusinessUnitId", "Values": ['GetBusinessList'], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 2, "Label": "Service", "Column": "ServiceId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 3, "Label": "Shipment Type", "Column": "ShipmentTypeId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 4, "Label": "Payment Mode", "Column": "PaymentMode", "Values": $scope.paymentModeList, "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 5, "Label": "Target Pickup Date", "Column": "PickupDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            //{ "Index": 9, "Label": "Operation Site", "Column": "PickUpBussinessUnitId", "Values": ['GetBusinessList'], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 6, "Label": "Status", "Column": "TransportStatusId", "Values": $rootScope.getTransportStatusList(), "From": null, "To": null, "Type": "DropDown" }
                ],//Contains the Criteria definition
                "Multiple": true,
                "AutoLoad": false,
                "ClearData": false,
                "SetSourceToNull": false
            }
        };

        $scope.shipmentOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.selectedTab = $scope.tabPages[1];
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
                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize shipmentDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize shipmentDataDefinition DataList by pushing each value of filterDefinition DataList*/
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
                        $scope.shipmentDataDefinition.DataList[i].OriginAddress = $scope.initializeAddressField($scope.shipmentDataDefinition.DataList[i].Address1, 'MasterList');
                        //Initalize Consignee Address
                        $scope.shipmentDataDefinition.DataList[i].DeliveryAddress = $scope.initializeAddressField($scope.shipmentDataDefinition.DataList[i].Address, 'MasterList');
                    }
                    if ($scope.shipmentToggle == true)
                        $scope.hideShipmentToggle();
                    return true;
                case 'GetBusinessList':
                    //Show modal here then after user choose a specific data to filter pass the to From field in the source where Values[0] is equal to the action, ex. GetBusinessUnitList
                    //Use if filtering criteria is modal
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
    //=====================================END OF SHIPMENT FILTERING AND DATAGRID===================

    // Initialization routines
    var init = function () {
        $scope.focusOnTop();
        $scope.loadShipmentDataGrid();
        $scope.loadShipmentFiltering();
        $scope.shipmentResetData();
    };

    init();
}