
kunzadApp.controller("TruckingsWBController", TruckingsWBController);
function TruckingsWBController($scope, $http, $interval, $filter, $rootScope) {
    $scope.modelName = "Waybill Trucking";
    $scope.modelhref = "#/truckingwb";
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
    $scope.truckingList = [];
    $scope.businessUnitList = [];
    $scope.trkgDeliveryList = [];
    var pageSize = 20;

    // LOAD TRUCKINGS DATA WITH STATUS = 20
    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/TruckingsWB?p=" + page + "&status=20")
            .success(function (data, status) {
                for (var i = 0; i < data.length; i++) {
                    // assign Drivers Name - CONCAT
                    data[i].Driver.Name = data[i].Driver.FirstName + ' ' + data[i].Driver.MiddleName + ' ' + data[i].Driver.LastName;
                    // format Created Date
                    data[i].CreatedDateDesc = $filter('date')(data[i].CreatedDate, 'yyyy-MM-dd HH:mm:ss');
                }
                $scope.gridOptionsTruckings.data = data;
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

    // INITIALIZE TRUCKING ITEM
    $scope.initTruckingItem = function () {
        $scope.truckingItem = {
            "Id": null,
            "DocumentNo": null,
            "TruckerId": null,
            "Trucker": {
                "Id": null,
                "Name": null
            },
            "TruckId": null,
            "Truck": {
                "Id": null,
                "PlateNo": null,
            },
            "DriverId": null,
            "Driver": {
                "Id": null,
                "Name": null
            },
            "OriginServiceableAreaId": null,
            "OriginServiceableAreaName": null,
            "DestinationServiceableAreaId": null,
            "DestinationServiceableAreaName": null,
            "TruckingStatusId": 1,
            "CreatedDate": null,
            "CreatedDateDesc": null,
            "LastUpdatedDate": null,
            "TruckingDeliveries": []
        }
    };

    $scope.addNewBooking = function () {
        $scope.trkgDeliveryList.push(
             {
                 Id: null,
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

    // INITIALIZE BUSINESS UNITS
    $scope.initBusinessUnits = function () {
        $http.get("/api/BusinessUnits")
        .success(function (data, status) {
            $scope.businessUnitList = data;
        })
    };

    // MODAL
    $scope.showModal = function (panel) {
        openModalPanel(panel);
    };

    $scope.gridOptionsTruckings = {
        enableSorting: true,
        columnDefs: [
          {
              field: 'No',
              enableSorting: false,
              width: 40,
              enableColumnResizing: true,
              enableColumnMenu: false,
              enableColumnMoving: false,
              cellTemplate: '<div class="ui-grid-cell-contents text-center">{{row.entity.No = (grid.appScope.currentPage == 1 ? (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) : ((grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.currentPage - 1) * grid.appScope.pageSize)))}}</div>'
          },
          { name: 'DocumentNo' },
          { name: 'Trucker', field: 'Trucker.Name' },
          { name: 'Truck', field: 'Truck.PlateNo' },
          { name: 'Driver', field: 'Driver.Name' }

        ],
        rowTemplate: '<div>' +
        ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelectedDispatch(row.entity.Id)"  context-menu="grid.appScope.setSelectedDispatch(row.entity.Id)" data-target= "DataTableMenu"></div>' +
        '</div>',
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        },
        enableColumnResizing: true,
        enableGridMenu: true,
        enableSelectAll: true,
        exporterCsvFilename: 'TruckingWB.csv' + Date.now() + '.csv',
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

    // LOAD TRUCKINGS DATA WITH STATUS = 10
    $scope.loadDataTruckings = function () {
        $http.get("/api/TruckingsWB")
            .success(function (data, status) {
                for (var i = 0; i < data.length; i++) {
                    // assign Drivers Name - CONCAT
                    data[i].Driver.Name = data[i].Driver.FirstName + ' ' + data[i].Driver.MiddleName + ' ' + data[i].Driver.LastName;
                    // format Created Date
                    data[i].CreatedDateDesc = $filter('date')(data[i].CreatedDate, 'yyyy-MM-dd HH:mm:ss');
                }
                $scope.truckingList = data;
            })
    };

    //close Trucking List Modal
    $scope.closeModalTrucking = function (trucking) {
        if (angular.isDefined(trucking)) {
            $scope.truckingItem = trucking;
            //$scope.trkgDeliveryList = [];
            //$scope.TruckingDeliveries = [];

            for (var i = 0; i < $scope.businessUnitList.length; i++) {
                if ($scope.businessUnitList[i].Id == trucking.OriginServiceableAreaId) {
                    $scope.truckingItem.OriginServiceableAreaName = $scope.businessUnitList[i].Name;
                }
            }

            for (var i = 0; i < $scope.businessUnitList.length; i++) {
                if ($scope.businessUnitList[i].Id == trucking.DestinationServiceableAreaId) {
                    $scope.truckingItem.DestinationServiceableAreaName = $scope.businessUnitList[i].Name;
                }
            }

            for (var i = 0; i < $scope.truckingList.length; i++) {
                if ($scope.truckingList[i].Id == trucking.Id) {
                    $scope.TruckingDeliveries = $scope.truckingList[i].TruckingDeliveries;
                    i = $scope.truckingList.length;
                }
            }
            $scope.trkgDeliveryList = $scope.TruckingDeliveries;
            console.log($scope.trkgDeliveryList);
        }
        jQuery.magnificPopup.close();
    };

    // CLOSE MODAL BUSINESS UNIT FOR ORIGIN
    $scope.closeModalBusinessUnitOrigin = function (buo) {
        if (angular.isDefined(buo)) {
            $scope.truckingItem.OriginServiceableAreaId = buo.Id;
            $scope.truckingItem.OriginServiceableAreaName = buo.Name;
        } else {
            $scope.truckingItem.OriginServiceableAreaId = null;
            $scope.truckingItem.OriginServiceableAreaName = null;
        }
        jQuery.magnificPopup.close();
    }

    // CLOSE MODAL BUSINESS UNIT FOR DESTINATION
    $scope.closeModalBusinessUnitDestination = function (bud) {
        if (angular.isDefined(bud)) {
            $scope.truckingItem.DestinationServiceableAreaId = bud.Id;
            $scope.truckingItem.DestinationServiceableAreaName = bud.Name;
        } else {
            $scope.truckingItem.DestinationServiceableAreaId = null;
            $scope.truckingItem.DestinationServiceableAreaName = null;
        }
        jQuery.magnificPopup.close();
    }

    //function that will be invoked when user click tab
    $scope.setSelectedTab = function (tab) {
        $scope.isError = false;
        $scope.errorMessage = "";
        $scope.selectedTab = tab;
    };

    $scope.setSelectedDispatch = function (id) {
        $scope.selectedDispatchId = id;
    };

    //Triggers when user create, delete, update or view a Shipping Line in the list
    $scope.actionForm = function (action) {
        $scope.actionMode = action;
        $scope.selectedTab = $scope.tabPages[0];
        $scope.isError = false;
        $scope.errorMessage = "";
        switch ($scope.actionMode) {
            case "Create":
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                break;
        }
    };

    $scope.submit = function () {
        switch ($scope.actionMode) {
            case "Create":
                $scope.focusOnTop();
                $scope.apiUpdateTruckingWB();
                break;
        }
    }

    // Update
    $scope.apiUpdateTruckingWB = function () {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var dataModel = angular.copy($scope.truckingItem);

        delete dataModel.Trucker;
        delete dataModel.Truck;
        delete dataModel.Driver;
        delete dataModel.OriginServiceableAreaName;
        delete dataModel.DestinationServiceableAreaName;
        delete dataModel.TruckingDeliveries;
        dataModel.DocumentNo = $scope.truckingItem.DocumentNo;
        dataModel.TruckingStatusId = 20;

        $http.put("/api/TruckingsWB/" + dataModel.Id, dataModel)
             .success(function (data, status) {
                 spinner.stop();
                 $scope.loadData($scope.currentPage);
                 $scope.setSelectedTab("List");
             })
             .error(function (data, status) {
                 $scope.showFormError("Error: " + status);
                 spinner.stop();
             })
    };

    //manage the error message
    $scope.showFormError = function (message) {
        $scope.isError = true;
        $scope.errorMessage = message;
    };

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

    // Initialization routines
    var init = function () {
        $scope.focusOnTop();
        $scope.initTruckingItem();
        $scope.initBusinessUnits();
        $scope.loadDataTruckings();
        $scope.loadData($scope.currentPage);
        $scope.addNewBooking();
    };

    init();
};