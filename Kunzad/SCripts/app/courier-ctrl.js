//---------------------------------------------------------------------------------//
// Filename: courier-ctrl.js
// Description: Controller for Courier
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("CourierController", function ($rootScope, $scope, $http) {
    $scope.modelName = "Courier";
    $scope.modelhref = "#/courier";

    //-------------------------dirDataGrid1 Paramaters-------------------------
    $scope.submitButtonText = "";
    $scope.submitButtonListener = false;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.actionCreate = false; //default to false
    $scope.actionMode = "Create";//default to Create
    $scope.dataDefinition = {
        "Header": ['Name', 'TIN', 'Street Address 1', 'Street Address 2', 'City/Municipality', 'Province/State', 'Postal Code', 'Country', 'No.'],
        "Keys": ['Name', 'TIN', 'Line1', 'Line2', 'CityMunicipalityName', 'StateProvinceName', 'PostalCode', 'CountryName'],
        "Type": ['Default', 'String', 'String', 'String', 'String', 'String', 'String', 'String'],
        "DataList": [],
        "APIUrl": ['/api/Couriers?page=',//get
                    '/api/Couriers', //post, put, delete
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
                delete $scope.dataDefinition.DataItem.CityMunicipality;
                return true;
            case 'PreAction':
                $scope.country = $rootScope.country;
                $scope.cityMunicipalities = $rootScope.getCityMunicipalities();
                return true;
            case 'PostLoadAction':
                for (var i = 0; i < $scope.dataDefinition.DataList.length; i++)
                {
                    $scope.dataDefinition.DataList[i].CityMunicipalityName = $scope.dataDefinition.DataList[i].CityMunicipality.Name;
                    $scope.dataDefinition.DataList[i].StateProvinceName = $scope.dataDefinition.DataList[i].CityMunicipality.StateProvince.Name;
                    $scope.dataDefinition.DataList[i].CountryName = $scope.dataDefinition.DataList[i].CityMunicipality.StateProvince.Country.Name;
                }
                return true;
            default:
                return true;
        }
    };
    $scope.resetDataItem = function () {
        $scope.dataDefinition.DataItem = {
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

    $scope.validateEntry = function () {
        if ($scope.dataDefinition.DataItem.Name == null || $scope.dataDefinition.DataItem.Name == "") {
            $scope.showFormError("Courier name is required.");
            return false;
        }
        else if ($scope.dataDefinition.DataItem.Line1 == null || $scope.dataDefinition.DataItem.Line1 == "") {
            $scope.showFormError("Streed address Line1 is required.");
            return false;
        }
        else if ($scope.dataDefinition.DataItem.CityMunicipalityId == null || $scope.dataDefinition.DataItem.CityMunicipalityId == "") {
            $scope.showFormError("City/Municipality is required.");
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

    //---------------------------Code if using typeahead in city/municipality-------------------
    $scope.onSelectCity = function ($item, $model, $label) {
        $scope.dataDefinition.DataItem.CityMunicipalityId = $item.Id;
        $scope.dataDefinition.DataItem.CityMunicipalityName = $item.Name;
        $scope.dataDefinition.DataItem.StateProvinceName = $item.StateProvinceName;
        $scope.dataDefinition.DataItem.CountryName = $scope.country.Name;
    };
    //---------------------------End of typeahead-----------------------------------------------

    $scope.formatTIN = function () {
        if ($scope.dataDefinition.DataItem.TIN.length == 3)
            $scope.dataDefinition.DataItem.TIN = $scope.dataDefinition.DataItem.TIN + "-";
        if ($scope.dataDefinition.DataItem.TIN.length == 7)
            $scope.dataDefinition.DataItem.TIN = $scope.dataDefinition.DataItem.TIN + "-";
    };
});