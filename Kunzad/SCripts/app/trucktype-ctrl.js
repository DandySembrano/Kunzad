//---------------------------------------------------------------------------------//
// Filename: trucktype-ctrl.js
// Description: Controller for Truck Type
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("TruckTypeController", function ($scope, $http) {
    $scope.modelName = "Truck Type";
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
    //--------------------------------Truck Type OrderBy------------------------------
    $scope.ttIdHolder = 0;
    $scope.selectedTTIndex = null;
    $scope.ttCriteria = 'Type';
    $scope.ttOrderByDesc = true;
    $scope.ttOrderByAsc = false;
    $scope.processTTSorting = function (criteria) {
        switch (criteria) {
            case 'Type':
                //Ascending
                if ($scope.ttOrderByDesc == true) {
                    $scope.ttOrderByDesc = false;
                    $scope.ttOrderByAsc = true;
                    criteria = 'Type';
                }
                    //Descending
                else {
                    $scope.ttOrderByDesc = true;
                    $scope.ttOrderByAsc = false;
                    criteria = '-Type';
                }
                break;
            case 'WeightCapacity':
                //Ascending
                if ($scope.ttOrderByDesc == true) {
                    $scope.ttOrderByDesc = false;
                    $scope.ttOrderByAsc = true;
                    criteria = 'WeightCapacity';
                }
                    //Descending
                else {
                    $scope.ttOrderByDesc = true;
                    $scope.ttOrderByAsc = false;
                    criteria = '-WeightCapacity';
                }
                break;
            case 'VolumeCapacity':
                //Ascending
                if ($scope.ttOrderByDesc == true) {
                    $scope.ttOrderByDesc = false;
                    $scope.ttOrderByAsc = true;
                    criteria = 'VolumeCapacity';
                }
                    //Descending
                else {
                    $scope.ttOrderByDesc = true;
                    $scope.ttOrderByAsc = false;
                    criteria = '-VolumeCapacity';
                }
                break;
        }
        $scope.ttCriteria = criteria;
    };
    //--------------------------------End of OrderBy---------------------------------

    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/TruckTypes?page=" + page)
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
        $http.post("/api/TruckTypes", $scope.dataItem)
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
        $http.put("/api/TruckTypes/" + id, $scope.dataItem)
            .success(function (data, status) {
                if(data.status == "SUCCESS"){
                    $scope.data[$scope.selectedTTIndex] = angular.copy(data.objParam1);
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
        $http.delete("/api/TruckTypes/" + id)
            .success(function (data, status) {
                console.log(data);
                if (data.status == "SUCCESS") {
                    $scope.data.splice($scope.selectedTTIndex, 1);
                    $scope.closeModalForm();
                } else {
                    $scope.showFormError(data.message);
                }
            })
            .error(function (data, status) {
                $scope.showFormError(status);
            })
    };

    $scope.setSelected = function (i, id) {
        $scope.selected = i;
        $scope.ttIdHolder = id;
    };

    //search Truck Type
    $scope.searchTT = function (id) {
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
        $scope.selectedTTIndex = $scope.searchTT($scope.ttIdHolder);
        switch ($scope.actionMode) {
            case "Create":
                $scope.dataItem = {
                    "Type": "",
                    "WeightCapacity": "",
                    "VolumeCapacity": "",
                }
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.openModalForm();
                break;
            case "Edit":
                $scope.dataItem = angular.copy($scope.data[$scope.selectedTTIndex])
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.openModalForm();
                break;
            case "Delete":
                $scope.dataItem = angular.copy($scope.data[$scope.selectedTTIndex])
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                $scope.openModalForm();
                break;
            case "View":
                $scope.dataItem = angular.copy($scope.data[$scope.selectedTTIndex])
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
        if ($scope.dataItem.Type == null || $scope.dataItem.Type == "") {
            $scope.showFormError("Truck Type is required.");
            return false;
        }
        else if ($scope.dataItem.WeightCapacity == null || $scope.dataItem.WeightCapacity == "") {
            $scope.showFormError("Weight Capacity is required.");
            return false;
        }
        else if ($scope.dataItem.VolumeCapacity == null || $scope.dataItem.VolumeCapacity == "") {
            $scope.showFormError("Volume Capacity is required.");
            return false;
        }
        return true;
    };

    var init = function () {
        // Call function to load data during content load
        $scope.loadData($scope.currentPage);
        $scope.processTTSorting($scope.ttCriteria);
    };

    init();
});