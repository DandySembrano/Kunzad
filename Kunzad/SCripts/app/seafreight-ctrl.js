
kunzadApp.controller("SeaFreightController", SeaFreightController);
function SeaFreightController($scope, $http, $interval, $filter, $rootScope) {
    $scope.modelName = "Sea Freight";
    $scope.modelhref = "#/seafreight";
        $scope.seafreightGridOptions = {};
        $scope.seafreightGridOptions.data = [];
        $scope.SeaFreightShipmentGridOptions = {};
        $scope.SeaFreightShipmentGridOptions.data = [];
        $scope.seafreightItem = {};
        $scope.seaFreightShipmentItem = {};
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
    //------------------------------ process seaFreightShipment pagination------------------------
        $scope.seaFreightShipmentCurrentPage = 1;
        $scope.seaFreightShipmentPageSize = 20;
        $scope.seaFreightShipmentMaxPage = 0;
        $scope.paginatedseaFreightShipments = [];
        $scope.processSeaFreightShipmentPagination = function (seaFreightShipmentCurrentPage, action) {
            $scope.firstPageseaFreightShipments = false;
            $scope.lastPageseaFreightShipments = false;
            $scope.previousPageseaFreightShipments = false;
            $scope.nextPageseaFreightShipments = false;
            $scope.paginatedseaFreightShipments = [];

            //Initialize seaFreightShipmentMaxPage
            if ($scope.SeaFreightShipmentGridOptions.data.length >= $scope.seaFreightShipmentPageSize) {
                if (($scope.SeaFreightShipmentGridOptions.data.length % $scope.seaFreightShipmentPageSize) == 0)
                    $scope.seaFreightShipmentMaxPage = $scope.SeaFreightShipmentGridOptions.data.length / $scope.seaFreightShipmentPageSize;
                else
                    $scope.seaFreightShipmentMaxPage = Math.ceil($scope.SeaFreightShipmentGridOptions.data.length / $scope.seaFreightShipmentPageSize);
            }
            else
                $scope.seaFreightShipmentMaxPage = 1;

            var begin = 0
            var end = 0;
            //First Page
            if (seaFreightShipmentCurrentPage == 1 && !(action == 'LASTPAGE')) {
                if ($scope.seaFreightShipmentMaxPage > 1) {
                    $scope.nextPageseaFreightShipments = true;
                    $scope.lastPageseaFreightShipments = true;
                }
                else {
                    $scope.nextPageseaFreightShipments = false;
                    $scope.lastPageseaFreightShipments = false;
                }
                $scope.firstPageseaFreightShipments = false;
                $scope.previousPageseaFreightShipments = false;
                if ($scope.SeaFreightShipmentGridOptions.data.length >= $scope.seaFreightShipmentPageSize)
                    end = $scope.seaFreightShipmentPageSize;
                else
                    end = $scope.SeaFreightShipmentGridOptions.data.length;

                for (i = begin ; i < end; i++) {
                    $scope.paginatedseaFreightShipments.push($scope.SeaFreightShipmentGridOptions.data[i]);
                }
            }
                //Last Page
            else if (seaFreightShipmentCurrentPage == $scope.seaFreightShipmentMaxPage || action == 'LASTPAGE') {
                $scope.seaFreightShipmentCurrentPage = $scope.seaFreightShipmentMaxPage;
                seaFreightShipmentCurrentPage = $scope.seaFreightShipmentCurrentPage;

                if ($scope.seaFreightShipmentMaxPage == 1) {
                    $scope.firstPageseaFreightShipments = false;
                    $scope.previousPageseaFreightShipments = false;
                }
                else {
                    $scope.firstPageseaFreightShipments = true;
                    $scope.previousPageseaFreightShipments = true;
                }
                $scope.lastPageseaFreightShipments = false;
                $scope.nextPageseaFreightShipments = false;
                begin = (seaFreightShipmentCurrentPage - 1) * $scope.seaFreightShipmentPageSize;
                end = $scope.SeaFreightShipmentGridOptions.data.length;
                for (i = begin ; i < end; i++) {
                    $scope.paginatedseaFreightShipments.push($scope.SeaFreightShipmentGridOptions.data[i]);
                }
            }
                //Previous and Next
            else {
                $scope.firstPageseaFreightShipments = true;
                $scope.lastPageseaFreightShipments = true;
                $scope.previousPageseaFreightShipments = true;
                $scope.nextPageseaFreightShipments = true;
                begin = (seaFreightShipmentCurrentPage - 1) * $scope.seaFreightShipmentPageSize;
                end = begin + $scope.seaFreightShipmentPageSize;
                for (i = begin ; i < end; i++) {
                    $scope.paginatedseaFreightShipments.push($scope.SeaFreightShipmentGridOptions.data[i]);
                }
            }
        };
    //-------------------------------------------------------------------------------
        //Displays Modal
        $scope.showModal = function (panel) {
            openModalPanel(panel);
        };
           
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
            console.log($scope.ShipmentList[$scope.index].ShipmentType.Name);
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
            $http.get("/api/Shipments")
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
                    "OriginBusinessUnit": {
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
                    "DestinationBusinessUnit": {
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
            $http.get("/api/SeaFreights?page=" + page)
                .success(function (data, status) {
                    //initialize seafreight
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
                    $scope.focusOnTop();
                    
                    spinner.stop();
                })
                .error(function (data, status) {
                    spinner.stop();
                });
        };
        
        //Retrieve seafreight shipments
        $scope.loadDetail = function (seaFreightId) {
            var spinner = new Spinner(opts).spin(spinnerTarget);
            var i = 0;
            $http.get("/api/SeaFreightShipments?seaFreightId=" + seaFreightId)
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
            $scope.SeaFreightShipmentHeader = ['Shipment No','Shipment Type','Customer Name','Shipment Description','Quantity','Total CBM','Consignee','Cost Allocation','No'];
            $scope.SeaFreightShipmentKeys = ['ShipmentId', 'Shipment.ShipmentType.Name', 'Shipment.Customer.Name', 'Shipment.Description', 'Shipment.Quantity', 'Shipment.TotalCBM', 'Shipment.DeliverTo', 'CostAllocation'];
            $scope.KeyType = ['ControlNo','String','String','String','Decimal','Decimal','String','Decimal' ];
            $scope.isEditableCell = [false, false, false, false, false, false, false, true];
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
        
        //don't allow input
        $('#origin,#destination,#voyageNo').keypress(function (key) {
            return false;
        });
        
        // Initialization routines
        var init = function () {
            // Call function to load data during content load
            $scope.focusOnTop();
            $scope.initializeseafreightItem();
            $scope.loadData($scope.currentPage);
            $scope.initseafreightGridOptions();
            $scope.initSeaFreightShipmentGridOptions();
            $scope.initBusinessUnitList();
            $scope.initShippingLineList();
        };

        init();

        $interval(function () {},100);
    };