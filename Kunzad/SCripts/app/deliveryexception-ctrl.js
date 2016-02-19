
kunzadApp.controller("DeliveryExceptionController", DeliveryExceptionController);
function DeliveryExceptionController($scope, $http, $interval, $filter, $rootScope, $compile, $localForage) {
    $localForage.getItem("Token").then(function (value) {
        $http.defaults.headers.common['Token'] = value;
    });
    $scope.modelName = "Delivery Exception";
    $scope.modelhref = "#/deliveryexception";
    $scope.withDirective = true; //this will remove the create and pagination buttons in list tab
    $scope.shipmentItem = {};
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
    $scope.shipmentIdholder = 0;
    $scope.selectedDexIndex = 0;
    $scope.controlNoHolder = 0;
    $scope.flagOnRetrieveDetails = false;
    $scope.enableSave = true;
    var pageSize = 20;

    $scope.showModal = function (panel) {
        switch (panel) {
            case '#shipment-list-modal':
                $scope.loadShipmentDataGrid();
                $scope.loadShipmentFiltering();
                $scope.shipmentFilteringDefinition.SetSourceToNull = true;
                $scope.shipmentDataDefinition.Retrieve = true;
                break;
            case '#dexType-list-modal':
                $scope.loadDexTypeDataGrid();
                $scope.loadDexTypeFiltering();
                $scope.dexTypeFilteringDefinition.SetSourceToNull = true;
                $scope.dexTypeDataDefinition.Retrieve = true;
                break;
        }

        openModalPanel2(panel);
    };

    $scope.closeModal = function () {
        jQuery.magnificPopup.close();
        if (angular.isDefined($scope.shipmentDataDefinition)) {
            $scope.shipmentDataDefinition.DataList = [];
            $scope.shipmentFilteringDefinition.DataList = [];
            $rootScope.removeElement("shipmentGrid");
            $rootScope.removeElement("shipmentFilter");
        }
        if (angular.isDefined($scope.dexTypeDataDefinition)) {
            $scope.dexTypeDataDefinition.DataList = [];
            $scope.dexTypeFilteringDefinition.DataList = [];
            $rootScope.removeElement("dexTypeGrid");
            $rootScope.removeElement("dexTypeFilter");
        }
    };

    //Initialize Address fields
    $scope.initializeAddressField = function (addressItem) {
        $scope.formattedAddress = addressItem.Line1 + (addressItem.Line2 == "" || addressItem.Line2 == null ? " " : ", " + addressItem.Line2) + "\n";
        $scope.formattedAddress += addressItem.CityMunicipality.Name + ", " + (addressItem.CityMunicipality.StateProvince == null ? "" : addressItem.CityMunicipality.StateProvince.Name + "\n");
        $scope.formattedAddress += $scope.country.Name + ", " + addressItem.PostalCode;
        return $scope.formattedAddress;
    };

    //Set the focus on top of the page during load
    $scope.focusOnTop = function () {
        $(document).ready(function () {
            $(this).scrollTop(0);
        });
    };

    //don't allow input
    $('#shipmentId').keypress(function (key) {
        return false;
    });

    $scope.dexTypeObj = function () {
        return {
            "DeliveryExceptionType": [{
                "Id": null,
                "Name": null,
                "Status": null
            },
            {
                "Id": null,
                "Name": null,
                "Status": null
            }]
        };
    }

    $scope.loadDetail = function (shipmentId) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0;
        $http.get("/api/DeliveryExceptions?shipmentId=" + shipmentId + "&page=1")
            .success(function (data, status) {
                //initialize dex detail
                $scope.deliveryExceptionDetailDataDefinition.DataList.length = 0;
                for (var i = 0; i < data.length; i++) {
                    $scope.deliveryExceptionDetailDataDefinition.DataList.push($scope.dexItem);
                    $scope.indexHolder = $scope.deliveryExceptionDetailDataDefinition.DataList.length - 1;
                    $scope.deliveryExceptionDetailDataDefinition.DataList[i] = angular.copy(data[i]);
                    $scope.deliveryExceptionDetailDataDefinition.DataList[i].DeliveryExceptionType.Name = angular.copy(data[i].DeliveryExceptionType.Name);
                    //$scope.dexItem.DexType.Name = angular.copy(data[i].DeliveryExceptionType.Name);
                }
                $scope.flagOnRetrieveDetails = true;
                spinner.stop();
            })
            .error(function (error, status) {
                $scope.flagOnRetrieveDetails = true;
                $scope.deliveryExceptionIsError = true;
                $scope.deliveryExceptionErrorMessage = status;
                spinner.stop();
            });

    };

    //=================================================START OF DEX DATA GRID=================================================
    //Initialized dex item to it's default value
    $scope.deliveryExceptionResetData = function () {
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
                "Name": null,
                "ServiceCategoryId": null,
                "ServiceCategory": {
                    "Id": null,
                    "Name": null
                }
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
            "DeliveryAddressId": null,
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
            "ParentShipmentId": null,
            "DexNo1": null,
            "DexNo2": null,
            "Description": null,
            "OriginAddressId": null,
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
    };

    //Load variable datagrid for compiling
    $scope.loadDeliveryExceptionDataGrid = function () {
        $scope.initDeliveryExceptionDataGrid();
        $scope.compileDeliveryExceptionDataGrid();
    };

    //initialized consolidation data grid
    $scope.initDeliveryExceptionDataGrid = function () {
        $scope.initDeliveryExceptionDataDefinition = function () {
            $scope.deliveryExceptionDataDefinition = {
                "Header": ['Date', 'Time', 'DEX Type', 'Remarks', 'No'],
                "Keys": ['DexDate', 'DexTime', 'DexType.Name', 'DexRemarks'],
                "Type": ['Date', 'Time', 'ProperCase', 'ProperCase'],
                "ColWidth": [200, 200, 200, 400],
                "DataList": [],
                "RequiredFields": [],
                "CellTemplate": ["None"],
                "RowTemplate": "Default",
                "EnableScroll": true,
                "EnablePagination": false,
                "CurrentPage": 1,//By default
                "PageSize": 20, //Should be the same in back-end
                "DoPagination": false, //By default
                "Retrieve": false, //By default
                "DataItem": {},
                "DataTarget": "deliveryExceptionMenu",
                "DataTarget2": "deliveryExceptionMenu1",
                "ShowCreate": true,
                "ShowContextMenu": true,
                "ContextMenu": ["'Load'", "'Create'", "'Edit'", "'Delete'", "'View'", "'Find'", "'Clear'"],
                "ContextMenuLabel": ['Reload', 'Create', 'Edit', 'Cancel', 'View', 'Find', 'Clear']
                //"IsDetail": false
            }
        };

        $scope.initDeliveryExceptionSubmitDefinition = function () {
            $scope.deliveryExceptionSubmitDefinition = {
                "Submit": false, //By default
                "APIUrl": '/api/DeliveryExceptions',
                "Type": 'Create', //By Default
                "DataItem": [],
                "Index": -1 //By Default
            }
        };

        $scope.deliveryExceptionOtheractions = function (action) {
            switch (action) {
                case "FormCreate":
                    $scope.submitButtonText = "Submit";
                    $scope.deliveryExceptionSubmitDefinition.Type = "Create";
                    $scope.selectedTab = $scope.tabPages[0];
                    $scope.deliveryExceptionResetData();
                    $scope.deliveryExceptionDetailDataDefinition.DataList.splice(0, $scope.consolidationDetailDataDefinition.DataList.length);
                 //   $scope.deliveryExceptionDetailResetData();
                    $scope.enableSave = true;
                    $scope.viewOnly = false;
                    return true;
                case "PreAction":
                    return true;
                case "PostCreateAction":
                    $scope.submitButtonText = "Submit";
                    $scope.deliveryExceptionSubmitDefinition.Type = "Create";
                    $scope.selectedTab = $scope.tabPages[0];
                    $scope.deliveryExceptionResetData();
                    $scope.deliveryExceptionDetailDataDefinition.DataList.splice(0, $scope.consolidationDetailDataDefinition.DataList.length);
                    $scope.deliveryExceptionDetailResetData();
                    $scope.enableSave = true;
                    $scope.viewOnly = false;
                    return true;
                case "PostEditAction":
                    return true;
                case "PostDeleteAction":
                    return true;
                case "PostViewAction":
                    return true;
                case "PreSubmit":
                    //if (!$scope.validconsolidationDetail())
                    //    return false;
                    for (var i = 0; i < $scope.deliveryExceptionDetailDataDefinition.DataList.length; i++) {
                        $scope.deliveryExceptionSubmitDefinition.DataItem.push($scope.deliveryExceptionDetailDataDefinition.DataList[i]);
                        $scope.deliveryExceptionSubmitDefinition.DataItem[i].ShipmentId = $scope.controlNoHolder;
                    }

                    return true;
                case "PreSave":
                    $scope.dexTypeName = [];
                    for (var i = 0; i < $scope.deliveryExceptionSubmitDefinition.DataItem.length; i++) {
                        $scope.dexTypeName[i] = $scope.deliveryExceptionSubmitDefinition.DataItem[i].DeliveryExceptionType;
                        delete $scope.deliveryExceptionSubmitDefinition.DataItem[i].id;
                        delete $scope.deliveryExceptionSubmitDefinition.DataItem[i].DeliveryExceptionType;
                    }
                    $http.put('/api/DeliveryExceptions/' + $scope.controlNoHolder, $scope.deliveryExceptionSubmitDefinition.DataItem)
                            .success(function (data, status, headers) {
                                $scope.enableSave = false;
                                $scope.viewOnly = true;
                                alert("Successfully Saved.");

                            });
                    return false;
                case "PostSave":
                    for (var i = 0; i < $scope.deliveryExceptionDetailDataDefinition.DataList.length; i++) {
                        $scope.deliveryExceptionDetailDataDefinition.DataList[i].DeliveryExceptionType.Name = $scope.dexTypeName[i];
                    }
                    $scope.viewOnly = true;
                    $scope.deliveryExceptionSubmitDefinition.Type = "Edit";
                    $scope.enableSave = false;
                    alert("Successfully Saved.");
                    return true;
                case "PreUpdate":
                    return true;
                case "PostUpdate":
                    return true;
                case "PreDelete":
                    return true;
                case "PostDelete":
                    return true;
                case "PostView":
                    return true;
                case "Find":
                    return true;
                case "Clear":
                    return true;
                default: return true;
            }
        };

        $scope.deliveryExceptionShowFormError = function (error) {
            $scope.deliveryExceptionIsError = true;
            $scope.deliveryExceptionErrorMessage = error;
        };

        $scope.initDeliveryExceptionDataDefinition();
        $scope.initDeliveryExceptionSubmitDefinition();
    };
    
    //function that will be invoked during compiling of consolidation datagrid to DOM
    $scope.compileDeliveryExceptionDataGrid = function () {
        var html = '<dir-data-grid3 datadefinition      = "deliveryExceptionDataDefinition"' +
                                    'submitdefinition   = "deliveryExceptionSubmitDefinition"' +
                                    'otheractions       = "deliveryExceptionOtheractions(action)"' +
                                    'resetdata          = "deliveryExceptionResetData()"' +
                                    'showformerror      = "deliveryExceptionShowFormError(error)">' +
                    '</dir-data-grid3>';
        $content = angular.element(document.querySelector('#deliveryExceptionContainer')).html(html);
        $compile($content)($scope);
    };
    
    //=================================================END OF DEX DATA GRID=================================================

    //=================================================DEX DETAIL DATAGRID=================================================
    //Load DEX DETAIL datagrid for compiling
    $scope.loadDeliveryExceptionDetailDataGrid = function () {
        $scope.initDeliveryExceptionDetailDataGrid();
        $scope.compileDeliveryExceptionDetailDataGrid();
    };

    //initialize dexDetail datagrid parameters
    $scope.initDeliveryExceptionDetailDataGrid = function () {
        $scope.initializeDeliveryExceptionDetailDataDefinition = function () {
            $scope.deliveryExceptionDetailDataDefinition = {
                "Header": ['DEX Type', 'Date', 'Time', 'Remarks', 'No'],
                "Keys": ['DeliveryExceptionType.Name', 'DexDate', 'DexTime', 'DexRemarks'],
                "Type": ['ProperCase', 'Date', 'Time', 'ProperCase'],
                "ColWidth": [200, 200, 200, 400],
                "DataList": [],
                "RequiredFields": [],
                "IsEditable": [true, true, true, true],
                "IsDatepicker": [false, true, true, false],
                "CellTemplate": [],
                "RowTemplate": "Default",
                "EnableScroll": true,
                "EnablePagination": false,
                "CurrentPage": 1, //By default
                "PageSize": 20, //Should be the same in back-end
                "DoPagination": false, //By default
                "DataItem": {},
                "DataTarget": "DexDetailMenu",
                "DataTarget2": "DexDetailMenu2",
                "ShowContextMenu": true,
                "ContextMenu": ["'Create'", "'Delete'"],
                "ContextMenuLabel": ['Add Delivery Exception', 'Delete']
                //"IsUpdated": false //default,
                //"IsDetail":true

            }
        };

        $scope.initializeDeliveryExceptionDetailSubmitDefinition = function () {
            $scope.deliveryExceptionDetailSubmitDefinition = {
                "Submit": false, //By default
                "APIUrl": '',
                "Type": 'Create', //By Default
                "DataItem": {},
                "Index": -1 //By Default
            }
        };

        $scope.deliveryExceptionDetailOtheractions = function (action) {
            switch (action) {
                case "FormCreate":
                    return true;

                case "PreAction":
                    return true;

                case "PreCreateAction":
                    if (!$scope.viewOnly) {
                        if ($scope.deliveryExceptionDetailDataDefinition.DataList.length > 0) {
                            var upperRow = $scope.deliveryExceptionDetailDataDefinition.DataList.length - 1;
                            if ($scope.deliveryExceptionDetailDataDefinition.DataList[upperRow].DeliveryExceptionType.Name == null) {
                                $scope.dexIsError = true;
                                $scope.dexErrorMessage = "Please fill in existing row before adding a new one.";
                                $scope.focusOnTop();
                                return false;
                            }
                        }
                        $scope.deliveryExceptionDetailDataDefinition.DataList.push($scope.dexItem);
                        $scope.indexHolder = $scope.deliveryExceptionDetailDataDefinition.DataList.length - 1;

                        $scope.deliveryExceptionDetailOtheractions('D E X Type');
                        // $scope.deliveryExceptionDetailDataDefinition.IsUpdated = true;
                        return true;
                    }

                case "PostEditAction":
                    if (!$scope.viewOnly)
                        return true;
                    else
                        return false;

                case "PreDeleteAction":
                    if (!$scope.viewOnly)
                        return true;
                    else
                        return false;

                case "PostDeleteAction":
                    $scope.deliveryExceptionDetailDataDefinition.DataList.splice($scope.deliveryExceptionDetailSubmitDefinition.Index, 1);
                    if ($scope.deliveryExceptionDetailDataDefinition.DataList.length == 0)
                        $scope.deliveryExceptionDetailResetData();
                    return true;

                case "PostViewAction":
                    return true;

                case "Clear":
                    $scope.deliveryExceptionDetailDataDefinition.DataList = [];
                    //Required if pagination is enabled
                    if ($scope.deliveryExceptionDetailDataDefinition.EnablePagination == true) {
                        $scope.deliveryExceptionDetailDataDefinition.CurrentPage = 1;
                        $scope.deliveryExceptionDetailDataDefinition.DoPagination = true;
                    }
                    return true;

                case "D E X Type":
                    $scope.showModal('#dexType-list-modal');
                    return true;

                default: return true;
            }
        };

        $scope.deliveryExceptionDetailResetData = function () {
            $scope.dexItem = {
                "Id": 0,
                "ShipementId":null,
                "DexDate": null,
                "DexTime": null,
                "DexTypeId": null,
                "DeliveryExceptionType": {
                    "Id": null,
                    "Name": null,
                    "Status": null
                },
                "DexRemarks": null,
                "Status": null
            }

            //$scope.deliveryExceptionDetailDataDefinition.DataList.push($scope.dexItem);
            //$scope.indexHolder = $scope.deliveryExceptionDetailDataDefinition.DataList.length - 1;
        };

        $scope.deliveryExceptionDetailShowFormError = function (error) {
            $scope.deliveryExceptionDetailIsError = true;
            $scope.deliveryExceptionDetailErrorMessage = error;
        };

        $scope.initializeDeliveryExceptionDetailDataDefinition();
        $scope.initializeDeliveryExceptionDetailSubmitDefinition();
    };

    //function that will be invoked during compiling datagrid to DOM
    $scope.compileDeliveryExceptionDetailDataGrid = function () {
        var html = '<dir-data-grid3 datadefinition      = "deliveryExceptionDetailDataDefinition"' +
                                    'submitdefinition   = "deliveryExceptionDetailSubmitDefinition"' +
                                    'otheractions       = "deliveryExceptionDetailOtheractions(action)"' +
                                    'resetdata          = "deliveryExceptionDetailResetData()"' +
                                    'showformerror      = "deliveryExceptionDetailShowFormError(error)">' +
                    '</dir-data-grid3>';
        $content = angular.element(document.querySelector('#deliveryExceptionDetailContainer')).html(html);
        $compile($content)($scope);
    };
    //=================================================END OF DEX DETAIL DATAGRID=================================================    

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
                        //if ($scope.shipmentSource[i].Type == "Date") {
                        $scope.shipmentFilteringDefinition.DataItem1.Shipment[0][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].From;
                        $scope.shipmentFilteringDefinition.DataItem1.Shipment[1][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].To;
                        //}
                        //else
                        //    $scope.shipmentFilteringDefinition.DataItem1.Shipment[0][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].From;
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
                    $scope.shipmentFilteringDefinition.DataList = $scope.shipmentFilteringDefinition.DataList;
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
                    var originAddress = $scope.shipmentDataDefinition.DataItem.Address1;
                    var deliveryAddress = $scope.shipmentDataDefinition.DataItem.Address;
                    $scope.shipmentItem.ShipmentId = $scope.shipmentDataDefinition.DataItem.Id;
                    $scope.shipmentItem.Shipment = $scope.shipmentDataDefinition.DataItem;
                    if (originAddress != null) {
                        $scope.shipmentItem.Shipment.OriginAddress = $scope.initializeAddressField(originAddress);
                        $scope.shipmentItem.Shipment.DeliveryAddress = $scope.initializeAddressField(deliveryAddress);
                    }

                    $scope.dexIsError = false;
                    $scope.dexErrorMessage = "";
                    $scope.shipmentItem = angular.copy($scope.shipmentDataDefinition.DataItem);
                    $scope.shipmentItem.Id = $scope.shipmentDataDefinition.DataItem.Id;
                    $scope.controlNoHolder = $scope.shipmentItem.Id;
                    $scope.shipmentItem.Id = $rootScope.formatControlNo('', 8, $scope.controlNoHolder);

                    //get shipment's DEX
                    $scope.loadDetail($scope.controlNoHolder);

                    $scope.closeModal();
                    return true;
                default: return true;
            }
        };
        $scope.initializeShipmentDataDefinition();
    };

    //function that will be invoked during compiling of datagrid to DOM
    $scope.compileShipmentDataGrid = function () {
        var html = '<dir-data-grid2 id="shipmentGrid" datadefinition = "shipmentDataDefinition"' +
                                    'submitdefinition   = "shipmentSubmitDefinition"' +
                                    'otheractions       = "shipmentOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#shipmentContainer')).html(html);
        $compile($content)($scope);
    };
    //=================================================END OF SHIPMENT MODAL=================================================

    //=================================================DEX TYPE MODAL/REPORT=================================================

    //Load businessUnit filtering for compiling
    $scope.loadDexTypeFiltering = function () {
        $scope.initDexTypeFilteringParameters();
        $scope.initDexTypeFilteringContainter();
    };

    //initialize businessUnit filtering parameters
    $scope.initDexTypeFilteringContainter = function () {
        html = '<dir-filtering id="dexTypeFilter"  filterdefinition="dexTypeFilteringDefinition"' +
                                'filterlistener="dexTypeDataDefinition.Retrieve"' +
                                'otheractions="dexTypeOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#dexTypeFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of business unit filtering to DOM
    $scope.initDexTypeFilteringParameters = function () {
        $scope.initDexTypeFilteringDefinition = function () {
            $scope.dexTypeFilteringDefinition = {
                "Url": ($scope.dexTypeDataDefinition.EnablePagination == true ? 'api/DeliveryExceptionTypes?type=paginate&param1=' + $scope.dexTypeDataDefinition.CurrentPage : 'api/DeliveryExceptionTypes?type=scroll&param1=' + $scope.dexTypeDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index 
                "Source": [
                            { "Index": 0, "Label": "DEX Type Name", "Column": "Name", "Values": [], "From": null, "To": null, "Type": "ProperCase" }
                ],//Contains the Criteria definition
                "Multiple": false,
                "AutoLoad": false,
                "ClearData": false,
                "SetSourceToNull": false
            }
        };

        $scope.dexTypeOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.dexTypeSource = $scope.dexTypeFilteringDefinition.Source;
                    //Optional in using this, can use switch if every source type has validation before filtering
                    for (var i = 0; i < $scope.dexTypeSource.length; i++) {
                        $scope.dexTypeFilteringDefinition.DataItem1.DeliveryExceptionType[0][$scope.dexTypeSource[i].Column] = $scope.dexTypeSource[i].From;
                        $scope.dexTypeFilteringDefinition.DataItem1.DeliveryExceptionType[1][$scope.dexTypeSource[i].Column] = $scope.dexTypeSource[i].To;
                    }
                    //Delete keys that the value is null
                    for (var i = 0; i < $scope.dexTypeSource.length; i++) {
                        if ($scope.dexTypeFilteringDefinition.DataItem1.DeliveryExceptionType[0][$scope.dexTypeSource[i].Column] == null) {
                            delete $scope.dexTypeFilteringDefinition.DataItem1.DeliveryExceptionType[0][$scope.dexTypeSource[i].Column];
                            delete $scope.dexTypeFilteringDefinition.DataItem1.DeliveryExceptionType[1][$scope.dexTypeSource[i].Column];
                        }
                    }
                    if ($scope.dexTypeDataDefinition.EnablePagination == true && $scope.dexTypeFilteringDefinition.ClearData) {
                        $scope.dexTypeDataDefinition.CurrentPage = 1;
                        $scope.dexTypeFilteringDefinition.Url = 'api/DeliveryExceptionTypes?type=paginate&param1=' + $scope.dexTypeDataDefinition.CurrentPage;
                    }
                    else if ($scope.dexTypeDataDefinition.EnablePagination == true) {
                        $scope.dexTypeDataDefinition.DataList = [];
                        $scope.dexTypeFilteringDefinition.Url = 'api/DeliveryExceptionTypes?type=paginate&param1=' + $scope.dexTypeDataDefinition.CurrentPage;
                    }
                        //Scroll
                    else {
                        if ($scope.dexTypeFilteringDefinition.ClearData)
                            $scope.dexTypeDataDefinition.DataList = [];
                        $scope.dexTypeFilteringDefinition.Url = 'api/DeliveryExceptionTypes?type=scroll&param1=' + $scope.dexTypeDataDefinition.DataList.length;
                    }

                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize businessUnitDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize businessUnitDataDefinition DataList by pushing each value of filterDefinition DataList*/
                    //Required
                    $scope.dexTypeFilteringDefinition.DataList = $scope.dexTypeFilteringDefinition.DataList;
                    if ($scope.dexTypeDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.dexTypeFilteringDefinition.DataList.length; j++)
                            $scope.dexTypeDataDefinition.DataList.push($scope.dexTypeFilteringDefinition.DataList[j]);
                    }

                    if ($scope.dexTypeDataDefinition.EnablePagination == true) {
                        $scope.dexTypeDataDefinition.DataList = [];
                        $scope.dexTypeDataDefinition.DataList = $scope.dexTypeFilteringDefinition.DataList;
                        $scope.dexTypeDataDefinition.DoPagination = true;
                    }
                    return true;
                default: return true;
            }
        };

        $scope.initDexTypeDataItems = function () {
            $scope.dexTypeFilteringDefinition.DataItem1 = angular.copy($scope.dexTypeObj());
        };

        $scope.initDexTypeFilteringDefinition();
        $scope.initDexTypeDataItems();
    };

    //Load DeliveryExceptionTypes datagrid for compiling
    $scope.loadDexTypeDataGrid = function () {
        $scope.initDexTypeDataGrid();
        $scope.compileDexTypeDataGrid();
    };

    //initialize DeliveryExceptionType datagrid parameters
    $scope.initDexTypeDataGrid = function () {
        $scope.dexTypeSubmitDefinition = undefined;
        $scope.initializeDexTypeDataDefinition = function () {
            $scope.dexTypeDataDefinition = {
                "Header": ['DEX Type', 'Status', 'No'],
                "Keys": ['Name', 'Status'],
                "Type": ['ProperCase', 'Default'],
                "ColWidth": [400, 400],
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
                "DataTarget": "DexTypeMenu",
                "DataTarget": "DexTypeMenu2",
                "ShowCreate": false,
                "ShowContextMenu": false,
                "ContextMenu": [""],
                "ContextMenuLabel": [""]
            }

            //Optional if row template
            $scope.dexTypeDataDefinition.RowTemplate = '<div>' +
                                                                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                                                              '</div>';
        };
        $scope.dexTypeOtherActions = function (action) {
            switch (action) {
                case 'PostEditAction':
                    //$scope.dexItem.DexTypeId = angular.copy($scope.dexTypeDataDefinition.DataItem.Id);
                    //$scope.dexItem.DeliveryExceptionType = angular.copy($scope.dexTypeDataDefinition.DataItem);
                    $scope.deliveryExceptionDetailDataDefinition.DataList[$scope.indexHolder].DeliveryExceptionType = angular.copy($scope.dexTypeDataDefinition.DataItem);
                    $scope.deliveryExceptionDetailDataDefinition.DataList[$scope.indexHolder].DexTypeId = angular.copy($scope.dexTypeDataDefinition.DataItem.Id);

                    //console.log($scope.dexDetailDataDefinition.DataList[$scope.indexHolder].DexType.Name);
                    $scope.dexIsError = false;
                    $scope.dexErrorMessage = "";

                    $scope.closeModal();
                    return true;
                default: return true;
            }
        };

        $scope.initializeDexTypeDataDefinition();
    };

    //function that will be invoked during compiling of datagrid to DOM
    $scope.compileDexTypeDataGrid = function () {
        var html = '<dir-data-grid2 id="dexTypeGrid" datadefinition = "dexTypeDataDefinition"' +
                                    'submitdefinition   = "dexTypeSubmitDefinition"' +
                                    'otheractions       = "dexTypeOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#dexTypeContainer')).html(html);
        $compile($content)($scope);
    };
    //=================================================END OF DEX TYPE MODAL=================================================

    //Manage the submition of data base on the user action
    $scope.submit = function () {
        $scope.deliveryExceptionIsError = false;
        $scope.deliveryExceptionErrorMessage = "";
        $scope.deliveryExceptionSubmitDefinition.Submit = true;
    }

    // Initialization routines
    var init = function () {
        // Call function to load data during content load
        $scope.focusOnTop();
        $scope.loadDeliveryExceptionDataGrid();
        $scope.loadDeliveryExceptionDetailDataGrid();
        $scope.deliveryExceptionResetData();
        $scope.deliveryExceptionDetailResetData();
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