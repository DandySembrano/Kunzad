//---------------------------------------------------------------------------------//
// Filename: trucker-ctrl.js
// Description: Controller for Trucker
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("TruckerController", function ($rootScope, $scope, $http, $compile) {
    $scope.modelName = "Trucker";
    $scope.modelhref = "#/truckers";
    $scope.tabPages = ["Trucker", "Truck"];
    $scope.selectedTab = "Trucker";
    $scope.showForm = false;

    //close delete modal
    $scope.closeDeleteModal = function () {
        jQuery.magnificPopup.close();
    }
    //Function that reset other instance of dirDataGrid1 and manage TruckerDataGrid instance
    $scope.loadTrucker = function () {
        //clear other dirDataGrid1 instance
        $content = angular.element(document.querySelector('#truckList')).html('');
        $compile($content)($scope);
        $scope.loadTruckerDataGrid();
        $scope.initTruckerDataGridParameters();
    };
    //Function that reset other instance of dirDataGrid1 and manage TruckDataGrid instance
    $scope.loadTrucks = function () {
        //clear other dirDataGrid1 instance
        $content = angular.element(document.querySelector('#truckerList')).html('');
        $compile($content)($scope);
        $scope.initTruckDataGridParameters();
        $scope.loadTruckDataGrid();
    };
    //Manage the selection of tab
    $scope.setSelectedTab = function (tab) {
        if (tab == $scope.tabPages[1]) {
            //Check if trucker is already saved
            if ($scope.dataDefinitionTrucker.DataItem.Id != null) {
                $scope.loadTrucks();
                getTruckTypes();
                $scope.selectedTab = tab;
            }
        }
        else {
            $scope.selectedTab = tab;
        }
    };
    // Get Truck Type
    var getTruckTypes = function () {
        $http.get("/api/TruckTypes")
            .success(function (data, status) {
                $scope.TruckTypes = [];
                $scope.TruckTypes = data;
            })
    }

    //==========================Script for TruckerDataGrid==========================
    //Function that compile TruckerDataGrid instance
    $scope.loadTruckerDataGrid = function () {
        html = '<dir-data-grid1 actioncreate="actionCreateTrucker"' +
                         'actionmode="actionModeTrucker"' +
                         'contextmenuitem="contextMenuItemTrucker"' +
                         'datadefinition="dataDefinitionTrucker"' +
                         'submitbuttontext="submitButtonText"' +
                         'submitbuttonlistener="submitButtonListenerTrucker"' +
                         'closecontainer="closeForm()"' +
                         'opencontainer="showMainForm()"' +
                         'otheractions="otherActionsTrucker(action)"' +
                         'resetdata="resetTruckerItem()"' +
                         'showformerror="showFormErrorTrucker(error)">' +
                         '</dir-data-grid1>';
        $content = angular.element(document.querySelector('#truckerList')).html(html);
        $compile($content)($scope);
    };
    //Function that initialize TruckerDataGrid parameters
    $scope.initTruckerDataGridParameters = function () {
        $scope.submitButtonText = "";
        $scope.submitButtonListenerTrucker = false;
        $scope.isErrorTrucker = false;
        $scope.errorMessageTrucker = "";
        $scope.actionCreateTrucker = false;
        $scope.actionModeTrucker = "Create";//default to Create
        $scope.dataDefinitionTrucker = {
            "Header": ['Name', 'TIN', 'Street Address 1', 'Street Address 2', 'City/Municipality', 'State/Province', 'Postal Code', 'Country', 'No.'],
            "Keys": ['Name', 'TIN', 'Line1', 'Line2', 'CityMunicipalityName', 'StateProvinceName', 'PostalCode', 'CountryName'],
            "RequiredFields": ['Name-Name', 'Line1-Street Address Line 1', 'CityMunicipalityName-City/Municipality'],
            "Type": ['String', 'String', 'String', 'String', 'String', 'String', 'String', 'String'],
            "DataList": [],
            "APIUrl": ['/api/Truckers?page=',//get
                       '/api/Truckers', //post, put, delete
            ],
            "DataItem": {},
            "DataTarget": "DataTableMenuTrucker",
            "ViewOnly": false,
            "ContextMenu": ["'Load'", "'Create'", "'Edit'", "'Delete'", "'View'", "'Excel'", "'Doc'", "'PNG'"],
            "ContextMenuLabel": ['Reload', 'Create', 'Edit', 'Delete', 'View', 'Export to Excel', 'Export to Word', 'Export to Image']
        };
        //Do Overriding or Overloading in this function
        $scope.otherActionsTrucker = function (action) {
            switch (action) {
                case 'PreSave':
                    delete $scope.dataDefinitionTrucker.DataItem.Id;
                    delete $scope.dataDefinitionTrucker.DataItem.CityMunicipality;
                    return true;
                case 'PreDelete':
                    openModalPanel('#modal-panel-confirmation');
                    return false;
                case 'PreUpdate':
                    delete $scope.dataDefinitionTrucker.DataItem.CityMunicipality;
                    return true;
                case 'PreAction':
                    $scope.country = $rootScope.country;
                    $scope.cityMunicipalities = $rootScope.getCityMunicipalities();
                    $scope.tabPages = ["Trucker", "Truck"];
                    $scope.selectedTab = $scope.tabPages[0];
                    return true;
                case 'PostLoadAction':
                    for (var i = 0; i < $scope.dataDefinitionTrucker.DataList.length; i++) {
                        $scope.dataDefinitionTrucker.DataList[i].CityMunicipalityName = $scope.dataDefinitionTrucker.DataList[i].CityMunicipality.Name;
                        $scope.dataDefinitionTrucker.DataList[i].StateProvinceName = $scope.dataDefinitionTrucker.DataList[i].CityMunicipality.StateProvince.Name;
                        $scope.dataDefinitionTrucker.DataList[i].CountryName = $scope.dataDefinitionTrucker.DataList[i].CityMunicipality.StateProvince.Country.Name;
                    }
                    return true;
                default:
                    return true;
            }
        };
        $scope.resetTruckerItem = function () {
            $scope.dataDefinitionTrucker.DataItem = {
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
                "CityMunicipalityName": null,
                "StateProvinceName": null,
                "CountryName": null
            }
        };
        $scope.showFormErrorTrucker = function (message) {
            $scope.isErrorTrucker = true;
            $scope.errorMessageTrucker = message;
        };
        //Close Forms and show main form
        $scope.closeForm = function () {
            $scope.isErrorTrucker = false;
            $scope.showForm = false;
            $scope.modelName = "Trucker";
            //Load dirDataGrid1 of main page
            $scope.loadTrucker();
        };
        //Show main form
        $scope.showMainForm = function () {
            $scope.showForm = true;
            $scope.initializeHeaderName();
        };
        //Submit Trucker
        $scope.submit = function () {
            $scope.submitButtonListenerTrucker = true;
        };
        //Shows Create Form
        $scope.actionForm = function (action) {
            $scope.actionCreateTrucker = true;
            $scope.showForm = true;
        };
        //Format the TIN number
        $scope.formatTIN = function () {
            if ($scope.dataDefinitionTrucker.DataItem.TIN.length == 3)
                $scope.dataDefinitionTrucker.DataItem.TIN = $scope.dataDefinitionTrucker.DataItem.TIN + "-";
            if ($scope.dataDefinitionTrucker.DataItem.TIN.length == 7)
                $scope.dataDefinitionTrucker.DataItem.TIN = $scope.dataDefinitionTrucker.DataItem.TIN + "-";
        };
        //Initialize Header Name 
        $scope.initializeHeaderName = function () {
            if ($scope.dataDefinitionTrucker.DataItem.Name == null || $scope.dataDefinitionTrucker.DataItem.Name == "")
                $scope.modelName = "Trucker";
            else
                $scope.modelName = "Trucker(" + $scope.dataDefinitionTrucker.DataItem.Name + ")";
        };
        //---------------------------Code if using typeahead in city/municipality-------------------
        $scope.onSelectCity = function ($item, $model, $label) {
            $scope.dataDefinitionTrucker.DataItem.CityMunicipalityId = $item.Id;
            $scope.dataDefinitionTrucker.DataItem.CityMunicipalityName = $item.Name;
            $scope.dataDefinitionTrucker.DataItem.StateProvinceName = $item.StateProvinceName;
            $scope.dataDefinitionTrucker.DataItem.CountryName = $scope.country.Name;
        };
        //---------------------------End of typeahead-----------------------------------------------
    };
    //==========================End of script for TruckerDataGrid===================

    //==========================Script for TruckDataGrid============================
    //Function that compile TruckDataGrid instance
    $scope.loadTruckDataGrid = function () {
        var $content = "", html = "";

        html = '<dir-data-grid1  actioncreate="actionCreateTruck"' +
                                 'actionmode="actionModeTruck"' +
                                 'contextmenuitem="contextMenuItemTruck"' +
                                 'datadefinition="dataDefinitionTruck"' +
                                 'submitbuttontext="submitButtonTextTruck"' +
                                 'submitbuttonlistener="submitButtonListenerTruck"' +
                                 'closecontainer="closeModalFormTruck()"' +
                                 'opencontainer="openModalFormTruck()"' +
                                 'otheractions="otherActionsTruck(action)"' +
                                 'resetdata="resetTruckItem()"' +
                                 'showformerror="showFormErrorTruck(error)">' +
                '</dir-data-grid1>';
        $content = angular.element(document.querySelector('#truckList')).html(html);
        $compile($content)($scope);
    };
    //Function that initialize TruckDataGrid parameters
    $scope.initTruckDataGridParameters = function () {
        $scope.submitButtonTextTruck = "";
        $scope.submitButtonListenerTruck = false;
        $scope.isErrorTruck = false;
        $scope.errorMessageTruck = "";
        $scope.actionCreateTruck = false; //default to false
        $scope.actionModeTruck = "Create";//default to Create
        $scope.dataDefinitionTruck = {
            "Header": ['Plate_No', 'Type', 'Weight Capacity', 'Volume Capacity', 'No.'],
            "Keys": ['PlateNo', 'TruckTypeName', 'WeightCapacity', 'VolumeCapacity'],
            "Type": ['String-Upper', 'String', 'Number', 'Number'],
            "RequiredFields": ['PlateNo-Plate Number', 'TruckTypeName-Truck Type'],
            "DataList": [],
            "APIUrl": ['/api/Trucks?page= &truckerId=' + $scope.dataDefinitionTrucker.DataItem.Id,//get
                       '/api/Trucks', //post, put, delete
            ],
            "DataItem": {},
            "DataTarget": "DataTableMenuTruck",
            "ViewOnly": false,
            "ContextMenu": ["'Load'", "'Create'", "'Edit'", "'Delete'", "'View'", "'Excel'", "'Doc'", "'PNG'"],
            "ContextMenuLabel": ['Reload', 'Create', 'Edit', 'Delete', 'View', 'Export to Excel', 'Export to Word', 'Export to Image']
        };
        $scope.closeModalFormTruck = function () {
            $scope.isErrorTruck = false;
            jQuery.magnificPopup.close();
        };
        $scope.openModalFormTruck = function () {
            $scope.isError = false;
            openModalPanel('#modal-panel-truck');
        };
        $scope.otherActionsTruck = function (action) {
            switch (action) {
                case 'PreAction':
                    if ($scope.submitButtonText == "Delete" || $scope.submitButtonText == "Close")
                        return false;
                    $scope.isErrorTruck = false;
                    $scope.errorMessageTruck = "";
                    return true;
                case 'PreSave':
                    delete $scope.dataDefinitionTruck.DataItem.Id;
                    delete $scope.dataDefinitionTruck.DataItem.TruckType;
                    $scope.dataDefinitionTruck.DataItem.TruckerId = $scope.dataDefinitionTrucker.DataItem.Id;
                    console.log($scope.dataDefinitionTruck.DataItem);
                    return true;
                case 'PreUpdate':
                    $scope.dataDefinitionTruck.DataItem.PlateNo
                    delete $scope.dataDefinitionTruck.DataItem.TruckType;
                    return true;
                case 'PostLoadAction':
                    for (var i = 0; i < $scope.dataDefinitionTruck.DataList.length; i++)
                        $scope.dataDefinitionTruck.DataList[i].TruckTypeName = $scope.dataDefinitionTruck.DataList[i].TruckType.Type;
                    return true;
                default:
                    return true;
            }
        };
        $scope.resetTruckItem = function () {
            $scope.dataDefinitionTruck.DataItem = {
                "Id": null,
                "PlateNo": null,
                "TruckTypeId": null,
                "TruckerId": null,
                "TruckType": {
                    "Trucks": [],
                    "Id": null,
                    "Type": null,
                    "WeightCapacity": null,
                    "VolumeCapacity": null,
                },
                "TruckTypeName": null,
                "WeightCapacity": null,
                "VolumeCapacity": null
            }
        };
        $scope.showFormErrorTruck = function (message) {
            $scope.isErrorTruck = true;
            $scope.errorMessageTruck = message;
        };
        $scope.saveTruck = function () {
            $scope.submitButtonListenerTruck = true;
        };
        $scope.openTruckForm = function (action) {
            $scope.actionCreateTruck = true;
        };
        $scope.selectTruckType = function (id) {
            for (i = 0; i < $scope.TruckTypes.length; i++) {
                if ($scope.TruckTypes[i].Id === id) {
                    $scope.dataDefinitionTruck.DataItem.TruckTypeName = $scope.TruckTypes[i].Type;
                    $scope.dataDefinitionTruck.DataItem.WeightCapacity = $scope.TruckTypes[i].WeightCapacity;
                    $scope.dataDefinitionTruck.DataItem.VolumeCapacity = $scope.TruckTypes[i].VolumeCapacity;
                    return true;
                }
            }
            
        };
    };
    //==========================End of script for TruckDataGrid=====================

    //Load main page directive
    $scope.loadTrucker();
});