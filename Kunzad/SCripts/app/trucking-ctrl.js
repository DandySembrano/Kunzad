
kunzadApp.controller("TruckingController", TruckingController);
function TruckingController($scope, $http, $interval, $filter, $rootScope) {
    $scope.modelName = "Trucking";
    $scope.modelhref = "#/trucking";
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
    $scope.showMenu = true;
    $scope.truckList = [];
    $scope.driverList = [];
    $scope.businessUnitList = [];
    $scope.shipmentList = [];
    $scope.trkgDeliveryList = [];
    var pageSize = 20;

    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0;
        $http.get("/api/Truckings?page=" + page)
            .success(function (data, status) {
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

    $scope.initTruckingItem = function () {
        $scope.truckingItem = {
            "Id": null,
            "DocumentNo": 'doc01',
            "TruckerId": null,
            "Trucker": {
                "Id": null,
                "Name": null
            },
            "TruckId": null,
            "Trucks": {
                "Id": null,
                "PlateNo": null,
            },
            "DriverId": null,
            "Drivers": {
                "Id": null,
                "Name": null
            },
            "OriginServiceableAreaId": null,
            "OriginServiceableAreaName": null,
            "DestinationServiceableAreaId": null,
            "DestinationServiceableAreaName": null,
            "TruckerCost": null,
            "TruckingStatusId": 1,
            "TruckCallDate": null,
            "TruckCallTime": null,
            "DispatchDate": null,
            "DispatchTime": null,
            "CompletedDate": null,
            "CompletedTime": null,
            "CreatedDate": null,
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null
        }
    }

    $scope.trkgDeliveryItem = {
        "Id": -1,
        "TruckingId": null,
        "ShipmentId": null,
        "CustomerId": null,
        "Customer": { "Id": null, "Name": null },
        "CustomerDocumentNo": null,
        "Quantity": null,
        "CBM": null,
        "Description": null,
        "DeliverTo": null,
        "DeliveryAddressId": null,
        "DeliveryDate": null,
        "DeliveryTime": null,
        "CostAllocation": null,
        "CreatedDate": null,
        "LastUpdatedDate": null,
        "CreatedByUserId": null,
        "LastUpdatedByUserId": null
    }
    $scope.trkgDeliveryList.push($scope.trkgDeliveryItem)
   
    $scope.gridOptTrkgDtl = {
        data: 'trkgDeliveryList',
        enableSorting: true,
        enableCellEditOnFocus: true,
        rowTemplate: '<div>' +
                    ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell  context-menu="grid.appScope.setSelected(row.entity.Id)" data-target="DTShipmentDtl"  ng-click="grid.appScope.showModalShipment(row.entity.No)" ></div>' +
                    '</div>',
        columnDefs: [
          {
              name: 'No', enableCellEdit: false,
              cellTemplate: '<div class="ui-grid-cell-contents text-center" >{{row.entity.No = (grid.appScope.currentPage == 1 ? (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) : ((grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.currentPage - 1) * grid.appScope.pageSize)))}}</div>'
          },
        { name: 'Shipment', field: 'ShipmentId' },
        { name: 'Customer', field: 'Customer.Name', enableCellEdit: false },
        { name: 'CustomerDocumentNo', field: 'CustomerDocumentNo', enableCellEdit: false },
        { name: 'Quantity', field: 'Quantity', enableCellEdit: false },
        { name: 'CBM', field: 'CBM', enableCellEdit: false },
        { name: 'Description', field: 'Description', enableCellEdit: false },
        { name: 'DeliverTo', field: 'DeliverTo', enableCellEdit: false },
        { name: 'DeliveryDate', field: 'DeliveryDate', enableCellEdit: false },
        { name: 'DeliveryTime', field: 'DeliveryTime', enableCellEdit: false },
        { name: 'CostAllocation', field: 'CostAllocation', enableCellEdit: false }
        ],

        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        },
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
    }

    $scope.setSelected = function (id) {
        for (var j = 0; j <= $scope.shipmentList.length; j++) {
            if (id == $scope.shipmentList[j].Id) {
                $scope.selected = j;
                break;
            }
        }
    }

    $scope.showModalShipment = function (id) {
        $scope.ShipmentRow = id;
        var rowCol = $scope.gridApi.cellNav.getFocusedCell();
        if (rowCol !== null) {
            $scope.currentFocused =  rowCol.col.colDef.name;
        }
        if ($scope.currentFocused == 'Shipment') {
            openModalPanel('#shipment-list-modal');
        }
        
    }

    $scope.actionFormDtl = function (action) {
        switch (action) {
            case "Create":
                $scope.trkgDeliveryList.push([{
                    "Id": -1,
                    "TruckingId": "x",
                    "ShipmentId": "x",
                    "CustomerId": "x",
                    "Customer": { "Id": "x", "Name": "x" },
                    "CustomerDocumentNo": "x",
                    "Quantity": "x",
                    "CBM": "x",
                    "Description": "x",
                    "DeliverTo": "x",
                    "DeliveryAddressId": "x",
                    "DeliveryDate": "x",
                    "DeliveryTime": "x",
                    "CostAllocation": "x",
                    "CreatedDate": "x",
                    "LastUpdatedDate": "x",
                    "CreatedByUserId": "x",
                    "LastUpdatedByUserId": "x"
                }]);
                break;
            case "Edit":
    
                break;
            case "Delete":
 
                break;
            case "View":

                break;
        }
    }
    
 
    $scope.initTruck = function () {
        $http.get("/api/Trucks")
            .success(function (data, status) {
                $scope.truckList = data;
            });
    }

    $scope.initDriver = function () {
        $http.get("/api/Drivers")
          .success(function (data, status) {
              $scope.driverList = data;
          });
    }

    $scope.initBusinessUnit = function () {
        $http.get("/api/BusinessUnits")
        .success(function (data, status) {
            $scope.businessUnitList = data;
        });
    }

    $scope.initShipment = function () {
        $http.get("/api/Shipments")
        .success(function (data, status) {
            $scope.shipmentList = data;
        });
    }

    //Set the focus on top of the page during load
    $scope.focusOnTop = function () {
        $(document).ready(function () {
            $(this).scrollTop(0);
        });
    };

    //Displays Modal
    $scope.showModal = function (panel, type) {
        openModalPanel(panel);
        $scope.modalType = type;
    };

    //close Truck List Modal
    $scope.closeModalTruck = function (truck) {
        if (angular.isDefined(truck)) {
            $scope.truckingItem.TruckId = truck.Id;
            $scope.truckingItem.Trucks.PlateNo = truck.PlateNo;
            $scope.truckingItem.Trucker.Name = truck.Trucker.Name;
            $scope.truckingItem.TruckerId = truck.Trucker.Id;
        }
        jQuery.magnificPopup.close();
    };

    //close driver modal
    $scope.closeModalDriver = function (driver) {
        if (angular.isDefined(driver)) {
            $scope.truckingItem.DriverId = driver.Id;
            $scope.truckingItem.Drivers.Name = driver.FirstName + driver.LastName;
        }
        jQuery.magnificPopup.close();
    };

    //close business unit modal origin
    $scope.closeModalBusinessUnit = function (businnessUnit) {
        if (angular.isDefined(businnessUnit)) {
            $scope.truckingItem.OriginServiceableAreaId = businnessUnit.Id;
            $scope.truckingItem.OriginServiceableAreaName = businnessUnit.Name;
        }
        jQuery.magnificPopup.close();
    };

    //close business unit modal destination
    $scope.closeModalBusinessUnitDestination = function (businnessUnit) {
        if (angular.isDefined(businnessUnit)) {
            $scope.truckingItem.DestinationServiceableAreaId = businnessUnit.Id;
            $scope.truckingItem.DestinationServiceableAreaName = businnessUnit.Name;
        }
        jQuery.magnificPopup.close();
    };


    $scope.closeShipment = function (id) {
        alert(id);
        var selected = 0;
        for (var j = 0; j <= $scope.shipmentList.length; j++) {
            if (id == $scope.shipmentList[j].Id) {
               selected = j;
                break;
            }
        }
       
        $scope.trkgDeliveryList[$scope.ShipmentRow-1].ShipmentId = $scope.shipmentList[selected].Id;
        jQuery.magnificPopup.close();
    };


    $scope.apiCreate = function () {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var dataModel = angular.copy($scope.truckingItem); //subject for changes
        delete dataModel.Id;
        delete dataModel.Trucks;
        delete dataModel.Drivers;
        delete dataModel.OriginServiceableAreaName;
        delete dataModel.DestinationServiceableAreaName;
        delete dataModel.Trucker;

        $http.post("/api/Truckings", dataModel)
        .success(function (data, status) {
            $scope.truckingItem.Id = angular.copy(data.Id);
            spinner.stop();
            alert("Successfully Saved.");
        })
        .error(function (error, status) {
            spinner.stop();
            $scope.isError = true;
            $scope.errorMessage = status;
        });
    }

    $scope.submit = function () {
        $scope.isError = false;
        $scope.errorMessage = "";

         $scope.apiCreate();
         $scope.focusOnTop();

    }

    // Initialization routines
    var init = function () {
        $scope.initTruckingItem();
        $scope.initTruck();
        $scope.initDriver();
        $scope.initBusinessUnit();
        $scope.initShipment();
    };

    init();
};