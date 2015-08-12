//---------------------------------------------------------------------------------//
// Filename: shippinglines-ctrl.js
// Description: Controller for Shipping Lines Controller
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("ShippingLinesController", function ($scope, $http, $filter) {
    //------------------------------------------------------------------------------//
    $scope.modelName = "Shipping Lines";
    $scope.modelhref = "#/shippinglines";
    $scope.shippingLineGridOptions = {};
    $scope.shippingLineGridOptions.data = [];
    $scope.vesselGridOptions = {};
    $scope.vesselGridOptions.data = [];
    $scope.shippingLineItem;
    $scope.vesselGridOptions.data = [];
    $scope.vesselItem;
    $scope.voyageGridOptions = {};
    $scope.voyageList = [];
    $scope.voyageItem;
    $scope.showVoyage = false;
    $scope.isPrevPage = false;
    $scope.isNextPage = true;
    $scope.selected = null;
    $scope.currentPage = 1;
    $scope.viewOnly = true;
    $scope.isError = false;
    $scope.isErrorVessel = false;
    $scope.isErrorVoyage = false;
    $scope.errorMessageVessel = false;
    $scope.showVoyageHeader = false;
    $scope.submitButtonText = "Submit";
    $scope.actionMode = "Create";
    $scope.errorMessage = "";
    $scope.vesselIdDummy = 0;
    $scope.voyageIdDummy = 0;
    $scope.vesselIdHolder = 0;
    $scope.edd = "";
    $scope.ead = "";
    $scope.dd = "";
    $scope.ad = "";
    $scope.businesUnits = [];
    var pageSize = 20;
    $scope.vesselNameHolder = "";

    $scope.tabPages = ["Shipping Line", "Vessels"];
    $scope.selectedTab = "General";
    $scope.showForm = false;
    $scope.slIDholder = 0;
    $scope.vesselIDholder = 0;
    $scope.selectedSLIndex = null;
    //------------------------------------------------------------------
    //--------------------------Vessel Pagination-----------------------
    $scope.vesselCurrentPage = 1;
    $scope.vesselPageSize = 20;
    $scope.vesselMaxPage = 0;
    $scope.paginatedVessels = [];
    $scope.processVesselPagination = function (vesselCurrentPage, action) {
        $scope.firstPageVessels = false;
        $scope.lastPageVessels = false;
        $scope.previousPageVessels = false;
        $scope.nextPageVessels = false;
        $scope.paginatedVessels = [];

        //Initialize vesselMaxPage
        if ($scope.vesselGridOptions.data.length >= $scope.vesselPageSize) {
            if (($scope.vesselGridOptions.data.length % $scope.vesselPageSize) == 0)
                $scope.vesselMaxPage = $scope.vesselGridOptions.data.length / $scope.vesselPageSize;
            else
                $scope.vesselMaxPage = Math.ceil($scope.vesselGridOptions.data.length / $scope.vesselPageSize);
        }
        else
            $scope.vesselMaxPage = 1;

        var begin = 0
        var end = 0;
        //First Page
        if (vesselCurrentPage == 1 && !(action == 'LASTPAGE')) {
            if ($scope.vesselMaxPage > 1) {
                $scope.nextPageVessels = true;
                $scope.lastPageVessels = true;
            }
            else {
                $scope.nextPageVessels = false;
                $scope.lastPageVessels = false;
            }
            $scope.firstPageVessels = false;
            $scope.previousPageVessels = false;
            if ($scope.vesselGridOptions.data.length >= $scope.vesselPageSize)
                end = $scope.vesselPageSize;
            else
                end = $scope.vesselGridOptions.data.length;

            for (i = begin ; i < end; i++) {
                $scope.paginatedVessels.push($scope.vesselGridOptions.data[i]);
            }
        }
            //Last Page
        else if (vesselCurrentPage == $scope.vesselMaxPage || action == 'LASTPAGE') {
            $scope.vesselCurrentPage = $scope.vesselMaxPage;
            vesselCurrentPage = $scope.vesselCurrentPage;

            if ($scope.vesselMaxPage == 1) {
                $scope.firstPageVessels = false;
                $scope.previousPageVessels = false;
            }
            else {
                $scope.firstPageVessels = true;
                $scope.previousPageVessels = true;
            }
            $scope.lastPageVessels = false;
            $scope.nextPageVessels = false;
            begin = (vesselCurrentPage - 1) * $scope.vesselPageSize;
            end = $scope.vesselGridOptions.data.length;
            for (i = begin ; i < end; i++) {
                $scope.paginatedVessels.push($scope.vesselGridOptions.data[i]);
            }
        }
            //Previous and Next
        else {
            $scope.firstPageVessels = true;
            $scope.lastPageVessels = true;
            $scope.previousPageVessels = true;
            $scope.nextPageVessels = true;
            begin = (vesselCurrentPage - 1) * $scope.vesselPageSize;
            end = begin + $scope.vesselPageSize;
            for (i = begin ; i < end; i++) {
                $scope.paginatedVessels.push($scope.vesselGridOptions.data[i]);
            }
        }
    };
    //--------------------------End of Vessel Pagination-----------------
    //--------------------------Voyage Pagination-----------------------
    $scope.voyageCurrentPage = 1;
    $scope.voyagePageSize = 20;
    $scope.voyageMaxPage = 0;
    $scope.voyageGridOptions.data = [];
    $scope.processVoyagePagination = function (voyageCurrentPage, action) {
        $scope.firstPageVoyage = false;
        $scope.lastPageVoyage = false;
        $scope.previousPageVoyage = false;
        $scope.nextPageVoyage = false;
        $scope.filteredVoyage = [];
        $scope.voyageGridOptions.data = [];

        var i = 0;
        for (i = 0; i < $scope.voyageList.length; i++) {
            if ($scope.vesselIdHolder == $scope.voyageList[i].VesselId)
                $scope.filteredVoyage.push($scope.voyageList[i]);
        }
        //Initialize voyageMaxPage
        if ($scope.filteredVoyage.length >= $scope.voyagePageSize) {
            if (($scope.filteredVoyage.length % $scope.voyagePageSize) == 0)
                $scope.voyageMaxPage = $scope.filteredVoyage.length / $scope.voyagePageSize;
            else
                $scope.voyageMaxPage = Math.ceil($scope.filteredVoyage.length / $scope.voyagePageSize);
        }
        else
            $scope.voyageMaxPage = 1;

        var begin = 0
        var end = 0;
        //First Page
        if (voyageCurrentPage == 1 && !(action == 'LASTPAGE')) {
            if ($scope.voyageMaxPage > 1) {
                $scope.nextPageVoyage = true;
                $scope.lastPageVoyage = true;
            }
            else {
                $scope.nextPageVoyage = false;
                $scope.lastPageVoyage = false;
            }
            $scope.firstPageVoyage = false;
            $scope.previousPageVoyage = false;
            if ($scope.filteredVoyage.length >= $scope.voyagePageSize)
                end = $scope.voyagePageSize;
            else
                end = $scope.filteredVoyage.length;

            for (i = begin ; i < end; i++) {
                $scope.voyageGridOptions.data.push($scope.filteredVoyage[i]);
            }
        }
            //Last Page
        else if (voyageCurrentPage == $scope.voyageMaxPage || action == 'LASTPAGE') {
            $scope.voyageCurrentPage = $scope.voyageMaxPage;
            voyageCurrentPage = $scope.voyageCurrentPage;

            if ($scope.voyageMaxPage == 1) {
                $scope.firstPageVoyage = false;
                $scope.previousPageVoyage = false;
            }
            else {
                $scope.firstPageVoyage = true;
                $scope.previousPageVoyage = true;
            }
            $scope.lastPageVoyage = false;
            $scope.nextPageVoyage = false;
            begin = (voyageCurrentPage - 1) * $scope.voyagePageSize;
            end = $scope.filteredVoyage.length;
            for (i = begin ; i < end; i++) {
                $scope.voyageGridOptions.data.push($scope.filteredVoyage[i]);
            }
        }
            //Previous and Next
        else {
            $scope.firstPageVoyage = true;
            $scope.lastPageVoyage = true;
            $scope.previousPageVoyage = true;
            $scope.nextPageVoyage = true;
            begin = (voyageCurrentPage - 1) * $scope.voyagePageSize;
            end = begin + $scope.voyagePageSize;
            for (i = begin ; i < end; i++) {
                $scope.voyageGridOptions.data.push($scope.filteredVoyage[i]);
            }
        }
    };
    //--------------------------End of Voyage Pagination-----------------

    //Initialize ui-grid options---------------------------------------
    $scope.initShippingLineGridOptions = function () {
        var columns = [];
        $scope.shippingLineHeader = ['Name', 'No'];
        $scope.shippingLineKeys = ['Name'];
        $scope.shippingLineType = ['String'];

        //Initialize Number Listing
        var columnProperties = {};
        columnProperties.name = $scope.shippingLineHeader[$scope.shippingLineHeader.length - 1];
        columnProperties.field = 'No';
        columnProperties.cellTemplate = '<div class="ui-grid-cell-contents text-center">{{row.entity.No = (grid.appScope.currentPage == 1 ? (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) : ((grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.currentPage - 1) * grid.appScope.pageSize)))}}</div>';
        columnProperties.width = 40;
        columnProperties.enableColumnResizing = true;
        columnProperties.enableColumnMenu = false;
        columnProperties.enableColumnMoving = false;
        columns.push(columnProperties);
        //Initialize column data
        for (var i = 0; i < ($scope.shippingLineHeader.length - 1) ; i++) {
            var columnProperties = {};
            columnProperties.name = $scope.shippingLineHeader[i];
            columnProperties.field = $scope.shippingLineKeys[i];
            //format field value
            columnProperties.cellFilter = $scope.filterValue($scope.shippingLineType[i]);
            columns.push(columnProperties);
        }
        $scope.shippingLineGridOptions = {
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

    $scope.initVesselGridOptions = function () {
        var columnsVessel = [];
        $scope.vesselHeader = ['Name', 'No'];
        $scope.vesselKeys = ['Name'];
        $scope.vesselType = ['String'];

        //Initialize Number Listing
        var columnPropertiesVessel = {};
        columnPropertiesVessel.name = $scope.vesselHeader[$scope.vesselHeader.length - 1];
        columnPropertiesVessel.field = 'No';
        columnPropertiesVessel.cellTemplate = '<div class="ui-grid-cell-contents text-center">{{row.entity.No = (grid.appScope.vesselCurrentPage == 1 ? (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) : ((grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.vesselCurrentPage - 1) * grid.appScope.vesselPageSize)))}}</div>';
        columnPropertiesVessel.width = 40;
        columnPropertiesVessel.enableColumnResizing = true;
        columnPropertiesVessel.enableColumnMenu = false;
        columnPropertiesVessel.enableColumnMoving = false;
        columnsVessel.push(columnPropertiesVessel);
        //Initialize column data
        for (var i = 0; i < ($scope.vesselHeader.length - 1) ; i++) {
            var columnPropertiesVessel = {};
            columnPropertiesVessel.name = $scope.vesselHeader[i];
            columnPropertiesVessel.field = $scope.vesselKeys[i];
            //format field value
            columnPropertiesVessel.cellFilter = $scope.filterValue($scope.vesselType[i]);
            columnsVessel.push(columnPropertiesVessel);
        }
        $scope.vesselGridOptions = {
            columnDefs: columnsVessel,
            rowTemplate: '<div>' +
                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelectedVessel(row.entity.Id, row.entity.Name)"  context-menu="grid.appScope.setSelectedVessel(row.entity.Id, row.entity.Name)" data-target= "DataTableVessel"></div>' +
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

    $scope.initVoyageGridOptions = function () {
        var columnsVoyage = [];
        $scope.voyageHeader = ['Voyage No', 'Business Unit-Origin', 'Business Unit-Destination', 'Estimated Departure', 'Estimated Arrival', 'Departure', 'Arrival', 'No'];
        $scope.voyageKeys = ['VoyageNo', 'BusinessUnitNameOrigin[0].Name', 'BusinessUnitNameDestination[0].Name', 'EstimatedDepartureTime', 'EstimatedArrivalTime', 'DepartureTime', 'ArrivalTime'];
        $scope.voyageType = ['Default', 'ProperCase', 'ProperCase', 'Time', 'Time', 'Time', 'Time'];

        //Initialize Number Listing
        var columnPropertiesVoyage = {};
        columnPropertiesVoyage.name = $scope.voyageHeader[$scope.voyageHeader.length - 1];
        columnPropertiesVoyage.field = 'No';
        columnPropertiesVoyage.cellTemplate = '<div class="ui-grid-cell-contents text-center">{{row.entity.No = (grid.appScope.voyageCurrentPage == 1 ? (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) : ((grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.voyageCurrentPage - 1) * grid.appScope.voyagePageSize)))}}</div>';
        columnPropertiesVoyage.width = 40;
        columnPropertiesVoyage.enableColumnResizing = true;
        columnPropertiesVoyage.enableColumnMenu = false;
        columnPropertiesVoyage.enableColumnMoving = false;
        columnsVoyage.push(columnPropertiesVoyage);
        //Initialize column data
        for (var i = 0; i < ($scope.voyageHeader.length - 1) ; i++) {
            var columnPropertiesVoyage = {};
            columnPropertiesVoyage.name = $scope.voyageHeader[i];
            columnPropertiesVoyage.field = $scope.voyageKeys[i];
            //format field value
            columnPropertiesVoyage.cellFilter = $scope.filterValue($scope.voyageType[i]);
            columnsVoyage.push(columnPropertiesVoyage);
        }
        $scope.voyageGridOptions = {
            columnDefs: columnsVoyage,
            rowTemplate: '<div>' +
                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelectedVoyage(row.entity.Id)"  context-menu="grid.appScope.setSelectedVoyage(row.entity.Id)" data-target= "DataTableVoyage"></div>' +
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
    //-----------------------------------------------------------------
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

    //Set the focus on top of the page during load
    $scope.focusOnTop = function () {
        $(document).ready(function () {
            $(this).scrollTop(0);
        });
    };

    //Initialize tab 1 and tab 2 name
    $scope.initializeHeaderName = function () {
        if ($scope.shippingLineItem.Name == "" || $scope.shippingLineItem.Name == null)
            $scope.modelName = "Shipping Lines";
        else
            $scope.modelName = "Shipping Line(" + $scope.shippingLineItem.Name + ")";
    }

    //initialize shippingLineItem
    $scope.initializeShippingLineItem = function ()
    {
        $scope.shippingLineItem = {
            "Id": null,
            "Name": null,
            "CreatedDate": null,
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null,
            "Vessels" : [],
        };
    }

    //Retrieve shipping lines
    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0;
        $http.get("/api/ShippingLines?page=" + page)
            .success(function (data, status) {
                //initialize shipping line
                $scope.shippingLineGridOptions.data = data;
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
            })
    };

    //Retrieve business units
    $scope.getBusinessUnits = function () {
        $http.get('/api/BusinessUnits')
        .success(function (data, status) {
            $scope.businesUnits = angular.copy(data);
        })
        .error(function (data, status) {
            $scope.showFormError(status);
            $scope.selectedTab = $scope.tabPages[0];
        })
    };

    //initialized when user delete, update or view a record in the shipping line list
    $scope.setSelected = function (id) {
        $scope.slIDholder = id;
    };

    //search ShippingLine
    $scope.searchSL = function (id) {
        var i = 0;
        for (i = 0; i < $scope.shippingLineGridOptions.data.length; i++) {
            if (id == $scope.shippingLineGridOptions.data[i].Id) {
                return i;
            }
        }
        return i;
    };

    //initialized when user changes tab
    $scope.setSelectedTab = function (tab) {
        if (tab == $scope.tabPages[2])
            return;
        $scope.tabPages = [$scope.tabPages[0], $scope.tabPages[1]];
        $scope.selectedTab = tab;
    };

    //open modal panel
    $scope.openModalForm = function (panel) {
        $scope.isError = false;
        $scope.isErrorVessel = false;
        $scope.isErrorVoyage = false;
        openModalPanel(panel);
    };

    //closes the form
    $scope.closeForm = function () {
        $scope.isError = false;
        $scope.showForm = false;
        $scope.modelName = "Shipping Lines";
    };

    //close modal
    $scope.closeModalForm = function () {
        jQuery.magnificPopup.close();
        $scope.isError = false;
    };

    //manage the error message
    $scope.showFormError = function (message) {
        $scope.isError = true;
        $scope.errorMessage = message;
    };

    // Initialize Voyage
    $scope.apiGet = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0;
        $http.get("/api/VesselVoyages?shippingLineId=" + id)
        .success(function (data, status) {
            $scope.voyageList = [];
            //initialize Vessel Voyages
            $scope.voyageList = angular.copy(data);
            //format date fields
            for (i = 0; i < $scope.voyageList.length; i++)
            {
                $scope.voyageList[i].EstimatedDepartureDate = $filter('date')($scope.voyageList[i].EstimatedDepartureDate, "MM/dd/yyyy");
                $scope.voyageList[i].EstimatedArrivalDate = $filter('date')($scope.voyageList[i].EstimatedArrivalDate, "MM/dd/yyyy");
                $scope.voyageList[i].DepartureDate = $filter('date')($scope.voyageList[i].DepartureDate, "MM/dd/yyyy");
                $scope.voyageList[i].ArrivalDate = $filter('date')($scope.voyageList[i].ArrivalDate, "MM/dd/yyyy");
            }
            //set voyageIdDummy to prevent conflict of Voyage Ids
            if ($scope.voyageList.length >= 1)
            {
                $scope.voyageIdDummy = $scope.voyageList[$scope.voyageList.length - 1].Id;
            }
            spinner.stop();
        })
        .error(function (data, status) {
            $scope.showFormError("Error: " + status);
            $scope.selectedTab = $scope.tabPages[0];
            spinner.stop();
        })
    };
   
    // Save Shipping Line
    $scope.apiCreate = function () {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0, j = 0;
        //---------------------------------------customize object for easy saving of data------------------------------
        $scope.shippingLineItem.Vessels = angular.copy($scope.vesselGridOptions.data);
        for (j = 0; j < $scope.shippingLineItem.Vessels.length; j++) {
            for (i = 0; i < $scope.voyageList.length; i++) {
                if ($scope.shippingLineItem.Vessels[j].Id == $scope.voyageList[i].VesselId)
                    //insert Voyage
                    $scope.shippingLineItem.Vessels[j].VesselVoyages.push($scope.voyageList[i]);
            }
        }
        var shippingLineModel = angular.copy($scope.shippingLineItem);
        //remove shippingLineId
        delete shippingLineModel.Id;
        for (j = 0; j < shippingLineModel.Vessels.length; j++) {
            //remove vesselId
            delete shippingLineModel.Vessels[j].Id
            for (i = 0; i < shippingLineModel.Vessels[j].VesselVoyages.length; i++) {
                //remove VesselVoyageId
                shippingLineModel.Vessels[j].VesselVoyages[i].VesselId = -1;
                delete shippingLineModel.Vessels[j].VesselVoyages[i].Id;
                delete shippingLineModel.Vessels[j].VesselVoyages[i].BusinessUnitNameOrigin;
                delete shippingLineModel.Vessels[j].VesselVoyages[i].BusinessUnitNameDestination;
                delete shippingLineModel.Vessels[j].VesselVoyages[i].ItemStatus;
            }
        }
        //--------------------------------------End of customization---------------------------------------
        $http.post("/api/ShippingLines", shippingLineModel)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    //Add Shipping Line in the list
                    $scope.shippingLineGridOptions.data.push(data.objParam1);
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

    //Update Shipping Line
    $scope.apiUpdate = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0, j = 0;
        //---------------------------------------customize object for easy saving of data------------------------------
        //insert vessels
        $scope.shippingLineItem.Vessels = [];
        $scope.shippingLineItem.Vessels = angular.copy($scope.vesselGridOptions.data);
        for (j = 0; j < $scope.shippingLineItem.Vessels.length; j++) {
            //reset Vessel Voyages
            $scope.shippingLineItem.Vessels[j].VesselVoyages = [];
            for (i = 0; i < $scope.voyageList.length; i++) {
                if ($scope.shippingLineItem.Vessels[j].Id == $scope.voyageList[i].VesselId)
                    //insert Voyages
                    $scope.shippingLineItem.Vessels[j].VesselVoyages.push($scope.voyageList[i]);
            }
        }
        var shippingLineModel = angular.copy($scope.shippingLineItem);
        for (j = 0; j < shippingLineModel.Vessels.length; j++) {
            //Check if newly added vessel
            if (shippingLineModel.Vessels[j].ShippingLineId == -1) {
                //remove vesselId
                delete shippingLineModel.Vessels[j].Id;
                //Add Vessel Voyages
                for (i = 0; i < shippingLineModel.Vessels[j].VesselVoyages.length; i++) {
                    //if (shippingLineModel.Vessels[j].VesselVoyages[i].Id) {
                        //remove VesselVoyageId
                        shippingLineModel.Vessels[j].VesselVoyages[i].VesselId = -1;
                        delete shippingLineModel.Vessels[j].VesselVoyages[i].Id;
                        delete shippingLineModel.Vessels[j].VesselVoyages[i].BusinessUnitNameOrigin;
                        delete shippingLineModel.Vessels[j].VesselVoyages[i].BusinessUnitNameDestination;
                        delete shippingLineModel.Vessels[j].VesselVoyages[i].ItemStatus;
                    //}
                }
            }
            else {
                for (i = 0; i < shippingLineModel.Vessels[j].VesselVoyages.length; i++) {
                    //Add Vessel Voyages
                    if (shippingLineModel.Vessels[j].VesselVoyages[i].ItemStatus == "New") {
                        //remove VesselVoyageId
                        shippingLineModel.Vessels[j].VesselVoyages[i].VesselId = shippingLineModel.Vessels[j].Id;
                        delete shippingLineModel.Vessels[j].VesselVoyages[i].Id;
                        delete shippingLineModel.Vessels[j].VesselVoyages[i].BusinessUnitNameOrigin;
                        delete shippingLineModel.Vessels[j].VesselVoyages[i].BusinessUnitNameDestination;
                        delete shippingLineModel.Vessels[j].VesselVoyages[i].ItemStatus;
                    }
                    //Edit Vessel Voyages
                    else {
                        //delete Unupdateable column
                        //delete shippingLineModel.Vessels[j].VesselVoyages[i].VesselId;
                        delete shippingLineModel.Vessels[j].VesselVoyages[i].BusinessUnitNameOrigin;
                        delete shippingLineModel.Vessels[j].VesselVoyages[i].BusinessUnitNameDestination;
                        delete shippingLineModel.Vessels[j].VesselVoyages[i].ItemStatus;
                    }
                }
            }
        }
        //--------------------------------------End of customization---------------------------------------
        $http.put("/api/ShippingLines/" + id, shippingLineModel)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    //initialize Shipping Line info
                    $scope.shippingLineGridOptions.data[$scope.selectedSLIndex] = [];
                    $scope.shippingLineGridOptions.data[$scope.selectedSLIndex] = angular.copy(data.objParam1);
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

    // Delete Shipping Line
    $scope.apiDelete = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.delete("/api/ShippingLines/" + id)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.shippingLineGridOptions.data.splice($scope.selectedSLIndex, 1);
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

    //Triggers when user create, delete, update or view a Shipping Line in the list
    $scope.actionForm = function (action) {
        $scope.actionMode = action;
        $scope.selectedSLIndex = $scope.searchSL($scope.slIDholder);
        $scope.tabPages = ["Shipping Line", "Vessels"];
        $scope.selectedTab = $scope.tabPages[0];
        switch ($scope.actionMode) {
            case "Create":
                $scope.vesselIdDummy = 0;
                $scope.voyageIdDummy = 0;
                $scope.vesselGridOptions.data = [];
                $scope.voyageList = [];
                $scope.initializeShippingLineItem();
                //$scope.initializeHeaderName();
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.showForm = true;
                break;
            case "Edit":
                $scope.shippingLineItem = [];
                $scope.shippingLineItem = angular.copy($scope.shippingLineGridOptions.data[$scope.selectedSLIndex]);
                //Store vessel of a shipping line
                $scope.vesselGridOptions.data = [];
                $scope.vesselGridOptions.data = angular.copy($scope.shippingLineGridOptions.data[$scope.selectedSLIndex].Vessels);
                $scope.processVesselPagination($scope.vesselCurrentPage, '');
                $scope.apiGet($scope.shippingLineGridOptions.data[$scope.selectedSLIndex].Id);
                $scope.initializeHeaderName();
                //set vesselIdDummy to prevent conflict of Vessel Ids
                if ($scope.shippingLineItem.Vessels.length >= 1)
                    $scope.vesselIdDummy = $scope.shippingLineItem.Vessels[$scope.shippingLineItem.Vessels.length - 1].Id;
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.showForm = true;
                break;
            case "Delete":
                $scope.shippingLineItem = [];
                $scope.shippingLineItem = angular.copy($scope.shippingLineGridOptions.data[$scope.selectedSLIndex]);
                $scope.vesselGridOptions.data = [];
                $scope.vesselGridOptions.data = angular.copy($scope.shippingLineGridOptions.data[$scope.selectedSLIndex].Vessels);
                $scope.processVesselPagination($scope.vesselCurrentPage, '');
                $scope.apiGet($scope.shippingLineGridOptions.data[$scope.selectedSLIndex].Id);
                $scope.initializeHeaderName();
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                $scope.showForm = true;
                break;
            case "View":
                $scope.shippingLineItem = [];
                $scope.shippingLineItem = angular.copy($scope.shippingLineGridOptions.data[$scope.selectedSLIndex]);
                $scope.vesselGridOptions.data = [];
                $scope.vesselGridOptions.data = angular.copy($scope.shippingLineGridOptions.data[$scope.selectedSLIndex].Vessels);
                $scope.processVesselPagination($scope.vesselCurrentPage, '');
                $scope.apiGet($scope.shippingLineGridOptions.data[$scope.selectedSLIndex].Id);
                $scope.initializeHeaderName();
                $scope.viewOnly = true;
                $scope.submitButtonText = "Close";
                $scope.showForm = true;
                break;
        }
    };

    //triggers when the user click submit button
    $scope.submit = function () {
        switch ($scope.actionMode) {
            case "Create":
                if (validateEntry()) {
                    $scope.apiCreate();
                }
                break;
            case "Edit":
                if (validateEntry()) {
                    $scope.apiUpdate($scope.shippingLineItem.Id);
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

    // validate Entries
    function validateEntry() {
        if ($scope.shippingLineItem.Name == null || $scope.shippingLineItem.Name == "") {
            $scope.showFormError("Name is required.");
            $scope.selectedTab = $scope.tabPages[0];
            return false;
        }
        return true;
    };

    //---------------------------------VESSEL-----------------------------------
    $scope.vesselAction = null;
    $scope.selectedVesselActionIndex = null;

    //Initialize vessel
    $scope.initVessel = function () {
        $scope.vesselItem = {
            "Id": null,
            "Name": null,
            "ShippingLineId": null,
            "CreatedDate": null,
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null,
            "VesselVoyages": []
        };
    };

    //manage the error message
    $scope.showFormErrorVessel = function (message) {
        $scope.isErrorVessel = true;
        $scope.errorMessageVessel = message;
    };

    //delete voyage if state/province is deleted
    $scope.deleteVoyage = function (id) {
        var i = 0;
        for (i = 0; i < $scope.voyageList.length; i++) {
            if (id == $scope.voyageList[i].VesselId) {
                $scope.voyageList.splice(i, 1);
            }
        }
    };

    //search vessel in voyage list
    $scope.searchVessel = function (id) {
        var i = 0;
        for (i = 0; i < $scope.voyageList.length; i++) {
            if (id == $scope.voyageList[i].VesselId) {
                return true;
            }
        }
        return false;
    };

    //search in vessel list
    $scope.searchInVessel = function (id) {
        var i = 0;
        for (i = 0; i < $scope.vesselGridOptions.data.length; i++) {
            if (id == $scope.vesselGridOptions.data[i].Id) {
                return i;
            }
        }
        return i;
    };

    $scope.setSelectedVessel = function (id, vesselName) {
        $scope.selectedVesselActionIndex = $scope.searchInVessel(id);
        $scope.vesselNameHolder = vesselName;
    };

    //Manage in opening of vessel modal
    $scope.openVesselForm = function (action) {
        $scope.vesselAction = action;
        $scope.viewOnly = false;
        switch ($scope.vesselAction) {
            case "Create":
                $scope.initVessel();
                $scope.openModalForm('#modal-panel-vessel')
                break;
            case "Edit":
                $scope.vesselItem = [];
                $scope.vesselItem = angular.copy($scope.vesselGridOptions.data[$scope.selectedVesselActionIndex]);
                $scope.openModalForm('#modal-panel-vessel')
                break;
            case "Delete":
                if ($scope.searchVessel($scope.vesselIdHolder))
                    $scope.showVoyageHeader = true;
                else
                    $scope.showVoyageHeader = false;
                $scope.vesselItem = [];
                $scope.vesselItem = angular.copy($scope.vesselGridOptions.data[$scope.selectedVesselActionIndex]);
                $scope.viewOnly = false;
                $scope.openModalForm('#modal-panel-vessel')
                break;
            case "View":
                $scope.vesselItem = [];
                $scope.vesselItem = angular.copy($scope.vesselGridOptions.data[$scope.selectedVesselActionIndex]);
                $scope.openModalForm('#modal-panel-vessel')
                $scope.viewOnly = true;
                break;
            case "showVoyage":
                //Initialize tab 3 name
                $scope.tabPages[2] = "Voyages";
                $scope.vesselIdHolder = $scope.vesselGridOptions.data[$scope.selectedVesselActionIndex].Id;
                if ($scope.searchVessel($scope.vesselIdHolder))
                    $scope.showVoyageHeader = true;
                else
                    $scope.showVoyageHeader = false;
                $scope.selectedTab = $scope.tabPages[2];
                $scope.processVoyagePagination($scope.voyageCurrentPage, '');
                break;
        }
    };

    //Vessel entry validation
    function validateVessel() {
        //validate here
        if ($scope.vesselItem.Name == null || $scope.vesselItem.Name == "") {
            $scope.showFormErrorVessel("Name is required.");
            return false;
        }
        return true;
    };

    // Create/Insert Vessel
    $scope.apiCreateVessel = function () {
        $scope.vesselIdDummy = $scope.vesselIdDummy + 1;
        $scope.vesselItem.Id = $scope.vesselIdDummy;
        $scope.vesselItem.ShippingLineId = -1;
        $scope.vesselGridOptions.data.push($scope.vesselItem);
        $scope.processVesselPagination($scope.vesselCurrentPage, 'LASTPAGE');
        $scope.closeModalForm();
    };

    //Update Vessel
    $scope.apiUpdateVessel = function () {
        $scope.vesselGridOptions.data[$scope.selectedVesselActionIndex] = angular.copy($scope.vesselItem);
        $scope.processVesselPagination($scope.vesselCurrentPage, '');
        $scope.closeModalForm();
    };

    //Delete Vessel
    $scope.apiDeleteVessel = function () {
        $scope.vesselGridOptions.data.splice($scope.selectedVesselActionIndex, 1);
        $scope.deleteVoyage($scope.vesselItem.Id);
        $scope.processVesselPagination($scope.vesselCurrentPage, '');
        $scope.closeModalForm();
    };

    //Manage saving of Vessel
    $scope.saveVessel = function (action) {
        switch (action) {
            case "Create":
                if (validateVessel())
                    $scope.apiCreateVessel();
                break;
            case "Edit":
                if (validateVessel())
                    $scope.apiUpdateVessel();
                break;
            case "Delete":
                if (validateVessel())
                    $scope.apiDeleteVessel();
                break;
            case "View":
                $scope.closeModalForm();
                break;
        }
    };
    //---------------------------------End of Vessel----------------------------

    //---------------------------------Voyage-----------------------------------

    $scope.voyageAction = null;
    $scope.selectedVoyageActionIndex = null;

    //initialize voyage
    $scope.initVoyage = function () {
        $scope.voyageItem = {
            "Id": null,
            "VesselId": null,
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
            "LastUpdatedByUserId": null,
            "BusinessUnitNameOrigin": [{"Name":''}],
            "BusinessUnitNameDestination": [{ "Name": ''}],
            "ItemStatus": null
        }
        $scope.edd = "";
        $scope.ead = "";
        $scope.dd = "";
        $scope.ad = "";
    };

    //Initialize Business Unit name
    $scope.selectBusinessUnit = function (id, type) {
        var i = 0;
        for (i = 0; i < $scope.businesUnits.length; i++)
        {
            if(id == $scope.businesUnits[i].Id)
            {
                if (type == "origin")
                    $scope.voyageItem.BusinessUnitNameOrigin[0].Name = $scope.businesUnits[i].Name;
                else
                    $scope.voyageItem.BusinessUnitNameDestination[0].Name = $scope.businesUnits[i].Name;
            }
        }
    };

    //initialize holders
    $scope.initializeHolders = function () {  
        $scope.edd = $scope.voyageItem.EstimatedDepartureDate + " " + $scope.voyageItem.EstimatedDepartureTime;
        $scope.ead = $scope.voyageItem.EstimatedArrivalDate + " " + $scope.voyageItem.EstimatedArrivalTime;
        $scope.dd = $scope.voyageItem.DepartureDate + " " + $scope.voyageItem.DepartureTime;
        $scope.ad = $scope.voyageItem.ArrivalDate + " " + $scope.voyageItem.ArrivalTime;
    };

    //initialize date/time fields
    $scope.initializeDateTime = function () {
        var edd = (document.getElementById('edd').value).split(" ");
        var ead = (document.getElementById('ead').value).split(" ");
        var dd = (document.getElementById('dd').value).split(" ");
        var ad = (document.getElementById('ad').value).split(" ");
        $scope.voyageItem.EstimatedDepartureDate = edd[0];
        $scope.voyageItem.EstimatedDepartureTime = edd[1];
        $scope.voyageItem.EstimatedArrivalDate = ead[0];
        $scope.voyageItem.EstimatedArrivalTime = ead[1];
        $scope.voyageItem.DepartureDate = dd[0];
        $scope.voyageItem.DepartureTime = dd[1];
        $scope.voyageItem.ArrivalDate = ad[0];
        $scope.voyageItem.ArrivalTime = ad[1];
    };

    function searchVoyage(id) {
        var i = 0;
        for (i = 0; i < $scope.voyageList.length; i++) {
            if (id == $scope.voyageList[i].Id)
                return i;
        }
    };

    $scope.setSelectedVoyage = function(id)
    {
        $scope.selectedVoyageActionIndex = searchVoyage(id);
    };
    //Manage opening of Voyage modal
    $scope.openVoyageForm = function (action) {
        $scope.voyageAction = action;
        $scope.viewOnly = false;
        switch ($scope.voyageAction) {
            case "Create":
                $scope.initVoyage();
                $scope.openModalForm('#modal-panel-voyage')
                break;
            case "Edit":
                $scope.voyageItem = [];
                $scope.voyageItem = angular.copy($scope.voyageList[$scope.selectedVoyageActionIndex]);
                //initialize holders
                $scope.initializeHolders();
                $scope.openModalForm('#modal-panel-voyage')
                break;
            case "Delete":
                $scope.voyageItem = [];
                $scope.voyageItem = angular.copy($scope.voyageList[$scope.selectedVoyageActionIndex]);
                //initialize holders
                $scope.initializeHolders();
                $scope.viewOnly = false;
                $scope.openModalForm('#modal-panel-voyage')
                break;
            case "View":
                $scope.voyageItem = [];
                $scope.voyageItem = angular.copy($scope.voyageList[$scope.selectedVoyageActionIndex]);
                //initialize holders
                $scope.initializeHolders();
                $scope.viewOnly = true;
                $scope.openModalForm('#modal-panel-voyage')
                break;
        }
    };

    //manage the error message
    $scope.showFormErrorVoyage = function (message) {
        $scope.isErrorVoyage = true;
        $scope.errorMessageVoyage = message;
    };

    function validateVoyage() {
        if ($scope.voyageItem.VoyageNo == null || $scope.voyageItem.VoyageNo == "") {
            $scope.showFormErrorVoyage("Voyage number is required.");
            return false;
        }
        else if ($scope.voyageItem.OriginBusinessUnitId == null || $scope.voyageItem.OriginBusinessUnitId == "") {
            $scope.showFormErrorVoyage("Origin business unit is required.");
            return false;
        }
        else if ($scope.voyageItem.DestinationBusinessUnitId == null || $scope.voyageItem.DestinationBusinessUnitId == "") {
            $scope.showFormErrorVoyage("Destination business unit is required.");
            return false;
        }
        else if ($scope.edd == null || $scope.edd == "") {
            $scope.showFormErrorVoyage("Estimated departure date/time is required.");
            return false;
        }
        else if ($scope.ead == null || $scope.ead == "") {
            $scope.showFormErrorVoyage("Estimated arrival date/time is required.");
            return false;
        }
        else if ($scope.edd > $scope.ead) {
            $scope.showFormErrorVoyage("Estimated departure date/time must be less than Estimated arrival date/time.");
            return false;
        }
        else if (!(($scope.dd == null || $scope.dd == "") && ($scope.ad == null || $scope.ad == ""))) {
            if ($scope.dd > $scope.ad) {
                $scope.showFormErrorVoyage("Estimated departure date/time must be less than Estimated arrival date/time.");
                return false;
            }
        }
        return true;
    };

    // Create/Insert Voyage
    $scope.apiCreateVoyage = function () {
        $scope.initializeDateTime();
        $scope.voyageItem.ItemStatus = "New";
        $scope.voyageItem.VesselId = $scope.vesselIdHolder;
        $scope.voyageIdDummy = $scope.voyageIdDummy + 1;
        $scope.voyageItem.Id = $scope.voyageIdDummy;
        $scope.voyageList.push($scope.voyageItem);
        $scope.showVoyageHeader = true;
        $scope.processVoyagePagination($scope.voyageCurrentPage, 'LASTPAGE');
        $scope.closeModalForm();
    };

    //Update Voyage
    $scope.apiUpdateVoyage = function () {
        $scope.initializeDateTime();
        $scope.voyageList[$scope.selectedVoyageActionIndex] = angular.copy($scope.voyageItem);
        $scope.processVoyagePagination($scope.voyageCurrentPage, '');
        $scope.closeModalForm();
    };

    //Delete Voyage
    $scope.apiDeleteVoyage = function () {
        $scope.voyageList.splice($scope.selectedVoyageActionIndex, 1);
        $scope.closeModalForm();
        if ($scope.searchVessel($scope.vesselIdHolder))
            $scope.showVoyageHeader = true;
        else
            $scope.showVoyageHeader = false;
        $scope.processVoyagePagination($scope.voyageCurrentPage, '');
    };

    //Manage saving of Voyage
    $scope.saveVoyage = function (action) {
        switch (action) {
            case "Create":
                if (validateVoyage())
                    $scope.apiCreateVoyage();
                break;
            case "Edit":
                if (validateVoyage())
                    $scope.apiUpdateVoyage();
                break;
            case "Delete":
                if (validateVoyage())
                    $scope.apiDeleteVoyage();
                break;
            case "View":
                $scope.closeModalForm();
                break;
        }
    };

    //---------------------------------End of Voyage----------------------------

    // Initialization routines
    var init = function () {
        // Call function to load data during content load
        $scope.loadData($scope.currentPage);
        $scope.initShippingLineGridOptions();
        $scope.initVesselGridOptions();
        $scope.initVoyageGridOptions();
        //Retrieve Business Units
        $scope.getBusinessUnits();
    }
    init();
});