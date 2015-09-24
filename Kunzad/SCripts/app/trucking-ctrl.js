
kunzadApp.controller("TruckingController", TruckingController);
function TruckingController($scope, $http, $interval, $filter, $rootScope) {
    $scope.modelName = "Dispatching";
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
    $scope.truckingTypeList = [];
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
            "TruckingStatusId": null,
            "TruckingStatusRemarks": null,
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

    $scope.truckingTypeList = $rootScope.getTruckingTypeList();
   
    $scope.gridOptTrkList = {
        data: [],
        enableSorting: true,
        enableCellEditOnFocus: true,
        rowTemplate: '<div>' +
                    ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell    ></div>' +
                    '</div>',
        columnDefs: [
          {
              name: 'No', enableCellEdit: false,
              cellTemplate: '<div class="ui-grid-cell-contents text-center" >{{row.entity.No = (grid.appScope.currentPage == 1 ? (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) : ((grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.currentPage - 1) * grid.appScope.pageSize)))}}</div>'
          },
        { name: 'Trucking', field: 'Id' },
        { name: 'DispatchDate', field: 'DispatchDate' },
        { name: 'DispatchTime', field: 'DispatchTime' },
        { name: 'PlateNo', field: 'Trucks.PlateNo' },
        { name: 'Trucker', field: 'Trucker.Name' },
        { name: 'Driver', field: 'Drivers.Name' },
        { name: 'Origin', field: 'OriginServiceableAreaName' },
        { name: 'Origin', field: 'DestinationServiceableAreaName' },
        { name: 'TruckerCost', field: 'TruckerCost' },
        { name: 'TruckCallDate', field: 'TruckCallDate' },
        { name: 'TruckCallTime', field: 'TruckCallTime' },
        { name: 'CompletedDate', field: 'CompletedDate' },
        { name: 'CompletedTime', field: 'CompletedTime' },
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

    $scope.showModalShipment = function (index) {
        $scope.ShipmentRow = index;
        openModalPanel('#shipment-list-modal');

        //alert(id.grid.cellNav.focusedCells.Object.GridColumn.field);
        ////var rowCol = $scope.gridApi.cellNav.getFocusedCell();
        ////if (rowCol !== null) {
        ////    $scope.currentFocused = rowCol.col.colDef.name;
        ////} else {
        ////}
        ////if ($scope.currentFocused == 'Shipment') {
        ////    openModalPanel('#shipment-list-modal');
        ////}
        
    }
    
    $scope.addNewBooking = function () {
        $scope.trkgDeliveryList.push(
             {
                Id: -1,
                TruckingId: null,
                ShipmentId: null,
                Shipment: {
                    Id: null,
                    BusinessUnitId: null,
                    ServiceId: null,
                    Service: {
                        Id: null,
                        Name: null
                    },
                    ShipmentTypeId: null,
                    ShipmentType: {
                        Id: null,
                        Name: null
                    },
                    PaymentMode: null,
                    CustomerId: null,
                    Customer: {
                        Id: null,
                        Name: null
                    },
                    Quantity: null,
                    TotalCBM: null,
                    Description: null,
                    DeliverTo: null,
                    DeliveryAddressId: null,
                    DeliveryAddress: null,
                    Address1 : {
                        Id: null,
                        Line1: null,
                        Line2: null,
                        CityMunicipalityId: null,
                        CityMunicipality: {
                            Id: null,
                            Name: null,
                            StateProvince: {
                                Id: null,
                                Name: null,
                                CountryId : null,
                                Country: {
                                    Id: null,
                                    Name : null
                                }
                            }

                        },
                        PostalCode: null
                    }
                },
                CustomerId: null,
                Customer: { Id: null, Name: null },
                Quantity: null,
                CBM: null,
                Description: null,
                DeliverTo: null,
                DeliveryAddressId: null,
                DeliveryAddress: null,
                Address1: {
                    Id: null,
                    Line1: null,
                    Line2: null,
                    CityMunicipalityId: null,
                    CityMunicipality: {
                        Id: null,
                        Name: null,
                        StateProvince: {
                            Id: null,
                            Name: null,
                            CountryId: null,
                            Country: {
                                Id: null,
                                Name: null
                            }
                        }

                    },
                    PostalCode: null
                },
                DeliveryDate: null,
                DeliveryTime: null,
                CostAllocation: null,
                CreatedDate: null,
                LastUpdatedDate: null,
                CreatedByUserId: null,
                LastUpdatedByUserId: null
            }
        );
    };
    
    $scope.removeBooking = function (index) {
        if ($scope.trkgDeliveryList.length == 1)
            alert('Unable to delete, At least 1 detail is required.');
        else
            $scope.trkgDeliveryList.splice(index, 1);
    };

    $scope.initTruck = function () {
        $http.get("/api/Trucks?page=1")
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
        $http.get("/api/Shipments?page=1")
        .success(function (data, status) {
            $scope.shipmentList = data;

            console.log($scope.shipmentList);
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
        var selected = 0;
        for (var j = 0; j <= $scope.shipmentList.length; j++) {
            if (id == $scope.shipmentList[j].Id) {
               selected = j;
                break;
            }
        }

        $scope.trkgDeliveryList[$scope.ShipmentRow].ShipmentId = $scope.shipmentList[selected].Id;
        $scope.trkgDeliveryList[$scope.ShipmentRow].CustomerId = $scope.shipmentList[selected].CustomerId;
        $scope.trkgDeliveryList[$scope.ShipmentRow].Customer.Code = $scope.shipmentList[selected].Customer.Code;
        $scope.trkgDeliveryList[$scope.ShipmentRow].Customer.Name = $scope.shipmentList[selected].Customer.Name;
        $scope.trkgDeliveryList[$scope.ShipmentRow].Quantity = $scope.shipmentList[selected].Quantity;
        $scope.trkgDeliveryList[$scope.ShipmentRow].CBM = $scope.shipmentList[selected].TotalCBM;
        $scope.trkgDeliveryList[$scope.ShipmentRow].Description = $scope.shipmentList[selected].Description;
        $scope.trkgDeliveryList[$scope.ShipmentRow].DeliverTo = $scope.shipmentList[selected].DeliverTo;
        $scope.trkgDeliveryList[$scope.ShipmentRow].Shipment.DeliverToContactNo = $scope.shipmentList[selected].DeliverToContactNo;
        $scope.trkgDeliveryList[$scope.ShipmentRow].DeliveryAddressId = $scope.shipmentList[selected].DeliveryAddressId;
        $scope.trkgDeliveryList[$scope.ShipmentRow].DeliveryAddress = $scope.shipmentList[selected].Address1.Line1 + ", " + $scope.shipmentList[selected].Address1.Line2 + ", " + $scope.shipmentList[selected].Address1.CityMunicipality.Name +  ", " + $scope.shipmentList[selected].Address1.PostalCode;
        $scope.trkgDeliveryList[$scope.ShipmentRow].DeliveryDate = $scope.shipmentList[selected].DeliveryDate;
        $scope.trkgDeliveryList[$scope.ShipmentRow].DeliveryTime = $scope.shipmentList[selected].DeliveryTime;
        jQuery.magnificPopup.close();
    };

    $scope.setSelectedTab = function (tab) {
        $scope.isError = false;
        $scope.errorMessage = "";
        $scope.selectedTab = tab;
    };

    $scope.apiCreate = function () {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var dataModel = angular.copy($scope.truckingItem); //subject for changes
        delete dataModel.Id;
        delete dataModel.TruckingStatusId;
        delete dataModel.Trucks;
        delete dataModel.Drivers;
        delete dataModel.OriginServiceableAreaName;
        delete dataModel.DestinationServiceableAreaName;
        delete dataModel.Trucker;

        $http.post("/api/Truckings", dataModel)
        .success(function (data, status) {
            $scope.truckingItem.Id = angular.copy(data.Id);
            spinner.stop();
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
        $scope.addNewBooking();
    };

    init();
};