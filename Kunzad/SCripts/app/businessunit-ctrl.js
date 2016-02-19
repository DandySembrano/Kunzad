//---------------------------------------------------------------------------------//
// Filename: businessunit-ctrl.js
// Description: Controller for Business Unit
// Author: Kenneth Ybañez
//---------------------------------------------------------------------------------//

kunzadApp.controller("BusinessUnitController", function ($localForage, $rootScope, $scope, $http, $interval) {
    $scope.modelName = "Business Unit";
    $scope.modelhref = "#/businessunit";
    $scope.businessUnitGridOptions = {};
    $scope.businessUnitGridOptions.data = [];
    $scope.businessUnitGridOptions.DataItem;
    $scope.businessUnitIdHolder = 0;
    $scope.selectedTab = "Information";
    $scope.tabPages = ["Information"];
    $scope.isRequiredAddress = false;
    $scope.isNewAddress = false;
    var pageSize = 20;

    $scope.isPrevPage = false;
    $scope.isNextPage = true;
    $scope.actionMode = "Create";
    $scope.selected = null;
    $scope.currentPage = 1;
    $scope.viewOnly = true;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.showForm = false;

    //==================================ADDRESS MODAL==============================================
    $scope.initAddressModal = function () {
        $scope.showAddress = false;
        $scope.addressDataDefinition = {
            "ModalId": "addressModal",
            "DataItem": [],
            "ViewOnly": false, //By Default
            "ActionMode": "Create",//By Default
            "Header": "Business Unit",
            "Container": ""
        };

        $scope.otherActionsAddress = function (action) {
            switch (action) {
                case "PreOpen":
                    if ($scope.businessUnitGridOptions.DataItem.Address == null)
                        $scope.businessUnitGridOptions.DataItem.Address = {
                            "Id": null,
                            "Line1": null,
                            "Line2": null,
                            "CityMunicipalityId": null,
                            "CityMunicipality": {
                                "Id": null,
                                "Name": null,
                                "StateProvince": {
                                    "Id": null,
                                    "Name": null
                                }
                            },
                            "PostalCode": null,
                            "CreatedDate": null,
                            "LastUpdatedDate": null,
                            "CreatedByUserId": null,
                            "LastUpdatedByUserId": null
                        };

                    $scope.addressDataDefinition.DataItem = $scope.businessUnitGridOptions.DataItem.Address;
                    return true;
                case "PostClose":
                    //Address object
                    $scope.businessUnitGridOptions.DataItem.Address = $scope.addressDataDefinition.DataItem;
                    //Formatted address
                    $scope.businessUnitGridOptions.DataItem.BusinessUnitAddress = $scope.addressDataDefinition.Container;
                    return true;
                default: return true;
            }
        };
    };
    //==================================END OF ADDRESS MODAL=======================================

    //Disable typing
    $('#address').keypress(function (key) {
        return false;
    });

    //Initialize Address fields
    $scope.initializeAddressField = function (addressItem) {
        $scope.formattedAddress = addressItem.Line1 + (addressItem.Line2 == "" || addressItem.Line2 == null ? " " : ", " + addressItem.Line2) + "\n";
        $scope.formattedAddress += addressItem.CityMunicipality.Name + ", " + (addressItem.CityMunicipality.StateProvince == null ? "" : addressItem.CityMunicipality.StateProvince.Name + "\n");
        $scope.formattedAddress += $scope.country.Name + ", " + addressItem.PostalCode;
        return $scope.formattedAddress;
    };

    //Function that will format key value
    $scope.filterValue = function (type) {
        var format;
        switch (type) {
            case 'String':
                format = 'ProperCase';
                break;
            case 'String-Upper':
                format = 'StringUpper';
                break;
            case 'Date':
                format = 'Date';
                break;
            case 'DateTime':
                format = 'DateTime';
                break;
            case 'Time':
                format = 'Time';
                break;
            case 'Boolean':
                format = 'Boolean';
                break;
            case 'Decimal':
                format = 'Decimal';
                break;
            default:
                format = 'Default';
        }
        return format;
    };

    // Get Business unit List
    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.get("/api/BusinessUnits?page=" + page)
            .success(function (data, status) {
                $scope.initDataItem();
                $scope.businessUnitGridOptions.data = data;
                getBusinessUnitTypes();
                getBusinessUnits();
                $scope.initializeCheckBox();
                
                //Initialize business unit address
                for (var i = 0; i < $scope.businessUnitGridOptions.data.length; i++) {
                    if($scope.businessUnitGridOptions.data[i].Address != null)
                        $scope.businessUnitGridOptions.data[i].BusinessUnitAddress = $scope.initializeAddressField($scope.businessUnitGridOptions.data[i].Address)
                }

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

    $scope.closeForm = function () {
        $scope.isError = false;
        $scope.showForm = false;
    }

    $scope.showFormError = function (error) {
        $scope.isError = true;
        $scope.errorMessage = error;
        $scope.selectedTab = $scope.tabPages[0];
    };

    //-----------------------------------------Initialize BusinessUnit GridOption----------------------------------------------
    $scope.initBusinessUnitGridOptions = function () {
        var columns = [];
        $scope.businessUnitHeader = ['Code', 'Name', 'Main Business Unit', 'Business Unit Type', 'Address', 'Is Operating Site?', 'Has Airport?', 'Has Seaport?', 'No.'];
        $scope.businessUnitKeys = ['Code', 'Name', 'ParentBusinessUnitName', 'BusinessUnitTypeName', 'BusinessUnitAddress', 'isOperatingSite', 'hasAirPort', 'hasSeaPort'];
        $scope.businessUnitType = ['Default', 'String', 'String', 'String', 'String', 'Boolean', 'Boolean', 'Boolean'];
        $scope.businessUnitColWidth = [100, 150, 150, 150, 300, 150, 120, 120];
        //Initialize Number Listing
        var columnProperties = {};
        columnProperties.name = $scope.businessUnitHeader[$scope.businessUnitHeader.length - 1];
        columnProperties.field = 'No';
        columnProperties.cellTemplate = '<div class="ui-grid-cell-contents text-center">{{row.entity.No = (grid.appScope.currentPage == 1 ? (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) : ((grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.currentPage - 1) * grid.appScope.pageSize)))}}</div>';
        columnProperties.width = 40;
        columnProperties.enableColumnResizing = true;
        columnProperties.enableColumnMenu = false;
        columnProperties.enableColumnMoving = false;
        columns.push(columnProperties);
        //Initialize column data
        for (var i = 0; i < ($scope.businessUnitHeader.length - 1) ; i++) {
            var columnProperties = {};
            columnProperties.name = $scope.businessUnitHeader[i];
            columnProperties.field = $scope.businessUnitKeys[i];
            columnProperties.width = $scope.businessUnitColWidth[i];
            //format field value
            columnProperties.cellFilter = $scope.filterValue($scope.businessUnitType[i]);
            columns.push(columnProperties);
        }
        $scope.businessUnitGridOptions = {
            columnDefs: columns,
            rowTemplate: '<div>' +
                ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id)"  context-menu="grid.appScope.setSelected(row.entity.Id)" data-target= "DataTableMenu"></div>' +
              '</div>',
            enableColumnResizing: true,
            enableGridMenu: true,
            enableSelectAll: true,
            exporterCsvFilename: 'myFile.csv',
            exporterPdfDefaultStyle: { fontSize: 9 },
            exporterPdfTableStyle: { margin: [0, 0, 0, 0] },
            exporterPdfTableHeaderStyle: { fontSize: 12, bold: true, italics: true, color: 'black' },
            exporterPdfHeader: { text: "Fast Cargo", style: 'headerStyle' },
            exporterPdfFooter: function (currentPage, pageCount) {
                return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
            },
            exporterPdfCustomFormatter: function (docDefinition) {
                docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                docDefinition.styles.footerStyle = { fontSize: 22, bold: true };
                return docDefinition;
            },
            exporterPdfOrientation: 'landscape',
            exporterPdfPageSize: 'a4',
            exporterPdfMaxGridWidth: 500,
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };
    };
    //-----------------------------------------End of initialization-----------------------------------------------------------

    //search businessUnit
    $scope.searchBusinessUnit = function (id) {
        var i = 0;
        for (i = 0; i < $scope.businessUnitGridOptions.data.length; i++) {
            if (id == $scope.businessUnitGridOptions.data[i].Id) {
                return i;
            }
        }
        return i;
    };

    $scope.setSelected = function (id) {
        $scope.businessUnitIdHolder = id;
    };

    $scope.selectedBusinessUnitIndex = null;

    $scope.initDataItem = function () {
        $scope.businessUnitGridOptions.DataItem = {
            "Id": null,
            "Code": null,
            "Name": null,
            "BusinessUnitTypeId": null,
            "ParentBusinessUnitId": null,
            "AddressId": null,
            "BusinessUnitAddress": null,
            "Address": {
                "Id": null,
                "Line1": null,
                "Line2": null,
                "CityMunicipalityId": null,
                "CityMunicipality": {
                    "Id": null,
                    "Name": null,
                    "StateProvince": {
                        "Id": null,
                        "Name": null
                    }
                },
                "PostalCode": null,
                "CreatedDate": null,
                "LastUpdatedDate": null,
                "CreatedByUserId": null,
                "LastUpdatedByUserId": null
            },
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

    $scope.actionForm = function (action) {
        $scope.actionMode = action;
        $scope.selectedBusinessUnitIndex = $scope.searchBusinessUnit($scope.businessUnitIdHolder);

        switch ($scope.actionMode) {
            case "Create":
                $scope.initDataItem();
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.showForm = true;
                $scope.addressDataDefinition.ViewOnly = false;
                $scope.addressDataDefinition.ActionMode = "Create";
                break;
            case "Edit":
                $scope.businessUnitGridOptions.DataItem = [];
                $scope.businessUnitGridOptions.DataItem = angular.copy($scope.businessUnitGridOptions.data[$scope.selectedBusinessUnitIndex]);   
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                if ($scope.businessUnitGridOptions.DataItem.Address == null)
                    $scope.isNewAddress = true;
                $scope.addressDataDefinition.ViewOnly = false;
                $scope.addressDataDefinition.ActionMode = "Edit";
                $scope.showForm = true;
                break;
            case "Delete":
                $scope.businessUnitGridOptions.DataItem = [];
                $scope.businessUnitGridOptions.DataItem = angular.copy($scope.businessUnitGridOptions.data[$scope.selectedBusinessUnitIndex]);
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                $scope.addressDataDefinition.ViewOnly = true;
                $scope.addressDataDefinition.ActionMode = "Delete";
                $scope.showForm = true;
                break;
            case "View":
                $scope.businessUnitGridOptions.DataItem = [];
                $scope.businessUnitGridOptions.DataItem = angular.copy($scope.businessUnitGridOptions.data[$scope.selectedBusinessUnitIndex]);
                $scope.viewOnly = true;
                $scope.submitButtonText = "Close";
                $scope.addressDataDefinition.ViewOnly = true;
                $scope.addressDataDefinition.ActionMode = "View";
                $scope.showForm = true;
                break;
        }
    };

    // Validate Form Data Entry
    function validateEntry() {
        if ($scope.businessUnitGridOptions.DataItem.Code == null || $scope.businessUnitGridOptions.DataItem.Code == "") {
            $scope.showFormError("Code is required.");
            return false;
        }
        else if ($scope.businessUnitGridOptions.DataItem.Name == null || $scope.businessUnitGridOptions.DataItem.Name == "") {
            $scope.showFormError("Name is required.");
            return false;
        }
        else if ($scope.businessUnitGridOptions.DataItem.BusinessUnitTypeId == null || $scope.businessUnitGridOptions.DataItem.BusinessUnitTypeId == "") {
            $scope.showFormError("Business unit type is required.");
            return false;
        }
        else {
            if ($scope.isRequiredAddress) {
                if ($scope.businessUnitGridOptions.DataItem.BusinessUnitAddress == null) {
                    $scope.showFormError("Address is required.");
                    return false;
                }
            }
        }

        $scope.isRequiredAddress = false;
        return true;
    }

    //Save data
    $scope.apiCreate = function () {
        $scope.initializeCheckBox();
        var businessUnitModel = $scope.businessUnitGridOptions.DataItem;
        delete businessUnitModel.Id;
        delete businessUnitModel.AddressId;

        if (businessUnitModel.Address != null) {
            delete businessUnitModel.Address.Id;
            delete businessUnitModel.Address.CityMunicipality;
        }
        else
            delete businessUnitModel.Address;

        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.post('/api/BusinessUnits', businessUnitModel)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.businessUnitGridOptions.DataItem.Id = data.objParam1.Id;
                    $scope.businessUnitGridOptions.DataItem.CreatedDate = data.objParam1.CreatedDate;
                    $scope.businessUnitGridOptions.DataItem.CreatedByUserId = data.objParam1.CreatedByUserId;
                    $scope.businessUnitGridOptions.data.push($scope.businessUnitGridOptions.DataItem);

                    //reload pagination of datasource is greater than pageSize
                    if ($scope.businessUnitGridOptions.data.length > $scope.pageSize)
                        $scope.loadData($scope.currentPage);

                    $scope.showForm = false;
                    spinner.stop();
                    return true;
                }
                else {
                    $scope.showFormError(data.message);
                    spinner.stop();
                }
            })
            .error(function (data, status) {
                $scope.showFormError(status);
                spinner.stop();
            })
        return false;
    };

    // Update
    $scope.apiUpdate = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var businessUnitModel = $scope.businessUnitGridOptions.DataItem;
        if (businessUnitModel.Address != null) {
            if ($scope.isNewAddress)
            {
                delete businessUnitModel.AddressId;
                delete businessUnitModel.Address.Id;
            }
            delete businessUnitModel.Address.CityMunicipality;
        }
        else
            delete businessUnitModel.Address;

        $http.put('/api/BusinessUnits/' + id, $scope.businessUnitGridOptions.DataItem)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.businessUnitGridOptions.DataItem.LastUpdatedDate = data.objParam1.LastUpdatedDate;
                    $scope.businessUnitGridOptions.DataItem.LastUpdatedByUserId = data.objParam1.LastUpdatedByUserId;
                    $scope.businessUnitGridOptions.data[$scope.selectedBusinessUnitIndex] = angular.copy($scope.businessUnitGridOptions.DataItem);
                    $scope.showForm = false;
                    $scope.isNewAddress = false;
                    spinner.stop();
                    return true;
                }
                else {
                    $scope.showFormError(data.message);
                    $scope.isNewAddress = false;
                    spinner.stop();
                }
            })
            .error(function (data, status) {
                $scope.showFormError(status);
                $scope.isNewAddress = false;
                spinner.stop();
            })
        return false;
    };

    // Delete
    $scope.apiDelete = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        $http.delete('/api/BusinessUnits/' + id)
            .success(function (data, status) {
                if (data.status == "SUCCESS") {
                    $scope.businessUnitGridOptions.data.splice($scope.selectedBusinessUnitIndex, 1);
                    //reload pagination of datasource is greater than pageSize
                    $scope.loadData($scope.currentPage);
                    $scope.showForm = false;
                    spinner.stop();
                    return true;
                }
                else {
                    $scope.showFormError(data.message);
                    spinner.stop();
                }
            })
            .error(function (data, status) {
                $scope.showFormError(status);
                spinner.stop();
            })
        return false;
    };

    $scope.submit = function () {
        switch ($scope.actionMode) {
            case "Create":
                if (validateEntry()) {
                    $scope.apiCreate();
                }
                break;
            case "Edit":
                if (validateEntry()) {
                    $scope.apiUpdate($scope.businessUnitGridOptions.DataItem.Id);
                }
                break;
            case "Delete":
                $scope.apiDelete($scope.businessUnitGridOptions.DataItem.Id);
                break;
            case "View":
                $scope.closeForm();
                break;
        }
    }

    function getBusinessUnitTypes() {
        $http.get("/api/BusinessUnitTypes")
        .success(function (data, status) {
            $scope.businessUnitTypeList = [];
            $scope.businessUnitTypeList = angular.copy(data);

            //Initialize Business Unit Type Name
            for (var i = 0; i < $scope.businessUnitGridOptions.data.length; i++) {
                //search business unit type
                for (var j = 0; j < $scope.businessUnitTypeList.length; j++) {
                    if ($scope.businessUnitGridOptions.data[i].BusinessUnitTypeId == $scope.businessUnitTypeList[j].Id) {
                        $scope.businessUnitGridOptions.data[i].BusinessUnitTypeName = $scope.businessUnitTypeList[j].Name;
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
            for (var i = 0; i < $scope.businessUnitGridOptions.data.length; i++) {
                //search business unit type
                for (var j = 0; j < $scope.businessUnitList.length; j++) {
                    if ($scope.businessUnitGridOptions.data[i].ParentBusinessUnitId == $scope.businessUnitList[j].Id) {
                        $scope.businessUnitGridOptions.data[i].ParentBusinessUnitName = $scope.businessUnitList[j].Name;
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
                $scope.businessUnitGridOptions.DataItem.BusinessUnitTypeName = $scope.businessUnitTypeList[i].Name;

                if ($scope.businessUnitTypeList[i].hasLocation)
                    $scope.isRequiredAddress = true;
                else
                    $scope.isRequiredAddress = false;
                return;
            }
        }
    };

    $scope.selectBusinessUnit = function (id) {
        var i;
        for (i = 0; i < $scope.businessUnitList.length; i++) {
            if (id == $scope.businessUnitList[i].Id) {
                $scope.businessUnitGridOptions.DataItem.ParentBusinessUnitName = $scope.businessUnitList[i].Name;
                return;
            }
        }
    };

    $scope.initializeCheckBox = function(){
        if ($scope.businessUnitGridOptions.DataItem.isOperatingSite == null)
            $scope.businessUnitGridOptions.DataItem.isOperatingSite = false;
        
        if ($scope.businessUnitGridOptions.DataItem.hasAirPort == null)
            $scope.businessUnitGridOptions.DataItem.hasAirPort = false;

        if ($scope.businessUnitGridOptions.DataItem.hasSeaPort == null)
            $scope.businessUnitGridOptions.DataItem.hasSeaPort = false;
    };

    var init = function () {
        $localForage.getItem("Token").then(function (value) {
            $http.defaults.headers.common['Token'] = value;
            $scope.loadData($scope.currentPage);
        });
        $scope.initAddressModal();
        $scope.initBusinessUnitGridOptions();
    };

    init();
});