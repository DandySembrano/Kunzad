//---------------------------------------------------------------------------------//
// Filename: businessunit-ctrl.js
// Description: Controller for Business Unit
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("BusinessUnitController", function ($rootScope, $scope, $http) {
    $scope.modelName = "Business Unit";
    $scope.modelhref = "#/businessunit";
    $scope.data = [];
    $scope.dataItem;
    $scope.businessUnitList = [];
    $scope.businessUnitTypeList = [];

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
    //------------------------------Order By for BU----------------------------------
    $scope.buIdHolder = 0;
    $scope.buCriteria = 'Code';
    $scope.orderByDesc = true;
    $scope.orderByAsc = false;
    $scope.processBUOrderBy = function (criteria) {
        switch (criteria) {
            case 'Code':
                //Ascending
                if ($scope.orderByDesc == true) {
                    criteria = 'Code';
                    $scope.orderByDesc = false;
                    $scope.orderByAsc = true;
                }
                //Descending
                else {
                    criteria = '-Code';
                    $scope.orderByDesc = true;
                    $scope.orderByAsc = false;
                }
                break;
            case 'Name':
                //Ascending
                if ($scope.orderByDesc == true) {
                    criteria = 'Name';
                    $scope.orderByDesc = false;
                    $scope.orderByAsc = true;
                }
                    //Descending
                else {
                    criteria = '-Name';
                    $scope.orderByDesc = true;
                    $scope.orderByAsc = false;
                }
                break;
            case 'Code':
                //Ascending
                if ($scope.orderByDesc == true) {
                    criteria = 'Code';
                    $scope.orderByDesc = false;
                    $scope.orderByAsc = true;
                }
                    //Descending
                else {
                    criteria = '-Code';
                    $scope.orderByDesc = true;
                    $scope.orderByAsc = false;
                }
                break;
            case 'ParentBusinessUnitName':
                //Ascending
                if ($scope.orderByDesc == true) {
                    criteria = 'ParentBusinessUnitName';
                    $scope.orderByDesc = false;
                    $scope.orderByAsc = true;
                }
                    //Descending
                else {
                    criteria = '-ParentBusinessUnitName';
                    $scope.orderByDesc = true;
                    $scope.orderByAsc = false;
                }
                break;
            case 'BusinessUnitTypeName':
                //Ascending
                if ($scope.orderByDesc == true) {
                    criteria = 'BusinessUnitTypeName';
                    $scope.orderByDesc = false;
                    $scope.orderByAsc = true;
                }
                    //Descending
                else {
                    criteria = '-BusinessUnitTypeName';
                    $scope.orderByDesc = true;
                    $scope.orderByAsc = false;
                }
                break;
            case 'isOperatingSite':
                //Ascending
                if ($scope.orderByDesc == true) {
                    criteria = 'isOperatingSite';
                    $scope.orderByDesc = false;
                    $scope.orderByAsc = true;
                }
                    //Descending
                else {
                    criteria = '-isOperatingSite';
                    $scope.orderByDesc = true;
                    $scope.orderByAsc = false;
                }
                break;
            case 'hasAirPort':
                //Ascending
                if ($scope.orderByDesc == true) {
                    criteria = 'hasAirPort';
                    $scope.orderByDesc = false;
                    $scope.orderByAsc = true;
                }
                    //Descending
                else {
                    criteria = '-hasAirPort';
                    $scope.orderByDesc = true;
                    $scope.orderByAsc = false;
                }
                break;
            case 'hasSeaPort':
                //Ascending
                if ($scope.orderByDesc == true) {
                    criteria = 'hasSeaPort';
                    $scope.orderByDesc = false;
                    $scope.orderByAsc = true;
                }
                    //Descending
                else {
                    criteria = '-hasSeaPort';
                    $scope.orderByDesc = true;
                    $scope.orderByAsc = false;
                }
                break;
            
        }
        $scope.buCriteria = criteria;
    };
    //---------------------------End of order by--------------------------------------

    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/BusinessUnits?page=" + page)
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

    $scope.initializeCheckBox = function(){
        if ($scope.dataItem.isOperatingSite == null)
            $scope.dataItem.isOperatingSite = false;

        if ($scope.dataItem.hasAirPort == null)
            $scope.dataItem.hasAirPort = false;

        if ($scope.dataItem.hasSeaPort == null)
            $scope.dataItem.hasSeaPort = false;
    };

    function getBusinessUnitTypes() {
        $http.get("/api/BusinessUnitTypes")
        .success(function (data, status) {
            $scope.businessUnitTypeList = angular.copy(data);
        })
        .error(function (error, status) {
            $scope.showFormError(status);
        })
    };

    function getBusinessUnits() {
        $http.get("/api/BusinessUnits")
        .success(function (data, status) {
            $scope.businessUnitList = [];
            $scope.businessUnitList.push({ 'Id': null, 'Name': 'None' });
            for (x in data) {
                $scope.businessUnitList.push(data[x]);
            }
           // $scope.businessUnitList = angular.copy(data);
        })
        .error(function (error, status) {
            $scope.showFormError(status);
        })
    };

    $scope.selectBusinessUnitType = function (id) {
        var i;
        for (i = 0; i < $scope.businessUnitTypeList.length; i++) {
            if (id == $scope.businessUnitTypeList[i].Id) {
                $scope.dataItem.BusinessUnitTypeName = $scope.businessUnitTypeList[i].Name;
                break;
            }
        }
    };

    $scope.selectBusinessUnit = function (id) {
        var i;
        for (i = 0; i < $scope.businessUnitList.length; i++) {
            if (id == $scope.businessUnitList[i].Id) {
                $scope.dataItem.ParentBusinessUnitName[0].Name = $scope.businessUnitList[i].Name;
                break;
            }
        }
    };

    // Create/Insert New
    $scope.apiCreate = function () {
        var dataModel = angular.copy($scope.dataItem);
        delete dataModel.Id;
        delete dataModel.CityMunicipality;
        $http.post("/api/BusinessUnits", dataModel)
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
        $http.put("/api/BusinessUnits/" + id, $scope.dataItem)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.data[$scope.selectedBUIndex] = angular.copy($scope.dataItem);
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
        $http.delete("/api/BusinessUnits/" + id)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.data.splice($scope.selectedBUIndex, 1);
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

    $scope.selectedBUIndex = null;

    //search BU
    $scope.searchBU = function (id) {
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
        $scope.buIdHolder = id;
    };

    $scope.actionForm = function (action) {
        $scope.actionMode = action;
        $scope.selectedBUIndex = $scope.searchBU($scope.buIdHolder);
        switch ($scope.actionMode) {
            case "Create":
                getBusinessUnits();
                //set dataitem as model for trucker form
                $scope.dataItem = {
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
                    "LastUpdatedByUserId": null,
                    "BusinessUnitTypeName": null,
                    "ParentBusinessUnitName": [{"Name":null}]
                }
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.openModalForm();
                break;
            case "Edit":
                $scope.dataItem = angular.copy($scope.data[$scope.selectedBUIndex]);
                getBusinessUnits();
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.openModalForm();
                break;
            case "Delete":
                $scope.dataItem = angular.copy($scope.data[$scope.selectedBUIndex]);
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                $scope.openModalForm();
                break;
            case "View":
                $scope.dataItem = angular.copy($scope.data[$scope.selectedBUIndex]);
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
        if ($scope.dataItem.Code == null || $scope.dataItem.Code == "") {
            $scope.showFormError("Code is required.");
            return false;
        }
        else if ($scope.dataItem.Name == null || $scope.dataItem.Name == "") {
            $scope.showFormError("Name is required.");
            return false;
        }
        else if ($scope.dataItem.BusinessUnitTypeId == null || $scope.dataItem.BusinessUnitTypeId == "") {
            $scope.showFormError("Business Unit Type is required.");
            return false;
        }
        return true;
    };

    var init = function () {
        // Call function to load data during content load
        $scope.loadData($scope.currentPage);
        getBusinessUnitTypes();
        $scope.processBUOrderBy($scope.buCriteria);
    };

    init();
});