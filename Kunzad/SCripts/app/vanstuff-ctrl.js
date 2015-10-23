
kunzadApp.controller("VanStuffController", consolidationController);
function consolidationController($scope, $http, $interval, $filter, $rootScope, $compile) {
    $scope.modelName = "Van Stuffing";
    $scope.modelhref = "#/vanstuff";
    $scope.withDirective = true; //this will remove the create and pagination buttons in list tab
    $scope.consolidationGridOptions = {};
    $scope.consolidationGridOptions.data = [];
    $scope.consolidationShipmentGridOptions = {};
    $scope.consolidationShipmentGridOptions.data = [];
    $scope.consolidationShipmentItem = {};
    $scope.isPrevPage = false;
    $scope.isNextPage = true;
    $scope.consolidationToggle = false;
    $scope.actionMode = "Create";
    $scope.selected = null;
    $scope.currentPage = 1;
    $scope.viewOnly = false;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.submitButtonText = "Submit";
    $scope.tabPages = ["Information", "List"];
    $scope.selectedTab = "Information";
    $scope.consolidationIDholder = 0;
    $scope.selectedconsolidationIndex = 0;
    $scope.shipmentTypeList = [];
    $scope.controlNoHolder = 0;
    $scope.modalType = null;
    var pageSize = 20;

        $scope.showModal = function (panel, type) {
            switch (type) {
                case 'origin':
                    $scope.loadBusinessUnitDataGrid();
                    $scope.loadBusinessUnitFiltering();
                    $scope.businessUnitFilteringDefinition.SetSourceToNull = true;
                    $scope.businessUnitDataDefinition.Retrieve = true;
                    break;
                //case 'destination':
                //    $scope.loadBusinessUnitDataGrid();
                //    $scope.loadBusinessUnitFiltering();
                //    $scope.businessUnitFilteringDefinition.SetSourceToNull = true;
                //    $scope.businessUnitDataDefinition.Retrieve = true;
                //    break;
                case 'consolidationShipment':
                    $scope.consolidationShipmentFilteringDefinition.SetSourceToNull = true;
                    $scope.consolidationShipmentDataDefinition.Retrieve = true;
                    break;
                case 'shipment':
                    $scope.loadShipmentDataGrid();
                    $scope.loadShipmentFiltering();
                    $scope.shipmentFilteringDefinition.SetSourceToNull = true;
                    $scope.shipmentDataDefinition.Retrieve = true;
                    break;
            }

            openModalPanel2(panel);
            $scope.modalType = type;
        };
        
        $scope.closeModal = function () {
            jQuery.magnificPopup.close();
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

        //Initialize Shipment Type List for DropDown
        $scope.initShipmentTypeList = function () {
            $http.get("/api/ShipmentTypes")
            .success(function (data, status) {
                $scope.shipmentTypeList = [];
                $scope.shipmentTypeList = data;
            })
        };

        //check if row is empty or specific field was not filled up
        $scope.validconsolidationDetail = function () {
            for (var i = 0; i < $scope.consolidationDetailDataDefinition.DataList.length; i++) {
                if ($scope.consolidationDetailDataDefinition.DataList[i].Id == 0) {
                    $scope.consolidationIsError = true;
                    $scope.consolidationErrorMessage = "Shipment is required in row " + (i + 1) + ".";
                    $scope.focusOnTop();
                    return false;
                }
            }
            return true;
        };
        
        //Initialize Address fields
        $scope.initializeAddressField = function (addressItem) {
            $scope.formattedAddress = addressItem.Line1 + (addressItem.Line2 == "" || addressItem.Line2 == null ? " " : ", " + addressItem.Line2) + "\n";
            $scope.formattedAddress += addressItem.CityMunicipality.Name + ", " + (addressItem.CityMunicipality.StateProvince == null ? "" : addressItem.CityMunicipality.StateProvince.Name + "\n");
            $scope.formattedAddress += $scope.country.Name + ", " + addressItem.PostalCode;
            return $scope.formattedAddress;
        };
        
        //Check if input is whole number
        $('#sealNumber,#vanNumber').keypress(function (key) {
            if (key.charCode < 48 || key.charCode > 57) return false;
        });

        //Retrieve detail; pass parentShipmentId
        $scope.loadDetail = function (shipmentId) {
            var spinner = new Spinner(opts).spin(spinnerTarget);
            var i = 0;
            $http.get("/api/VanStuff?parentShipmentId=" + shipmentId + "&page=1")
                .success(function (data, status) {
                    //initialize detail shipments
                    for (var i = 0; i < data.length; i++) {
                       // data[i].Shipment[0] = data[i].Shipment;
                        //origin
                        data[i].OriginAddress = $scope.initializeAddressField(data[i].Address1);
                        //destination
                        data[i].DeliveryAddress = $scope.initializeAddressField(data[i].Address);

                        $scope.consolidationDetailDataDefinition.DataList.push(data[i]);
                    }
                    $scope.flagOnRetrieveDetails = true;
                    spinner.stop();
                })
                .error(function (error, status) {
                    $scope.flagOnRetrieveDetails = true;
                    $scope.consolidationIsError = true;
                    $scope.consolidationErrorMessage = status;
                    spinner.stop();
                });
        };

        //=================================================START OF CONSOLIDATION DATA GRID=================================================
        //Initialized consolidation item to it's default value
        $scope.consolidationResetData = function () {
            $scope.consolidationItem = {
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
                "ServiceId": 5, //inland trucking
                "Service": {
                    "Id": null,
                    "Name": null
                },
                "ShipmentTypeId": null,
                "ShipmentType": {
                    "Id": null,
                    "Name": null
                },
                "PaymentMode": "A", //Account
                "CustomerId": 2, // FAST CARGO
                "CustomerContactId": 2,
                "CustomerContactPhoneId": 2,
                "CustomerAddressId": 4,
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
                "DeliverTo": "FastCargo Logistics Corp.",
                "DeliveryAddressId": 2,
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
                "ConsolidationNo1": null,
                "ConsolidationNo2": null,
                "Description": null,
                "OriginAddressId": 2,
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
            //Temporary set BusinessUnit
            $scope.consolidationItem.BusinessUnit = {
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
            $scope.consolidationItem.BusinessUnitId = $scope.consolidationItem.BusinessUnit.Id;

        };

        //Load variable datagrid for compiling
        $scope.loadconsolidationDataGrid = function () {
            $scope.initconsolidationDataGrid();
            $scope.compileconsolidationDataGrid();
        };

        //initialized consolidation data grid
        $scope.initconsolidationDataGrid = function () {
            $scope.initconsolidationDataDefinition = function () {
                $scope.consolidationDataDefinition = {
                    "Header": ['Shipment No', 'Van/Docket Number', 'Seal Number', 'Origin', 'Van Size', 'No'],
                    "Keys": ['Id', 'ConsolidationNo1', 'ConsolidationNo2', 'BusinessUnit.Name', 'ShipmentType.Name'],
                    "Type": ['ControlNo', 'Default', 'Default', 'ProperCase', 'ProperCase'],
                    "ColWidth": [180, 190, 180, 180, 180],
                    "DataList": [],
                    "RequiredFields": [/*'BLNumber-BL Number', 'BLDate-BL Date', 'VesselVoyageId-Voyage ID', 'OriginBusinessUnitId-Origin Business Unit', 'DestinationBusinessUnitId-Destination Business Unit', 'FreightCost-Freight Cost'*/],
                    "CellTemplate": ["None"],
                    "RowTemplate": "Default",
                    "EnableScroll": true,
                    "EnablePagination": false,
                    "CurrentPage": 1,//By default
                    "PageSize": 20, //Should be the same in back-end
                    "DoPagination": false, //By default
                    "Retrieve": false, //By default
                    "DataItem": {},
                    "DataTarget": "consolidationMenu",
                    "DataTarget2": "consolidationMenu1",
                    "ShowCreate": true,
                    "ShowContextMenu": true,
                    "ContextMenu": ["'Load'", "'Create'", "'Edit'", "'Delete'", "'View'", "'Find'", "'Clear'"],
                    "ContextMenuLabel": ['Reload', 'Create', 'Edit', 'Cancel', 'View', 'Find', 'Clear']
                }
            };

            $scope.initconsolidationSubmitDefinition = function () {
                $scope.consolidationSubmitDefinition = {
                    "Submit": false, //By default
                    "APIUrl": '/api/Vanstuff',
                    "Type": 'Create', //By Default
                    "DataItem": [],
                    "Index": -1 //By Default
                }
            };

            $scope.consolidationOtheractions = function (action) {
                switch (action) {
                    case "FormCreate":
                        $scope.selectedTab = $scope.tabPages[0];
                        $scope.consolidationResetData();
                        $scope.consolidationDetailDataDefinition.DataList.splice(0, $scope.consolidationDetailDataDefinition.DataList.length);
                        $scope.consolidationDetailResetData();
                        $scope.enableSave = true;
                        $scope.viewOnly = false;
                        return true;
                    case "PreAction":
                        return true;
                    case "PostCreateAction":
                        $scope.submitButtonText = "Submit";
                        $scope.consolidationSubmitDefinition.Type = "Create";
                        $scope.selectedTab = $scope.tabPages[0];
                        $scope.consolidationResetData();
                        $scope.consolidationDetailDataDefinition.DataList.splice(0, $scope.consolidationDetailDataDefinition.DataList.length);
                        $scope.consolidationDetailResetData();
                        $scope.enableSave = true;
                        $scope.viewOnly = false;
                        return true;
                    case "PostEditAction":
                        //If user choose edit-menu in listing
                        if (angular.isDefined($scope.consolidationDataDefinition.DataItem.Id) && $scope.consolidationItem.Id != $scope.consolidationDataDefinition.DataItem.Id) {
                            $scope.consolidationDetailDataDefinition.DataList.splice(0, $scope.consolidationDetailDataDefinition.DataList.length);
                            $scope.consolidationItem = angular.copy($scope.consolidationDataDefinition.DataItem);
                            $scope.controlNoHolder = $scope.consolidationItem.Id;
                            $scope.consolidationItem.Id = $rootScope.formatControlNo('', 15, $scope.consolidationItem.Id);
                            $scope.consolidationItem.CallDate = $filter('Date')($scope.consolidationItem.CallDate);

                            $scope.loadDetail($scope.consolidationItem.Id);
                            var promise = $interval(function () {
                                if ($scope.flagOnRetrieveDetails) {
                                    $scope.flagOnRetrieveDetails = false;
                                    $interval.cancel(promise);
                                    promise = undefined;
                                    $scope.viewOnly = false;
                                    $scope.submitButtonText = "Submit";
                                    $scope.selectedTab = $scope.tabPages[0];
                                    $scope.consolidationSubmitDefinition.Type = "Edit";
                                    if ($scope.consolidationDetailDataDefinition.DataList.length > 0)
                                        //Set control no holder in case user will add item in list
                                        $scope.controlNoHolder = $scope.consolidationDetailDataDefinition.DataList[$scope.consolidationDetailDataDefinition.DataList.length - 1].Id + 1;
                                    else
                                        $scope.consolidationDetailResetData();
                                }
                            }, 100);
                        }
                        else {
                            $scope.viewOnly = false;
                            $scope.submitButtonText = "Submit";
                            $scope.selectedTab = $scope.tabPages[0];
                            $scope.consolidationSubmitDefinition.Type = "Edit";
                        }
                        $scope.enableSave = true;
                        return true;
                    case "PostDeleteAction":
                        //If user choose edit-menu in listing
                        if (angular.isDefined($scope.consolidationDataDefinition.DataItem.Id) && $scope.consolidationItem.Id != $scope.consolidationDataDefinition.DataItem.Id) {
                            $scope.consolidationDetailDataDefinition.DataList.splice(0, $scope.consolidationDetailDataDefinition.DataList.length);
                            $scope.consolidationItem = angular.copy($scope.consolidationDataDefinition.DataItem);
                            $scope.controlNoHolder = $scope.consolidationItem.Id;
                            $scope.consolidationItem.Id = $rootScope.formatControlNo('', 15, $scope.consolidationItem.Id);
                            $scope.consolidationItem.CallDate = $filter('Date')($scope.consolidationItem.CallDate);
                            $scope.consolidationItem.CourierCost = $filter('number')($scope.consolidationItem.CourierCost, 2);

                            $scope.loadDetail($scope.consolidationItem.Id);
                            var promise = $interval(function () {
                                if ($scope.flagOnRetrieveDetails) {
                                    $scope.flagOnRetrieveDetails = false;
                                    $interval.cancel(promise);
                                    promise = undefined;
                                    $scope.viewOnly = true;
                                    $scope.submitButtonText = "Cancel";
                                    $scope.selectedTab = $scope.tabPages[0];
                                    $scope.consolidationSubmitDefinition.Type = "Edit";
                                }
                            }, 100);
                        }
                        else {
                            $scope.viewOnly = true;
                            $scope.submitButtonText = "Cancel";
                            $scope.selectedTab = $scope.tabPages[0];
                            $scope.consolidationSubmitDefinition.Type = "Edit";
                        }
                        $scope.enableSave = true;
                        return true;
                    case "PostViewAction":
                        //If user choose edit-menu in listing
                        if (angular.isDefined($scope.consolidationDataDefinition.DataItem.Id) && $scope.consolidationItem.Id != $scope.consolidationDataDefinition.DataItem.Id) {
                            $scope.consolidationDetailDataDefinition.DataList.splice(0, $scope.consolidationDetailDataDefinition.DataList.length);
                            $scope.consolidationItem = angular.copy($scope.consolidationDataDefinition.DataItem);
                            $scope.controlNoHolder = $scope.consolidationItem.Id;
                            $scope.consolidationItem.Id = $rootScope.formatControlNo('', 15, $scope.consolidationItem.Id);

                            $scope.loadDetail($scope.consolidationItem.Id);
                            var promise = $interval(function () {
                                if ($scope.flagOnRetrieveDetails) {
                                    $scope.flagOnRetrieveDetails = false;
                                    $interval.cancel(promise);
                                    promise = undefined;
                                    $scope.viewOnly = true;
                                    $scope.submitButtonText = "Close";
                                    $scope.selectedTab = $scope.tabPages[0];
                                    $scope.consolidationSubmitDefinition.Type = "View";
                                }
                            }, 100);

                        }
                        else {
                            $scope.viewOnly = true;
                            $scope.submitButtonText = "Close";
                            $scope.selectedTab = $scope.tabPages[0];
                            $scope.consolidationSubmitDefinition.Type = "View";
                        }
                        return true;
                    case "PreSubmit":
                        if (!$scope.validconsolidationDetail())
                            return false;
                        $scope.consolidationSubmitDefinition.DataItem.push($scope.consolidationItem);
                        return true;
                    case "PreSave":
                        for (var i = 0; i < $scope.consolidationDetailDataDefinition.DataList.length; i++) {
                            $scope.consolidationSubmitDefinition.DataItem.push($scope.consolidationDetailDataDefinition.DataList[i]);
                        }
                        for (var i = 0; i < $scope.consolidationSubmitDefinition.DataItem.length; i++)
                        {
                            if (i == 0) {
                                delete $scope.consolidationSubmitDefinition.DataItem[i].Id;
                                delete $scope.consolidationSubmitDefinition.DataItem[i].TransportStatusId;
                                delete $scope.consolidationSubmitDefinition.DataItem[i].Address.Id;
                                delete $scope.consolidationSubmitDefinition.DataItem[i].Address.CityMunicipalityId;
                                delete $scope.consolidationSubmitDefinition.DataItem[i].Address.Line1;
                                delete $scope.consolidationSubmitDefinition.DataItem[i].Address1.Id;
                                delete $scope.consolidationSubmitDefinition.DataItem[i].Address1.CityMunicipalityId;
                                delete $scope.consolidationSubmitDefinition.DataItem[i].Address1.Line1;
                                delete $scope.consolidationSubmitDefinition.DataItem[i].ParentShipmentId;
                            }
                            else {
                                delete $scope.consolidationSubmitDefinition.DataItem[i].ConsolidationNo1;
                                delete $scope.consolidationSubmitDefinition.DataItem[i].ConsolidationNo2;
                            }
                            delete $scope.consolidationSubmitDefinition.DataItem[i].Address;
                            delete $scope.consolidationSubmitDefinition.DataItem[i].Address1;
                            delete $scope.consolidationSubmitDefinition.DataItem[i].BusinessUnit;
                            delete $scope.consolidationSubmitDefinition.DataItem[i].BusinessUnit1;
                            delete $scope.consolidationSubmitDefinition.DataItem[i].Service;
                            delete $scope.consolidationSubmitDefinition.DataItem[i].ShipmentType;
                            delete $scope.consolidationSubmitDefinition.DataItem[i].Customer;
                        }

                        return true;
                    case "PostSave":
                        //Initialize Consolidation Id
                        $scope.consolidationItem.Id = $scope.consolidationSubmitDefinition.DataItem[0].Id;
                        $scope.consolidationItem.Id = $rootScope.formatControlNo('', 15, $scope.consolidationItem.Id);
                        ////Initialize Parent Shipments Id
                        //for (var i = 0; i < $scope.consolidationSubmitDefinition.DataItem.consolidationDetail.length; i++)
                        //    $scope.consolidationDetailDataDefinition.DataList[i].ParentShipmentId = $scope.consolidationSubmitDefinition.DataItem.consolidationDetail[i].Id;
                        $scope.viewOnly = true;
                        $scope.consolidationSubmitDefinition.Type = "Edit";
                        alert("Successfully Saved.");
                        return true;
                    case "PreUpdate":
                        $scope.consolidationSubmitDefinition.DataItem.CourierTransactionDetails = angular.copy($scope.consolidationDetailDataDefinition.DataList);
                        delete $scope.consolidationSubmitDefinition.DataItem.Courier;
                        delete $scope.consolidationSubmitDefinition.DataItem.BusinessUnit;
                        for (var i = 0; i < $scope.consolidationSubmitDefinition.DataItem.CourierTransactionDetails.length; i++) {
                            if ($scope.consolidationSubmitDefinition.DataItem.CourierTransactionDetails[i].CourierTransactionId == -1) {
                                delete $scope.consolidationSubmitDefinition.DataItem.CourierTransactionDetails[i].Id;
                                $scope.consolidationSubmitDefinition.DataItem.CourierTransactionDetails[i].CourierTransactionId = $scope.consolidationItem.Id;
                            }

                            delete $scope.consolidationSubmitDefinition.DataItem.CourierTransactionDetails[i].Shipment;
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
                        return true;
                    case "Find":
                        $scope.selectedTab = $scope.tabPages[1];
                        var promise = $interval(function () {
                            if ($scope.consolidationToggle == false) {
                                $("#consolidationToggle").slideToggle(function () {
                                    $scope.consolidationToggle = true;
                                });
                            }
                            $interval.cancel(promise);
                            promise = undefined;
                        }, 200);
                        return true;
                    case "Clear":
                        $scope.consolidationDataDefinition.DataList = [];
                        //Required if pagination is enabled
                        if ($scope.consolidationDataDefinition.EnablePagination == true) {
                            $scope.consolidationDataDefinition.CurrentPage = 1;
                            $scope.consolidationDataDefinition.DoPagination = true;
                        }
                        return true;
                    default: return true;
                }
            };

            $scope.consolidationShowFormError = function (error) {
                $scope.consolidationIsError = true;
                $scope.consolidationErrorMessage = error;
            };

            $scope.initconsolidationDataDefinition();
            $scope.initconsolidationSubmitDefinition();
        };

        //function that will be invoked during compiling of consolidation datagrid to DOM
        $scope.compileconsolidationDataGrid = function () {
            var html = '<dir-data-grid2 datadefinition      = "consolidationDataDefinition"' +
                                        'submitdefinition   = "consolidationSubmitDefinition"' +
                                        'otheractions       = "consolidationOtheractions(action)"' +
                                        'resetdata          = "consolidationResetData()"' +
                                        'showformerror      = "consolidationShowFormError(error)">' +
                        '</dir-data-grid2>';
            $content = angular.element(document.querySelector('#consolidationContainer')).html(html);
            $compile($content)($scope);
        };

        //Load consolidation filtering for compiling
        $scope.loadconsolidationFiltering = function () {
            $scope.initconsolidationFilteringParameters();
            $scope.initconsolidationFilteringContainter();
            $("#consolidationToggle").slideToggle(function () { });
        };

        //initialize consolidation filtering parameters
        $scope.initconsolidationFilteringContainter = function () {
            html = '<dir-filtering  filterdefinition="consolidationFilteringDefinition"' +
                                    'filterlistener="consolidationDataDefinition.Retrieve"' +
                                    'otheractions="consolidationOtherActionsFiltering(action)"' +
                   '</dir-filtering>';
            $content = angular.element(document.querySelector('#consolidationFilterContainter')).html(html);
            $compile($content)($scope);
        };

        //function that will be called during compiling of consolidation filtering to DOM
        $scope.initconsolidationFilteringParameters = function () {
            //Hide the consolidation filtering directive
            $scope.hideconsolidationToggle = function () {
                var promise = $interval(function () {
                    $("#consolidationToggle").slideToggle(function () {
                        $scope.consolidationToggle = false;
                    });
                    $interval.cancel(promise);
                    promise = undefined;
                }, 200)
            };
            $scope.initconsolidationFilteringDefinition = function () {
                $scope.consolidationFilteringDefinition = {
                    "Url": ($scope.consolidationDataDefinition.EnablePagination == true ? 'api/VanStuff?type=paginate&param1=' + $scope.consolidationDataDefinition.CurrentPage : 'api/VanStuff?type=scroll&param1=' + $scope.consolidationDataDefinition.DataList.length),//Url for retrieve
                    "DataList": [], //Contains the data retrieved based on the criteria
                    "DataItem1": $scope.DataItem1, //Contains the parameter value
                    "Source": [
                                { "Index": 0, "Label": "Shipment No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                                { "Index": 1, "Label": "Van/Docket Number", "Column": "ConsolidationNo1", "Values": [], "From": null, "To": null, "Type": "Default" },
                                { "Index": 2, "Label": "Seal Number", "Column": "ConsolidationNo2", "Values": [], "From": null, "To": null, "Type": "Default" },
                                { "Index": 3, "Label": "Origin", "Column": "BusinessUnitId", "Values": ['GetBusinessList'], "From": null, "To": null, "Type": "Modal" },
                                { "Index": 4, "Label": "Van Size", "Column": "ShipmentTypeId", "Values": [], "From": null, "To": null, "Type": "Dropdown" },
                    ],//Contains the Criteria definition
                    "Multiple": true,
                    "AutoLoad": false,
                    "ClearData": false,
                    "SetSourceToNull": false
                }
            };

            $scope.consolidationOtherActionsFiltering = function (action) {
                switch (action) {
                    //Initialize DataItem1 and DataItem2 for data filtering
                    case 'PreFilterData':
                        $scope.selectedTab = $scope.tabPages[1];
                        $scope.consolidationSource = $scope.consolidationFilteringDefinition.Source;
                        //Optional in using this, can use switch if every source type has validation before filtering

                        for (var i = 0; i < $scope.consolidationSource.length; i++) {
                            if ($scope.consolidationSource[i].Type == "Date") {
                                $scope.consolidationFilteringDefinition.DataItem1.Shipment[0][$scope.consolidationSource[i].Column] = $scope.consolidationSource[i].From;
                                $scope.consolidationFilteringDefinition.DataItem1.Shipment[1][$scope.consolidationSource[i].Column] = $scope.consolidationSource[i].To;
                            }
                            else
                                $scope.consolidationFilteringDefinition.DataItem1.Shipment[0][$scope.consolidationSource[i].Column] = $scope.consolidationSource[i].From;
                        }
                        //Delete keys that the value is null
                        for (var i = 0; i < $scope.consolidationSource.length; i++) {
                            if ($scope.consolidationFilteringDefinition.DataItem1.Shipment[0][$scope.consolidationSource[i].Column] == null) {
                                delete $scope.consolidationFilteringDefinition.DataItem1.Shipment[0][$scope.consolidationSource[i].Column];
                                delete $scope.consolidationFilteringDefinition.DataItem1.Shipment[1][$scope.consolidationSource[i].Column];
                            }
                        }

                        if ($scope.consolidationDataDefinition.EnablePagination == true && $scope.consolidationFilteringDefinition.ClearData) {
                            $scope.consolidationDataDefinition.CurrentPage = 1;
                            $scope.consolidationFilteringDefinition.Url = 'api/VanStuff?type=paginate&param1=' + $scope.consolidationDataDefinition.CurrentPage;
                        }
                        else if ($scope.consolidationDataDefinition.EnablePagination == true) {
                            $scope.consolidationDataDefinition.DataList = [];
                            $scope.consolidationFilteringDefinition.Url = 'api/VanStuff?type=paginate&param1=' + $scope.consolidationDataDefinition.CurrentPage;
                        }
                            //Scroll
                        else {
                            if ($scope.consolidationFilteringDefinition.ClearData)
                                $scope.consolidationDataDefinition.DataList = [];
                            $scope.consolidationFilteringDefinition.Url = 'api/VanStuff?type=scroll&param1=' + $scope.consolidationDataDefinition.DataList.length;
                        }
                        return true;
                    case 'PostFilterData':
                        /*Note: if pagination, initialize consolidationDataDefinition DataList by copying the DataList of filterDefinition then 
                                set DoPagination to true
                          if scroll, initialize consolidationDataDefinition DataList by pushing each value of filterDefinition DataList*/
                        //Required
                        $scope.consolidationFilteringDefinition.DataList = $scope.consolidationFilteringDefinition.DataList;

                        if ($scope.consolidationDataDefinition.EnableScroll == true) {
                            for (var j = 0; j < $scope.consolidationFilteringDefinition.DataList.length; j++)
                                $scope.consolidationDataDefinition.DataList.push($scope.consolidationFilteringDefinition.DataList[j]);
                        }

                        if ($scope.consolidationDataDefinition.EnablePagination == true) {
                            $scope.consolidationDataDefinition.DataList = [];
                            $scope.consolidationDataDefinition.DataList = $scope.consolidationFilteringDefinition.DataList;
                            $scope.consolidationDataDefinition.DoPagination = true;
                        }
                        if ($scope.consolidationToggle == true)
                            $scope.hideconsolidationToggle();

                        console.log($scope.consolidationDataDefinition.DataList);

                        return true;
                    case 'GetBusinessList':
                        return true;
                    case 'GetShippingLine':
                        return true;
                    case 'GetVessel':
                        return true;
                    case 'GetVesselVoyage':
                        return true;
                    case 'GetShipment':
                        return true;
                    default: return true;
                }
            };

            $scope.initconsolidationDataItems = function () {
                $scope.consolidationFilteringDefinition.DataItem1 = angular.copy($rootScope.shipmentObj());
            };
            $scope.initconsolidationFilteringDefinition();
            $scope.initconsolidationDataItems();

        };
        //=================================================END OF SEA FREIGHT DATA GRID=================================================

        //=================================================START OF BUSINESS UNIT MODAL=================================================
        //Load businessUnit filtering for compiling
        $scope.loadBusinessUnitFiltering = function () {
            $scope.initBusinessUnitFilteringParameters();
            $scope.initBusinessUnitFilteringContainter();
        };
    
        //initialize businessUnit filtering parameters
        $scope.initBusinessUnitFilteringContainter = function () {
            html = '<dir-filtering id="businessUnitFilter" filterdefinition="businessUnitFilteringDefinition"' +
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
                    "DataTarget2": "BusinessUnitMenu1",
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
                        switch ($scope.modalType) {
                            case 'origin':
                                $scope.consolidationItem.OriginBusinessUnitId = $scope.businessUnitDataDefinition.DataItem.Id;
                                $scope.consolidationItem.BusinessUnit.Name = $scope.businessUnitDataDefinition.DataItem.Name;
                                break;
                            //case 'destination':
                            //    $scope.consolidationItem.DestinationBusinessUnitId = $scope.businessUnitDataDefinition.DataItem.Id;
                            //    $scope.consolidationItem.BusinessUnit.Name = $scope.businessUnitDataDefinition.DataItem.Name;
                            //    break;
                        }
                        $scope.closeModal();
                        return true;
                    default: return true;
                }
            };

            $scope.initializeBusinessUnitDataDefinition();
        };

        //function that will be invoked during compiling of businessUnit datagrid to DOM
        $scope.compileBusinessUnitDataGrid = function () {
            var html = '<dir-data-grid2 id="businessUnitGrid" datadefinition = "businessUnitDataDefinition"' +
                                        'submitdefinition   = "businessUnitSubmitDefinition"' +
                                        'otheractions       = "businessUnitOtherActions(action)">' +
                        '</dir-data-grid2>';
            $content = angular.element(document.querySelector('#businessUnitContainer')).html(html);
            $compile($content)($scope);
        };
        //=================================================END OF BUSINESS UNIT MODAL=================================================
            
        //=================================================CONSOLIDATION DETAIL DATAGRID=================================================
        //Load CONSOLIDATION DETAIL datagrid for compiling
        $scope.loadConsolidationDetailDataGrid = function () {
            $scope.initConsolidationDetailDataGrid();
            $scope.compileConsolidationDetailDataGrid();
        };

        //initialize consolidationDetail datagrid parameters
        $scope.initConsolidationDetailDataGrid = function () {
            $scope.initializeConsolidationDetailDataDefinition = function () {
                $scope.consolidationDetailDataDefinition = {
                    "Header": ['Shipment No', 'Transport Status', 'Booking Date', 'Business Unit', 'Operating Site', 'Service', 'Shipment Type', 'Payment Mode', 'Booking Remarks', 'Qty', 'Total CBM', 'Cargo Description', 'Pickup Address', 'Target Pickup Date', 'Target Pickup Time', 'Customer', 'Customer Address', 'Customer Contact No', 'Consignee', 'Consignee Address', 'Consignee Contact No', 'No.'],
                    "Keys": ['Id', 'TransportStatusId', 'CreatedDate', 'BusinessUnit.Name', 'BusinessUnit1.Name', 'Service.Name', 'ShipmentType.Name', 'PaymentMode', 'BookingRemarks', 'Quantity', 'TotalCBM', 'Description', 'OriginAddress', 'PickupDate', 'PickupTime', 'Customer.Name', 'Customer.CustomerAddresses[0].Line1', 'Customer.CustomerContacts[0].Contact.ContactPhones[0].ContactNumber', 'DeliverTo', 'DeliveryAddress', 'DeliverToContactNo'],
                    "Type": ['ControlNo', 'TransportStatus', 'Date', 'ProperCase', 'ProperCase', 'ProperCase', 'ProperCase', 'PaymentMode', 'Default', 'Default', 'Decimal', 'Default', 'ProperCase', 'Date', 'Time', 'ProperCase', 'ProperCase', 'Default', 'ProperCase', 'ProperCase', 'Default'],
                    "ColWidth": [150, 150, 150, 150, 150, 150, 150, 150, 200, 100, 150, 200, 300, 150, 150, 200, 200, 200, 200, 300, 200],
                    "DataList": [],
                    "RequiredFields": ['ShipmentId-Shipment'],
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
                    "DataTarget": "ConsolidationDetailMenu",
                    "DataTarget2": "ConsolidationDetailMenu2",
                    "ShowCreate": false,
                    "ShowContextMenu": true,
                    "ContextMenu": ["'Create'", "'Delete'"],
                    "ContextMenuLabel": ['Add Shipment', 'Delete']
                }
            };

            $scope.initializeConsolidationDetailSubmitDefinition = function () {
                $scope.consolidationDetailSubmitDefinition = {
                    "Submit": false, //By default
                    "APIUrl": '',
                    "Type": 'Create', //By Default
                    "DataItem": {},
                    "Index": -1 //By Default
                }
            };

            $scope.consolidationDetailOtheractions = function (action) {
                switch (action) {
                    case "FormCreate":
                        return true;

                    case "PreAction":
                        return true;

                    case "PreCreateAction":
                        if (!$scope.viewOnly) {
                            var upperRow = $scope.consolidationDetailDataDefinition.DataList.length - 1;
                            if ($scope.consolidationDetailDataDefinition.DataList[upperRow].Id == 0) {
                                $scope.consolidationIsError = true;
                                $scope.consolidationErrorMessage = "Shipment is required.";
                                $scope.focusOnTop();
                                return false;
                            }
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
                        $scope.consolidationDetailDataDefinition.DataList.splice($scope.consolidationDetailSubmitDefinition.Index, 1);
                        if ($scope.consolidationDetailDataDefinition.DataList.length == 0)
                            $scope.consolidationDetailResetData();
                        return true;

                    case "PostViewAction":
                        return true;

                    case "Clear":
                        $scope.consolidationDetailDataDefinition.DataList = [];
                        //Required if pagination is enabled
                        if ($scope.consolidationDetailDataDefinition.EnablePagination == true) {
                            $scope.consolidationDetailDataDefinition.CurrentPage = 1;
                            $scope.consolidationDetailDataDefinition.DoPagination = true;
                        }
                        return true;

                    case "Shipment No":
                        //if datalist is only 1 then directly insert
                        $scope.showModal('#shipment-list-modal', 'shipment');
                        return true;

                    default: return true;
                }
            };

            $scope.consolidateShipmentResetData = function () {
                $scope.consolidateShipmentItem = {
                    "Id": 0,
                    "ParentShipmentId": null,
                    "ConsolidationTypeId": null,
                    "ShipmentId": null
                }
            };

            $scope.consolidationDetailResetData = function () {
                $scope.consolidationDetailItem = {
                    "Id": 0,
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
                    "ParentShipmentId": null,
                    "ConsolidationNo1": null,
                    "ConsolidationNo2": null,
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

                $scope.consolidationDetailDataDefinition.DataList.push($scope.consolidationDetailItem);
                $scope.indexHolder = $scope.consolidationDetailDataDefinition.DataList.length - 1;
            };

            $scope.consolidationDetailShowFormError = function (error) {
                $scope.consolidationIsError = true;
                $scope.consolidationErrorMessage = error;
            };

            $scope.initializeConsolidationDetailDataDefinition();
            $scope.initializeConsolidationDetailSubmitDefinition();
        };

        //function that will be invoked during compiling datagrid to DOM
        $scope.compileConsolidationDetailDataGrid = function () {
            var html = '<dir-data-grid2 datadefinition      = "consolidationDetailDataDefinition"' +
                                        'submitdefinition   = "consolidationDetailSubmitDefinition"' +
                                        'otheractions       = "consolidationDetailOtheractions(action)"' +
                                        'resetdata          = "consolidationDetailResetData()"' +
                                        'showformerror      = "consolidationDetailShowFormError(error)">' +
                        '</dir-data-grid2>';
            $content = angular.element(document.querySelector('#consolidationDetailContainer')).html(html);
            $compile($content)($scope);
        };
        //=================================================END OF CONSOLIDATION DETAIL DATAGRID=================================================    

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
                            $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=paginate&source=sea&param1=' + $scope.shipmentDataDefinition.CurrentPage;
                        }
                        else if ($scope.shipmentDataDefinition.EnablePagination == true) {
                            $scope.shipmentDataDefinition.DataList = [];
                            $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=paginate&source=sea&param1=' + $scope.shipmentDataDefinition.CurrentPage;
                        }
                            //Scroll
                        else {
                            if ($scope.shipmentFilteringDefinition.ClearData)
                                $scope.shipmentDataDefinition.DataList = [];
                            $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=paginate&source=sea&param1=' + $scope.shipmentDataDefinition.DataList.length;
                        }
                        $scope.shipmentFilteringDefinition.DataItem1.Shipment[0].BusinessUnitId = $scope.consolidationItem.BusinessUnitId;

                        return true;
                    case 'PostFilterData':
                        /*Note: if pagination, initialize businessUnitDataDefinition DataList by copying the DataList of filterDefinition then 
                                set DoPagination to true
                          if scroll, initialize businessUnitDataDefinition DataList by pushing each value of filterDefinition DataList*/
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
                        for (var i = 0; i < $scope.consolidationDetailDataDefinition.DataList.length; i++) {
                            if ($scope.consolidationDetailDataDefinition.DataList[i].Id == $scope.shipmentDataDefinition.DataItem.Id) {
                                found = true;
                                i = $scope.consolidationDetailDataDefinition.DataList;
                            }
                        }
                        //Check if shipment is not yet in the list
                        if (!found) {
                            var originAddress = $scope.shipmentDataDefinition.DataItem.Address1;
                            var deliveryAddress = $scope.shipmentDataDefinition.DataItem.Address;
                            //$scope.consolidationDetailItem.Id = $scope.shipmentDataDefinition.DataItem.Id;
                            //$scope.consolidationDetailItem.TransportStatusId = $scope.shipmentDataDefinition.DataItem.TransportStatusId;
                            //$scope.consolidationDetailItem = angular.copy($scope.shipmentDataDefinition.DataItem);
                            $scope.consolidationDetailDataDefinition.DataList[$scope.indexHolder] = $scope.shipmentDataDefinition.DataItem;
                            $scope.consolidationDetailDataDefinition.DataList[$scope.indexHolder].OriginAddress = $scope.initializeAddressField(originAddress);
                            $scope.consolidationDetailDataDefinition.DataList[$scope.indexHolder].DeliveryAddress = $scope.initializeAddressField(deliveryAddress);
                            $scope.consolidationIsError = false;
                            $scope.consolidationErrorMessage = "";
                        }
                        else {
                            $scope.consolidationIsError = true;
                            $scope.consolidationErrorMessage = "Shipment is already in the list.";

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

        
        //add an empty row to sea freight shipment detail
        $scope.addconsolidationShipmentItem = function () {
            $scope.initShipmentList();
            openModalPanel2("#shipment-list-modal");
            //$scope.consolidationShipmentGridOptions.data.push({ ShipmentNo: null, ShipmentType: null, CustomerName: null, ShipmentDescription: null, Quantity: null, CBM: null, Consignee : null,FreightCost: null});
        }

        //function that will be invoked when user click tab
        $scope.setSelectedTab = function (tab) {
            $scope.isError = false;
            $scope.errorMessage = "";
            $scope.selectedTab = tab;
        };
        
        //Initialize filtering shipment
        var promiseShipmentTypeList = $interval(function () {
            if ($scope.shipmentTypeList.length > 0) {
                $scope.consolidationFilteringDefinition.Source[4].Values = $scope.shipmentTypeList;
                $interval.cancel(promiseShipmentTypeList);
                promiseShipmentTypeList = undefined;
            }
        }, 100);

        //function that will be invoked when user delete, update or view a record in the consolidation list
        $scope.setSelected = function (id) {
            $scope.consolidationIDholder = id;
        };
        
        $scope.setSelectedDetail = function (id) {
            $scope.shipmentIDholder = id;
        };
        
        $scope.searchShipment = function (id) {
            var i = 0;
            for (i = 0; i < $scope.ShipmentList.length; i++) {
                if (id == $scope.ShipmentList[i].Id) {
                    return i;
                }
            }
            return i;
        };

        //search consolidation
        $scope.searchconsolidation = function (id) {
            var i = 0;
            for (i = 0; i < $scope.consolidationGridOptions.data.length; i++) {
                if (id == $scope.consolidationGridOptions.data[i].Id) {
                    return i;
                }
            }
            return i;
        };

        //search consolidationShipment
        $scope.searchconsolidationShipment = function (id) {
            var i = 0;
            for (i = 0; i < $scope.consolidationShipmentGridOptions.data.length; i++) {
                if (id == $scope.consolidationShipmentGridOptions.data[i].Id) {
                    return i;
                }
            }
            return i;
        };

        $scope.setSelectedconsolidationShipment = function (id) {
            $scope.selectedconsolidationShipmentIndex = $scope.searchconsolidationShipment(id);
        };

        //Manage the submition of data base on the user action
        $scope.submit = function () {
            $scope.consolidationIsError = false;
            $scope.consolidationErrorMessage = "";
            $scope.consolidationSubmitDefinition.Submit = true;
        }

        //Set the focus on top of the page during load
        $scope.focusOnTop = function () {
            $(document).ready(function () {
                $(this).scrollTop(0);
            });
        };
        
        //don't allow input
        $('#origin,#destination,#voyageNo').keypress(function (key) {
            return false;
        });
    
        //Initialize shipment type
        $scope.setShipmentType = function () {
            for (var i = 0; i < $scope.shipmentTypeList.length; i++) {
                $scope.consolidationItem.ShipmentType = $scope.shipmentTypeList[i];
            }
        }

        // Initialization routines
        var init = function () {
            // Call function to load data during content load
            $scope.focusOnTop();
            $scope.loadconsolidationDataGrid();
            $scope.loadconsolidationFiltering();
            $scope.loadConsolidationDetailDataGrid();
            $scope.initShipmentTypeList();
            $scope.consolidationResetData()
            $scope.consolidationDetailResetData();


            //console.log( );
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