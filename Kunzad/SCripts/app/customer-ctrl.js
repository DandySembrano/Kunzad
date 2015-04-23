//---------------------------------------------------------------------------------//
// Filename: customer-ctrl.js
// Description: Controller for Customer
// Author: Dandy Sembrano
//---------------------------------------------------------------------------------//

kunzadApp.controller("CustomerController", function ($rootScope, $scope, $http) {

    //------------------------------------------------------------------------------//
    // Required controller properties. should be present in all dataTable controller
    $scope.modelName = "Customer";
    $scope.modelhref = "#/customers";
    $scope.data = [];
    $scope.dataItem;
    var pageSize = 20;

    $scope.isPrevPage = false;
    $scope.isNextPage = true;
    $scope.actionMode = "Create";
    $scope.selected = null;
    $scope.currentPage = 1;
    $scope.viewOnly = true;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.submitButtonText = "Submit";
    //------------------------------------------------------------------------------//

    $scope.tabPages = ["General", "Addresses", "Contacts"];
    $scope.selectedTab = "General";

    $scope.CustomerGroups = [];
    $scope.Industries = [];
    $scope.showForm = false;

    $scope.cityMunicipalities = $rootScope.cityMunicipalities;

    $scope.initDataItem = function () {
        $scope.dataItem = {
            "Id": null,
            "Code": null,
            "Name": null,
            "CustomerGroupId": null,
            "IndustryId": null,
            "TIN": null,
            "Industry": null,
            "CustomerGroup": null,
            "CustomerAddresses": [],
            "CustomerContacts": [],
            "Shipments": [],
            "TruckingDeliveries": []
        }
    }

    $scope.Address = {
        "Id": null,
        "Line1": null,
        "Line2": null,
        "Line3": null,
        "CityMunicipalityId": null,
        "PostalCode": null
    }

    // Get Customer List
    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/Customers?page=" + page)
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
    }

    // Create/Insert New
    $scope.apiCreate = function () {

        $http.post("/api/Customers", $scope.dataItem)
            .success(function (data, status) {
                //$scope.dataItem = angular.copy(data);
                $scope.dataItem.Id = angular.copy(data.Id);
                $scope.data.push($scope.dataItem);
                $scope.closeForm();
            })
            .error(function (data, status) {
                $scope.showFormError("Error: " + status);
            })
    }

    // Update
    $scope.apiUpdate = function (id) {
        $http.put("/api/Customers/" + id, $scope.dataItem)
            .success(function (data, status) {
                $scope.data[$scope.selected] = angular.copy($scope.dataItem);
                $scope.closeForm();
            })
            .error(function (data, status) {
                $scope.showFormError("Error: " + status);
            })
    }

    // Delete
    $scope.apiDelete = function (id) {
        $http.delete("/api/Customers/" + id)
            .success(function (data, status) {
                $scope.data.splice($scope.selected, 1);
                $scope.closeForm();
            })
            .error(function (data, status) {
                $scope.showFormError("Error: " + status);
            })
    }

    $scope.setSelected = function (i) {
        $scope.selected = i;
    }

    $scope.actionForm = function (action) {
        $scope.actionMode = action;
        switch ($scope.actionMode) {
            case "Create":
                $scope.initDataItem();
                //$scope.dataItem = angular.copy($scope.data[$scope.selected]);
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                //$scope.openModalForm();
                $scope.showForm = true;
                break;
            case "Edit":
                $scope.dataItem = angular.copy($scope.data[$scope.selected]);
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                //$scope.openModalForm();
                $scope.showForm = true;
                break;
            case "Delete":
                $scope.dataItem = angular.copy($scope.data[$scope.selected]);
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                //$scope.openModalForm();
                $scope.showForm = true;
                break;
            case "View":
                $scope.dataItem = angular.copy($scope.data[$scope.selected]);
                $scope.viewOnly = true;
                $scope.submitButtonText = "Close";
                //$scope.openModalForm();
                $scope.showForm = true;
                break;
        }
    }

    $scope.openModalForm = function () {
        $scope.isError = false;
        openModalPanel("#modal-panel");
    }

    $scope.closeForm = function () {
        //jQuery.magnificPopup.close();
        $scope.isError = false;
        $scope.showForm = false;
    }

    $scope.showFormError = function (message) {
        $scope.isError = true;
        $scope.errorMessage = message;
    }

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
                $scope.closeForm();
                break;
        }
    }

    // Validate Form Data Entry
    function validateEntry() {
        if ($scope.dataItem.Name == null || $scope.dataItem.Name == "") {
            $scope.showFormError("Invalid customer group name.");
            return false;
        }
        return true;
    }

    // Get Industry List
    var getIndustries = function () {
        $http.get("/api/Industries")
            .success(function (data, status) {
                $scope.Industries = data;
            })
            .error(function (data, status) {
            })
    }

    // Get Customer Group
    var getCustomerGroups = function () {
        $http.get("/api/CustomerGroups")
            .success(function (data, status) {
                $scope.CustomerGroups = data;
            })
            .error(function (data, status) {
            })
    }

    $scope.selectIndustry = function (id) {
        var industry = null;
        for (i = 0; i < $scope.Industries.length; i++) {
            if ($scope.Industries[i].Id === id) {
                industry = $scope.Industries[i]
            }
        }
        $scope.dataItem.Industry = industry;
    }

    $scope.selectCustomerGroup = function (id) {
        var cgroup = null;
        for (i = 0; i < $scope.CustomerGroups.length; i++) {
            if ($scope.CustomerGroups[i].Id === id) {
                cgroup = $scope.CustomerGroups[i]
            }
        }
        $scope.dataItem.CustomerGroup = cgroup;
    }

    $scope.setSelectedTab = function (tab) {
        $scope.selectedTab = tab;
    }

    var init = function () {
        // Call function to load data during content load
        $scope.loadData($scope.currentPage);
        getCustomerGroups();
        getIndustries();
    }

    init();

});
