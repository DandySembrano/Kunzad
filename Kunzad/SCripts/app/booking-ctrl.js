kunzadApp.controller("BookingController", BookingController);
function BookingController($scope, $http, $interval) {
    $scope.modelName = "Shipment";
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
    var pageSize = 20;

    //$interval(function () { }, 100);
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
            "BusinessUnit": null,
            "ServiceId": null,
            "ShipmentTypeId": null, //Remove before saving
            "PaymentMode": null,
            "CustomerId": null,
            "CustomerCode": null,
            "CustomerName": null,
            "CustomerAddress": null,
            "CustomerContactNo": null,
            "DeliverTo": null,
            "DeliveryAddressId": null, //Remove before saving
            "DeliveryAddress": null,
            "DeliverToContactNo": null,
            "OriginAddressId": null,
            "OriginAddress":null,
            "BillToCustomerId": null,
            "BillToCustomerCode": null,
            "BillToCustomerName": null,
            "Quantity": null,
            "TotalCBM": null,
            "IsRevenue": null,
            "Revenue": null,
            "IsTaxInclusive": null,
            "TaxAmount": null,
            "TaxPercentage": null,
            "Description": null,
            "TargetPickupDate": null,
            "TargetPickupTime": null,
            "IsConsolidation": null,
            "IsMultipleDelivery": null,
            "CreatedDate": null,
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null
        };

    };

    //Retrieve shipments
    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0;
        $http.get("/api/Shipments?page=" + page)
            .success(function (data, status) {
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

    //initialized shipment gridoption
    $scope.initShipmentGridOptions = function () {
        var columns = [];
        $scope.shipmentHeader   = ['Shipment No', 'Business Unit', 'Origin', 'Service', 'Qty', 'Total CBM', 'Cargo Description', 'Target Pickup Date', 'Target Pickup Time', 'Customer', 'Customer Address', 'Customer Contact No', 'Consignee', 'Consignee Address', 'Consignee Contact No', 'Bill To', 'Payment Mode', 'With Revenue?', 'Revenue', 'Tax Inclusive?', 'Tax Amount', 'Consolidated?', 'Multiple Delivery?', 'No'];
        $scope.shipmentKeys = ['Id', 'BusinessUnit.Name', 'Address.Line1', 'Service.Name', 'Quantity', 'TotalCBM', 'Description', 'TargetPickupDate', 'TargetPickupTime', 'Customer.Name', 'CustomerAddress.Line1', 'CustomerContact.ContactPhone.ContactNumber', 'DeliverTo', 'CustomerAddress.Line1', 'DeliverToContactNo', 'Customer.Name', 'PaymentMode', 'IsRevenue', 'Revenue', 'IsTaxInclusive', 'TaxAmount', 'IsConsolidation', 'IsMultipleDelivery'];
        $scope.KeyType     = ['Default', 'String', 'String', 'String', 'Decimal', 'Decimal', 'String', 'Date', 'Time', 'String', 'String', 'Default', 'String', 'String', 'Default', 'String', 'String', 'Bit', 'Default', 'Bit', 'Default', 'Bit', 'Bit'];
        $scope.colWidth         = [150, 150, 150, 100, 50, 150, 200, 150, 150, 200, 200, 200, 200, 200, 200, 200, 150, 130, 100, 120, 120, 120, 150];

        //Initialize Number Listing
        var columnProperties                    = {};
        columnProperties.name                   = $scope.shipmentHeader[$scope.shipmentHeader.length - 1];
        columnProperties.field                  = 'No';
        columnProperties.cellTemplate           = '<div class="ui-grid-cell-contents text-center">{{row.entity.No = (grid.appScope.currentPage == 1 ? (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) : ((grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.currentPage - 1) * grid.appScope.pageSize)))}}</div>';
        columnProperties.width                  = 40;
        columnProperties.enableColumnResizing   = true;
        columnProperties.enableColumnMenu       = false;
        columnProperties.enableColumnMoving     = false;
        columns.push(columnProperties);
        //Initialize column data
        for (var i = 0; i < ($scope.shipmentHeader.length - 1) ; i++) {
            var columnProperties = {};
            columnProperties.name   = $scope.shipmentHeader[i];
            columnProperties.field  = $scope.shipmentKeys[i];
            columnProperties.width  = $scope.colWidth[i];
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
            default:
                format = 'Default';
        }
        return format;
    };

    //Triggers when user create, delete, update or view a Shipping Line in the list
    $scope.actionForm = function (action) {
        $scope.actionMode = action;
        $scope.selectedShipmentIndex = $scope.searchShipment($scope.shipmentIDholder);
        $scope.selectedTab = $scope.tabPages[0];
        switch ($scope.actionMode) {
            case "Create":
                $scope.initializeShipmentItem();
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                break;
            case "Edit":
                $scope.shipmentItem = [];
                $scope.shipmentItem = angular.copy($scope.shipmentGridOptions.data[$scope.selectedShipmentIndex]);
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                break;
            case "Delete":
                $scope.shipmentItem = [];
                $scope.shipmentItem = angular.copy($scope.shipmentGridOptions.data[$scope.selectedShipmentIndex]);
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                break;
            case "View":
                $scope.shipmentItem = [];
                $scope.shipmentItem = angular.copy($scope.shipmentGridOptions.data[$scope.selectedShipmentIndex]);
                $scope.viewOnly = true;
                $scope.submitButtonText = "Close";
                break;
        }
    };

    // Initialization routines
    var init = function () {
        // Call function to load data during content load
        $scope.loadData($scope.currentPage);
        $scope.initShipmentGridOptions();
        $scope.initPaymentModeList();
        $scope.initServiceList();
        $scope.initShipmentTypeList();
    }
    init();
};