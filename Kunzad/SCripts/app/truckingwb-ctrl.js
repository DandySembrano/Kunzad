
kunzadApp.controller("TruckingsWBController", TruckingsWBController);
function TruckingsWBController($scope, $http, $interval, $filter, $rootScope) {
    $scope.modelName = "TruckingsWB";
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
    $scope.showMenu = true;
    $scope.truckingList = [];
    $scope.waybillList = [];
    $scope.truckingTypes = [];
    var pageSize = 20;

    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/TruckingsWB?page=" + page)
            .success(function (data, status) {
                for (var i = 0; i < data.length; i++) {
                    // assign Drivers Name - CONCAT
                    data[i].Driver.Name = data[i].Driver.FirstName + ' ' + data[i].Driver.MiddleName + ' ' + data[i].Driver.LastName;
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
            //"TruckerCost": null,
            "TruckingStatusId": 1,
            //"TruckCallDate": null,
            //"TruckCallTime": null,
            //"DispatchDate": null,
            //"DispatchTime": null,
            //"CompletedDate": null,
            //"CompletedTime": null,
            //"CreatedDate": null,
            "LastUpdatedDate": null
            //"CreatedByUserId": null,
            //"LastUpdatedByUserId": null,
            //"TruckingDeliveries": []
        }
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
        ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelectedAddress(row.entity.Id)"  context-menu="grid.appScope.setSelectedAddress(row.entity.Id)" data-target= "DataTableMenu"></div>' +
        '</div>',
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        },
        enableColumnResizing: true,
        enableGridMenu: true,
        enableSelectAll: true,
        exporterCsvFilename: 'myFile.csv' + Date.now() + '.csv',
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

    $scope.loadBusinessUnitItem = function (id,type) {
        $http.get("/api/BusinessUnits/" + id)
        .success(function (data, status) {
            switch (type) {
                case "orig":
                        $scope.truckingItem.OriginServiceableAreaName = data.Name;
                    break;
                case "dest":
                        $scope.truckingItem.DestinationServiceableAreaName = data.Name;
                    break;
                default: break;
            }
            
        })
    };

    //function that will be invoked when user click tab
    $scope.setSelectedTab = function (tab) {
        $scope.isError = false;
        $scope.errorMessage = "";
        $scope.selectedTab = tab;
    };

    $scope.setSelected = function (id) {
        for (var j = 0; j <= $scope.shipmentList.length; j++) {
            if (id == $scope.shipmentList[j].Id) {
                $scope.selected = j;
                break;
            }
        }
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

    // Update
    $scope.apiUpdateTruckingWB = function (id) {
        var dataModel = angular.copy($scope.truckingItem);

        delete dataModel.truckingItem.Driver.Name;
        delete dataModel.truckingItem.OriginServiceableAreaName;
        delete dataModel.truckingItem.DestinationServiceableAreaName;

        dataModel.CustomerContacts = angular.copy($scope.customerContactList);
        $http.put("/api/Customers/" + id, dataModel)
             .success(function (data, status) {
                 console.log(data);
                 $scope.data[$scope.selected] = angular.copy($scope.dataItem);
                 $scope.closeForm();
             })
             .error(function (data, status) {
                 $scope.showFormError("Error: " + status);
             })
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

    //close Trucking List Modal
    $scope.closeModalTrucking = function (trucking) {
        if (angular.isDefined(trucking)) {
            $scope.truckingItem.Id = trucking.Id;
            $scope.truckingItem.Truck.PlateNo = trucking.Truck.PlateNo;
            $scope.truckingItem.Trucker.Name = trucking.Trucker.Name;
            $scope.truckingItem.Driver.Name = trucking.Driver.Name;
            $scope.truckingItem.CreatedDate = trucking.CreatedDate;

            $scope.loadBusinessUnitItem(trucking.OriginServiceableAreaId,'orig');
            $scope.loadBusinessUnitItem(trucking.DestinationServiceableAreaId,'dest');
        }
        jQuery.magnificPopup.close();
    };
    
    $scope.submit = function () {
        $scope.isError = false;
        $scope.errorMessage = "";

        $scope.apiUpdateTruckingWB();
        $scope.focusOnTop();
    };

    // Initialization routines
    var init = function () {
        $scope.initTruckingItem();
        $scope.loadData();
    };

    init();
};