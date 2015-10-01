
kunzadApp.controller("TruckingController", TruckingController);
function TruckingController($scope, $http, $interval, $filter, $rootScope) {
    $scope.modelName = "Dispatching";
    $scope.modelhref = "#/trucking";
    $scope.isPrevPage = false;
    $scope.isNextPage = true;
    $scope.actionMode = "Create";
    $scope.selected = null;
    $scope.currentPage = 1;
    $scope.viewOnly = false;
    $scope.isError = false;
    $scope.errorMessage = "";
    $scope.submitButtonText = "Submit";
    $scope.tabPages = ["Information", "List"];
    $scope.selectedTab = "Information";
    $scope.showMenu = true;
    $scope.truckList = [];
    $scope.driverList = [];
    $scope.serviceableAreaList = [];
    $scope.shipmentList = [];
    $scope.trkgDeliveryList = [];
    $scope.truckingTypeList = [];
    var pageSize = 20;

    $scope.loadData = function (page) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0;
        $http.get("/api/Truckings?page=" + page)
            .success(function (data, status) {
                console.log(data);
                //initialize trucking
                $scope.gridOptTrkList.data = data;

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
                $scope.focusOnTop
                spinner.stop();
            })
            .error(function (data, status) {
                spinner.stop();
            });
    };

    $scope.initTruckingItem = function () {
        $scope.truckingItem = {
            "Id": null,
            "DocumentNo": 'doc01',
            "TruckerId": null,
            "Trucker": {
                "Id": null,
                "Name": null
            },
            "TruckId": null,
            "Truck": {
                "Id": null,
                "PlateNo": null,
            },
            "DriverId": null,
            "DriverName": null,
            "Driver": {
                "Id": null,
                "FirstName": null,
                "MiddleName": null,
                "LastName": null
            },
            "TruckingTypeId": null,
            "TruckingType": {
                "Id": null,
                "Name": null
            },
            "OriginServiceableAreaId": null,
            "OriginServiceableAreaName": null,
            "DestinationServiceableAreaId": null,
            "DestinationServiceableAreaName": null,
            "TruckerCost": null,
            "TruckingStatusId": null,
            "TruckingStatusRemarks": null,
            "TruckCallDate": null,
            "TruckCallTime": null,
            "DispatchDate": null,
            "DispatchTime": null,
            "CompletedDate": null,
            "CompletedTime": null,
            "CreatedDate": null,
            "LastUpdatedDate": null,
            "CreatedByUserId": null,
            "LastUpdatedByUserId": null
        }
    }

    //initialized trucking gridoption
        $scope.initTruckingGridOptions = function () {
            var columns = [];
            $scope.truckingHeader = ['Dispatch No', 'Dispatch Date', 'Dispatch Time', 'Status',          'Type',           'Plate No',      'Trucker Name', 'Driver First Name','Driver Last Name', 'Truck Call Date', 'Truck Call Time', 'No'];
            $scope.truckingKeys = [  'Id',          'DispatchDate',  'DispatchTime',  'TruckingStatusId','TruckingTypeId', 'Truck.PlateNo', 'Trucker.Name', 'Driver.FirstName', 'Driver.LastName',  'TruckCallDate',   'TruckCallTime'];
            $scope.KeyType = [       'ControlNo',   'Date',          'Time',          'TruckingStatus',  'TruckingType',   'String',        'String',       'String',           'String',           'Date',            'Time'];
            $scope.colWidth = [150, 150, 150, 100, 100, 150, 150,150,150,150,150];
            $scope.RequiredFields = ['DispatchDate-Dispatch Date', 'DispatchTime-Dispatch Time', 'TruckingTypeId-Type', 'TruckerId-Trucker Name', 'TruckId-Truck Plate No', 'DriverId-Driver', 'TruckCallDate-Truck Call Date', 'TruckCallTime-Truck Call Time'];
            //Initialize Number Listing
            var columnProperties = {};
            columnProperties.name = $scope.truckingHeader[$scope.truckingHeader.length - 1];
            columnProperties.field = 'No';
            columnProperties.cellTemplate = '<div class="ui-grid-cell-contents text-center">{{row.entity.No = (grid.appScope.currentPage == 1 ? (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) : ((grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.currentPage - 1) * grid.appScope.pageSize)))}}</div>';
            columnProperties.width = 40;
            columnProperties.enableColumnResizing = true;
            columnProperties.enableColumnMenu = false;
            columnProperties.enableColumnMoving = false;
            columns.push(columnProperties);
            //Initialize column data
            for (var i = 0; i < ($scope.truckingHeader.length - 1) ; i++) {
                var columnProperties = {};
                columnProperties.name = $scope.truckingHeader[i];
                columnProperties.field = $scope.truckingKeys[i];
                columnProperties.width = $scope.colWidth[i];
                //format field value
                columnProperties.cellFilter = $scope.filterValue($scope.KeyType[i]);
                columns.push(columnProperties);
            }
            $scope.gridOptTrkList = {
                columnDefs: columns,
                rowTemplate: '<div>' +
                    ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell text-center"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id)"  context-menu="grid.appScope.setSelected(row.entity.Id)" data-target= "DataTableMenu"></div>' +
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

    //Retrieve trucking delivery shipments
    $scope.loadDetail = function (truckingId) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var i = 0;
        $http.get("/api/TruckingDeliveries?truckingId=" + truckingId + '&page=1')
            .success(function (data, status) {
                //initialize trucking delivery
                $scope.trkgDeliveryList = data;
                for (var i = 0; i < $scope.trkgDeliveryList.length; i++) 
                    $scope.trkgDeliveryList[i].DeliveryAddress = $scope.trkgDeliveryList[i].Address.Line1 + ", " + $scope.trkgDeliveryList[i].Address.Line2 + ", " + $scope.trkgDeliveryList[i].Address.CityMunicipality.Name + ", " + $scope.trkgDeliveryList[i].Address.PostalCode;
                $scope.focusOnTop();
                spinner.stop();
            })
            .error(function (data, status) {
                spinner.stop();
            });
    };


    $scope.setSelected = function (id) {
        $scope.truckingIDholder = id;
    };

    //search trucking
    $scope.searchTrucking = function (id) {
        var i = 0;
        for (i = 0; i < $scope.gridOptTrkList.data.length; i++) {
            if (id == $scope.gridOptTrkList.data[i].Id) {
                return i;
            }
        }
        return i;
    };

    //Set TruckingType Value
    $scope.setTruckingType = function (id) {
        for (var i = 0; i < $rootScope.getTruckingTypeList.length; i++) {
            if (id == $rootScope.getTruckingTypeList[i].Id) {
                $scope.truckingItem.TruckingType = $rootScope.getTruckingTypeList[i];
                return true;
            }
        }
    };

    $scope.showModalShipment = function (index) {
        $scope.ShipmentRow = index;
        openModalPanel('#shipment-list-modal');
    }
    
    $scope.addNewBooking = function () {
        $scope.trkgDeliveryList.push(
             {
                Id: -1,
                TruckingId: null,
                ShipmentId: null,
                Shipment: {
                    Id: null,
                    BusinessUnitId: null,
                    ServiceId: null,
                    Service: {
                        Id: null,
                        Name: null
                    },
                    ShipmentTypeId: null,
                    ShipmentType: {
                        Id: null,
                        Name: null
                    },
                    PaymentMode: null,
                    CustomerId: null,
                    Customer: {
                        Id: null,
                        Name: null
                    },
                    Quantity: null,
                    TotalCBM: null,
                    Description: null,
                    DeliverTo: null,
                    DeliveryAddressId: null,
                    DeliveryAddress: null,
                    Address : {
                        Id: null,
                        Line1: null,
                        Line2: null,
                        CityMunicipalityId: null,
                        CityMunicipality: {
                            Id: null,
                            Name: null,
                            StateProvince: {
                                Id: null,
                                Name: null,
                                CountryId : null,
                                Country: {
                                    Id: null,
                                    Name : null
                                }
                            }

                        },
                        PostalCode: null
                    }
                },
                CustomerId: null,
                Customer: { Id: null, Name: null },
                Quantity: null,
                CBM: null,
                Description: null,
                DeliverTo: null,
                DeliveryAddressId: null,
                DeliveryAddress: null,
                Address: {
                    Id: null,
                    Line1: null,
                    Line2: null,
                    CityMunicipalityId: null,
                    CityMunicipality: {
                        Id: null,
                        Name: null,
                        StateProvince: {
                            Id: null,
                            Name: null,
                            CountryId: null,
                            Country: {
                                Id: null,
                                Name: null
                            }
                        }

                    },
                    PostalCode: null
                },
                DeliveryDate: null,
                DeliveryTime: null,
                CostAllocation: null,
                CreatedDate: null,
                LastUpdatedDate: null,
                CreatedByUserId: null,
                LastUpdatedByUserId: null
            }
        );
    };
    $scope.removeBooking = function (index) {
        if ($scope.trkgDeliveryList.length == 1)
            alert('Unable to delete detail, At least 1 detail is required.');
        else
            $scope.trkgDeliveryList.splice(index, 1);
    };

    //init trucking type
    $scope.truckingTypeList = $rootScope.getTruckingTypeList();

    $scope.initTruck = function () {
        $http.get("/api/Trucks?page=1")
            .success(function (data, status) {
                $scope.truckList = data;
            });
    }

    $scope.initDriver = function () {
        $http.get("/api/Drivers")
          .success(function (data, status) {
              $scope.driverList = data;
          });
    }

    $scope.initServiceableArea = function () {
        $http.get("/api/ServiceableAreas")
        .success(function (data, status) {
            $scope.serviceableAreaList = data;
        });
    }

    $scope.initShipment = function () {
        $http.get("/api/Shipments?page=1")
        .success(function (data, status) {
            $scope.shipmentList = data;
        });
    }

    //Set the focus on top of the page during load
    $scope.focusOnTop = function () {
        $(document).ready(function () {
            $(this).scrollTop(0);
        });
    };

    //Displays Modal
    $scope.showModal = function (panel, type) {
        openModalPanel(panel);
        $scope.modalType = type;
    };

    //close Truck List Modal
    $scope.closeModalTruck = function (truck) {
        if (angular.isDefined(truck)) {
            $scope.truckingItem.TruckId = truck.Id;
            $scope.truckingItem.Truck.PlateNo = truck.PlateNo;
            $scope.truckingItem.Trucker.Name = truck.Trucker.Name;
            $scope.truckingItem.TruckerId = truck.Trucker.Id;
        }
        jQuery.magnificPopup.close();
    };

    //close driver modal
    $scope.closeModalDriver = function (driver) {
        if (angular.isDefined(driver)) {
            $scope.truckingItem.DriverId = driver.Id;
            $scope.truckingItem.DriverName = driver.FirstName + ' ' + driver.LastName;
        }
        jQuery.magnificPopup.close();
    };

    //close business unit modal origin
    $scope.closeModalOriginServiceableArea = function (serviceableArea) {
        if (angular.isDefined(serviceableArea)) {
            $scope.truckingItem.OriginServiceableAreaId = serviceableArea.Id;
            $scope.truckingItem.OriginServiceableAreaName = serviceableArea.Name;
        }
        jQuery.magnificPopup.close();
    };

    //close business unit modal destination
    $scope.closeModalDestinationServiceableArea = function (serviceableArea) {
        if (angular.isDefined(serviceableArea)) {
            $scope.truckingItem.DestinationServiceableAreaId = serviceableArea.Id;
            $scope.truckingItem.DestinationServiceableAreaName = serviceableArea.Name;
        }
        jQuery.magnificPopup.close();
    };


    $scope.closeShipment = function (id) {
        var selected = 0;
        for (var j = 0; j <= $scope.shipmentList.length; j++) {
            if (id == $scope.shipmentList[j].Id) {
               selected = j;
                break;
            }
        }

        $scope.trkgDeliveryList[$scope.ShipmentRow].ShipmentId = $scope.shipmentList[selected].Id;
        $scope.trkgDeliveryList[$scope.ShipmentRow].CustomerId = $scope.shipmentList[selected].CustomerId;
        $scope.trkgDeliveryList[$scope.ShipmentRow].Customer.Code = $scope.shipmentList[selected].Customer.Code;
        $scope.trkgDeliveryList[$scope.ShipmentRow].Customer.Name = $scope.shipmentList[selected].Customer.Name;
        $scope.trkgDeliveryList[$scope.ShipmentRow].Quantity = $scope.shipmentList[selected].Quantity;
        $scope.trkgDeliveryList[$scope.ShipmentRow].CBM = $scope.shipmentList[selected].TotalCBM;
        $scope.trkgDeliveryList[$scope.ShipmentRow].Description = $scope.shipmentList[selected].Description;
        $scope.trkgDeliveryList[$scope.ShipmentRow].DeliverTo = $scope.shipmentList[selected].DeliverTo;
        $scope.trkgDeliveryList[$scope.ShipmentRow].Shipment.DeliverToContactNo = $scope.shipmentList[selected].DeliverToContactNo;
        $scope.trkgDeliveryList[$scope.ShipmentRow].DeliveryAddressId = $scope.shipmentList[selected].DeliveryAddressId;
        $scope.trkgDeliveryList[$scope.ShipmentRow].DeliveryAddress = $scope.shipmentList[selected].Address.Line1 + ", " + $scope.shipmentList[selected].Address.Line2 + ", " + $scope.shipmentList[selected].Address.CityMunicipality.Name +  ", " + $scope.shipmentList[selected].Address.PostalCode;
        $scope.trkgDeliveryList[$scope.ShipmentRow].DeliveryDate = $scope.shipmentList[selected].DeliveryDate;
        $scope.trkgDeliveryList[$scope.ShipmentRow].DeliveryTime = $scope.shipmentList[selected].DeliveryTime;
        jQuery.magnificPopup.close();
    };

    $scope.setSelectedTab = function (tab) {
        $scope.isError = false;
        $scope.errorMessage = "";
        $scope.selectedTab = tab;
    };
    //Triggers when user create, delete, update or view a sea freight transation in the list
    $scope.actionForm = function (action) {
        $scope.actionMode = action;
        $scope.selectedtruckingIndex = $scope.searchTrucking($scope.truckingIDholder);
        $scope.selectedTab = $scope.tabPages[0];
        $scope.isError = false;
        $scope.errorMessage = "";
        switch ($scope.actionMode) {
            case "Create":
                $scope.initTruckingItem();
                $scope.trkgDeliveryList = [];
                $scope.addNewBooking();
                $scope.viewOnly = false;
                $scope.submitButtonText = "Submit";
                break;
            case "Edit":
                $scope.truckingItem = [];
                $scope.truckingItem = angular.copy($scope.gridOptTrkList.data[$scope.selectedtruckingIndex]);
                $scope.controlNoHolder = $scope.truckingItem.Id;
                $scope.truckingItem.Id = $rootScope.formatControlNo('', 15, $scope.truckingItem.Id);
                $scope.truckingItem.DriverName = $scope.truckingItem.Driver.FirstName + ' ' + $scope.truckingItem.Driver.LastName;
                $scope.viewOnly = false;
                $scope.loadDetail($scope.controlNoHolder);
                $scope.submitButtonText = "Submit";
                break;
            case "Delete":
                $scope.truckingItem = [];
                $scope.truckingItem = angular.copy($scope.gridOptTrkList.data[$scope.selectedtruckingIndex]);
                $scope.controlNoHolder = $scope.truckingItem.Id;
                $scope.truckingItem.Id = $rootScope.formatControlNo('', 15, $scope.truckingItem.Id);
                $scope.truckingItem.DriverName = $scope.truckingItem.Driver.FirstName + ' ' + $scope.truckingItem.Driver.LastName;
                $scope.viewOnly = true;
                $scope.loadDetail($scope.controlNoHolder);
                $scope.submitButtonText = "Delete";
                break;
            case "View":
                $scope.truckingItem = [];
                $scope.truckingItem = angular.copy($scope.gridOptTrkList.data[$scope.selectedtruckingIndex]);
                $scope.controlNoHolder = $scope.truckingItem.Id;
                $scope.truckingItem.Id = $rootScope.formatControlNo('', 15, $scope.truckingItem.Id);
                $scope.truckingItem.DriverName = $scope.truckingItem.Driver.FirstName + ' ' + $scope.truckingItem.Driver.LastName;
                $scope.viewOnly = true;
                $scope.loadDetail($scope.controlNoHolder);
                $scope.submitButtonText = "Close";
                break;
        }
    };

    $scope.apiCreate = function () {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var dataModel = angular.copy($scope.truckingItem); //subject for changes
        var dataModel1 = angular.copy($scope.trkgDeliveryList);

        for (var i = 0; i < dataModel1.length; i++) {
            delete dataModel1[i].Shipment;
            delete dataModel1[i].Address;
            delete dataModel1[i].Customer;
            delete dataModel1[i].Shipment;
            delete dataModel1[i].Id;
            delete dataModel1[i].CostAllocation;
            delete dataModel1[i].TruckingId;

        }

        dataModel.TruckingDeliveries = dataModel1;

        delete dataModel.Id;
        delete dataModel.TruckingStatusId;
        delete dataModel.Truck;
        delete dataModel.Driver;
        delete dataModel.Trucker;
        delete dataModel.TruckerCost;


        $http.post("/api/Truckings", dataModel)
        .success(function (data, status) {
            $scope.truckingItem.Id = angular.copy(data.objParam1.Id);
            $scope.gridOptTrkList.data.push($scope.truckingItem);
            for (var i = 0; i < $scope.trkgDeliveryList.length; i++)
                $scope.trkgDeliveryList[i].Id = data.objParam1.TruckingDeliveries[i].Id;
            spinner.stop();
        })
        .error(function (error, status) {
            spinner.stop();
            $scope.isError = true;
            $scope.errorMessage = status;
        });
    }

    $scope.apiUpdate = function (id) {
        var spinner = new Spinner(opts).spin(spinnerTarget);
        var dataModel = angular.copy($scope.truckingItem); //subject for changes
        var dataModel1 = angular.copy($scope.trkgDeliveryList);

        for (var i = 0; i < dataModel1.length; i++) {
            if (dataModel1[i].Id == -1)
            {
                delete dataModel1[i].Id;
            }
                
            delete dataModel1[i].Address;
            delete dataModel1[i].Customer;
            delete dataModel1[i].CostAllocation;

        }

        dataModel.TruckingDeliveries = dataModel1;
        delete dataModel.Truck;
        delete dataModel.Driver;
        delete dataModel.Trucker;
        delete dataModel.TruckerCost;

        console.log(dataModel);

        $http.put("/api/Truckings" + "/" + id, dataModel)
        .success(function (data, status) {
            if (data.status = "SUCCESS") {
                $scope.gridOptTrkList.data[$scope.selectedTruckingIndex] = angular.copy($scope.truckingItem);
                for (var i = 0; i < $scope.trkgDeliveryList.length; i++)
                    $scope.trkgDeliveryList[i].Id = data.objParam1.TruckingDeliveries[i].Id;
                $scope.selectedTab = $scope.tabPages[1];
                //$scope.onEDV();
                spinner.stop();
                alert("Successfully Updated.");
            }
            else {
                spinner.stop();
                $scope.isError = true;
                $scope.errorMessage = data.message;
            }
        })
        .error(function (error, status) {
            spinner.stop();
            $scope.isError = true;
            $scope.errorMessage = status;
        });
    }

    //Search key
    $scope.searchKey = function (key) {
        if (angular.isDefined($scope.truckingItem[key]))
            return true;
        return false;
    };

    //Function that check required fields
    $scope.checkRequiredFields = function () {
        var key = "", label = "";
        for (var i = 0; i < $scope.RequiredFields.length; i++) {
            var split = $scope.RequiredFields[i].split("-");
            key = split[0];
            //Check if key is valid
            if ($scope.searchKey(key) == false) {
                $scope.isError = true;
                $scope.errorMessage = " " + key + " is undefined.";
                return false;
            }
            else {
                //Check if label name exist in a key
                if (split.length == 2)
                    label = split[1];
                else {
                    $scope.isError = true;
                    $scope.errorMessage = " Label name is required for Key: " + key;
                    return false;
                }

                if ($scope.truckingItem[key] == null || $scope.truckingItem[key] == "") {
                    $scope.isError = true;
                    $scope.errorMessage = " " + label + " is required.";
                    return false;
                }
            }
        }
        return true;
    };

    //Triggers before submit function
    $scope.preSubmit = function () {
        $scope.truckingItem.Id = $scope.controlNoHolder;
        $scope.truckingItem.DispatchDate = $filter('date')(document.getElementById('dispatchdate').value, "yyyy-MM-dd");
        $scope.truckingItem.DispatchTime = $filter('date')(document.getElementById('dispatchtime').value, "hh:mm:ss");
        $scope.truckingItem.TruckCallDate = $filter('date')(document.getElementById('truckcalldate').value, "yyyy-MM-dd");
        $scope.truckingItem.TruckCallTime = $filter('date')(document.getElementById('truckcalltime').value, "hh:mm:ss");
        return true;
    };
    $scope.submit = function () {
        $scope.isError = false;
        $scope.errorMessage = "";
        if ($scope.preSubmit()) {
            switch ($scope.actionMode) {
                case 'Create':
                    if ($scope.checkRequiredFields()) {
                        if ($scope.apiCreate())
                            $scope.selectedTab = "List";
                    }
                    break;
                case 'Edit':
                    if ($scope.checkRequiredFields())
                        $scope.apiUpdate($scope.truckingItem.Id)
                    break;
                case 'Delete':
                    $scope.apiDelete($scope.truckingItem.Id);
                    break;
                case 'View':
                    $scope.selectedTab = $scope.tabPages[1];
                    break;
            }
        }
        $scope.focusOnTop();

    }
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
            case 'ControlNo':
                format = 'ControlNo';
                break;
            case 'PaymentMode':
                format = 'PaymentMode';
                break;
            case 'TruckingType':
                format = 'TruckingType';
                break;
            case 'TruckingStatus':
                format = 'TruckingStatus';
                break;
            default:
                format = 'Default';
        }
        return format;
    };


    // Initialization routines
    var init = function () {
        $scope.initTruckingItem();
        $scope.initTruckingGridOptions();
        $scope.initTruck();
        $scope.loadData($scope.currentPage);
        $scope.initDriver();
        $scope.initServiceableArea();
        $scope.initShipment();
        $scope.addNewBooking();
    };

    init();
};