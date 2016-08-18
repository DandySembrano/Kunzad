//---------------------------------------------------------------------------------//
// Filename: airline-ctrl.js
// Description: Controller for Airlines
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("AirlineController", function ($rootScope, $scope, $http) {
    $scope.modelName = "Airline";
    $scope.modelhref = "#/airlines";

    //-------------------------dirDataGrid1 Paramaters-------------------------
    $scope.submitButtonText = "";
    $scope.submitButtonListener = false;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.actionCreate = false; //default to false
    $scope.actionMode = "Create";//default to Create
    $scope.dataDefinition = {"Header":   ['Name', 'No.'],
                             "Keys":      ['Name'],
                             "Type": ['String'],
                             "RequiredFields": ['Name-Name'],
                             "DataList": [],
                             "APIUrl":   ['/api/AirLines?page=',//get
                                          '/api/AirLines', //post, put, delete
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