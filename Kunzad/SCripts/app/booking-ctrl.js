kunzadApp.controller("BookingController", BookingController);
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
    $scope.submitButtonText = "Submit";
    $scope.tabPages = ["Information", "List"];
    $scope.selectedTab = "Information";
    $scope.shipmentIDholder = 0;
    $scope.selectedShipmentIndex = 0;
    $scope.controlNoHolder = 0;
    var pageSize = 20;

    //Displays Modal
    $scope.showModal = function (panel) {
        openModalPanel(panel);
    };

    //Show Customer Contacts List
    $scope.showCustomerContacts = function (customerId) {
        $http.get("/api/CustomerContacts?customerId=" + customerId)
       .success(function (data, status) {
           $scope.customerContactList = [];
           $scope.customerContactList = data;
           $scope.showModal('#customer-contacts-list-modal');
       })
       .error(function (error, status) {
           $scope.isError = true;
           $scope.errorMessage = status;
       });
    };

    //Show Customer Contact Phones List
    $scope.showCustomerContactPhones = function (contactId) {
        $http.get("/api/ContactPhones?contactId=" + contactId)
       .success(function (data, status) {
           $scope.customerContactPhoneList = [];
           $scope.customerContactPhoneList = data;
           $scope.showModal('#customer-contact-phones-list-modal');
       })
       .error(function (error, status) {
           $scope.isError = true;
           $scope.errorMessage = status;
       });
    };

    //Show Customer Addresses List
    $scope.showCustomerAddressList = function (customerId) {
        $http.get("/api/CustomerAddresses?customerId=" + customerId)
        .success(function (data, status) {
            $scope.customerAddressList = [];
            $scope.customerAddressList = data;
            $scope.showModal('#customer-address-list-modal');
        })
        .error(function (error, status) {
            $scope.isError = true;
            $scope.errorMessage = status;
        });
    };

    //Close Business Unit List Modal
    $scope.closeBusinessUnitList = function (bu) {
        if (angular.isDefined(bu)) {
            $scope.shipmentItem.BusinessUnitId = bu.Id;
            $scope.shipmentItem.BusinessUnit.Name = bu.Name;
        }
        else
            $scope.shipmentItem.BusinessUnitId = null;
        jQuery.magnificPopup.close();
    };

    //Close Customer List Modal
    $scope.closeCustomerList = function (c) {
        if (angular.isDefined(c)) {
            $scope.shipmentItem.CustomerId = c.Id;
            $scope.shipmentItem.Customer.Code = c.Code;
            $scope.shipmentItem.Customer.Name = c.Name;
            jQuery.magnificPopup.close();
            var promise = $interval(function () {
                $interval.cancel(promise);
                promise = undefined;
                $scope.showCustomerContacts(c.Id);
            }, 500);
        }
        else {
            $scope.shipmentItem.CustomerId = null;
            jQuery.magnificPopup.close();
        }
    };

    //Close Customer Contact List Modal
    $scope.closeCustomerContacts = function (cc) {
        if (angular.isDefined(cc)) {
            $scope.shipmentItem.CustomerContactId = cc.Contact.Id;
            jQuery.magnificPopup.close();
            var promise = $interval(function () {
                $interval.cancel(promise);
                promise = undefined;
                $scope.showCustomerContactPhones(cc.Contact.Id);
            }, 500);
        }
        else {
            $scope.shipmentItem.CustomerContactId = null;
            jQuery.magnificPopup.close();
        }
    };
    
    //Close Customer Contact Phone List Modal
    $scope.closeCustomerContactPhones = function (ccp) {
        if (angular.isDefined(ccp)) {
            $scope.shipmentItem.CustomerContactPhoneId = ccp.Id;
            $scope.shipmentItem.Customer.CustomerContacts[0].Contact.ContactNumber = ccp.ContactNumber;
            jQuery.magnificPopup.close();
            var promise = $interval(function () {
                $interval.cancel(promise);
                promise = undefined;
                $scope.showCustomerAddressList($scope.shipmentItem.CustomerId);
            }, 500);
        }
        else {
            $scope.shipmentItem.CustomerContactPhoneId = null;
            jQuery.magnificPopup.close();
        }
    };

    //Close Customer Address List Modal
    $scope.closeCustomerAddressList = function (ca) {
        if (angular.isDefined(ca)) {
            $scope.shipmentItem.CustomerAddressId = ca.Id;
            $scope.shipmentItem.CustomerAddress = ca.Line1 + ", " + ca.Line2 + ", " + ca.CityMunicipality.Name + ", " + ca.PostalCode;
            jQuery.magnificPopup.close();
        }
        else {
            $scope.shipmentItem.CustomerContactPhoneId = null;
            jQuery.magnificPopup.close();
        }
    };

    //Close Bill To Customer List Modal
    $scope.closeBillToCustomerList = function (c) {
        if (angular.isDefined(c)) {
            $scope.shipmentItem.BillToCustomerId = c.Id;
            $scope.shipmentItem.BillToCustomerCode = c.Code;
            $scope.shipmentItem.BillToCustomerName = c.Name;
        }
        else
            $scope.shipmentItem.BillToCustomerId = null;
        jQuery.magnificPopup.close();
    };

    //Initialize Business Unit List for Modal
    $scope.initBusinessUnitList = function () {
        $http.get("/api/BusinessUnits")
        .success(function (data, status) {
            $scope.businessUnitList = data;
        })
    };

    //Initialize Customer List for Modal
    $scope.initCustomerList = function () {
        $http.get("/api/Customers")
        .success(function (data, status) {
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
                        "Name": null
                    },
                }],
                "CustomerContacts": [{
                    "Contact": {
                        "ContactNumber": null
                    }
                }],
            },
            "DeliverTo": null,
            "DeliveryAddressId": null,
            "DeliveryAddress": null,
            "DeliverToContactNo": null,
            "Description": null,
            "OriginAddressId": null,
            "Origin": null,
            "BillToCustomerId": null,
            "BillToCustomerCode": null,
            "BillToCustomerName": null,
            "Quantity": 0,
            "TotalCBM": 0,
            "IsRevenue": false,
            "Revenue": 0,
            "IsTaxInclusive": false,
            "TaxAmount": 0,
            "TaxPercentage": 0,
            "Description": null,
            "PickupDate": null,
            "PickupTime": null,
            "IsConsolidation": false,
            "IsMultipleDelivery": false,
            "CreatedDate": null,
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null
        };

    };

    //initialized shipment gridoption
    $scope.initShipmentGridOptions = function () {
        var columns = [];
        $scope.shipmentHeader = ['Shipment No', 'Business Unit', 'Origin', 'Service', 'Shipment Type', 'Qty', 'Total CBM', 'Cargo Description', 'Target Pickup Date', 'Target Pickup Time', 'Customer', 'Customer Address', 'Customer Contact No', 'Consignee', 'Consignee Address', 'Consignee Contact No', 'Bill To', 'Payment Mode', 'With Revenue?', 'Revenue', 'Tax Inclusive?', 'Tax Amount', 'Consolidated?', 'Multiple Delivery?', 'No'];
        $scope.shipmentKeys = ['Id', 'BusinessUnit.Name', 'Address.Line1', 'Service.Name', 'ShipmentType.Name', 'Quantity', 'TotalCBM', 'Description', 'PickupDate', 'PickupTime', 'Customer.Name', 'Customer.CustomerAddresses[0].Line1', 'Customer.CustomerContacts[0].Contact.ContactNumber', 'DeliverTo', 'CustomerAddress.Line1', 'DeliverToContactNo', 'Customer.Name', 'PaymentMode', 'IsRevenue', 'Revenue', 'IsTaxInclusive', 'TaxAmount', 'IsConsolidation', 'IsMultipleDelivery'];
        $scope.KeyType = ['ControlNo', 'String', 'String', 'String', 'String', 'Decimal', 'Decimal', 'String', 'Date', 'Time', 'String', 'String', 'Default', 'String', 'String', 'Default', 'String', 'PaymentMode', 'Boolean', 'Default', 'Boolean', 'Default', 'Boolean', 'Boolean'];
        $scope.colWidth = [150, 150, 150, 100, 150, 100, 150, 200, 150, 150, 200, 200, 200, 200, 200, 200, 200, 150, 130, 100, 120, 120, 120, 150];
        $scope.RequiredFields = ['BusinessUnitId-Business Unit', 'ServiceId-Service', 'ShipmentTypeId-Shipment Type', 'Quantity-Quantity', 'TotalCBM-Total CBM', 'Description-Cargo Description', 'CustomerId-Customer', 'BillToCustomerId-Bill to Customer', 'DeliverTo-Consignee', 'Origin-Consignee Address', 'PaymentMode-Payment Mode'];
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
        var i = 0;
        $http.get("/api/Shipments?page=" + page)
            .success(function (data, status) {
                $http.get("/api/ContactPhones/" + data[0].CustomerContactId)
                .success(function (data1, status) {
                    data[0].Customer.CustomerContacts[0].Contact = data1;
                })

                $http.get("/api/CityMunicipalities/" + data[0].Customer.CustomerAddresses[0].CityMunicipalityId)
                .success(function (data1, status) {
                    data[0].Customer.CustomerAddresses[0].CityMunicipality = data1;
                })

                //initialize shipment
                $scope.shipmentGridOptions.data = data;
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
                $scope.shipmentItem = [];
                $scope.shipmentItem = angular.copy($scope.shipmentGridOptions.data[$scope.selectedShipmentIndex]);
                $scope.shipmentItem.CustomerAddress = $scope.shipmentItem.Customer.CustomerAddresses[0].Line1 + "," + $scope.shipmentItem.Customer.CustomerAddresses[0].Line2 + "," + $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.Name + "," + $scope.shipmentItem.Customer.CustomerAddresses[0].PostalCode;
                $scope.controlNoHolder = $scope.shipmentItem.Id;
                $scope.shipmentItem.Id = $rootScope.formatControlNo('', 15, $scope.shipmentItem.Id);
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                break;
            case "Delete":
                $scope.shipmentItem = [];
                $scope.shipmentItem = angular.copy($scope.shipmentGridOptions.data[$scope.selectedShipmentIndex]);
                $scope.shipmentItem.CustomerAddress = $scope.shipmentItem.Customer.CustomerAddresses[0].Line1 + "," + $scope.shipmentItem.Customer.CustomerAddresses[0].Line2 + "," + $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.Name + "," + $scope.shipmentItem.Customer.CustomerAddresses[0].PostalCode;
                $scope.controlNoHolder = $scope.shipmentItem.Id;
                $scope.shipmentItem.Id = $rootScope.formatControlNo('', 15, $scope.shipmentItem.Id);
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                break;
            case "View":
                $scope.shipmentItem = [];
                $scope.shipmentItem = angular.copy($scope.shipmentGridOptions.data[$scope.selectedShipmentIndex]);
                $scope.shipmentItem.CustomerAddress = $scope.shipmentItem.Customer.CustomerAddresses[0].Line1 + "," + $scope.shipmentItem.Customer.CustomerAddresses[0].Line2 + "," + $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.Name + "," + $scope.shipmentItem.Customer.CustomerAddresses[0].PostalCode;
                $scope.controlNoHolder = $scope.shipmentItem.Id;
                $scope.shipmentItem.Id = $rootScope.formatControlNo('', 15, $scope.shipmentItem.Id);
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
        $scope.shipmentItem.Revenue         = $filter('number')($scope.shipmentItem.Revenue, 4);
        $scope.shipmentItem.TaxAmount       = $filter('number')($scope.shipmentItem.TaxAmount, 4);
        $scope.shipmentItem.TaxPercentage   = $filter('number')($scope.shipmentItem.TaxPercentage, 4);
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
        $scope.preSubmit();
        
        switch ($scope.actionMode) {
            case 'Create':
                if ($scope.checkRequiredFields()) {
                    if($scope.apiCreate())
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
                break;
        }
        $scope.focusOnTop();
    }

    //http post request for saving shipment information
    $scope.apiCreate = function () {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var dataModel = angular.copy($scope.shipmentItem);
        delete dataModel.Id;
        delete dataModel.DeliveryAddressId;
        delete dataModel.OriginAddressId;
        delete dataModel.BusinessUnit;
        delete dataModel.Service;
        delete dataModel.ShipmentType;
        delete dataModel.Customer;
        $http.post("/api/Shipments", dataModel)
        .success(function (data, status) {
            if (data.status == "SUCCESS") {
                $scope.shipmentItem.Id = angular.copy(data.objParam1.Id);
                $scope.shipmentGridOptions.data.push($scope.shipmentItem);
                $scope.selectedTab = $scope.tabPages[1];
                spinner.stop();
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
        delete dataModel.DeliveryAddressId;
        delete dataModel.OriginAddressId;
        delete dataModel.BusinessUnit;
        delete dataModel.Service;
        delete dataModel.ShipmentType;
        delete dataModel.Customer;
        $http.put("/api/Shipments" + "/" + id, dataModel)
        .success(function (data, status) {
            if (data.status = "SUCCESS") {
                $scope.shipmentItem = angular.copy(data.objParam1);
                $scope.shipmentGridOptions.data[$scope.selectedShipmentIndex] = angular.copy($scope.shipmentItem);
                $scope.selectedTab = $scope.tabPages[1];
                spinner.stop();
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
                $scope.shipmentGridOptions.data.splice($scope.selectedShipmentIndex, 1);
                $scope.initializeShipmentItem();
                $scope.selectedTab = $scope.tabPages[1];
                spinner.stop();
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

    // Initialization routines
    var init = function () {
        // Call function to load data during content load
        $scope.focusOnTop();
        $scope.initializeShipmentItem();
        $scope.loadData($scope.currentPage);
        $scope.initShipmentGridOptions();
        $scope.initCustomerList();
        $scope.initBusinessUnitList();
        $scope.initPaymentModeList();
        $scope.initServiceList();
        $scope.initShipmentTypeList();
    };

    init();
};