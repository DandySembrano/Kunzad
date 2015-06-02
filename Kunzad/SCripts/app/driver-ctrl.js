//---------------------------------------------------------------------------------//
// Filename: driver-ctrl.js
// Description: Controller for Driver
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("DriverController", function ($scope, $http, $filter) {
    $scope.modelName = "Driver";
    $scope.data = [];
    $scope.dataItem;


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
    //------------------------------Orderby of Driver--------------------------------
    $scope.driverCriteria = 'Name';
    $scope.driverIdHolder = 0;
    $scope.driverSelectedIndex = null;
    $scope.driverOrderByDesc = true;
    $scope.driverOrderByAsc = false;
    $scope.processDriverSorting = function (criteria) {
        switch (criteria) {
            case 'Name':
                //Ascending
                if ($scope.driverOrderByDesc == true) {
                    $scope.driverOrderByDesc = false;
                    $scope.driverOrderByAsc = true;
                    criteria = 'LastName';
                }
                    //Descending
                else {
                    $scope.driverOrderByDesc = true;
                    $scope.driverOrderByAsc = false;
                    criteria = '-LastName';
                }
                break;
            case 'LicenseNo':
                //Ascending
                if ($scope.driverOrderByDesc == true) {
                    $scope.driverOrderByDesc = false;
                    $scope.driverOrderByAsc = true;
                    criteria = 'LicenseNo';
                }
                    //Descending
                else {
                    $scope.driverOrderByDesc = true;
                    $scope.driverOrderByAsc = false;
                    criteria = '-LicenseNo';
                }
                break;
            case 'LicenseExpiry':
                //Ascending
                if ($scope.driverOrderByDesc == true) {
                    $scope.driverOrderByDesc = false;
                    $scope.driverOrderByAsc = true;
                    criteria = 'LicenseExpiry';
                }
                    //Descending
                else {
                    $scope.driverOrderByDesc = true;
                    $scope.driverOrderByAsc = false;
                    criteria = '-LicenseExpiry';
                }
                break;
        }
        $scope.driverCriteria = criteria;
    };
    //--------------------------------------------------------------------------------

    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/Drivers?page=" + page)
            .success(function (data, status) {
                $scope.data = data;
                for (i = 0; i < $scope.data.length; i++) {
                    $scope.data[i].LicenseExpiry = $filter('date')($scope.data[i].LicenseExpiry, "MM/dd/yyyy");
                }
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

    // Create/Insert New
    $scope.apiCreate = function () {
        $scope.dataItem.LicenseExpiry = document.getElementById('led').value;    
        $http.post("/api/Drivers", $scope.dataItem)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.data.push(data.objParam1);
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
        $scope.dataItem.LicenseExpiry = document.getElementById('led').value;
        $http.put("/api/Drivers/" + id, $scope.dataItem)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.data[$scope.driverSelectedIndex] = angular.copy(data.objParam1);
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
        $http.delete("/api/Drivers/" + id)
            .success(function (data, status) {
                $scope.data.splice($scope.driverSelectedIndex, 1);
                $scope.closeModalForm();
            })
            .error(function (data, status) {
                $scope.showFormError(status);
            })
    };

    $scope.setSelected = function (i, id) {
        $scope.selected = i;
        $scope.driverIdHolder = id;
    };

    $scope.searchDriver = function (id) {
        var i = 0;
        for (i = 0; i < $scope.data.length; i++) {
            if (id == $scope.data[i].Id) {
                return i;
            }
        }
        return i;
    };

    $scope.actionForm = function (action) {
        $scope.actionMode = action;
        $scope.driverSelectedIndex = $scope.searchDriver($scope.driverIdHolder);
        switch ($scope.actionMode) {
            case "Create":
                $scope.dataItem = {
                    "FirstName": "",
                    "MiddleName": "",
                    "LastName": "",
                    "LicenseNo": "",
                    "LicenseExpiry": ""
                }
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.openModalForm();
                break;
            case "Edit":
                $scope.dataItem = angular.copy($scope.data[$scope.driverSelectedIndex])
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.openModalForm();
                break;
            case "Delete":
                $scope.dataItem = angular.copy($scope.data[$scope.driverSelectedIndex])
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                $scope.openModalForm();
                break;
            case "View":
                $scope.dataItem = angular.copy($scope.data[$scope.driverSelectedIndex])
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
        if ($scope.dataItem.FirstName == null || $scope.dataItem.FirstName == "") {
            $scope.showFormError("First name is required.");
            return false;
        }
        else if ($scope.dataItem.FirstName == null || $scope.dataItem.FirstName == "") {
            $scope.showFormError("Last name is required.");
            return false;
        }
        return true;
    };

    var init = function () {
        // Call function to load data during content load
        $scope.loadData($scope.currentPage);
        $scope.processDriverSorting($scope.driverCriteria);
    };

    init();
});