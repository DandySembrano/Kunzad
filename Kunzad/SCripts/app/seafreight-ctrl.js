
kunzadApp.controller("SeaFreightController", SeaFreightController);
function SeaFreightController($scope, $http, $interval, $filter, $rootScope, $compile) {
    $scope.modelName = "Sea Freight";
    $scope.modelhref = "#/seafreight";
    $scope.withDirective = true; //this will remove the create and pagination buttons in list tab
    $scope.seafreightGridOptions = {};
    $scope.seafreightGridOptions.data = [];
    $scope.SeaFreightShipmentGridOptions = {};
    $scope.SeaFreightShipmentGridOptions.data = [];
    $scope.seafreightItem = {};
    $scope.seaFreightShipmentItem = {};
    $scope.isPrevPage = false;
    $scope.isNextPage = true;
    $scope.seaFreightToggle = false;
    $scope.actionMode = "Create";
    $scope.selected = null;
    $scope.currentPage = 1;
    $scope.viewOnly = false;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.submitButtonText = "Submit";
    $scope.tabPages = ["Information", "List"];
    $scope.selectedTab = "Information";
    $scope.seafreightIDholder = 0;
    $scope.selectedseafreightIndex = 0;
    $scope.controlNoHolder = 0;
    $scope.modalType = null;
    var pageSize = 20;

    $scope.showModal = function (panel, type) {
            switch (type) {
                case 'origin' || 'desination':
                    $scope.businessUnitFilteringDefinition.SetSourceToNull = true;
                    $scope.businessUnitDataDefinition.Retrieve = true;
                    break;
                case 'shippingline':
                    $scope.shippingLineFilteringDefinition.SetSourceToNull = true;
                    $scope.shippingLineDataDefinition.Retrieve = true;
                    break;
                case 'vessel':
                    $scope.vesselFilteringDefinition.SetSourceToNull = true;
                    $scope.vesselDataDefinition.Retrieve = true;
                    break;
            }

            openModalPanel(panel);
            $scope.modalType = type;
        };
        
        $scope.closeModal = function () {
            jQuery.magnificPopup.close();
        };

        //same with rootScope.shipmentObj
        $scope.seaFreightObj = function () {
            return {
                "SeaFreight": [{
                    "Id": null,
                    "BLDate": null,
                    "OriginBusinessUnitId": null,
                    "DestinationBusinessUnitId": null,
                    "CreatedDate": null,
                    "LastUpdatedDate": null
                },
                {
                    "Id": null,
                    "BLDate": null,
                    "OriginBusinessUnitId": null,
                    "DestinationBusinessUnitId": null,
                    "CreatedDate": null,
                    "LastUpdatedDate": null
                }]
            };
        }

        //same with rootScope.shipmentObj
        $scope.shippingLineObj = function () {
            return {
                "ShippingLine": [{
                    "Id": null,
                    "Name": null
                },
                {
                    "Id": null,
                    "Name": null
                }]
            };
        }

        //same with rootScope.shipmentObj
        $scope.vesselObj = function () {
            return {
                "Vessel": [{
                    "Id": null,
                    "Name": null,
                    "ShippingLineId": null
                },
                {
                    "Id": null,
                    "Name": null,
                    "ShippingLineId": null
                }]
            };
        }
        //=================================================START OF BUSINESS UNIT MODAL=================================================
        //Load businessUnit filtering for compiling
        $scope.loadBusinessUnitFiltering = function () {
            $scope.initBusinessUnitFilteringParameters();
            $scope.initBusinessUnitFilteringContainter();
        };
    
        //initialize businessUnit filtering parameters
        $scope.initBusinessUnitFilteringContainter = function () {
            html = '<dir-filtering  filterdefinition="businessUnitFilteringDefinition"' +
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
                                    $scope.seafreightItem.OriginBusinessUnitId = $scope.businessUnitDataDefinition.DataItem.Id;
                                    $scope.seafreightItem.BusinessUnit1.Name = $scope.businessUnitDataDefinition.DataItem.Name;
                                    break;
                            case 'destination':
                                    $scope.seafreightItem.DestinationBusinessUnitId = $scope.businessUnitDataDefinition.DataItem.Id;
                                    $scope.seafreightItem.BusinessUnit.Name = $scope.businessUnitDataDefinition.DataItem.Name;
                                    break;
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
            var html = '<dir-data-grid2 datadefinition      = "businessUnitDataDefinition"' +
                                        'submitdefinition   = "businessUnitSubmitDefinition"' +
                                        'otheractions       = "businessUnitOtherActions(action)">' +
                        '</dir-data-grid2>';
            $content = angular.element(document.querySelector('#businessUnitContainer')).html(html);
            $compile($content)($scope);
        };
        //=================================================END OF BUSINESS UNIT MODAL=================================================
        
        //=================================================START OF SHIPPINGLINE MODAL=================================================
        //Load shippingline filtering for compiling
        $scope.loadShippingLineFiltering = function () {
            $scope.initShippingLineFilteringParameters();
            $scope.initShippingLineFilteringContainter();
        };

        //initialize shippingline filtering parameters
        $scope.initShippingLineFilteringContainter = function () {
            html = '<dir-filtering  filterdefinition="shippingLineFilteringDefinition"' +
                                    'filterlistener="shippingLineDataDefinition.Retrieve"' +
                                    'otheractions="shippingLineOtherActionsFiltering(action)"' +
                   '</dir-filtering>';
            $content = angular.element(document.querySelector('#shippingLineFilterContainter')).html(html);
            $compile($content)($scope);
        };

        //function that will be called during compiling of shippingline filtering to DOM
        $scope.initShippingLineFilteringParameters = function () {
            $scope.initShippingLineFilteringDefinition = function () {
                $scope.shippingLineFilteringDefinition = {
                    "Url": ($scope.shippingLineDataDefinition.EnablePagination == true ? 'api/ShippingLines?type=paginate&param1=' + $scope.shippingLineDataDefinition.CurrentPage : 'api/ShippingLines?type=scroll&param1=' + $scope.shippingLineDataDefinition.DataList.length),//Url for retrieve
                    "DataList": [], //Contains the data retrieved based on the criteria
                    "DataItem1": $scope.DataItem1, //Contains the parameter value index
                    "Source": [
                                { "Index": 0, "Label": "Name", "Column": "Name", "Values": [], "From": null, "To": null, "Type": "Default" }
                    ],//Contains the Criteria definition
                    "Multiple": false,
                    "AutoLoad": false,
                    "ClearData": false,
                    "SetSourceToNull": false
                }
            };

            $scope.shippingLineOtherActionsFiltering = function (action) {
                switch (action) {
                    //Initialize DataItem1 and DataItem2 for data filtering
                    case 'PreFilterData':
                        $scope.shippingLineSource = $scope.shippingLineFilteringDefinition.Source;
                        //Optional in using this, can use switch if every source type has validation before filtering
                        for (var i = 0; i < $scope.shippingLineSource.length; i++) {
                            if ($scope.shippingLineSource[i].Type == "Date") {
                                $scope.shippingLineFilteringDefinition.DataItem1.ShippingLine[0][$scope.shippingLineSource[i].Column] = $scope.shippingLineSource[i].From;
                                $scope.shippingLineFilteringDefinition.DataItem1.ShippingLine[1][$scope.shippingLineSource[i].Column] = $scope.shippingLineSource[i].To;
                            }
                            else
                                $scope.shippingLineFilteringDefinition.DataItem1.ShippingLine[0][$scope.shippingLineSource[i].Column] = $scope.shippingLineSource[i].From;
                        }

                        //Delete keys that the value is null
                        for (var i = 0; i < $scope.shippingLineSource.length; i++) {
                            if ($scope.shippingLineFilteringDefinition.DataItem1.ShippingLine[0][$scope.shippingLineSource[i].Column] == null) {
                                delete $scope.shippingLineFilteringDefinition.DataItem1.ShippingLine[0][$scope.shippingLineSource[i].Column];
                                delete $scope.shippingLineFilteringDefinition.DataItem1.ShippingLine[1][$scope.shippingLineSource[i].Column];
                            }
                        }

                        if ($scope.shippingLineDataDefinition.EnablePagination == true && $scope.shippingLineFilteringDefinition.ClearData) {
                            $scope.shippingLineDataDefinition.CurrentPage = 1;
                            $scope.shippingLineFilteringDefinition.Url = 'api/ShippingLines?type=paginate&param1=' + $scope.shippingLineDataDefinition.CurrentPage;
                        }
                        else if ($scope.shippingLineDataDefinition.EnablePagination == true) {
                            $scope.shippingLineDataDefinition.DataList = [];
                            $scope.shippingLineFilteringDefinition.Url = 'api/ShippingLines?type=paginate&param1=' + $scope.shippingLineDataDefinition.CurrentPage;
                        }
                            //Scroll
                        else {
                            if ($scope.shippingLineFilteringDefinition.ClearData)
                                $scope.shippingLineDataDefinition.DataList = [];
                            $scope.shippingLineFilteringDefinition.Url = 'api/ShippingLines?type=scroll&param1=' + $scope.shippingLineDataDefinition.DataList.length;
                        }
                        return true;
                    case 'PostFilterData':
                        /*Note: if pagination, initialize shippingLineDataDefinition DataList by copying the DataList of filterDefinition then 
                                set DoPagination to true
                          if scroll, initialize shippingLineDataDefinition DataList by pushing each value of filterDefinition DataList*/
                        //Required
                        //$scope.shippingLineFilteringDefinition.DataList = $rootScope.formatCustomer($scope.shippingLineFilteringDefinition.DataList);
                        if ($scope.shippingLineDataDefinition.EnableScroll == true) {
                            for (var j = 0; j < $scope.shippingLineFilteringDefinition.DataList.length; j++)
                                $scope.shippingLineDataDefinition.DataList.push($scope.shippingLineFilteringDefinition.DataList[j]);
                        }

                        if ($scope.shippingLineDataDefinition.EnablePagination == true) {
                            $scope.shippingLineDataDefinition.DataList = [];
                            $scope.shippingLineDataDefinition.DataList = $scope.shippingLineFilteringDefinition.DataList;
                            $scope.shippingLineDataDefinition.DoPagination = true;
                        }
                        return true;
                    default: return true;
                }
            };

            $scope.initShippingLineDataItems = function () {
                $scope.shippingLineFilteringDefinition.DataItem1 = angular.copy($scope.shippingLineObj());
            };

            $scope.initShippingLineFilteringDefinition();
            $scope.initShippingLineDataItems();
        };

        //Load shippingLine datagrid for compiling
        $scope.loadShippingLineDataGrid = function () {
            $scope.initShippingLineDataGrid();
            $scope.compileShippingLineDataGrid();
        };
        
        //initialize shippingLine datagrid parameters
        $scope.initShippingLineDataGrid = function () {
            $scope.shippingLineSubmitDefinition = undefined;
            $scope.initializeShippingLineDataDefinition = function () {
                $scope.shippingLineDataDefinition = {
                    "Header": ['Name', 'No.'],
                    "Keys": ['Name'],
                    "Type": ['ProperCase'],
                    "ColWidth": [250],
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
                $scope.shippingLineDataDefinition.RowTemplate = '<div>' +
                                                                    ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                                                                  '</div>';
            };
            $scope.shippingLineOtherActions = function (action) {
                switch (action) {
                    case 'PostEditAction':
                        $scope.seafreightItem.VesselVoyage.ShippingLineId = $scope.shippingLineDataDefinition.DataItem.Id;
                        $scope.seafreightItem.VesselVoyage.ShippingLineName = $scope.shippingLineDataDefinition.DataItem.Name;
                        $scope.closeModal();
                        var promise = $interval(function () {
                            $interval.cancel(promise);
                            promise = undefined;
                            $scope.showModal('#vessels-list-modal', 'vessel');
                        }, 500);
                        return true;
                    default: return true;
                }
            };

            $scope.initializeShippingLineDataDefinition();
        };
        
        //function that will be invoked during compiling of shippingLine datagrid to DOM
        $scope.compileShippingLineDataGrid = function () {
            var html = '<dir-data-grid2 datadefinition      = "shippingLineDataDefinition"' +
                                        'submitdefinition   = "shippingLineSubmitDefinition"' +
                                        'otheractions       = "shippingLineOtherActions(action)">' +
                        '</dir-data-grid2>';
            $content = angular.element(document.querySelector('#shippingLineContainer')).html(html);
            $compile($content)($scope);
        };
        //=================================================END OF SHIPPINGLINE MODAL=================================================

        //=================================================START OF VESSEL MODAL=================================================
        //Load vessel filtering for compiling
        $scope.loadVesselFiltering = function () {
            $scope.initVesselFilteringParameters();
            $scope.initVesselFilteringContainter();
        };

        //initialize shippingline filtering parameters
        $scope.initVesselFilteringContainter = function () {
            html = '<dir-filtering  filterdefinition="vesselFilteringDefinition"' +
                                    'filterlistener="vesselDataDefinition.Retrieve"' +
                                    'otheractions="vesselOtherActionsFiltering(action)"' +
                   '</dir-filtering>';
            $content = angular.element(document.querySelector('#vesselFilterContainter')).html(html);
            $compile($content)($scope);
        };

        //function that will be called during compiling of shippingline filtering to DOM
        $scope.initVesselFilteringParameters = function () {
            $scope.initVesselFilteringDefinition = function () {
                $scope.vesselFilteringDefinition = {
                    "Url": ($scope.vesselDataDefinition.EnablePagination == true ? 'api/Vessels?type=paginate&param1=' + $scope.vesselDataDefinition.CurrentPage : 'api/Vessels?type=scroll&param1=' + $scope.vesselDataDefinition.DataList.length),//Url for retrieve
                    "DataList": [], //Contains the data retrieved based on the criteria
                    "DataItem1": $scope.DataItem1, //Contains the parameter value index
                    "Source": [
                                { "Index": 0, "Label": "Name", "Column": "Name", "Values": [], "From": null, "To": null, "Type": "Default" }
                    ],//Contains the Criteria definition
                    "Multiple": false,
                    "AutoLoad": false,
                    "ClearData": false,
                    "SetSourceToNull": false
                }
            };

            $scope.vesselOtherActionsFiltering = function (action) {
                switch (action) {
                    //Initialize DataItem1 and DataItem2 for data filtering
                    case 'PreFilterData':
                        $scope.vesselSource = $scope.vesselFilteringDefinition.Source;
                        //Optional in using this, can use switch if every source type has validation before filtering
                        for (var i = 0; i < $scope.vesselSource.length; i++) {
                            if ($scope.vesselSource[i].Type == "Date") {
                                $scope.vesselFilteringDefinition.DataItem1.Vessel[0][$scope.vesselSource[i].Column] = $scope.vesselSource[i].From;
                                $scope.vesselFilteringDefinition.DataItem1.Vessel[1][$scope.vesselSource[i].Column] = $scope.vesselSource[i].To;
                            }
                            else
                                $scope.vesselFilteringDefinition.DataItem1.Vessel[0][$scope.vesselSource[i].Column] = $scope.vesselSource[i].From;
                        }

                        //Delete keys that the value is null
                        for (var i = 0; i < $scope.vesselSource.length; i++) {
                            if ($scope.vesselFilteringDefinition.DataItem1.Vessel[0][$scope.vesselSource[i].Column] == null) {
                                delete $scope.vesselFilteringDefinition.DataItem1.Vessel[0][$scope.vesselSource[i].Column];
                                delete $scope.vesselFilteringDefinition.DataItem1.Vessel[1][$scope.vesselSource[i].Column];
                            }
                        }

                        if ($scope.vesselDataDefinition.EnablePagination == true && $scope.vesselFilteringDefinition.ClearData) {
                            $scope.vesselDataDefinition.CurrentPage = 1;
                            $scope.vesselFilteringDefinition.Url = 'api/Vessels?type=paginate&param1=' + $scope.vesselDataDefinition.CurrentPage;
                        }
                        else if ($scope.vesselDataDefinition.EnablePagination == true) {
                            $scope.vesselDataDefinition.DataList = [];
                            $scope.vesselFilteringDefinition.Url = 'api/Vessels?type=paginate&param1=' + $scope.vesselDataDefinition.CurrentPage;
                        }
                            //Scroll
                        else {
                            if ($scope.vesselFilteringDefinition.ClearData)
                                $scope.vesselDataDefinition.DataList = [];
                            $scope.vesselFilteringDefinition.Url = 'api/Vessels?type=scroll&param1=' + $scope.vesselDataDefinition.DataList.length;
                        }

                        $scope.vesselFilteringDefinition.DataItem1.Vessel[0].ShippingLineId = $scope.seafreightItem.VesselVoyage.ShippingLineId;

                        return true;
                    case 'PostFilterData':
                        /*Note: if pagination, initialize vesselDataDefinition DataList by copying the DataList of filterDefinition then 
                                set DoPagination to true
                          if scroll, initialize vesselDataDefinition DataList by pushing each value of filterDefinition DataList*/
                        //Required
                        //$scope.vesselFilteringDefinition.DataList = $rootScope.formatCustomer($scope.vesselFilteringDefinition.DataList);
                        if ($scope.vesselDataDefinition.EnableScroll == true) {
                            for (var j = 0; j < $scope.vesselFilteringDefinition.DataList.length; j++)
                                $scope.vesselDataDefinition.DataList.push($scope.vesselFilteringDefinition.DataList[j]);
                        }

                        if ($scope.vesselDataDefinition.EnablePagination == true) {
                            $scope.vesselDataDefinition.DataList = [];
                            $scope.vesselDataDefinition.DataList = $scope.vesselFilteringDefinition.DataList;
                            $scope.vesselDataDefinition.DoPagination = true;
                        }
                        return true;
                    default: return true;
                }
            };

            $scope.initVesselDataItems = function () {
                $scope.vesselFilteringDefinition.DataItem1 = angular.copy($scope.vesselObj());
            };

            $scope.initVesselFilteringDefinition();
            $scope.initVesselDataItems();
        };

        //Load vessel datagrid for compiling
        $scope.loadVesselDataGrid = function () {
            $scope.initVesselDataGrid();
            $scope.compileVesselDataGrid();
        };

        //initialize vessel datagrid parameters
        $scope.initVesselDataGrid = function () {
            $scope.vesselSubmitDefinition = undefined;
            $scope.initializeVesselDataDefinition = function () {
                $scope.vesselDataDefinition = {
                    "Header": ['Name', 'No.'],
                    "Keys": ['Name'],
                    "Type": ['ProperCase'],
                    "ColWidth": [250],
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
                $scope.vesselDataDefinition.RowTemplate = '<div>' +
                                                                    ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.actionForm(' + "'Edit'" + ')"></div>' +
                                                                  '</div>';
            };
            $scope.vesselOtherActions = function (action) {
                switch (action) {
                    case 'PostEditAction':
                        $scope.seafreightItem.VesselVoyage.VesselId = $scope.vesselDataDefinition.DataItem.Id;
                        $scope.seafreightItem.VesselVoyage.VesselName = $scope.vesselDataDefinition.DataItem.Name;
                        $scope.closeModal();
                        var promise = $interval(function () {
                            $interval.cancel(promise);
                            promise = undefined;
                            $scope.showModal('#vessels-list-modal', 'vessel');
                        }, 500);
                        return true;
                    default: return true;
                }
            };

            $scope.initializeVesselDataDefinition();
        };

        //function that will be invoked during compiling of vessel datagrid to DOM
        $scope.compileVesselDataGrid = function () {
            var html = '<dir-data-grid2 datadefinition      = "vesselDataDefinition"' +
                                        'submitdefinition   = "vesselSubmitDefinition"' +
                                        'otheractions       = "vesselOtherActions(action)">' +
                        '</dir-data-grid2>';
            $content = angular.element(document.querySelector('#vesselContainer')).html(html);
            $compile($content)($scope);
        };
        



        
        //=================================================END OF VESSEL MODAL=================================================









        //Show Shippingline's vessels List
        $scope.showVessels = function (shippingLineId) {
            var spinner = new Spinner(opts).spin(spinnerTarget);
            $http.get("/api/Vessels?shippingLineId=" + shippingLineId)
           .success(function (data, status) {
               $scope.vesselList = [];
               $scope.vesselList = data;
               spinner.stop();
               $scope.showModal('#vessels-list-modal', $scope.modalType);
           })
           .error(function (error, status) {
               $scope.isError = true;
               $scope.errorMessage = status;
               spinner.stop();
           });
        };
        
        //Show Shippingline's vessel's vesselvoyages List
        $scope.showVesselVoyages = function (vesselId) {
            var spinner = new Spinner(opts).spin(spinnerTarget);
            $http.get("/api/VesselVoyages?vesselId=" + vesselId)
           .success(function (data, status) {
               $scope.vesselVoyageList = [];
               $scope.vesselVoyageList = data;
               spinner.stop();
               $scope.showModal('#vesselVoyages-list-modal', $scope.modalType);
           })
           .error(function (error, status) {
               $scope.isError = true;
               $scope.errorMessage = status;
               spinner.stop();
           });
        };

        //Close Origin Business Unit List Modal
        $scope.closeOriginBusinessUnitList = function (bu) {
            if (angular.isDefined(bu)) {
                $scope.seafreightItem.OriginBusinessUnitId = bu.Id;
                $scope.seafreightItem.BusinessUnit1.Name = bu.Name;
            }
            else
                $scope.seafreightItem.OriginBusinessUnitId = null;
            jQuery.magnificPopup.close();
        };

        //Close Destination Business Unit List Modal
        $scope.closeDestinationBusinessUnitList = function (bu) {
            if (angular.isDefined(bu)) {
                $scope.seafreightItem.DestinationBusinessUnitId = bu.Id;
                $scope.seafreightItem.BusinessUnit.Name = bu.Name;
            }
            else
                $scope.seafreightItem.DestinationBusinessUnitId = null;
            jQuery.magnificPopup.close();
        };

        //Close Shippingline List Modal
        $scope.closeShippinglineList = function (s) {
            if (angular.isDefined(s)) {
                $scope.seafreightItem.VesselVoyage.Vessel.ShippingLineId = s.Id;
                $scope.seafreightItem.VesselVoyage.Vessel.ShippingLine.Name = s.Name;
            }
            else
                $scope.seafreightItem.VesselVoyage.Vessel.ShippingLineId = null;
            jQuery.magnificPopup.close();
            var promise = $interval(function () {
                $interval.cancel(promise);
                promise = undefined;
                $scope.showVessels(s.Id);
            }, 500);
        };

        //Close Vessel List Modal
        $scope.closeVesselList = function (v) {
            if (angular.isDefined(v)) {
                $scope.seafreightItem.VesselVoyage.VesselId = v.Id;
                $scope.seafreightItem.VesselVoyage.Vessel.Name = v.Name;
            }
            else
                $scope.seafreightItem.VesselVoyage.VesselId = null;
            jQuery.magnificPopup.close();
            var promise = $interval(function () {
                $interval.cancel(promise);
                promise = undefined;
                $scope.showVesselVoyages(v.Id);
            }, 500);
        };

        //Close Vessel Voyage List Modal
        $scope.closeVesselVoyageList = function (vv) {
            if (angular.isDefined(vv)) {
                $scope.seafreightItem.VesselVoyageId = vv.Id;
                //retrieve origin business unit name
                $scope.seafreightItem.VesselVoyage.OriginBusinessUnitId = vv.OriginBusinessUnitId;
                $scope.OriginBusinessUnit = [];
                for (var i = 0; i < $scope.vesselVoyageList.length; i++) {
                    //Retrieve Origin Business Unit information per vessel Voyage

                    var url = '/api/BusinessUnits?businessUnitId=' + $scope.seafreightItem.VesselVoyage.OriginBusinessUnitId;
                   
                    $http.get(url)
                    .success(function (data1, status) {
                        $scope.OriginBusinessUnit.push(data1);
                    })
                    .error(function (error, status) {
                        spinner.stop();
                    })
                };
                //Initialize Origin Business Unit information per vessel Voyage
                var promise = $interval(function () {
                    if ($scope.OriginBusinessUnit.length == $scope.vesselVoyageList.length) {
                        for (var i = 0; i < $scope.OriginBusinessUnit.length; i++)
                            $scope.seafreightItem.VesselVoyage.OriginBusinessUnit.Name = angular.copy($scope.OriginBusinessUnit.Name);
                        $interval.cancel(promise);
                        promise = undefined;
                    }
                }, 100);
                //retrieve destination business unit name
                $scope.seafreightItem.VesselVoyage.DestinationBusinessUnitId = vv.DestinationBusinessUnitId;
                $scope.DestinationBusinessUnit = [];
                for (var i = 0; i < $scope.vesselVoyageList.length; i++) {
                    //Retrieve Destination Business Unit information per vessel Voyage

                    var url = '/api/BusinessUnits?businessUnitId=' + $scope.seafreightItem.VesselVoyage.DestinationBusinessUnitId;

                    $http.get(url)
                    .success(function (data1, status) {
                        $scope.DestinationBusinessUnit.push(data1);
                    })
                    .error(function (error, status) {
                        spinner.stop();
                    })
                };
                //Initialize Destination Business Unit information per vessel Voyage
                var promise = $interval(function () {
                    if ($scope.DestinationBusinessUnit.length == $scope.vesselVoyageList.length) {
                        for (var i = 0; i < $scope.DestinationBusinessUnit.length; i++)
                            $scope.seafreightItem.VesselVoyage.DestinationBusinessUnit.Name = angular.copy($scope.DestinationBusinessUnit.Name);
                        $interval.cancel(promise);
                        promise = undefined;
                    }
                }, 100);
                $scope.seafreightItem.VesselVoyage.DepartureDate = vv.DepartureDate;
                $scope.seafreightItem.VesselVoyage.DepartureTime = vv.DepartureTime;
                $scope.seafreightItem.VesselVoyage.ArrivalDate = vv.ArrivalDate;
                $scope.seafreightItem.VesselVoyage.ArrivalTime = vv.ArrivalTime;
            }
            else
                $scope.seafreightItem.VesselVoyageId = null;
            jQuery.magnificPopup.close();
        };
        
        //Close Shipment List Modal
        $scope.closeShipmentList = function (Id) {
            $scope.index = $scope.searchShipment(Id);
            $scope.SeaFreightShipmentGridOptions.data[$scope.ShipmentRow].ShipmentId = $scope.ShipmentList[$scope.index].Id;
            $scope.SeaFreightShipmentGridOptions.data[$scope.ShipmentRow].Shipment.ShipmentType.Name = $scope.ShipmentList[$scope.index].ShipmentType.Name;
            $scope.SeaFreightShipmentGridOptions.data[$scope.ShipmentRow].Shipment.Customer.Name = $scope.ShipmentList[$scope.index].Customer.Name;
            $scope.SeaFreightShipmentGridOptions.data[$scope.ShipmentRow].Shipment.Description = $scope.ShipmentList[$scope.index].Description;
            $scope.SeaFreightShipmentGridOptions.data[$scope.ShipmentRow].Shipment.Quantity = $scope.ShipmentList[$scope.index].Quantity;
            $scope.SeaFreightShipmentGridOptions.data[$scope.ShipmentRow].Shipment.TotalCBM = $scope.ShipmentList[$scope.index].TotalCBM;
            $scope.SeaFreightShipmentGridOptions.data[$scope.ShipmentRow].Shipment.DeliverTo = $scope.ShipmentList[$scope.index].DeliverTo;
            
            jQuery.magnificPopup.close();
        };

        //Initialize Business Unit List for Modal
        $scope.initBusinessUnitList = function () {
            $http.get("/api/BusinessUnits")
            .success(function (data, status) {
                $scope.businessUnitList = data;
            })
        };
        
        //Initialize Shippingline List for Modal
        $scope.initShippingLineList = function () {
            $http.get("/api/ShippingLines")
            .success(function (data, status) {
                for (var i = 0; i < 100; i++)
                    $scope.shippingLineList = data;

            })
        };

        //Initialize Shipment List for Modal
        $scope.initShipmentList = function () {
            $http.get("/api/Shipments?page=1")
            .success(function (data, status) {
                $scope.ShipmentList = data;
            })
        };

        //Initialized seafreight item to it's default value
        $scope.initializeseafreightItem = function () {
            $scope.seafreightItem = {
                "Id": null,
                "BLNumber": null,
                "BLDate": null,
                "VesselVoyageId": null,
                "VesselVoyage": {
                    "Id": null,
                    "VesselId": null,
                    "VesselName": null,
                    "ShippingLineId": null,
                    "ShippingLineName": null,
                    //"Vessel": {
                    //    "Id": null,
                    //    "Name": null,
                    //    "ShippingLineId": null,
                    //    "ShippingLine": {
                    //        "Id": null,
                    //        "Name": null
                    //        //"CreatedDate": null,
                    //        //"LastUpdatedDate": null,
                    //        //"CreatedByUserId": null,
                    //        //"LastUpdatedByUserId": null
                    //    }
                    //    //"CreatedDate": null,
                    //    //"LastUpdatedDate": null,
                    //    //"CreatedByUserId": null,
                    //    //"LastUpdatedByUserId": null
                    //},
                    "VoyageNo": null,
                    "EstimatedDepartureDate": null,
                    "EstimatedDepartureTime": null,
                    "EstimatedArrivalDate": null,
                    "EstimatedArrivalTime": null,
                    "OriginBusinessUnitId": null,
                    "OriginBusinessUnit": {
                        "Id": null,
                        "Code": null,
                        "Name": null
                        //"BusinessUnitTypeId": null,
                        //"ParentBusinessUnitId": null,
                        //"isOperatingSite": null,
                        //"hasAirPort": null,
                        //"hasSeaPort": null,
                        //"CreatedDate": null,
                        //"LastUpdatedDate": null,
                        //"CreatedByUserId": null,
                        //"LastUpdatedByUserId": null
                    },
                    "DestinationBusinessUnitId": null,
                    "DestinationBusinessUnit": {
                        "Id": null,
                        "Code": null,
                        "Name": null
                        //"BusinessUnitTypeId": null,
                        //"ParentBusinessUnitId": null,
                        //"isOperatingSite": null,
                        //"hasAirPort": null,
                        //"hasSeaPort": null,
                        //"CreatedDate": null,
                        //"LastUpdatedDate": null,
                        //"CreatedByUserId": null,
                        //"LastUpdatedByUserId": null
                    },
                    "DepartureDate": null,
                    "DepartureTime": null,
                    "ArrivalDate": null,
                    "ArrivalTime": null
                    //"CreatedDate": null,
                    //"LastUpdatedDate": null,
                    //"CreatedByUserId": null,
                    //"LastUpdatedByUserId": null
                },
                "OriginBusinessUnitId": null,
                "BusinessUnit1": {
                    "Id": null,
                    "Code": null,
                    "Name": null
                    //"BusinessUnitTypeId": null,
                    //"ParentBusinessUnitId": null,
                    //"isOperatingSite": null,
                    //"hasAirPort": null,
                    //"hasSeaPort": null,
                    //"CreatedDate": null,
                    //"LastUpdatedDate": null,
                    //"CreatedByUserId": null,
                    //"LastUpdatedByUserId": null
                },
                "DestinationBusinessUnitId": null,
                "BusinessUnit": {
                    "Id": null,
                    "Code": null,
                    "Name": null
                    //"BusinessUnitTypeId": null,
                    //"ParentBusinessUnitId": null,
                    //"isOperatingSite": null,
                    //"hasAirPort": null,
                    //"hasSeaPort": null,
                    //"CreatedDate": null,
                    //"LastUpdatedDate": null,
                    //"CreatedByUserId": null,
                    //"LastUpdatedByUserId": null
                },
                "FreightCost": null,
                "CreatedDate": null,
                "LastUpdatedDate": null,
                "CreatedByUserId": null,
                "LastUpdatedByUserId": null
            };

        };

        //Load variable datagrid for compiling
        $scope.loadSeaFreightDataGrid = function () {
            $scope.initSeaFreightDataGrid();
            $scope.compileSeaFreightDataGrid();
        };

        //initialized seafreight data grid
        $scope.initSeaFreightDataGrid = function () {
            $scope.initSeaFreightDataDefinition = function () {
                $scope.seaFreightDataDefinition = {
                    "Header": ['Sea Freight No', 'BL Number', 'BL Date', 'Voyage No', 'Origin', 'Destination', 'Freight Cost', 'No'],
                    "Keys": ['Id', 'BLNumber', 'BLDate', 'VesselVoyage[0].VoyageNo', 'BusinessUnit1[0].Name', 'BusinessUnit[0].Name', 'FreightCost'],
                    "Type": ['ControlNo', 'ProperCase', 'Date', 'ProperCase', 'ProperCase', 'ProperCase', 'Decimal'],
                    "ColWidth": [150, 150, 150, 150, 180, 180, 150],
                    "DataList": [],
                    "RequiredFields": ['BLNumber-BL Number', 'BLDate-BL Date', 'VesselVoyageId-Voyage ID', 'OriginBusinessUnitId-Origin Business Unit', 'DestinationBusinessUnitId-Destination Business Unit', 'FreightCost-Freight Cost'],
                    "CellTemplate": ["None"],
                    "RowTemplate": "Default",
                    "EnableScroll": true,
                    "EnablePagination": false,
                    "CurrentPage": 1,//By default
                    "PageSize": 20, //Should be the same in back-end
                    "DoPagination": false, //By default
                    "Retrieve": false, //By default
                    "DataItem": {},
                    "DataTarget": "ShipmentMenu",
                    "ShowCreate": true,
                    "ShowContextMenu": true,
                    "ContextMenu": ["'Load'", "'Create'", "'Edit'", "'Delete'", "'View'", "'Find'", "'Clear'"],
                    "ContextMenuLabel": ['Reload', 'Create', 'Edit', 'Cancel', 'View', 'Find', 'Clear']
                }
            };

            $scope.initSeaFreightSubmitDefinition = function () {
                $scope.seaFreightSubmitDefinition = {
                    "Submit": false, //By default
                    "APIUrl": '/api/SeaFreights',
                    "Type": 'Create', //By Default
                    "DataItem": {},
                    "Index": -1 //By Default
                }
            };

            $scope.seaFreightOtheractions = function (action) {
                switch (action) {
                    case "FormCreate":
                        return true;
                    case "PreAction":
                        return true;
                    case "PostCreateAction":
                        return true;
                    case "PostEditAction":
                        return true;
                    case "PostDeleteAction":
                        return true;
                    case "PostViewAction":
                        return true;
                    case "PreSubmit":
                        return true;
                    case "PreSave":
                        return true;
                    case "PostSave":
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
                        $scope.selectedTab = $scope.tabPages[1];
                        var promise = $interval(function () {
                            if ($scope.seaFreightToggle == false) {
                                $("#seaFreightToggle").slideToggle(function () {
                                    $scope.seaFreightToggle = true;
                                });
                            }
                            $interval.cancel(promise);
                            promise = undefined;
                        }, 200);
                        return true;
                    case "Clear":
                        $scope.seaFreightDataDefinition.DataList = [];
                        //Required if pagination is enabled
                        if ($scope.seaFreightDataDefinition.EnablePagination == true) {
                            $scope.seaFreightDataDefinition.CurrentPage = 1;
                            $scope.seaFreightDataDefinition.DoPagination = true;
                        }
                        return true;
                    default: return true;
                }
            };

            $scope.seaFreightShowFormError = function (error) {
                $scope.seaFreightIsError = true;
                $scope.seaFreightErrorMessage = error;
            };

            $scope.initSeaFreightDataDefinition();
            $scope.initSeaFreightSubmitDefinition();
        };

        //function that will be invoked during compiling of SeaFreight datagrid to DOM
        $scope.compileSeaFreightDataGrid = function () {
            var html = '<dir-data-grid2 datadefinition      = "seaFreightDataDefinition"' +
                                        'submitdefinition   = "seaFreightSubmitDefinition"' +
                                        'otheractions       = "seaFreightOtheractions(action)"' +
                                        'resetdata          = "initializeseafreightItem()"' +
                                        'showformerror      = "seaFreightShowFormError(error)">' +
                        '</dir-data-grid2>';
            $content = angular.element(document.querySelector('#seaFreightContainer')).html(html);
            $compile($content)($scope);
        };
        
        //Load SeaFreight filtering for compiling
        $scope.loadSeaFreightFiltering = function () {
            $scope.initSeaFreightFilteringParameters();
            $scope.initSeaFreightFilteringContainter();
            $("#seaFreightToggle").slideToggle(function () { });
        };
        
        //initialize SeaFreight filtering parameters
        $scope.initSeaFreightFilteringContainter = function () {
            html = '<dir-filtering  filterdefinition="seaFreightFilteringDefinition"' +
                                    'filterlistener="seaFreightDataDefinition.Retrieve"' +
                                    'otheractions="seaFreightOtherActionsFiltering(action)"' +
                   '</dir-filtering>';
            $content = angular.element(document.querySelector('#seaFreightFilterContainter')).html(html);
            $compile($content)($scope);
        };
        
        //function that will be called during compiling of SeaFreight filtering to DOM
        $scope.initSeaFreightFilteringParameters = function () {
            //Hide the SeaFreight filtering directive
            $scope.hideSeaFreightToggle = function () {
                var promise = $interval(function () {
                    $("#seaFreightToggle").slideToggle(function () {
                        $scope.seaFreightToggle = false;
                    });
                    $interval.cancel(promise);
                    promise = undefined;
                }, 200)
            };
            $scope.initSeaFreightFilteringDefinition = function () {
                $scope.seaFreightFilteringDefinition = {
                    "Url": ($scope.seaFreightDataDefinition.EnablePagination == true ? 'api/SeaFreights?type=paginate&param1=' + $scope.seaFreightDataDefinition.CurrentPage : 'api/SeaFreights?type=scroll&param1=' + $scope.seaFreightDataDefinition.DataList.length),//Url for retrieve
                    "DataList": [], //Contains the data retrieved based on the criteria
                    "DataItem1": $scope.DataItem1, //Contains the parameter value
                    "Source": [
                                { "Index": 0, "Label": "Sea Freight No", "Column": "Id", "Values": [], "From": null, "To": null, "Type": "Default" },
                                { "Index": 1, "Label": "Bill of Lading Date", "Column": "BLDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                                { "Index": 2, "Label": "Origin", "Column": "OriginBusinessUnitId", "Values": ['GetBusinessList'], "From": null, "To": null, "Type": "Modal" },
                                { "Index": 3, "Label": "Destination", "Column": "DestinationBusinessUnitId", "Values": ['GetBusinessList'], "From": null, "To": null, "Type": "Modal" },
                                { "Index": 4, "Label": "Created Date", "Column": "CreatedDate", "Values": [], "From": null, "To": null, "Type": "Date" },
                                { "Index": 5, "Label": "Last Updated Date", "Column": "LastUpdatedDate", "Values": [], "From": null, "To": null, "Type": "Date" }
                    ],//Contains the Criteria definition
                    "Multiple": true,
                    "AutoLoad": false,
                    "ClearData": false,
                    "SetSourceToNull": false
                }
            };

            $scope.seaFreightOtherActionsFiltering = function (action) {
                switch (action) {
                    //Initialize DataItem1 and DataItem2 for data filtering
                    case 'PreFilterData':
                        $scope.selectedTab = $scope.tabPages[1];
                        $scope.seaFreightSource = $scope.seaFreightFilteringDefinition.Source;
                        //Optional in using this, can use switch if every source type has validation before filtering

                        for (var i = 0; i < $scope.seaFreightSource.length; i++) {
                            if ($scope.seaFreightSource[i].Type == "Date") {
                                $scope.seaFreightFilteringDefinition.DataItem1.SeaFreight[0][$scope.seaFreightSource[i].Column] = $scope.seaFreightSource[i].From;
                                $scope.seaFreightFilteringDefinition.DataItem1.SeaFreight[1][$scope.seaFreightSource[i].Column] = $scope.seaFreightSource[i].To;
                            }
                            else
                                $scope.seaFreightFilteringDefinition.DataItem1.SeaFreight[0][$scope.seaFreightSource[i].Column] = $scope.seaFreightSource[i].From;
                        }
                        //Delete keys that the value is null
                        for (var i = 0; i < $scope.seaFreightSource.length; i++) {
                            if ($scope.seaFreightFilteringDefinition.DataItem1.SeaFreight[0][$scope.seaFreightSource[i].Column] == null) {
                                delete $scope.seaFreightFilteringDefinition.DataItem1.SeaFreight[0][$scope.seaFreightSource[i].Column];
                                delete $scope.seaFreightFilteringDefinition.DataItem1.SeaFreight[1][$scope.seaFreightSource[i].Column];
                            }
                        }

                        if ($scope.seaFreightDataDefinition.EnablePagination == true && $scope.seaFreightFilteringDefinition.ClearData) {
                            $scope.seaFreightDataDefinition.CurrentPage = 1;
                            $scope.seaFreightFilteringDefinition.Url = 'api/SeaFreights?type=paginate&param1=' + $scope.seaFreightDataDefinition.CurrentPage;
                        }
                        else if ($scope.seaFreightDataDefinition.EnablePagination == true) {
                            $scope.seaFreightDataDefinition.DataList = [];
                            $scope.seaFreightFilteringDefinition.Url = 'api/SeaFreights?type=paginate&param1=' + $scope.seaFreightDataDefinition.CurrentPage;
                        }
                            //Scroll
                        else {
                            if ($scope.seaFreightFilteringDefinition.ClearData)
                                $scope.seaFreightDataDefinition.DataList = [];
                            $scope.seaFreightFilteringDefinition.Url = 'api/SeaFreights?type=scroll&param1=' + $scope.seaFreightDataDefinition.DataList.length;
                        }
                        return true;
                    case 'PostFilterData':
                        /*Note: if pagination, initialize SeaFreightDataDefinition DataList by copying the DataList of filterDefinition then 
                                set DoPagination to true
                          if scroll, initialize SeaFreightDataDefinition DataList by pushing each value of filterDefinition DataList*/
                        //Required
                        $scope.seaFreightFilteringDefinition.DataList = $scope.seaFreightFilteringDefinition.DataList;
                       
                        if ($scope.seaFreightDataDefinition.EnableScroll == true) {
                            for (var j = 0; j < $scope.seaFreightFilteringDefinition.DataList.length; j++)
                                $scope.seaFreightDataDefinition.DataList.push($scope.seaFreightFilteringDefinition.DataList[j]);
                        }

                        if ($scope.seaFreightDataDefinition.EnablePagination == true) {
                            $scope.seaFreightDataDefinition.DataList = [];
                            $scope.seaFreightDataDefinition.DataList = $scope.seaFreightFilteringDefinition.DataList;
                            $scope.seaFreightDataDefinition.DoPagination = true;
                        }
                        if ($scope.seaFreightToggle == true)
                            $scope.hideSeaFreightToggle();
                        return true;
                    case 'GetBusinessList':
                        //Show modal here then after user choose a specific data to filter pass the to From field in the source where Values[0] is equal to the action, ex. GetBusinessUnitList
                        //Use if filtering criteria is modal
                        return true;
                    default: return true;
                }
            };

            $scope.initSeaFreightDataItems = function () {
                $scope.seaFreightFilteringDefinition.DataItem1 = angular.copy($scope.seaFreightObj());
            };
            $scope.initSeaFreightFilteringDefinition();
            $scope.initSeaFreightDataItems();

        };  

        //Retrieve seafreight's shipments
        $scope.loadDetail = function (seaFreightId) {
            var spinner = new Spinner(opts).spin(spinnerTarget);
            var i = 0;
            $http.get("/api/SeaFreightShipments?seaFreightId=" + seaFreightId+"&page=1")
                .success(function (data, status) {
                    //initialize seafreight shipments
                    $scope.SeaFreightShipmentGridOptions.data = data;

                    //$scope.currentPage = page;
                    //if (page <= 1) {
                    //    $scope.isPrevPage = false;
                    //} else {
                    //    $scope.isPrevPage = true;
                    //}
                    //var rows = data.length;
                    //if (rows < pageSize) {
                    //    $scope.isNextPage = false;
                    //} else {
                    //    $scope.isNextPage = true;
                    //}
                    $scope.focusOnTop();
                    spinner.stop();
                })
                .error(function (data, status) {
                    spinner.stop();
                });
        };
        
        $scope.initDetail = function () {
            $scope.seaFreightShipmentItem = {
                "Id": null,
                "SeaFreightId": -1,
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
                    "DeliverTo": null
                },
                "CostAllocation": null,
                "CreatedDate": null,
                "LastUpdatedDate": null,
                "CreatedByUserId": null,
                "LastUpdatedByUserId": null,
            };
            $scope.SeaFreightShipmentGridOptions.data.push($scope.seaFreightShipmentItem);
        };
        
        //initialized sea freight shipment gridoption
        $scope.initSeaFreightShipmentGridOptions = function () {
            var columns = [];
            $scope.SeaFreightShipmentHeader = ['Shipment No','Shipment Type','Shipper','Shipment Description','Quantity','Total CBM','Consignee','Cost Allocation','No'];
            $scope.SeaFreightShipmentKeys = ['ShipmentId', 'Shipment.ShipmentType.Name', 'Shipment.Customer.Name', 'Shipment.Description', 'Shipment.Quantity', 'Shipment.TotalCBM', 'Shipment.DeliverTo', 'CostAllocation'];
            $scope.KeyType = ['ControlNo','String','String','String','Decimal','Decimal','String','Decimal' ];
            $scope.isEditableCell = [false, false, false, false, false, false, false, true];
            $scope.colWidth = [150, 120, 150, 180, 100, 100, 150, 150];
            $scope.RequiredFields = [];
            //Initialize Number Listing
            var columnProperties = {};
            columnProperties.name = $scope.SeaFreightShipmentHeader[$scope.SeaFreightShipmentHeader.length - 1];
            columnProperties.field = 'No';
            columnProperties.cellTemplate = '<div class="ui-grid-cell-contents text-center">{{row.entity.No = (grid.appScope.currentPage == 1 ? (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) : ((grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.currentPage - 1) * grid.appScope.pageSize)))}}</div>';
            columnProperties.width = 40;
            columnProperties.enableColumnResizing = true;
            columnProperties.enableColumnMenu = false;
            columnProperties.enableColumnMoving = false;
            columnProperties.enableCellEdit = false;
            columns.push(columnProperties);
            //Initialize column data
            for (var i = 0; i < ($scope.SeaFreightShipmentHeader.length - 1) ; i++) {
                var columnProperties = {};
                columnProperties.name = $scope.SeaFreightShipmentHeader[i];
                columnProperties.field = $scope.SeaFreightShipmentKeys[i];
                columnProperties.width = $scope.colWidth[i];
                //check field if editable
                columnProperties.enableCellEdit = $scope.isEditableCell[i];
                //format field value
                columnProperties.cellFilter = $scope.filterValue($scope.KeyType[i]);
                if (i == 0)
                    columnProperties.cellTemplate = '<div class="ui-grid-cell-contents text-center" ng-click="grid.appScope.getShipmentList(row.entity.No)" ></div>';
                columns.push(columnProperties);
            }
            $scope.SeaFreightShipmentGridOptions = {
                data: [],
                columnDefs: columns,
                enableColumnResizing: true,
                rowTemplate: '<div>' +
                    ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell  context-menu="grid.appScope.setSelectedDetail(row.entity.Id)" data-target="DTShipmentDtl" ></div>' +
                    '</div>',
                enableGridMenu: true,
                enableSelectAll: true,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            $scope.initDetail();
        };

        $scope.getShipmentList = function (id) {
            $scope.ShipmentRow = id - 1;
            $scope.initShipmentList();
            openModalPanel("#shipment-list-modal");
        }

        //add an empty row to sea freight shipment detail
        $scope.addSeaFreightShipmentItem = function () {
            $scope.initShipmentList();
            openModalPanel("#shipment-list-modal");
            //$scope.SeaFreightShipmentGridOptions.data.push({ ShipmentNo: null, ShipmentType: null, CustomerName: null, ShipmentDescription: null, Quantity: null, CBM: null, Consignee : null,FreightCost: null});
        }

        //function that will be invoked when user click tab
        $scope.setSelectedTab = function (tab) {
            $scope.isError = false;
            $scope.errorMessage = "";
            $scope.selectedTab = tab;
        };

        //function that will be invoked when user delete, update or view a record in the seafreight list
        $scope.setSelected = function (id) {
            $scope.seafreightIDholder = id;
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

        //search seafreight
        $scope.searchseafreight = function (id) {
            var i = 0;
            for (i = 0; i < $scope.seafreightGridOptions.data.length; i++) {
                if (id == $scope.seafreightGridOptions.data[i].Id) {
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

        //Search sea Freight key
        $scope.searchKey = function (key) {
            if (angular.isDefined($scope.seafreightItem[key]))
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
                
                    if ($scope.seafreightItem[key] == null || $scope.seafreightItem[key] == "") {
                        $scope.isError = true;
                        $scope.errorMessage = " " + label + " is required.";
                        return false;
                    }
                }
            }
            return true;
        };

        //search SeaFreightShipment
        $scope.searchSeaFreightShipment = function (id) {
            var i = 0;
            for (i = 0; i < $scope.SeaFreightShipmentGridOptions.data.length; i++) {
                if (id == $scope.SeaFreightShipmentGridOptions.data[i].Id) {
                    return i;
                }
            }
            return i;
        };

        $scope.setSelectedSeaFreightShipment = function (id) {
            $scope.selectedSeaFreightShipmentIndex = $scope.searchSeaFreightShipment(id);
        };

        //Triggers when user create, delete, update or view a sea freight transation in the list
        $scope.actionForm = function (action) {
            $scope.actionMode = action;
            $scope.selectedseafreightIndex = $scope.searchseafreight($scope.seafreightIDholder);
            $scope.selectedTab = $scope.tabPages[0];
            $scope.isError = false;
            $scope.errorMessage = "";
            switch ($scope.actionMode) {
                case "Create":
                    $scope.initializeseafreightItem();
                    $scope.viewOnly = false;
                    $scope.submitButtonText = "Submit";
                    break;
                case "Edit":
                    $scope.seafreightItem = [];
                    $scope.seafreightItem = angular.copy($scope.seafreightGridOptions.data[$scope.selectedseafreightIndex]);
                    $scope.controlNoHolder = $scope.seafreightItem.Id;
                    $scope.seafreightItem.Id = $rootScope.formatControlNo('', 15, $scope.seafreightItem.Id);
                    $scope.viewOnly = false;
                    $scope.submitButtonText = "Submit";
                    break;
                case "Delete":
                    $scope.seafreightItem = [];
                    $scope.seafreightItem = angular.copy($scope.seafreightGridOptions.data[$scope.selectedseafreightIndex]);
                    $scope.controlNoHolder = $scope.seafreightItem.Id;
                    $scope.seafreightItem.Id = $rootScope.formatControlNo('', 15, $scope.seafreightItem.Id);
                    $scope.viewOnly = true;
                    $scope.submitButtonText = "Delete";
                    break;
                case "View":
                    $scope.seafreightItem = [];
                    $scope.seafreightItem = angular.copy($scope.seafreightGridOptions.data[$scope.selectedseafreightIndex]);
                    $scope.controlNoHolder = $scope.seafreightItem.Id;
                    $scope.seafreightItem.Id = $rootScope.formatControlNo('', 15, $scope.seafreightItem.Id);
                    $scope.loadDetail($scope.controlNoHolder);
                    $scope.viewOnly = true;
                    $scope.submitButtonText = "Close";
                    break;
            }
        };
        
        $scope.actionFormDtl = function (action) {
            $scope.actionMode = action;
           // $scope.selectedseafreightIndex = $scope.searchShipment($scope.seafreightIDholder);
            $scope.selectedTab = $scope.tabPages[0];
            $scope.isError = false;
            $scope.errorMessage = "";
            switch (action) {
                case "Create":
                    $scope.initDetail();
                    break;
                case "Edit":

                    break;
                case "Delete":

                    break;
                case "View":

                    break;
            }
        }

        $scope.openModalForm = function (panel) {
            $scope.isError = false;
            $scope.isErrorSeaFreightShipment = false;
            openModalPanel(panel);
        }

        $scope.closeModalForm = function () {
            jQuery.magnificPopup.close();
            $scope.isError = false;
        }

        //Triggers before submit function
        $scope.preSubmit = function () {
            $scope.seafreightItem.Id          = $scope.controlNoHolder;
            $scope.seafreightItem.BLNumber = $filter('ProperCase')($scope.seafreightItem.BLNumber);
            $scope.seafreightItem.BLDate =  $filter('Date')(document.getElementById('bldate').value, "yyyy-MM-dd");
            $scope.seafreightItem.FreightCost = $filter('Decimal')($scope.seafreightItem.FreightCost);
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
                        $scope.apiUpdate($scope.seafreightItem.Id);
                    break;
                case 'Delete':
                    $scope.apiDelete($scope.seafreightItem.Id);
                    break;
                case 'View':
                    break;
            }
            $scope.focusOnTop();
        }

        //http post request for saving seafreight information
        $scope.apiCreate = function () {
            var spinner = new Spinner(opts).spin(spinnerTarget);
            var dataModel = angular.copy($scope.seafreightItem);
            var dataModel1 = angular.copy($scope.SeaFreightShipmentGridOptions.data);

            for (var i = 0; i < dataModel1.length; i++) {
                delete dataModel1[i].Shipment;
                delete dataModel1[i].Id;
            }

            dataModel.SeaFreightShipments = dataModel1;
            
            delete dataModel.Id;
            delete dataModel.BusinessUnit;
            delete dataModel.BusinessUnit1;
            delete dataModel.VesselVoyage;

            $http.post("/api/SeaFreights", dataModel)
            .success(function (data, status) {
                $scope.seafreightItem.Id = angular.copy(data.objParam1.Id);
                $scope.seafreightGridOptions.data.push($scope.seafreightItem);
                for (var i = 0; i < $scope.SeaFreightShipmentGridOptions.data.length; i++)
                    $scope.SeaFreightShipmentGridOptions.data[i].Id = data.objParam1.SeaFreightShipments[i].Id;
                spinner.stop();

                return true;

            })
            .error(function (error, status) {
                spinner.stop();
                $scope.isError = true;
                $scope.errorMessage = status;

                return false;
            });
        };
        
        //http put request for saving the changes of seafreight information
        $scope.apiUpdate = function (id) {
            var spinner = new Spinner(opts).spin(spinnerTarget);
            var dataModel = angular.copy($scope.seafreightItem);
            var dataModel1 = angular.copy($scope.SeaFreightShipmentGridOptions.data);

            for (var i = 0; i < dataModel1.length; i++) {
                if (dataModel1[i].Id == -1)
                    delete dataModel1[i].Id;

                delete dataModel1[i].Shipment;
            }

            dataModel.SeaFreightShipments = dataModel1;

            delete dataModel.BusinessUnit;
            delete dataModel.BusinessUnit1;
            delete dataModel.VesselVoyage;

            $http.put("/api/seafreights" + "/" + id, dataModel)
            .success(function (data, status) {
                if (data.status = "SUCCESS") {
                    $scope.seafreightItem.Id = angular.copy(data.objParam1.Id);
                    $scope.seafreightGridOptions.data[$scope.selectedTruckingIndex] = angular.copy($scope.seafreightItem);
                    for (var i = 0; i < $scope.SeaFreightShipmentGridOptions.data.length; i++)
                        $scope.SeaFreightShipmentGridOptions.data[i].Id = data.objParam1.SeaFreightShipments[i].Id;
                    $scope.selectedTab = $scope.tabPages[1];
                    //$scope.onEDV();
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

                return false;
            });
        };

        //http delete request for deleting a seafreight
        $scope.apiDelete = function (id) {
            var spinner = new Spinner(opts).spin(spinnerTarget);
            $http.delete("/api/seafreights" + "/" + id)
            .success(function (data, status) {
                $scope.seafreightGridOptions.data.splice($scope.selectedseafreightIndex, 1);
                $scope.initializeseafreightItem();
                spinner.stop();
                alert("Successfully Deleted.");
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
        
        //don't allow input
        $('#origin,#destination,#voyageNo').keypress(function (key) {
            return false;
        });
        
        // Initialization routines
        var init = function () {
            // Call function to load data during content load
            $scope.focusOnTop();
            $scope.initializeseafreightItem();
            $scope.loadSeaFreightDataGrid();
            $scope.loadSeaFreightFiltering();
            $scope.loadBusinessUnitDataGrid();
            $scope.loadBusinessUnitFiltering();
            $scope.loadShippingLineDataGrid();
            $scope.loadShippingLineFiltering();
            $scope.loadVesselDataGrid();
            $scope.loadVesselFiltering();
            $scope.initSeaFreightShipmentGridOptions();
            $scope.initBusinessUnitList();
            $scope.initShippingLineList();
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