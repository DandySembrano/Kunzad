//---------------------------------------------------------------------------------//
// Filename: businessunit-ctrl.js
// Description: Controller for Business Unit
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("BusinessUnitController", function ($rootScope, $scope, $http) {
    $scope.modelName = "Business Unit";
    $scope.modelhref = "#/businessunit";

    //-------------------------dirDataGrid1 Paramaters-------------------------
    $scope.submitButtonText = "";
    $scope.submitButtonListener = false;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.actionCreate = false; //default to false
    $scope.actionMode = "Create";//default to Create
    $scope.dataDefinition = {
                                "Header": ['Code', 'Name', 'Main Business Unit', 'Business Unit Type', 'Is Operating Site?', 'Has Airport?', 'Has Seaport?', 'No.'],
                                "Keys": ['Code', 'Name', 'ParentBusinessUnitName', 'BusinessUnitTypeName', 'isOperatingSite', 'hasAirPort', 'hasSeaPort'],
                                "Type": ['Default', 'String', 'String', 'String', 'Boolean', 'Boolean', 'Boolean'],
                                "RequiredFields": ['Code-Code', 'Name-Name', 'BusinessUnitTypeName-Business Unit Type'],
                                "DataList": [],
                                "APIUrl": ['/api/BusinessUnits?page=',//get
                                             '/api/BusinessUnits', //post, put, delete
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
            case 'PreSubmit':
                $scope.initializeCheckBox();
                return true;
            case 'PreSave':
                delete $scope.dataDefinition.DataItem.Id;
                delete $scope.dataDefinition.DataItem.CityMunicipality;
                return true;
            case 'PostSave':
                //add newly saved business unit to the array holder
                $scope.businessUnitList.push($scope.dataDefinition.DataItem);
                return true;
            case 'PostLoadAction':
                getBusinessUnitTypes();
                getBusinessUnits();
                $scope.initializeCheckBox();
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
            "BusinessUnitTypeId": null,
            "ParentBusinessUnitId": null,
            "isOperatingSite": null,
            "hasAirPort": null,
            "hasSeaPort": null,
            "CreatedDate": null,
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null,
            "BusinessUnitTypeName": null,
            "ParentBusinessUnitName": null
        }
    };
    $scope.showFormError = function (message) {
        $scope.isError = true;
        $scope.errorMessage = message;
    };
    //-------------------------End of dirDataGrid1 Parameters-------------------

    //----------Functions that are related to dirDataGrid1-----------------------

    $scope.submit = function () {
            $scope.submitButtonListener = true;
    };

    $scope.actionForm = function (action) {
        $scope.actionCreate = true;
    };
    //---------------------------------End----------------------------------------

    function getBusinessUnitTypes() {
        $http.get("/api/BusinessUnitTypes")
        .success(function (data, status) {
            $scope.businessUnitTypeList = [];
            $scope.businessUnitTypeList = angular.copy(data);

            //Initialize Business Unit Type Name
            for (var i = 0; i < $scope.dataDefinition.DataList.length; i++) {
                //search business unit type
                for (var j = 0; j < $scope.businessUnitTypeList.length; j++) {
                    if ($scope.dataDefinition.DataList[i].BusinessUnitTypeId == $scope.businessUnitTypeList[j].Id) {
                        $scope.dataDefinition.DataList[i].BusinessUnitTypeName = $scope.businessUnitTypeList[j].Name;
                        break;
                    }
                }
            }
        })
        .error(function (error, status) {
            $scope.showFormError(status);
        })
    };

    function getBusinessUnits() {
        $http.get("/api/BusinessUnits")
        .success(function (data, status) {
            $scope.businessUnitList = [];
            $scope.businessUnitList.push({ 'Id': null, 'Name': 'None' });
            for (x in data) {
                $scope.businessUnitList.push(data[x]);
            }
            //Initialize Parent Business Unit
            for (var i = 0; i < $scope.dataDefinition.DataList.length; i++) {
                //search business unit type
                for (var j = 0; j < $scope.businessUnitList.length; j++) {
                    if ($scope.dataDefinition.DataList[i].ParentBusinessUnitId == $scope.businessUnitList[j].Id) {
                        $scope.dataDefinition.DataList[i].ParentBusinessUnitName = $scope.businessUnitList[j].Name;
                        break;
                    }
                }
            }
        })
        .error(function (error, status) {
            $scope.showFormError(status);
        })
    };

    $scope.selectBusinessUnitType = function (id) {
        var i;
        for (i = 0; i < $scope.businessUnitTypeList.length; i++) {
            if (id == $scope.businessUnitTypeList[i].Id) {
                $scope.dataDefinition.DataItem.BusinessUnitTypeName = $scope.businessUnitTypeList[i].Name;
                return;
            }
        }
    };

    $scope.selectBusinessUnit = function (id) {
        var i;
        for (i = 0; i < $scope.businessUnitList.length; i++) {
            if (id == $scope.businessUnitList[i].Id) {
                $scope.dataDefinition.DataItem.ParentBusinessUnitName = $scope.businessUnitList[i].Name;
                return;
            }
        }
    };

    $scope.initializeCheckBox = function(){
        if ($scope.dataDefinition.DataItem.isOperatingSite == null)
            $scope.dataDefinition.DataItem.isOperatingSite = false;

        if ($scope.dataDefinition.DataItem.hasAirPort == null)
            $scope.dataDefinition.DataItem.hasAirPort = false;

        if ($scope.dataDefinition.DataItem.hasSeaPort == null)
            $scope.dataDefinition.DataItem.hasSeaPort = false;
    };
});