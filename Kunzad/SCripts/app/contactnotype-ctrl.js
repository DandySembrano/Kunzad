//---------------------------------------------------------------------------------//
// Filename: contactnotype-ctrl.js
// Description: Controller for Contact No Type
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("ContactnoTypeController", function ($scope, $http) {
    $scope.modelName = "Contact Number Type";
    $scope.modelhref = "#/contactnotype";

    //-------------------------dirDataGrid1 Paramaters-------------------------
    $scope.submitButtonText = "";
    $scope.submitButtonListener = false;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.actionCreate = false; //default to false
    $scope.actionMode = "Create";//default to Create
    $scope.dataDefinition = {
                                "Header": ['Type', 'No.'],
                                "Keys": ['Type'],
                                "Type": ['String'],
                                "RequiredFields": ['Type-Type'],
                                "DataList": [],
                                "APIUrl": ['/api/ContactNumberTypes?page=',//get
                                           '/api/ContactNumberTypes', //post, put, delete
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
            "Type": null
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