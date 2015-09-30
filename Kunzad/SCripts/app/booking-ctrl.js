kunzadApp.controller("BookingController", BookingController);
function BookingController($scope, $http, $interval, $filter, $rootScope, $compile) {
    $scope.modelName = "Booking";
    $scope.modelhref = "#/booking";
    $scope.shipmentGridOptions = {};
    $scope.shipmentGridOptions.data = [];
    $scope.shipmentItem = {};
    $scope.viewOnly = false;
    $scope.shipmentIsError = false;
    $scope.shipmentErrorMessage = "";
    $scope.shipmentIsErrorAddress = false;
    $scope.shipmentErrorMessageAddress = "";
    $scope.submitButtonText = "Submit";
    $scope.tabPages = ["Information", "List"];
    $scope.selectedTab = "Information";
    $scope.controlNoHolder = 0;
    $scope.modalType = null;
    $scope.cityMunicipalities = null;
    $scope.serviceList = [];
    $scope.shipmentTypeList = [];
    $scope.shipmentToggle = false;
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
                "EnableScroll": false,
                "EnablePagination": true,
                "CurrentPage": 1, //By default
                "PageSize": 20, //Should be the same in back-end
                "DoPagination": false, //By default
                "Retrieve": false, //By default
                "DataItem": {},
                "DataTarget": "ShipmentMenu",
                "ShowCreate": true,
                "ShowContextMenu": true,
                "ContextMenu": ["'Load'", "'Create'", "'Edit'", "'Delete'", "'View'", "'Find'"],
                "ContextMenuLabel": ['Reload', 'Create', 'Edit', 'Cancel', 'View', 'Find']
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
        }

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
                case "PreAction":
                    $scope.selectedTab = $scope.tabPages[0];
                    $scope.shipmentIsError = false;
                    $scope.shipmentErrorMessage = "";
                    return true;
                case "PostCreateAction":
                    $scope.viewOnly = false;
                    $scope.submitButtonText = "Submit";
                    $scope.shipmentSubmitDefinition.Type = "Create";
                    $scope.deliveryAddressDataDefinition.ViewOnly = false;
                    $scope.deliveryAddressDataDefinition.ActionMode = "Create";
                    $scope.pickupAddressDataDefinition.ViewOnly = false;
                    $scope.pickupAddressDataDefinition.ActionMode = "Create";
                    return true;
                case "PostEditAction":
                    $scope.onEDV();
                    $scope.viewOnly = false;
                    $scope.submitButtonText = "Submit";
                    $scope.shipmentSubmitDefinition.Type = "Edit";
                    $scope.deliveryAddressDataDefinition.ViewOnly = false;
                    $scope.deliveryAddressDataDefinition.ActionMode = "Edit";
                    $scope.pickupAddressDataDefinition.ViewOnly = false;
                    $scope.pickupAddressDataDefinition.ActionMode = "Edit";
                    return true;
                case "PostDeleteAction":
                    $scope.onEDV();
                    $scope.viewOnly = true;
                    $scope.submitButtonText = "Cancel";
                    $scope.shipmentSubmitDefinition.Type = "Delete";
                    $scope.deliveryAddressDataDefinition.ViewOnly = true;
                    $scope.deliveryAddressDataDefinition.ActionMode = "Delete";
                    $scope.pickupAddressDataDefinition.ViewOnly = true;
                    $scope.pickupAddressDataDefinition.ActionMode = "Delete";
                    return true;
                case "PostViewAction":
                    $scope.onEDV();
                    $scope.viewOnly = true;
                    $scope.submitButtonText = "Close";
                    $scope.shipmentSubmitDefinition.Type = "View";
                    $scope.deliveryAddressDataDefinition.ViewOnly = true;
                    $scope.deliveryAddressDataDefinition.ActionMode = "View";
                    $scope.pickupAddressDataDefinition.ViewOnly = true;
                    $scope.pickupAddressDataDefinition.ActionMode = "View";
                    return true;
                case "PreSubmit":
                    $scope.shipmentItem.Id = $scope.controlNoHolder;
                    $scope.shipmentItem.PickupDate = $filter('date')(document.getElementById('pickupdate').value, "yyyy-MM-dd");
                    $scope.shipmentItem.PickupTime = $filter('date')(document.getElementById('pickuptime').value, "hh:mm:ss");
                    $scope.shipmentItem.TotalCBM = $filter('number')($scope.shipmentItem.TotalCBM, 4);
                    $scope.shipmentSubmitDefinition.DataItem = angular.copy($scope.shipmentItem);
                    return true;
                case "PreSave":
                    delete $scope.shipmentSubmitDefinition.DataItem.Id;
                    delete $scope.shipmentSubmitDefinition.DataItem.TransportStatusId;
                    delete $scope.shipmentSubmitDefinition.DataItem.DeliveryAddressId;
                    delete $scope.shipmentSubmitDefinition.DataItem.OriginAddressId;
                    delete $scope.shipmentSubmitDefinition.DataItem.BusinessUnit;
                    delete $scope.shipmentSubmitDefinition.DataItem.BusinessUnit1;
                    delete $scope.shipmentSubmitDefinition.DataItem.Service;
                    delete $scope.shipmentSubmitDefinition.DataItem.ShipmentType;
                    delete $scope.shipmentSubmitDefinition.DataItem.Customer;
                    delete $scope.shipmentSubmitDefinition.DataItem.Address.Id;
                    delete $scope.shipmentSubmitDefinition.DataItem.Address1.Id;
                    delete $scope.shipmentSubmitDefinition.DataItem.Address.CityMunicipality;
                    delete $scope.shipmentSubmitDefinition.DataItem.Address1.CityMunicipality;
                    return true;
                case "PostSave":
                    $scope.shipmentDataDefinition.DataItem = $scope.shipmentItem;
                    $scope.shipmentDataDefinition.DataItem.Id = $scope.shipmentSubmitDefinition.DataItem.Id;
                    $scope.shipmentDataDefinition.DataItem.TransportStatusId = $scope.shipmentSubmitDefinition.DataItem.TransportStatusId;
                    $scope.shipmentDataDefinition.DataItem.DeliveryAddressId = $scope.shipmentSubmitDefinition.DataItem.DeliveryAddressId;
                    $scope.shipmentDataDefinition.DataItem.OriginAddressId = $scope.shipmentSubmitDefinition.DataItem.OriginAddressId;
                    $scope.shipmentDataDefinition.DataItem.Address.Id = $scope.shipmentSubmitDefinition.DataItem.Address.Id;
                    $scope.shipmentDataDefinition.DataItem.Address1.Id = $scope.shipmentSubmitDefinition.DataItem.Address1.Id;
                    alert("Successfully Saved.");
                    $scope.onEDV();
                    $scope.submitButtonText = "Submit";
                    $scope.shipmentSubmitDefinition.Type = "Edit";
                    $scope.viewOnly = true;
                    return true;
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
                case "PreDelete":
                    return true;
                case "PostDelete":
                    $scope.shipmentItem.TrasportStatusId = $scope.shipmentSubmitDefinition.DataItem.TrasportStatusId;
                    if ($scope.shipmentSubmitDefinition.Index != -1)
                        $scope.shipmentDataDefinition.DataList[$scope.shipmentSubmitDefinition.Index] = $scope.shipmentItem;
                    $scope.shipmentDataDefinition.DataItem = $scope.shipmentItem;
                    $scope.onEDV();
                    $scope.viewOnly = true;
                    alert("Successfully Cancelled.");
                    return true;
                case "PostView":
                    $scope.selectedTab = $scope.tabPages[1];
                    return true;
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
                    },200);
                    return true;
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
                    "Name": null,
                    "BusinessUnitTypeId": null,
                    "ParentBusinessUnitId": null,
                    "isOperatingSite": null,
                    "hasAirPort": null,
                    "hasSeaPort": null,
                    "CreatedDate": null,
                    "LastUpdatedDate": null,
                    "CreatedByUserId": null,
                    "LastUpdatedByUserId": null
                },
                "PickUpBussinessUnitId": null,
                "BusinessUnit1": {
                    "Id": null,
                    "Code": null,
                    "Name": null,
                    "BusinessUnitTypeId": null,
                    "ParentBusinessUnitId": null,
                    "isOperatingSite": null,
                    "hasAirPort": null,
                    "hasSeaPort": null,
                    "CreatedDate": null,
                    "LastUpdatedDate": null,
                    "CreatedByUserId": null,
                    "LastUpdatedByUserId": null
                },
                "ServiceId": null,
                "Service": {
                    "Id": null,
                    "Name": null,
                    "ServiceCategoryId": null,
                    "Description": null,
                    "IsMultimodal": null,
                    "Length": null,
                    "Width": null,
                    "Height": null,
                    "MaxWeight": null,
                    "DeliveryWorkingDays": null,
                    "CreatedDate": null,
                    "LastUpdatedDate": null,
                    "CreatedByUserId": null,
                    "LastUpdatedByUserId": null
                },
                "ShipmentTypeId": null,
                "ShipmentType": {
                    "Id": null,
                    "Name": null,
                    "CreatedDate": null,
                    "LastUpdatedDate": null,
                    "CreatedByUserId": null,
                    "LastUpdatedByUserId": null
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
                    "PostalCode": null,
                    "CreatedDate": null,
                    "LastUpdatedDate": null,
                    "CreatedByUserId": null,
                    "LastUpdatedByUserId": null
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
            $scope.initBusinessUnitList();
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
                                    'resetdata          = "shipmentDataItem"' +
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
        $content = angular.element(document.querySelector('#filterContainter')).html(html);
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
        $scope.initFilteringDefinition = function () {
            $scope.shipmentFilteringDefinition = {
                "Url": ($scope.shipmentDataDefinition.EnablePagination == true ? 'api/Shipments?type=paginate&param1=' + $scope.shipmentDataDefinition.CurrentPage : 'api/Shipments?type=scroll&param1=' + $scope.shipmentDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index 0
                "DataItem2": $scope.DataItem2, //Contains the parameter value index 1
                "Source": [
                            { "Index": 0, "Label": "Shipment No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "Booking Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 2, "Label": "Customer", "Column": "CustomerId", "Values": [], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 3, "Label": "BusinessUnit", "Column": "BusinessUnitId", "Values": ['GetBusinessList'], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 4, "Label": "Service", "Column": "ServiceId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 5, "Label": "Shipment Type", "Column": "ShipmentTypeId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 6, "Label": "Payment Mode", "Column": "PaymentMode", "Values": $scope.paymentModeList, "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 7, "Label": "Target Pickup Date", "Column": "PickupDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 8, "Label": "Operation Site", "Column": "PickUpBussinessUnitId", "Values": [], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 9, "Label": "Status", "Column": "TransportStatusId", "Values": $rootScope.getTransportStatusList(), "From": null, "To": null, "Type": "DropDown" }
                ],//Contains the Criteria definition
                "Multiple": true,
                "AutoLoad": false,
                "ClearData": false
            }
        };

        $scope.shipmentOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.selectedTab = $scope.tabPages[1];
                    $scope.source = $scope.shipmentFilteringDefinition.Source;
                    //Optional in using this, can use switch if every source type has validation before filtering
                    for (var i = 0; i < $scope.source.length; i++) {
                        if ($scope.source[i].Type == "Date") {
                            $scope.shipmentFilteringDefinition.DataItem1[$scope.source[i].Column] = $scope.source[i].From;
                            $scope.shipmentFilteringDefinition.DataItem2[$scope.source[i].Column] = $scope.source[i].To;
                        }
                        else
                            $scope.shipmentFilteringDefinition.DataItem1[$scope.source[i].Column] = $scope.source[i].From;
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
                            $scope.shipmentDataDefinition.DataList.push($scope.shipmentFilteringDefinition.DataList[j])
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
                    if($scope.shipmentToggle == true)
                        $scope.hideShipmentToggle();
                    return true;
                case 'GetBusinessList':
                    //Show modal here then after user choose a specific data to filter pass the to From field in the source where Values[0] is equal to the action, ex. GetBusinessUnitList
                    //Use if filtering criteria is modal
                    return true;
                default: return true;
            }
        }

        $scope.initShipmentDataItems = function () {
            $scope.shipmentFilteringDefinition.DataItem1 = angular.copy($rootScope.shipmentObj());
            $scope.shipmentFilteringDefinition.DataItem2 = angular.copy($rootScope.shipmentObj());
        };

        $scope.initFilteringDefinition();
        $scope.initShipmentDataItems();
    };

    //function that will be called during submit
    $scope.submit = function () {
        $scope.shipmentIsError = false;
        $scope.shipmentErrorMessage = "";
        $scope.shipmentSubmitDefinition.Submit = true;
    }

    //Function that will trigger during Edit,Delete and View Action
    $scope.onEDV = function () {
        $scope.shipmentItem = [];
        $scope.shipmentItem = angular.copy($scope.shipmentDataDefinition.DataItem);
        $scope.shipmentItem.CustomerAddress = $scope.shipmentItem.Customer.CustomerAddresses[0].Line1 + "," + $scope.shipmentItem.Customer.CustomerAddresses[0].Line2 + "\n" + $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.Name + "," + $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.StateProvince.Name + "\n" + $scope.shipmentItem.Customer.CustomerAddresses[0].PostalCode + ", " + $scope.country.Name;
        $scope.shipmentItem.PickupDate = $filter('Date')($scope.shipmentItem.PickupDate);
        $scope.controlNoHolder = $scope.shipmentItem.Id;
        $scope.shipmentItem.Id = $rootScope.formatControlNo('', 15, $scope.shipmentItem.Id);
    };

    //Initialize Delivery Address Modal
    $scope.initDeliveryAddressModal = function () {
        $scope.showDeliveryAddress = false;
        $scope.deliveryAddressDataDefinition = {
            "ModalId": "consigneeModal",
            "DataItem": [],
            "ViewOnly": false, //By Default
            "ActionMode": "Create",//By Default
            "Header": "Consignee",
            "Container": ""
        };

        $scope.otherActionsDeliveryAddress = function (action) {
            switch (action) {
                case "PreOpen":
                    $scope.deliveryAddressDataDefinition.DataItem = $scope.shipmentItem.Address;
                    return true;
                case "PostClose":
                    $scope.shipmentItem.Address = $scope.deliveryAddressDataDefinition.DataItem;
                    $scope.shipmentItem.DeliveryAddress = $scope.deliveryAddressDataDefinition.Container;
                    return true;
                default: return true;
            }
        };
    };

    //Initialize Pickup Address Modal
    $scope.initPickupAddressModal = function () {
        $scope.showPickupAddress = false;
        $scope.pickupAddressDataDefinition = {
            "ModalId": "pickupModal",
            "DataItem": [],
            "ViewOnly": false, //By Default
            "ActionMode": "Create",//By Default
            "Header": "Pickup",
            "Container": ""
        };
        $scope.otherActionsPickupAddress = function (action) {
            switch (action) {
                case "PreOpen":
                    $scope.pickupAddressDataDefinition.DataItem = $scope.shipmentItem.Address1;
                    return true;
                case "PostClose":
                    $scope.shipmentItem.Address1 = $scope.pickupAddressDataDefinition.DataItem;
                    $scope.shipmentItem.OriginAddress = $scope.pickupAddressDataDefinition.Container;
                    return true;
                default: return true;
            }
        };
    };

    //Displays Modal
    $scope.showModal = function (panel, type) {
        $scope.modalType = type;
        openModalPanel(panel);
    };

    //Show Customer Contacts List
    $scope.showCustomerContacts = function (customerId) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/CustomerContacts?customerId=" + customerId)
       .success(function (data, status) {
           $scope.customerContactList = [];
           $scope.customerContactList = data;
           spinner.stop();
           $scope.showModal('#customer-contacts-list-modal', $scope.modalType);
       })
       .error(function (error, status) {
           $scope.shipmentIsError = true;
           $scope.shipmentErrorMessage = status;
           spinner.stop();
       });
    };

    //Show Customer Contact Phones List
    $scope.showCustomerContactPhones = function (contactId) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/ContactPhones?contactId=" + contactId)
       .success(function (data, status) {
           $scope.customerContactPhoneList = [];
           $scope.customerContactPhoneList = data;
           spinner.stop();
           $scope.showModal('#customer-contact-phones-list-modal', $scope.modalType);
       })
       .error(function (error, status) {
           $scope.shipmentIsError = true;
           $scope.shipmentErrorMessage = status;
           spinner.stop();
       });
    };

    //Show Customer Addresses List
    $scope.showCustomerAddressList = function (customerId) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/CustomerAddresses?customerId=" + customerId)
        .success(function (data, status) {
            $scope.customerAddressList = [];
            $scope.customerAddressList = data;
            spinner.stop();
            $scope.showModal('#customer-address-list-modal', $scope.modalType);
        })
        .error(function (error, status) {
            $scope.shipmentIsError = true;
            $scope.shipmentErrorMessage = status;
            spinner.stop();
        });
    };

    //Close Business Unit List Modal
    $scope.closeBusinessUnitList = function (bu) {
        if (angular.isDefined(bu)) {
            $scope.shipmentItem.PickUpBussinessUnitId = bu.Id;
            $scope.shipmentItem.BusinessUnit1.Name = bu.Name;
        }
        else {
            $scope.shipmentItem.PickUpBussinessUnitId = null;
            $scope.shipmentItem.BusinessUnit1.Name = null;
        }
        jQuery.magnificPopup.close();
    };

    //Close Customer List Modal
    $scope.closeCustomerList = function (c) {
        if (angular.isDefined(c)) {
            if ($scope.modalType == "customer") {
                $scope.shipmentItem.CustomerId = c.Id;
                $scope.shipmentItem.Customer.Code = c.Code;
                $scope.shipmentItem.Customer.Name = c.Name;
            }
            else {
                $scope.shipmentItem.BillToCustomerId = c.Id;
                $scope.shipmentItem.BillToCustomer[0].Code = c.Code;
                $scope.shipmentItem.BillToCustomer[0].Name = c.Name;
            }
            jQuery.magnificPopup.close();
            var promise = $interval(function () {
                $interval.cancel(promise);
                promise = undefined;
                $scope.showCustomerContacts(c.Id);
            }, 500);
        }
        else {
            if ($scope.modalType == "customer") {
                $scope.shipmentItem.CustomerId = null;
                $scope.shipmentItem.Customer.Code = null;
                $scope.shipmentItem.Customer.Name = null;
            }
            else {
                $scope.shipmentItem.BillToCustomerId = null;
                $scope.shipmentItem.BillToCustomer[0].Code = null;
                $scope.shipmentItem.BillToCustomer[0].Name = null;
            }
            jQuery.magnificPopup.close();
        }
    };

    //Close Customer Contact List Modal
    $scope.closeCustomerContacts = function (cc) {
        if (angular.isDefined(cc)) {
            if ($scope.modalType == "customer")
                $scope.shipmentItem.CustomerContactId = cc.Contact.Id;
            else
                $scope.shipmentItem.BillToCustomerContactId = cc.Contact.Id;

            jQuery.magnificPopup.close();
            var promise = $interval(function () {
                $interval.cancel(promise);
                promise = undefined;
                $scope.showCustomerContactPhones(cc.Contact.Id);
            }, 500);
        }
        else {
            if ($scope.modalType == "customer")
                $scope.shipmentItem.CustomerContactId = null;
            else
                $scope.shipmentItem.BillToCustomerContactId = null;

            jQuery.magnificPopup.close();
        }
    };

    //Close Customer Contact Phone List Modal
    $scope.closeCustomerContactPhones = function (ccp) {
        if (angular.isDefined(ccp)) {
            if ($scope.modalType == "customer") {
                $scope.shipmentItem.CustomerContactPhoneId = ccp.Id;
                $scope.shipmentItem.Customer.CustomerContacts[0].Contact.ContactPhones[0].ContactNumber = ccp.ContactNumber;
            }
            else {
                $scope.shipmentItem.BillToCustomerContactPhoneId = ccp.Id;
                $scope.shipmentItem.BillToCustomer[0].CustomerContacts[0].Contact.ContactPhones[0].ContactNumber = ccp.ContactNumber;
            }
            jQuery.magnificPopup.close();
            var promise = $interval(function () {
                $interval.cancel(promise);
                promise = undefined;
                if ($scope.modalType == "customer")
                    $scope.showCustomerAddressList($scope.shipmentItem.CustomerId);
                else
                    $scope.showCustomerAddressList($scope.shipmentItem.BillToCustomerId);
            }, 500);
        }
        else {
            if ($scope.modalType == "customer") {
                $scope.shipmentItem.CustomerContactPhoneId = null;
                $scope.shipmentItem.Customer.CustomerContacts[0].Contact.ContactPhones[0].ContactNumber = null;
            }
            else {
                $scope.shipmentItem.BillToCustomerContactPhoneId = null;
                $scope.shipmentItem.BillToCustomer[0].CustomerContacts[0].Contact.ContactPhones[0].ContactNumber = null;
            }
            jQuery.magnificPopup.close();
        }
    };

    //Close Customer Address List Modal
    $scope.closeCustomerAddressList = function (ca) {
        if (angular.isDefined(ca)) {
            if ($scope.modalType == "customer") {
                $scope.shipmentItem.CustomerAddressId = ca.Id;
                $scope.shipmentItem.CustomerAddress = ca.Line1 + ", " + ca.Line2 + ", " + ca.CityMunicipality.Name + ", " + ca.PostalCode;
                $scope.shipmentItem.Customer.CustomerAddresses[0] = ca;
            }
            else {
                $scope.shipmentItem.BillToCustomerAddressId = ca.Id;
                $scope.shipmentItem.BillToCustomerAddress = ca.Line1 + ", " + ca.Line2 + ", " + ca.CityMunicipality.Name + ", " + ca.PostalCode;
                $scope.shipmentItem.BillToCustomer[0].CustomerAddresses[0] = ca;
            }
            jQuery.magnificPopup.close();
        }
        else {
            if ($scope.modalType == "customer") {
                $scope.shipmentItem.CustomerAddressId = null;
                $scope.shipmentItem.CustomerAddress = null;
                $scope.shipmentItem.Customer.CustomerAddresses[0] = null;
            }
            else {
                $scope.shipmentItem.BillToCustomerAddressId = null;
                $scope.shipmentItem.BillToCustomerAddress = null;
                $scope.shipmentItem.BillToCustomer[0].CustomerAddresses[0] = null;
            }
            jQuery.magnificPopup.close();
        }
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
            //MasterList Display
        else {//MasterList Display
            return $scope.formattedAddress;
        }


    };

    //Initialize Business Unit List for Modal
    $scope.initBusinessUnitList = function () {
        $http.get("/api/BusinessUnits?parentBusinessUnitId=" + $scope.shipmentItem.BusinessUnit.Id)
        .success(function (data, status) {
            $scope.businessUnitList = data;
            if ($scope.businessUnitList.length == 0)
                $scope.shipmentItem.BusinessUnit1 = angular.copy($scope.shipmentItem.BusinessUnit);
        })
    };

    //Initialize Customer List for Modal
    $scope.initCustomerList = function () {
        $http.get("/api/Customers")
        .success(function (data, status) {
            for (var i = 0; i < 100; i++)
                $scope.customerList = data;

        })
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

    //function that will be invoked when user click tab
    $scope.setSelectedTab = function (tab) {
        $scope.shipmentIsError = false;
        $scope.shipmentErrorMessage = "";
        $scope.selectedTab = tab;
    };

    //Initialize service type
    $scope.setServiceType = function (id) {
        for (var i = 0; i < $scope.serviceList.length; i++) {
            if (id == $scope.serviceList[i].Id) {
                $scope.shipmentItem.Service = $scope.serviceList[i];
                return true;
            }
        }
    };

    //Initialize shipment type
    $scope.setShipmentType = function (id) {
        for (var i = 0; i < $scope.shipmentTypeList.length; i++) {
            if (id == $scope.serviceList[i].Id) {
                $scope.shipmentItem.ShipmentType = $scope.shipmentTypeList[i];
                return true;
            }
        }
    }

    //Find specific character
    $scope.findCharacter = function (v, c) {
        for (var i = 0; i < v.length; i++) {
            if (v.charAt(i) == c)
                return true;
        }
        return false;
    };

    //Disable typing
    $('#OriginAddress,#DeliveryAddress,#BusinessUnit').keypress(function (key) {
        return false;
    });

    //Check if input is whole number
    $('#consigneecontactno,#quantity').keypress(function (key) {
        if (key.charCode < 48 || key.charCode > 57) return false;
    });

    //Check if input is decimal number only
    $('#taxamount,#taxpercentage,#revenue,#cbm').keypress(function (key) {
        if (key.charCode == 46) {
            if ($scope.findCharacter(this.value, '.'))
                return false;
            else
                return true;
        }
        else if (key.charCode < 48 || key.charCode > 57)
            return false;
        else
            return true;
    });

    //Check if input contains letter only
    $('#consigneename').keypress(function (key) {
        if (!((key.charCode < 97 || key.charCode > 122) && (key.charCode < 65 || key.charCode > 90) && (key.charCode != 45) && (key.charCode != 32)))
            return true;
            //for back space
        else if (key.charCode == 0)
            return true;
        else
            return false;
    });

    // Initialization routines
    var init = function () {
        $scope.initCustomerList();
        $scope.initPaymentModeList();
        $scope.initServiceList();
        $scope.initShipmentTypeList();
        $scope.loadShipmentDataGrid();
        $scope.loadShipmentFiltering();
        $scope.shipmentResetData();
        $scope.shipmentDataDefinition.DataItem = $scope.shipmentItem;
        //---------------------------Code if using typeahead in city/municipality-------------------
        //Get cityMunicipalities
        var promise = $interval(function () {
            if ($scope.cityMunicipalities != null) {
                $interval.cancel(promise);
                promise = undefined;
            }

            $scope.country = $rootScope.country;
            $scope.cityMunicipalities = $rootScope.getCityMunicipalities();
        }, 100);
        //---------------------------End of typeahead-----------------------------------------------
        $scope.initDeliveryAddressModal();
        $scope.initPickupAddressModal();

        //Initialize filtering service
        var promiseServiceList = $interval(function () {
            if ($scope.serviceList.length > 0) {
                $scope.shipmentFilteringDefinition.Source[4].Values = $scope.serviceList;
                $interval.cancel(promiseServiceList);
                promiseServiceList = undefined;
            }
        }, 100);
        //Initialize filtering shipment
        var promiseShipmentTypeList = $interval(function () {
            if ($scope.shipmentTypeList.length > 0) {
                $scope.shipmentFilteringDefinition.Source[5].Values = $scope.shipmentTypeList;
                $interval.cancel(promiseShipmentTypeList);
                promiseShipmentTypeList = undefined;
            }
        }, 100);
    };

    //Initialize needed functions during page load
    init();  
    $interval(function () {}, 100);
};