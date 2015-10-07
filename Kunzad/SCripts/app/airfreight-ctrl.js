kunzadApp.controller("AirFreightsController", AirFreightsController);
function AirFreightsController($scope, $http, $interval, $filter, $rootScope, $compile) {
    $scope.modelName = "Air Freight";
    $scope.modelhref = "#/airfreight";
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
    $scope.showMenu = false;
    $scope.airFreightItem = [];
    //$scope.airFreightList = [];
    $scope.businessUnitList = [];
    $scope.shipmentItem = [];
    var pageSize = 20;

    // INITIALIZE TRUCKING ITEM
    $scope.initAirFreightItem = function () {
        $scope.airFreightItem = {
            "Id": null,
            "AirlineId": null,
            "Airline": {
                "Id": null,
                "Name": null
            },
            "AirlineWaybillNumber": null,
            "AirlineWaybillDate": null,
            "EstimatedDepartureDate": null,
            "EstimatedDepartureTime": null,
            "EstimatedArrivalDate": null,
            "EstimatedArrivalTime": null,
            "OriginBusinessUnitId": null,
            "DestinationBusinessUnitId": null,
            "DepartureDate": null,
            "DepartureTime": null,
            "ArrivalDate": null,
            "ArrivalTime": null,
            "CreatedDate": null,
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null,
            "Shipment": []
        };
    };

    $scope.addNewShipment = function () {
        $scope.shipmentItem.push(
             {
                 "Id": null,
                 "TruckingId": null,
                 "ShipmentId": null,
                 "Shipment": {
                     "Id": null,
                     "BusinessUnitId": null,
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
                     "Customer": {
                     "Id": null,
                         "Name": null
                     },
                     "Quantity": null,
                     "TotalCBM": null,
                     "Description": null,
                     "DeliverTo": null,
                     "DeliveryAddressId": null,
                     "DeliveryAddress": null,
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
                                 "Name": null,
                                 "CountryId": null,
                                 "Country": {
                                     "Id": null,
                                     "Name": null
                                 }
                             }

                         },
                         "PostalCode": null
                     }
                 },
                 "CustomerId": null,
                 "Customer": { 
                    "Id": null,
                    "Name": null 
                    },
                    "Quantity": null,
                 "CBM": null,
                 "Description": null,
                 "DeliverTo": null,
                 "DeliveryAddressId": null,
                 "DeliveryAddress": null,
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
                            "Name": null,
                            "CountryId": null,
                            "Country": {
                                "Id": null,
                                "Name": null
                             }
                         }

                     },
                                "PostalCode": null
                 },
                "DeliveryDate": null,
                "DeliveryTime": null,
                "CostAllocation": null,
                "CreatedDate": null,
                "LastUpdatedDate": null,
                "CreatedByUserId": null,
                "LastUpdatedByUserId": null
             }
        );
    };

    // SHOW MODAL
    $scope.showModal = function (panel) {
        openModalPanel(panel);
    };

    // INITIALIZE BUSINESS UNITS
    $scope.initBusinessUnits = function () {
        $http.get("/api/BusinessUnits")
        .success(function (data, status) {
            $scope.businessUnitList = data;
        });
    };

    // INITIALIZE SHIPMENTS
    //$scope.initShipments = function () {
    //    $http.get("/api/Shipments")
    //    .success(function (data, status) {
    //        $scope.shipmentList = data;
    //    });
    //};

    //=======================================SHIPMENT MODAL==========================================
    //$scope.showCustomer = function () {
    //    $scope.customerFilteringDefinition.SetSourceToNull = true;
    //    $scope.customerDataDefinition.Retrieve = true;
    //    openModalPanel("#customer-list-modal");

    //};
    $scope.showShipment = function () {
        $scope.shipmentFilteringDefinition.SetSourceToNull = true;
        $scope.shipmentDataDefinition.Retrieve = true;
        openModalPanel("#shipment-list-modal");

    };

    //Load shipment filtering for compiling
    //$scope.loadCustomerFiltering = function () {
    //    $scope.initCustomerFilteringParameters();
    //    $scope.initCustomerFilteringContainter();
    //};
    $scope.loadShipmentFiltering = function () {
        $scope.initShipmentFilteringParameters();
        $scope.initShipmentFilteringContainer();
    };

    //initialize shipment filtering parameters
    //$scope.initCustomerFilteringContainter = function () {
    //    html = '<dir-filtering  filterdefinition="customerFilteringDefinition"' +
    //                            'filterlistener="customerDataDefinition.Retrieve"' +
    //                            'otheractions="customerOtherActionsFiltering(action)"' +
    //           '</dir-filtering>';
    //    $content = angular.element(document.querySelector('#customerFilterContainter')).html(html);
    //    $compile($content)($scope);
    //};
    $scope.initShipmentFilteringContainer = function () {
        html = '<dir-filtering  filterdefinition="shipmentFilteringDefinition"' +
                                'filterlistener="shipmentDataDefinition.Retrieve"' +
                                'otheractions="shipmentOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#shipmentFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of business unit filtering to DOM
    $scope.initShipmentFilteringParameters = function () {
        $scope.initShipmentFilteringDefinition = function () {
            $scope.shipmentFilteringDefinition = {
                "Url": ($scope.shipmentDataDefinition.EnablePagination == true ? 'api/Shipments?type=paginate&param1=' + $scope.shipmentDataDefinition.CurrentPage : 'api/Shipments?type=scroll&param1=' + $scope.shipmentDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index
                "Source": [
                            { "Index": 0, "Label": "Shipment No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "Booking Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 2, "Label": "Customer", "Column": "CustomerId", "Values": [], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 3, "Label": "BusinessUnit", "Column": "BusinessUnitId", "Values": ['GetBusinessList'], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 4, "Label": "Service", "Column": "ServiceId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 5, "Label": "Shipment Type", "Column": "ShipmentTypeId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                            //{ "Index": 6, "Label": "Payment Mode", "Column": "PaymentMode", "Values": $scope.paymentModeList, "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 6, "Label": "Target Pickup Date", "Column": "PickupDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 7, "Label": "Operation Site", "Column": "PickUpBussinessUnitId", "Values": [], "From": null, "To": null, "Type": "Modal" }
                            //,
                            //{ "Index": 9, "Label": "Status", "Column": "TransportStatusId", "Values": $rootScope.getTransportStatusList(), "From": null, "To": null, "Type": "DropDown" }
                ],//Contains the Criteria definition
                "Multiple": false,
                "AutoLoad": true,
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
                    /*Note: if pagination, initialize customerDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize customerDataDefinition DataList by pushing each value of filterDefinition DataList*/
                    //Required
                    //$scope.customerFilteringDefinition.DataList = $rootScope.formatCustomer($scope.customerFilteringDefinition.DataList);
                    if ($scope.shipmentDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.shipmentFilteringDefinition.DataList.length; j++)
                            $scope.shipmentDataDefinition.DataList.push($scope.shipmentFilteringDefinition.DataList[j]);
                    }

                    if ($scope.shipmentDataDefinition.EnablePagination == true) {
                        $scope.shipmentDataDefinition.DataList = [];
                        $scope.shipmentDataDefinition.DataList = $scope.shipmentFilteringDefinition.DataList;
                        $scope.shipmentDataDefinition.DoPagination = true;
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
    };

    //Load business datagrid for compiling
    $scope.loadShipmentDataGrid = function () {
        $scope.initShipmentDataGrid();
        $scope.compileShipmentDataGrid();
    };

    //initialize customer datagrid parameters
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
                "ShowCreate": false,
                "ShowContextMenu": false,
                "ContextMenu": [""],
                "ContextMenuLabel": [""]
            }
            $scope.shipmentDataDefinition.RowTemplate = '<div>' +
                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                '</div>';
        };

        $scope.shipmentOtherActions = function (action) {
            switch (action) {
                case 'PostEditAction':
                    $scope.shipmentItem.Id = $scope.shipmentDataDefinition.DataItem.Id;
                    alert($scope.shipmentItem.Id);
                    console.log($scope.shipmentDataDefinition.DataItem);
                    //$scope.shipmentItem.Customer.Code = $scope.customerDataDefinition.DataItem.Code;
                    //$scope.shipmentItem.Customer.Name = $scope.customerDataDefinition.DataItem.Name;
                    $scope.closeModal();
                    //var promise = $interval(function () {
                    //    $interval.cancel(promise);
                    //    promise = undefined;
                    //    $scope.showCustomerContacts();
                    //}, 500);
                    return true;
                default: return true;
            }
        };

        $scope.initializeShipmentDataDefinition();
    };

    //function that will be invoked during compiling of customer datagrid to DOM
    $scope.compileShipmentDataGrid = function () {
        var html = '<dir-data-grid2 datadefinition      = "shipmentDataDefinition"' +
                                    'submitdefinition   = "shipmentSubmitDefinition"' +
                                    'otheractions       = "shipmentOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#shipmentContainer')).html(html);
        $compile($content)($scope);
    };
    //=====================================END OF CUSTOMER MODAL=======================================

    // CLOSE MODAL BUSINESS UNIT FOR ORIGIN
    $scope.closeModalBusinessUnitOrigin = function (buo) {
        if (angular.isDefined(buo)) {
            $scope.airFreightItem.OriginBusinessUnitId = buo.Id;
            $scope.airFreightItem.OriginBusinessUnitName = buo.Name;
        } else {
            $scope.airFreightItem.OriginalBusinessUnitId = null;
            $scope.airFreightItem.OriginalBusinessUnitName = null;
        }
        jQuery.magnificPopup.close();
    };

    // CLOSE MODAL BUSINESS UNIT FOR DESTINATION
    $scope.closeModalBusinessUnitDestination = function (bud) {
        if (angular.isDefined(bud)) {
            $scope.airFreightItem.DestinationBusinessUnitId = bud.Id;
            $scope.airFreightItem.DestinationBusinessUnitName = bud.Name;
        } else {
            $scope.airFreightItem.DestinationBusinessUnitId = null;
            $scope.airFreightItem.DestinationBusinessUnitName = null;
        }
        jQuery.magnificPopup.close();
    };

    //Set the focus on top of the page during load
    $scope.focusOnTop = function () {
        $(document).ready(function () {
            $(this).scrollTop(0);
        });
    };

    $scope.closeModal = function () {
        jQuery.magnificPopup.close();
    };

    // Initialization routines
    var init = function () {
        $scope.focusOnTop();
        $scope.initAirFreightItem();
        $scope.initBusinessUnits();
        $scope.loadShipmentDataGrid();
        $scope.loadShipmentFiltering();
        $scope.addNewShipment();

        if ($scope.shipmentFilteringDefinition.AutoLoad == true)
            $scope.shipmentDataDefinition.Retrieve = true;
    };

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
}