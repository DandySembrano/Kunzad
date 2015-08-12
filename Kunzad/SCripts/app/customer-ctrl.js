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

    $scope.CustomerGroups = [];
    $scope.CustomerContactTypes = [];
    $scope.Industries = [];
    $scope.showForm = false;
    $scope.showSubForm = false;
    $scope.showFooter = false;
    $scope.showSubFooter = false;
    $scope.showMenu = true;
    $scope.showSubMenu = false;
    $scope.showMenuAddress = false;
    $scope.showMenuContact = false;
   
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
        ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id)"  context-menu="grid.appScope.setSelected(row.entity.Id)" data-target= "DTCustGeneral"></div>' +
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
          { name: 'City Municipality', field: 'CityMunicipality.Name' },
          { name: 'Province/State', field: 'CityMunicipality.StateProvince.Name' },
          { name: 'Postal Code', field: 'PostalCode' },
          { name: 'Country', field: 'CityMunicipality.StateProvince.Country.Name' },
        ],
        rowTemplate: '<div>' +
        ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelectedAddress(row.entity.Id)"  context-menu="grid.appScope.setSelectedAddress(row.entity.Id)" data-target= "DTCustAdresss"></div>' +
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
    $scope.apiUpdate = function (id)
    {
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
        for (var j = 0; j <= $scope.data.length; j++) {    
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
        if (tab == 'General') {
            $scope.showMenu = true;
            $scope.showMenuAddress = false;
            $scope.showMenuContact = false;
        } else if (tab == 'Addresses') {
            $scope.showMenu = false;
            $scope.showMenuAddress = true;
            $scope.showMenuContact = false;
        } else if (tab == 'Contacts') {
            $scope.showMenu = false;
            $scope.showMenuAddress = false;
            $scope.showMenuContact = true;
        }
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

    $scope.setSelectedAddress = function (id) {
        for (var j = 0; j <= $scope.customerAddressList.length; j++) {
            if (id == $scope.customerAddressList[j].Id) {
                $scope.selectedAddress = j;
                break;
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
        $scope.customerAddressList[$scope.selectedAddress] = angular.copy($scope.customerAddress);
        $scope.dataItem.CustomerAddresses[$scope.selectedAddress] = angular.copy($scope.customerAddress);
        $scope.gridOptions2.data = $scope.dataItem.CustomerAddresses[$scope.selectedAddress];
        $scope.closeModalForm();
    }

    // Delete
    $scope.apiDeleteCustomerAddresses = function () {
        $scope.dataItem.CustomerAddresses.splice($scope.selectedCustomerAddressIndex, 1);
        $scope.customerAddressList.splice($scope.selectedCustomerAddressIndex, 1);
        $scope.closeModalForm();
    }

    $scope.actionFormAddress = function (action, i) {
        $scope.customerAddressAction = action;
        switch ($scope.customerAddressAction) {
            case "Create":
                $scope.initAddress();
                $scope.openModalForm('#modal-panel-address')
                break;
            case "Edit":
                $scope.customerAddress = angular.copy($scope.customerAddressList[$scope.selectedAddress]);
                $scope.openModalForm('#modal-panel-address')
                break;
            case "Delete":
                $scope.customerAddress = $scope.customerAddressList[$scope.selectedAddress];
                $scope.openModalForm('#modal-panel-address')
                break;
            case "View":
                $scope.customerAddress = angular.copy($scope.customerAddressList[$scope.selectedAddress]);
                $scope.openModalForm('#modal-panel-address')
                $scope.viewOnly = true;
                $scope.submitButtonText = "Close";
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

    $scope.gridOptionsContact = {
        data: 'customerContactList',
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
          { name: 'Name', field: 'Contact.Name' },
          { name: 'Title', field: 'Contact.Title' },
          { name: 'Email', field: 'Contact.Email' },
          { name: 'Alternate Email', field: 'Contact.AlternateEmail' },
        ],
        rowTemplate: '<div>' +
        ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelectedContact(row.entity.Id)"  context-menu="grid.appScope.setSelectedContact(row.entity.Id)" data-target= "DTCustContact"></div>' +
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

    $scope.actionFormContact = function (action, i) {
        $scope.customerContactAction = action;
        switch ($scope.customerContactAction) {
            case "Create":
                $scope.initCustomerContact();
                $scope.initContact();
                $scope.initContactPhone();
                $scope.customerContactPhoneList = [];
                $scope.openModalForm('#modal-panel-contactphone')
                break;
            case "Edit":
                $scope.contact = angular.copy($scope.customerContactList[$scope.selectedContact].Contact);
                $scope.customerContactPhoneList = angular.copy($scope.customerContactList[$scope.selectedContact].Contact.ContactPhones);
                $scope.openModalForm('#modal-panel-contactphone')
                break;
            case "Delete":
                $scope.customerAddress = $scope.customerAddressList[$scope.selectedAddress];
                $scope.openModalForm('#modal-panel-address')
                break;
        }
    }

    $scope.setSelectedContact = function (id) {
        for (var j = 0; j <= $scope.customerContactList.length; j++) {
            if (id == $scope.customerContactList[j].Id) {
                $scope.selectedContact = j;
                break;
            }
        }
    }
    // Create/Insert New Customer Address
    $scope.apiCreateCustomerAddresses = function () {
        $scope.customerAddressList.push($scope.customerAddress);
        $scope.closeModalForm();
    }

    $scope.setSelectedContactPhone = function (id) {
        $scope.selectedContactPhone = id;
    }

    $scope.actionFormContactPhone = function (action) {
        switch (action) {
            case "Create":
                $scope.customerContactPhoneList.push({});
                break;
            case "Delete":
                delete $scope.customerContactPhoneList[$scope.selectedContactPhone];
                break;
        }
    }


    $scope.saveCustomerContact = function (action) {
        switch (action) {
            case "Create":
                $scope.contact.ContactPhones = $scope.customerContactPhoneList;
                for (var i = 0; i < $scope.contact.ContactPhones.length; i++) {
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
                $scope.closeModalForm();
                break;
            case "Edit":
                /*$scope.contact.ContactPhones = angular.copy($scope.customerContactPhoneList);
                for (var i = 0; i < $scope.contact.ContactPhones.length; i++) {
                    if ($scope.contact.ContactPhones[i].Id == null || $scope.contact.ContactPhones[i].Id == '') {
                        delete $scope.contact.ContactPhones[i].Id;
                    }
                }
                $scope.customerContact.Contact = $scope.contact;;
                $scope.customerContactList[$scope.selectedContactPhone] = angular.copy($scope.customerContact);
                $scope.closeModalForm();
                break;*/
            case "Delete":
                $scope.apiDeleteCustomerAddresses();
                break;
        }
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
