kunzadApp.controller("BookingController", BookingController);
function BookingController($scope, $http, $interval, $filter, $rootScope, $compile) {
    $scope.modelName = "Booking";
    $scope.modelhref = "#/booking";
    $scope.modalStyle = "";
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
    $scope.withDirective = true;

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

    $scope.closeModal = function () {
        jQuery.magnificPopup.close();
        if (angular.isDefined($scope.businessUnitDataDefinition)) {
            $scope.businessUnitDataDefinition.DataList = [];
            $scope.businessUnitFilteringDefinition.DataList = [];
            $rootScope.removeElement("businessUnitGrid");
            $rootScope.removeElement("businessUnitFilter");
        }

        if (angular.isDefined($scope.customerDataDefinition)) {
            $scope.customerDataDefinition.DataList = [];
            $scope.customerFilteringDefinition.DataList = [];
            $rootScope.removeElement("customerGrid");
            $rootScope.removeElement("customerFilter");
        }

        if (angular.isDefined($scope.customerContactsDataDefinition)) {
            $scope.customerContactsDataDefinition.DataList = [];
            $scope.customerContactsFilteringDefinition.DataList = [];
            $rootScope.removeElement("customerContactsGrid");
            $rootScope.removeElement("customerContactsFilter");
        }

        if (angular.isDefined($scope.customerContactPhonesDataDefinition)) {
            $scope.customerContactPhonesDataDefinition.DataList = [];
            $scope.customerContactPhonesFilteringDefinition.DataList = [];
            $rootScope.removeElement("customerContactPhonesGrid");
            $rootScope.removeElement("customerContactPhonesFilter");
        }

        if (angular.isDefined($scope.customerAddressDataDefinition)) {
            $scope.customerAddressDataDefinition.DataList = [];
            $scope.customerAddressFilteringDefinition.DataList = [];
            $rootScope.removeElement("customerAddressGrid");
            $rootScope.removeElement("customerAddressFilter");
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
        else {//MasterList Display
            return $scope.formattedAddress;
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
    $('#OriginAddress,#DeliveryAddress,#BusinessUnit, #customerCode, #pickupdate, #pickuptime').keypress(function (key) {
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
                "ShowCreate": true,
                "ShowContextMenu": true,
                "ContextMenu": ["'Load'", "'Create'", "'Edit'", "'Delete'", "'View'", "'Find'", "'Clear'"],
                "ContextMenuLabel": ['Reload', 'Create', 'Edit', 'Cancel', 'View', 'Find', 'Clear']
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
                    var addressHolder = $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality;
                    $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality = {};
                    $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.Id = addressHolder[0].Id;
                    $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.Name = addressHolder[0].Name;
                    $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.StateProvince = {};
                    $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.StateProvince.Id = addressHolder[0].StateProvince.Id;
                    $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.StateProvince.Name = addressHolder[0].StateProvince.Name;
                    addressHolder = {};
                    $scope.shipmentItem.Id = $scope.shipmentSubmitDefinition.DataItem.Id;
                    $scope.shipmentItem.TransportStatusId = $scope.shipmentSubmitDefinition.DataItem.TransportStatusId;
                    $scope.shipmentItem.DeliveryAddressId = $scope.shipmentSubmitDefinition.DataItem.DeliveryAddressId;
                    $scope.shipmentItem.OriginAddressId = $scope.shipmentSubmitDefinition.DataItem.OriginAddressId;
                    $scope.shipmentItem.Address.Id = $scope.shipmentSubmitDefinition.DataItem.Address.Id;
                    $scope.shipmentItem.Address1.Id = $scope.shipmentSubmitDefinition.DataItem.Address1.Id;
                    $scope.shipmentDataDefinition.DataItem = $scope.shipmentItem;
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
                        $scope.shipmentDataDefinition.DataList[$scope.shipmentSubmitDefinition.Index].TransportStatusId = $scope.shipmentSubmitDefinition.DataItem.TransportStatusId;
                    $scope.shipmentDataDefinition.DataItem.TransportStatusId = $scope.shipmentSubmitDefinition.DataItem.TransportStatusId;
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
                case "Clear":
                    $scope.selectedTab = $scope.tabPages[1];
                    $scope.shipmentDataDefinition.DataList = [];
                    //Required if pagination is enabled
                    if ($scope.shipmentDataDefinition.EnablePagination == true) {
                        $scope.shipmentDataDefinition.CurrentPage = 1;
                        $scope.shipmentDataDefinition.DoPagination = true;
                    }
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
                        $scope.shipmentFilteringDefinition.DataItem1.Shipment[0][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].From;
                        $scope.shipmentFilteringDefinition.DataItem1.Shipment[1][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].To;// + " 23:59:00.000";
                        //if ($scope.shipmentSource[i].Type == "Date") {
                           
                        //}
                        //else {
                        //    $scope.shipmentFilteringDefinition.DataItem1.Shipment[0][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].From;
                        //    $scope.shipmentFilteringDefinition.DataItem1.Shipment[0][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].To;
                        //}
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

    //=====================================BUSINESS UNIT MODAL======================================
    $scope.showBusinessUnit = function () {
        openModalPanel2("#business-unit-list-modal");
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
        html = '<dir-filtering  id = "businessUnitFilter" filterdefinition="businessUnitFilteringDefinition"' +
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
                    $scope.businessUnitFilteringDefinition.DataItem1.BusinessUnit[0].ParentBusinessUnitId = $scope.shipmentItem.BusinessUnit.Id;
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
                    $scope.shipmentItem.PickUpBussinessUnitId = $scope.businessUnitDataDefinition.DataItem.Id;
                    $scope.shipmentItem.BusinessUnit1.Name = $scope.businessUnitDataDefinition.DataItem.Name;
                    $scope.closeModal();
                    return true;
                default: return true;
            }
        };

        $scope.initializeBusinessUnitDataDefinition();
    };

    //function that will be invoked during compiling of businessUnit datagrid to DOM
    $scope.compileBusinessUnitDataGrid = function () {
        var html = '<dir-data-grid2 id = "businessUnitGrid" datadefinition      = "businessUnitDataDefinition"' +
                                    'submitdefinition   = "businessUnitSubmitDefinition"' +
                                    'otheractions       = "businessUnitOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#businessUnitContainer')).html(html);
        $compile($content)($scope);
    };
    //=======================================END OF BUSINESS UNIT MODAL==============================

    //=======================================CUSTOMER MODAL==========================================
    $scope.showCustomer = function () {
        openModalPanel2("#customer-list-modal");
        $scope.loadCustomerDataGrid();
        $scope.loadCustomerFiltering();

        $scope.customerFilteringDefinition.SetSourceToNull = true;
        $scope.customerDataDefinition.Retrieve = true;

    };

    //Load customer filtering for compiling
    $scope.loadCustomerFiltering = function () {
        $scope.initCustomerFilteringParameters();
        $scope.initCustomerFilteringContainter();
    };

    //initialize customer filtering parameters
    $scope.initCustomerFilteringContainter = function () {
        html = '<dir-filtering  id = "customerFilter" filterdefinition="customerFilteringDefinition"' +
                                'filterlistener="customerDataDefinition.Retrieve"' +
                                'otheractions="customerOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#customerFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of business unit filtering to DOM
    $scope.initCustomerFilteringParameters = function () {
        $scope.initCustomerFilteringDefinition = function () {
            $scope.customerFilteringDefinition = {
                "Url": ($scope.customerDataDefinition.EnablePagination == true ? 'api/Customers?type=paginate&param1=' + $scope.customerDataDefinition.CurrentPage : 'api/Customers?type=scroll&param1=' + $scope.customerDataDefinition.DataList.length),//Url for retrieve
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

        $scope.customerOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.customerSource = $scope.customerFilteringDefinition.Source;
                    //Optional in using this, can use switch if every source type has validation before filtering
                    for (var i = 0; i < $scope.customerSource.length; i++) {
                        if ($scope.customerSource[i].Type == "Date") {
                            $scope.customerFilteringDefinition.DataItem1.Customer[0][$scope.customerSource[i].Column] = $scope.customerSource[i].From;
                            $scope.customerFilteringDefinition.DataItem1.Customer[1][$scope.customerSource[i].Column] = $scope.customerSource[i].To;
                        }
                        else
                            $scope.customerFilteringDefinition.DataItem1.Customer[0][$scope.customerSource[i].Column] = $scope.customerSource[i].From;
                    }

                    //Delete keys that the value is null
                    for (var i = 0; i < $scope.customerSource.length; i++) {
                        if ($scope.customerFilteringDefinition.DataItem1.Customer[0][$scope.customerSource[i].Column] == null) {
                            delete $scope.customerFilteringDefinition.DataItem1.Customer[0][$scope.customerSource[i].Column];
                            delete $scope.customerFilteringDefinition.DataItem1.Customer[1][$scope.customerSource[i].Column];
                        }
                    }

                    if ($scope.customerDataDefinition.EnablePagination == true && $scope.customerFilteringDefinition.ClearData) {
                        $scope.customerDataDefinition.CurrentPage = 1;
                        $scope.customerFilteringDefinition.Url = 'api/Customers?type=paginate&param1=' + $scope.customerDataDefinition.CurrentPage;
                    }
                    else if ($scope.customerDataDefinition.EnablePagination == true) {
                        $scope.customerDataDefinition.DataList = [];
                        $scope.customerFilteringDefinition.Url = 'api/Customers?type=paginate&param1=' + $scope.customerDataDefinition.CurrentPage;
                    }
                        //Scroll
                    else {
                        if ($scope.customerFilteringDefinition.ClearData)
                            $scope.customerDataDefinition.DataList = [];
                        $scope.customerFilteringDefinition.Url = 'api/Customers?type=scroll&param1=' + $scope.customerDataDefinition.DataList.length;
                    }
                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize customerDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize customerDataDefinition DataList by pushing each value of filterDefinition DataList*/
                    //Required
                    //$scope.customerFilteringDefinition.DataList = $rootScope.formatCustomer($scope.customerFilteringDefinition.DataList);
                    if ($scope.customerDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.customerFilteringDefinition.DataList.length; j++)
                            $scope.customerDataDefinition.DataList.push($scope.customerFilteringDefinition.DataList[j]);
                    }

                    if ($scope.customerDataDefinition.EnablePagination == true) {
                        $scope.customerDataDefinition.DataList = [];
                        $scope.customerDataDefinition.DataList = $scope.customerFilteringDefinition.DataList;
                        $scope.customerDataDefinition.DoPagination = true;
                    }
                    return true;
                default: return true;
            }
        };

        $scope.initCustomerDataItems = function () {
            $scope.customerFilteringDefinition.DataItem1 = angular.copy($rootScope.customerObj());
        };

        $scope.initCustomerFilteringDefinition();
        $scope.initCustomerDataItems();
    };

    //Load business datagrid for compiling
    $scope.loadCustomerDataGrid = function () {
        $scope.initCustomerDataGrid();
        $scope.compileCustomerDataGrid();
    };

    //initialize customer datagrid parameters
    $scope.initCustomerDataGrid = function () {
        $scope.customerSubmitDefinition = undefined;
        $scope.initializeCustomerDataDefinition = function () {
            $scope.customerDataDefinition = {
                "Header": ['Code', 'Name', 'Customer Group', 'TIN', 'Industry', 'No.'],
                "Keys": ['Code', 'Name', 'CustomerGroup[0].Name', 'TIN', 'Industry[0].Name'],
                "Type": ['Default', 'ProperCase', 'ProperCase', 'Default', 'ProperCase'],
                "ColWidth": [150, 300, 200, 140, 200],
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
                "DataTarget": "CustomerMenu",
                "ShowCreate": false,
                "ShowContextMenu": false,
                "ContextMenu": [""],
                "ContextMenuLabel": [""]
            }
            $scope.customerDataDefinition.RowTemplate = '<div>' +
                                                                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                                                              '</div>';
        };
        $scope.customerOtherActions = function (action) {
            switch (action) {
                case 'PostEditAction':
                    $scope.shipmentItem.CustomerId = $scope.customerDataDefinition.DataItem.Id;
                    $scope.shipmentItem.Customer.Code = $scope.customerDataDefinition.DataItem.Code;
                    $scope.shipmentItem.Customer.Name = $scope.customerDataDefinition.DataItem.Name;
                    $scope.closeModal();
                    var promise = $interval(function () {
                        $interval.cancel(promise);
                        promise = undefined;
                        $scope.showCustomerContacts();
                    }, 500);
                    return true;
                default: return true;
            }
        };

        $scope.initializeCustomerDataDefinition();
    };

    //function that will be invoked during compiling of customer datagrid to DOM
    $scope.compileCustomerDataGrid = function () {
        var html = '<dir-data-grid2 id = "customerGrid" datadefinition      = "customerDataDefinition"' +
                                    'submitdefinition   = "customerSubmitDefinition"' +
                                    'otheractions       = "customerOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#customerContainer')).html(html);
        $compile($content)($scope);
    };
    //=====================================END OF CUSTOMER MODAL=======================================

    //=====================================CUSTOMER CONTACTS MODAL=====================================
    $scope.showCustomerContacts = function () {
        openModalPanel2("#customerContacts-list-modal");
        $scope.loadCustomerContactsDataGrid();
        $scope.loadCustomerContactsFiltering();

        $scope.customerContactsFilteringDefinition.SetSourceToNull = true;
        $scope.customerContactsDataDefinition.Retrieve = true;
    };

    //Load customerContacts filtering for compiling
    $scope.loadCustomerContactsFiltering = function () {
        $scope.initCustomerContactsFilteringParameters();
        $scope.initCustomerContactsFilteringContainter();
    };

    //initialize customerContacts filtering parameters
    $scope.initCustomerContactsFilteringContainter = function () {
        html = '<dir-filtering  id = "customerContactsFilter" filterdefinition="customerContactsFilteringDefinition"' +
                                'filterlistener="customerContactsDataDefinition.Retrieve"' +
                                'otheractions="customerContactsOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#customerContactsFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of business unit filtering to DOM
    $scope.initCustomerContactsFilteringParameters = function () {
        $scope.initCustomerContactsFilteringDefinition = function () {
            $scope.customerContactsFilteringDefinition = {
                "Url": ($scope.customerContactsDataDefinition.EnablePagination == true ? 'api/CustomerContacts?type=paginate&param1=' + $scope.customerContactsDataDefinition.CurrentPage : 'api/CustomerContacts?type=scroll&param1=' + $scope.customerContactsDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index
                "Source": [
                            { "Index": 0, "Label": "Name", "Column": "ContactName", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "Title", "Column": "ContactTitle", "Values": [], "From": null, "To": null, "Type": "Default" },
                ],//Contains the Criteria definition
                "Multiple": false,
                "AutoLoad": false,
                "ClearData": false,
                "SetSourceToNull": false
            }
        };

        $scope.customerContactsOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.customerContactsSource = $scope.customerContactsFilteringDefinition.Source;
                    for (var i = 0; i < $scope.customerContactsSource.length; i++) {
                        switch ($scope.customerContactsSource[i].Column) {
                            case "ContactName":
                                $scope.customerContactsFilteringDefinition.DataItem1.CustomerContact[0].Contact.Name = $scope.customerContactsSource[i].From;
                                $scope.customerContactsFilteringDefinition.DataItem1.CustomerContact[1].Contact.Name = $scope.customerContactsSource[i].To;
                                break;
                            case "ContactTitle":
                                $scope.customerContactsFilteringDefinition.DataItem1.CustomerContact[0].Contact.Title = $scope.customerContactsSource[i].From;
                                $scope.customerContactsFilteringDefinition.DataItem1.CustomerContact[1].Contact.Title = $scope.customerContactsSource[i].To;
                                break;
                            default: break;
                        }
                    }

                    if ($scope.customerContactsDataDefinition.EnablePagination == true && $scope.customerContactsFilteringDefinition.ClearData) {
                        $scope.customerContactsDataDefinition.CurrentPage = 1;
                        $scope.customerContactsFilteringDefinition.Url = 'api/CustomerContacts?type=paginate&param1=' + $scope.customerContactsDataDefinition.CurrentPage;
                    }
                    else if ($scope.customerContactsDataDefinition.EnablePagination == true) {
                        $scope.customerContactsDataDefinition.DataList = [];
                        $scope.customerContactsFilteringDefinition.Url = 'api/CustomerContacts?type=paginate&param1=' + $scope.customerContactsDataDefinition.CurrentPage;
                    }
                        //Scroll
                    else {
                        if ($scope.customerContactsFilteringDefinition.ClearData)
                            $scope.customerContactsDataDefinition.DataList = [];
                        $scope.customerContactsFilteringDefinition.Url = 'api/CustomerContacts?type=scroll&param1=' + $scope.customerContactsDataDefinition.DataList.length;
                    }

                    $scope.customerContactsFilteringDefinition.DataItem1.CustomerContact[0].CustomerId = $scope.shipmentItem.CustomerId;
                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize customerContactsDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize customerContactsDataDefinition DataList by pushing each value of filterDefinition DataList*/
                    //Required
                    //$scope.customerContactsFilteringDefinition.DataList = $rootScope.formatCustomerContacts($scope.customerContactsFilteringDefinition.DataList);
                    if ($scope.customerContactsDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.customerContactsFilteringDefinition.DataList.length; j++)
                            $scope.customerContactsDataDefinition.DataList.push($scope.customerContactsFilteringDefinition.DataList[j]);
                    }

                    if ($scope.customerContactsDataDefinition.EnablePagination == true) {
                        $scope.customerContactsDataDefinition.DataList = [];
                        $scope.customerContactsDataDefinition.DataList = $scope.customerContactsFilteringDefinition.DataList;
                        $scope.customerContactsDataDefinition.DoPagination = true;
                    }
                    return true;
                default: return true;
            }
        };

        $scope.initCustomerContactsDataItems = function () {
            $scope.customerContactsFilteringDefinition.DataItem1 = angular.copy($rootScope.customerContactsObj());
        };

        $scope.initCustomerContactsFilteringDefinition();
        $scope.initCustomerContactsDataItems();
    };

    //Load business datagrid for compiling
    $scope.loadCustomerContactsDataGrid = function () {
        $scope.initCustomerContactsDataGrid();
        $scope.compileCustomerContactsDataGrid();
    };

    //initialize customerContacts datagrid parameters
    $scope.initCustomerContactsDataGrid = function () {
        $scope.customerContactsSubmitDefinition = undefined;
        $scope.initializeCustomerContactsDataDefinition = function () {
            $scope.customerContactsDataDefinition = {
                "Header": ['Name', 'Title', 'Email', 'Alternate Email','No.'],
                "Keys": ['Contact[0].Name', 'Contact[0].Title', 'Contact[0].Email', 'Contact[0].AlternateEmail'],
                "Type": ['ProperCase', 'Default', 'Default', 'Default'],
                "ColWidth": [300, 300, 250, 250],
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
                "DataTarget": "CustomerContactsMenu",
                "ShowCreate": false,
                "ShowContextMenu": false,
                "ContextMenu": [""],
                "ContextMenuLabel": [""]
            }
            $scope.customerContactsDataDefinition.RowTemplate = '<div>' +
                                                                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                                                              '</div>';
        };
        $scope.customerContactsOtherActions = function (action) {
            switch (action) {
                case 'PostEditAction':
                    $scope.shipmentItem.CustomerContactId = $scope.customerContactsDataDefinition.DataItem.Id;
                    $scope.closeModal();
                    var promise = $interval(function () {
                        $interval.cancel(promise);
                        promise = undefined;
                        $scope.showCustomerContactPhones();
                    }, 500);
                    return true;
                default: return true;
            }
        };

        $scope.initializeCustomerContactsDataDefinition();
    };

    //function that will be invoked during compiling of customerContacts datagrid to DOM
    $scope.compileCustomerContactsDataGrid = function () {
        var html = '<dir-data-grid2 id = "customerContactsGrid" datadefinition      = "customerContactsDataDefinition"' +
                                    'submitdefinition   = "customerContactsSubmitDefinition"' +
                                    'otheractions       = "customerContactsOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#customerContactsContainer')).html(html);
        $compile($content)($scope);
    };
    //=====================================END OF CUSTOMER CONTACTS MODAL=================================

    //=====================================CUSTOMER CONTACT PHONE MODAL===================================
    $scope.showCustomerContactPhones = function () {
        openModalPanel2("#customerContactPhones-list-modal");
        $scope.loadCustomerContactPhonesDataGrid();
        $scope.loadCustomerContactPhonesFiltering();

        $scope.customerContactPhonesFilteringDefinition.SetSourceToNull = true;
        $scope.customerContactPhonesDataDefinition.Retrieve = true;

    };

    //Load customerContactPhones filtering for compiling
    $scope.loadCustomerContactPhonesFiltering = function () {
        $scope.initCustomerContactPhonesFilteringParameters();
        $scope.initCustomerContactPhonesFilteringContainter();
    };

    //initialize customerContactPhones filtering parameters
    $scope.initCustomerContactPhonesFilteringContainter = function () {
        html = '<dir-filtering  id = "customerContactPhonesFilter" filterdefinition="customerContactPhonesFilteringDefinition"' +
                                'filterlistener="customerContactPhonesDataDefinition.Retrieve"' +
                                'otheractions="customerContactPhonesOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#customerContactPhonesFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of business unit filtering to DOM
    $scope.initCustomerContactPhonesFilteringParameters = function () {
        $scope.initCustomerContactPhonesFilteringDefinition = function () {
            $scope.customerContactPhonesFilteringDefinition = {
                "Url": ($scope.customerContactPhonesDataDefinition.EnablePagination == true ? 'api/ContactPhones?type=paginate&param1=' + $scope.customerContactPhonesDataDefinition.CurrentPage : 'api/ContactPhones?type=scroll&param1=' + $scope.customerContactPhonesDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index
                "Source": [
                            { "Index": 0, "Label": "Contact Number", "Column": "ContactNumber", "Values": [], "From": null, "To": null, "Type": "Default" },
                ],//Contains the Criteria definition
                "Multiple": false,
                "AutoLoad": false,
                "ClearData": false,
                "SetSourceToNull": false
            }
        };

        $scope.customerContactPhonesOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.customerContactPhonesSource = $scope.customerContactPhonesFilteringDefinition.Source;
                    for (var i = 0; i < $scope.customerContactPhonesSource.length; i++) {
                        switch ($scope.customerContactPhonesSource[i].Column) {
                            case "ContactNumber":
                                $scope.customerContactPhonesFilteringDefinition.DataItem1.ContactPhone[0].ContactNumber = $scope.customerContactPhonesSource[i].From;
                                $scope.customerContactPhonesFilteringDefinition.DataItem1.ContactPhone[1].ContactNumber = $scope.customerContactPhonesSource[i].To;
                                break;
                            default: break;
                        }
                    }

                    if ($scope.customerContactPhonesDataDefinition.EnablePagination == true && $scope.customerContactPhonesFilteringDefinition.ClearData) {
                        $scope.customerContactPhonesDataDefinition.CurrentPage = 1;
                        $scope.customerContactPhonesFilteringDefinition.Url = 'api/ContactPhones?type=paginate&param1=' + $scope.customerContactPhonesDataDefinition.CurrentPage;
                    }
                    else if ($scope.customerContactPhonesDataDefinition.EnablePagination == true) {
                        $scope.customerContactPhonesDataDefinition.DataList = [];
                        $scope.customerContactPhonesFilteringDefinition.Url = 'api/ContactPhones?type=paginate&param1=' + $scope.customerContactPhonesDataDefinition.CurrentPage;
                    }
                    //Scroll
                    else {
                        if ($scope.customerContactPhonesFilteringDefinition.ClearData)
                            $scope.customerContactPhonesDataDefinition.DataList = [];
                        $scope.customerContactPhonesFilteringDefinition.Url = 'api/ContactPhones?type=scroll&param1=' + $scope.customerContactPhonesDataDefinition.DataList.length;
                    }

                    $scope.customerContactPhonesFilteringDefinition.DataItem1.ContactPhone[0].ContactId = $scope.shipmentItem.CustomerContactId;
                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize customerContactPhonesDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize customerContactPhonesDataDefinition DataList by pushing each value of filterDefinition DataList*/
                    //Required
                    //$scope.customerContactPhonesFilteringDefinition.DataList = $rootScope.formatCustomerContactPhones($scope.customerContactPhonesFilteringDefinition.DataList);
                    if ($scope.customerContactPhonesDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.customerContactPhonesFilteringDefinition.DataList.length; j++)
                            $scope.customerContactPhonesDataDefinition.DataList.push($scope.customerContactPhonesFilteringDefinition.DataList[j]);
                    }

                    if ($scope.customerContactPhonesDataDefinition.EnablePagination == true) {
                        $scope.customerContactPhonesDataDefinition.DataList = [];
                        $scope.customerContactPhonesDataDefinition.DataList = $scope.customerContactPhonesFilteringDefinition.DataList;
                        $scope.customerContactPhonesDataDefinition.DoPagination = true;
                    }
                    return true;
                default: return true;
            }
        };

        $scope.initCustomerContactPhonesDataItems = function () {
            $scope.customerContactPhonesFilteringDefinition.DataItem1 = angular.copy($rootScope.customerContactPhonesObj());
        };

        $scope.initCustomerContactPhonesFilteringDefinition();
        $scope.initCustomerContactPhonesDataItems();
    };

    //Load business datagrid for compiling
    $scope.loadCustomerContactPhonesDataGrid = function () {
        $scope.initCustomerContactPhonesDataGrid();
        $scope.compileCustomerContactPhonesDataGrid();
    };

    //initialize customerContactPhones datagrid parameters
    $scope.initCustomerContactPhonesDataGrid = function () {
        $scope.customerContactPhonesSubmitDefinition = undefined;
        $scope.initializeCustomerContactPhonesDataDefinition = function () {
            $scope.customerContactPhonesDataDefinition = {
                "Header": ['Contact Number', 'Contact Type','No.'],
                "Keys": ['ContactNumber', 'ContactNumberType[0].Type'],
                "Type": ['Default'],
                "ColWidth": [600, 400],
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
                "DataTarget": "CustomerContactPhonesMenu",
                "ShowCreate": false,
                "ShowContextMenu": false,
                "ContextMenu": [""],
                "ContextMenuLabel": [""]
            }
            $scope.customerContactPhonesDataDefinition.RowTemplate = '<div>' +
                                                                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                                                              '</div>';
        };

        $scope.customerContactPhonesOtherActions = function (action) {
            switch (action) {
                case 'PostEditAction':
                    $scope.shipmentItem.CustomerContactPhoneId = $scope.customerContactPhonesDataDefinition.DataItem.Id;
                    $scope.shipmentItem.Customer.CustomerContacts[0].Contact.ContactPhones[0].ContactNumber =  $scope.customerContactPhonesDataDefinition.DataItem.ContactNumber;
                    $scope.closeModal();
                    var promise = $interval(function () {
                        $interval.cancel(promise);
                        promise = undefined;
                        $scope.showCustomerAddress();
                    }, 500);
                    return true;
                default: return true;
            }
        };

        $scope.initializeCustomerContactPhonesDataDefinition();
    };

    //function that will be invoked during compiling of customerContactPhones datagrid to DOM
    $scope.compileCustomerContactPhonesDataGrid = function () {
        var html = '<dir-data-grid2 id = "customerContactPhonesGrid" datadefinition      = "customerContactPhonesDataDefinition"' +
                                    'submitdefinition   = "customerContactPhonesSubmitDefinition"' +
                                    'otheractions       = "customerContactPhonesOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#customerContactPhonesContainer')).html(html);
        $compile($content)($scope);
    };
    //==================================END OF CUSTOMER CONTACT PHONE MODAL=================================

    //=====================================CUSTOMER ADDRESS MODAL===================================
    $scope.showCustomerAddress = function () {
        openModalPanel2("#customerAddresses-list-modal");
        $scope.loadCustomerAddressDataGrid();
        $scope.loadCustomerAddressFiltering();

        $scope.customerAddressFilteringDefinition.SetSourceToNull = true;
        $scope.customerAddressDataDefinition.Retrieve = true;

    };

    //Load customerAddress filtering for compiling
    $scope.loadCustomerAddressFiltering = function () {
        $scope.initCustomerAddressFilteringParameters();
        $scope.initCustomerAddressFilteringContainter();
    };

    //initialize customerAddress filtering parameters
    $scope.initCustomerAddressFilteringContainter = function () {
        html = '<dir-filtering  id = "customerAddressFilter" filterdefinition="customerAddressFilteringDefinition"' +
                                'filterlistener="customerAddressDataDefinition.Retrieve"' +
                                'otheractions="customerAddressOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#customerAddressFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of business unit filtering to DOM
    $scope.initCustomerAddressFilteringParameters = function () {
        $scope.initCustomerAddressFilteringDefinition = function () {
            $scope.customerAddressFilteringDefinition = {
                "Url": ($scope.customerAddressDataDefinition.EnablePagination == true ? 'api/CustomerAddresses?type=paginate&param1=' + $scope.customerAddressDataDefinition.CurrentPage : 'api/CustomerAddresses?type=scroll&param1=' + $scope.customerAddressDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index 0
                "DataItem2": $scope.DataItem2, //Contains the parameter value index 1
                "Source": [
                            { "Index": 0, "Label": "Street Address Line 1", "Column": "Line1", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "Street Address Line 2", "Column": "Line2", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 2, "Label": "City/Municipality", "Column": "CityMunicipality", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 3, "Label": "Postal Code", "Column": "PostalCode", "Values": [], "From": null, "To": null, "Type": "Default" },
                            //{ "Index": 3, "Label": "Is Billing Address?", "Column": "IsBillingAddress", "Values": [{ "Id": true, "Name": "Yes" }, { "Id": false, "Name": "No" }], "From": null, "To": null, "Type": "DropDown" },
                            //{ "Index": 4, "Label": "Is Delivery Address?", "Column": "IsDeliveryAddress", "Values": [{ "Id": true, "Name": "Yes" }, { "Id": false, "Name": "No" }], "From": null, "To": null, "Type": "DropDown" },
                            //{ "Index": 5, "Label": "Is Pickup Address?", "Column": "IsPickupAddress", "Values": [{ "Id": true, "Name": "Yes" }, { "Id": false, "Name": "No" }], "From": null, "To": null, "Type": "DropDown" },
                ],//Contains the Criteria definition
                "Multiple": false,
                "AutoLoad": false,
                "ClearData": false,
                "SetSourceToNull": false
            }
        };

        $scope.customerAddressOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.customerAddressSource = $scope.customerAddressFilteringDefinition.Source;
                    for (var i = 0; i < $scope.customerAddressSource.length; i++) {
                        switch ($scope.customerAddressSource[i].Column) {
                            case "Line1":
                                $scope.customerAddressFilteringDefinition.DataItem1.CustomerAddress[0][$scope.customerAddressSource[i].Column] = $scope.customerAddressSource[i].From;
                                $scope.customerAddressFilteringDefinition.DataItem1.CustomerAddress[1][$scope.customerAddressSource[i].Column] = $scope.customerAddressSource[i].To;
                                break;
                            case "Line2":
                                $scope.customerAddressFilteringDefinition.DataItem1.CustomerAddress[0][$scope.customerAddressSource[i].Column] = $scope.customerAddressSource[i].From;
                                $scope.customerAddressFilteringDefinition.DataItem1.CustomerAddress[1][$scope.customerAddressSource[i].Column] = $scope.customerAddressSource[i].To;
                                break;
                            case "CityMunicipality":
                                $scope.customerAddressFilteringDefinition.DataItem1.CustomerAddress[0].CityMunicipality.Name = $scope.customerAddressSource[i].From;
                                $scope.customerAddressFilteringDefinition.DataItem1.CustomerAddress[1].CityMunicipality.Name = $scope.customerAddressSource[i].To;
                                break;
                            case "PostalCode":
                                $scope.customerAddressFilteringDefinition.DataItem1.CustomerAddress[0][$scope.customerAddressSource[i].Column] = $scope.customerAddressSource[i].From;
                                $scope.customerAddressFilteringDefinition.DataItem1.CustomerAddress[1][$scope.customerAddressSource[i].Column] = $scope.customerAddressSource[i].To;
                                break;
                            default: break;
                        }
                    }

                    //Delete keys that the value is null
                    for (var i = 0; i < $scope.customerAddressSource.length; i++) {
                        if ($scope.customerAddressFilteringDefinition.DataItem1.CustomerAddress[0][$scope.customerAddressSource[i].Column] == null) {
                            delete $scope.customerAddressFilteringDefinition.DataItem1.CustomerAddress[0][$scope.customerAddressSource[i].Column];
                            delete $scope.customerAddressFilteringDefinition.DataItem1.CustomerAddress[1][$scope.customerAddressSource[i].Column];
                        }
                    }
                    if ($scope.customerAddressDataDefinition.EnablePagination == true && $scope.customerAddressFilteringDefinition.ClearData) {
                        $scope.customerAddressDataDefinition.CurrentPage = 1;
                        $scope.customerAddressFilteringDefinition.Url = 'api/CustomerAddresses?type=paginate&param1=' + $scope.customerAddressDataDefinition.CurrentPage;
                    }
                    else if ($scope.customerAddressDataDefinition.EnablePagination == true) {
                        $scope.customerAddressDataDefinition.DataList = [];
                        $scope.customerAddressFilteringDefinition.Url = 'api/CustomerAddresses?type=paginate&param1=' + $scope.customerAddressDataDefinition.CurrentPage;
                    }
                        //Scroll
                    else {
                        if ($scope.customerAddressFilteringDefinition.ClearData)
                            $scope.customerAddressDataDefinition.DataList = [];
                        $scope.customerAddressFilteringDefinition.Url = 'api/CustomerAddresses?type=scroll&param1=' + $scope.customerAddressDataDefinition.DataList.length;
                    }

                    $scope.customerAddressFilteringDefinition.DataItem1.CustomerId = $scope.shipmentItem.CustomerId;
                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize customerAddressDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize customerAddressDataDefinition DataList by pushing each value of filterDefinition DataList*/
                    //Required
                    //$scope.customerAddressFilteringDefinition.DataList = $rootScope.formatCustomerAddress($scope.customerAddressFilteringDefinition.DataList);
                    if ($scope.customerAddressDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.customerAddressFilteringDefinition.DataList.length; j++)
                            $scope.customerAddressDataDefinition.DataList.push($scope.customerAddressFilteringDefinition.DataList[j]);
                    }

                    if ($scope.customerAddressDataDefinition.EnablePagination == true) {
                        $scope.customerAddressDataDefinition.DataList = [];
                        $scope.customerAddressDataDefinition.DataList = $scope.customerAddressFilteringDefinition.DataList;
                        $scope.customerAddressDataDefinition.DoPagination = true;
                    }
                    return true;
                default: return true;
            }
        };

        $scope.initCustomerAddressDataItems = function () {
            $scope.customerAddressFilteringDefinition.DataItem1 = angular.copy($rootScope.customerAddressObj());
            $scope.customerAddressFilteringDefinition.DataItem2 = angular.copy($rootScope.customerAddressObj());
        };

        $scope.initCustomerAddressFilteringDefinition();
        $scope.initCustomerAddressDataItems();
    };

    //Load business datagrid for compiling
    $scope.loadCustomerAddressDataGrid = function () {
        $scope.initCustomerAddressDataGrid();
        $scope.compileCustomerAddressDataGrid();
    };

    //initialize customerAddress datagrid parameters
    $scope.initCustomerAddressDataGrid = function () {
        $scope.customerAddressSubmitDefinition = undefined;
        $scope.initializeCustomerAddressDataDefinition = function () {
            $scope.customerAddressDataDefinition = {
                "Header": ['Street Address Line 1', 'Street Address Line 2', 'City/Municipality', 'State/Province', 'Postal Code', 'Is Billing Address', 'Is Delivery Address', 'Is Pickup Address', 'No.'],
                "Keys": ['Line1', 'Line2', 'CityMunicipality[0].Name', 'CityMunicipality[0].StateProvince[0].Name', 'PostalCode', 'IsBillingAddress', 'IsDeliveryAddress', 'IsPickupAddress'],
                "Type": ['ProperCase', 'ProperCase', 'ProperCase', 'ProperCase', 'ProperCase', 'Bit', 'Bit', 'Bit'],
                "ColWidth": [250, 250, 200, 150, 150, 150, 150, 150],
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
                "DataTarget": "CustomerAddressMenu",
                "ShowCreate": false,
                "ShowContextMenu": false,
                "ContextMenu": [""],
                "ContextMenuLabel": [""]
            }
            $scope.customerAddressDataDefinition.RowTemplate = '<div>' +
                                                                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                                                              '</div>';
        };

        $scope.customerAddressOtherActions = function (action) {
            switch (action) {
                case 'PostEditAction':
                    $scope.shipmentItem.CustomerAddressId = $scope.customerAddressDataDefinition.DataItem.Id;
                    $scope.shipmentItem.CustomerAddress = $scope.customerAddressDataDefinition.DataItem.Line1 + ", " + $scope.customerAddressDataDefinition.DataItem.Line2 + ", " + $scope.customerAddressDataDefinition.DataItem.CityMunicipality[0].Name + ", " + $scope.customerAddressDataDefinition.DataItem.CityMunicipality[0].StateProvince[0].Name + ", " + $scope.customerAddressDataDefinition.DataItem.PostalCode;
                    $scope.shipmentItem.Customer.CustomerAddresses[0] = $scope.customerAddressDataDefinition.DataItem;
                    $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.Id = $scope.customerAddressDataDefinition.DataItem.CityMunicipality[0].Id;
                    $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.Name = $scope.customerAddressDataDefinition.DataItem.CityMunicipality[0].Name;
                    $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.StateProvince = {};
                    $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.StateProvince.Id = $scope.customerAddressDataDefinition.DataItem.CityMunicipality[0].StateProvince[0].Id;
                    $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.StateProvince.Name = $scope.customerAddressDataDefinition.DataItem.CityMunicipality[0].StateProvince[0].Name;
                    $scope.closeModal();
                    return true;
                default: return true;
            }
        };

        $scope.initializeCustomerAddressDataDefinition();
    };

    //function that will be invoked during compiling of customerAddress datagrid to DOM
    $scope.compileCustomerAddressDataGrid = function () {
        var html = '<dir-data-grid2 id = "customerAddressGrid" datadefinition      = "customerAddressDataDefinition"' +
                                    'submitdefinition   = "customerAddressSubmitDefinition"' +
                                    'otheractions       = "customerAddressOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#customerAddressContainer')).html(html);
        $compile($content)($scope);
    };
    //==================================END OF CUSTOMER ADDRESS MODAL=================================

    //==================================DELIVERY ADDRESS MODAL==============================================
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
    //==================================END OF DELIVERY ADDRESS MODAL=======================================

    //==================================PICKUP ADDRESS MODAL================================================
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
    //==================================END OF PICKUP ADDRESS MODAL=========================================

    // Initialization routines
    var init = function () {
        $scope.initPaymentModeList();
        $scope.initServiceList();
        $scope.initShipmentTypeList();
        $scope.loadShipmentDataGrid();
        $scope.loadShipmentFiltering();
        $scope.shipmentResetData();
        $rootScope.manipulateDOM();
        if ($scope.shipmentFilteringDefinition.AutoLoad == true)
            $scope.shipmentDataDefinition.Retrieve = true;
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