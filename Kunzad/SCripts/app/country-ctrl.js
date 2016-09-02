//---------------------------------------------------------------------------------//
// Filename: country-ctrl.js
// Description: Controller for Country
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("CountryController", function ($rootScope, $scope, $http, $localForage) {
    //------------------------------------------------------------------------------//
    // Required controller properties. should be present in all dataTable controller
    $scope.modelName = "Country";
    $scope.modelhref = "#/country";
    $scope.country = [];
    $scope.stateProvince = [];
    $scope.cityMunicipality = [];
    $scope.countryItem;
    $scope.stateProvinceItem;
    $scope.cityMunicipalityItem;
    var pageSize = 20;
    $scope.stateProvinceDummy = 0;
    $scope.cmIdDummy = 0;
    $scope.isPrevPage = false;
    $scope.isNextPage = true;
    $scope.actionMode = "Create";
    $scope.selected = null;
    $scope.currentPage = 1;
    $scope.viewOnly = true;
    $scope.isError = false;
    $scope.isErrorStateProvince = false;
    $scope.isErrorCityMunicipality = false;
    $scope.showCityMunicipalityHeader = false;
    $scope.errorMessage = "";
    $scope.errorMessageCityMunicipality = "";
    $scope.errorMessageStateProvince = "";
    $scope.submitButtonText = "Submit";
    //------------------------------------------------------------------------------//
    $scope.tabPages = ["Country", "States/Provinces"];
    $scope.selectedTab = $scope.tabPages[0];
    $scope.showForm = false;
    $scope.spNameHolder = "";
    //--------------------------OrderBy for Country----------------------------
    $scope.countryIdHolder = 0;
    $scope.countryCriteria = 'Code';
    $scope.selectedCountryIndex = null;
    $scope.orderByCountryDesc = true;
    $scope.orderByCountryAsc = false;
    $scope.processCountrySorting = function (criteria) {
        switch (criteria) {
            case 'Code':
                //Ascending
                if ($scope.orderByCountryDesc == true) {
                    $scope.orderByCountryAsc = true;
                    $scope.orderByCountryDesc = false;
                    criteria = 'Code';
                }
                else {
                    $scope.orderByCountryAsc = false;
                    $scope.orderByCountryDesc = true;
                    criteria = '-Code';
                }
                break;
            case 'Name':
                //Ascending
                if ($scope.orderByCountryDesc == true) {
                    $scope.orderByCountryAsc = true;
                    $scope.orderByCountryDesc = false;
                    criteria = 'Name';
                }
                else {
                    $scope.orderByCountryAsc = false;
                    $scope.orderByCountryDesc = true;
                    criteria = '-Name';
                }
                break;
        }
        $scope.countryCriteria = criteria;
    };
    //-------------------------------------------------------------------------

    //--------------------------OrderBy for SP----------------------------
    $scope.spCriteria = 'Name';
    $scope.orderBySPNameDesc = true;
    $scope.orderBySPNameAsc = false;

    $scope.processSPSorting = function (criteria) {
        switch (criteria) {
            case 'Name':
                //Ascending
                if ($scope.orderBySPNameDesc == true) {
                    $scope.orderBySPNameAsc = true;
                    $scope.orderBySPNameDesc = false;
                    criteria = 'Name';
                }
                else {
                    $scope.orderBySPNameAsc = false;
                    $scope.orderBySPNameDesc = true;
                    criteria = '-Name';
                }
                $scope.orderBySPCodeAsc = false;
                $scope.orderBySPCodeDesc = false;
                break;
        }
        $scope.spCriteria = criteria;
    };
    //-------------------------------------------------------------------------

    //--------------------------OrderBy for CM----------------------------
    $scope.cmCriteria = 'Name';
    $scope.orderByCMNameDesc = true;
    $scope.orderByCMNameAsc = false;

    $scope.processCMSorting = function (criteria) {
        switch (criteria) {
            case 'Name':
                //Ascending
                if ($scope.orderByCMNameDesc == true) {
                    $scope.orderByCMNameAsc = true;
                    $scope.orderByCMNameDesc = false;
                    criteria = 'Name';
                }
                else {
                    $scope.orderByCMNameAsc = false;
                    $scope.orderByCMNameDesc = true;
                    criteria = '-Name';
                }
                $scope.orderByCMCodeAsc = false;
                $scope.orderByCMCodeDesc = false;
                break;
        }
        $scope.cmCriteria = criteria;
    };
    //-------------------------------------------------------------------------

    //--------------------------State/Province Pagination-----------------------
    $scope.stateProvinceCurrentPage = 1;
    $scope.stateProvincePageSize = 20;
    $scope.stateProvinceMaxPage = 0;
    $scope.paginatedStateProvince = [];
    $scope.processStateProvincePagination = function (stateProvinceCurrentPage, action) {
        $scope.firstPageStateProvince = false;
        $scope.lastPageStateProvince = false;
        $scope.previousPageStateProvince = false;
        $scope.nextPageStateProvince = false;
        $scope.paginatedStateProvince = [];

        //Initialize stateProvinceMaxPage
        if ($scope.stateProvince.length >= $scope.stateProvincePageSize) {
            if (($scope.stateProvince.length % $scope.stateProvincePageSize) == 0)
                $scope.stateProvinceMaxPage = $scope.stateProvince.length / $scope.stateProvincePageSize;
            else
                $scope.stateProvinceMaxPage = Math.ceil($scope.stateProvince.length / $scope.stateProvincePageSize);
        }
        else
            $scope.stateProvinceMaxPage = 1;

        var begin = 0
        var end = 0;
        //First Page
        if (stateProvinceCurrentPage == 1 && !(action == 'LASTPAGE')) {
            if ($scope.stateProvinceMaxPage > 1) {
                $scope.nextPageStateProvince = true;
                $scope.lastPageStateProvince = true;
            }
            else {
                $scope.nextPageStateProvince = false;
                $scope.lastPageStateProvince = false;
            }
            $scope.firstPageStateProvince = false;
            $scope.previousPageStateProvince = false;
            if ($scope.stateProvince.length >= $scope.stateProvincePageSize)
                end = $scope.stateProvincePageSize;
            else
                end = $scope.stateProvince.length;

            for (i = begin ; i < end; i++) {
                $scope.paginatedStateProvince.push($scope.stateProvince[i]);
            }
        }
            //Last Page
        else if (stateProvinceCurrentPage == $scope.stateProvinceMaxPage || action == 'LASTPAGE') {
            $scope.stateProvinceCurrentPage = $scope.stateProvinceMaxPage;
            stateProvinceCurrentPage = $scope.stateProvinceCurrentPage;

            if ($scope.stateProvinceMaxPage == 1) {
                $scope.firstPageStateProvince = false;
                $scope.previousPageStateProvince = false;
            }
            else {
                $scope.firstPageStateProvince = true;
                $scope.previousPageStateProvince = true;
            }
            $scope.lastPageStateProvince = false;
            $scope.nextPageStateProvince = false;
            begin = (stateProvinceCurrentPage - 1) * $scope.stateProvincePageSize;
            end = $scope.stateProvince.length;
            for (i = begin ; i < end; i++) {
                $scope.paginatedStateProvince.push($scope.stateProvince[i]);
            }
        }
            //Previous and Next
        else {
            $scope.firstPageStateProvince = true;
            $scope.lastPageStateProvince = true;
            $scope.previousPageStateProvince = true;
            $scope.nextPageStateProvince = true;
            begin = (stateProvinceCurrentPage - 1) * $scope.stateProvincePageSize;
            end = begin + $scope.stateProvincePageSize;
            for (i = begin ; i < end; i++) {
                $scope.paginatedStateProvince.push($scope.stateProvince[i]);
            }
        }
    };
    //--------------------------End of State/Province Pagination-----------------

    //--------------------------City/Municipality Pagination-----------------------
    $scope.cityMunicipalityCurrentPage = 1;
    $scope.cityMunicipalityPageSize = 20;
    $scope.cityMunicipalityMaxPage = 0;
    $scope.paginatedCityMunicipality = [];
    $scope.processCityMunicipalityPagination = function (cityMunicipalityCurrentPage, action) {
        $scope.firstPageCityMunicipality = false;
        $scope.lastPageCityMunicipality = false;
        $scope.previousPageCityMunicipality = false;
        $scope.nextPageCityMunicipality = false;
        $scope.filteredCityMunicipality = [];
        $scope.paginatedCityMunicipality = [];

        var i = 0;
        for (i = 0; i < $scope.cityMunicipality.length; i++) {
            if ($scope.stateProvinceIdHolder == $scope.cityMunicipality[i].StateProvinceId)
                $scope.filteredCityMunicipality.push($scope.cityMunicipality[i]);
        }
        //Initialize cityMunicipalityMaxPage
        if ($scope.filteredCityMunicipality.length >= $scope.cityMunicipalityPageSize) {
            if (($scope.filteredCityMunicipality.length % $scope.cityMunicipalityPageSize) == 0)
                $scope.cityMunicipalityMaxPage = $scope.filteredCityMunicipality.length / $scope.cityMunicipalityPageSize;
            else
                $scope.cityMunicipalityMaxPage = Math.ceil($scope.filteredCityMunicipality.length / $scope.cityMunicipalityPageSize);
        }
        else
            $scope.cityMunicipalityMaxPage = 1;

        var begin = 0
        var end = 0;
        //First Page
        if (cityMunicipalityCurrentPage == 1 && !(action == 'LASTPAGE')) {
            if ($scope.cityMunicipalityMaxPage > 1) {
                $scope.nextPageCityMunicipality = true;
                $scope.lastPageCityMunicipality = true;
            }
            else {
                $scope.nextPageCityMunicipality = false;
                $scope.lastPageCityMunicipality = false;
            }
            $scope.firstPageCityMunicipality = false;
            $scope.previousPageCityMunicipality = false;
            if ($scope.filteredCityMunicipality.length >= $scope.cityMunicipalityPageSize)
                end = $scope.cityMunicipalityPageSize;
            else
                end = $scope.filteredCityMunicipality.length;

            for (i = begin ; i < end; i++) {
                $scope.paginatedCityMunicipality.push($scope.filteredCityMunicipality[i]);
            }
        }
            //Last Page
        else if (cityMunicipalityCurrentPage == $scope.cityMunicipalityMaxPage || action == 'LASTPAGE') {
            $scope.cityMunicipalityCurrentPage = $scope.cityMunicipalityMaxPage;
            cityMunicipalityCurrentPage = $scope.cityMunicipalityCurrentPage;

            if ($scope.cityMunicipalityMaxPage == 1) {
                $scope.firstPageCityMunicipality = false;
                $scope.previousPageCityMunicipality = false;
            }
            else {
                $scope.firstPageCityMunicipality = true;
                $scope.previousPageCityMunicipality = true;
            }
            $scope.lastPageCityMunicipality = false;
            $scope.nextPageCityMunicipality = false;
            begin = (cityMunicipalityCurrentPage - 1) * $scope.cityMunicipalityPageSize;
            end = $scope.filteredCityMunicipality.length;
            for (i = begin ; i < end; i++) {
                $scope.paginatedCityMunicipality.push($scope.filteredCityMunicipality[i]);
            }
        }
            //Previous and Next
        else {
            $scope.firstPageCityMunicipality = true;
            $scope.lastPageCityMunicipality = true;
            $scope.previousPageCityMunicipality = true;
            $scope.nextPageCityMunicipality = true;
            begin = (cityMunicipalityCurrentPage - 1) * $scope.cityMunicipalityPageSize;
            end = begin + $scope.cityMunicipalityPageSize;
            for (i = begin ; i < end; i++) {
                $scope.paginatedCityMunicipality.push($scope.filteredCityMunicipality[i]);
            }
        }
    };
    //--------------------------End of City/Municipality Pagination-----------------

    //Initialize header name
    $scope.initializeHeaderName = function () {
        if ($scope.countryItem.Name == "" || $scope.countryItem.Name == null)
            $scope.modelName = "Country";
        else
            $scope.modelName = "Country(" + $scope.countryItem.Name + ")";
    };

    //initialize countryItem
    $scope.initCountryItem = function () {
        $scope.countryItem = {
            "Id": null,
            "Code": null,
            "Name": null,
            "CreatedDate": null,
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null,
            "StateProvinces": []
        };
    };

    //initialize stateProvinceItem
    $scope.initStateProvinceItem = function () {
        $scope.stateProvinceItem = {
            "Id": null,
            "Name": null,
            "CountryId": null,
            "CreatedDate": null,
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null,
            "CityMunicipalities": []
        };
    };

    //initialize cityMunicipality
    $scope.initCityMunicipality = function () {
        $scope.cityMunicipalityItem = {
            "Id": null,
            "Name": null,
            "StateProvinceId": null,
            "StateProvinceName": null,
            "CreatedDate": null,
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null,
            "ItemStatus": null
        };
    };

    //Get Countries
    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0;
        $http.get("/api/Countries?page=" + page)
            .success(function (data, status) {
                //initialize country
                $scope.country = data;
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

    $scope.gridOptionsCountry = {
        data: 'country',
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
          { field: 'Code' },
          { field: 'Name', },
        ],
        rowTemplate: '<div>' +
        ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(colRenderIndex, row.entity.Id)"  context-menu="grid.appScope.setSelected(colRenderIndex, row.entity.Id)" data-target= "DataTableMenu"></div>' +
        '</div>',
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        },
        enableColumnResizing: true,
        enableGridMenu: true,
        enableSelectAll: true,
        exporterCsvFilename: 'Countries' + Date.now() + '.csv',
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

    $scope.gridOptionsStateProvince = {
        data: 'stateProvince',
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
          { field: 'Name', },
        ],
        rowTemplate: '<div>' +
        ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelectedStateProvince(row.entity.Id, row.entity.Name)"  context-menu="grid.appScope.setSelectedStateProvince(row.entity.Id, row.entity.Name)" data-target= "DataTableStateProvince"></div>' +
        '</div>',
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        },
        enableColumnResizing: true,
        enableGridMenu: true,
        enableSelectAll: true,
        exporterCsvFilename: 'StatesProvinces' + Date.now() + '.csv',
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

    $scope.gridOptionsCityMunicipality = {
        data: 'cityMunicipality',
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
          { field: 'Name', },
        ],
        rowTemplate: '<div>' +
        ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelectedCityMunicipality(row.entity.Id)"  context-menu="grid.appScope.setSelectedCityMunicipality(row.entity.Id)" data-target= "DataTableCityMunicipality"></div>' +
        '</div>',
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        },
        enableColumnResizing: true,
        enableGridMenu: true,
        enableSelectAll: true,
        exporterCsvFilename: 'CitiesMunicipalities' + Date.now() + '.csv',
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

    //initialized when user delete, update or view a record in the list
    $scope.setSelected = function (i, id) {
        $scope.selected = i;
        $scope.countryIdHolder = id;
    };

    //search Country
    $scope.searchCountry = function (id) {
        var i = 0;
        for (i = 0; i < $scope.country.length; i++) {
            if (id == $scope.country[i].Id) {
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
        $scope.isErrorStateProvince = false;
        $scope.isErrorCityMunicipality = false;
        openModalPanel(panel);
    };

    //closes the form
    $scope.closeForm = function () {
        $scope.isError = false;
        $scope.showForm = false;
        $scope.modelName = "Country";
    };

    //close modal
    $scope.closeModalForm = function () {
        jQuery.magnificPopup.close();
        $scope.isError = false;
    }

    //manage the error message
    $scope.showFormError = function (message) {
        $scope.isError = true;
        $scope.errorMessage = message;
    };

    // Initialize City/Municipality
    $scope.apiGet = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0;
        $http.get("/api/CityMunicipalities?countryId=" + $scope.countryItem.Id)
        .success(function (data, status) {
            $scope.cityMunicipality = [];
            //initialize cityMunicipality
            $scope.cityMunicipality = angular.copy(data);
            //set cmIdDummy to prevent conflict of City/Municipality Ids
            if ($scope.cityMunicipality.length >= 1) {
                $scope.cmIdDummy = $scope.cityMunicipality[$scope.cityMunicipality.length - 1].Id;
            }
            spinner.stop();
        })
            .error(function (data, status) {
                $scope.showFormError("Error: " + status);
                $scope.selectedTab = $scope.tabPages[0];
                spinner.stop();
            })
    };

    // Save Country, State/Province, City/Municipality
    $scope.apiCreate = function () {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0, j = 0;
        //---------------------------------------customize object for easy saving of data------------------------------
        $scope.countryItem.StateProvinces = angular.copy($scope.stateProvince);
        for (j = 0; j < $scope.countryItem.StateProvinces.length; j++) {
            for (i = 0; i < $scope.cityMunicipality.length; i++) {
                if ($scope.countryItem.StateProvinces[j].Id == $scope.cityMunicipality[i].StateProvinceId)
                    //insert cityMunicipality
                    $scope.countryItem.StateProvinces[j].CityMunicipalities.push($scope.cityMunicipality[i]);
            }
        }
        var countryModel = angular.copy($scope.countryItem);
        //remove countryId
        delete countryModel.Id;
        for (j = 0; j < countryModel.StateProvinces.length; j++) {
            //remove stateProvinceId
            delete countryModel.StateProvinces[j].Id
            for (i = 0; i < countryModel.StateProvinces[j].CityMunicipalities.length; i++) {
                //remove cityMunicipalityId
                countryModel.StateProvinces[j].CityMunicipalities[i].StateProvinceId = -1;
                delete countryModel.StateProvinces[j].CityMunicipalities[i].Id;
                delete countryModel.StateProvinces[j].CityMunicipalities[i].StateProvinceName;
                delete countryModel.StateProvinces[j].CityMunicipalities[i].ItemStatus;
            }
        }
        //--------------------------------------End of customization---------------------------------------
        $http.post("/api/Countries", countryModel)
            .success(function (data, status) {
                var i = 0, j = 0;
                if (data.status == "SUCCESS") {
                    //Add country in the list
                    $scope.country.push(data.objParam1);
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

    // Update Country, State/Province, City/Municipality
    $scope.apiUpdate = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0, j = 0;
        //---------------------------------------customize object for easy saving of data------------------------------
        $scope.countryItem.StateProvinces = [];
        $scope.countryItem.StateProvinces = angular.copy($scope.stateProvince);
        for (j = 0; j < $scope.countryItem.StateProvinces.length; j++) {
            //reset City/Municipalities
            $scope.countryItem.StateProvinces[j].CityMunicipalities = [];
            for (i = 0; i < $scope.cityMunicipality.length; i++) {
                if ($scope.countryItem.StateProvinces[j].Id == $scope.cityMunicipality[i].StateProvinceId)
                    //insert cityMunicipality
                    $scope.countryItem.StateProvinces[j].CityMunicipalities.push($scope.cityMunicipality[i]);
            }
        }
        var countryModel = angular.copy($scope.countryItem);
        for (j = 0; j < countryModel.StateProvinces.length; j++) {
            if (countryModel.StateProvinces[j].CountryId == -1) {
                //remove stateProvinceId
                delete countryModel.StateProvinces[j].Id
                for (i = 0; i < countryModel.StateProvinces[j].CityMunicipalities.length; i++) {
                    //remove cityMunicipalityId
                    delete countryModel.StateProvinces[j].CityMunicipalities[i].Id;
                    delete countryModel.StateProvinces[j].CityMunicipalities[i].StateProvinceName;
                    delete countryModel.StateProvinces[j].CityMunicipalities[i].ItemStatus;
                }
            }
            else {
                for (i = 0; i < countryModel.StateProvinces[j].CityMunicipalities.length; i++) {
                    if (countryModel.StateProvinces[j].CityMunicipalities[i].ItemStatus == "New") {
                        //remove cityMunicipalityId
                        delete countryModel.StateProvinces[j].CityMunicipalities[i].Id;
                        delete countryModel.StateProvinces[j].CityMunicipalities[i].StateProvinceName;
                        delete countryModel.StateProvinces[j].CityMunicipalities[i].ItemStatus;
                    }
                    else {
                        //delete Unupdateable column
                        delete countryModel.StateProvinces[j].CityMunicipalities[i].CountryId;
                        delete countryModel.StateProvinces[j].CityMunicipalities[i].CountryName;
                        delete countryModel.StateProvinces[j].CityMunicipalities[i].StateProvinceName;
                        delete countryModel.StateProvinces[j].CityMunicipalities[i].ItemStatus;
                    }
                }
            }
        }
        //--------------------------------------End of customization---------------------------------------
        $http.put("/api/Countries/" + id, countryModel)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    //initialize Country info
                    $scope.country[$scope.selectedCountryIndex] = [];
                    $scope.country[$scope.selectedCountryIndex] = angular.copy(data.objParam1);
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

    // Delete Country, State/Province, City/Municipality
    $scope.apiDelete = function (id) {
        $http.delete("/api/Countries/" + id)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.country.splice($scope.selectedCountryIndex, 1);
                    $scope.closeForm();
                }
                else {
                    $scope.showFormError(data.message);
                    $scope.selectedTab = $scope.tabPages[0];
                }
            })
            .error(function (data, status) {
                $scope.showFormError(status);
                $scope.selectedTab = $scope.tabPages[0];
            })
    };

    // Validate Form  Data Entry
    function validateEntry() {
        if ($scope.countryItem.Name == null || $scope.countryItem.Name == "") {
            $scope.showFormError("Name is required.");
            $scope.selectedTab = $scope.tabPages[0];
            return false;
        }
        return true;
    }

    //Triggers when user create, delete, update or view a country in the list
    $scope.actionForm = function (action) {
        $scope.actionMode = action;
        $scope.selectedCountryIndex = $scope.searchCountry($scope.countryIdHolder);
        $scope.tabPages = ["Country", "States/Provinces"];
        $scope.selectedTab = $scope.tabPages[0];
        switch ($scope.actionMode) {
            case "Create":
                $scope.stateProvinceDummy = 0;
                $scope.cmIdDummy = 0;
                $scope.stateProvince = [];
                $scope.cityMunicipality = [];
                $scope.initCountryItem();
                $scope.processStateProvincePagination($scope.stateProvinceCurrentPage, '');
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.showForm = true;
                break;
            case "Edit":
                $scope.countryItem = [];
                $scope.countryItem = angular.copy($scope.country[$scope.selectedCountryIndex]);
                //Store state/province of a country
                $scope.stateProvince = [];
                $scope.stateProvince = angular.copy($scope.country[$scope.selectedCountryIndex].StateProvinces);
                $scope.processStateProvincePagination($scope.stateProvinceCurrentPage, '');
                $scope.apiGet($scope.country[$scope.selectedCountryIndex].Id);
                $scope.initializeHeaderName();
                //set $scope.stateProvinceDummy to prevent conflict of StateProvince dummy Id
                if ($scope.countryItem.StateProvinces.length >= 1)
                    $scope.stateProvinceDummy = $scope.countryItem.StateProvinces[$scope.countryItem.StateProvinces.length - 1].Id;
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.showForm = true;
                break;
            case "Delete":
                $scope.countryItem = [];
                $scope.countryItem = angular.copy($scope.country[$scope.selectedCountryIndex]);
                $scope.stateProvince = [];
                $scope.stateProvince = angular.copy($scope.country[$scope.selectedCountryIndex].StateProvinces);
                $scope.processStateProvincePagination($scope.stateProvinceCurrentPage, '');
                $scope.apiGet($scope.country[$scope.selectedCountryIndex].Id);
                $scope.initializeHeaderName();
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                $scope.showForm = true;
                break;
            case "View":
                $scope.countryItem = [];
                $scope.countryItem = angular.copy($scope.country[$scope.selectedCountryIndex]);
                $scope.stateProvince = [];
                $scope.stateProvince = angular.copy($scope.country[$scope.selectedCountryIndex].StateProvinces);
                $scope.processStateProvincePagination($scope.stateProvinceCurrentPage, '');
                $scope.apiGet($scope.country[$scope.selectedCountryIndex].Id);
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
                    $scope.apiUpdate($scope.countryItem.Id);
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

    //-----------------------------------State/Province----------------------------------------
    $scope.stateProvinceAction = null;
    $scope.selectedstateProvinceActionIndex = null;

    ////manage the error message
    $scope.showFormErrorStateProvince = function (message) {
        $scope.isErrorStateProvince = true;
        $scope.errorMessageStateProvince = message;
    };

    //search state/province in city/municipality
    $scope.searchStateProvince = function (id) {
        var i = 0;
        for (i = 0; i < $scope.cityMunicipality.length; i++) {
            if (id == $scope.cityMunicipality[i].StateProvinceId) {
                return true;
            }
        }
        //$scope.isWarningStateProvince = false;
        return false;
    }

    //saarch in state/province
    $scope.searchInStateProvince = function (id) {
        var i = 0;
        for (i = 0; i < $scope.stateProvince.length; i++) {
            if (id == $scope.stateProvince[i].Id) {
                return i;
            }
        }
        return i;
    }

    //delete city/municipality if state/province is deleted
    $scope.deleteCityMunicipality = function (id) {
        var i = 0;
        for (i = 0; i < $scope.cityMunicipality.length; i++) {
            if (id == $scope.cityMunicipality[i].StateProvinceId) {
                $scope.cityMunicipality.splice(i, 1);
            }
        }
    };

    $scope.setSelectedStateProvince = function (id, stateProvinceName) {
        $scope.selectedstateProvinceActionIndex = $scope.searchInStateProvince(id);
        $scope.spNameHolder = stateProvinceName;
    };

    //Manage opening of State/Province modal
    $scope.openStateProvinceForm = function (action) {
        $scope.stateProvinceAction = action;
        $scope.viewOnly = false;
        switch ($scope.stateProvinceAction) {
            case "Create":
                $scope.initStateProvinceItem();
                $scope.openModalForm('#modal-panel-stateProvince')
                break;
            case "Edit":
                $scope.stateProvinceItem = [];
                $scope.stateProvinceItem = angular.copy($scope.stateProvince[$scope.selectedstateProvinceActionIndex]);
                $scope.openModalForm('#modal-panel-stateProvince')
                break;
            case "Delete":
                $scope.stateProvinceItem = [];
                $scope.stateProvinceItem = angular.copy($scope.stateProvince[$scope.selectedstateProvinceActionIndex]);
                $scope.viewOnly = true;
                $scope.openModalForm('#modal-panel-stateProvince')
                break;
            case "View":
                $scope.stateProvinceItem = [];
                $scope.stateProvinceItem = angular.copy($scope.stateProvince[$scope.selectedstateProvinceActionIndex]);
                $scope.viewOnly = true;
                $scope.openModalForm('#modal-panel-stateProvince')
                break;
            case "showCityMunicipality":
                //Initialize tab 3
                $scope.tabPages[2] = "Cities/Municipalities";
                $scope.stateProvinceIdHolder = $scope.stateProvince[$scope.selectedstateProvinceActionIndex].Id;
                if ($scope.searchStateProvince($scope.stateProvinceIdHolder))
                    $scope.showCityMunicipalityHeader = true;
                else
                    $scope.showCityMunicipalityHeader = false;
                $scope.selectedTab = $scope.tabPages[2];
                $scope.processCityMunicipalityPagination($scope.cityMunicipalityCurrentPage, '');
                break;
        }
    };

    function validateStateProvince() {
        //validate here
        if ($scope.stateProvinceItem.Name == null || $scope.stateProvinceItem.Name == "") {
            $scope.showFormErrorStateProvince("Name is required.");
            return false;
        }
        return true;
    };

    // Create/Insert State/Province
    $scope.apiCreateStateProvince = function () {
        $scope.stateProvinceDummy = $scope.stateProvinceDummy + 1;
        $scope.stateProvinceItem.Id = $scope.stateProvinceDummy;
        $scope.stateProvinceItem.CountryId = -1;
        $scope.stateProvince.push($scope.stateProvinceItem);
        $scope.processStateProvincePagination($scope.stateProvinceCurrentPage, 'LASTPAGE');
        $scope.closeModalForm();
    };

    //Update State/Province
    $scope.apiUpdateStateProvince = function () {
        $scope.stateProvince[$scope.selectedstateProvinceActionIndex] = angular.copy($scope.stateProvinceItem);
        $scope.processStateProvincePagination($scope.stateProvinceCurrentPage, '');
        $scope.closeModalForm();
    };

    //Delete State/Province
    $scope.apiDeleteStateProvince = function () {
        $scope.stateProvince.splice($scope.selectedstateProvinceActionIndex, 1);
        $scope.deleteCityMunicipality($scope.stateProvinceItem.Id);
        $scope.processStateProvincePagination($scope.stateProvinceCurrentPage, '');
        $scope.closeModalForm();
    };

    //Manage saving of State/Province
    $scope.saveStateProvince = function (action) {
        switch (action) {
            case "Create":
                if (validateStateProvince())
                    $scope.apiCreateStateProvince();
                break;
            case "Edit":
                if (validateStateProvince())
                    $scope.apiUpdateStateProvince();
                break;
            case "Delete":
                if (validateStateProvince())
                    $scope.apiDeleteStateProvince();
                break;
            case "View":
                $scope.closeModalForm();
                break;
        }
    };
    //-----------------------------------End of State/Province------------------------------------

    //-----------------------------------City/Municipality----------------------------------------
    $scope.cityMunicipalityAction = null;
    $scope.selectedcityMunicipalityActionIndex = null;

    function searchCityMunicipality(id) {
        var i = 0;
        for (i = 0; i < $scope.cityMunicipality.length; i++) {
            if (id == $scope.cityMunicipality[i].Id)
                return i;
        }
    };

    $scope.setSelectedCityMunicipality = function (id) {
        $scope.selectedcityMunicipalityActionIndex = searchCityMunicipality(id);
    };

    //Manage opening of City/Municipality modal
    $scope.openCityMunicipalityForm = function (action) {
        $scope.cityMunicipalityAction = action;
        $scope.viewOnly = false;
        switch ($scope.cityMunicipalityAction) {
            case "Create":
                $scope.initCityMunicipality();
                $scope.openModalForm('#modal-panel-cityMunicipality')
                break;
            case "Edit":
                $scope.cityMunicipalityItem = [];
                $scope.cityMunicipalityItem = angular.copy($scope.cityMunicipality[$scope.selectedcityMunicipalityActionIndex]);
                $scope.openModalForm('#modal-panel-cityMunicipality')
                break;
            case "Delete":
                $scope.cityMunicipalityItem = [];
                $scope.cityMunicipalityItem = angular.copy($scope.cityMunicipality[$scope.selectedcityMunicipalityActionIndex]);
                $scope.viewOnly = true;
                $scope.openModalForm('#modal-panel-cityMunicipality')
                break;
            case "View":
                $scope.cityMunicipalityItem = [];
                $scope.cityMunicipalityItem = angular.copy($scope.cityMunicipality[$scope.selectedcityMunicipalityActionIndex]);
                $scope.viewOnly = true;
                $scope.openModalForm('#modal-panel-cityMunicipality')
                break;
        }
    };

    //manage the error message
    $scope.showFormErrorCityMunicipality = function (message) {
        $scope.isErrorCityMunicipality = true;
        $scope.errorMessageCityMunicipality = message;
    };

    function validateCityMunicipality() {
        if ($scope.cityMunicipalityItem.Name == null || $scope.cityMunicipalityItem.Name == "") {
            $scope.showFormErrorCityMunicipality("Name is required.");
            return false;
        }
        return true;
    };

    // Create/Insert City/Municipality
    $scope.apiCreateCityMunicipality = function () {
        $scope.cityMunicipalityItem.ItemStatus = "New";
        $scope.cityMunicipalityItem.StateProvinceId = $scope.stateProvinceIdHolder;
        $scope.cmIdDummy = $scope.cmIdDummy + 1;
        $scope.cityMunicipalityItem.Id = $scope.cmIdDummy;
        $scope.cityMunicipality.push($scope.cityMunicipalityItem);
        $scope.showCityMunicipalityHeader = true;
        $scope.processCityMunicipalityPagination($scope.cityMunicipalityCurrentPage, 'LASTPAGE');
        $scope.closeModalForm();
    };

    //Update City/Municipality
    $scope.apiUpdateCityMunicipality = function () {
        $scope.cityMunicipality[$scope.selectedcityMunicipalityActionIndex] = angular.copy($scope.cityMunicipalityItem);
        $scope.processCityMunicipalityPagination($scope.cityMunicipalityCurrentPage, '');
        $scope.closeModalForm();
    };

    //Delete City/Municipality
    $scope.apiDeleteCityMunicipality = function () {
        $scope.cityMunicipality.splice($scope.selectedcityMunicipalityActionIndex, 1);
        $scope.processCityMunicipalityPagination($scope.cityMunicipalityCurrentPage, '');
        $scope.closeModalForm();
    };

    //Manage saving of City/Municipality
    $scope.saveCityMunicipality = function (action) {
        switch (action) {
            case "Create":
                if (validateCityMunicipality())
                    $scope.apiCreateCityMunicipality();
                break;
            case "Edit":
                if (validateCityMunicipality())
                    $scope.apiUpdateCityMunicipality();
                break;
            case "Delete":
                if (validateCityMunicipality())
                    $scope.apiDeleteCityMunicipality();
                break;
            case "View":
                $scope.closeModalForm();
                break;
        }
    };
    //--------------------------------------End of City/Municipality-----------------------------------------

    // Initialization routines
    var init = function () {
        // Call function to load data during content load
        $localForage.getItem("Token").then(function (value) {
            $http.defaults.headers.common['Token'] = value;
            $scope.loadData($scope.currentPage);
            $scope.processCountrySorting($scope.countryCriteria);
            $scope.processSPSorting($scope.spCriteria);
            $scope.processCMSorting($scope.cmCriteria);
        });
        
    }
    init();
});