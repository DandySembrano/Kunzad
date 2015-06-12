﻿//---------------------------------------------------------------------------------//
// Filename: businessunittype-ctrl.js
// Description: Controller for Business Unit Type
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("BusinessUnitTypeController", function ($scope, $http) {
    $scope.modelName = "Business Unit Type";
    $scope.modelhref = "#/businessunittype";

    //-------------------------dirDataGrid1 Paramaters-------------------------
    $scope.submitButtonText = "";
    $scope.submitButtonListener = false;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.actionCreate = false; //default to false
    $scope.actionMode = "Create";//default to Create
    $scope.dataDefinition = {
        "Header": ['Name','No.'],
        "Keys": ['Name'],
        "Type": ['String'],
        "RequiredFields": ['Name-Name'],
        "DataList": [],
        "APIUrl": ['/api/BusinessUnitTypes?page=',//get
                     '/api/BusinessUnitTypes', //post, put, delete
        ],
        "DataItem": {},
        "DataTarget": "DataTableMenu",
        "ViewOnly": false,
        "ContextMenu": ["'Load'", "'Create'", "'Edit'", "'Delete'", "'View'", "'Excel'", "'Doc'", "'PNG'"],
        "ContextMenuLabel": ['Reload', 'Create', 'Edit', 'Delete', 'View', 'Export to Excel', 'Export to Word', 'Export to Image']
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
            "Id": null,
            "Name": null
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
});