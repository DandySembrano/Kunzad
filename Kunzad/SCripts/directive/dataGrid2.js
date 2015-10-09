/*---------------------------------------------------------------------------------//
 Directive Name: dirDataGrid1
 Author: Kenneth Ybañez
 Description: Dynamic datagrid directive that can communicate  with dirFiltering directive
---------------------------------------------------------------------------------*/
kunzadApp.directive('dirDataGrid2', function () {
    return {
        restrict: 'E',
        scope: {
            datadefinition: '=',        /* Properties:
                                            Header              - Contains the header of the DataGrid
                                            Keys                - Columns/Keys to be showin in DataGrid
                                            Type                - Type of the Columns/Keys(String,Date,DateTime,Time)
                                            DataList            - Contains the List of data to be displayed in DataGrid
                                            RequiredFields      - Contains the required fields
                                            ColWidth            - Width of a column in the datagrid
                                            IsEditable          - true if column in a row in datagrid is editable, else false
                                            CellTemplate        - Cell template per cell in ui-grid, array type if there is any else None in first index
                                            RowTemplate         - Row template per row in ui-grid, if value is Default defaultRowTemplate function will be invoked
                                            EnableScroll        - True if load data during scroll else false
                                            EnablePagination    - True to enable pagination else false
                                            CurrentPage         - Holds the current page if pagination is enabled // Default to 1
                                            PageSize            - Length of data to be retrieve if pagination is true
                                            DoPagination        - True if to invoke process pagination function else false //Default false
                                            Retrieve            - returns true if to invoke filtering directive
                                            DataItem            - Contains the data of the selected item in DataGrid List
                                            DataTarget          - Contains the data target for the context-menu
                                            DataTarge2          - Contains the data target for the context-menu if no row in the data grid
                                            ShowCreate          - True if create button will be shown
                                            ShowContextMenu     - True if show context menu, else false
                                            ContextMenu         - Actions to be passed in each context menu item (Ex: ["'actionName'"])
                                            ContextMenuLabel    - Lable for each context menu item (Ex: ['actionLabel'])
                                        */
            submitdefinition: '=',        /*  
                                            Submit              - true if trigger submit function else false
                                            APIUrl              - Contains the URL for http request
                                            Type                - Type of submit such as Create, Update, Delete
                                            DataItem            - Raw of data to be save, update, or delete
                                            Index               - Index of the selected Data
                                        */
            otheractions: '&',          /*
                                            Function that will trigger when other action is passed 
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
                                            PreCreateAction     - triggers before executing Create action under actionForm function
                                            PostCreateAction    - triggers after executing Create action under actionForm function
                                            PreEditAction       - triggers before executing Edit action under actionForm function
                                            PostEditAction      - triggers after executing Edit action under actionForm function
                                            PreDeleteAction     - triggers before executing Delete action under actionForm function
                                            PostDeleteAction    - triggers after executing Delete action under actionForm function
                                            PreViewAction       - triggers before executing Edit action under actionForm function
                                            PostViewAction      - triggers after executing Edit action under actionForm function
                                        */
            resetdata: '&',             //function that will trigger during Create
            showformerror: '&'         //function that will trigger when an error occured
        },
        templateUrl: '/Directives/DataGrid2',
        controller: function ($filter, $scope, $http, $interval, $parse, $compile) {
            var stop;
            $scope.pageSize = $scope.datadefinition.PageSize;
            $scope.datadefinition.Scrolled = false;
            $scope.isPrevPage = false;
            $scope.isNextPage = false;
            $scope.selectedIndex = null;
            $scope.gridOptions = {};
            $scope.scrolled = false;
            //function that focus on top of the page
            $scope.focusOnTop = function () {
                $(document).ready(function () {
                    $(this).scrollTop(0);
                });
            };

            //Initialize ui-grid options
            $scope.initGridOptions = function () {
                var columns = [];
                //Initialize Number Listing
                var columnProperties = {};
                columnProperties.name = $scope.datadefinition.Header[$scope.datadefinition.Header.length - 1];
                columnProperties.field = 'No';
                columnProperties.cellTemplate = '<div class="ui-grid-cell-contents text-center">{{row.entity.No = (grid.appScope.datadefinition.EnableScroll ? grid.renderContainers.body.visibleRowCache.indexOf(row) + 1 : grid.appScope.datadefinition.CurrentPage == 1 ? grid.renderContainers.body.visibleRowCache.indexOf(row) + 1 : (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1) + ((grid.appScope.datadefinition.CurrentPage - 1) * grid.appScope.datadefinition.PageSize))}}</div>';
                columnProperties.width = 45;
                columnProperties.enableColumnResizing = true;
                columnProperties.enableColumnMenu = false;
                columnProperties.enableColumnMoving = false;
                columnProperties.enableCellEdit = false;
                columns.push(columnProperties);
                //Initialize column data
                for (var i = 0; i < ($scope.datadefinition.Header.length - 1) ; i++) {
                    var columnProperties = {};
                    columnProperties.name = $scope.datadefinition.Header[i];
                    columnProperties.field = $scope.datadefinition.Keys[i];
                    columnProperties.width = $scope.datadefinition.ColWidth[i];
                    if ($scope.datadefinition.CellTemplate[0] != "None") {
                        if (i < $scope.datadefinition.CellTemplate.length)
                            columnProperties.cellTemplate = $scope.datadefinition.CellTemplate[i];
                    }
                    //format field value
                    columnProperties.cellFilter = $scope.datadefinition.Type[i];
                    if (angular.isDefined($scope.datadefinition.IsEditable)) {
                        if (i < $scope.datadefinition.IsEditable.length)
                            columnProperties.enableCellEdit = $scope.datadefinition.IsEditable[i];
                        else
                            columnProperties.enableCellEdit = false;
                    }
                    else
                        columnProperties.enableCellEdit = false;
                    columns.push(columnProperties);
                }

                $scope.gridOptions = {
                    data: $scope.datadefinition.DataList,
                    columnDefs: columns,
                    rowTemplate: $scope.getTemplate(),
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

            $scope.getTemplate = function () {
                if($scope.datadefinition.RowTemplate == "Default")
                    return $scope.defaultRowTemplate();
                else
                    return $scope.datadefinition.RowTemplate;
            };

            //Default row template of the data grid
            $scope.defaultRowTemplate = function(){
                return '<div>' +
                        ' <div  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ui-grid-cell ng-click="grid.appScope.setSelected(row.entity.Id); grid.appScope.manipulateEditableCell(col);"  context-menu="grid.appScope.setSelected(row.entity.Id)" data-target= "{{grid.appScope.datadefinition.DataTarget}}"></div>' +
                      '</div>';
            };
            //Process Pagination
            $scope.processPagination = function () {
                if ($scope.datadefinition.CurrentPage <= 1)
                    $scope.isPrevPage = false;
                else
                    $scope.isPrevPage = true;

                var rows = $scope.datadefinition.DataList.length;
                if (rows < $scope.pageSize)
                    $scope.isNextPage = false;
                else
                    $scope.isNextPage = true;
            };

            $scope.manipulateEditableCell = function (col) {
                if (col.colDef.enableCellEdit == true)
                    $scope.otheractions({ action: col.displayName });
            }

            //Function that binds ui-grid template during scroll
            $scope.onScroll = function () {
                if ($scope.datadefinition.EnableScroll == true)
                    $scope.datadefinition.Retrieve = true;
                else
                    $scope.datadefinition.Retrieve = false;
            };

            //Load data is for pagination only
            $scope.loadData = function (page) {
                $scope.datadefinition.CurrentPage = page;
                $scope.focusOnTop();
                $scope.datadefinition.Retrieve = true;
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
                switch (action) {
                    case 'Create':
                        $scope.resetdata();
                        break;
                    case 'Edit':
                        $scope.datadefinition.DataItem = $scope.datadefinition.DataList[$scope.selectedIndex];
                        break;
                    case 'Delete':
                        $scope.datadefinition.DataItem = $scope.datadefinition.DataList[$scope.selectedIndex];
                        $scope.submitdefinition.Index = $scope.selectedIndex;
                        break;
                    case 'View':
                        $scope.datadefinition.DataItem = $scope.datadefinition.DataList[$scope.selectedIndex];
                        break;
                }
                return true;
            };

            //Manage user actions
            $scope.actionForm = function (action) {
                //It should be outside of the PreAction statement
                if (action == 'Load') {
                    if ($scope.datadefinition.EnableScroll) {
                        $scope.datadefinition.DataList = [];
                        $scope.onScroll();
                    }
                    if ($scope.datadefinition.EnablePagination) {
                        $scope.loadData($scope.datadefinition.CurrentPage);
                    }
                }
                else {
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
                            default:
                                $scope.otheractions({ action: action });
                                break;
                        }
                        $scope.otheractions({ action: 'PostAction' });
                        $scope.focusOnTop();
                    }
                }
            };

            //Send http post request
            $scope.apiCreate = function () {
                var spinner = new Spinner(opts).spin(spinnerTarget);
                $http.post($scope.submitdefinition.APIUrl, $scope.submitdefinition.DataItem)
                    .success(function (response, status) {
                        if (response.status == "SUCCESS") {
                            $scope.submitdefinition.DataItem = response.objParam1;
                            if ($scope.otheractions({ action: 'PostSave' }))
                            {
                                if ($scope.datadefinition.EnablePagination) {
                                    //reload pagination of datasource is greater than pageSize
                                    if ($scope.datadefinition.DataList.length > $scope.datadefinition.PageSize)
                                        $scope.processPagination();
                                }
                            }
                            spinner.stop();
                            return true;
                        }
                        else {
                            $scope.showformerror({ error: response.message });
                            spinner.stop();
                        }
                    })
                    .error(function (response, status) {
                        $scope.showformerror({ error: status });
                        spinner.stop();
                    })
                return false;
            };

            //Send http put request
            $scope.apiUpdate = function (id) {
                var spinner = new Spinner(opts).spin(spinnerTarget);
                $http.put($scope.submitdefinition.APIUrl + "/" + id, $scope.submitdefinition.DataItem)
                    .success(function (response, status) {
                        if (response.status == "SUCCESS") {
                            $scope.submitdefinition.DataItem = angular.copy(response.objParam1);
                            $scope.submitdefinition.Index = $scope.selectedIndex;
                            spinner.stop();
                            $scope.otheractions({ action: 'PostUpdate' });
                            return true;
                        }
                        else {
                            $scope.showformerror({ error: response.message });
                            spinner.stop();
                        }
                    })
                    .error(function (response, status) {
                        $scope.showformerror({ error: status });
                        spinner.stop();
                    })
                return false;
            };

            //Send http delete request
            $scope.apiDelete = function (id) {
                var spinner = new Spinner(opts).spin(spinnerTarget);
                $http.delete($scope.submitdefinition.APIUrl + "/" + id, $scope.submitdefinition.DataItem)
                    .success(function (response, status) {
                        if (response.status == "SUCCESS") {
                            $scope.submitdefinition.Index = $scope.selectedIndex;
                            $scope.submitdefinition.DataItem = angular.copy(response.objParam1);
                            spinner.stop();
                            $scope.otheractions({ action: 'PostDelete' });
                            return true;
                        }
                        else {
                            $scope.showformerror({ error: response.message });
                            spinner.stop();
                        }
                    })
                    .error(function (response, status) {
                        $scope.showformerror({ error: status });
                        spinner.stop();
                    })
                return false;
            };

            //Function that check required fields
            $scope.checkRequiredFields = function () {
                var key = "", label = "";
                for (var i = 0; i < $scope.datadefinition.RequiredFields.length; i++) {
                    var split = $scope.datadefinition.RequiredFields[i].split("-");
                    key = split[0];
                    //Check if label name exist in a key
                    if (split.length == 2)
                        label = split[1];
                    else {
                        $scope.focusOnTop();
                        $scope.showformerror({ error: "Label name is required for Key: " + key });
                        return false;
                    }

                    if ($scope.submitdefinition.DataItem[key] == null || $scope.submitdefinition.DataItem[key] == "" || $scope.submitdefinition.DataItem[key] < 1) {
                        $scope.focusOnTop();
                        $scope.showformerror({ error: label + " is required." });
                        return false;
                    }
                }
                return true;
            };

            //Manage the submition of data base on the user action
            $scope.submitDataGrid = function (action) {
                $scope.focusOnTop();
                if ($scope.otheractions({ action: 'PreSubmit' })) {
                    if ($scope.checkRequiredFields()) {
                        switch (action) {
                            case 'Create':
                                if ($scope.otheractions({ action: 'PreSave' }))
                                    $scope.apiCreate();
                                break;
                            case 'Edit':
                                if ($scope.otheractions({ action: 'PreUpdate' }))
                                    $scope.apiUpdate($scope.submitdefinition.DataItem.Id)
                                break;
                            case 'Delete':
                                if ($scope.otheractions({ action: 'PreDelete' }))
                                    $scope.apiDelete($scope.submitdefinition.DataItem.Id);
                                break;
                            case 'View':
                                if ($scope.otheractions({ action: 'PreView' })) {
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
                for (var i = 0; i < $scope.datadefinition.ContextMenu.length; i++) {
                    if (i == 0) {
                        htmlScript = '<ul class="dropdown-menu" role="menu"> <li> <a class="pointer small" role="menuitem" tabindex="' + i + '" ' + 'ng-click="actionForm(' + $scope.datadefinition.ContextMenu[i] + ')">'
                                    + $scope.datadefinition.ContextMenuLabel[i] + '</a></li>';
                        htmlScript = htmlScript + '<li class="divider"></li>';
                    }
                    else {
                        htmlScript = htmlScript + '<li> <a class="pointer small" role="menuitem" tabindex="' + i + '" ' + 'ng-click="actionForm(' + $scope.datadefinition.ContextMenu[i] + ')">'
                                    + $scope.datadefinition.ContextMenuLabel[i] + '</a></li>';
                        if (i == 4 && ($scope.datadefinition.ContextMenu.length -1) != i)
                            htmlScript = htmlScript + '<li class="divider"></li>';
                    }
                }
                htmlScript = htmlScript + '</ul>';
                var menu = '#' + $scope.datadefinition.DataTarget;
                $content = angular.element(document.querySelector(menu)).html(htmlScript);
                $scope.flag = $content;
                $compile($content)($scope);
            };

            //Check if at least one column in a row is editable
            $scope.checkIfEditable = function () {
                if (angular.isDefined($scope.datadefinition.IsEditable)) {
                    for (var i = 0; i < $scope.datadefinition.IsEditable.length; i++) {
                        if ($scope.datadefinition.IsEditable[i] == true)
                            return true;
                    }
                    return true;
                }
                else
                    return false;
            }

            //Listener that will check if user Submit an action
            $interval(function () {
                if (angular.isDefined($scope.datadefinition)) {
                    if (!$scope.checkIfEditable())
                        //Update grid data
                        $scope.gridOptions.data = angular.copy($scope.datadefinition.DataList);
                    //Invoke $scope.processPagination();
                    if ($scope.datadefinition.DoPagination) {
                        $scope.datadefinition.DoPagination = false;
                        $scope.processPagination();
                    }

                    //Invoke $scope.submit($scope.submitdefinition.Type);
                    if (angular.isDefined($scope.submitdefinition)) {
                        if ($scope.submitdefinition.Submit) {
                            $scope.submitdefinition.Submit = false;
                            $scope.submitDataGrid($scope.submitdefinition.Type);
                        }
                    }
                    if (angular.isUndefined($scope.flag))
                        $scope.createContextMenu();
                }
            }, 100);

            //Call createContextMenu, actionForm('Load') and processSorting function
            var init = function () {
                $scope.initGridOptions();
            };

            init();
        }
    }
});