kunzadApp.directive('dirDataGrid1', function () {
    /*---------------------------------------------------------------------------------//
     Directive Name: dirDataGrid1
     Author: Kenneth Ybañez
     Note: If this is used more than once in a page, the other instance should be resetted.
     Functionalities:
     1. CRUD
     2. Pagination
     3. Sorting
     4. Context-Menu
     5. Overriding and Overloading by using otherActions scope predefined actions
     6. Formatting of Date,Time,DateTime, String, String-Upper, Boolean and Number
     7. Validate required fields
     8. Export data to excel, word, png
    ---------------------------------------------------------------------------------*/
    return {
        restrict: 'E',
        scope: {
            actioncreate: '=',          //scope that will listen if the create button in main page was clicked
            actionmode: '=',            //scope that will hold the label header of the modal
            datadefinition: '=',        /* Properties:
                                            Header      - Contains the header of the DataGrid
                                            Note: If first value of header key is two words, use underscore instead of space(Ex. Created_Date)
                                            Keys        - Columns/Keys to be showin in DataGrid
                                            Type        - Type of the Columns/Keys(String,Date,DateTime,Time)
                                            DataList    - Contains the List of data to be displayed in DataGrid
                                            APIUrl      - Contains the API Url, first index is for Get then second index is for CUD,
                                                          If Get url parameter is more than one, separate it by using space.
                                                          (Ex. /api/Truck?page=1 &truckerId=1&truckerName=2&......)
                                            DataItem    - Contains the data of the selected item in DataGrid List
                                            DataTarget  - Contains the data target for the context-menu
                                            ViewOnly    - Determine if the fields of the selected item are editable or not
                                            ContextMenu - Actions to be passed in each context menu item (Ex: ["'actionName'"])
                                            ContextMenuLabel - Lable for each context menu item (Ex: ['actionLabel'])
                                        */
            submitbuttontext: '=',      //scope that holds the submit button label
            submitbuttonlistener: '=',  //scope that will serve as listener that will identify if the user submit an action  
            closecontainer: '&',        //function that will close the form container
            opencontainer: '&',         //function that will open the form container
            otheractions: '&',          /*
                                            Function that will trigger when other actions is passed 
                                            other than the default actions found under actionForm function.
                                            Note: Return true if purpose is to overload, false if override

                                            PreSubmit           - triggers before submit function
                                            PostSubmit          - triggers after submit function
                                            PreSave             - triggers before calling apiCreate function under submit function
                                            PostSave            - triggers after calling apiCreate function under submit function
                                            PreUpdate           - triggers before calling apiUpdate function under submit function
                                            PostUpdate          - triggers after calling apiUpdate function under submit function
                                            PreDelete           - triggers before calling apiDelete function under submit function
                                            PostDelete          - triggers after calling apiDelete function under submit function
                                            PreView             - triggers before viewing under submit function
                                            PostView            - triggers after viewing under submit function
                                            PreAction           - triggers before executing an action in actionForm function
                                            PostAction          - triggers after executing an action in actionForm function
                                            PreLoadAction       - triggers before calling loadData function under actionForm function
                                            PostLoadAction      - triggers after calling loadData function under actionForm function
                                            PreCreateAction     - triggers before executing Create action under actionForm function
                                            PostCreateAction    - triggers after executing Create action under actionForm function
                                            PreEditAction       - triggers before executing Edit action under actionForm function
                                            PostEditAction      - triggers after executing Edit action under actionForm function
                                            PreDeleteAction     - triggers before executing Delete action under actionForm function
                                            PostDeleteAction    - triggers after executing Delete action under actionForm function
                                            PreViewAction       - triggers before executing Edit action under actionForm function
                                            PostViewAction      - triggers after executing Edit action under actionForm function
                                        */
            resetdata: '&',             //function that will reset the dataitem
            showformerror: '&',         //function that will trigger when an error occured
        },
        templateUrl: '/Directives/DataGrid1',
        controller: function ($scope, $http, $interval, $filter, $parse, $compile) {
            var stop;
            $scope.currentPage = 1;
            $scope.pageSize = 20;
            $scope.isPrevPage = false;
            $scope.isNextPage = false;
            $scope.sortByDesc = true;
            $scope.sortByAsc = false;
            $scope.criteria = $scope.datadefinition.Keys[0];
            $scope.selectedIndex = null;
            $scope.filteredValue = "";
            $scope.gridOptions = {};
            $scope.contextMenuDefault = ["'Load'", "'Create'", "'Edit'", "'Delete'", "'View'"];
            $scope.contextMenuLabelDefault = ['Reload', 'Create', 'Edit', 'Delete', 'View'];

            //Set the focus on top of the page during load
            $scope.focusOnTop = function () {
                $(document).ready(function () {
                    $(this).scrollTop(0);
                });
            };

            //Initialize addtional context-menu item
            for (var i = 0; i < $scope.datadefinition.ContextMenu.length; i ++){
                $scope.contextMenuDefault.push($scope.datadefinition.ContextMenu[i]);
                $scope.contextMenuLabelDefault.push($scope.datadefinition.ContextMenuLabel[i]);
            }

            //Initialize ui-grid options
            $scope.initGridOptions = function () {
                var columns = [];
                //Initialize Number Listing
                var columnProperties = {};
                columnProperties.name = $scope.datadefinition.Header[$scope.datadefinition.Header.length - 1];
                columnProperties.field = 'No';
                columnProperties.cellTemplate = '<div class="ui-grid-cell-contents text-center">{{row.entity.No = (grid.appScope.currentPage == 1 ? (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) : ((grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.currentPage - 1) * grid.appScope.pageSize)))}}</div>';
                columnProperties.width = 40;
                columnProperties.enableColumnResizing = true;
                columnProperties.enableColumnMenu = false;
                columnProperties.enableColumnMoving = false;
                columns.push(columnProperties);
                
                //Initialize column data
                for (var i = 0; i < ($scope.datadefinition.Header.length - 1) ; i++) {
                    var columnProperties = {};
                    columnProperties.name = $scope.datadefinition.Header[i];
                    columnProperties.field = $scope.datadefinition.Keys[i];
                    //format field value
                    columnProperties.cellFilter = $scope.filterValue($scope.datadefinition.Type[i]);
                    columns.push(columnProperties);
                }

                $scope.gridOptions = {
                    columnDefs: columns,
                    rowTemplate: '<div>' +
                        ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id)"  context-menu="grid.appScope.setSelected(row.entity.Id)" data-target= "{{grid.appScope.datadefinition.DataTarget}}"></div>' +
                      '</div>',
                    //enableVerticalScrollbar: 0,
                    //enableHorizontalScrollbar: 2,
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

            //set grid height
            function setHeight(extra) {
                $scope.height = (($scope.gridOptions.data.length * 30) + 48);
                if (extra) {
                    $scope.height += extra;
                }
                $scope.gridOptions.gridHeight = $scope.height;
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
                    default:
                        format = 'Default';
                }
                return format;
            };

            //Process Pagination
            $scope.processPagination = function () {
                if ($scope.currentPage <= 1)
                    $scope.isPrevPage = false;
                else
                    $scope.isPrevPage = true;

                var rows = $scope.datadefinition.DataList.length;
                if (rows < $scope.pageSize)
                    $scope.isNextPage = false;
                else
                    $scope.isNextPage = true;
            };

            //Load data
            $scope.loadData = function (page) {
                var spinner = new Spinner(opts).spin(spinnerTarget);
                var url = "";
                var apiUrlSplit = $scope.datadefinition.APIUrl[0].split(" ");
                url = apiUrlSplit[0] + page;
                for (var i = 1; i < apiUrlSplit.length; i++)
                    url = url + apiUrlSplit[i];
                $http.get(url)
                    .success(function (data, status) {
                        $scope.datadefinition.DataList = [];
                        $scope.datadefinition.DataList = data;
                        $scope.gridOptions.data = $scope.datadefinition.DataList;
                        //setHeight(100);
                        $scope.processPagination();
                        $scope.focusOnTop();
                        spinner.stop();
                    })
                    .error(function (data, status) {
                        spinner.stop();
                        $scope.showformerror({ error: status });
                    })
            };

            //search data
            $scope.searchData = function (id) {
                var i = 0;
                for (i = 0; i < $scope.datadefinition.DataList.length; i++) {
                    if (id == $scope.datadefinition.DataList[i].Id) {
                        return i;
                    }
                }
                return i;
            };

            //initialize selected index
            $scope.setSelected = function (id) {
                $scope.selectedIndex = $scope.searchData(id);
            };

            //Manage the main action
            $scope.action = function (action) {
                $scope.submitbuttontext = "Submit";
                $scope.datadefinition.ViewOnly = false;
                switch (action) {
                    case 'Create':
                        $scope.resetdata();
                        break;
                    case 'Edit':
                        $scope.datadefinition.DataItem = $scope.datadefinition.DataList[$scope.selectedIndex];
                        break;
                    case 'Delete':
                        $scope.datadefinition.DataItem = $scope.datadefinition.DataList[$scope.selectedIndex];
                        $scope.submitbuttontext = "Delete";
                        $scope.datadefinition.ViewOnly = true;
                        break;
                    case 'View':
                        $scope.datadefinition.DataItem = $scope.datadefinition.DataList[$scope.selectedIndex];
                        $scope.submitbuttontext = "Close";
                        $scope.datadefinition.ViewOnly = true;
                        break;
                }
                $scope.opencontainer();
                return true;
            };

            //Manage user actions
            $scope.actionForm = function (action) {
                //It should be outside of the PreAction statement
                if (action == 'Load') {
                    if ($scope.otheractions({ action: 'PreLoadAction' }))
                        $scope.loadData($scope.currentPage)
                    //set interval to make sure that the get call returns data before triggering some actions
                    stop = $interval(function () {
                        if ($scope.datadefinition.DataList.length > 0) {
                            $interval.cancel(stop);
                            stop = undefined;
                            $scope.gridOptions.data = $scope.datadefinition.DataList;
                            //setHeight(100);
                            $scope.otheractions({ action: 'PostLoadAction' });
                            $scope.otheractions({ action: 'PostAction' });
                        }
                    }, 100);
                }
                if ($scope.otheractions({ action: 'PreAction' })) {
                    $scope.actionmode = action;
                    switch (action) {
                        case 'Create':
                            if ($scope.otheractions({ action: 'PreCreateAction' })) {
                                if ($scope.action(action))
                                    $scope.otheractions({ action: 'PostCreateAction' })
                            }
                            break;
                        case 'Edit':
                            if ($scope.otheractions({ action: 'PreEditAction' })) {
                                if ($scope.action(action))
                                    $scope.otheractions({ action: 'PostEditAction' })
                            }
                            break;
                        case 'Delete':
                            if ($scope.otheractions({ action: 'PreDeleteAction' })) {
                                if ($scope.action(action))
                                    $scope.otheractions({ action: 'PostDeleteAction' })
                            }
                            break;
                        case 'View':
                            if ($scope.otheractions({ action: 'PreViewAction' })) {
                                $scope.action(action);
                                $scope.otheractions({ action: 'PostViewAction' })
                            }
                            break;
                        case 'Excel':
                            fnExcelReport('excel');
                            break;
                        case 'Doc':
                            fnExcelReport('doc');
                            break;
                        case 'PNG':
                            fnExcelReport('png');
                            //$scope.$broadcast('export-png', {});
                            break;
                        default:
                            $scope.otheractions({ action: action });
                            break;
                    }
                    $scope.otheractions({ action: 'PostAction' });
                }
            };

            //Save data
            $scope.apiCreate = function () {
                var spinner = new Spinner(opts).spin(spinnerTarget);
                $http.post($scope.datadefinition.APIUrl[1], $scope.datadefinition.DataItem)
                    .success(function (data, status) {
                        if (data.status == "SUCCESS") {
                            $scope.datadefinition.DataItem.Id = data.objParam1.Id;
                            $scope.datadefinition.DataItem.CreatedDate = data.objParam1.CreatedDate;
                            $scope.datadefinition.DataItem.CreatedByUserId = data.objParam1.CreatedByUserId;
                            $scope.datadefinition.DataList.push($scope.datadefinition.DataItem);
                            $scope.gridOptions.data = $scope.datadefinition.DataList;
                            //reload pagination of datasource is greater than pageSize
                            if ($scope.datadefinition.DataList.length > $scope.pageSize)
                                $scope.loadData($scope.currentPage);
                            //setHeight(100);
                            $scope.closecontainer();
                            spinner.stop();
                            $scope.otheractions({ action: 'PostSave' });
                            return true;
                        }
                        else {
                            $scope.showformerror({ error: data.message });
                            spinner.stop();
                        }
                    })
                    .error(function (data, status) {
                        $scope.showformerror({ error: status });
                        spinner.stop();
                    })
                return false;
            };

            // Update
            $scope.apiUpdate = function (id) {
                var spinner = new Spinner(opts).spin(spinnerTarget);
                $http.put($scope.datadefinition.APIUrl[1] + "/" + id, $scope.datadefinition.DataItem)
                    .success(function (data, status) {
                        if (data.status == "SUCCESS") {
                            $scope.datadefinition.DataList[$scope.selectedIndex].Id = data.objParam1.Id;
                            $scope.datadefinition.DataItem.LastUpdatedDate = data.objParam1.LastUpdatedDate;
                            $scope.datadefinition.DataItem.LastUpdatedByUserId = data.objParam1.LastUpdatedByUserId;
                            $scope.gridOptions.data = $scope.datadefinition.DataList;
                            $scope.closecontainer();
                            spinner.stop();
                            $scope.otheractions({ action: 'PostUpdate' });
                            return true;
                        }
                        else {
                            $scope.showformerror({ error: data.message });
                            spinner.stop();
                        }
                    })
                    .error(function (data, status) {
                        $scope.showformerror({ error: status });
                        spinner.stop();
                    })
                return false;
            };

            // Delete
            $scope.apiDelete = function (id) {
                var spinner = new Spinner(opts).spin(spinnerTarget);
                $http.delete($scope.datadefinition.APIUrl[1] + "/" + id)
                    .success(function (data, status) {
                        if (data.status == "SUCCESS") {
                            $scope.datadefinition.DataList.splice($scope.selectedIndex, 1);
                            //reload pagination of datasource is greater than pageSize
                            $scope.loadData($scope.currentPage);
                            $scope.closecontainer();
                            spinner.stop();
                            $scope.otheractions({ action: 'PostDelete' });
                            return true;
                        }
                        else {
                            $scope.showformerror({ error: data.message });
                            spinner.stop();
                        }
                    })
                    .error(function (data, status) {
                        $scope.showformerror({ error: status });
                        spinner.stop();
                    })
                return false;
            };

            //Search key
            $scope.searchKey = function (key) {
                for (var i = 0; i < $scope.datadefinition.Keys.length; i++) {
                    if (key == $scope.datadefinition.Keys[i])
                        return true;
                }
                return false;
            };

            //Function that check required fields
            $scope.checkRequiredFields = function () {
                var key = "", label = "";
                for (var i = 0; i < $scope.datadefinition.RequiredFields.length; i++) {
                    var split = $scope.datadefinition.RequiredFields[i].split("-");
                    key = split[0];
                    //Check if key is valid
                    if ($scope.searchKey(key) == false) {
                        $scope.showformerror({ error: key + " is undefined." });
                        return false;
                    }
                    else {
                        //Check if label name exist in a key
                        if (split.length == 2)
                            label = split[1];
                        else {
                            $scope.showformerror({ error: "Label name is required for Key: " + key });
                            return false;
                        }

                        if ($scope.datadefinition.DataItem[key] == null || $scope.datadefinition.DataItem[key] == "") {
                            $scope.showformerror({ error: label + " is required." });
                            return false;
                        }
                    }
                }
                return true;
            };

            //Manage the submition of data base on the user action
            $scope.submit = function (action) {
                if ($scope.otheractions({ action: 'PreSubmit' })) {
                    if ($scope.checkRequiredFields()) {
                        switch (action) {
                            case 'Create':
                                if ($scope.otheractions({ action: 'PreSave' }))
                                    $scope.apiCreate();
                                break;
                            case 'Edit':
                                if ($scope.otheractions({ action: 'PreUpdate' }))
                                    $scope.apiUpdate($scope.datadefinition.DataItem.Id)
                                break;
                            case 'Delete':
                                if ($scope.otheractions({ action: 'PreDelete' }))
                                    $scope.apiDelete($scope.datadefinition.DataItem.Id);
                                break;
                            case 'View':
                                if ($scope.otheractions({ action: 'PreView' })) {
                                    $scope.closecontainer();
                                    $scope.otheractions({ action: 'PostView' })
                                }
                                break;
                        }
                    }
                    $scope.otheractions({ action: 'PostSubmit' })
                }
            }

            //Write the Context-Menu in DOM
            $scope.createContextMenu = function () {
                var htmlScript = "", $content = "";

                for (var i = 0; i < $scope.contextMenuDefault.length; i++) {
                    if (i == 0) {
                        htmlScript = '<li> <a class="pointer small" role="menuitem" tabindex="' + i + '" ' + 'ng-click="actionForm(' + $scope.contextMenuDefault[i] + ')">'
                                    + $scope.contextMenuLabelDefault[i] + '</a></li>';
                        htmlScript = htmlScript + '<li class="divider"></li>';
                    }
                    else {
                        htmlScript = htmlScript + '<li> <a class="pointer small" role="menuitem" tabindex="' + i + '" ' + 'ng-click="actionForm(' + $scope.contextMenuDefault[i] + ')">'
                                    + $scope.contextMenuLabelDefault[i] + '</a></li>';
                        if (i == 4 && ($scope.contextMenuDefault.length -1) != i)
                            htmlScript = htmlScript + '<li class="divider"></li>';
                    }
                }
                $content = angular.element(document.querySelector('#menuItem')).html(htmlScript);
                $compile($content)($scope);

            };

            //Listener that will check if user Submit an action
            $interval(function () {
                if ($scope.submitbuttonlistener == true) {
                    //reset listener to false
                    $scope.submitbuttonlistener = false;
                    $scope.submit($scope.actionmode);
                }
                if ($scope.actioncreate == true) {
                    $scope.actioncreate = false;
                    $scope.actionForm('Create');
                }
            }, 100);

            //Call createContextMenu, actionForm('Load') and processSorting function
            var init = function () {
                $scope.createContextMenu();
                $scope.actionForm('Load');
                $scope.initGridOptions();
            };

            init();
        }
    }
});
