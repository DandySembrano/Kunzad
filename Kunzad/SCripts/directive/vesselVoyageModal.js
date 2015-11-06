/*---------------------------------------------------------------------------------//
 Directive Name: dirVesselVoyage
 Author: Rey P. Castanares
 Date: November 5, 2015
 Desription: Used if module needs Vessel Voyage information
---------------------------------------------------------------------------------*/
kunzadApp.directive('dirVesselVoyage', function () {
    return {
        restrict: 'E',
        scope: {
            datadefinition: "=", /*
                                    ModalId  - Id for the modal that will be used for showing the address modal
                                    DataItem - Address object
                                    ViewOnly
                                    ActionMode- Used 
                                    Header    - Header of the address modal
                                    Container - Contains the formatted address
                                */
            showmodal: "=",
            otheractions: "&"
        },
        templateUrl: '/Directives/VesselVoyageModal',
        controller: function ($scope, $interval, $rootScope) {
            $scope.initDataItem = function () {
                $scope.datadefinition.DataItem = {
                    "Id": null,
                    "VesselId": null,
                    "VoyageNo": null,
                    "EstimatedDepartureDate": null,
                    "EstimatedDepartureTime": null,
                    "EstimatedArrivalDate": null,
                    "EstimatedArrivalTime": null,
                    "OriginBusinessUnitId": null,
                    "Origin": [{
                        "Id": null,
                        "Name": null
                    }],
                    "DestinationBusinessUnitId": null,
                    "Destination": [{
                        "Id": null,
                        "Name": null
                    }],
                    "DepartureDate": null,
                    "DepartureTime": null,
                    "ArrivalDate": null,
                    "ArrivalTime": null,
                    "LastUpdatedDate": null,
                    "LastUpdatedByUserId": null
                }
            };

            //Close Vessel Voyage form
            $scope.closeVesselVoyageForm = function (vesselItem) {
                $scope.datadefinition.DataItem.DepartureDate = $('#voyage_deptDate').val();
                $scope.datadefinition.DataItem.DepartureTime = $('#voyage_deptTime').val();
                $scope.datadefinition.DataItem.ArrivalDate = $('#voyage_arrDate').val();
                $scope.datadefinition.DataItem.ArrivalTime = $('#voyage_arrTime').val();

                $scope.otheractions({ action: 'PostClose' });
                jQuery.magnificPopup.close();
            }

            $scope.initDataItem();
            var showvvModalWatcher = $scope.$watch(function () {
                return $scope.showmodal;
            }, function () {
                if ($scope.showmodal === true) {
                    $scope.showmodal = false;
                    $scope.initDataItem();
                    $scope.otheractions({ action: 'PreOpen' });
                    openModalPanel("#" + $scope.datadefinition.ModalId);
                }
            });
            var deregistershowvvModalWatcher = function () {
                showvvModalWatcher();
            }
            $scope.$on('$destroy', function () {
                deregistershowvvModalWatcher();
            });
        }
    }
});