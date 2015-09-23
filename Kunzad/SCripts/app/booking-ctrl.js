﻿kunzadApp.controller("BookingController", BookingController);
function BookingController($scope, $http, $interval, $filter, $rootScope) {
    $scope.modelName = "Booking";
    $scope.modelhref = "#/booking";
    $scope.shipmentGridOptions = {};
    $scope.shipmentGridOptions.data = [];
    $scope.shipmentItem = {};
    $scope.isPrevPage = false;
    $scope.isNextPage = true;
    $scope.actionMode = "Create";
    $scope.selected = null;
    $scope.currentPage = 1;
    $scope.viewOnly = false;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.isErrorAddress = false;
    $scope.errorMessageAddress = "";
    $scope.submitButtonText = "Submit";
    $scope.tabPages = ["Information", "List"];
    $scope.selectedTab = "Information";
    $scope.shipmentIDholder = 0;
    $scope.selectedShipmentIndex = 0;
    $scope.controlNoHolder = 0;
    $scope.modalType = null;
    $scope.cityMunicipalities = null;
    var pageSize = 20;

    $interval(function () { }, 100);

    //Displays Modal
    $scope.showModal = function (panel, type) {
        if (type == "Pickup") {
            if ($scope.shipmentItem.Address1.Line1 != null)
                $scope.addressItem = angular.copy($scope.shipmentItem.Address1);
            else
                $scope.initAddressItem();
        }
        else if (type == "Consignee") {
            if ($scope.shipmentItem.Address.Line1 != null)
                $scope.addressItem = angular.copy($scope.shipmentItem.Address);
            else
                $scope.initAddressItem();
        }
        else { }
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
           $scope.isError = true;
           $scope.errorMessage = status;
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
           $scope.isError = true;
           $scope.errorMessage = status;
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
            $scope.isError = true;
            $scope.errorMessage = status;
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

    //Close address form
    $scope.closeAddressForm = function (addressItem) {
        if ($scope.validateAddressItem(addressItem)) {
            if ($scope.modalType == "Pickup")
                $scope.shipmentItem.Address1 = angular.copy(addressItem);
            else 
                $scope.shipmentItem.Address = angular.copy(addressItem);

            $scope.isErrorAddress = false;
            $scope.errorMessageAddress = "";
            $scope.initializeAddressField(addressItem, $scope.modalType)
            jQuery.magnificPopup.close();
        }
    }

    //Validate Address Item
    $scope.validateAddressItem = function (addressItem) {
        if (addressItem.Line1 == null || addressItem.Line1 == " ") {
            $scope.isErrorAddress = true;
            $scope.errorMessageAddress = "Street address line 1 is required.";
            return false;
        }
        else if (addressItem.CityMunicipalityId == null) {
            $scope.isErrorAddress = true;
            $scope.errorMessageAddress = "City/Municipality required.";
            return false;
        }
        else if (addressItem.PostalCode == null) {
            $scope.isErrorAddress = true;
            $scope.errorMessageAddress = "Postal Code required.";
            return false;
        }
        else
            return true;
    };

    //Initialize address field
    $scope.initializeAddressField = function (addressItem, type) {
        $scope.formattedAddress = addressItem.Line1 + (addressItem.Line2 == "" || addressItem.Line2 == null ? " " : ", " + addressItem.Line2) + "\n";
        $scope.formattedAddress += addressItem.CityMunicipality.Name + ", " + addressItem.CityMunicipality.StateProvince.Name + ", " + addressItem.PostalCode;
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
        $scope.paymentModeList = [{ "Id": "A", "Name": "Account" },
                                  { "Id": "P", "Name": "Prepaid" },
                                  { "Id": "C", "Name": "Collect Account" },
                                  { "Id": "D", "Name": "Cash On Delivery" }
        ]
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
            $scope.shipmentTypeList = data;
        })
    };

    //Initialize AddressItem for Address Modal
    $scope.initAddressItem = function () {
        $scope.addressItem = {
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
        }
    };

    //Initialized shipment item to it's default value
    $scope.initializeShipmentItem = function () {
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
                        "ContactPhones":[{
                            "ContactNumber":null
                        }]
                    }
                }],
            },
            "DeliverTo": null,
            "DeliveryAddressId": -1,
            "DeliveryAddress":null,
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
                    "Name": null
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
        };
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

    //initialized shipment gridoption
    $scope.initShipmentGridOptions = function () {
        var columns = [];
        $scope.shipmentHeader = ['Shipment No', 'Booking Date', 'Business Unit',        'Service',      'Shipment Type',        'Payment Mode', 'Booking Remarks',  'Qty',      'Total CBM',    'Cargo Description',    'Pickup Address',   'Target Pickup Date',   'Target Pickup Time',   'Customer',         'Customer Address',                     'Customer Contact No',                                                  'Consignee', 'Consignee Address',       'Consignee Contact No', 'No'];
        $scope.shipmentKeys =   ['Id',          'CreatedDate',  'BusinessUnit.Name',    'Service.Name', 'ShipmentType.Name',    'PaymentMode',  'BookingRemarks',   'Quantity', 'TotalCBM',     'Description',          'OriginAddress',    'PickupDate',           'PickupTime',           'Customer.Name',    'Customer.CustomerAddresses[0].Line1',  'Customer.CustomerContacts[0].Contact.ContactPhones[0].ContactNumber',  'DeliverTo', 'DeliveryAddress',   'DeliverToContactNo'];
        $scope.KeyType =        ['ControlNo',   'Date',         'String',               'String',       'String',               'PaymentMode',  'String',           'Number',   'Decimal',      'String',               'String',           'Date',                 'Time',                 'String',           'String',                               'Default',                                                              'String',    'String',                  'Default'];
        $scope.colWidth =       [150,           150,            150,                    100,            150,                    150,            200,                100,        150,            200,                    300,                150,                    150,                    200,                200,                                    200,                                                                    200,         300,                       200];
        $scope.RequiredFields = ['ServiceId-Service', 'ShipmentTypeId-Shipment Type', 'Quantity-Quantity', 'TotalCBM-Total CBM', 'Description-Cargo Description', 'CustomerId-Customer', 'PaymentMode-Payment Mode', 'DeliveryAddressId-Consignee address', 'OriginAddressId-Pickup address'];
        //Initialize Number Listing
        var columnProperties = {};
        columnProperties.name = $scope.shipmentHeader[$scope.shipmentHeader.length - 1];
        columnProperties.field = 'No';
        columnProperties.cellTemplate = '<div class="ui-grid-cell-contents text-center">{{row.entity.No = (grid.appScope.currentPage == 1 ? (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) : ((grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.currentPage - 1) * grid.appScope.pageSize)))}}</div>';
        columnProperties.width = 40;
        columnProperties.enableColumnResizing = true;
        columnProperties.enableColumnMenu = false;
        columnProperties.enableColumnMoving = false;
        columns.push(columnProperties);
        //Initialize column data
        for (var i = 0; i < ($scope.shipmentHeader.length - 1) ; i++) {
            var columnProperties = {};
            columnProperties.name = $scope.shipmentHeader[i];
            columnProperties.field = $scope.shipmentKeys[i];
            columnProperties.width = $scope.colWidth[i];
            //format field value
            columnProperties.cellFilter = $scope.filterValue($scope.KeyType[i]);
            columns.push(columnProperties);
        }
        $scope.shipmentGridOptions = {
            columnDefs: columns,
            rowTemplate: '<div>' +
                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell text-center"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id)"  context-menu="grid.appScope.setSelected(row.entity.Id)" data-target= "DataTableMenu"></div>' +
              '</div>',
            enableColumnResizing: true,
            enableGridMenu: true,
            enableSelectAll: true,
            exporterCsvFilename: 'myFile.csv',
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
    };

    //Retrieve shipments
    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $scope.BillToCustomer = [];
        $http.get("/api/Shipments?page=" + page)
            .success(function (data, status) {
                $scope.shipmentGridOptions.data = data;
                //for (var i = 0; i < $scope.shipmentGridOptions.data.length; i++) {
                //    //Retrieve BillToCustomer information per shipments
                //    $scope.shipmentGridOptions.data[i].BillToCustomer = {};
                //    var url = '/api/Customers?customerId=' + $scope.shipmentGridOptions.data[i].BillToCustomerId + '&customerContactId=' + $scope.shipmentGridOptions.data[i].BillToCustomerContactId;
                //    url = url + '&customerContactPhoneId=' + $scope.shipmentGridOptions.data[i].BillToCustomerContactPhoneId + '&customerAddressId=' + $scope.shipmentGridOptions.data[i].BillToCustomerAddressId;
                //    $http.get(url)
                //    .success(function (data1, status) {
                //        $scope.BillToCustomer.push(data1);
                //    })
                //    .error(function (error, status) {
                //        spinner.stop();
                //    })
                //};

                ////Initialize BillToCustomer property of shipmentItem
                //var promise = $interval(function () {
                //    if ($scope.BillToCustomer.length == $scope.shipmentGridOptions.data.length) {
                //        for (var i = 0; i < $scope.BillToCustomer.length; i++)
                //            $scope.shipmentGridOptions.data[i].BillToCustomer = angular.copy($scope.BillToCustomer[i]);
                //        $interval.cancel(promise);
                //        promise = undefined;
                //    }
                //}, 100);

                for (var i = 0; i < $scope.shipmentGridOptions.data.length; i++)
                {
                    //Initialize Pickup Address
                    $scope.shipmentGridOptions.data[i].OriginAddress =  $scope.initializeAddressField($scope.shipmentGridOptions.data[i].Address1, 'MasterList');
                    //Initalize Consignee Address
                    $scope.shipmentGridOptions.data[i].DeliveryAddress = $scope.initializeAddressField($scope.shipmentGridOptions.data[i].Address, 'MasterList');
                }

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
            })
    };

    //function that will be invoked when user click tab
    $scope.setSelectedTab = function (tab) {
        $scope.isError = false;
        $scope.errorMessage = "";
        $scope.selectedTab = tab;
    };

    //function that will be invoked when user delete, update or view a record in the shipment list
    $scope.setSelected = function (id) {
        $scope.shipmentIDholder = id;
    };

    //Initialize service type
    $scope.setServiceType = function (id) {
        for (var i = 0; i < $scope.serviceList.length; i++)
        {
            if (id == $scope.serviceList[i].Id)
            {
                $scope.shipmentItem.Service = $scope.serviceList[i];
                return true;
            }
        }
    };

    //Initialize shipment type
    $scope.setShipmentType = function (id)
    {
        for (var i = 0; i < $scope.shipmentTypeList.length; i++) {
            if (id == $scope.serviceList[i].Id) {
                $scope.shipmentItem.ShipmentType = $scope.shipmentTypeList[i];
                return true;
            }
        }
    }

    //search ShippingLine
    $scope.searchShipment = function (id) {
        var i = 0;
        for (i = 0; i < $scope.shipmentGridOptions.data.length; i++) {
            if (id == $scope.shipmentGridOptions.data[i].Id) {
                return i;
            }
        }
        return i;
    };

    //Function that will format key value
    $scope.filterValue = function (type) {
        var format;
        switch (type) {
            case 'String':
                format = 'ProperCase';
                break;
            case 'String-Upper':
                format = 'StringUpper';
                break;
            case 'Date':
                format = 'Date';
                break;
            case 'DateTime':
                format = 'DateTime';
                break;
            case 'Time':
                format = 'Time';
                break;
            case 'Boolean':
                format = 'Boolean';
                break;
            case 'Decimal':
                format = 'Decimal';
                break;
            case 'ControlNo':
                format = 'ControlNo';
                break;
            case 'PaymentMode':
                format = 'PaymentMode';
                break;
            default:
                format = 'Default';
        }
        return format;
    };

    //Search key
    $scope.searchKey = function (key) {
        if (angular.isDefined($scope.shipmentItem[key]))
                return true;
        return false;
    };

    //Function that check required fields
    $scope.checkRequiredFields = function () {
        var key = "", label = "";
        for (var i = 0; i < $scope.RequiredFields.length; i++) {
            var split = $scope.RequiredFields[i].split("-");
            key = split[0];
            //Check if key is valid
            if ($scope.searchKey(key) == false) {
                $scope.isError = true;
                $scope.errorMessage = " " + key + " is undefined.";
                return false;
            }
            else {
                //Check if label name exist in a key
                if (split.length == 2)
                    label = split[1];
                else {
                    $scope.isError = true;
                    $scope.errorMessage = " Label name is required for Key: " + key;
                    return false;
                }
                
                if ($scope.shipmentItem[key] == null || $scope.shipmentItem[key] == "") {
                    $scope.isError = true;
                    $scope.errorMessage = " " + label + " is required.";
                    return false;
                }
            }
        }
        return true;
    };

    //Function that will trigger during Edit,Delete and View Action
    $scope.onEDV = function ()
    {
        $scope.shipmentItem = [];
        $scope.shipmentItem = angular.copy($scope.shipmentGridOptions.data[$scope.selectedShipmentIndex]);
        $scope.shipmentItem.CustomerAddress = $scope.shipmentItem.Customer.CustomerAddresses[0].Line1 + "," + $scope.shipmentItem.Customer.CustomerAddresses[0].Line2 + "," + $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.Name + "," + $scope.shipmentItem.Customer.CustomerAddresses[0].PostalCode;
        $scope.shipmentItem.PickupDate = $filter('Date')($scope.shipmentItem.PickupDate);
        $scope.controlNoHolder = $scope.shipmentItem.Id;
        $scope.shipmentItem.Id = $rootScope.formatControlNo('', 15, $scope.shipmentItem.Id);
    }

    //Triggers when user create, delete, update or view a Shipping Line in the list
    $scope.actionForm = function (action) {
        $scope.actionMode = action;
        $scope.selectedShipmentIndex = $scope.searchShipment($scope.shipmentIDholder);
        $scope.selectedTab = $scope.tabPages[0];
        $scope.isError = false;
        $scope.errorMessage = "";
        switch ($scope.actionMode) {
            case "Create":
                $scope.initializeShipmentItem();
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                break;
            case "Edit":
                $scope.onEDV();
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                break;
            case "Delete":
                $scope.onEDV();
                $scope.viewOnly = true;
                $scope.submitButtonText = "Cancel";
                break;
            case "View":
                $scope.onEDV();
                $scope.viewOnly = true;
                $scope.submitButtonText = "Close";
                break;
        }
    };

    //Triggers before submit function
    $scope.preSubmit = function () {
        $scope.shipmentItem.Id              = $scope.controlNoHolder;
        $scope.shipmentItem.PickupDate      = $filter('date')(document.getElementById('pickupdate').value, "yyyy-MM-dd");
        $scope.shipmentItem.PickupTime      = $filter('date')(document.getElementById('pickuptime').value, "hh:mm:ss");
        $scope.shipmentItem.TotalCBM        = $filter('number')($scope.shipmentItem.TotalCBM, 4);
        return true;
    };

    //Set default 
    $scope.setDefault = function () {
        if ($scope.shipmentItem.IsRevenue == false)
            $scope.shipmentItem.Revenue = 0.00;
        if ($scope.shipmentItem.IsTaxInclusive == false)
        {
            $scope.shipmentItem.TaxAmount = 0.00;
            $scope.shipmentItem.TaxPercentage = 0.00;
        }
    };

    //Manage the submition of data base on the user action
    $scope.submit = function () {
        $scope.isError = false;
        $scope.errorMessage = "";
        if ($scope.preSubmit()) {
            switch ($scope.actionMode) {
                case 'Create':
                    if ($scope.checkRequiredFields()) {
                        if ($scope.apiCreate())
                            $scope.selectedTab = "List";
                    }
                    break;
                case 'Edit':
                    if ($scope.checkRequiredFields())
                        $scope.apiUpdate($scope.shipmentItem.Id)
                    break;
                case 'Delete':
                    $scope.apiDelete($scope.shipmentItem.Id);
                    break;
                case 'View':
                    $scope.selectedTab = $scope.tabPages[1];
                    break;
            }
        }
        $scope.focusOnTop();
    }

    //http post request for saving shipment information
    $scope.apiCreate = function () {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var dataModel = angular.copy($scope.shipmentItem);
        delete dataModel.Id;
        delete dataModel.TransportStatusId;
        delete dataModel.DeliveryAddressId;
        delete dataModel.OriginAddressId;
        delete dataModel.BusinessUnit;
        delete dataModel.BusinessUnit1;
        delete dataModel.Service;
        delete dataModel.ShipmentType;
        delete dataModel.Customer;
        delete dataModel.Address.Id;
        delete dataModel.Address1.Id;
        delete dataModel.Address.CityMunicipality;
        delete dataModel.Address1.CityMunicipality;
        $http.post("/api/Shipments", dataModel)
        .success(function (data, status) {
            if (data.status == "SUCCESS") {
                $scope.shipmentItem.Id = angular.copy(data.objParam1.Id);
                $scope.shipmentItem.CreatedDate = angular.copy(data.objParam1.CreatedDate);
                $scope.shipmentGridOptions.data.push($scope.shipmentItem);
                $scope.selectedTab = $scope.tabPages[1];
                spinner.stop();
                $scope.onEDV();
                alert("Successfully Saved.");
                return true;
            }
            else {
                spinner.stop();
                $scope.isError = true;
                $scope.errorMessage = data.message;
                return false;
            }
        })
        .error(function (error, status) {
            spinner.stop();
            $scope.isError = true;
            $scope.errorMessage = status;
            return false;
        });
    };

    //http put request for saving the changes of shipment information
    $scope.apiUpdate = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var dataModel = angular.copy($scope.shipmentItem);
        delete dataModel.BusinessUnit;
        delete dataModel.BusinessUnit1;
        delete dataModel.Service;
        delete dataModel.ShipmentType;
        delete dataModel.Customer;
        delete dataModel.Address.CityMunicipality;
        delete dataModel.Address1.CityMunicipality;
        $http.put("/api/Shipments" + "/" + id, dataModel)
        .success(function (data, status) {
            if (data.status = "SUCCESS") {
                $scope.shipmentGridOptions.data[$scope.selectedShipmentIndex] = angular.copy($scope.shipmentItem);
                $scope.selectedTab = $scope.tabPages[1];
                $scope.onEDV();
                spinner.stop();
                alert("Successfully Updated.");
            }
            else {
                spinner.stop();
                $scope.isError = true;
                $scope.errorMessage = data.message;
            }
        })
        .error(function (error, status) {
            spinner.stop();
            $scope.isError = true;
            $scope.errorMessage = status;
        });
    };

    //http delete request for deleting a shipment
    $scope.apiDelete = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.delete("/api/Shipments" + "/" + id)
        .success(function (data, status) {
            if (data.status = "SUCCESS") {
                //$scope.shipmentGridOptions.data.splice($scope.selectedShipmentIndex, 1);
                $scope.initializeShipmentItem();
                $scope.selectedTab = $scope.tabPages[1];
                spinner.stop();
                alert("Successfully Cancelled.");
            }
            else {
                spinner.stop();
                $scope.isError = true;
                $scope.errorMessage = data.message;
            }
        })
        .error(function (data, status) {
            spinner.stop();
            $scope.isError = true;
            $scope.errorMessage = status;
        })
    };

    //Set the focus on top of the page during load
    $scope.focusOnTop = function () {
        $(document).ready(function () {
            $(this).scrollTop(0);
        });
    };

    //Find specific character
    $scope.findCharacter = function (v, c) {
        for (var i = 0; i < v.length; i++)
        {
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
    });

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
    $scope.onSelectCity = function ($item, $model, $label) {
        $scope.addressItem.CityMunicipalityId = $item.Id;
        $scope.addressItem.CityMunicipality.Name = $item.Name;
        $scope.addressItem.CityMunicipality.StateProvince.Name = $item.StateProvinceName;
    };
    //---------------------------End of typeahead-----------------------------------------------

    // Initialization routines
    var init = function () {
        // Call function to load data during content load
        $scope.focusOnTop();
        $scope.initializeShipmentItem();
        $scope.loadData($scope.currentPage);
        $scope.initShipmentGridOptions();
        $scope.initCustomerList();
        $scope.initPaymentModeList();
        $scope.initServiceList();
        $scope.initShipmentTypeList();
        $scope.initAddressItem();
    };

    //Initialize needed functions during page load
    init();
};