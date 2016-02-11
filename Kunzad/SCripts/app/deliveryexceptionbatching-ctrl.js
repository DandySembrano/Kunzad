
kunzadApp.controller("DeliveryExceptionBatchingController", DeliveryExceptionBatchingController);
function DeliveryExceptionBatchingController($scope, $http, $interval, $filter, $rootScope, $compile) {
    $scope.modelName = "Delivery Exception Batching";
    $scope.modelhref = "#/deliveryexceptionbatching";
    $scope.withDirective = true; //this will remove the create and pagination buttons in list tab
    $scope.isPrevPage = false;
    $scope.isNextPage = true;
    $scope.dexToggle = false;
    $scope.actionMode = "Create";
    $scope.selected = null;
    $scope.currentPage = 1;
    $scope.viewOnly = false;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.submitButtonText = "Submit";
    $scope.tabPages = ["Information"];
    $scope.selectedTab = "Information";
    $scope.enableSave = true;
    $scope.selectedDexTypeId = null;
    var dateNow = new Date();

    $('#dexDate').datetimepicker({
        format: 'MM-DD-YYYY',
        sideBySide: false,
        pickTime: false,
        defaultDate: dateNow
    });

    $('#dexTime').datetimepicker({
        format: 'HH:mm:ss',
        sideBySide: false,
        pickTime: false,
        defaultDate: dateNow
    });

    //Initialize Dex Type List for DropDown
    $scope.initDexTypeList = function () {
        $http.get("/api/DeliveryExceptionTypes")
        .success(function (data, status) {
            $scope.dexTypeList = data;
        });
    };

    $scope.submit = function () {
        $scope.dexIsError = false;
        $scope.dexErrorMessage = "";
        $scope.dexShipmentsSubmitDefinition.Submit = true;
    }

    $scope.DeliveryExceptionResetData = function () {
        $scope.DeliveryExceptionItem = {
            "ShipmentId": null,
            "DexDate": null,
            "DexTime": null,
            "DexRemarks": null,
            "DexTypeId": null
        }
    }

    //Initialize Address fields
    $scope.initializeAddressField = function (addressItem) {
        $scope.formattedAddress = addressItem.Line1 + (addressItem.Line2 == "" || addressItem.Line2 == null ? " " : ", " + addressItem.Line2) + "\n";
        $scope.formattedAddress += addressItem.CityMunicipality.Name + ", " + (addressItem.CityMunicipality.StateProvince == null ? "" : addressItem.CityMunicipality.StateProvince.Name + "\n");
        $scope.formattedAddress += $scope.country.Name + ", " + addressItem.PostalCode;
        return $scope.formattedAddress;
    };

    //=================================================DEX SHIPMENT DATAGRID=================================================
    //Load dexShipments datagrid for compiling
    $scope.loadDexShipmentsDataGrid = function () {
        $scope.initDexShipmentsDataGrid();
        $scope.compileDexShipmentsDataGrid();
    };

    //initialize dexShipments datagrid parameters
    $scope.initDexShipmentsDataGrid = function () {
        $scope.initializeDexShipmentsDataDefinition = function () {
            $scope.dexShipmentsDataDefinition = {
                "Header": ['Shipment No', 'Transport Status', 'Booking Date', 'Business Unit', 'Operating Site', 'Service', 'Shipment Type', 'Payment Mode', 'Booking Remarks', 'Qty', 'Total CBM', 'Cargo Description', 'Pickup Address', 'Target Pickup Date', 'Target Pickup Time', 'Customer', 'Customer Address', 'Customer Contact No', 'Consignee', 'Consignee Address', 'Consignee Contact No', 'No.'],
                "Keys": ['ShipmentId', 'Shipment.TransportStatusId', 'Shipment.CreatedDate', 'Shipment.BusinessUnit.Name', 'Shipment.BusinessUnit1.Name', 'Shipment.Service.Name', 'Shipment.ShipmentType.Name', 'Shipment.PaymentMode', 'Shipment.BookingRemarks', 'Shipment.Quantity', 'Shipment.TotalCBM', 'Shipment.Description', 'Shipment.OriginAddress', 'Shipment.PickupDate', 'Shipment.PickupTime', 'Shipment.Customer.Name', 'Shipment.Customer.CustomerAddresses[0].Line1', 'Shipment.Customer.CustomerContacts[0].Contact.ContactPhones[0].ContactNumber', 'Shipment.DeliverTo', 'Shipment.DeliveryAddress', 'Shipment.DeliverToContactNo'],
                "Type": ['ControlNo', 'TransportStatus', 'Date', 'ProperCase', 'ProperCase', 'ProperCase', 'ProperCase', 'PaymentMode', 'Default', 'Default', 'Decimal', 'Default', 'ProperCase', 'Date', 'Time', 'ProperCase', 'ProperCase', 'Default', 'ProperCase', 'ProperCase', 'Default'],
                "ColWidth": [150, 150, 150, 150, 150, 150, 150, 150, 150, 200, 100, 150, 200, 300, 150, 150, 200, 200, 200, 200, 300, 200],
                "DataList": [],
                "RequiredFields": [],
                "IsEditable": [],
                "CellTemplate": ["None"],
                "RowTemplate": "Default",
                "EnableScroll": true,
                "EnablePagination": false,
                "CurrentPage": 1, //By default
                "PageSize": 20, //Should be the same in back-end
                "DoPagination": false, //By default
                "Retrieve": false, //By default
                "DataItem": {},
                "DataTarget": "DexShipmentsMenu",
                "DataTarget2": "DexShipmentsMenu2",
                "ShowCreate": false,
                "ShowContextMenu": true,
                "PopUpDetails": ["Shipment", "References/ShipmentDetails"],
                "ContextMenu": ["'Create'", "'Delete'", "'ShowShipmentDetails'"],
                "ContextMenuLabel": ['Add Shipment', 'Delete', 'Show Details'],
                "IsDetail": true
            }
        };

        $scope.initializeDexShipmentsSubmitDefinition = function () {
            $scope.dexShipmentsSubmitDefinition = {
                "Submit": false, //By default
                "APIUrl": '/api/DeliveryExceptionsBatching',
                "Type": 'Create', //By Default
                "DataItem": {},
                "Index": -1 //By Default
            }
        };

        $scope.dexShipmentsOtheractions = function (action) {
            switch (action) {
                case "FormCreate":
                    $scope.DeliveryExceptionResetData();
                    $scope.dexShipmentsDataDefinition.DataList.splice(0, $scope.dexShipmentsDataDefinition.DataList.length);
                    return true;

                case "PreCreateAction":
                    $scope.showModal('#shipment-list-modal');
                    return true;

                case "PostDeleteAction":
                    $scope.dexShipmentsDataDefinition.DataList.splice($scope.dexShipmentsSubmitDefinition.Index, 1);
                    if ($scope.dexShipmentsDataDefinition.DataList.length == 0)
                        $scope.dexShipmentsResetData();
                    return true;

                case "PreSave":
                    if ($scope.DeliveryExceptionItem.DexTypeId == undefined) {
                        alert("Please select dex type!");
                        return false;
                    }
                    if ($scope.DeliveryExceptionItem.DexRemarks == undefined) {
                        alert("Please enter dex remarks!");
                        return false;
                    }
                    if ($scope.dexShipmentsDataDefinition.DataList.length == 0) {
                        alert("Please select shipment!");
                        return false;
                    }
                    
                    var dexRemarks = $scope.DeliveryExceptionItem.DexRemarks;
                    var dexType = $scope.DeliveryExceptionItem.DexTypeId;
                    var dexDate = $("#dexDate").val();
                    var dexTime = $("#dexTime").val();

                    $scope.DeliveryExceptionList = [];
                    for (var i = 0; i < $scope.dexShipmentsDataDefinition.DataList.length; i++) {
                        $scope.DeliveryExceptionList.push($scope.DeliveryExceptionItem);
                        
                        $scope.DeliveryExceptionList[i].ShipmentId = $scope.dexShipmentsDataDefinition.DataList[i].ShipmentId;
                        $scope.DeliveryExceptionResetData();

                        $scope.DeliveryExceptionList[i].DexDate = dexDate;
                        $scope.DeliveryExceptionList[i].DexTime = dexTime;
                        $scope.DeliveryExceptionList[i].DexRemarks = dexRemarks;
                        $scope.DeliveryExceptionList[i].DexTypeId = dexType;
                    }

                    $scope.DeliveryExceptionItem.DexRemarks = dexRemarks;
                    $scope.DeliveryExceptionItem.DexTypeId = dexType;
                    $scope.dexShipmentsSubmitDefinition.DataItem = angular.copy($scope.DeliveryExceptionList);
                    alert("Delivery Exception successfully saved.");
                    $scope.submitButtonText = "Submit";
                    return true;

                default: return true;
            }
        };

        $scope.dexShipmentsResetData = function () {
            $scope.dexShipmentsItem = [{
                "Id": null,
                "ShipmentId": null,
                "Shipment": { }
            }]

            $scope.dexIsError = false;
            $scope.dexErrorMessage = "";
        };

        $scope.dexShipmentsShowFormError = function (error) {
            $scope.dexIsError = true;
            $scope.dexErrorMessage = error;
        };

        $scope.initializeDexShipmentsDataDefinition();
        $scope.initializeDexShipmentsSubmitDefinition();
    };

    //function that will be invoked during compiling datagrid to DOM
    $scope.compileDexShipmentsDataGrid = function () {
        var html = '<dir-data-grid2 datadefinition      = "dexShipmentsDataDefinition"' +
                                    'submitdefinition   = "dexShipmentsSubmitDefinition"' +
                                    'otheractions       = "dexShipmentsOtheractions(action)"' +
                                    'resetdata          = "dexShipmentsResetData()"' +
                                    'showformerror      = "dexShipmentsShowFormError(error)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#dexShipmentsContainer')).html(html);
        $compile($content)($scope);
    };
    //=================================================END OF DEX SHIPMENT DATAGRID=================================================

    //=================================================SHIPMENT MODAL/REPORT=================================================

    //Load businessUnit filtering for compiling
    $scope.loadShipmentFiltering = function () {
        $scope.initShipmentFilteringParameters();
        $scope.initShipmentFilteringContainter();
    };

    //initialize businessUnit filtering parameters
    $scope.initShipmentFilteringContainter = function () {
        html = '<dir-filtering id="shipmentFilter"  filterdefinition="shipmentFilteringDefinition"' +
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
                            { "Index": 3, "Label": "Service", "Column": "ServiceId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 4, "Label": "Shipment Type", "Column": "ShipmentTypeId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 5, "Label": "Payment Mode", "Column": "PaymentMode", "Values": $scope.paymentModeList, "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 6, "Label": "Target Pickup Date", "Column": "PickupDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 7, "Label": "Status", "Column": "TransportStatusId", "Values": $rootScope.getTransportStatusList(), "From": null, "To": null, "Type": "DropDown" }
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
                        $scope.shipmentFilteringDefinition.DataItem1.Shipment[0][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].From;
                        $scope.shipmentFilteringDefinition.DataItem1.Shipment[1][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].To;
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
                    /*Note: if pagination, initialize businessUnitDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize businessUnitDataDefinition DataList by pushing each value of filterDefinition DataList*/
                    //Required
                    //$scope.shipmentFilteringDefinition.DataList = $rootScope.formatShipment($scope.shipmentFilteringDefinition.DataList);
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

    //initialize businessUnit datagrid parameters
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
                "DataTarget": "ShipmentUnitMenu",
                "DataTarget": "ShipmentUnitMenu2",
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
                    for (var i = 0; i < $scope.dexShipmentsDataDefinition.DataList.length; i++) {
                        if ($scope.dexShipmentsDataDefinition.DataList[i].ShipmentId == $scope.shipmentDataDefinition.DataItem.Id) {
                            found = true;
                            i = $scope.dexShipmentsDataDefinition.DataList;
                        }
                    }
                    //Check if shipment is not yet in the list
                    if (!found) {
                        var originAddress = $scope.shipmentDataDefinition.DataItem.Address1;
                        var deliveryAddress = $scope.shipmentDataDefinition.DataItem.Address;
                        $scope.dexShipmentsItem.Id = $scope.dexShipmentsSubmitDefinition.Type == "Create" ? $scope.dexShipmentsDataDefinition.DataList.length + 1 : $scope.dexShipmentsDataDefinition.DataList.length > 0 ? $scope.dexShipmentsDataDefinition.DataList[$scope.dexShipmentsDataDefinition.DataList.length - 1].Id + 1 : $scope.dexShipmentsDataDefinition.DataList.length + 1;
                        $scope.dexShipmentsItem.ShipmentId = $scope.shipmentDataDefinition.DataItem.Id;
                        $scope.dexShipmentsItem.Shipment = $scope.shipmentDataDefinition.DataItem;
                        $scope.dexShipmentsItem.Shipment.OriginAddress = $scope.initializeAddressField(originAddress);
                        $scope.dexShipmentsItem.Shipment.DeliveryAddress = $scope.initializeAddressField(deliveryAddress);
                        $scope.dexIsError = false;
                        $scope.dexErrorMessage = "";
                        $scope.dexShipmentsDataDefinition.DataList.push($scope.dexShipmentsItem);
                    }
                    else {
                        alert("Shipment is already in the list.");
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
        var html = '<dir-data-grid2 id="shipmentGrid" datadefinition      = "shipmentDataDefinition"' +
                                    'submitdefinition   = "shipmentSubmitDefinition"' +
                                    'otheractions       = "shipmentOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#shipmentContainer')).html(html);
        $compile($content)($scope);
    };
    //=================================================END OF SHIPMENT MODAL=================================================

    $scope.showModal = function (panel) {
        $scope.shipmentDataDefinition.Retrieve = true;
        openModalPanel(panel);
    };

    $scope.closeModal = function () {
        jQuery.magnificPopup.close();
    };

    //Set the focus on top of the page during load
    $scope.focusOnTop = function () {
        $(document).ready(function () {
            $(this).scrollTop(0);
        });
    };

    // Initialization routines
    var init = function () {
        $scope.focusOnTop();
        $scope.initDexTypeList();
        $scope.loadDexShipmentsDataGrid();
        $scope.dexShipmentsResetData();
        $scope.loadShipmentDataGrid();
        $scope.loadShipmentFiltering();
        $scope.DeliveryExceptionResetData();
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
};