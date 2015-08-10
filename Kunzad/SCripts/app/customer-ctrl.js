//---------------------------------------------------------------------------------//
// Filename: customer-ctrl.js
// Description: Controller for Customer
// Author: Dandy Sembrano
//---------------------------------------------------------------------------------//

kunzadApp.controller("CustomerController", function ($rootScope, $scope, $http) {

    //------------------------------------------------------------------------------//
    // Required controller properties. should be present in all dataTable controller
    $scope.modelName = "Customer";
    $scope.modelhref = "#/customers";
    $scope.data = [];
    $scope.customerAddressList = [];
    $scope.customerContactList = [];
    $scope.customerContactPhoneList = [];
    $scope.dataItem;

    var pageSize = 20;
    $scope.isPrevPage = false;
    $scope.isNextPage = true;
    $scope.actionMode = "Create";
    $scope.selected = null;
    $scope.currentPage = 1;
    $scope.viewOnly = true;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.submitButtonText = "Submit";
    $scope.saveContactText = "Add Contact"
    //------------------------------------------------------------------------------//

    $scope.tabPages = ["General", "Addresses", "Contacts"];
    $scope.subTabPages = ["General"];
    $scope.selectedTab = "General";
    $scope.selectedSubTab = "General";

    $scope.CustomerGroups = [];
    $scope.CustomerContactTypes = [];
    $scope.Industries = [];
    $scope.showForm = false;
    $scope.showSubForm = false;
    $scope.showFooter = false;
    $scope.showSubFooter = false;
    $scope.showMenu = true;
    $scope.showSubMenu = false;
   
    $scope.initDataItem = function () {
        $scope.dataItem = {
            "Code": null,
            "Name": null,
            "CustomerGroupId": null,
            "IndustryId": null,
            "TIN": null,
            "Industry": null,
            "CustomerGroup": null,
            "CustomerContactType": null,
            "CustomerAddresses": [],
            "CustomerContacts": []
        }
    }

    // Get Customer List
    $scope.loadData = function (page) {
        $http.get("/api/Customers?page=" + page)
            .success(function (data, status) {
                $scope.data = data;
                gridOptions1.data = data;
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
            })
            .error(function (data, status) {
             
            })
    }

    $scope.gridOptions1 = {
        data:'data',
        enableSorting: true,
        columnDefs: [
          {
              field: 'No',
              enableSorting: false,
              width: 40,
              enableColumnResizing: true,
              enableColumnMenu: false,
              enableColumnMoving: false,
              cellTemplate: '<div class="ui-grid-cell-contents text-center">{{row.entity.No = (grid.appScope.currentPage == 1 ? (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) : ((grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.currentPage - 1) * grid.appScope.pageSize)))}}</div>'
          },
          { field: 'Code' },
          { field: 'Name',},
          { name:'Customer Group',field: 'CustomerGroup.Name' },
          { name:'Industry',field: 'Industry.Name' },
          { field: 'TIN' },
        ],
        rowTemplate: '<div>' +
        ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id)"  context-menu="grid.appScope.setSelected(row.entity.Id)" data-target= "DataTableMenu"></div>' +
        '</div>',
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        },
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

    $scope.gridOptions2 = {
        data: 'customerAddressList',
        enableSorting: true,
        columnDefs: [
          {
              field: 'No',
              enableSorting: false,
              width: 40,
              enableColumnResizing: true,
              enableColumnMenu: false,
              enableColumnMoving: false,
              cellTemplate: '<div class="ui-grid-cell-contents text-center">{{row.entity.No = (grid.appScope.currentPage == 1 ? (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) : ((grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.currentPage - 1) * grid.appScope.pageSize)))}}</div>'
          },
          { name: 'Line1', field: 'Line1' },
          { name: 'Line2', field: 'Line2' },
          { name: 'City Municipality', field: 'Line2' },
          { name: 'Province/State', field: 'Line2' },
          { name: 'Postal Code', field: 'Line2' },
          { name: 'Country', field: 'Line2' },
        ],
        rowTemplate: '<div>' +
        ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id)"  context-menu="grid.appScope.setSelected(row.entity.Id)" data-target= "DataTableMenu"></div>' +
        '</div>',
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        },
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

    // Create/Insert New
    $scope.apiCreate = function () {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var dataModel = angular.copy($scope.dataItem);
        dataModel.CustomerContacts = angular.copy($scope.customerContactList);
        dataModel.CustomerAddresses = angular.copy($scope.customerAddressList);
       
        for(var i=0; i<dataModel.CustomerAddresses.length;i++){
            dataModel.CustomerAddresses[i].CustomerId = -1;
            delete dataModel.CustomerAddresses[i].CityMunicipality;
            delete dataModel.CustomerAddresses[i].Id;
        }
        
        $http.post("/api/Customers", dataModel)
            .success(function (data, status) {
                $scope.dataItem = angular.copy(data);
                $scope.data.push($scope.dataItem);
                console.log($scope.data);
                $scope.closeForm();
                spinner.stop();
            })
            .error(function (data, status) {
                $scope.showFormError("Error: " + status);
                spinner.stop();
            })
    }

    // Get/Retrieve
    $scope.apiGet = function (id) {
        $http.get("/api/Customers/" + id)
            .success(function (data, status) {
                $scope.dataItem = data;
            })
            .error(function (data, status) {
                $scope.showFormError("Error: " + status);
            })
    }

    // Update
    $scope.apiUpdate = function (id) {
        // Set navigation properties to null so it will not be inserted as new record //
        
        var dataModel = angular.copy($scope.dataItem);
        dataModel.CustomerAddresses = angular.copy($scope.customerAddressList);

        for (var i = 0; i < dataModel.CustomerAddresses.length; i++) {
            if (dataModel.CustomerAddresses[i].Id == 0 || dataModel.CustomerAddresses[i].Id == null) {
                dataModel.CustomerAddresses[i].CustomerId = -1;
                delete dataModel.CustomerAddresses[i].CityMunicipality;
                delete dataModel.CustomerAddresses[i].Id;
            } else {
                delete dataModel.CustomerAddresses[i].CityMunicipality;
            }
        }

        dataModel.CustomerContacts = angular.copy($scope.customerContactList);
       $http.put("/api/Customers/" + id, dataModel)
            .success(function (data, status) {
                console.log(data);
                $scope.data[$scope.selected] = angular.copy($scope.dataItem);
                $scope.closeForm();
            })
            .error(function (data, status) {
                $scope.showFormError("Error: " + status);
            })
    }

    // Delete
    $scope.apiDelete = function (id) {
        $http.delete("/api/Customers/" + id)
            .success(function (data, status) {
                $scope.data.splice($scope.selected, 1);
                $scope.closeForm();
            })
            .error(function (data, status) {
                $scope.showFormError("Error: " + status);
            })
    }

    $scope.setSelected = function (id) {
        for (var j = 1; j < $scope.data.length; j++) {    
            if(id == $scope.data[j].Id){
                $scope.selected = j;
                break;
            }
        }  
    }

    $scope.actionForm = function (action) {
        $scope.actionMode = action;
        switch ($scope.actionMode) {
            case "Create":
                if ($scope.selectedTab == 'General') { //if general
                    $scope.initDataItem();
                    $scope.initAddress();
                    $scope.initCustomerContact();
                    $scope.initContact();
                    $scope.initContactPhone();
                    $scope.customerAddressList = [];
                    $scope.customerContactList = [];
                    $scope.customerContactPhoneList = [];
                    $scope.viewOnly = false;
                    $scope.submitButtonText = "Submit";
                    $scope.showForm = true;
                    $scope.showSubForm = false;
                    $scope.showFooter = true;
                    $scope.showSubFooter = false;
                    $scope.selectedTab = $scope.tabPages[0];
                    break;
                } else if ($scope.selectedTab == 'Addresses') { //if address
                    $scope.initAddress();
                    $scope.openModalForm('#modal-panel-address')
                    $scope.customerAddressAction = action;
                    break;
                }

            case "Edit":
                $scope.dataItem = angular.copy($scope.data[$scope.selected]);
                $scope.customerAddressList = $scope.dataItem.CustomerAddresses;
                $scope.customerContactList = $scope.dataItem.CustomerContacts;
                $scope.apiGet($scope.data[$scope.selected].Id);
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                $scope.showForm = true;
                $scope.showSubForm = false;
                $scope.showFooter = true;
                $scope.showSubFooter = false;
                $scope.selectedTab = $scope.tabPages[0];
                break;
            case "Delete":
                $scope.dataItem = angular.copy($scope.data[$scope.selected]);
                $scope.customerAddressList = $scope.dataItem.CustomerAddresses;
                $scope.customerContactList = $scope.dataItem.CustomerContacts;
                $scope.apiGet($scope.data[$scope.selected].Id);
                $scope.viewOnly = true;
                $scope.submitButtonText = "Delete";
                $scope.showForm = true;
                $scope.showSubForm = false;
                $scope.showFooter = true;
                $scope.showSubFooter = false;
                $scope.selectedTab = $scope.tabPages[0];
                break;
            case "View":
                $scope.dataItem = angular.copy($scope.data[$scope.selected]);
                $scope.customerAddressList = $scope.dataItem.CustomerAddresses;
                $scope.customerContactList = $scope.dataItem.CustomerContacts;
                $scope.apiGet($scope.data[$scope.selected].Id);
                $scope.viewOnly = true;
                $scope.submitButtonText = "Close";
                $scope.showForm = true;
                $scope.showSubForm = false;
                $scope.showFooter = true;
                $scope.showSubFooter = false;
                $scope.selectedTab = $scope.tabPages[0];
                break;
        }
    }

    $scope.openModalForm = function (panel) {
        $scope.isError = false;
        openModalPanel(panel);
    }

    $scope.closeModalForm = function () {
        jQuery.magnificPopup.close();
        $scope.isError = false;
    }

    $scope.closeForm = function () {
        $scope.isError = false;
        $scope.showForm = false;
        $scope.showMenu = true;
        $scope.showSubMenu = false;
    }

    $scope.showFormError = function (message) {
        $scope.isError = true;
        $scope.errorMessage = message;
    }

    $scope.submit = function () {
        switch ($scope.actionMode) {
            case "Create":
                if (validateEntry()) {
                    $scope.apiCreate();
                }
                break;
            case "Edit":
                if (validateEntry()) {
                    $scope.apiUpdate($scope.dataItem.Id);
                }
                break;
            case "Delete":
                $scope.apiDelete($scope.dataItem.Id);
                break;
            case "View":
                $scope.closeForm();
                break;
        }
    }

    // Validate Form Data Entry
    function validateEntry() {
        if ($scope.dataItem.Code == null || $scope.dataItem.Code == "") {
            $scope.showFormError("Invalid customer code.");
            $scope.selectedTab = $scope.tabPages[0];
            return false;
        }
        if ($scope.dataItem.Name == null || $scope.dataItem.Name == "") {
            $scope.showFormError("Invalid customer name.");
            $scope.selectedTab = $scope.tabPages[0];
            return false;
        }
        if($scope.dataItem.CustomerGroupId == null || $scope.dataItem.CustomerGroupId == "" ){
            $scope.showFormError("Invalid customer group.");
            $scope.selectedTab = $scope.tabPages[0];
            return false;
        }
        if ($scope.dataItem.IndustryId == null || $scope.dataItem.IndustryId == "") {
            $scope.showFormError("Invalid customer industry.");
            $scope.selectedTab = $scope.tabPages[0];
            return false;
        }
        if ($scope.dataItem.TIN == null || $scope.dataItem.TIN == "") {
            $scope.showFormError("Invalid customer tin.");
            $scope.selectedTab = $scope.tabPages[0];
            return false;
        }

        return true;
    }

    // Get Industry List
    var getIndustries = function () {
        $http.get("/api/Industries")
            .success(function (data, status) {
                $scope.Industries = data;
            })
            .error(function (data, status) {
            })
    }

    // Get Customer Group
    var getCustomerGroups = function () {
        $http.get("/api/CustomerGroups")
            .success(function (data, status) {
                $scope.CustomerGroups = data;
            })
            .error(function (data, status) {
            })
    }

    $scope.selectIndustry = function (id) {
        var industry = null;
        for (i = 0; i < $scope.Industries.length; i++) {
            if ($scope.Industries[i].Id === id) {
                industry = $scope.Industries[i]
            }
        }
        $scope.dataItem.Industry = industry;
    }

    $scope.selectCustomerGroup = function (id) {
        var cgroup = null;
        for (i = 0; i < $scope.CustomerGroups.length; i++) {
            if ($scope.CustomerGroups[i].Id === id) {
                cgroup = $scope.CustomerGroups[i]
            }
        }
        $scope.dataItem.CustomerGroup = cgroup;
    }

    $scope.setSelectedTab = function (tab) {
        $scope.selectedTab = tab;
        if ($scope.selectedTab == 'Contacts' && $scope.customerContactList.length <= 0) {
            $scope.actionSubForm('Create');
        } else if ($scope.selectedTab == 'Contacts' && $scope.customerContactList.length > 0) {
            $scope.showSubForm = false;
            $scope.showSubFooter = false;
            $scope.showFooter = true;
            $scope.showMenu = false;
            $scope.showSubMenu = true;
        }else{
            $scope.showSubForm = false;
            $scope.showFooter = true;
            $scope.showSubFooter = false;
            $scope.showSubMenu = false;
            $scope.showMenu = true;
        }
    }

    $scope.setSelectedSubTab = function (subTab) {
        $scope.selectedSubTab = subTab;
    }

    //---------------------------------------------------------------------------------//
    // This section has codes for Customer Address Routines
    // This can be copied with slight modification to other modules with address routine

    $scope.country = $rootScope.country;
    $scope.cityMunicipalities = $rootScope.getCityMunicipalities();
    $scope.customerAddressAction = null;
    $scope.selectedCustomerAddressIndex = null;

    $scope.initAddress = function () {
        $scope.customerAddress = {
            "Id": null,
            "CustomerId": null,
            "Line1": null,
            "Line2": null,
            "CityMunicipalityId": null,
            "PostalCode": null,
            "IsBillingAddress": true,
            "IsDeliveryAddress": true,
            "IsPickupAddress": true,
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
            }
        }
    }

    // Create/Insert New Customer Address
    $scope.apiCreateCustomerAddresses = function () {
        $scope.customerAddressList.push($scope.customerAddress);
        $scope.closeModalForm();
    }
    
    // Update
    $scope.apiUpdateCustomerAddresses = function () {
        $scope.customerAddressList[$scope.selectedCustomerAddressIndex] = angular.copy($scope.customerAddress);
        $scope.dataItem.CustomerAddresses[$scope.selectedCustomerAddressIndex] = angular.copy($scope.customerAddress);
        $scope.gridOptions2.data = $scope.dataItem.CustomerAddresses[$scope.selectedCustomerAddressIndex];
        $scope.closeModalForm();
    }

    // Delete
    $scope.apiDeleteCustomerAddresses = function () {
        $scope.dataItem.CustomerAddresses.splice($scope.selectedCustomerAddressIndex, 1);
        $scope.customerAddressList.splice($scope.selectedCustomerAddressIndex, 1);
        $scope.closeModalForm();
    }

    $scope.openCustomerAddressForm = function (action, i) {
        $scope.customerAddressAction = action;
        $scope.selectedCustomerAddressIndex = i;
        switch ($scope.customerAddressAction) {
            case "Create":
                $scope.initAddress();
                $scope.openModalForm('#modal-panel-address')
                break;
            case "Edit":
                $scope.customerAddress = angular.copy($scope.customerAddressList[i]);
                $scope.openModalForm('#modal-panel-address')
                break;
            case "Delete":
                $scope.customerAddress = $scope.customerAddressList[i];
                $scope.openModalForm('#modal-panel-address')
                break;
        }
    }

    $scope.saveCustomerAddress = function (action) {
        switch (action) {
            case "Create":
                if ($scope.customerAddress.Line1 == null || $scope.customerAddress.Line1 == '') {
                    $scope.showFormError("Invalid Customer Address.");
                    return;
                }
                if ($scope.customerAddress.CityMunicipality.Name == null || $scope.customerAddress.CityMunicipality.Name == '') {
                    $scope.showFormError("Invalid City/Municipalities.");
                    return;
                }

                $scope.apiCreateCustomerAddresses();
                break;
            case "Edit":
                $scope.apiUpdateCustomerAddresses();
                break;
            case "Delete":
                $scope.apiDeleteCustomerAddresses();
                break;
        }
    }

    $scope.onSelectCity = function ($item, $model, $label) {
        $scope.customerAddress.CityMunicipalityId = $item.Id;
        $scope.customerAddress.CityMunicipality.Id = $item.Id;
        $scope.customerAddress.CityMunicipality.Name = $item.Name;
        $scope.customerAddress.CityMunicipality.StateProvince.Id = $item.StateProvinceId;
        $scope.customerAddress.CityMunicipality.StateProvince.Name = $item.StateProvinceName;
        $scope.customerAddress.CityMunicipality.StateProvince.Country.Id = $scope.country.Id;
        $scope.customerAddress.CityMunicipality.StateProvince.Country.Name = $scope.country.Name;
    }

    //---------------------------------------------------------------------------------//
    // Contacts 
    
    $scope.initCustomerContact = function () {
        $scope.customerContact = {
            "CustomerId": null,
            "ContactId": null,
            "Contact": []
        }
    }

    $scope.initContact = function () {
        $scope.contact = {
            "Id": null,
            "Name": null,
            "Title": null,
            "Email": null,
            "AlternateEmail": null,
            "ContactPhones": []
        }
    }

    $scope.initContactPhone = function () {
        $scope.customerContactPhone = {
            "Id": null,
            "ContactNumber": null,
            "ContactNumberTypeId": null
        }
    }

    $scope.closeSubForm = function () {
        $scope.isError = false;
        $scope.showSubForm = false;
        $scope.showSubFooter = false;
        $scope.showFooter = true;
        $scope.showMenu = false;
        $scope.showSubMenu = true;
        $scope.showForm = true;
    }

    $scope.ContatPhoneAction = null;
    $scope.selectedCustomerContactPhoneIndex = null;

    $scope.setSubSelected = function ($index) {
        $scope.subSelected = $index;
    }

    // Get Customer Group
    var getContactType = function () {
        $http.get("/api/ContactNumberTypes")
            .success(function (data, status) {
                $scope.CustomerContactTypes = data;
            })
            .error(function (data, status) {
            })
    }

    $scope.selectContactType = function (id) {
        var cContact = null;
        for (i = 0; i < $scope.CustomerContactTypes.length; i++) {
            if ($scope.CustomerContactTypes[i].Id === id) {
                cContact = $scope.CustomerContactTypes[i]
            }
        }
        $scope.dataItem.CustomerContact = cContact;
    }

    $scope.openCustomerContactPhoneForm = function (action, i) {
        $scope.ContatPhoneAction = action;
        $scope.selectedCustomerContactPhoneIndex = i;
        switch ($scope.ContatPhoneAction) {
            case "Create":
                $scope.initContactPhone();
                $scope.openModalForm('#modal-panel-contactphone')
                break;
            case "Edit":
                $scope.initContactPhone();
                $scope.customerContactPhone = angular.copy($scope.customerContactPhoneList[i]);
                $scope.openModalForm('#modal-panel-contactphone')
                break;
            case "Delete":
                $scope.initContactPhone();
                $scope.customerContactPhone = angular.copy($scope.customerContactPhoneList[i]);
                $scope.openModalForm('#modal-panel-contactphone')
                break;
        }
    }
    $scope.actionSubForm = function (subAction) {
        $scope.subActionMode = subAction;
        switch ($scope.subActionMode) {
            case "Create":
                $scope.initCustomerContact();
                $scope.initContact();
                $scope.initContactPhone();
                $scope.customerContactPhoneList = [];
                $scope.viewOnly = false;
                $scope.saveContactText = "Add Contact";
                $scope.showSubForm = true;
                $scope.showSubFooter = true;
                $scope.showFooter = false;
                $scope.showMenu = false;
                $scope.showSubMenu = false;
                break;
            case "Edit":
                $scope.initCustomerContact();
                $scope.initContact();
                $scope.initContactPhone();
                $scope.customerContactPhoneList = [];
                $scope.customerContact = angular.copy($scope.customerContactList[$scope.subSelected]);
                $scope.contact = $scope.customerContact.Contact;
                $scope.customerContactPhoneList = $scope.contact.ContactPhones;
                $scope.viewOnly = false;
                $scope.saveContactText = "Update Contact";
                $scope.showSubForm = true;
                $scope.showSubFooter = true;
                $scope.showFooter = false;
                $scope.showMenu = false;
                $scope.showSubMenu = false;
                break;
            case "Delete":
                $scope.initCustomerContact();
                $scope.initContact();
                $scope.initContactPhone();
                $scope.customerContactPhoneList = [];
                $scope.customerContact = angular.copy($scope.customerContactList[$scope.subSelected]);
                $scope.contact = $scope.customerContact.Contact;
                $scope.customerContactPhoneList = $scope.contact.ContactPhones;
                $scope.viewOnly = true;
                $scope.saveContactText = "Delete Contact";
                $scope.showSubForm = true;
                $scope.showSubFooter = true;
                $scope.showFooter = false;
                $scope.showMenu = false;
                $scope.showSubMenu = false;
                break;
            case "View":
                $scope.initCustomerContact();
                $scope.initContact();
                $scope.initContactPhone();
                $scope.customerContactPhoneList = [];
                $scope.customerContact = angular.copy($scope.customerContactList[$scope.subSelected]);
                $scope.contact = $scope.customerContact.Contact;
                $scope.customerContactPhoneList = $scope.contact.ContactPhones;
                $scope.viewOnly = true;
                $scope.saveContactText = "Close Contact";
                $scope.showSubForm = true;
                $scope.showSubFooter = true;
                $scope.showFooter = false;
                $scope.showMenu = false;
                $scope.showSubMenu = false;
                break;
        }
    }

    $scope.saveCustomerContactPHone = function (action) {
        switch (action) {
            case "Create":
                if ($scope.customerContactPhone.ContactNumber == null || $scope.customerContactPhone.ContactNumber == '') {
                    $scope.showFormError("Invalid Contact No.");
                    return;
                }
                if ($scope.customerContactPhone.ContactNumberTypeId == null || $scope.customerContactPhone.ContactNumberTypeId == '') {
                    $scope.showFormError("Invalid Type Id.");
                    return;
                }
                $scope.customerContactPhoneList.push($scope.customerContactPhone);
                $scope.closeModalForm();
                break;
            case "Edit":
                if ($scope.customerContactPhone.ContactNumber == null || $scope.customerContactPhone.ContactNumber == '') {
                    $scope.showFormError("Invalid Contact No.");
                    return;
                }
                if ($scope.customerContactPhone.ContactNumberTypeId == null || $scope.customerContactPhone.ContactNumberTypeId == '') {
                    $scope.showFormError("Invalid Type Id.");
                    return;
                }
                $scope.customerContactPhoneList[$scope.selectedCustomerContactPhoneIndex] = angular.copy($scope.customerContactPhone);

               $scope.closeModalForm();
                break;
            case "Delete":
                $scope.contact.ContactPhones.splice($scope.selectedCustomerContactPhoneIndex, 1);
                $scope.closeModalForm();
                break;
        }
    }

    $scope.submitSubForm = function () {
        switch ($scope.subActionMode) {
            case "Create":
                if ($scope.contact.Name == null || $scope.contact.Name == '') {
                    $scope.showFormError("Invalid Contact Name.");
                    $scope.selectedTab = $scope.tabPages[2];
                    return false;
                }

                if ($scope.contact.Email == null || $scope.contact.Email == '') {
                    $scope.showFormError("Invalid Contact Email.");
                    $scope.selectedTab = $scope.tabPages[2];
                    return false;
                }

                if ($scope.contact.AlternateEmail == null || $scope.contact.AlternateEmail == '') {
                    $scope.showFormError("Invalid Contact Alternate Email.");
                    $scope.selectedTab = $scope.tabPages[2];
                    return false;
                }

                $scope.contact.ContactPhones = $scope.customerContactPhoneList;
                for(var i=0;i<$scope.contact.ContactPhones.length;i++){
                    delete $scope.contact.ContactPhones[i].Id;
                }
               
                $scope.customerContact.Contact = $scope.contact;
                if ($scope.dataItem.Id == null || $scope.dataItem.Id == '') {
                    $scope.customerContact.CustomerId = -1;
                    $scope.customerContact.ContactId = -1;
                } else {
                    $scope.customerContact.CustomerId = $scope.dataItem.Id;
                    $scope.customerContact.ContactId = -1;
                }
                delete $scope.customerContact.Contact.Id;
                $scope.customerContactList.push($scope.customerContact);
                $scope.closeSubForm();
                break;
            case "Edit":
                if ($scope.contact.Name == null || $scope.contact.Name == '') {
                    $scope.showFormError("Invalid Contact Name.");
                    $scope.selectedTab = $scope.tabPages[2];
                    return false;
                }

                if ($scope.contact.Email == null || $scope.contact.Email == '') {
                    $scope.showFormError("Invalid Contact Email.");
                    $scope.selectedTab = $scope.tabPages[2];
                    return false;
                }

                if ($scope.contact.AlternateEmail == null || $scope.contact.AlternateEmail == '') {
                    $scope.showFormError("Invalid Contact Alternate Email.");
                    $scope.selectedTab = $scope.tabPages[2];
                    return false;
                }

                $scope.contact.ContactPhones = angular.copy($scope.customerContactPhoneList);
                for (var i = 0; i < $scope.contact.ContactPhones.length; i++) {
                    if ($scope.contact.ContactPhones[i].Id == null || $scope.contact.ContactPhones[i].Id == '') {
                        delete $scope.contact.ContactPhones[i].Id;
                    }
                }
                
                $scope.customerContact.Contact = $scope.contact;
                $scope.customerContactList[$scope.subSelected] = angular.copy($scope.customerContact);
                $scope.closeSubForm();
                $scope.showForm = true;
                break;
            case "Delete":
                $scope.customerContactList.splice($scope.subSelected, 1);
                $scope.closeSubForm();
                $scope.showForm = true;
                break;
            case "View":
                $scope.closeForm();
                break;
        }
    }

    //---------------------------------------------------------------------------------//
    // Initialization routines
    var init = function () {
        // Call function to load data during content load
        $scope.loadData($scope.currentPage);
        getCustomerGroups();
        getIndustries();
        getContactType();
    }
    init();

});
