//---------------------------------------------------------------------------------//
// Filename: airline-ctrl.js
// Description: Controller for Airlines
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("AirlineController", function ($scope, $http) {
    $scope.modelName = "Airline";
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
    $scope.airlineIdHolder = 0;
    $scope.airlineCriteria = "Name";
    $scope.orderByAirlineNameDesc = true;
    $scope.orderByAirlineNameAsc = false;

    //process sorting of airline list
    $scope.processAirlineOrderBy = function (criteria) {
        switch (criteria) {
            case 'Name':
                //Ascending
                if ($scope.orderByAirlineNameDesc == true) {
                    $scope.orderByAirlineNameAsc = true;
                    $scope.orderByAirlineNameDesc = false;
                    criteria = 'Name';
                }
                    //Descending
                else {
                    $scope.orderByAirlineNameAsc = false;
                    $scope.orderByAirlineNameDesc = true;
                    criteria = '-Name';
                }
                break;
        }
        $scope.airlineCriteria = criteria;
    };

    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/AirLines?page=" + page)
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
        $http.post("/api/AirLines", $scope.dataItem)
            .success(function (data, status) {
                $scope.dataItem = angular.copy(data);
                $scope.data.push($scope.dataItem);
                $scope.closeModalForm();
            })
            .error(function (data, status) {
                $scope.showFormError("");
            })
    };

    // Update
    $scope.apiUpdate = function (id) {
        $http.put("/api/AirLines/" + id, $scope.dataItem)
            .success(function (data, status) {
                $scope.data[$scope.selectedAirlineIndex] = angular.copy($scope.dataItem);
                $scope.closeModalForm();
            })
            .error(function (data, status) {
                $scope.showFormError("");
            })
    };

    // Delete
    $scope.apiDelete = function (id) {
        $http.delete("/api/AirLines/" + id)
            .success(function (data, status) {
                $scope.data.splice($scope.selectedAirlineIndex, 1);
                $scope.closeModalForm();
            })
            .error(function (data, status) {
                $scope.showFormError(status);
            })
    };

    $scope.setSelected = function (i, id) {
        $scope.selected = i;
        $scope.airlineIdHolder = id;
    };

    //search Airline
    $scope.searchAirline = function (id) {
        var i = 0;
        for (i = 0; i < $scope.data.length; i++) {
            if (id == $scope.data[i].Id) {
                return i;
            }
        }
        return i;
    };

    $scope.selectedAirlineIndex = null;

    $scope.actionForm = function (action) {
        $scope.actionMode = action;
        $scope.selectedAirlineIndex = $scope.searchAirline($scope.airlineIdHolder);
        switch ($scope.actionMode) {
            case "Create":
                $scope.dataItem = {
                    "Name": ""
                }
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.openModalForm();
                break;
            case "Edit":
                $scope.dataItem = angular.copy($scope.data[$scope.selectedAirlineIndex])
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.openModalForm();
                break;
            case "Delete":
                $scope.dataItem = angular.copy($scope.data[$scope.$scope.selectedAirlineIndex])
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                $scope.openModalForm();
                break;
            case "View":
                $scope.dataItem = angular.copy($scope.data[$scope.$scope.selectedAirlineIndex])
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
        if ($scope.dataItem.Name == null || $scope.dataItem.Name == "") {
            $scope.showFormError("Airline name is required.");
            return false;
        }
        return true;
    };

    var init = function () {
        // Call function to load data during content load
        $scope.loadData($scope.currentPage);
        $scope.processAirlineOrderBy('Name');
    };

    init();
});