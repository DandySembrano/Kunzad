//---------------------------------------------------------------------------------//
// Filename: serviceablearea-ctrl.js
// Description: Controller for Serviceable Area
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("ServiceableAreaController", function ($rootScope, $scope, $http) {
    $scope.modelName = "Delivery Area";
    $scope.modelhref = "#/serviceablearea";

    //-------------------------dirDataGrid1 Paramaters-------------------------
    $scope.submitButtonText = "";
    $scope.submitButtonListener = false;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.actionCreate = false; //default to false
    $scope.actionMode = "Create";//default to Create
    $scope.dataDefinition = {
        "Header": ['Name', 'Business Unit', 'City/Municipality', 'Province/State', 'Postal Code', 'Country', 'Is Serviceable?', 'No.'],
        "Keys": ['Name', 'BusinessUnitName', 'CityMunicipalityName', 'StateProvinceName', 'PostalCode', 'CountryName', 'IsServiceable'],
        "Type": ['String', 'String', 'String', 'String', 'String', 'String', 'Boolean'],
        "RequiredFields": ['Name-Name', 'CityMunicipalityName-City/Municipality', 'PostalCode-Postal Code'],
        "DataList": [],
        "APIUrl": ['/api/ServiceableAreas?page=',//get
                   '/api/ServiceableAreas', //post, put, delete
        ],
        "DataItem": {},
        "DataTarget": "DataTableMenu",
        "ViewOnly": false,
        "ContextMenu": [],
        "ContextMenuLabel": []
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
                $scope.initializeCheckBox();
                delete $scope.dataDefinition.DataItem.Id;
                return true;
            case 'PostLoadAction':
                //retrieve business units and initialize Business Unit Name
                getBusinessUnits();
                $scope.country = $rootScope.country;
                //Initialize Country Name
                for (var i = 0; i < $scope.dataDefinition.DataList.length; i++) {
                    $scope.dataDefinition.DataList[i].CountryName = $scope.country.Name;
                }
                $scope.cityMunicipalities = $rootScope.getCityMunicipalities();
                //Initialize City/Municipality and State/Province
                for (var i = 0; i < $scope.dataDefinition.DataList.length; i++)
                {
                    for (var j = 0; j < $scope.cityMunicipalities.length; j++)
                    {
                        if ($scope.dataDefinition.DataList[i].CityMunicipalityId == $scope.cityMunicipalities[j].Id) {
                            $scope.dataDefinition.DataList[i].CityMunicipalityName = $scope.cityMunicipalities[j].Name;
                            $scope.dataDefinition.DataList[i].StateProvinceName = $scope.cityMunicipalities[j].StateProvinceName;
                            break;
                        }
                    }
                }
                return true;
            default:
                return true;
        }
    };
    $scope.resetDataItem = function () {
        $scope.dataDefinition.DataItem = {
            "Id": null,
            "Code": null,
            "Name": null,
            "CityMunicipalityId": null,
            "PostalCode": null,
            "IsServiceable": null,
            "BusinessUnitId": null,
            "CreatedDate": null,
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null,
            //"BusinessUnitName": [{ "Name": null }],
            "BusinessUnitName": null,
            "CityMunicipalityName": null,
            "StateProvinceName": null,
            "CountryName": null
        }
    };
    $scope.showFormError = function (message) {
        $scope.isError = true;
        $scope.errorMessage = message;
    };
    //-------------------------End of dirDataGrid1 Parameters-------------------
    $scope.submit = function () {
            $scope.submitButtonListener = true;
    };
    $scope.actionForm = function (action) {
        $scope.actionCreate = true;
    };

    $scope.selectBusinessUnit = function (id) {
        var i;
        for (i = 0; i < $scope.businessUnitList.length; i++) {
            if (id == $scope.businessUnitList[i].Id) {
                $scope.dataDefinition.DataItem.BusinessUnitName = $scope.businessUnitList[i].Name;
                break;
            }
        }
    };

    function getBusinessUnits() {
        $http.get("/api/BusinessUnits")
        .success(function (data, status) {
            $scope.businessUnitList = [];
            $scope.businessUnitList = angular.copy(data);
            //Initialize Business Unit
            for (var i = 0; i < $scope.dataDefinition.DataList.length; i++) {
                //search business unit type
                for (var j = 0; j < $scope.businessUnitList.length; j++) {
                    if ($scope.dataDefinition.DataList[i].BusinessUnitId == $scope.businessUnitList[j].Id) {
                        $scope.dataDefinition.DataList[i].BusinessUnitName = $scope.businessUnitList[j].Name;
                        break;
                    }
                }
            }
        })
        .error(function (error, status) {
            $scope.showFormError(status);
        })
    };

    $scope.initializeCheckBox = function () {
        if ($scope.dataDefinition.DataItem.IsServiceable == null)
            $scope.dataDefinition.DataItem.IsServiceable = false;
    };

    //---------------------------Code if using typeahead in city/municipality-------------------
    $scope.onSelectCity = function ($item, $model, $label) {
        $scope.dataDefinition.DataItem.CityMunicipalityId = $item.Id;
        $scope.dataDefinition.DataItem.CityMunicipalityName = $item.Name;
        $scope.dataDefinition.DataItem.StateProvinceName = $item.StateProvinceName;
        $scope.dataDefinition.DataItem.CountryName = $scope.country.Name;
    };
    //---------------------------End of typeahead-----------------------------------------------
});