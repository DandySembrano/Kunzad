//---------------------------------------------------------------------------------//
// Filename: customergroup-ctrl.js
// Description: Controller for CustomerGroup
// Author: Dandy Sembrano
//---------------------------------------------------------------------------------//

kunzadApp.controller("CustomerGroupController", function ($scope, $http) {

    $scope.modelName = "Customer Group";
    $scope.modelhref = "#/customergroups";

    //-------------------------dirDataGrid1 Paramaters-------------------------
    $scope.submitButtonText = "";
    $scope.submitButtonListener = false;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.actionCreate = false; //default to false
    $scope.actionMode = "Create";//default to Create
    $scope.dataDefinition = {
        "Header": ['Name', 'Remarks', 'No.'],
        "Keys": ['Name', 'Remarks'],
        "Type": ['String', 'String'],
        "DataList": [],
        "APIUrl": ['/api/CustomerGroups?page=',//get
                   '/api/CustomerGroups', //post, put, delete
        ],
        "DataItem": {},
        "DataTarget": "DataTableMenu",
        "ViewOnly": false,
        "ContextMenu": ["'Load'", "'Create'", "'Edit'", "'Delete'", "'View'", "'Export'"],
        "ContextMenuLabel": ['Reload', 'Create', 'Edit', 'Delete', 'View', 'Export']
    };
    $scope.closeModalForm = function () {
        jQuery.magnificPopup.close();
    };
    $scope.openModalForm = function () {
        $scope.isError = false;
        openModalPanel("#modal-panel");
    };
    $scope.otherActions = function (action) {
        switch (action) {
            case 'PreSave':
                delete $scope.dataDefinition.DataItem.Id;
                return true;
            case 'PostLoadAction':
                return true;
            default:
                return true;
        }
    };
    $scope.resetDataItem = function () {
        $scope.dataDefinition.DataItem = {
            "Name": "",
            "Remarks": ""
        }
    };
    $scope.showFormError = function (message) {
        $scope.isError = true;
        $scope.errorMessage = message;
    };
    //-------------------------End of dirDataGrid1 Parameters-------------------

    $scope.validateEntry = function () {
        if ($scope.dataDefinition.DataItem.Name == null || $scope.dataDefinition.DataItem.Name == "") {
            $scope.showFormError("Customer group name is required.");
            return false;
        }
        return true;
    };
    $scope.submit = function () {
        if ($scope.validateEntry())
            $scope.submitButtonListener = true;
    };
    $scope.actionForm = function (action) {
        $scope.actionCreate = true;
    };
    //$scope.data = [];
    //$scope.dataItem;

    ////------------------------------------------------------------------------------//
    //// Required controller properties. should be present in all dataTable controller
    //$scope.isPrevPage = false;
    //$scope.isNextPage = true;
    //$scope.actionMode = "Create";
    //$scope.selected = null;
    //$scope.currentPage = 1;
    //$scope.viewOnly = true;
    //$scope.isError = false;
    //$scope.errorMessage = "";
    //$scope.submitButtonText = "Submit";
    //var pageSize = 20;
    ////------------------------------------------------------------------------------//

    //// Get Customer Group List
    //$scope.loadData = function (page) {
    //    var spinner = new Spinner(opts).spin(spinnerTarget);
    //    $http.get("/api/CustomerGroups?page=" + page)
    //        .success(function (data, status) {
    //            $scope.data = data;
    //            $scope.currentPage = page;
    //            if (page <= 1) {
    //                $scope.isPrevPage = false;
    //            } else {
    //                $scope.isPrevPage = true;
    //            }
    //            var rows = data.length;
    //            if (rows < pageSize) {
    //                $scope.isNextPage = false;
    //            } else {
    //                $scope.isNextPage = true;
    //            }
    //            spinner.stop();
    //        })
    //        .error(function (data, status) {
    //            spinner.stop();
    //        })        
    //}

    //// Create/Insert New
    //$scope.apiCreate = function () {
    //    $http.post("/api/CustomerGroups", $scope.dataItem)
    //        .success(function (data, status) {
    //            $scope.dataItem = angular.copy(data);
    //            $scope.data.push($scope.dataItem);
    //            $scope.closeModalForm();
    //        })
    //        .error(function (data, status) {
    //            $scope.showFormError("");
    //        })
    //}

    //// Update
    //$scope.apiUpdate = function (id) {
    //    $http.put("/api/CustomerGroups/" + id, $scope.dataItem)
    //        .success(function (data, status) {
    //            $scope.data[$scope.selected] = angular.copy($scope.dataItem);
    //            $scope.closeModalForm();
    //        })
    //        .error(function (data, status) {
    //            $scope.showFormError("");
    //        })
    //}

    //// Delete
    //$scope.apiDelete = function (id) {
    //    $http.delete("/api/CustomerGroups/" + id)
    //        .success(function (data, status) {
    //            $scope.data.splice($scope.selected, 1);
    //            $scope.closeModalForm();
    //        })
    //        .error(function (data, status) {
    //            $scope.showFormError(status);
    //        })
    //}

    //$scope.setSelected = function (i) {
    //    $scope.selected = i;
    //}

    //$scope.actionForm = function (action) {
    //    $scope.actionMode = action;
    //    switch ($scope.actionMode) {
    //        case "Create":
    //            $scope.dataItem = {
    //                "Name": "",
    //                "Remarks": ""
    //            }
    //            $scope.viewOnly = false;
    //            $scope.submitButtonText = "Submit";
    //            $scope.openModalForm();
    //            break;
    //        case "Edit":
    //            $scope.dataItem = angular.copy($scope.data[$scope.selected])
    //            $scope.viewOnly = false;
    //            $scope.submitButtonText = "Submit";
    //            $scope.openModalForm();
    //            break;
    //        case "Delete":
    //            $scope.dataItem = angular.copy($scope.data[$scope.selected])
    //            $scope.viewOnly = true;
    //            $scope.submitButtonText = "Delete";
    //            $scope.openModalForm();
    //            break;
    //        case "View":
    //            $scope.dataItem = angular.copy($scope.data[$scope.selected])
    //            $scope.viewOnly = true;
    //            $scope.submitButtonText = "Close";
    //            $scope.openModalForm();
    //            break;
    //    }
    //}

    //$scope.openModalForm = function () {
    //    $scope.isError = false;
    //    openModalPanel("#modal-panel");
    //}

    //$scope.closeModalForm = function () {
    //    jQuery.magnificPopup.close();
    //}

    //$scope.showFormError = function(message) {
    //    $scope.isError = true;
    //    $scope.errorMessage = message;
    //}

    //$scope.submit = function () {
    //    switch ($scope.actionMode) {
    //        case "Create":
    //            if (validateEntry()) {
    //                $scope.apiCreate();
    //            }
    //            break;
    //        case "Edit":
    //            if (validateEntry()) {
    //                $scope.apiUpdate($scope.dataItem.Id);
    //            }
    //            break;
    //        case "Delete":
    //            $scope.apiDelete($scope.dataItem.Id);
    //            break;
    //        case "View":
    //            $scope.closeModalForm();
    //            break;
    //    }
    //}

    //// Validate Form Data Entry
    //var validateEntry = function () {
    //    if ($scope.dataItem.Name == null || $scope.dataItem.Name == "") {
    //        $scope.showFormError("Invalid customer group name.");
    //        return false;
    //    }
    //    return true;
    //}

    //var init = function () {
    //    // Call function to load data during content load
    //    $scope.loadData($scope.currentPage);
    //}

    //init();

});
