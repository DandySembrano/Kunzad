//---------------------------------------------------------------------------------//
// Filename: courier-ctrl.js
// Description: Controller for Courier
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("CourierController", function ($rootScope, $scope, $http) {
    $scope.modelName = "Courier";
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

    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/Couriers?page=" + page)
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
        var dataModel = angular.copy($scope.dataItem);
        delete dataModel.Id;
        delete dataModel.CityMunicipality;
        $http.post("/api/Couriers", dataModel)
            .success(function (data, status) {
                $scope.dataItem.Id = angular.copy(data.Id);
                $scope.data.push($scope.dataItem);
                $scope.closeModalForm();
            })
            .error(function (data, status) {
                $scope.showFormError("");
            })
    };

    // Update
    $scope.apiUpdate = function (id) {
        $http.put("/api/Couriers/" + id, $scope.dataItem)
            .success(function (data, status) {
                $scope.data[$scope.selected] = angular.copy($scope.dataItem);
                $scope.closeModalForm();
            })
            .error(function (data, status) {
                $scope.showFormError("");
            })
    };

    // Delete
    $scope.apiDelete = function (id) {
        $http.delete("/api/Couriers/" + id)
            .success(function (data, status) {
                $scope.data.splice($scope.selected, 1);
                $scope.closeModalForm();
            })
            .error(function (data, status) {
                $scope.showFormError(status);
            })
    };

    $scope.setSelected = function (i) {
        $scope.selected = i;
    };

    $scope.actionForm = function (action) {
        $scope.actionMode = action;
        //required if module include municipalities------
        $scope.country = $rootScope.country;
        $scope.cityMunicipalities = $rootScope.getCityMunicipalities();
        //-----------------------------------------------
        switch ($scope.actionMode) {
            case "Create":
                //set dataitem as model for trucker form
                $scope.dataItem = {
                    "Id": null,
                    "Name": null,
                    "TIN": null,
                    "Line1": null,
                    "Line2": null,
                    "CityMunicipalityId": null,
                    "PostalCode": null,
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
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.openModalForm();
                break;
            case "Edit":
                $scope.dataItem = angular.copy($scope.data[$scope.selected])
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.openModalForm();
                break;
            case "Delete":
                $scope.dataItem = angular.copy($scope.data[$scope.selected])
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                $scope.openModalForm();
                break;
            case "View":
                $scope.dataItem = angular.copy($scope.data[$scope.selected])
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
        else if ($scope.dataItem.Line1 == null || $scope.dataItem.Line1 == "") {
            $scope.showFormError("Streed address Line1 is required.");
            return false;
        }
        else if ($scope.dataItem.CityMunicipalityId == null || $scope.dataItem.CityMunicipalityId == "") {
            $scope.showFormError("City/Municipality is required.");
            return false;
        }
        return true;
    };
    $scope.onSelectCity = function ($item, $model, $label) {
        $scope.dataItem.CityMunicipalityId = $item.Id;
        $scope.dataItem.CityMunicipality.Id = $item.Id;
        $scope.dataItem.CityMunicipality.Name = $item.Name;
        $scope.dataItem.CityMunicipality.StateProvince.Id = $item.StateProvinceId;
        $scope.dataItem.CityMunicipality.StateProvince.Name = $item.StateProvinceName;
        $scope.dataItem.CityMunicipality.StateProvince.Country.Id = $scope.Country.Id;
        $scope.dataItem.CityMunicipality.StateProvince.Country.Name = $scope.Country.Name;
    };
    var init = function () {
        // Call function to load data during content load
        $scope.loadData($scope.currentPage);
    };

    init();
});