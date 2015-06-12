// app.js

var kunzadApp = angular.module('kunzadApp', ['ngRoute', 'ng-context-menu', 'ui.bootstrap']);
 
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
     6. Formatting of Date/Time,DateTime, String and Number
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
                                            Keys        - Columns/Keys to be showin in DataGrid
                                            Type        - Type of the Columns/Keys(String,Date,DateTime,Time)
                                            DataList    - Contains the List of data to be displayed in DataGrid
                                            APIUrl      - Contains the API Url, first index is for Get then second index is for CUD,
                                                          If Get url parameter is more than one, separate it by using space.
                                                          (Ex. /api/Truck?page=1 &truckerId=1&truckerName=2&......)
                                            DataItem    - Contains the data of the selected item in DataGrid List
                                            DataTarget  - Contains the data target for the context-menu
                                            ViewOnly    - Determine if the fields of the selected item are editable or not
                                            ContextMenu - Actions to be passed in each context menu item
                                            ContextMenuLabel - Lable for each context menu item
                                        */
            submitbuttontext: '=',      //scope that holds the submit button label
            submitbuttonlistener: '=',  //scope that will serve as listener that will identify if the user submit an action  
            closecontainer: '&',        //function that will close the modal
            opencontainer: '&',         //function that will open the modal
            otheractions: '&',          /*
                                            Note: Return true if purpose is to overload, false if override(Same concept to overload),
                                            function that will trigger when other actions is passed 
                                            other than Create,View,Delete,Edit and Export in context-menu

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
                                            PreAction           - triggers before executing the actions in actionForm function
                                            PostAction          - triggers after executing the actions in actionForm function
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
            $scope.currentPage = 1;
            $scope.pageSize = 20;
            $scope.isPrevPage = false;
            $scope.isNextPage = false;
            $scope.sortByDesc = true;
            $scope.sortByAsc = false;
            $scope.criteria = $scope.datadefinition.Keys[0];
            $scope.selectedIndex = null;
            $scope.filteredValue = "";

            //Export data to Excel or word
            function fnExcelReport(type) {
                var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
                var textRange; var j = 0;
                tab = document.getElementById('export'); // id of table


                for (j = 0 ; j < tab.rows.length ; j++) {
                    tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
                    //tab_text=tab_text+"</tr>";
                }

                tab_text = tab_text + "</table>";
                tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
                tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
                tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

                var ua = window.navigator.userAgent;
                var firefox = navigator.userAgent.search("Firefox");
                var msie = ua.indexOf("MSIE ");

                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
                {
                    exportTemplate.document.open("txt/html", "replace");
                    exportTemplate.document.write(tab_text);
                    exportTemplate.document.close();
                    exportTemplate.focus();
                    if (type == 'doc')
                        sa = exportTemplate.document.execCommand("SaveAs", true, "Report.doc");
                    else if(type == 'excel')
                        sa = exportTemplate.document.execCommand("SaveAs", true, "Report.xls");
                }
                else                 //other browser not tested on IE 11
                {
                    if(type == 'doc')
                        sa = window.open('data:application/vnd.ms-doc,' + encodeURIComponent(tab_text));
                    else if (type == 'excel')
                        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                }
                if (firefox > -1 && type == 'png')
                    return $scope.$broadcast('export-png', {});
                else if (firefox <= -1 && type == 'png') {
                    alert('Not supported in this browser.');
                    return;
                }

                return (sa);
            }

            //Function that format a string value to camelCase
            $scope.camelCase = function (input) {
                var words = input.split(' ');
                for (var i = 0; i < words.length; i++) {
                    words[i] = words[i].toLowerCase(); // lowercase everything to get rid of weird casing issues
                    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
                }
                return words.join(' ');
            };

            $scope.UpperCase = function (input) {
                var value = input.toUpperCase();
                return value;
            };

            $scope.filterHeader = function (input) {
                var value = input.split("_");
                var finalValue = "";
                if (value.length > 1) {
                    for (var i = 0; i < value.length; i++)
                        finalValue = finalValue + " " + value[i];
                }
                else
                    finalValue = input;
                return finalValue;
            };

            //Function that format value
            $scope.filterValue = function (value, index) {
                var type = $scope.datadefinition.Type[index];
                if (value == null)
                    $scope.filteredValue = "";
                else {
                    switch (type) {
                        case 'String':
                            $scope.filteredValue = $scope.camelCase(value);
                            break;
                        case 'String-Upper':
                            $scope.filteredValue = $scope.UpperCase(value);
                            break;
                        case 'DateTime':
                            $scope.filteredValue = $filter('date')(value, "MM/dd/yyyy HH:mm:ss");
                            break;
                        case 'Date':
                            $scope.filteredValue = $filter('date')(value, "MM/dd/yyyy");
                            break;
                        case 'Time':
                            $scope.filteredValue = $filter('date')(value, "HH:mm:ss");
                            break;
                        case 'Number':
                            $scope.filteredValue = value;
                            break;
                        case 'Boolean':
                            if (value)
                                $scope.filteredValue = "Yes";
                            else
                                $scope.filteredValue = "No";
                            break;
                        default:
                            $scope.filteredValue = value;
                    }
                }
                return $scope.filteredValue;
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
                        $scope.otheractions({ action: 'PostLoadAction' });
                        $scope.otheractions({ action: 'PostAction' });
                        if ($scope.currentPage <= 1)
                            $scope.isPrevPage = false;
                         else 
                            $scope.isPrevPage = true;
                        
                        var rows = $scope.datadefinition.DataList.length;
                        if (rows < $scope.pageSize)
                            $scope.isNextPage = false;
                        else
                            $scope.isNextPage = true;
                        spinner.stop();
                    })
                    .error(function (data, status) {
                        spinner.stop();
                        $scope.showformerror({ error: status });
                    })
            };

            //Process Sorting
            $scope.processSorting = function (criteria) {
                //Ascending
                if ($scope.sortByDesc == true) {
                    $scope.sortByAsc = true;
                    $scope.sortByDesc = false;
                    criteria = criteria;
                }
                    //Descending
                else {
                    $scope.sortByAsc = false;
                    $scope.sortByDesc = true;
                    criteria = '-' + criteria;
                }
                $scope.criteria = criteria;
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
                //It should be outside of the switch statement
                if (action == 'Load')
                {
                    if ($scope.otheractions({ action: 'PreLoadAction' }))
                        $scope.loadData($scope.currentPage)
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
                            $scope.datadefinition.DataList.push($scope.datadefinition.DataItem);
                            //reload pagination of datasource is greater than pageSize
                            if ($scope.datadefinition.DataList.length > $scope.pageSize) {
                                //$scope.currentPage = $scope.currentPage + 1;
                                $scope.loadData($scope.currentPage);
                            }
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

            $scope.checkRequiredFields = function () {
                var key = "", label = "";
                for (var i = 0; i < $scope.datadefinition.RequiredFields.length; i++)
                {
                    var split = $scope.datadefinition.RequiredFields[i].split("-");
                    key = split[0];
                    if ($scope.searchKey(key) == false) {
                        $scope.showformerror({ error: key + " is undefined." });
                        return false;
                    }
                    else {
                        if (split.length == 2)
                            label = split[1];
                        else
                        {
                            $scope.showformerror({ error: "Label name is required for Key: " + key});
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

                for (var i = 0; i < $scope.datadefinition.ContextMenu.length; i++) {
                    if(i == 0)
                    {
                        htmlScript = '<li> <a class="pointer small" role="menuitem" tabindex="' + i + '" ' + 'ng-click="actionForm(' + $scope.datadefinition.ContextMenu[i] + ')">'
                                    + $scope.datadefinition.ContextMenuLabel[i] + '</a></li>';
                        htmlScript = htmlScript + '<li class="divider"></li>';
                    }
                    else {
                        htmlScript = htmlScript + '<li> <a class="pointer small" role="menuitem" tabindex="' + i + '" ' + 'ng-click="actionForm(' + $scope.datadefinition.ContextMenu[i] + ')">'
                                    + $scope.datadefinition.ContextMenuLabel[i] + '</a></li>';
                        if (i == 4)
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
                if ($scope.actioncreate == true)
                {
                    $scope.actioncreate = false;
                    $scope.actionForm('Create');
                }
            }, 100);

            var init = function () {
                $scope.createContextMenu();
                $scope.actionForm('Load');
                $scope.processSorting($scope.criteria);
            };

            init();
        }
    }
});

kunzadApp.directive('dirExport', function () {
    return {
        restrict: 'C',
        link: function($scope, elm, attr){
            $scope.$on('export-excel', function(e, d){
                elm.tableExport({type:'excel', escape:'false'});
            });

            $scope.$on('export-doc', function(e, d){
                elm.tableExport({type: 'doc', escape:'false'});
            });

            $scope.$on('export-png', function (e, d) {
                elm.tableExport({ type: 'png', escape: 'false' });
            });
        }
    }
});


    kunzadApp.config(['$routeProvider', function ($routeProvider) {
        //Setup routes to load partial templates from server. TemplateUrl is the location for the server view (Razor .cshtml view)
        $routeProvider

            .when('/home', {
                templateUrl: '/Home/_Main'
            })

            .when('/customers', {
                templateUrl: '/References/Customers',
                controller: 'CustomerController'
            })

            .when('/customergroups', {
                templateUrl: '/References/CustomerGroups',
                controller: 'CustomerGroupController'
            })

            .when('/airlines', {
                templateUrl: '/References/Airlines',
                controller: 'AirlineController'
            })

            .when('/courier', {
                templateUrl: '/References/Courier',
                controller: 'CourierController'
            })

            .when('/truckers', {
                templateUrl: '/References/Truckers',
                controller: 'TruckerController'
            })

            .when('/trucktype', {
                templateUrl: '/References/TruckType',
                controller: 'TruckTypeController'
            })

            .when('/industry', {
                templateUrl: '/References/Industry',
                controller: 'IndustryController'
            })

            .when('/businessunittype', {
                templateUrl: '/References/BusinessUnitType',
                controller: 'BusinessUnitTypeController'
            })

            .when('/shipmenttype', {
                templateUrl: '/References/ShipmentType',
                controller: 'ShipmentTypeController'
            })
    
            .when('/servicecategory', {
                templateUrl: '/References/ServiceCategory',
                controller: 'ServiceCategoryController'
            })

            .when('/contactnotype', {
                templateUrl: '/References/ContactnoType',
                controller: 'ContactnoTypeController'
            })

            .when('/driver', {
                templateUrl: '/References/Driver',
                controller: 'DriverController'
            })

            .when('/country', {
                templateUrl: '/References/Country',
                controller: 'CountryController'
            })

            .when('/shippinglines', {
                templateUrl: '/References/ShippingLines',
                controller: 'ShippingLinesController'
            })

            .when('/businessunit', {
                templateUrl: '/References/BusinessUnit',
                controller: 'BusinessUnitController'
            })

            .when('/serviceablearea', {
                templateUrl: '/References/ServiceableArea',
                controller: 'ServiceableAreaController'
            })

            .otherwise({
                redirectTo: '/home'
            });
    }])

        .controller('RootController', ['$rootScope', '$scope', '$route', '$routeParams', '$location', '$http',
            function ($rootScope, $scope, $route, $routeParams, $location, $http) {

                $scope.$on('$routeChangeSuccess', function (e, current, previous) {
                    $scope.activeViewPath = $location.path();
                });

                // Temporary - support one country only (Philippines)
                $rootScope.country = {
                    "Id": 1,
                    "Name": "Philippines",
                }
            
                var cityMunicipalities = [];
                $rootScope.getCityMunicipalities = function () {
                    return cityMunicipalities;
                }

                // Get List of CityMunicipalities
                var getCityMunicipalitiesFromApi = function () {
                    //alert("get");
                    $http.get("/api/CityMunicipalities?countryId=" + $rootScope.country.Id)
                        .success(function (data, status) {
                            cityMunicipalities = data;
                        })
                        .error(function (data, status) {
                        });
                }

                function init() {
                    getCityMunicipalitiesFromApi();
                }

                init();

            }]);


    // -------------------------------------------------------------------------//
    // Open Modal Panel - Use in DataTable //
    function openModalPanel (panelName) {
        //Open Modal Form/Panel
        jQuery.magnificPopup.open({
            removalDelay: 500, //delay removal by X to allow out-animation,
            items: { src: panelName },
            callbacks: {
                beforeOpen: function (e) {
                    var Animation = "mfp-flipInY";
                    this.st.mainClass = Animation;
                },
                afterClose: function () {
                }
            },
            midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
        })
    }


    // -------------------------------------------------------------------------//
    // Usage for spin.js
    var opts = {
        lines: 11, // The number of lines to draw
        length: 11, // The length of each line
        width: 4, // The line thickness
        radius: 11, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 46, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };
    var spinnerTarget = document.getElementById('spinnerTarget');
