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
    $scope.shipmentItems = [];
    var pageSize = 20;

    //function that will be called during submit
    $scope.submit = function () {
        $scope.airFreightIsError = false;
        $scope.airFreightErrorMessage = "";
        $scope.airFreightSubmitDefinition.Submit = true;
    }

    // INITIALIZE AIRFREIGHT ITEM
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
            "BusinessUnit": {
                "Id": null,
                "Code": null,
                "Name": null
            },
            "DestinationBusinessUnitId": null,
            "BusinessUnit1": {
                "Id": null,
                "Code": null,
                "Name": null
            },
            "DepartureDate": null,
            "DepartureTime": null,
            "ArrivalDate": null,
            "ArrivalTime": null,
            "CreatedDate": null,
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null,
            "AirFreightShipments": []
        };
    };

    // NEW SHIPMENT/AIRFREIGHT DETAILS
    $scope.addNewShipment = function () {
        $scope.shipmentItem = {
            "Id": null,
            "BusinessUnitId": null,
            "BusinessUnit": {
                "Id": null,
                "Code": null,
                "Name": null
            },
            "SerivceId": null,
            "Service": {
                "Id": null,
                "Name": null,
                "Description": null
            },
            "DocumentNo": null,
            "DocumentDate": null,
            "ShipmentTypeId": null,
            "ShipmentType": {
                "Id": null,
                "Name": null
            },
            "PaymentMode": null,
            "CustomerId": null,
            "Customer": {
                "Id": null,
                "Code": null,
                "Name": null,
                "CustomerGroupId": null,
                "TIN": null,
                "IndustryId": null
            },
            "CustomerAddressId": null,
            "CustomerContactId": null,
            "CustomerContactPhoneId": null,
            "BillToCustomerId": null,
            "BillToCustomerAddressId": null,
            "BillToCustomerContactId": null,
            "BillToCustomerContactPhoneId": null,
            "Quantity": null,
            "TotalCBM": null,
            "IsRevenue": null,
            "Revenue": null,
            "IsTaxInclusive": null,
            "TaxAmount": null,
            "TaxPercentage": null,
            "Description": null,
            "BookingRemarks": null,
            "DeliverTo": null,
            "DeliveryAddressId": null,
            "DeliveryAddress": null,
            "Address": {
                "Id": null,
                "Line1": null,
                "Line2": null,
                "CityMunicipalityId": null,
                "CityMunicipality": {
                    "Id": null,
                    "Name": null,
                    "StateProvinceId": null,
                    "StateProvince": {
                        "Id": null,
                        "Name": null,
                        "CountryId": null,
                        "Country": {
                            "Id": null,
                            "Code": null,
                            "Name": null
                        },
                    }
                },
                "PostalCode": null
            },
            "DeliveryDate": null,
            "DeliveryTime": null,
            "ReceivedByName": null,
            "PickUpBussinessUnitId": null,
            "PickupDate": null,
            "PickupTime": null,
            "DeliverToContactNo": null,
            "OriginAddressId": null,
            "ParentShipmentId": null,
            "IsConsolidation": null,
            "IsMultipleDelivery": null,
            "TransportStatusId": null,
            "TransportStatusRemarks": null,
            "CreatedDate": null,
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null
        }

        $scope.shipmentItems.push($scope.shipmentItem);
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

    //function that will be invoked when user click tab
    $scope.setSelectedTab = function (tab) {
        $scope.airFreightIsError = false;
        $scope.airFreightErrorMessage = "";
        $scope.selectedTab = tab;
    };

    //====================================AIRFREIGHT FILTERING AND DATAGRID==========================
    //Load airfreight datagrid for compiling
    $scope.loadAirFreightDataGrid = function () {
        $scope.initAirFreightDataGrid();
        $scope.compileAirFreightDataGrid();
    };

    //initialize airfreight datagrid parameters
    $scope.initAirFreightDataGrid = function () {
        $scope.initializeAirFreightDataDefinition = function () {
            $scope.airFreightDataDefinition = {
                "Header": ['Airline', 'Waybill No', 'Waybill Date', 'Est Departure Date', 'Est Departure Time', 'Est Arrival Date', 'Est Arrival Time', 'Orgin', 'Destination', 'Departure Date', 'Departure Time', 'Arrival Date', 'Arrival Time', 'No.'],
                "Keys": ['AirlineId', 'AirWaybillNumber', 'AirWaybillDate', 'EstimatedDepartureDate', 'EstimatedDepartureTime', 'EstimatedArrivalDate', 'EstimatedArrivalTime', 'OriginBusinessUnitId', 'DestinationBusinessUnitId', 'DepartureDate', 'DepartureTime', 'ArrivalDate', 'ArrivalTime', ],
                "Type": ['Default', 'Default', 'Default', 'Default', 'Default', 'Default', 'Default', 'Default', 'Default', 'Default', 'Default', 'Default', 'Default'],
                "ColWidth": [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150 ],
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
                "DataTarget": "AirFreightMenu",
                //"DataTarget2": "ShipmentMenu2",
                "ShowCreate": false,
                "ShowContextMenu": true,
                "ContextMenu": ["'Load'", "'Create'", "'Edit'", "'Delete'", "'View'", "'Find'", "'Clear'"],
                "ContextMenuLabel": ['Reload', 'Create', 'Edit', 'Cancel', 'View', 'Find', 'Clear']
            }
        };

        $scope.initializeAirFreightSubmitDefinition = function () {
            $scope.airFreightSubmitDefinition = {
                "Submit": false, //By default
                "APIUrl": '/api/AirFreights',
                "Type": 'Create', //By Default
                "DataItem": {},
                "Index": -1 //By Default
            }
        };

        $scope.airFreightOtheractions = function (action) {
            switch (action) {
                //case "FormCreate":
                //    $scope.shipmentResetData();
                //    $scope.viewOnly = false;
                //    $scope.submitButtonText = "Submit";
                //    $scope.shipmentSubmitDefinition.Type = "Create";
                //    $scope.deliveryAddressDataDefinition.ViewOnly = false;
                //    $scope.deliveryAddressDataDefinition.ActionMode = "Create";
                //    $scope.pickupAddressDataDefinition.ViewOnly = false;
                //    $scope.pickupAddressDataDefinition.ActionMode = "Create";
                //    return true;
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
                //case "PostEditAction":
                //    $scope.onEDV();
                //    $scope.viewOnly = false;
                //    $scope.submitButtonText = "Submit";
                //    $scope.shipmentSubmitDefinition.Type = "Edit";
                //    $scope.deliveryAddressDataDefinition.ViewOnly = false;
                //    $scope.deliveryAddressDataDefinition.ActionMode = "Edit";
                //    $scope.pickupAddressDataDefinition.ViewOnly = false;
                //    $scope.pickupAddressDataDefinition.ActionMode = "Edit";
                //    return true;
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
                case "PreSubmit":
                    
                        $scope.airFreightSubmitDefinition.DataItem = angular.copy($scope.airFreightItem);
                        //console.log($scope.airFreightSubmitDefinition.DataItem);
                    return true;
                case "PreSave":
                    console.log($scope.airFreightSubmitDefinition.DataItem);
                    //delete $scope.airFreightSubmitDefinition.DataItem.Airline;
                    //delete $scope.airFreightSubmitDefinition.DataItem.BusinessUnit;
                    //delete $scope.airFreightSubmitDefinition.DataItem.BusinessUnit1;
                    //delete $scope.airFreightSubmitDefinition.DataItem.OriginalBusinessUnitName;
                    //delete $scope.airFreightSubmitDefinition.DataItem.DestinationBusinessUnitName;
                    return true;
                case "PostSave":
                    //var addressHolder = $scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality;
                    //$scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality = {};
                    //$scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.Id = addressHolder[0].Id;
                    //$scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.Name = addressHolder[0].Name;
                    //$scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.StateProvince = {};
                    //$scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.StateProvince.Id = addressHolder[0].StateProvince.Id;
                    //$scope.shipmentItem.Customer.CustomerAddresses[0].CityMunicipality.StateProvince.Name = addressHolder[0].StateProvince.Name;
                    //addressHolder = {};
                    //$scope.shipmentItem.Id = $scope.shipmentSubmitDefinition.DataItem.Id;
                    //$scope.shipmentItem.TransportStatusId = $scope.shipmentSubmitDefinition.DataItem.TransportStatusId;
                    //$scope.shipmentItem.DeliveryAddressId = $scope.shipmentSubmitDefinition.DataItem.DeliveryAddressId;
                    //$scope.shipmentItem.OriginAddressId = $scope.shipmentSubmitDefinition.DataItem.OriginAddressId;
                    //$scope.shipmentItem.Address.Id = $scope.shipmentSubmitDefinition.DataItem.Address.Id;
                    //$scope.shipmentItem.Address1.Id = $scope.shipmentSubmitDefinition.DataItem.Address1.Id;
                    //$scope.shipmentDataDefinition.DataItem = $scope.shipmentItem;
                    console.log($scope.airFreightSubmitDefinition.DataItem);
                    alert("Successfully Saved.");
                    //$scope.onEDV();
                    $scope.submitButtonText = "Submit";
                    $scope.airFreightSubmitDefinition.Type = "Edit";
                    $scope.viewOnly = true;
                    return true;
                //case "PreUpdate":
                //    delete $scope.shipmentSubmitDefinition.DataItem.BusinessUnit;
                //    delete $scope.shipmentSubmitDefinition.DataItem.BusinessUnit1;
                //    delete $scope.shipmentSubmitDefinition.DataItem.Service;
                //    delete $scope.shipmentSubmitDefinition.DataItem.ShipmentType;
                //    delete $scope.shipmentSubmitDefinition.DataItem.Customer;
                //    delete $scope.shipmentSubmitDefinition.DataItem.Address.CityMunicipality;
                //    delete $scope.shipmentSubmitDefinition.DataItem.Address1.CityMunicipality;
                //    return true;
                //case "PostUpdate":
                //    if ($scope.shipmentSubmitDefinition.Index != -1)
                //        $scope.shipmentDataDefinition.DataList[$scope.shipmentSubmitDefinition.Index] = $scope.shipmentItem;
                //    $scope.shipmentDataDefinition.DataItem = $scope.shipmentItem;
                //    $scope.onEDV();
                //    $scope.viewOnly = true;
                //    alert("Successfully Updated.");
                //    return true;
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
                //case "Find":
                //    $scope.selectedTab = $scope.tabPages[1];
                //    var promise = $interval(function () {
                //        if ($scope.shipmentToggle == false) {
                //            $("#shipmentToggle").slideToggle(function () {
                //                $scope.shipmentToggle = true;
                //            });
                //        }
                //        $interval.cancel(promise);
                //        promise = undefined;
                //    }, 200);
                //    return true;
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

        $scope.airFreightResetData = function () {
            $scope.shipmentItem = {
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
                "BusinessUnit": {
                    "Id": null,
                    "Code": null,
                    "Name": null
                },
                "DestinationBusinessUnitId": null,
                "BusinessUnit1": {
                    "Id": null,
                    "Code": null,
                    "Name": null
                },
                "DepartureDate": null,
                "DepartureTime": null,
                "ArrivalDate": null,
                "ArrivalTime": null,
                "CreatedDate": null,
                "LastUpdatedDate": null,
                "CreatedByUserId": null,
                "LastUpdatedByUserId": null,
                "AirFreightShipments": []
            }
        };

        $scope.airFreightShowFormError = function (error) {
            $scope.airFreightIsError = true;
            $scope.airFreightErrorMessage = error;
        };

        $scope.initializeAirFreightDataDefinition();
        $scope.initializeAirFreightSubmitDefinition();
    };

    //function that will be invoked during compiling of airfreight datagrid to DOM
    $scope.compileAirFreightDataGrid = function () {
        var html = '<dir-data-grid2 datadefinition      = "airFreightDataDefinition"' +
                                    'submitdefinition   = "airFreightSubmitDefinition"' +
                                    'otheractions       = "airFreightOtheractions(action)"' +
                                    'resetdata          = "airFreightResetData()"' +
                                    'showformerror      = "airFreightShowFormError(error)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#airFreightContainer')).html(html);
        $compile($content)($scope);
    };

    //Load airfreight filtering for compiling
    $scope.loadAirFreightFiltering = function () {
        $scope.initAirFreightFilteringParameters();
        $scope.initAirFreightFilteringContainter();
        $("#airFreightToggle").slideToggle(function () { });
    };

    //initialize airfreight filtering parameters
    $scope.initAirFreightFilteringContainter = function () {
        html = '<dir-filtering  filterdefinition="airFreightFilteringDefinition"' +
                                'filterlistener="airFreightDataDefinition.Retrieve"' +
                                'otheractions="airFreightOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#airFreightFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of airfreight filtering to DOM
    $scope.initAirFreightFilteringParameters = function () {
        //Hide the airfreight filtering directive
        $scope.hideAirFreightToggle = function () {
            var promise = $interval(function () {
                $("#airFreightToggle").slideToggle(function () {
                    $scope.airFreightToggle = false;
                });
                $interval.cancel(promise);
                promise = undefined;
            }, 200)
        };

        $scope.initAirFreightFilteringDefinition = function () {
            $scope.airFreightFilteringDefinition = {
                "Url": ($scope.airFreightDataDefinition.EnablePagination == true ? 'api/AirFreights?type=paginate&param1=' + $scope.airFreightDataDefinition.CurrentPage : 'api/AirFreights?type=scroll&param1=' + $scope.airFreightDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value
                "Source": [
                            { "Index": 0, "Label": "AirFreight No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                            //{ "Index": 1, "Label": "Booking Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            //{ "Index": 7, "Label": "Customer", "Column": "CustomerId", "Values": ['GetCustomers'], "From": null, "To": null, "Type": "Modal" },
                            //{ "Index": 8, "Label": "BusinessUnit", "Column": "BusinessUnitId", "Values": ['GetBusinessList'], "From": null, "To": null, "Type": "Modal" },
                            //{ "Index": 2, "Label": "Service", "Column": "ServiceId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                            //{ "Index": 3, "Label": "Shipment Type", "Column": "ShipmentTypeId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                            //{ "Index": 4, "Label": "Payment Mode", "Column": "PaymentMode", "Values": $scope.paymentModeList, "From": null, "To": null, "Type": "DropDown" },
                            //{ "Index": 5, "Label": "Target Pickup Date", "Column": "PickupDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            //{ "Index": 9, "Label": "Operation Site", "Column": "PickUpBussinessUnitId", "Values": ['GetBusinessList'], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 1, "Label": "Status", "Column": "TransportStatusId", "Values": $rootScope.getTransportStatusList(), "From": null, "To": null, "Type": "DropDown" }
                ],//Contains the Criteria definition
                "Multiple": true,
                "AutoLoad": false,
                "ClearData": false,
                "SetSourceToNull": false
            }
        };

        $scope.airFreightOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.selectedTab = $scope.tabPages[1];
                    $scope.airFreightSource = $scope.airFreightFilteringDefinition.Source;
                    //Optional in using this, can use switch if every source type has validation before filtering

                    for (var i = 0; i < $scope.airFreightSource.length; i++) {
                        if ($scope.airFreightSource[i].Type == "Date") {
                            $scope.airFreightFilteringDefinition.DataItem1.AirFreight[0][$scope.airFreightSource[i].Column] = $scope.airFreightSource[i].From;
                            $scope.airFreightFilteringDefinition.DataItem1.AirFreight[1][$scope.airFreightSource[i].Column] = $scope.airFreightSource[i].To;
                        }
                        else
                            $scope.airFreightFilteringDefinition.DataItem1.AirFreight[0][$scope.airFreightSource[i].Column] = $scope.airFreightSource[i].From;
                    }
                    //Delete keys that the value is null
                    for (var i = 0; i < $scope.airFreightSource.length; i++) {
                        if ($scope.airFreightFilteringDefinition.DataItem1.AirFreight[0][$scope.airFreightSource[i].Column] == null) {
                            delete $scope.airFreightFilteringDefinition.DataItem1.AirFreight[0][$scope.airFreightSource[i].Column];
                            delete $scope.airFreightFilteringDefinition.DataItem1.AirFreight[1][$scope.airFreightSource[i].Column];
                        }
                    }

                    if ($scope.airFreightDataDefinition.EnablePagination == true && $scope.airFreightFilteringDefinition.ClearData) {
                        $scope.airFreightDataDefinition.CurrentPage = 1;
                        $scope.airFreightFilteringDefinition.Url = 'api/AirFreights?type=paginate&param1=' + $scope.airFreightDataDefinition.CurrentPage;
                    }
                    else if ($scope.airFreightDataDefinition.EnablePagination == true) {
                        $scope.airFreightDataDefinition.DataList = [];
                        $scope.airFreightFilteringDefinition.Url = 'api/AirFreights?type=paginate&param1=' + $scope.airFreightDataDefinition.CurrentPage;
                    }
                        //Scroll
                    else {
                        if ($scope.airFreightFilteringDefinition.ClearData)
                            $scope.airFreightDataDefinition.DataList = [];
                        $scope.airFreightFilteringDefinition.Url = 'api/AirFreights?type=scroll&param1=' + $scope.airFreightDataDefinition.DataList.length;
                    }
                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize shipmentDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize shipmentDataDefinition DataList by pushing each value of filterDefinition DataList*/
                    //Required
                    $scope.airFreightFilteringDefinition.DataList = $rootScope.formatAirFreight($scope.airFreightFilteringDefinition.DataList);

                    if ($scope.airFreightDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.airFreightFilteringDefinition.DataList.length; j++)
                            $scope.airFreightDataDefinition.DataList.push($scope.airFreightFilteringDefinition.DataList[j]);
                    }

                    if ($scope.airFreightDataDefinition.EnablePagination == true) {
                        $scope.airFreightDataDefinition.DataList = [];
                        $scope.airFreightDataDefinition.DataList = $scope.airFreightFilteringDefinition.DataList;
                        $scope.airFreightDataDefinition.DoPagination = true;
                    }

                    //Format OrginAddress and Delivery Address
                    for (var i = 0; i < $scope.airFreightDataDefinition.DataList.length; i++) {
                        //Initialize Pickup Address
                        $scope.airFreightDataDefinition.DataList[i].OriginAddress = $scope.initializeAddressField($scope.airFreightDataDefinition.DataList[i].Address1, 'MasterList');
                        //Initalize Consignee Address
                        $scope.airFreightDataDefinition.DataList[i].DeliveryAddress = $scope.initializeAddressField($scope.airFreightDataDefinition.DataList[i].Address, 'MasterList');
                    }
                    if ($scope.airFreightToggle == true)
                        $scope.hideAirFreightToggle();
                    return true;
                case 'GetBusinessList':
                    //Show modal here then after user choose a specific data to filter pass the to From field in the source where Values[0] is equal to the action, ex. GetBusinessUnitList
                    //Use if filtering criteria is modal
                    return true;
                default: return true;
            }
        };

        $scope.initAirFreightDataItems = function () {
            $scope.airFreightFilteringDefinition.DataItem1 = angular.copy($rootScope.airFreightObj());
        };
        $scope.initAirFreightFilteringDefinition();
        $scope.initAirFreightDataItems();
    };
    //=====================================END OF AIRFREIGHT FILTERING AND DATAGRID===================

    //===================================== SHIPMENT MODAL =============================================
    $scope.showShipment = function () {
        $scope.shipmentFilteringDefinition.SetSourceToNull = true;
        $scope.shipmentDataDefinition.Retrieve = true;
        openModalPanel("#shipment-list-modal");

    };

    $scope.loadShipmentFiltering = function () {
        $scope.initShipmentFilteringParameters();
        $scope.initShipmentFilteringContainer();
    };

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
                case "PostEditAction":
                    //$scope.seaFreightSubmitDefinition.Type = "Edit";
                    $scope.shipmentItem.Id = $scope.shipmentDataDefinition.DataItem.Id;
                    $scope.shipmentItem.TotalCBM = $scope.shipmentDataDefinition.DataItem.TotalCBM;
                    $scope.shipmentItem.Customer.Code = $scope.shipmentDataDefinition.DataItem.Customer.Code;
                    $scope.shipmentItem.Customer.Name = $scope.shipmentDataDefinition.DataItem.Customer.Name;
                    $scope.shipmentItem.Quantity = $scope.shipmentDataDefinition.DataItem.Quantity;
                    $scope.shipmentItem.DeliveryDate = $scope.shipmentDataDefinition.DataItem.DeliveryDate;
                    $scope.shipmentItem.DeliveryTime = $scope.shipmentDataDefinition.DataItem.DeliveryTime;
                    $scope.shipmentItem.Description = $scope.shipmentDataDefinition.DataItem.Description;
                    $scope.shipmentItem.DeliverTo = $scope.shipmentDataDefinition.DataItem.DeliverTo;
                    $scope.shipmentItem.DeliverToContactNo = $scope.shipmentDataDefinition.DataItem.DeliverToContactNo;
                    $scope.shipmentItem.DeliveryAddress = $scope.shipmentDataDefinition.DataItem.Address.Line1 + ' ' + $scope.shipmentDataDefinition.DataItem.Address.Line2;
                    //console.log($scope.shipmentItem);
                    $scope.closeModal();
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
    //===================================== END OF SHIPMENT MODAL =======================================

    //===================================== AIRLINE MODAL =============================================
    $scope.showAirline = function () {
        $scope.airlineFilteringDefinition.SetSourceToNull = true;
        $scope.airlineDataDefinition.Retrieve = true;
        openModalPanel("#airline-list-modal");

    };

    $scope.loadAirlineFiltering = function () {
        $scope.initAirlineFilteringParameters();
        $scope.initAirlineFilteringContainer();
    };

    $scope.initAirlineFilteringContainer = function () {
        html = '<dir-filtering  filterdefinition="airlineFilteringDefinition"' +
                                'filterlistener="airlineDataDefinition.Retrieve"' +
                                'otheractions="airlineOtherActionsFiltering(action)"' +
               '</dir-filtering>';
        $content = angular.element(document.querySelector('#airlineFilterContainter')).html(html);
        $compile($content)($scope);
    };

    //function that will be called during compiling of business unit filtering to DOM
    $scope.initAirlineFilteringParameters = function () {
        $scope.initAirlineFilteringDefinition = function () {
            $scope.airlineFilteringDefinition = {
                "Url": ($scope.airlineDataDefinition.EnablePagination == true ? 'api/Airlines?type=paginate&param1=' + $scope.airlineDataDefinition.CurrentPage : 'api/Airlines?type=scroll&param1=' + $scope.airlineDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index
                "Source": [
                            { "Index": 0, "Label": "Name", "Column": "Name", "Values": [], "From": null, "To": null, "Type": "Default" },
                ],//Contains the Criteria definition
                "Multiple": false,
                "AutoLoad": true,
                "ClearData": false,
                "SetSourceToNull": false
            }
        };

        $scope.airlineOtherActionsFiltering = function (action) {
            switch (action) {
                //Initialize DataItem1 and DataItem2 for data filtering
                case 'PreFilterData':
                    $scope.airlineSource = $scope.airlineFilteringDefinition.Source;
                    //Optional in using this, can use switch if every source type has validation before filtering
                    for (var i = 0; i < $scope.airlineSource.length; i++) {
                        if ($scope.airlineSource[i].Type == "Date") {
                            $scope.airlineFilteringDefinition.DataItem1.Airline[0][$scope.airlineSource[i].Column] = $scope.airlineSource[i].From;
                            $scope.airlineFilteringDefinition.DataItem1.Airline[1][$scope.airlineSource[i].Column] = $scope.airlineSource[i].To;
                        }
                        else
                            $scope.airlineFilteringDefinition.DataItem1.Airline[0][$scope.airlineSource[i].Column] = $scope.airlineSource[i].From;
                    }

                    //Delete keys that the value is null
                    for (var i = 0; i < $scope.airlineSource.length; i++) {
                        if ($scope.airlineFilteringDefinition.DataItem1.Airline[0][$scope.airlineSource[i].Column] == null) {
                            delete $scope.airlineFilteringDefinition.DataItem1.Airline[0][$scope.airlineSource[i].Column];
                            delete $scope.airlineFilteringDefinition.DataItem1.Airline[1][$scope.airlineSource[i].Column];
                        }
                    }

                    if ($scope.airlineDataDefinition.EnablePagination == true && $scope.airlineFilteringDefinition.ClearData) {
                        $scope.airlineDataDefinition.CurrentPage = 1;
                        $scope.airlineFilteringDefinition.Url = 'api/Airlines?type=paginate&param1=' + $scope.airlineDataDefinition.CurrentPage;
                    }
                    else if ($scope.airlineDataDefinition.EnablePagination == true) {
                        $scope.airlineDataDefinition.DataList = [];
                        $scope.airlineFilteringDefinition.Url = 'api/Airlines?type=paginate&param1=' + $scope.airlineDataDefinition.CurrentPage;
                    }
                        //Scroll
                    else {
                        if ($scope.airlineFilteringDefinition.ClearData)
                            $scope.airlineDataDefinition.DataList = [];
                        $scope.airlineFilteringDefinition.Url = 'api/Airlines?type=scroll&param1=' + $scope.airlineDataDefinition.DataList.length;
                    }
                    return true;
                case 'PostFilterData':
                    /*Note: if pagination, initialize customerDataDefinition DataList by copying the DataList of filterDefinition then 
                            set DoPagination to true
                      if scroll, initialize customerDataDefinition DataList by pushing each value of filterDefinition DataList*/
                    //Required
                    //$scope.customerFilteringDefinition.DataList = $rootScope.formatCustomer($scope.customerFilteringDefinition.DataList);
                    if ($scope.airlineDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.airlineFilteringDefinition.DataList.length; j++)
                            $scope.airlineDataDefinition.DataList.push($scope.airlineFilteringDefinition.DataList[j]);
                    }

                    if ($scope.airlineDataDefinition.EnablePagination == true) {
                        $scope.airlineDataDefinition.DataList = [];
                        $scope.airlineDataDefinition.DataList = $scope.airlineFilteringDefinition.DataList;
                        $scope.airlineDataDefinition.DoPagination = true;
                    }
                    return true;
                default: return true;
            }
        };

        $scope.initAirlineDataItems = function () {
            $scope.airlineFilteringDefinition.DataItem1 = angular.copy($rootScope.airlineObj());
        };

        $scope.initAirlineFilteringDefinition();
        $scope.initAirlineDataItems();
    };

    //Load business datagrid for compiling
    $scope.loadAirlineDataGrid = function () {
        $scope.initAirlineDataGrid();
        $scope.compileAirlineDataGrid();
    };

    //initialize customer datagrid parameters
    $scope.initAirlineDataGrid = function () {
        $scope.airlineSubmitDefinition = undefined;
        $scope.initializeAirlineDataDefinition = function () {
            $scope.airlineDataDefinition = {
                "Header": ['ID','Name','No.'],
                "Keys": ['Id','Name'],
                "Type": ['ControlNo','Default'],
                "ColWidth": [150,300],
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
                "DataTarget": "AirlineMenu",
                "ShowCreate": false,
                "ShowContextMenu": false,
                "ContextMenu": [""],
                "ContextMenuLabel": [""]
            }
            $scope.airlineDataDefinition.RowTemplate = '<div>' +
                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                '</div>';
        };

        $scope.airlineOtherActions = function (action) {
            switch (action) {
                case "PostEditAction":
                    $scope.airFreightItem.AirlineId = $scope.airlineDataDefinition.DataItem.Id;
                    $scope.airFreightItem.Airline.Name = $scope.airlineDataDefinition.DataItem.Name;
                    $scope.closeModal();
                    return true;
                default: return true;
            }
        };

        $scope.initializeAirlineDataDefinition();
    };

    //function that will be invoked during compiling of customer datagrid to DOM
    $scope.compileAirlineDataGrid = function () {
        var html = '<dir-data-grid2 datadefinition      = "airlineDataDefinition"' +
                                    'submitdefinition   = "airlineSubmitDefinition"' +
                                    'otheractions       = "airlineOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#airlineContainer')).html(html);
        $compile($content)($scope);
    };
    //===================================== END OF AIRLINE MODAL =======================================

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
        $scope.initBusinessUnits();
        $scope.initAirFreightItem();
        $scope.loadShipmentDataGrid();
        $scope.loadShipmentFiltering();
        $scope.loadAirlineDataGrid();
        $scope.loadAirlineFiltering();
        $scope.loadAirFreightDataGrid();
        $scope.loadAirFreightFiltering();
        $scope.addNewShipment();

        if ($scope.shipmentFilteringDefinition.AutoLoad == true)
            $scope.shipmentDataDefinition.Retrieve = true;

        if ($scope.airlineFilteringDefinition.AutoLoad == true)
            $scope.airlineDataDefinition.Retrieve = true;
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