//---------------------------------------------------------------------------------//
// Filename: trucker-ctrl.js
// Description: Controller for Trucker
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("TruckerController", function ($rootScope, $scope, $http) {
    //------------------------------------------------------------------------------//
    // Required controller properties. should be present in all dataTable controller
    $scope.modelName = "Trucker";
    $scope.modelhref = "#/truckers";
    $scope.data = [];
    $scope.truckListHolder = [];
    $scope.dataItem;
    $scope.showTab2 = false;
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
    $scope.tabPages = ["General", "Truck"];
    $scope.selectedTab = "General";
    $scope.showForm = false;

    // Get Truck Type
    var getTruckTypes = function () {
        $http.get("/api/TruckTypes")
            .success(function (data, status) {
                $scope.TruckTypes = data;
            })
            .error(function (data, status) {
            })
    }

    //set dataitem as model for trucker form
    $scope.initDataItem = function () {
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
            },
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null,
            "Trucks": []
        }
    };

    // Get Trucker List
    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/Truckers?page=" + page)
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

    // Create/Insert New Trucker/Truck(s)
    $scope.apiCreate = function () {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0;
        var dataModel = angular.copy($scope.dataItem);
        dataModel.Trucks = angular.copy($scope.truckList);

        for (i = 0; i < dataModel.Trucks.length; i++) {
            //initialize truckerId to 1 as dummy
            dataModel.Trucks[i].TruckerId = -1;
            delete dataModel.Trucks[i].Id;
            delete dataModel.Trucks[i].TruckType;
            delete dataModel.Trucks[i].Trucker;
            delete dataModel.Trucks[i].Truckings;
        }
        //initialize datamodel to dataitem
        //Delete fields that will not be included in saving data
        delete dataModel.Id;
        delete dataModel.CityMunicipality;
        //save truckers
        $http.post("/api/Truckers", dataModel)
            .success(function (data, status) {
                //Initialize TruckerId
                $scope.dataItem.Id = angular.copy(data.Id);
                $scope.data.push($scope.dataItem);
                //initialize TruckId
                for(i = 0; i < $scope.truckList.length; i++)
                    $scope.truckList[i].Id = angular.copy(data.Trucks[i].Id);
                $scope.closeForm();
            })
            .error(function (data, status) {
                $scope.showFormError("Error: " + status);
                $scope.selectedTab = "General";
            })
        spinner.stop();
    };

    // Get/Retrieve
    $scope.apiGet = function (id) {
        $http.get("/api/Truckers/" + id)
            .success(function (data, status) {
                if (data.status == "SUCCESS")
                {
                    $scope.dataItem = angular.copy(data.objParam1);
                    $scope.truckList = [];
                    $scope.truckList = angular.copy($scope.dataItem.Trucks);
                }
                else
                    $scope.showFormError("Error: " + data.message);
            })
    };

    // Update Trucker/Truck(s)
    $scope.apiUpdate = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0, j = 0;

        var dataModel = angular.copy($scope.dataItem);
        dataModel.Trucks = angular.copy($scope.truckList);
        for (i = 0; i < dataModel.Trucks.length; i++) {
            //delete if truckId if newly added truck
            if (dataModel.Trucks[i].Id == null)
                delete dataModel.Trucks[i].Id;
            //delete null properties
            delete dataModel.Trucks[i].Trucker;
            delete dataModel.Trucks[i].Truckings;
            delete dataModel.Trucks[i].TruckType;
        }
        // initialize datamodel to dataitem
        // Delete fields that will not be included in saving data
        delete dataModel.CityMunicipality;
        $http.put("/api/Truckers/" + id, dataModel)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    //initialize trucker info
                    $scope.data[$scope.selected] = angular.copy(data.objParam1);
                    //initialize TruckId
                    for (i = 0; i < $scope.truckList.length; i++) {
                        $scope.truckList[i].Id = angular.copy($scope.data[$scope.selected].Trucks[i].Id);
                    }
                    $scope.closeForm();
                }
                else {
                    //reset trucker data
                    $scope.showFormError("Error: " + data.message);
                    $scope.selectedTab = "General";
                }
            })
        spinner.stop();
    };

    // Delete
    $scope.apiDelete = function (id) {
        $http.delete("/api/Truckers/" + id)
            .success(function (data, status) {
                $scope.data.splice($scope.selected, 1);
                $scope.closeForm();
            })
            .error(function (data, status) {
                $scope.showFormError("Error: " + status);
            })
    };

    $scope.setSelected = function (i) {
        $scope.selected = i;
    };

    $scope.actionForm = function (action) {
        //required if module include municipalities------
        $scope.country = $rootScope.country;
        $scope.cityMunicipalities = $rootScope.getCityMunicipalities();
        //-----------------------------------------------
        $scope.actionMode = action;
        $scope.truckListHolder = [];
        $scope.dataHolder = [];
        switch ($scope.actionMode) {
            case "Create":
                $scope.truckList = [];
                $scope.showTab2 = false;
                $scope.initDataItem();
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.showForm = true;
                break;
            case "Edit":
                $scope.showTab2 = true;
                $scope.dataItem = angular.copy($scope.data[$scope.selected]);
                $scope.apiGet($scope.data[$scope.selected].Id);
                //serve as holder if ever the update will trigger an error
                //--------------------------------------------------------
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.showForm = true;
                break;
            case "Delete":
                $scope.showTab2 = true;
                $scope.dataItem = angular.copy($scope.data[$scope.selected]);
                $scope.apiGet($scope.data[$scope.selected].Id);
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                $scope.showForm = true;
                break;
            case "View":
                $scope.showTab2 = true;
                $scope.dataItem = angular.copy($scope.data[$scope.selected]);
                $scope.apiGet($scope.data[$scope.selected].Id);
                $scope.viewOnly = true;
                $scope.submitButtonText = "Close";
                $scope.showForm = true;
                break;
        }
    };

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

    // Validate Form Data Entry
    function validateEntry() {
        if ($scope.dataItem.Name == null || $scope.dataItem.Name == "") {
            $scope.showFormError("Trucker name is required.");
            $scope.selectedTab = "General";
            return false;
        }
        return true;
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

    $scope.setSelectedTab = function (tab) {
        $scope.selectedTab = tab;
    };

    $scope.TruckAction = null;
    $scope.selectedTruckIndex = null;

    //set truck as model for truck form
    $scope.initTruck = function () {
        $scope.Truck = {
                "Trucker": {
                    "Id": null,
                    "Name": null,
                    "TIN": null,
                    "Line1": null,
                    "Line2": null,
                    "CityMunicipalityId": null,
                    "PostalCode": null,
                },
                "TruckType": {
                    "Trucks": [],
                    "Id": null,
                    "Type": null,
                    "WeightCapacity": null,
                    "VolumeCapacity": null,
                },
                "Truckings": [],
                "Id": null,
                "PlateNo": null,
                "TruckTypeId": null,
                "TruckerId": null
            }
    };

    function validateTruck()
    {
        if ($scope.Truck.PlateNo == null || $scope.Truck.PlateNo == "")
        {
            $scope.showFormError("Plate number is required.");
            return false;
        }
        else if ($scope.Truck.TruckTypeId == null || $scope.Truck.TruckTypeId == "")
        {
            $scope.showFormError("Type is required.");
            return false;
        }
        return true;
    }
    $scope.selectTruckType = function (id) {
        var truckType = null;
        for (i = 0; i < $scope.TruckTypes.length; i++) {
            if ($scope.TruckTypes[i].Id === id) {
                truckType = $scope.TruckTypes[i]
            }
        }
        $scope.Truck.TruckType = truckType;
    }

    // Create/Insert Truck
    $scope.apiCreateTruck = function () {
        $scope.Truck.TruckerId = $scope.dataItem.Id;
        $scope.truckList.push($scope.Truck);
        $scope.closeModalForm();
    };

    //Update Truck
    $scope.apiUpdateTruck = function () {
        $scope.truckList[$scope.selectedTruckIndex] = angular.copy($scope.Truck);
        $scope.closeModalForm();
    };

    //Delete Truck
    $scope.apiDeleteTruck = function () {
        $scope.truckList.splice($scope.selectedTruckIndex, 1);
        $scope.closeModalForm();
    }

    //Manage opening of modal
    $scope.openTruckForm = function (action, i) {
        $scope.TruckAction = action;
        $scope.selectedTruckIndex = i;
        switch ($scope.TruckAction) {
            case "Create":
                $scope.initTruck();
                $scope.openModalForm('#modal-panel-truck')
                break;
            case "Edit":
                $scope.Truck = angular.copy($scope.truckList[i]);
                $scope.openModalForm('#modal-panel-truck')
                break;
            case "Delete":
                $scope.Truck = $scope.truckList[i];
                $scope.openModalForm('#modal-panel-truck')
                break;
        }
    };

    //Manage saving of truck
    $scope.saveTruck = function (action) {
        switch (action) {
            case "Create":
                if (validateTruck())
                    $scope.apiCreateTruck();
                break;
            case "Edit":
                if (validateTruck()) 
                    $scope.apiUpdateTruck();
                break;
            case "Delete":
                if (validateTruck())
                    $scope.apiDeleteTruck();
                break;
        }
    };

    //Initialize CityMunicipality property of dataItem
    $scope.onSelectCity = function ($item, $model, $label) {
        $scope.dataItem.CityMunicipalityId = $item.Id;
        $scope.dataItem.CityMunicipality.Id = $item.Id;
        $scope.dataItem.CityMunicipality.Name = $item.Name;
        $scope.dataItem.CityMunicipality.StateProvince.Id = $item.StateProvinceId;
        $scope.dataItem.CityMunicipality.StateProvince.Name = $item.StateProvinceName;
        $scope.dataItem.CityMunicipality.StateProvince.Country.Id = $scope.Country.Id;
        $scope.dataItem.CityMunicipality.StateProvince.Country.Name = $scope.Country.Name;
    };

    // Initialization routines
    var init = function () {
        // Call function to load data during content load
        $scope.loadData($scope.currentPage);
        getTruckTypes();
    }
    init();
});