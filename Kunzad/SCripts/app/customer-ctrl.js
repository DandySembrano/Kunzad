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

        // Set navigation properties to null so it will not be inserted as new record //
        var dataModel = angular.copy($scope.dataItem);
        dataModel.CustomerAddresses = null;
        dataModel.Contacts = null;
        dataModel.CustomerGroup = null;
        dataModel.Industry = null;

        $http.post("/api/Customers", dataModel)
            .success(function (data, status) {
                $scope.dataItem.Id = angular.copy(data.Id);
                $scope.data.push($scope.dataItem);
                $scope.closeForm();
            })
            .error(function (data, status) {
                $scope.showFormError("Error: " + status);
            })
    }

    // Get/Retrieve
    $scope.apiGet = function (id) {
        $http.get("/api/Customers/" + id)
            .success(function (data, status) {
                $scope.dataItem = data;
            })
            .error(function (data, status) {
                $scope.showFormError("Error: " + status);
            })
    }

    // Update
    $scope.apiUpdate = function (id) {

        // Set navigation properties to null so it will not be inserted as new record //
        var dataModel = angular.copy($scope.dataItem);
        dataModel.CustomerAddresses = null;
        dataModel.Contacts = null;
        dataModel.CustomerGroup = null;
        dataModel.Industry = null;

        $http.put("/api/Customers/" + id, dataModel)
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
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.showForm = true;
                break;
            case "Edit":
                $scope.dataItem = angular.copy($scope.data[$scope.selected]);
                $scope.apiGet($scope.data[$scope.selected].Id);
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.showForm = true;
                break;
            case "Delete":
                $scope.dataItem = angular.copy($scope.data[$scope.selected]);
                $scope.apiGet($scope.data[$scope.selected].Id);
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                $scope.showForm = true;
                break;
            case "View":
                $scope.dataItem = angular.copy($scope.data[$scope.selected]);
                $scope.apiGet($scope.data[$scope.selected].Id);
                $scope.viewOnly = true;
                $scope.submitButtonText = "Close";
                $scope.showForm = true;
                break;
        }
    }

    $scope.openModalForm = function (panel) {
        $scope.isError = false;
        openModalPanel(panel);
    }

    $scope.closeModalForm = function () {
        jQuery.magnificPopup.close();
        $scope.isError = false;
    }

    $scope.closeForm = function () {
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


    //---------------------------------------------------------------------------------//
    // This section has codes for Customer Address Routines
    // This can be copied with slight modification to other modules with address routine

    $scope.country = $rootScope.country;
    $scope.cityMunicipalities = $rootScope.getCityMunicipalities();
    $scope.customerAddressAction = null;
    $scope.selectedCustomerAddressIndex = null;

    $scope.initAddress = function () {
        $scope.customerAddress = {
            "Id": null,
            "CustomerId": null,
            "Line1": null,
            "Line2": null,
            "CityMunicipalityId": null,
            "PostalCode": null,
            "IsBillingAddress": true,
            "IsDeliveryAddress": true,
            "IsPickupAddress": true,
            "CityMunicipality": {
                "Id": null,
                "Name": null,
                "StateProvinceId": null,
                "StateProvince": {
                    "Id": null,
                    "Name": null,
                    "CountryId": null,
                    "Country": {
                        "Id": null,
                        "Name": null
                    }
                }
            }
        }
    }

    // Create/Insert New Customer Address
    $scope.apiCreateCustomerAddresses = function () {
        var dataModel = angular.copy($scope.customerAddress);
        dataModel.CityMunicipality = null;
        dataModel.Customer = null;
        $http.post("/api/CustomerAddresses", dataModel)
            .success(function (data, status) {
                $scope.customerAddress.Id = angular.copy(data.Id);
                $scope.dataItem.CustomerAddresses.push($scope.customerAddress);
                $scope.closeModalForm();
            })
            .error(function (data, status) {
                $scope.showFormError("Error: " + status);
            })
    }
    
    // Update
    $scope.apiUpdateCustomerAddresses = function () {
        var dataModel = angular.copy($scope.customerAddress);
        dataModel.CityMunicipality = null;
        dataModel.Customer = null;
        $http.put("/api/CustomerAddresses/" + dataModel.Id, dataModel)
            .success(function (data, status) {
                $scope.dataItem.CustomerAddresses[$scope.selectedCustomerAddressIndex] = angular.copy($scope.customerAddress);
                $scope.closeModalForm();
            })
            .error(function (data, status) {
                $scope.showFormError("Error: " + status);
            })
    }

    // Delete
    $scope.apiDeleteCustomerAddresses = function () {
        $http.delete("/api/CustomerAddresses/" + $scope.customerAddress.Id)
            .success(function (data, status) {
                $scope.dataItem.CustomerAddresses.splice($scope.selectedCustomerAddressIndex, 1);
                $scope.closeModalForm();
            })
            .error(function (data, status) {
                $scope.showFormError("Error: " + status);
            })
    }

    $scope.openCustomerAddressForm = function (action, i) {
        $scope.customerAddressAction = action;
        $scope.selectedCustomerAddressIndex = i;
        switch ($scope.customerAddressAction) {
            case "Create":
                $scope.initAddress();
                $scope.openModalForm('#modal-panel-address')
                break;
            case "Edit":
                $scope.customerAddress = angular.copy($scope.dataItem.CustomerAddresses[i]);
                $scope.openModalForm('#modal-panel-address')
                break;
            case "Delete":
                $scope.customerAddress = $scope.dataItem.CustomerAddresses[i];
                $scope.openModalForm('#modal-panel-address')
                break;
        }
    }

    $scope.saveCustomerAddress = function (action) {
        switch (action) {
            case "Create" :
                $scope.customerAddress.CustomerId = $scope.dataItem.Id;
                $scope.apiCreateCustomerAddresses();
                break;
            case "Edit":
                $scope.apiUpdateCustomerAddresses();
                break;
            case "Delete":
                $scope.apiDeleteCustomerAddresses();
                break;
        }
    }

    $scope.onSelectCity = function ($item, $model, $label) {
        $scope.customerAddress.CityMunicipalityId = $item.Id;
        $scope.customerAddress.CityMunicipality.Id = $item.Id;
        $scope.customerAddress.CityMunicipality.Name = $item.Name;
        $scope.customerAddress.CityMunicipality.StateProvince.Id = $item.StateProvinceId;
        $scope.customerAddress.CityMunicipality.StateProvince.Name = $item.StateProvinceName;
        $scope.customerAddress.CityMunicipality.StateProvince.Country.Id = $scope.Country.Id;
        $scope.customerAddress.CityMunicipality.StateProvince.Country.Name = $scope.Country.Name;
    }


    //---------------------------------------------------------------------------------//
    // Initialization routines
    var init = function () {
        // Call function to load data during content load
        $scope.loadData($scope.currentPage);
        getCustomerGroups();
        getIndustries();
    }
    init();

});
