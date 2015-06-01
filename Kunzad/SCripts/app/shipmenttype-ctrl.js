
//---------------------------------------------------------------------------------//
// Filename: shipmenttype-ctrl.js
// Description: Controller for Shipment Type
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("ShipmentTypeController", function ($scope, $http) {
    $scope.modelName = "Shipment Type";
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
    $scope.selectSTIndex = null;
    $scope.stIdHolder = 0;
    $scope.stCriteria = "Name";
    $scope.orderBySTNameDesc = true;
    $scope.orderBySTNameAsc = false;

    //process sorting of ST list
    $scope.processSTOrderBy = function (criteria) {
        switch (criteria) {
            case 'Name':
                //Ascending
                if ($scope.orderBySTNameDesc == true) {
                    $scope.orderBySTNameAsc = true;
                    $scope.orderBySTNameDesc = false;
                    criteria = 'Name';
                }
                    //Descending
                else {
                    $scope.orderBySTNameAsc = false;
                    $scope.orderBySTNameDesc = true;
                    criteria = '-Name';
                }
                break;
        }
        $scope.stCriteria = criteria;
    };

    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/ShipmentTypes?page=" + page)
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
        $http.post("/api/ShipmentTypes", $scope.dataItem)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.data.push(data.objParam1);
                    $scope.closeModalForm();
                }
                else
                {
                    $scope.showFormError(data.message);
                }
            })
            .error(function (data, status) {
                $scope.showFormError(status);
            })
    };

    // Update
    $scope.apiUpdate = function (id) {
        $http.put("/api/ShipmentTypes/" + id, $scope.dataItem)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.data[$scope.selectSTIndex] = angular.copy(data.objParam1);
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
        $http.delete("/api/ShipmentTypes/" + id)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.data.splice($scope.selectSTIndex, 1);
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
        $scope.stIdHolder = id;
    };

    //search Industry
    $scope.searchST = function (id) {
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
        $scope.selectSTIndex = $scope.searchST($scope.stIdHolder);
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
                $scope.dataItem = angular.copy($scope.data[$scope.selectSTIndex])
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.openModalForm();
                break;
            case "Delete":
                $scope.dataItem = angular.copy($scope.data[$scope.selectSTIndex])
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                $scope.openModalForm();
                break;
            case "View":
                $scope.dataItem = angular.copy($scope.data[$scope.selectSTIndex])
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
            $scope.showFormError("Shipment type name is required.");
            return false;
        }
        return true;
    };

    var init = function () {
        // Call function to load data during content load
        $scope.loadData($scope.currentPage);
        $scope.processSTOrderBy($scope.stCriteria);
    };

    init();
});