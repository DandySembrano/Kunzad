//---------------------------------------------------------------------------------//
// Filename: courier-ctrl.js
// Description: Controller for Courier
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("CourierController", function ($rootScope, $scope, $http) {
    $scope.modelName = "Courier";
    $scope.modelhref = "#/courier";
    $scope.data = [];
    $scope.dataItem;

    //------------------------------------------------------------------------------//
    // Required contr oller properties. should be present in all dataTable controller
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
    //------------------------------Order by for courier------------------------------
    $scope.courierCriteria = 'Name';
    $scope.courierIdHolder = 0;
    $scope.courierSelectedIndex = null;
    $scope.courierOrderByDesc = true;
    $scope.courierOrderByAsc = false;
    $scope.processCourierSorting = function (criteria) {
        switch (criteria) {
            case 'Name':
                //Ascending
                if ($scope.courierOrderByDesc == true) {
                    $scope.courierOrderByDesc = false;
                    $scope.courierOrderByAsc = true;
                    criteria = 'Name';
                }
                    //Descending
                else {
                    $scope.courierOrderByDesc = true;
                    $scope.courierOrderByAsc = false;
                    criteria = '-Name';
                }
                break;
            case 'TIN':
                //Ascending
                if ($scope.courierOrderByDesc == true) {
                    $scope.courierOrderByDesc = false;
                    $scope.courierOrderByAsc = true;
                    criteria = 'TIN';
                }
                    //Descending
                else {
                    $scope.courierOrderByDesc = true;
                    $scope.courierOrderByAsc = false;
                    criteria = '-TIN';
                }
                break;
            case 'Line1':
                //Ascending
                if ($scope.courierOrderByDesc == true) {
                    $scope.courierOrderByDesc = false;
                    $scope.courierOrderByAsc = true;
                    criteria = 'Line1';
                }
                    //Descending
                else {
                    $scope.courierOrderByDesc = true;
                    $scope.courierOrderByAsc = false;
                    criteria = '-Line1';
                }
                break;
            case 'PostalCode':
                //Ascending
                if ($scope.courierOrderByDesc == true) {
                    $scope.courierOrderByDesc = false;
                    $scope.courierOrderByAsc = true;
                    criteria = 'PostalCode';
                }
                    //Descending
                else {
                    $scope.courierOrderByDesc = true;
                    $scope.courierOrderByAsc = false;
                    criteria = '-PostalCode';
                }
                break;
        }
        $scope.courierCriteria = criteria;
    }
    //$scope.orderByCourierNameDesc = true;
    //$scope.orderByCourierNameAsc = false;
    //$scope.orderByCourierTINDesc = false;
    //$scope.orderByCourierTINAsc = false;
    //$scope.orderByCourierAddrDesc = false;
    //$scope.orderByCourierAddrAsc = false;
    //$scope.orderByCourierPCDesc = false;
    //$scope.orderByCourierPCAsc = false;
    //$scope.processCourierSorting = function (criteria) {
    //    switch (criteria) {
    //        case 'Name':
    //            //Ascending
    //            if ($scope.orderByCourierNameDesc == true) {
    //                $scope.orderByCourierNameAsc = true;
    //                $scope.orderByCourierNameDesc = false;
    //                criteria = 'Name';
    //            }
    //                //Descending
    //            else {
    //                $scope.orderByCourierNameAsc = false;
    //                $scope.orderByCourierNameDesc = true;
    //                criteria = '-Name';
    //            }
    //            $scope.orderByCourierTINDesc = false;
    //            $scope.orderByCourierTINAsc = false;
    //            $scope.orderByCourierAddrDesc = false;
    //            $scope.orderByCourierAddrAsc = false;
    //            $scope.orderByCourierPCDesc = false;
    //            $scope.orderByCourierPCAsc = false;
    //            break;
    //        case 'TIN':
    //            //Ascending
    //            if ($scope.orderByCourierTINDesc == true) {
    //                $scope.orderByCourierTINAsc = true;
    //                $scope.orderByCourierTINDesc = false;
    //                criteria = 'TIN';
    //            }
    //                //Descending
    //            else {
    //                $scope.orderByCourierTINAsc = false;
    //                $scope.orderByCourierTINDesc = true;
    //                criteria = '-TIN';
    //            }
    //            $scope.orderByCourierNameDesc = false;
    //            $scope.orderByCourierNameAsc = false;
    //            $scope.orderByCourierAddrDesc = false;
    //            $scope.orderByCourierAddrAsc = false;
    //            $scope.orderByCourierPCDesc = false;
    //            $scope.orderByCourierPCAsc = false;
    //            break;
    //        case 'Line1':
    //            //Ascending
    //            if ($scope.orderByCourierAddrDesc == true) {
    //                $scope.orderByCourierAddrAsc = true;
    //                $scope.orderByCourierAddrDesc = false;
    //                criteria = 'Line1';
    //            }
    //                //Descending
    //            else {
    //                $scope.orderByCourierAddrAsc = false;
    //                $scope.orderByCourierAddrDesc = true;
    //                criteria = '-Line1';
    //            }
    //            $scope.orderByCourierNameDesc = false;
    //            $scope.orderByCourierNameAsc = false;
    //            $scope.orderByCourierTINDesc = false;
    //            $scope.orderByCourierTINAsc = false;
    //            $scope.orderByCourierPCDesc = false;
    //            $scope.orderByCourierPCAsc = false;
    //            break;
    //        case 'PostalCode':
    //            //Ascending
    //            if ($scope.orderByCourierPCDesc == true) {
    //                $scope.orderByCourierPCAsc = true;
    //                $scope.orderByCourierPCDesc = false;
    //                criteria = 'PostalCode';
    //            }
    //                //Descending
    //            else {
    //                $scope.orderByCourierPCAsc = false;
    //                $scope.orderByCourierPCDesc = true;
    //                criteria = '-PostalCode';
    //            }
    //            $scope.orderByCourierNameDesc = false;
    //            $scope.orderByCourierNameAsc = false;
    //            $scope.orderByCourierTINDesc = false;
    //            $scope.orderByCourierTINAsc = false;
    //            $scope.orderByCourierAddrAsc = false;
    //            $scope.orderByCourierAddrDesc = false;
    //            break;
    //    }
    //    $scope.courierCriteria = criteria;
    //};
    //------------------------------End of order by-------------------------------------


    $scope.formatTIN = function () {
        if ($scope.dataItem.TIN.length == 3)
            $scope.dataItem.TIN = $scope.dataItem.TIN + "-";
        if ($scope.dataItem.TIN.length == 7)
            $scope.dataItem.TIN = $scope.dataItem.TIN + "-";
    };

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
                if (data.status == "SUCCESS") {
                    console.log(data.objParam1);
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
        $http.put("/api/Couriers/" + id, $scope.dataItem)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.data[$scope.courierSelectedIndex] = angular.copy($scope.dataItem);
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
        $http.delete("/api/Couriers/" + id)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.data.splice($scope.courierSelectedIndex, 1);
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
        $scope.courierIdHolder = id;
    };

    //search Courier
    $scope.searchCourier = function (id) {
        var i = 0;
        for (i = 0; i < $scope.data.length; i++) {
            if (id == $scope.data[i].Id) {
                return i;
            }
        }
        return i;
    };

    $scope.actionForm = function (action) {
        $scope.country = $rootScope.country;
        $scope.cityMunicipalities = $rootScope.getCityMunicipalities();
        $scope.actionMode = action;
        $scope.courierSelectedIndex = $scope.searchCourier($scope.courierIdHolder);
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
                $scope.dataItem = angular.copy($scope.data[$scope.courierSelectedIndex])
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.openModalForm();
                break;
            case "Delete":
                $scope.dataItem = angular.copy($scope.data[$scope.courierSelectedIndex])
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                $scope.openModalForm();
                break;
            case "View":
                $scope.dataItem = angular.copy($scope.data[$scope.courierSelectedIndex])
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

    //---------------------------Code if using typeahead in city/municipality-------------------
    $scope.onSelectCity = function ($item, $model, $label) {
        $scope.dataItem.CityMunicipalityId = $item.Id;
        $scope.dataItem.CityMunicipality.Id = $item.Id;
        $scope.dataItem.CityMunicipality.Name = $item.Name;
        $scope.dataItem.CityMunicipality.StateProvince.Id = $item.StateProvinceId;
        $scope.dataItem.CityMunicipality.StateProvince.Name = $item.StateProvinceName;
        $scope.dataItem.CityMunicipality.StateProvince.Country.Id = $scope.Country.Id;
        $scope.dataItem.CityMunicipality.StateProvince.Country.Name = $scope.Country.Name;
    };
    //---------------------------End of typeahead-----------------------------------------------

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

    var init = function () {
        // Call function to load data during content load
        $scope.loadData($scope.currentPage);
        $scope.processCourierSorting($scope.courierCriteria);
    };

    init();
});