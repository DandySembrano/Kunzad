
kunzadApp.controller("SeaFreightController", SeaFreightController);
function SeaFreightController($scope, $http, $interval, $filter, $rootScope) {
    $scope.modelName = "Sea Freight";
    $scope.modelhref = "#/seafreight";
        $scope.seafreightGridOptions = {};
        $scope.seafreightGridOptions.data = [];
        $scope.seafreightItem = {};
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
        $scope.seafreightIDholder = 0;
        $scope.selectedseafreightIndex = 0;
        $scope.controlNoHolder = 0;
        var pageSize = 20;

        //Displays Modal
        $scope.showModal = function (panel) {
            openModalPanel(panel);
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
        //Close Vessel Voyage List Modal
        $scope.closeVesselVoyageList = function (vv) {
            if (angular.isDefined(vv)) {
                $scope.seafreightItem.VesselVoyageId = vv.Id;
                $scope.seafreightItem.VesselVoyage.DepartureDate = vv.DepartureDate;
                $scope.seafreightItem.VesselVoyage.DepartureTime = vv.DepartureTime;
                $scope.seafreightItem.VesselVoyage.ArrivalDate = vv.ArrivalDate;
                $scope.seafreightItem.VesselVoyage.ArrivalTime = vv.ArrivalTime;
            }
            else
                $scope.seafreightItem.DestinationBusinessUnitId = null;
            jQuery.magnificPopup.close();
        };
        //Initialize Business Unit List for Modal
        $scope.initBusinessUnitList = function () {
            $http.get("/api/BusinessUnits")
            .success(function (data, status) {
                $scope.businessUnitList = data;
            })
        };

        //Initialize Vessel Voyage List for Modal
        $scope.initVesselVoyageList = function () {
            $http.get("/api/VesselVoyages")
            .success(function (data, status) {
                $scope.VesselVoyageList = data;
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
                    "Vessel": {
                        "Id": null,
                        "Name": null,
                        "ShippingLineId": null,
                        "ShippingLine": {
                            "Id": null,
                            "Name": null,
                            "CreatedDate": null,
                            "LastUpdatedDate": null,
                            "CreatedByUserId": null,
                            "LastUpdatedByUserId": null
                        },
                        "CreatedDate": null,
                        "LastUpdatedDate": null,
                        "CreatedByUserId": null,
                        "LastUpdatedByUserId": null
                    },
                    "VoyageNo": null,
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
                    "LastUpdatedByUserId": null
                },
                "OriginBusinessUnitId": null,
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
                "DestinationBusinessUnitId": null,
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
                "FreightCost": null,
                "CreatedDate": null,
                "LastUpdatedDate": null,
                "CreatedByUserId": null,
                "LastUpdatedByUserId": null
            };

        };
        //initialized seafreight gridoption
        $scope.initseafreightGridOptions = function () {
            var columns = [];
            $scope.seafreightHeader = ['Sea Freight No', 'BL Number', 'BL Date', 'Voyage ID', 'Origin Business Unit', 'Destination Business Unit', 'Freight Cost','No'];
            $scope.seafreightKeys = ['Id', 'BLNumber', 'BLDate', 'VesselVoyageId', 'OriginBusinessUnitId', 'DestinationBusinessUnitId', 'FreightCost'];
            $scope.KeyType = ['ControlNo', 'String', 'Date', 'Default', 'Default', 'Default','Decimal'];
            $scope.colWidth = [150, 150, 150, 100, 150, 100, 150];
            $scope.RequiredFields = ['BLNumber-BL Number', 'BLDate-BL Date', 'VesselVoyageId-Voyage ID', 'OriginBusinessUnitId-Origin Business Unit', 'DestinationBusinessUnitId-Destination Business Unit', 'FreightCost-Freight Cost'];
            //Initialize Number Listing
            var columnProperties = {};
            columnProperties.name = $scope.seafreightHeader[$scope.seafreightHeader.length - 1];
            columnProperties.field = 'No';
            columnProperties.cellTemplate = '<div class="ui-grid-cell-contents text-center">{{row.entity.No = (grid.appScope.currentPage == 1 ? (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) : ((grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.currentPage - 1) * grid.appScope.pageSize)))}}</div>';
            columnProperties.width = 40;
            columnProperties.enableColumnResizing = true;
            columnProperties.enableColumnMenu = false;
            columnProperties.enableColumnMoving = false;
            columns.push(columnProperties);
            //Initialize column data
            for (var i = 0; i < ($scope.seafreightHeader.length - 1) ; i++) {
                var columnProperties = {};
                columnProperties.name = $scope.seafreightHeader[i];
                columnProperties.field = $scope.seafreightKeys[i];
                columnProperties.width = $scope.colWidth[i];
                //format field value
                columnProperties.cellFilter = $scope.filterValue($scope.KeyType[i]);
                columns.push(columnProperties);
            }
            $scope.seafreightGridOptions = {
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
        

        //Retrieve seafreights
        $scope.loadData = function (page) {
            var spinner = new Spinner(opts).spin(spinnerTarget);
            var i = 0;
            $http.get("/api/seaFreights?page=" + page)
                .success(function (data, status) {
                    //initialize seafreight

                    console.log(data);
                    $scope.seafreightGridOptions.data = data;

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
                });
        };
        $scope.initSeaFreightShipment = function () {
            $scope.seaFreightShipmentItem = {
                "Id": null,
                "SeaFreightId": null,
                "ShipmentId": null,
                "Shipment": {
                    "Id": null,
                    "BusinessUnitId": null,
                    "ServiceId": null,
                    "ShipmentTypeId": null,
                    "PaymentMode": null,
                    "CustomerId": null,
                    "Customer" : {
                        "Name" : null
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

            }
        };
        //initialized sea freight shipment gridoption
        $scope.initSeaFreightShipmentGridOptions = function () {
            var columns = [];
            $scope.SeaFreightShipmentHeader = ['Shipment No','Shipment Type','Customer Name','Shipmet Description','Quantity','Total CBM','Consignee','Cost Allocation','No'];
            $scope.SeaFreightShipmenttKeys = ['seaFreightShipmentItem.Shipment.Id', 'seaFreightShipmentItem.Shipment.ShipmentType.Name', 'seaFreightShipmentItem.Shipment.Customer.Name', 'seaFreightShipmentItem.Shipment.Description', 'seaFreightShipmentItem.Shipment.Quantity', 'seaFreightShipmentItem.Shipment.TotalCBM', 'seaFreightShipmentItem.Shipment.DeliverTo', 'seaFreightShipmentItem.CostAllocation'];
            $scope.KeyType = ['Default','String','String','String','Decimal','Decimal','String','Decimal' ];
            $scope.colWidth = [150, 150, 150, 150, 150, 150, 150, 150];
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
            columns.push(columnProperties);
            //Initialize column data
            for (var i = 0; i < ($scope.SeaFreightShipmentHeader.length - 1) ; i++) {
                var columnProperties = {};
                columnProperties.name = $scope.SeaFreightShipmentHeader[i];
                columnProperties.field = $scope.SeaFreightShipmentKeys[i];
                columnProperties.width = $scope.colWidth[i];
                //format field value
                columnProperties.cellFilter = $scope.filterValue($scope.KeyType[i]);
                columns.push(columnProperties);
            }
            $scope.SeaFreightShipmentGridOptions = {
                columnDefs: columns,
                rowTemplate: '<div>' +
                    ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell text-center"  ui-grid-cell ng-click="grid.appScope.setSelectedSeaFreightShipment(row.entity.Id, row.entity.Name)"  context-menu="grid.appScope.setSelectedSeaFreightShipment(row.entity.Id, row.entity.Name)" data-target= "DataTableMenu"></div>' +
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

        //search ShippingLine
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

        //Search key
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
        //Triggers when user create, delete, update or view a Shipping Line in the list
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
                    $scope.viewOnly = true;
                    $scope.submitButtonText = "Close";
                    break;
            }
        };
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
                        $scope.apiCreate();
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
            delete dataModel.Id;
            delete dataModel.BusinessUnit;
            delete dataModel.BusinessUnit1;
            delete dataModel.VesselVoyage;
            $http.post("/api/SeaFreights", dataModel)
            .success(function (data, status) {
                $scope.seafreightItem.Id = angular.copy(data.Id);
                $scope.seafreightGridOptions.data.push($scope.seafreightItem);
                spinner.stop();
                alert("Successfully Saved.");
            })
            .error(function (error, status) {
                spinner.stop();
                $scope.isError = true;
                $scope.errorMessage = status;
            });
        };
        
        //http put request for saving the changes of seafreight information
        $scope.apiUpdate = function (id) {
            var spinner = new Spinner(opts).spin(spinnerTarget);
            var dataModel = angular.copy($scope.seafreightItem);
            delete dataModel.BusinessUnit;
            delete dataModel.BusinessUnit1;
            delete dataModel.VesselVoyage;
            $http.put("/api/seafreights" + "/" + id, dataModel)
            .success(function (data, status) {
                $scope.seafreightGridOptions.data[$scope.selectedseafreightIndex] = $scope.seafreightItem;
                spinner.stop();
                alert("Successfully Updated.");
            })
            .error(function (error, status) {
                spinner.stop();
                $scope.isError = true;
                $scope.errorMessage = status;
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

        // Initialization routines
        var init = function () {
            // Call function to load data during content load
            $scope.focusOnTop();
            $scope.initializeseafreightItem();
            $scope.loadData($scope.currentPage);
            $scope.initseafreightGridOptions();
            //$scope.initSeaFreightShipmentGridOptions();
            $scope.initBusinessUnitList();
            $scope.initVesselVoyageList();
        };

        init();
    };