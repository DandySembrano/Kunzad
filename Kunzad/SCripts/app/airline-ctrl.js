//---------------------------------------------------------------------------------//
// Filename: airline-ctrl.js
// Description: Controller for Airlines
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("AirlineController", function ($scope, $http) {
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
                             "Type":     ['String'],
                             "DataList": [],
                             "APIUrl":   ['/api/AirLines?page=',//get
                                          '/api/AirLines', //post, put, delete
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

    $scope.validateEntry = function () {
        if ($scope.dataDefinition.DataItem.Name == null || $scope.dataDefinition.DataItem.Name == "") {
            $scope.showFormError("Airline name is required.");
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
});