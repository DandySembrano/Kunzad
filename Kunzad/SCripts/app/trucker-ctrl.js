//---------------------------------------------------------------------------------//
// Filename: trucker-ctrl.js
// Description: Controller for Trucker
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("TruckerController", function ($rootScope, $scope, $http) {
    //------------------------------------------------------------------------------//
    // Required controller properties. should be present in all dataTable controller
    $scope.modelName = "Trucker";
    $scope.modelhref = "#/truckers";
    $scope.truckerGridOptions = {};
    $scope.truckerGridOptions.data = [];
    $scope.truckerGridOptions.dataItem;
    $scope.truckList = [];
    var pageSize = 20;

    $scope.isPrevPage = false;
    $scope.isNextPage = true;
    $scope.actionMode = "Create";
    $scope.selected = null;
    $scope.currentPage = 1;
    $scope.viewOnly = true;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.isErrorTruck = false;
    $scope.errorMessageTruck = "";
    $scope.submitButtonText = "Submit";
    //------------------------------------------------------------------------------//
    $scope.tabPages = ["Trucker", "Truck"];
    $scope.selectedTab = "Trucker";
    $scope.showForm = false;
    $scope.truckIdDummy = 0;
    $scope.truckerIdHolder = 0;
    //------------------------------ process truck pagination------------------------
    $scope.truckCurrentPage = 1;
    $scope.truckPageSize = 20;
    $scope.truckMaxPage = 0;
    $scope.paginatedTrucks = [];
    $scope.processTruckPagination = function (truckCurrentPage, action) {
        $scope.firstPageTrucks = false;
        $scope.lastPageTrucks = false;
        $scope.previousPageTrucks = false;
        $scope.nextPageTrucks = false;
        $scope.paginatedTrucks = [];

        //Initialize truckMaxPage
        if ($scope.truckList.length >= $scope.truckPageSize) {
            if (($scope.truckList.length % $scope.truckPageSize) == 0)
                $scope.truckMaxPage = $scope.truckList.length / $scope.truckPageSize;
            else
                $scope.truckMaxPage = Math.ceil($scope.truckList.length / $scope.truckPageSize);
        }
        else
            $scope.truckMaxPage = 1;

        var begin = 0
        var end = 0;
        //First Page
        if (truckCurrentPage == 1 && !(action == 'LASTPAGE')) {
            if ($scope.truckMaxPage > 1) {
                $scope.nextPageTrucks = true;
                $scope.lastPageTrucks = true;
            }
            else {
                $scope.nextPageTrucks = false;
                $scope.lastPageTrucks = false;
            }
            $scope.firstPageTrucks = false;
            $scope.previousPageTrucks = false;
            if ($scope.truckList.length >= $scope.truckPageSize)
                end = $scope.truckPageSize;
            else
                end = $scope.truckList.length;

            for (i = begin ; i < end; i++) {
                $scope.paginatedTrucks.push($scope.truckList[i]);
            }
        }
            //Last Page
        else if (truckCurrentPage == $scope.truckMaxPage || action == 'LASTPAGE') {
            $scope.truckCurrentPage = $scope.truckMaxPage;
            truckCurrentPage = $scope.truckCurrentPage;

            if ($scope.truckMaxPage == 1) {
                $scope.firstPageTrucks = false;
                $scope.previousPageTrucks = false;
            }
            else {
                $scope.firstPageTrucks = true;
                $scope.previousPageTrucks = true;
            }
            $scope.lastPageTrucks = false;
            $scope.nextPageTrucks = false;
            begin = (truckCurrentPage - 1) * $scope.truckPageSize;
            end = $scope.truckList.length;
            for (i = begin ; i < end; i++) {
                $scope.paginatedTrucks.push($scope.truckList[i]);
            }
        }
            //Previous and Next
        else {
            $scope.firstPageTrucks = true;
            $scope.lastPageTrucks = true;
            $scope.previousPageTrucks = true;
            $scope.nextPageTrucks = true;
            begin = (truckCurrentPage - 1) * $scope.truckPageSize;
            end = begin + $scope.truckPageSize;
            for (i = begin ; i < end; i++) {
                $scope.paginatedTrucks.push($scope.truckList[i]);
            }
        }
    };
    //-------------------------------------------------------------------------------
    //Initialize ui-grid options---------------------------------------
    $scope.initTruckerGridOptions = function () {
        var columns = [];
        $scope.truckerHeader = ['Name', 'Tin Number', 'Street Address 1', 'Street Address 2', 'City/Municipality', 'Postal Code', 'No'];
        $scope.truckerKeys = ['Name', 'TIN', 'Line1', 'Line2', 'CityMunicipality.Name', 'PostalCode'];
        $scope.truckerType = ['String', 'String', 'String', 'String', 'String', 'String'];

        //Initialize Number Listing
        var columnProperties = {};
        columnProperties.name = $scope.truckerHeader[$scope.truckerHeader.length - 1];
        columnProperties.field = 'No';
        columnProperties.cellTemplate = '<div class="ui-grid-cell-contents text-center">{{row.entity.No = (grid.appScope.currentPage == 1 ? (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) : ((grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.currentPage - 1) * grid.appScope.pageSize)))}}</div>';
        columnProperties.width = 40;
        columnProperties.enableColumnResizing = true;
        columnProperties.enableColumnMenu = false;
        columnProperties.enableColumnMoving = false;
        columns.push(columnProperties);
        //Initialize column data
        for (var i = 0; i < ($scope.truckerHeader.length - 1) ; i++) {
            var columnProperties = {};
            columnProperties.name = $scope.truckerHeader[i];
            columnProperties.field = $scope.truckerKeys[i];
            //format field value
            columnProperties.cellFilter = $scope.filterValue($scope.truckerType[i]);
            columns.push(columnProperties);
        }
        $scope.truckerGridOptions = {
            columnDefs: columns,
            rowTemplate: '<div>' +
                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id)"  context-menu="grid.appScope.setSelected(row.entity.Id)" data-target= "DataTableMenu"></div>' +
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
            default:
                format = 'Default';
        }
        return format;
    };

    //Format the TIN number
    $scope.formatTIN = function () {
        if ($scope.truckerGridOptions.dataItem.TIN.length == 3)
            $scope.truckerGridOptions.dataItem.TIN = $scope.truckerGridOptions.dataItem.TIN + "-";
        if ($scope.truckerGridOptions.dataItem.TIN.length == 7)
            $scope.truckerGridOptions.dataItem.TIN = $scope.truckerGridOptions.dataItem.TIN + "-";
    };

    $scope.initializeHeaderName = function () {
        if ($scope.truckerGridOptions.dataItem.Name == "" || $scope.truckerGridOptions.dataItem.Name == null)
            $scope.modelName = "Trucker";
        else
            $scope.modelName = "Trucker(" + $scope.truckerGridOptions.dataItem.Name + ")";
    };

    // Get Truck Type
    var getTruckTypes = function () {
        $http.get("/api/TruckTypes")
            .success(function (data, status) {
                $scope.TruckTypes = data;
            })
    }

    //search trucker
    $scope.searchTrucker = function (id) {
        var i = 0;
        for (i = 0; i < $scope.truckerGridOptions.data.length; i++) {
            if (id == $scope.truckerGridOptions.data[i].Id) {
                return i;
            }
        }
        return i;
    };

    //set dataitem as model for trucker form
    $scope.initDataItem = function () {
        $scope.truckerGridOptions.dataItem = {
            "Id": null,
            "Name": null,
            "TIN": null,
            "Line1": null,
            "Line2": null,
            "CityMunicipalityId": null,
            "PostalCode": null,
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
                        "Name": null
                    }
                }
            },
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null,
            "Trucks": []
        }
    };

    // Get Trucker List
    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/Truckers?page=" + page)
            .success(function (data, status) {
                $scope.truckerGridOptions.data = data;
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
                spinner.stop();
            })
            .error(function (data, status) {
                spinner.stop();
            })
    };

    // Get/Retrieve
    $scope.apiGet = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/Truckers/" + id)
            .success(function (data, status) {
                //copy Trucks data
                $scope.truckerGridOptions.dataItem.Trucks = angular.copy(data.Trucks);
                $scope.truckList = [];
                $scope.truckList = angular.copy($scope.truckerGridOptions.dataItem.Trucks);
                //set truckIdDummy to prevent conflict of Truck Ids
                if ($scope.truckList.length >= 1)
                    $scope.truckIdDummy = $scope.truckList[$scope.truckList.length - 1].Id;
                //process trucks pagination
                $scope.processTruckPagination($scope.truckCurrentPage);
                spinner.stop();
            })
            .error(function (data, status) {
                $scope.showFormError(status);
                $scope.selectedTab = $scope.tabpages[0];
                spinner.stop();
            })

    };

    // Create/Insert New Trucker/Truck(s)
    $scope.apiCreate = function () {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0;
        var dataModel = angular.copy($scope.truckerGridOptions.dataItem);
        dataModel.Trucks = angular.copy($scope.truckList);

        for (i = 0; i < dataModel.Trucks.length; i++) {
            //initialize truckerId to 1 as dummy
            dataModel.Trucks[i].TruckerId = -1;
            delete dataModel.Trucks[i].Id;
            delete dataModel.Trucks[i].TruckType;
            delete dataModel.Trucks[i].Trucker;
            delete dataModel.Trucks[i].Truckings;
        }
        //initialize datamodel to dataitem
        //Delete fields that will not be included in saving data
        delete dataModel.Id;
        delete dataModel.CityMunicipality;
        //save truckers
        $http.post("/api/Truckers", dataModel)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    ////Initialize TruckerId
                    //$scope.truckerGridOptions.dataItem.Id = angular.copy(data.Id);
                    $scope.truckerGridOptions.data.push(data.objParam1);
                    //initialize TruckId
                    //for (i = 0; i < $scope.truckList.length; i++)
                    //    $scope.truckList[i].Id = angular.copy(data.Trucks[i].Id);
                    $scope.closeForm();
                    spinner.stop();
                }
                else {
                    $scope.showFormError(data.message);
                    $scope.selectedTab = $scope.tabPages[0];
                    spinner.stop();
                }
            })
            .error(function (data, status) {
                $scope.showFormError(status);
                $scope.selectedTab = $scope.tabPages[0];
                spinner.stop();
            })
    };

    // Update Trucker/Truck(s)
    $scope.apiUpdate = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0, j = 0;

        var dataModel = angular.copy($scope.truckerGridOptions.dataItem);
        dataModel.Trucks = angular.copy($scope.truckList);
        for (i = 0; i < dataModel.Trucks.length; i++) {
            //delete if truckId if newly added truck
            if (dataModel.Trucks[i].Id == null)
                delete dataModel.Trucks[i].Id;
            //delete null properties
            delete dataModel.Trucks[i].Trucker;
            delete dataModel.Trucks[i].Truckings;
            delete dataModel.Trucks[i].TruckType;
        }
        // initialize datamodel to dataitem
        // Delete fields that will not be included in saving data
        delete dataModel.CityMunicipality;
        $http.put("/api/Truckers/" + id, dataModel)
            .success(function (data, status) {
                //initialize trucker info
                if (data.status == "SUCCESS") {
                    $scope.truckerGridOptions.data[$scope.selected] = [];
                    $scope.truckerGridOptions.data[$scope.selected] = angular.copy(data.objParam1);
                    //initialize TruckId
                    //for (i = 0; i < $scope.truckList.length; i++) {
                    //    $scope.truckList[i].Id = angular.copy($scope.truckerGridOptions.data[$scope.selected].Trucks[i].Id);
                    //}
                    $scope.closeForm();
                    spinner.stop();
                }
                else {
                    $scope.showFormError(data.message);
                    $scope.selectedTab = $scope.tabPages[0];
                    spinner.stop();
                }
            })
            .error(function (data, status) {
                $scope.showFormError(status);
                $scope.selectedTab = $scope.tabPages[0];
                spinner.stop();
            })
    };

    // Delete
    $scope.apiDelete = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.delete("/api/Truckers/" + id)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.truckerGridOptions.data.splice($scope.selectedTruckerIndex, 1);
                    $scope.closeForm();
                    spinner.stop();
                }
                else {
                    $scope.showFormError(data.message);
                    $scope.selectedTab = $scope.tabPages[0];
                    spinner.stop();
                }
            })
            .error(function (data, status) {
                $scope.showFormError(status);
                $scope.selectedTab = $scope.tabPages[0];
                spinner.stop();
            })
    };

    $scope.setSelected = function (id) {
        $scope.truckerIdHolder = id;
    };

    $scope.selectedTruckerIndex = null;

    $scope.actionForm = function (action) {
        //required if module include municipalities------
        $scope.country = $rootScope.country;
        $scope.cityMunicipalities = $rootScope.getCityMunicipalities();
        //-----------------------------------------------
        $scope.tabPages = ["Trucker", "Truck"];
        $scope.selectedTab = $scope.tabPages[0];
        $scope.actionMode = action;
        $scope.selectedTruckerIndex = $scope.searchTrucker($scope.truckerIdHolder);
        switch ($scope.actionMode) {
            case "Create":
                $scope.truckList = [];
                $scope.initDataItem();
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.showForm = true;
                $scope.truckIdDummy = 0;
                break;
            case "Edit":
                $scope.truckerGridOptions.dataItem = [];
                $scope.truckerGridOptions.dataItem = angular.copy($scope.truckerGridOptions.data[$scope.selectedTruckerIndex]);
                $scope.apiGet($scope.truckerGridOptions.data[$scope.selectedTruckerIndex].Id);
                $scope.initializeHeaderName();
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.showForm = true;
                break;
            case "Delete":
                $scope.truckerGridOptions.dataItem = [];
                $scope.truckerGridOptions.dataItem = angular.copy($scope.truckerGridOptions.data[$scope.selectedTruckerIndex]);
                $scope.apiGet($scope.truckerGridOptions.data[$scope.selectedTruckerIndex].Id);
                $scope.initializeHeaderName();
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                $scope.showForm = true;
                break;
            case "View":
                $scope.truckerGridOptions.dataItem = [];
                $scope.truckerGridOptions.dataItem = angular.copy($scope.truckerGridOptions.data[$scope.selectedTruckerIndex]);
                $scope.apiGet($scope.truckerGridOptions.data[$scope.selectedTruckerIndex].Id);
                $scope.initializeHeaderName();
                $scope.viewOnly = true;
                $scope.submitButtonText = "Close";
                $scope.showForm = true;
                break;
        }
    };

    $scope.openModalForm = function (panel) {
        $scope.isError = false;
        $scope.isErrorTruck = false;
        openModalPanel(panel);
    }

    $scope.closeModalForm = function () {
        jQuery.magnificPopup.close();
        $scope.isError = false;
    }

    $scope.closeForm = function () {
        $scope.isError = false;
        $scope.showForm = false;
        $scope.modelName = "Trucker";
    }

    $scope.showFormError = function (message) {
        $scope.isError = true;
        $scope.errorMessage = message;
    }

    // Validate Form Data Entry
    function validateEntry() {
        if ($scope.truckerGridOptions.dataItem.Name == null || $scope.truckerGridOptions.dataItem.Name == "") {
            $scope.showFormError("Trucker name is required.");
            $scope.selectedTab = $scope.tabPages[0];
            return false;
        }
        else if ($scope.truckerGridOptions.dataItem.CityMunicipalityId == null || $scope.truckerGridOptions.dataItem.CityMunicipalityId == "") {
            $scope.showFormError("City/Municipality is required.");
            $scope.selectedTab = $scope.tabPages[0];
            return false;
        }
        return true;
    }

    $scope.submit = function () {
        switch ($scope.actionMode) {
            case "Create":
                if (validateEntry()) {
                    $scope.apiCreate();
                }
                break;
            case "Edit":
                if (validateEntry()) {
                    $scope.apiUpdate($scope.truckerGridOptions.dataItem.Id);
                }
                break;
            case "Delete":
                $scope.openModalForm('#modal-panel-confirmation');
                break;
            case "View":
                $scope.closeForm();
                break;
        }
    }

    $scope.setSelectedTab = function (tab) {
        $scope.selectedTab = tab;
    };

    $scope.TruckAction = null;
    $scope.selectedTruckIndex = null;

    //set truck as model for truck form
    $scope.initTruck = function () {
        $scope.Truck = {
            "Trucker": {
                "Id": null,
                "Name": null,
                "TIN": null,
                "Line1": null,
                "Line2": null,
                "CityMunicipalityId": null,
                "PostalCode": null,
            },
            "TruckType": {
                "Trucks": [],
                "Id": null,
                "Type": null,
                "WeightCapacity": null,
                "VolumeCapacity": null,
            },
            "Truckings": [],
            "Id": null,
            "PlateNo": null,
            "TruckTypeId": null,
            "TruckerId": null
        }
    };

    $scope.showFormErrorTruck = function (message) {
        $scope.isErrorTruck = true;
        $scope.errorMessageTruck = message;
    };

    function validateTruck() {
        if ($scope.Truck.PlateNo == null || $scope.Truck.PlateNo == "") {
            $scope.showFormErrorTruck("Plate number is required.");
            return false;
        }
        else if ($scope.Truck.TruckTypeId == null || $scope.Truck.TruckTypeId == "") {
            $scope.showFormErrorTruck("Type is required.");
            return false;
        }
        return true;
    };

    $scope.selectTruckType = function (id) {
        var truckType = null;
        for (i = 0; i < $scope.TruckTypes.length; i++) {
            if ($scope.TruckTypes[i].Id === id) {
                truckType = $scope.TruckTypes[i]
            }
        }
        $scope.Truck.TruckType = truckType;
    };

    // Create/Insert Truck
    $scope.apiCreateTruck = function () {
        $scope.truckIdDummy = $scope.truckIdDummy + 1;
        $scope.Truck.Id = $scope.truckIdDummy;
        $scope.Truck.TruckerId = $scope.truckerGridOptions.dataItem.Id;
        $scope.Truck.PlateNo = angular.uppercase($scope.Truck.PlateNo);
        $scope.Truck.WeightCapacity = $scope.Truck.TruckType.WeightCapacity;
        $scope.Truck.VolumeCapacity = $scope.Truck.TruckType.VolumeCapacity;
        $scope.truckList.push($scope.Truck);
        $scope.processTruckPagination($scope.truckCurrentPage, 'LASTPAGE');
        $scope.closeModalForm();
    };

    //Update Truck
    $scope.apiUpdateTruck = function () {
        $scope.Truck.PlateNo = angular.uppercase($scope.Truck.PlateNo);
        $scope.Truck.WeightCapacity = $scope.Truck.TruckType.WeightCapacity;
        $scope.Truck.VolumeCapacity = $scope.Truck.TruckType.VolumeCapacity;
        $scope.truckList[$scope.selectedTruckIndex] = angular.copy($scope.Truck);
        $scope.processTruckPagination($scope.truckCurrentPage, '');
        $scope.closeModalForm();
    };

    //Delete Truck
    $scope.apiDeleteTruck = function () {
        $scope.truckList.splice($scope.selectedTruckIndex, 1);
        $scope.processTruckPagination($scope.truckCurrentPage, '');
        $scope.closeModalForm();
    }

    //search truck
    $scope.searchTruck = function (id) {
        var i = 0;
        for (i = 0; i < $scope.truckList.length; i++) {
            if (id == $scope.truckList[i].Id) {
                return i;
            }
        }
        return i;
    };

    $scope.setSelectedTruck = function (id) {
        $scope.selectedTruckIndex = $scope.searchTruck(id);
    };

    //Manage opening of modal
    $scope.openTruckForm = function (action) {
        $scope.TruckAction = action;
        $scope.viewOnly = false;
        switch ($scope.TruckAction) {
            case "Create":
                $scope.initTruck();
                $scope.openModalForm('#modal-panel-truck')
                break;
            case "Edit":
                $scope.Truck = angular.copy($scope.truckList[$scope.selectedTruckIndex]);
                $scope.openModalForm('#modal-panel-truck')
                break;
            case "Delete":
                $scope.Truck = $scope.truckList[$scope.selectedTruckIndex];
                $scope.viewOnly = false;
                $scope.openModalForm('#modal-panel-truck')
                break;
            case "View":
                $scope.Truck = $scope.truckList[$scope.selectedTruckIndex];
                $scope.viewOnly = true;
                $scope.openModalForm('#modal-panel-truck')
                break;
        }
    };

    //Manage saving of truck
    $scope.saveTruck = function (action) {
        switch (action) {
            case "Create":
                if (validateTruck())
                    $scope.apiCreateTruck();
                break;
            case "Edit":
                if (validateTruck())
                    $scope.apiUpdateTruck();
                break;
            case "Delete":
                if (validateTruck())
                    $scope.apiDeleteTruck();
                break;
            case "View":
                $scope.closeModalForm();
                break;
        }
    };

    //Initialize CityMunicipality property of dataItem
    $scope.onSelectCity = function ($item, $model, $label) {
        $scope.truckerGridOptions.dataItem.CityMunicipalityId = $item.Id;
        $scope.truckerGridOptions.dataItem.CityMunicipality.Id = $item.Id;
        $scope.truckerGridOptions.dataItem.CityMunicipality.Name = $item.Name;
        $scope.truckerGridOptions.dataItem.CityMunicipality.StateProvince.Id = $item.StateProvinceId;
        $scope.truckerGridOptions.dataItem.CityMunicipality.StateProvince.Name = $item.StateProvinceName;
        $scope.truckerGridOptions.dataItem.CityMunicipality.StateProvince.Country.Id = $scope.Country.Id;
        $scope.truckerGridOptions.dataItem.CityMunicipality.StateProvince.Country.Name = $scope.Country.Name;
    };

    // Initialization routines
    var init = function () {
        // Call function to load data during content load
        $scope.loadData($scope.currentPage);
        $scope.initTruckerGridOptions();
        getTruckTypes();

    }
    init();
});