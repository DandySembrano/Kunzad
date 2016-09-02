﻿/*---------------------------------------------------------------------------------//
 Directive Name: dirAddress
 Author: Kenneth Ybañez
 Desription: Dynamic filtering directive
---------------------------------------------------------------------------------*/
kunzadApp.directive('dirFiltering', function () {
    return {
        restrict: 'E',
        scope: {
            filterdefinition: '=',      /*
                                            Url         - Contains the API Url for Filter
                                            DataList    - Contains the data filtered from the server
                                            DataItem1   - Contains the data as parameter in filtering data to the server
                                            Source      - Contains the data needed for filtering such as Label, Column, Values and Type
                                                          If Type is Default, include DataType like Integer or String
                                            Multiple    - if filtering can add criteria set it to true, else false
                                            AutoLoad    - true if load data after compiling to DOM
                                            ClearData   - true if reset ui-grid datalist, else false
                                            SetSourceToNull - false by default, for modal
                                        */
            filterlistener: '=',        //listens if search button was clicked
            otheractions: '&'          /*
                                            PreFilterData   - Triggers before searching filtered data
                                            PostFilterData  - Function that will trigger after searching of filtered data
                                        */
        },
        templateUrl: '/Directives/DataFiltering',
        controller: function ($scope, $http, $interval, $filter, $parse, $compile,$localForage, $rootScope) {
            $scope.countFilteredCriteria = 0;
            $scope.criteriaIndex = 0;
            $scope.search = false;
            $scope.retrieving = false;
            $scope.isErrorFiltering = false;
            $scope.errorMessageFiltering = false;
            $scope.unfilteredDataList = [];

            //$scope.fitlerOnChange = function () {
            //    var tempSenderMsg = filterFilter($scope.getchatMsg, { toId: $scope.userId, fromId: $scope.setcontactId });
            //}

            //Set the filter variables default value
            $scope.setFilterVariables = function () {
                $scope.filteredData = { "Definition": $scope.filterdefinition.Source[0] };
                $scope.dropDownValue = null;
                $scope.dropDownValueObject = {};
                $scope.fromDate = $filter('Date')(new Date());
                $scope.toDate = $filter('Date')(new Date());
                $scope.fromSearchValue = "";
                $scope.toSearchValue = "";
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
                $scope.countFilteredCriteria = $scope.countFilteredCriteria + 1;
                $scope.otheractions({ action: $scope.filteredData.Definition.Values[0] });
            };

            //Initialize dropDownValueObject 
            $scope.setSelectedDropDownData = function (id) {
                for (var i = 0; i < $scope.filteredData.Definition.Values.length; i++) {
                    if ($scope.filteredData.Definition.Values[i].Id == id) {
                        $scope.dropDownValueObject = angular.copy($scope.filteredData.Definition.Values[i]);
                        i = $scope.filteredData.Definition.Values.length;
                    }
                }
            };

            //Add criteria to filtered list
            $scope.addToFilteredList = function () {
                if (angular.isDefined($scope.filteredData.Definition)) {
                    $scope.filterdefinition.ClearData = true;
                    var index = $scope.filteredData.Definition.Index;
                    $scope.isErrorFiltering = false;
                    $scope.errorMessageFiltering = false;
                    switch ($scope.filteredData.Definition.Type) {
                        case "Date":
                            var fromDate = document.getElementById('fromDate').value;
                            var toDate = document.getElementById('toDate').value;
                            if (fromDate <= toDate) {
                                $scope.filterdefinition.Source[index].From = fromDate;
                                $scope.filterdefinition.Source[index].To = toDate;
                                $scope.countFilteredCriteria = $scope.countFilteredCriteria + 1;
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
                                $scope.countFilteredCriteria = $scope.countFilteredCriteria + 1;
                            }
                            else {
                                $scope.isErrorFiltering = true;
                                $scope.errorMessageFiltering = $scope.filteredData.Definition.Label + " is required.";
                            }
                            break;
                        case "Modal":
                            if ($scope.filteredData.Definition.To != null) {
                                $scope.filterdefinition.Source[index].From = $scope.filterdefinition.Source[index].Values[1];
                                $scope.countFilteredCriteria = $scope.countFilteredCriteria + 1;
                            } else {
                                $scope.isErrorFiltering = true;
                                $scope.errorMessageFiltering = $scope.filteredData.Definition.Label + " is required.";
                            }
                            break;
                            //Default Type
                        default:
                            if ($scope.fromSearchValue != "") {
                                $scope.filterdefinition.Source[index].From = $scope.fromSearchValue;

                                if ($scope.toSearchValue == "" || $scope.toSearchValue == null)
                                    $scope.toSearchValue = $scope.fromSearchValue;

                                $scope.filterdefinition.Source[index].To = $scope.toSearchValue;
                                $scope.countFilteredCriteria = $scope.countFilteredCriteria + 1;
                            }
                            else {
                                $scope.isErrorFiltering = true;
                                $scope.errorMessageFiltering = $scope.filteredData.Definition.Label + " is required.";
                            }
                            break;
                    }
                }
            };

            $scope.setSourceToNull = function () {
                for (var i = 0; i < $scope.filterdefinition.Source.length; i++) {
                    $scope.filterdefinition.Source[i].From = null;
                    $scope.filterdefinition.Source[i].To = null;
                }
            };

            //Delete criteria to filtered list
            $scope.deleteFilteredData = function (index) {
                $scope.filterdefinition.Source[index].From = null;
                $scope.filterdefinition.Source[index].To = null;
                $scope.criteriaIndex = $scope.filterdefinition.Source[index].Index;
                $scope.setFilteredDataDefinition($scope.criteriaIndex);
                $scope.countFilteredCriteria = $scope.countFilteredCriteria - 1;
            };

            //check if there is/are filtered data
            $scope.validateFileteredData = function () {
                for (var i = 0; i < $scope.filterdefinition.Source.length; i++) {
                    if ($scope.filterdefinition.Source[i].From != null)
                        return true;
                }
                return false;
            }

            //Triggers when user click search button
            $scope.submitFilteredData = function () {
                if ($scope.validateFileteredData() || $scope.filterdefinition.Multiple == false) {
                    var spinner = new Spinner(opts).spin(spinnerTarget);
                    $scope.retrieving = true;
                    //If submitFilteredData function is called via clicking the search button then reset the DataList
                    if ($scope.search == true) {
                        $scope.search = false;
                        $scope.filterdefinition.ClearData = true;

                        if ($scope.filterdefinition.Multiple == false) {
                            $scope.setSourceToNull();
                            $scope.addToFilteredList();
                        }
                    }

                    if ($scope.filterdefinition.SetSourceToNull == true) {
                        $scope.filterdefinition.SetSourceToNull = false;
                        $scope.setSourceToNull();
                        $scope.setFilterVariables();
                    }

                    if ($scope.otheractions({ action: 'PreFilterData' })) {
                        $scope.url = $scope.filterdefinition.Url;
                        var dataModel1 = $scope.filterdefinition.DataItem1;

                        var eTagId = null;
                        var etagKey = null;

                        $localForage.iterate(function (value, key) {
                            if (key.indexOf($scope.url) > -1) { //if request is already on localforeage get the etag
                                eTagId = key.substring(key.indexOf("+") + 1, key.length);
                                etagKey = key;
                            }
                        }).then(function (data) {
                            $localForage.getItem("Token").then(function (token) {
                                if (eTagId == null) {
                                    eTagId = "dummy"
                                }

                                $.ajax($scope.url, {
                                    type: "GET",
                                    beforeSend: function (request) {
                                        request.setRequestHeader("If-None-Match", eTagId);
                                        request.setRequestHeader("Token", token.toString());
                                        //$localForage.getItem("Token").then(function (value) {
                                        //    request.setRequestHeader("Token", value.toString());
                                        //});
                                    },
                                    data: dataModel1,
                                    success: function (result, status, xhr) {
                                        if (xhr.readyState == 4) {
                                            if (status == 'success') { //200
                                                if (etagKey != null) {
                                                    //remove first existing just in case it is expire on server
                                                    $localForage.removeItem(etagKey);
                                                }
                                                var newETagId = xhr.getResponseHeader("ETag");
                                                $localForage.setItem($scope.url + "+" + newETagId, xhr.responseText);
                                                $scope.filterdefinition.DataList = angular.copy(xhr.responseJSON)
                                                $scope.forceScroll();
                                                $scope.retrieving = false;
                                                $scope.filterdefinition.ClearData = false;
                                                $scope.otheractions({ action: 'PostFilterData' })
                                                spinner.stop();
                                            } else if (status == 'notmodified') { //304
                                                $localForage.getItem(etagKey).then(function (data) {
                                                    var objData = undefined;
                                                    objData = JSON.parse(data);
                                                    $scope.filterdefinition.DataList = angular.copy(objData);
                                                    $scope.forceScroll();
                                                    $scope.retrieving = false;
                                                    $scope.filterdefinition.ClearData = false;
                                                    $scope.otheractions({ action: 'PostFilterData' })
                                                    spinner.stop();
                                                });
                                            }
                                            eTagId = null
                                            etagKey = null
                                        }
                                    },
                                    error: function (xhr) {
                                        $scope.isErrorFiltering = true;
                                        $scope.errorMessageFiltering = xhr.status;
                                        spinner.stop();
                                    }
                                });
                            });
                        });

                    }
                    else {
                        $scope.filterdefinition.ClearData = false;
                        spinner.stop();
                    }
                }
                else {
                    $scope.isErrorFiltering = true;
                    $scope.errorMessageFiltering = "Please select criteria for filtering.";
                }
            }

            //function that will force scroll the datagrid
            $scope.forceScroll = function () {
                $(document).ready(function () {
                    var element = $("div.ui-grid-viewport")[0];
                    var element1 = $("div.ui-grid-viewport");
                    if (element.scrollTop != 0) {
                        var promise = $interval(function () {
                            element1.scrollTop(element.scrollTop + 10);
                            $interval.cancel(promise);
                            promise = undefined;
                        }, 100)
                    }
                });
            };

            //Disable user from typing
            $('#fromDate,#toDate,#modal').keypress(function (key) {
                return false;
            });

            if ($scope.filterdefinition.AutoLoad == true) {
                $scope.filterdefinition.SetSourceToNull = false;
                $scope.submitFilteredData();
            }

            //Listener that will check of user's action
            var dataFilteringListener = $interval(function () {
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

            $scope.dataFilteringListener = function () {
                $interval.cancel(dataFilteringListener);
                dataFilteringListener = undefined;
            };

            $scope.$on('$destroy', function () {
                $scope.dataFilteringListener();
            });
        }
    };
});