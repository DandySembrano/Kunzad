//---------------------------------------------------------------------------------//
// Filename: serviceablearea-ctrl.js
// Description: Controller for Serviceable Area
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("ServiceableAreaController", function ($rootScope, $scope, $http) {
    $scope.modelName = "Serviceable Area";
    $scope.modelhref = "#/serviceablearea";
    $scope.data = [];
    $scope.dataItem;
    $scope.businessUnitList = [];

    //------------------------------------------------------------------------------//
    // Required controller properties. should be present in all dataTable controller
    $scope.isPrevPage = false;
    $scope.isNextPage = true;
    $scope.actionMode = "Create";
    $scope.selected = null;
    $scope.currentPage = 1;
    $scope.viewOnly = true;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.submitButtonText = "Submit";
    var pageSize = 20;
    //------------------------------------------------------------------------------//
    //--------------------------------Orderby SC------------------------------------
    $scope.scIdHolder = 0;
    $scope.scCriteria = "Name";
    $scope.scOrderByDesc = true;
    $scope.scOrderByAsc = false;
    $scope.processSCOrderBy = function (criteria) {
        switch (criteria) {
            case 'Name':
                //Ascending
                if ($scope.scOrderByDesc == true) {
                    $scope.scOrderByDesc = false;
                    $scope.scOrderByAsc = true;
                    criteria = 'Name';
                }
                    //Descending
                else {
                    $scope.scOrderByDesc = true;
                    $scope.scOrderByAsc = false;
                    criteria = '-Name';
                }
                break;
            case 'CityMunicipalityName':
                //Ascending
                if ($scope.scOrderByDesc == true) {
                    $scope.scOrderByDesc = false;
                    $scope.scOrderByAsc = true;
                    criteria = 'CityMunicipalityName';
                }
                    //Descending
                else {
                    $scope.scOrderByDesc = true;
                    $scope.scOrderByAsc = false;
                    criteria = '-CityMunicipalityName';
                }
                break;
            case 'PostalCode':
                //Ascending
                if ($scope.scOrderByDesc == true) {
                    $scope.scOrderByDesc = false;
                    $scope.scOrderByAsc = true;
                    criteria = 'PostalCode';
                }
                    //Descending
                else {
                    $scope.scOrderByDesc = true;
                    $scope.scOrderByAsc = false;
                    criteria = '-PostalCode';
                }
                break;
            case 'BusinessUnitName':
                //Ascending
                if ($scope.scOrderByDesc == true) {
                    $scope.scOrderByDesc = false;
                    $scope.scOrderByAsc = true;
                    criteria = 'BusinessUnitName[0].Name';
                }
                    //Descending
                else {
                    $scope.scOrderByDesc = true;
                    $scope.scOrderByAsc = false;
                    criteria = '-BusinessUnitName[0].Name';
                }
                break;
            case 'IsServiceable':
                //Ascending
                if ($scope.scOrderByDesc == true) {
                    $scope.scOrderByDesc = false;
                    $scope.scOrderByAsc = true;
                    criteria = 'IsServiceable';
                }
                    //Descending
                else {
                    $scope.scOrderByDesc = true;
                    $scope.scOrderByAsc = false;
                    criteria = '-IsServiceable';
                }
                break;
        }
        $scope.scCriteria = criteria;
    };
    //--------------------------------End of OrderBy SC------------------------------------

    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/ServiceableAreas?page=" + page)
            .success(function (data, status) {
                $scope.data = data;
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

    $scope.initializeCheckBox = function () {
        if ($scope.dataItem.IsServiceable == null)
            $scope.dataItem.IsServiceable = false;
    };

    function getBusinessUnits() {
        $http.get("/api/BusinessUnits")
        .success(function (data, status) {
            $scope.businessUnitList = angular.copy(data);
        })
        .error(function (error, status) {
            $scope.showFormError(status);
        })
    };

    $scope.selectBusinessUnit = function (id) {
        var i;
        for (i = 0; i < $scope.businessUnitList.length; i++) {
            if (id == $scope.businessUnitList[i].Id) {
                $scope.dataItem.BusinessUnitName[0].Name = $scope.businessUnitList[i].Name;
                break;
            }
        }
    };

    // Create/Insert New
    $scope.apiCreate = function () {
        var dataModel = angular.copy($scope.dataItem);
        delete dataModel.Id;
        $http.post("/api/ServiceableAreas", dataModel)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.dataItem.Id = angular.copy(data.objParam1.Id);
                    $scope.data.push($scope.dataItem);
                    $scope.closeModalForm();
                }
                else {
                    $scope.showFormError(data.message);
                }
            })
            .error(function (data, status) {
                $scope.showFormError(status);
            })
    };

    // Update
    $scope.apiUpdate = function (id) {
        $http.put("/api/ServiceableAreas/" + id, $scope.dataItem)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.data[$scope.selectSCIndex] = angular.copy($scope.dataItem);
                    $scope.closeModalForm();
                }
                else {
                    $scope.showFormError(data.message);
                }
            })
            .error(function (data, status) {
                $scope.showFormError(status);
            })
    };

    // Delete
    $scope.apiDelete = function (id) {
        $http.delete("/api/ServiceableAreas/" + id)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.data.splice($scope.selectSCIndex, 1);
                    $scope.closeModalForm();
                }
                else {
                    $scope.showFormError(data.message);
                }
            })
            .error(function (error, status) {
                $scope.showFormError(status);
            })
    };

    $scope.selectSCIndex = null;
    //search BU
    $scope.searchSC = function (id) {
        var i = 0;
        for (i = 0; i < $scope.data.length; i++) {
            if (id == $scope.data[i].Id) {
                return i;
            }
        }
        return i;
    };

    $scope.setSelected = function (i, id) {
        $scope.selected = i;
        $scope.scIdHolder = id;
    };

    $scope.actionForm = function (action) {
        //--------------------------Initialize cityMunicipalities----------------
        $scope.country = $rootScope.country;
        $scope.cityMunicipalities = $rootScope.getCityMunicipalities();
        //-----------------------------------------------------------------------
        $scope.actionMode = action;
        $scope.selectSCIndex = $scope.searchSC($scope.scIdHolder);
        switch ($scope.actionMode) {
            case "Create":
                //set dataitem as model for trucker form
                $scope.dataItem = {
                    "Id": null,
                    "Code": null,
                    "Name": null,
                    "CityMunicipalityId": null,
                    "PostalCode": null,
                    "IsServiceable": null,
                    "BusinessUnitId": null,
                    "CreatedDate": null,
                    "LastUpdatedDate": null,
                    "CreatedByUserId": null,
                    "LastUpdatedByUserId": null,
                    "CityMunicipalityName": null,
                    "BusinessUnitName": [{ "Name": null }],
                    "StateProvinceName": null
                }
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.openModalForm();
                break;
            case "Edit": 
                $scope.dataItem = angular.copy($scope.data[$scope.selectSCIndex]);
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.openModalForm();
                break;
            case "Delete":
                $scope.dataItem = angular.copy($scope.data[$scope.selectSCIndex]);
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                $scope.openModalForm();
                break;
            case "View":
                $scope.dataItem = angular.copy($scope.data[$scope.selectSCIndex]);
                $scope.viewOnly = true;
                $scope.submitButtonText = "Close";
                $scope.openModalForm();
                break;
        }
    };

    $scope.openModalForm = function () {
        $scope.isError = false;
        openModalPanel("#modal-panel");
    };

    $scope.closeModalForm = function () {
        jQuery.magnificPopup.close();
    };

    $scope.showFormError = function (message) {
        $scope.isError = true;
        $scope.errorMessage = message;
    };

    $scope.submit = function () {
        $scope.initializeCheckBox();
        switch ($scope.actionMode) {
            case "Create":
                if (validateEntry()) {
                    $scope.apiCreate();
                }
                break;
            case "Edit":
                if (validateEntry()) {
                    $scope.apiUpdate($scope.dataItem.Id);
                }
                break;
            case "Delete":
                $scope.apiDelete($scope.dataItem.Id);
                break;
            case "View":
                $scope.closeModalForm();
                break;
        }
    };

    // Validate Form Data Entry
    var validateEntry = function () {
        if ($scope.dataItem.Name == null || $scope.dataItem.Name == "") {
            $scope.showFormError("Name is required.");
            return false;
        }
        else if ($scope.dataItem.CityMunicipalityId == null || $scope.dataItem.CityMunicipalityId == "") {
            $scope.showFormError("City/Municipality is required.");
            return false;
        }
        else if ($scope.dataItem.PostalCode == null || $scope.dataItem.PostalCode == "") {
            $scope.showFormError("Postal Code is required.");
            return false;
        }
        return true;
    };

    var init = function () {
        // Call function to load data during content load
        $scope.loadData($scope.currentPage);
        getBusinessUnits();
        $scope.processSCOrderBy($scope.scCriteria);
    };

    //---------------------------Code if using typeahead in city/municipality-------------------
    $scope.onSelectCity = function ($item, $model, $label) {
        $scope.dataItem.StateProvinceName = $item.StateProvinceName;
        $scope.dataItem.CityMunicipalityName = $item.Name;;
        $scope.dataItem.CityMunicipalityId = $item.Id;
    };
    //---------------------------End of typeahead-----------------------------------------------

    init();
});