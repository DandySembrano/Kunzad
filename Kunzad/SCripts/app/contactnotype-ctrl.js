//---------------------------------------------------------------------------------//
// Filename: contactnotype-ctrl.js
// Description: Controller for Contact No Type
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("ContactnoTypeController", function ($scope, $http) {
    $scope.modelName = "Contact Number Type";
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
    $scope.ctIdHolder = 0;
    $scope.ctCriteria = "Type";
    $scope.orderByctTypeDesc = true;
    $scope.orderByctTypeAsc = false;

    //process sorting of airline list
    $scope.processCTOrderBy = function (criteria) {
        switch (criteria) {
            case 'Type':
                //Ascending
                if ($scope.orderByctTypeDesc == true) {
                    $scope.orderByctTypeAsc = true;
                    $scope.orderByctTypeDesc = false;
                    criteria = 'Type';
                }
                    //Descending
                else {
                    $scope.orderByctTypeAsc = false;
                    $scope.orderByctTypeDesc = true;
                    criteria = '-Type';
                }
                break;
        }
        $scope.ctCriteria = criteria;
    };

    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/ContactNumberTypes?page=" + page)
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

    // Create/Insert New
    $scope.apiCreate = function () {
        $http.post("/api/ContactNumberTypes", $scope.dataItem)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.dataItem = angular.copy(data.objParam1);
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
        $http.put("/api/ContactNumberTypes/" + id, $scope.dataItem)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.data[$scope.selectedCTIndex] = angular.copy(data.objParam1);
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
        $http.delete("/api/ContactNumberTypes/" + id)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.data.splice($scope.selectedCTIndex, 1);
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

    $scope.setSelected = function (i, id) {
        $scope.selected = i;
        $scope.ctIdHolder = id;
    };

    //search trucker
    $scope.searchCT = function (id) {
        var i = 0;
        for (i = 0; i < $scope.data.length; i++) {
            if (id == $scope.data[i].Id) {
                return i;
            }
        }
        return i;
    };

    $scope.selectedCTIndex = null;

    $scope.actionForm = function (action) {
        $scope.actionMode = action;
        $scope.selectedCTIndex = $scope.searchCT($scope.ctIdHolder);
        switch ($scope.actionMode) {
            case "Create":
                $scope.dataItem = {
                    "Type": ""
                }
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.openModalForm();
                break;
            case "Edit":
                $scope.dataItem = angular.copy($scope.data[$scope.selectedCTIndex])
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.openModalForm();
                break;
            case "Delete":
                $scope.dataItem = angular.copy($scope.data[$scope.selectedCTIndex])
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                $scope.openModalForm();
                break;
            case "View":
                $scope.dataItem = angular.copy($scope.data[$scope.selectedCTIndex])
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
        if ($scope.dataItem.Type == null || $scope.dataItem.Name == "") {
            $scope.showFormError("Airline name is required.");
            return false;
        }
        return true;
    };

    var init = function () {
        // Call function to load data during content load
        $scope.loadData($scope.currentPage);
        $scope.processCTOrderBy('Type');
    };

    init();
});