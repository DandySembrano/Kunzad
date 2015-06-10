//---------------------------------------------------------------------------------//
// Filename: driver-ctrl.js
// Description: Controller for Driver
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("DriverController", function ($scope, $http) {
    $scope.modelName = "Driver";
    $scope.modelhref = "#/driver";

    //-------------------------dirDataGrid1 Paramaters-------------------------
    $scope.submitButtonText = "";
    $scope.submitButtonListener = false;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.actionCreate = false; //default to false
    $scope.actionMode = "Create";//default to Create
    $scope.dataDefinition = {
        "Header": ['First_Name', 'Middle Name', 'Last Name', 'License Number', 'License Expiry', 'No.'],
        "Keys":   ['FirstName', 'MiddleName', 'LastName', 'LicenseNo', 'LicenseExpiry'],
        "Type":   ['String', 'String', 'String', 'String', 'Date'],
        "DataList": [],
        "APIUrl": ['/api/Drivers?page=',//get
                   '/api/Drivers', //post, put, delete
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
            "FirstName": "",
            "MiddleName": "",
            "LastName": "",
            "LicenseNo": "",
            "LicenseExpiry": ""
        }
    };
    $scope.showFormError = function (message) {
        $scope.isError = true;
        $scope.errorMessage = message;
    };
    //-------------------------End of dirDataGrid1 Parameters-------------------

    $scope.validateEntry = function () {
        if ($scope.dataDefinition.DataItem.FirstName == null || $scope.dataDefinition.DataItem.FirstName == "") {
                $scope.showFormError("First name is required.");
                return false;
            }
        else if ($scope.dataDefinition.DataItem.LastName == null || $scope.dataDefinition.DataItem.LastName == "") {
                $scope.showFormError("Last name is required.");
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