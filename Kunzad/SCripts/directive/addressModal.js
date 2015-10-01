kunzadApp.directive('dirAddress', function () {
    return {
        restrict: 'E',
        scope: {
            datadefinition: "=", /*
                                    ModalId
                                    DataItem - Address object
                                    ViewOnly
                                    ActionMode
                                    Header
                                    Container
                                */
            showmodal: "=",
            otheractions: "&"
        },
        templateUrl: '/Directives/AddressModal',
        controller: function ($scope, $interval, $rootScope) {
            $scope.initDataItem = function () {
                $scope.datadefinition.DataItem = {
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
                }
            };

            //Validate Address Item
            $scope.validateAddressItem = function (addressItem) {
                if (addressItem.Line1 == null || addressItem.Line1 == " ") {
                    $scope.isErrorAddress = true;
                    $scope.errorMessageAddress = "Street address line 1 is required.";
                    return false;
                }
                else if (addressItem.CityMunicipalityId == null) {
                    $scope.isErrorAddress = true;
                    $scope.errorMessageAddress = "City/Municipality required.";
                    return false;
                }
                else if (addressItem.PostalCode == null) {
                    $scope.isErrorAddress = true;
                    $scope.errorMessageAddress = "Postal Code required.";
                    return false;
                }
                else
                    return true;
            };

            //Close Address form
            $scope.closeAddressForm = function (addressItem) {
                if ($scope.validateAddressItem(addressItem)) {
                    $scope.isErrorAddress = false;
                    $scope.errorMessageAddress = "";
                    $scope.datadefinition.Container = $scope.initializeAddressField(addressItem);
                    $scope.otheractions({ action: 'PostClose' });
                    jQuery.magnificPopup.close();
                }
            }

            $scope.initializeAddressField = function (addressItem) {
                $scope.formattedAddress = addressItem.Line1 + (addressItem.Line2 == "" || addressItem.Line2 == null ? " " : ", " + addressItem.Line2) + "\n";
                $scope.formattedAddress += addressItem.CityMunicipality.Name + ", " + (addressItem.CityMunicipality.StateProvince == null ? "" : addressItem.CityMunicipality.StateProvince.Name + "\n");
                $scope.formattedAddress += $scope.country.Name + ", " + addressItem.PostalCode;
                return $scope.formattedAddress;
            };

            //---------------------------Code if using typeahead in city/municipality-------------------
            //Get cityMunicipalities
            var promise = $interval(function () {
                if ($scope.cityMunicipalities != null) {
                    $interval.cancel(promise);
                    promise = undefined;
                }

                $scope.country = $rootScope.country;
                $scope.cityMunicipalities = $rootScope.getCityMunicipalities();
            }, 100);

            $scope.onSelectCity = function ($item, $model, $label) {
                $scope.datadefinition.DataItem.CityMunicipalityId = $item.Id;
                $scope.datadefinition.DataItem.CityMunicipality.Name = $item.Name;
                if ($scope.datadefinition.DataItem.CityMunicipality.StateProvince != null)
                    $scope.datadefinition.DataItem.CityMunicipality.StateProvince.Name = $item.StateProvinceName;
            };
            //---------------------------End of typeahead-----------------------------------------------

            $scope.initDataItem();
            $interval(function () {
                if ($scope.showmodal) {
                    $scope.showmodal = false;
                    $scope.initDataItem();
                    $scope.otheractions({ action: 'PreOpen' });
                    openModalPanel("#" + $scope.datadefinition.ModalId);
                }
            }, 100)
        }
    }
});