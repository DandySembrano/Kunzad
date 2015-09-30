kunzadApp.directive('dirFiltering', function () {
    return {
        restrict: 'E',
        scope: {
            filterdefinition: '=',      /*
                                            Url         - Contains the API Url for Filter
                                            DataList    - Contains the data filtered from the server
                                            DataItem1   - Contains the data as parameter in filtering data to the server
                                            DataItem2   - Contains the data as parameter in filtering data to the server
                                            Source      - Contains the data needed for filtering such as Label, Column, Values and Type
                                                          If Type is Default, include DataType like Integer or String
                                            Multiple    - if filtering can add criteria set it to true, else false
                                            AutoLoad    - true if load data after compiling to DOM
                                            ClearData   - true if reset ui-grid datalist, else false
                                        */
            filterlistener: '=',        //listens if search button was clicked
            otheractions: '&'          /*
                                            PreFilterData   - Triggers before searching filtered data
                                            PostFilterData  - Function that will trigger after searching of filtered data
                                        */
        },
        templateUrl: '/Directives/DataFiltering',
        controller: function ($scope, $http, $interval, $filter, $parse, $compile) {
            $scope.countFilteredCriteria = 0;
            $scope.criteriaIndex = 0;
            $scope.search = false;
            $scope.retrieving = false;
            $scope.isErrorFiltering = false;
            $scope.errorMessageFiltering = false;
            $scope.lastSelectedCriteriaIndex = 0;
            //Set the filter variables default value
            $scope.setFilterVariables = function () {
                $scope.filteredData = { "Definition": $scope.filterdefinition.Source[0] };
                $scope.dropDownValue = null;
                $scope.dropDownValueObject = {};
                $scope.fromDate = $filter('Date')(new Date());
                $scope.toDate = $filter('Date')(new Date());
                $scope.searchValue = "";
                $scope.showFilterDate = false;
                $scope.showFilterDropDown = false;
                $scope.showFilterText = true;
            };

            //Set filteredData Definition
            $scope.setFilteredDataDefinition = function (index) {
                $scope.filteredData.Definition = $scope.filterdefinition.Source[index];
            };

            //triggers the function that will set the filter variables default value
            $scope.setFilterVariables();

            //Function that will call Modal for filtering
            $scope.showModalFilter = function () {
                $scope.otheractions({ action: $scope.filteredData.Definition.Values[0] });
            };

            //Initialize dropDownValueObject 
            $scope.setSelectedDropDownData = function (id) {
                for (var i = 0; i < $scope.filteredData.Definition.Values.length; i++) {
                    if ($scope.filteredData.Definition.Values[i].Id == id)
                    {
                        $scope.dropDownValueObject = angular.copy($scope.filteredData.Definition.Values[i]);
                        i = $scope.filteredData.Definition.Values.length;
                    }
                }
            };

            //Add criteria to filtered list
            $scope.addToFilteredList = function () {
                if (angular.isDefined($scope.filteredData.Definition)) {
                    $scope.filterdefinition.ClearData = true;
                    if ($scope.filterdefinition.Multiple == false && $scope.countFilteredCriteria > 0) {
                        $scope.filterdefinition.Source[$scope.lastSelectedCriteriaIndex].From = null;
                        $scope.filterdefinition.Source[$scope.lastSelectedCriteriaIndex].To = null;
                    }
                    var index = $scope.filteredData.Definition.Index;
                    $scope.lastSelectedCriteriaIndex = index;
                    $scope.isErrorFiltering = false;
                    $scope.errorMessageFiltering = false;
                    switch ($scope.filteredData.Definition.Type) {
                        case "Date":
                            var fromDate = document.getElementById('fromDate').value;
                            var toDate = document.getElementById('toDate').value;
                            if (fromDate <= toDate) {
                                $scope.filterdefinition.Source[index].From = fromDate;
                                $scope.filterdefinition.Source[index].To = toDate;
                                $scope.countFilteredCriteria++;
                                $scope.fromDate = $filter('Date')(new Date());
                                $scope.toDate = $filter('Date')(new Date());
                                $scope.filteredData.Definition = undefined;
                            }
                            else {
                                $scope.isErrorFiltering = true;
                                $scope.errorMessageFiltering = "From " + $scope.filteredData.Definition.Label + "must be less than or equal to To " + $scope.filteredData.Definition.Label;
                            }
                            break;
                        case "DropDown":
                            if ($scope.dropDownValue != null) {
                                $scope.filterdefinition.Source[index].From = $scope.dropDownValueObject.Id;
                                $scope.filterdefinition.Source[index].To = $scope.dropDownValueObject.Name;
                                $scope.countFilteredCriteria++;
                                $scope.dropDownValue = "";
                                $scope.filteredData.Definition = undefined;
                            }
                            else {
                                $scope.isErrorFiltering = true;
                                $scope.errorMessageFiltering = $scope.filteredData.Definition.Name + " is required.";
                            }
                            break;
                        case "Modal":
                            if ($scope.filteredData.Definition.To != null) {
                                $scope.filterdefinition.Source[index].From = $scope.filterdefinition.Source[index].Values[1];
                                $scope.countFilteredCriteria++;
                                $scope.filteredData.Definition = undefined;
                            } else {
                                $scope.isErrorFiltering = true;
                                $scope.errorMessageFiltering = $scope.filteredData.Definition.Label + " is required.";
                            }
                            break;
                            //Default Type
                        default:
                            if ($scope.searchValue != "") {
                                $scope.filterdefinition.Source[index].From = $scope.searchValue;
                                $scope.countFilteredCriteria++;
                                $scope.searchValue = "";
                                $scope.filteredData.Definition = undefined;
                            }
                            else {
                                $scope.isErrorFiltering = true;
                                $scope.errorMessageFiltering = $scope.filteredData.Definition.Label + " is required.";
                            }
                            break;
                    }
                }
            };

            //Delete criteria to filtered list
            $scope.deleteFilteredData = function (index) {
                $scope.filterdefinition.Source[index].From = null;
                $scope.filterdefinition.Source[index].To = null;
                $scope.criteriaIndex = $scope.filterdefinition.Source[index].Index;
                $scope.setFilteredDataDefinition($scope.criteriaIndex);
                $scope.countFilteredCriteria--;
            };

            //Triggers when user click search button
            $scope.submitFilteredData = function () {
                var spinner = new Spinner(opts).spin(spinnerTarget);
                $scope.retrieving = true;
                //If submitFilteredData function is called via clicking the search button then reset the DataList
                if ($scope.search == true) {
                    $scope.search = false;
                    $scope.filterdefinition.ClearData = true;
                }
                if ($scope.otheractions({ action: 'PreFilterData' })) {
                    $scope.url = $scope.filterdefinition.Url;
                    $scope.parameter = [];
                    var dataModel1 = $scope.filterdefinition.DataItem1;
                    var dataModel2 = $scope.filterdefinition.DataItem2;
                    //Delete Keys that are null except Id if autoload is true
                    for (var i = ($scope.filterdefinition.AutoLoad == true ? 1 : 0) ; i < $scope.filterdefinition.Source.length; i++) {
                        if ($scope.filterdefinition.DataItem1[$scope.filterdefinition.Source[i].Column] == null) {
                            delete dataModel1[$scope.filterdefinition.Source[i].Column];
                            delete dataModel2[$scope.filterdefinition.Source[i].Column];
                        }
                    }
                    $scope.parameter.push(dataModel1);
                    $scope.parameter.push(dataModel2);
                    //Send http request to server
                    $http.put($scope.url, $scope.parameter)
                    .success(function (data, status) {
                        $scope.filterdefinition.DataList = angular.copy(data);
                        $scope.otheractions({ action: 'PostFilterData' });
                        $scope.retrieving = false;
                        $scope.filterdefinition.ClearData = false;
                        spinner.stop();
                    })
                    .error(function (err, status) {
                        $scope.retrieving = false;
                        $scope.filterdefinition.ClearData = false;
                        $scope.isErrorFiltering = true;
                        $scope.errorMessageFiltering = status
                        spinner.stop();
                    })
                }
                else {
                    $scope.filterdefinition.ClearData = false;
                    spinner.stop();
                }
            }

            //Disable user from typing
            $('#fromDate,#toDate,#modal').keypress(function (key) {
                return false;
            });

            if ($scope.filterdefinition.AutoLoad == true) {
                $scope.filterdefinition.DataItem1.Id = 0;
                $scope.submitFilteredData();
            }

            //Listener that will check of user's action
            $interval(function () {
                var width = window.innerWidth;

                //Check if directive request for filtering and status is not retrieving
                if ($scope.filterlistener == true && $scope.retrieving == false) {
                    $scope.filterlistener = false;
                    $scope.submitFilteredData();
                }

                if (width < 1030) {
                    $scope.criteriaStyle = "";
                    $scope.searchValueStyle = "";
                    $scope.searchDateTimeStyle = "";
                    $scope.searchStyle = "";
                    $scope.addCriteriaStyle = "padding-bottom: 10px;";
                    $scope.filterContainerStyle = "";
                }
                else {
                    $scope.criteriaStyle = "width: 250px;";
                    $scope.searchValueStyle = "width: 450px; padding-left:10px;";
                    $scope.searchDateTimeStyle = "width: 225px; padding-left:10px;";
                    $scope.searchStyle = "width:100px;padding-left:10px; padding-top:35px;";
                    $scope.addCriteriaStyle = "width:120px;padding-left:10px; padding-top:35px;";
                    $scope.filterContainerStyle = "padding-left:10px;";
                }
            }, 100);
        }
    };
});