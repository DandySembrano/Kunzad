kunzadApp.controller("AirFreightsController", AirFreightsController);
function AirFreightsController($scope, $http, $interval, $filter, $rootScope, $compile, restAPIWDToken, $localForage) {
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
    $scope.businessUnitList = [];
    $scope.airLineList = [];
    $scope.shipmentItems = [];
    $scope.AirFreightShipments = [];
    var pageSize = 20;
    $scope.selectedShipmentDtlRow = 0;
    $scope.enableSave = true;
    $scope.sessionExpired = false;

    $('#estimateDepartureDate,#estimateArrivalDate,#departureDate,#arrivalDate,#deliverydate,#airWaybillDate').datetimepicker({
        format: 'MM-DD-YYYY',
        sideBySide: false,
        pickTime: false
        //minDate: moment()
    })

    $('#estimateDepartureTime,#estimateArrivalTime,#departureTime,#arrivalTime,#deliverytime').datetimepicker({
        format: 'HH:mm',
        sideBySide: false,
        pickDate: false
    })

    $scope.submit = function () {
        $scope.airFreightIsError = false;
        $scope.airFreightErrorMessage = "";
        $scope.airFreightSubmitDefinition.Submit = true;
    }

    //Function that will trigger during Edit,Delete and View Action
    $scope.onEDV = function () {
        $scope.airFreightItem = [];
        $scope.airFreightItem = angular.copy($scope.airFreightDataDefinition.DataItem);
        $scope.controlNoHolder = $scope.airFreightItem.Id;
        $scope.airFreightItem.Id = $rootScope.formatControlNo('', 8, $scope.airFreightItem.Id);
    };

    //Retrieve seafreight's shipments
    $scope.getAirFreightDetail = function (airFreightId) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0;
        restAPIWDToken.data("/api/AirFreightShipments?airFreightId=" + airFreightId + "&page=1", function (data) {
            if (data != undefined) {
                if (data.status == "FAILURE") {
                    if (data.value == 401)
                        $scope.sessionExpired = true;
                        spinner.stop();
                }
                else {
                    $scope.AirFreightShipmentGridOptions.data = data.value;
                    $scope.focusOnTop();
                    spinner.stop();
                }
            }
        });
        //$http.get("/api/AirFreightShipments?airFreightId=" + airFreightId + "&page=1")
        //    .success(function (data, status) {
        //        //initialize seafreight shipments
        //        $scope.AirFreightShipmentGridOptions.data = data;

        //        $scope.focusOnTop();
        //        spinner.stop();
        //    })
        //    .error(function (data, status) {
        //        spinner.stop();
        //    });
    };

    $scope.showModal = function (panel) {
        openModalPanel(panel);
    };

    $scope.initBusinessUnits = function () {
        restAPIWDToken.data("/api/BusinessUnits", function (data) {
            if (data != undefined) {
                if (data.status == "FAILURE") {
                    if (data.value == 401)
                        $scope.sessionExpired = true;
                    spinner.stop();
                }
                else {
                    $scope.businessUnitList = data.value;
                    $scope.focusOnTop();
                    spinner.stop();
                }
            }
        });
        //$http.get("/api/BusinessUnits")
        //.success(function (data, status) {
        //    $scope.businessUnitList = data;
        //});
    };

    $scope.initAirlines = function () {
        restAPIWDToken.data("/api/AirLines", function (data) {
            if (data != undefined) {
                if (data.status == "FAILURE") {
                    if (data.value == 401)
                        $scope.sessionExpired = true;
                    spinner.stop();
                }
                else {
                    $scope.airLineList = data.value;
                    $scope.focusOnTop();
                    spinner.stop();
                }
            }
        });
        //$http.get("/api/AirLines")
        //.success(function (data, status) {
        //    $scope.airLineList = data;
        //});
    };

    //function that will be invoked when user click tab
    $scope.setSelectedTab = function (tab) {
        $scope.airFreightIsError = false;
        $scope.airFreightErrorMessage = "";
        $scope.selectedTab = tab;
    };

    $scope.removeBooking = function (index) {
        if ($scope.AirFreightShipments.length == 1)
            alert('Unable to delete detail, At least 1 detail is required.');
        else
            $scope.AirFreightShipments.splice(index, 1);
    };

    // NUMBERS w/ DECIMAL AND COMMA
    $('#cost').priceFormat({
        clearPrefix: true,
        prefix: '',
        centsSeparator: '.',
        thousandsSeparator: ',',
        centsLimit: 2
    });

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
                "Header": ['Air Freight No', 'Airline', 'Waybill No', 'Waybill Date', 'Est Departure Date', 'Est Departure Time', 'Est Arrival Date', 'Est Arrival Time', 'Orgin', 'Destination', 'Departure Date', 'Departure Time', 'Arrival Date', 'Arrival Time', 'No.'],
                "Keys": ['Id', 'AirLine.Name', 'AirWaybillNumber', 'AirWaybillDate', 'EstimatedDepartureDate', 'EstimatedDepartureTime', 'EstimatedArrivalDate', 'EstimatedArrivalTime', 'BusinessUnit1.Name', 'BusinessUnit.Name', 'DepartureDate', 'DepartureTime', 'ArrivalDate', 'ArrivalTime', ],
                "Type": ['ControlNo', 'Default', 'Default', 'Default', 'Default', 'Default', 'Default', 'Default', 'Default', 'Default', 'Default', 'Default', 'Default', 'Default'],
                "ColWidth": [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
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
                "DataTarget2": "AirFreightMenu2",
                "ShowCreate": false,
                "ShowContextMenu": true,
                "ContextMenu": ["'Load'", "'Create'", "'Edit'", "'Delete'", "'View'", "'Find'", "'Clear'"],
                "ContextMenuLabel": ['Reload', 'Create', 'Edit', 'Cancel', 'View', 'Find', 'Clear'],
                "IsDetail": false
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

        //check if row is empty or specific field was not filled up
        $scope.validAirFreightShipments = function () {
            for (var i = 0; i < $scope.airFreightShipmentsDataDefinition.DataList.length; i++) {
                if ($scope.airFreightShipmentsDataDefinition.DataList[i].ShipmentId == 0) {
                    $scope.airFreightIsError = true;
                    $scope.airFreightErrorMessage = "Shipment is required in row " + (i + 1) + ".";
                    $scope.focusOnTop();
                    return false;
                }
                else if ($scope.airFreightShipmentsDataDefinition.DataList[i].CostAllocation == null || $scope.airFreightShipmentsDataDefinition.DataList[i].CostAllocation == 0) {
                    $scope.airFreightIsError = true;
                    $scope.airFreightErrorMessage = "Cost Allocation must be greater than zero in row " + (i + 1) + ".";
                    $scope.focusOnTop();
                    return false;
                }
            }
            return true;
        };

        $scope.airFreightOtheractions = function (action) {
            console.log(action);
            switch (action) {
                case "FormCreate":
                    $scope.airFreightResetData();
                    $scope.airFreightShipmentResetData();
                    $scope.airFreightShipmentsAdd();
                    $scope.viewOnly = false;
                    $scope.submitButtonText = "Submit";
                    $scope.airFreightSubmitDefinition.Type = "Create";
                    return true;
                case "PreAction":
                    $scope.selectedTab = $scope.tabPages[0];
                    $scope.shipmentIsError = false;
                    $scope.shipmentErrorMessage = "";
                    return true;
                case "PostEditAction":
                    $scope.airFreightItem = [];
                    $scope.airFreightItem = angular.copy($scope.airFreightDataDefinition.DataItem);
                    //format date, time

                    $scope.airFreightItem.EstimatedDepartureDate = $filter('Date')(($scope.airFreightItem.EstimatedDepartureDate), "yyyy-MM-dd");
                    $scope.airFreightItem.EstimatedArrivalTime = $filter('Date')(($scope.airFreightItem.EstimatedArrivalTime), "hh:mm:ss");
                    $scope.airFreightItem.EstimatedArrivalDate = $filter('Date')(($scope.airFreightItem.EstimatedArrivalDate), "yyyy-MM-dd");
                    $scope.airFreightItem.EstimatedArrivalTime = $filter('Date')(($scope.airFreightItem.EstimatedArrivalTime), "hh:mm:ss");
                    $scope.airFreightItem.DepartureDate = $filter('Date')(($scope.airFreightItem.DepartureDate), "yyyy-MM-dd");
                    $scope.airFreightItem.DepartureTime = $filter('Date')(($scope.airFreightItem.DepartureTime), "hh:mm:ss");
                    $scope.airFreightItem.ArrivalDate = $filter('Date')(($scope.airFreightItem.ArrivalDate), "yyyy-MM-dd");
                    $scope.airFreightItem.ArrivalTime = $filter('Date')(($scope.airFreightItem.ArrivalTime), "hh:mm:ss");
                    $scope.airFreightItem.AirWaybillDate = $filter('Date')(($scope.airFreightItem.AirWaybillDate), "yyyy-MM-dd");

                    $scope.controlNoHolder = $scope.airFreightItem.Id;
                    $scope.airFreightItem.Id = $rootScope.formatControlNo('', 8, $scope.airFreightItem.Id);

                    $scope.AirFreightShipments = $scope.airFreightItem.AirFreightShipments;
                    for (var i = 0; i < $scope.airFreightItem.AirFreightShipments.length; i++) {
                        $scope.AirFreightShipments[i].Shipment.Id = $rootScope.formatControlNo('', 8, $scope.airFreightItem.AirFreightShipments[i].Shipment.Id);
                    }

                    $scope.submitButtonText = "Update";
                    $scope.selectedTab = $scope.tabPages[0];
                    $scope.airFreightSubmitDefinition.Type = "Edit";
                    $scope.viewOnly = false;
                    return true;
                case "PostViewAction":
                    $scope.airFreightItem = angular.copy($scope.airFreightDataDefinition.DataItem);
                    $scope.airFreightItem.EstimatedDepartureDate = $filter('Date')(($scope.airFreightItem.EstimatedDepartureDate), "yyyy-MM-dd");
                    $scope.airFreightItem.EstimatedArrivalTime = $filter('Date')(($scope.airFreightItem.EstimatedArrivalTime), "hh:mm:ss");
                    $scope.airFreightItem.EstimatedArrivalDate = $filter('Date')(($scope.airFreightItem.EstimatedArrivalDate), "yyyy-MM-dd");
                    $scope.airFreightItem.EstimatedArrivalTime = $filter('Date')(($scope.airFreightItem.EstimatedArrivalTime), "hh:mm:ss");
                    $scope.airFreightItem.DepartureDate = $filter('Date')(($scope.airFreightItem.DepartureDate), "yyyy-MM-dd");
                    $scope.airFreightItem.DepartureTime = $filter('Date')(($scope.airFreightItem.DepartureTime), "hh:mm:ss");
                    $scope.airFreightItem.ArrivalDate = $filter('Date')(($scope.airFreightItem.ArrivalDate), "yyyy-MM-dd");
                    $scope.airFreightItem.ArrivalTime = $filter('Date')(($scope.airFreightItem.ArrivalTime), "hh:mm:ss");
                    $scope.airFreightItem.AirWaybillDate = $filter('Date')(($scope.airFreightItem.AirWaybillDate), "yyyy-MM-dd");

                    $scope.airFreightItem.Id = $rootScope.formatControlNo('', 8, $scope.airFreightItem.Id);

                    $scope.AirFreightShipments = $scope.airFreightItem.AirFreightShipments;
                    for (var i = 0; i < $scope.airFreightItem.AirFreightShipments.length; i++) {
                        $scope.AirFreightShipments[i].Shipment.Id = $rootScope.formatControlNo('', 8, $scope.airFreightItem.AirFreightShipments[i].Shipment.Id);
                    }
                    
                    $scope.submitButtonText = "Close";
                    $scope.selectedTab = $scope.tabPages[0];
                    $scope.airFreightSubmitDefinition.Type = "Edit";
                    $scope.viewOnly = true;
                    return true;
                case "PreSubmit":
                    $scope.airFreightSubmitDefinition.DataItem = angular.copy($scope.airFreightItem);
                    $scope.airFreightSubmitDefinition.DataItem.AirFreightShipments = angular.copy($scope.AirFreightShipments);
                    $scope.airFreightItem.AirFreightShipments = $scope.AirFreightShipments;
                    return true;
                case "PreSave":
                    delete $scope.airFreightSubmitDefinition.DataItem.Id;
                    delete $scope.airFreightSubmitDefinition.DataItem.Airline;
                    delete $scope.airFreightSubmitDefinition.DataItem.BusinessUnit;
                    delete $scope.airFreightSubmitDefinition.DataItem.BusinessUnit1;
                    delete $scope.airFreightSubmitDefinition.DataItem.OriginBusinessUnitName;
                    delete $scope.airFreightSubmitDefinition.DataItem.DestinationBusinessUnitName;

                    for (var i = 0; i < $scope.airFreightSubmitDefinition.DataItem.AirFreightShipments.length; i++) {
                        delete $scope.airFreightSubmitDefinition.DataItem.AirFreightShipments[i].Shipment;
                    }
                    return true;
                case "PostSave":
                    $scope.airFreightItem.Id = $scope.airFreightSubmitDefinition.DataItem.Id;
                    $scope.airFreightDataDefinition.DataItem = $scope.airFreightItem;
                    $scope.airFreightItem.Id = $rootScope.formatControlNo('', 8, $scope.airFreightItem.Id);
                    alert("Successfully Saved.");
                    $scope.onEDV();
                    $scope.submitButtonText = "Update";
                    $scope.airFreightSubmitDefinition.Type = "Edit";
                    $scope.viewOnly = true;
                    $scope.enableSave = false;

                    return true;
                case "PreUpdate":
                    //console.log($scope.airFreightDataDefinition.DataItem);
                    $scope.airFreightItem = angular.copy($scope.airFreightDataDefinition.DataItem);
                    $scope.airFreightItem.Id = $rootScope.formatControlNo('', 8, $scope.airFreightItem.Id);
                    delete $scope.airFreightDataDefinition.DataItem.BusinessUnit;
                    delete $scope.airFreightDataDefinition.DataItem.BusinessUnit1;
                    delete $scope.airFreightDataDefinition.DataItem.AirLine;
                    for (var i = 0; i < $scope.airFreightDataDefinition.DataItem.AirFreightShipments.length; i++) {
                        delete $scope.airFreightDataDefinition.DataItem.AirFreightShipments[i].Shipment;
                    }
                    alert("Successfully Updated.");
                    $scope.onEDV();
                    $scope.submitButtonText = "Update";
                    $scope.airFreightSubmitDefinition.Type = "Edit";
                    $scope.viewOnly = true;
                    return true;
                case "Find":
                    $scope.selectedTab = $scope.tabPages[1];
                    $("#airFreightToggle").slideToggle(function () {
                        $scope.airFreightToggle = true;
                    });
                    return true;

                default: return true;
            }
        };

        $scope.airFreightResetData = function () {

            $scope.airFreightItem = {
                "Id": null,
                "AirlineId": null,
                "AirLine": {
                    "Id": null,
                    "Name": null
                },
                "AirWaybillNumber": null,
                "AirWaybillDate": $filter('Date')(new Date()),
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
                "LastUpdatedByUserId": null
            }
            $scope.airFreightItem.BusinessUnit = {
                "Id": 1,
                "Code": "BU0001",
                "Name": "Manila",
                "BusinessUnitTypeId": 1,
                "ParentBusinessUnitId": null,
                "isOperatingSite": false,
                "hasAirPort": false,
                "hasSeaPort": false,
                "CreatedDate": null,
                "LastUpdatedDate": null,
                "CreatedByUserId": null,
                "LastUpdatedByUserId": null
            }
            $scope.airFreightItem.OriginBusinessUnitId = $scope.airFreightItem.BusinessUnit.Id;
            $scope.airFreightItem.OriginBusinessUnitName = $scope.airFreightItem.BusinessUnit.Name;
        };

        $scope.airFreightShipmentsAdd = function () {
            $scope.airFreightShipmentItem = {
                "Id": null,
                "AirFreightId": null,
                "ShipmentId": null,
                "Shipment": $rootScope.shipmentObj(),
                "CostAllocation": $filter('number')(0.00,2)
            }
            $scope.AirFreightShipments.push($scope.airFreightShipmentItem);
        }

        $scope.airFreightShipmentResetData = function () {
            $scope.AirFreightShipments = [];
        }

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
                             { "Index": 0, "Label": "Code", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "Name", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Default" },
                ],//Contains the Criteria definition
                "Multiple": true,
                "AutoLoad": false,
                "ClearData": false,
                "SetSourceToNull": false,
                "IsDetail": true
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
                        //if ($scope.airFreightSource[i].Type == "Date") {
                            $scope.airFreightFilteringDefinition.DataItem1.AirFreight[0][$scope.airFreightSource[i].Column] = $scope.airFreightSource[i].From;
                            $scope.airFreightFilteringDefinition.DataItem1.AirFreight[1][$scope.airFreightSource[i].Column] = $scope.airFreightSource[i].To;
                        //}
                        //else {
                        //    $scope.airFreightFilteringDefinition.DataItem1.AirFreight[0][$scope.airFreightSource[i].Column] = $scope.airFreightSource[i].From;
                        //}
                    }
                    // Delete keys that the value is null
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
                    $scope.airFreightFilteringDefinition.DataList = $scope.airFreightFilteringDefinition.DataList;
                    if ($scope.airFreightDataDefinition.EnableScroll == true) {
                        for (var j = 0; j < $scope.airFreightFilteringDefinition.DataList.length; j++)
                            $scope.airFreightDataDefinition.DataList.push($scope.airFreightFilteringDefinition.DataList[j]);
                    }
                    if ($scope.airFreightDataDefinition.EnablePagination == true) {
                        $scope.airFreightDataDefinition.DataList = [];
                        $scope.airFreightDataDefinition.DataList = $scope.airFreightFilteringDefinition.DataList;
                        $scope.airFreightDataDefinition.DoPagination = true;
                    }
                    if ($scope.airFreightToggle == true)
                        $scope.hideAirFreightToggle();
                    return true;
                case 'GetBusinessList':
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

    //=====================================BUSINESS UNIT MODAL(origin & destination)======================================
    $scope.showBusinessUnit = function (originOrDestination) {
        $scope.BusinessUnitOriginDestination = originOrDestination; //if button click is origin or destination
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
                        //if ($scope.businessUnitSource[i].Type == "Date") {
                            $scope.businessUnitFilteringDefinition.DataItem1.BusinessUnit[0][$scope.businessUnitSource[i].Column] = $scope.businessUnitSource[i].From;
                            $scope.businessUnitFilteringDefinition.DataItem1.BusinessUnit[1][$scope.businessUnitSource[i].Column] = $scope.businessUnitSource[i].To;
                        //}
                        //else {
                        //    $scope.businessUnitFilteringDefinition.DataItem1.BusinessUnit[0][$scope.businessUnitSource[i].Column] = $scope.businessUnitSource[i].From;

                        //}
                    }

                    if ($scope.businessUnitDataDefinition.EnablePagination == true && $scope.businessUnitFilteringDefinition.ClearData) {
                        $scope.businessUnitDataDefinition.CurrentPage = 1;
                        $scope.businessUnitFilteringDefinition.Url = 'api/BusinessUnits?type=paginate&param1=' + $scope.businessUnitDataDefinition.CurrentPage;
                    }
                    else if ($scope.businessUnitDataDefinition.EnablePagination == true) {
                        $scope.businessUnitDataDefinition.DataList = [];
                        $scope.businessUnitFilteringDefinition.Url = 'api/BusinessUnits?type=paginate&param1=' + $scope.businessUnitDataDefinition.CurrentPage;
                    } else { //scroll
                        if ($scope.businessUnitFilteringDefinition.ClearData)
                            $scope.businessUnitDataDefinition.DataList = [];
                        $scope.businessUnitFilteringDefinition.Url = 'api/BusinessUnits?type=scroll&param1=' + $scope.businessUnitDataDefinition.DataList.length;
                    }
                    return true;
                case 'PostFilterData':
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
                "ContextMenuLabel": [""],
                "IsDetail": true
            }
            $scope.businessUnitDataDefinition.RowTemplate = '<div>' +
                                                                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                                                              '</div>';
        };
        $scope.businessUnitOtherActions = function (action) {
            switch (action) {
                case 'PostEditAction':
                    if ($scope.BusinessUnitOriginDestination == 'ORIGIN') {
                        $scope.airFreightItem.OriginBusinessUnitId = $scope.businessUnitDataDefinition.DataItem.Id;
                        $scope.airFreightItem.BusinessUnit.Name = $scope.businessUnitDataDefinition.DataItem.Name;
                    } else if ($scope.BusinessUnitOriginDestination == 'DESTINATION') {
                        $scope.airFreightItem.DestinationBusinessUnitId = $scope.businessUnitDataDefinition.DataItem.Id;
                        $scope.airFreightItem.BusinessUnit1.Name = $scope.businessUnitDataDefinition.DataItem.Name;
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
        var html = '<dir-data-grid2 id = "businessUnitGrid" datadefinition      = "businessUnitDataDefinition"' +
                                    'submitdefinition   = "businessUnitSubmitDefinition"' +
                                    'otheractions       = "businessUnitOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#businessUnitContainer')).html(html);
        $compile($content)($scope);
    };
    //=======================================END OF BUSINESS UNIT MODAL==============================

    //===================================== SHIPMENT MODAL =============================================
    $scope.showShipment = function (row) {
        $scope.selectedShipmentDtlRow = row;
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
                "Url": ($scope.shipmentDataDefinition.EnablePagination == true ? 'api/Shipments?type=paginate&source=air&param1=' + $scope.shipmentDataDefinition.CurrentPage : 'api/Shipments?type=scroll&source=air&param1=' + $scope.shipmentDataDefinition.DataList.length),//Url for retrieve
                "DataList": [], //Contains the data retrieved based on the criteria
                "DataItem1": $scope.DataItem1, //Contains the parameter value index
                "Source": [
                            { "Index": 0, "Label": "Shipment No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                            { "Index": 1, "Label": "Booking Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 2, "Label": "Customer", "Column": "CustomerId", "Values": [], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 3, "Label": "BusinessUnit", "Column": "BusinessUnitId", "Values": ['GetBusinessList'], "From": null, "To": null, "Type": "Modal" },
                            { "Index": 4, "Label": "Service", "Column": "ServiceId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 5, "Label": "Shipment Type", "Column": "ShipmentTypeId", "Values": [], "From": null, "To": null, "Type": "DropDown" },
                            { "Index": 6, "Label": "Target Pickup Date", "Column": "PickupDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                            { "Index": 7, "Label": "Operation Site", "Column": "PickUpBussinessUnitId", "Values": [], "From": null, "To": null, "Type": "Modal" }
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
                        //else {
                        //    $scope.shipmentFilteringDefinition.DataItem1.Shipment[0][$scope.shipmentSource[i].Column] = $scope.shipmentSource[i].From;
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
                        $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=paginate&source=air&param1=' + $scope.shipmentDataDefinition.CurrentPage;
                    }
                    else if ($scope.shipmentDataDefinition.EnablePagination == true) {
                        $scope.shipmentDataDefinition.DataList = [];
                        $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=paginate&source=air&param1=' + $scope.shipmentDataDefinition.CurrentPage;
                    }
                        //Scroll
                    else {
                        if ($scope.shipmentFilteringDefinition.ClearData) {
                            $scope.shipmentDataDefinition.DataList = [];
                        }
                        $scope.shipmentFilteringDefinition.Url = 'api/Shipments?type=scroll&source=air&param1=' + $scope.shipmentDataDefinition.DataList.length;
                    }

                    $scope.shipmentFilteringDefinition.DataItem1.Shipment[0].BusinessUnitId = $scope.airFreightItem.OriginBusinessUnitId;
                    return true;
                case 'PostFilterData':
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
                "ContextMenuLabel": [""],
                "IsDetail": true
            }
            $scope.shipmentDataDefinition.RowTemplate = '<div>' +
                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                '</div>';
        };

        $scope.shipmentOtherActions = function (action) {
            switch (action) {
                case "PostEditAction":
                    $scope.AirFreightShipments[$scope.selectedShipmentDtlRow].Shipment = $scope.shipmentDataDefinition.DataItem;
                    $scope.AirFreightShipments[$scope.selectedShipmentDtlRow].Shipment.Id = $rootScope.formatControlNo('', 8, $scope.shipmentDataDefinition.DataItem.Id);
                    $scope.AirFreightShipments[$scope.selectedShipmentDtlRow].ShipmentId = $rootScope.formatControlNo('', 8, $scope.shipmentDataDefinition.DataItem.Id);
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
        openModalPanel2("#airline-list-modal");
        $scope.loadAirlineDataGrid();
        $scope.loadAirlineFiltering();
        $scope.airlineFilteringDefinition.SetSourceToNull = true;
        $scope.airlineDataDefinition.Retrieve = true;

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
                             { "Index": 1, "Label": "CreatedDate", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Default" },
                             { "Index": 2, "Label": "LastUpdatedDate", "Column": "LastUpdatedDate", "Values": [], "From": null, "To": null, "Type": "Default" },
                             { "Index": 3, "Label": "CreatedByUserId", "Column": "CreatedByUserId", "Values": [], "From": null, "To": null, "Type": "Default" },
                             { "Index": 4, "Label": "LastUpdatedByUserId", "Column": "LastUpdatedByUserId", "Values": [], "From": null, "To": null, "Type": "Default" },

                ],//Contains the Criteria definition
                "Multiple": false,
                "AutoLoad": false,
                "ClearData": false,
                "SetSourceToNull": false
            }
        };

        $scope.airlineOtherActionsFiltering = function (action) {
            switch (action) {

                case 'PreFilterData':
                    $scope.airlineSource = $scope.airlineFilteringDefinition.Source;
                    //Optional in using this, can use switch if every source type has validation before filtering
                    for (var i = 0; i < $scope.airlineSource.length; i++) {
                        //if ($scope.airlineSource[i].Type == "Date") {
                            $scope.airlineFilteringDefinition.DataItem1.AirLine[0][$scope.airlineSource[i].Column] = $scope.airlineSource[i].From;
                            $scope.airlineFilteringDefinition.DataItem1.AirLine[1][$scope.airlineSource[i].Column] = $scope.airlineSource[i].To;
                        //}
                        //else
                        //    $scope.airlineFilteringDefinition.DataItem1.AirLine[0][$scope.airlineSource[i].Column] = $scope.airlineSource[i].From;
                    }

                    if ($scope.airlineDataDefinition.EnablePagination == true && $scope.airlineDataDefinition.ClearData) {
                        $scope.airlineDataDefinition.CurrentPage = 1;
                        $scope.airlineDataDefinition.Url = 'api/Airlines?type=paginate&param1=' + $scope.airlineDataDefinition.CurrentPage;
                    }
                    else if ($scope.airlineDataDefinition.EnablePagination == true) {
                        $scope.airlineDataDefinition.DataList = [];
                        $scope.airlineDataDefinition.Url = 'api/Airlines?type=paginate&param1=' + $scope.airlineDataDefinition.CurrentPage;
                    } else { //scroll
                        if ($scope.airlineDataDefinition.ClearData)
                            $scope.airlineDataDefinition.DataList = [];
                        $scope.airlineDataDefinition.Url = 'api/Airlines?type=scroll&param1=' + $scope.airlineDataDefinition.DataList.length;
                    }
                    return true;
                case 'PostFilterData':
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
            // console.log($scope.airlineFilteringDefinition.DataItem1)
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
                "Header": ['Name', 'No.'],
                "Keys": ['Name'],
                "Type": ['ControlNo', 'ProperCase'],
                "ColWidth": [1500],
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
                "ContextMenuLabel": [""],
                "IsDetail": true
            }
            $scope.airlineDataDefinition.RowTemplate = '<div>' +
                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                '</div>';
        };

        $scope.airlineOtherActions = function (action) {
            switch (action) {
                case "PostEditAction":
                    $scope.airFreightItem.AirlineId = $scope.airlineDataDefinition.DataItem.Id;
                    $scope.airFreightItem.AirLine.Name = $scope.airlineDataDefinition.DataItem.Name;

                    $scope.closeModal();
                    return true;
                default: return true;
            }
        };

        $scope.initializeAirlineDataDefinition();
    };
    $scope.compileAirlineDataGrid = function () {
        var html = '<dir-data-grid2 id="airlineGrid" datadefinition = "airlineDataDefinition"' +
                                    'submitdefinition   = "airlineSubmitDefinition"' +
                                    'otheractions       = "airlineOtherActions(action)">' +
                    '</dir-data-grid2>';
        $content = angular.element(document.querySelector('#airlineContainer')).html(html);
        $compile($content)($scope);
    };
    //===================================== END OF AIRLINE MODAL =======================================


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

        $scope.initAirlines();
        $scope.initBusinessUnits();

        //$localForage.getItem("Token").then(function (value) {
        //    $http.defaults.headers.common['Token'] = value.toString();
        //    $scope.initAirlines();
        //    $scope.initBusinessUnits();
        //});
        // SHIPMENTS
        $scope.loadShipmentDataGrid();
        $scope.loadShipmentFiltering();


        // AIRLINES
       
        //$scope.loadAirlineDataGrid();
        //$scope.loadAirlineFiltering();
        //$scope.airlineDataDefinition.Retrieve = true;

        // AIRFREIGHTS
        $scope.loadAirFreightDataGrid();
        $scope.loadAirFreightFiltering();

        //RESET DATA
        $scope.airFreightResetData();
        $scope.airFreightShipmentsAdd();
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

    var sessionWatcher = $scope.$watch(function () { return $scope.sessionExpired; }, function (newVal, oldVal) {
        if (newVal == true) {
            alert("Session Expired, please relogin");
            $scope.onLogoutRequest();
        }
    });

    var deregisterWatchers = function () {
        //scannerWatcher();
        sessionWatcher();
    }

    $scope.$on('$destroy', function () {
        deregisterWatchers();
    });
}