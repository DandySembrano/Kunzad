//-----------------------------------------------------------------------------//
// Filename: customergroup.js
// Description: Controller for CustomerGroup
// Author: Dandy Sembrano
//-----------------------------------------------------------------------------//

kunzadApp.controller("CustomerGroupController", function ($scope, $http) {

    $scope.modelName = "Customer Group";
    $scope.customerGroups = [];
    $scope.customerGroup;
    $scope.isPrevPage = false;
    $scope.isNextPage = false;
    $scope.actionMode = "Create";
    $scope.selected = null;
    $scope.currentPage = 1;
    $scope.viewOnly = true;

    // Get Customer Group List
    $http.get("/api/CustomerGroups")
        .success(function (data, status) {
            $scope.customerGroups = data;
        })
        .error(function (data, status) {
        })

    // Create/Insert New
    $scope.apiCreate = function () {
        $http.post("/api/CustomerGroups", $scope.customerGroup)
            .success(function (data, status) {
                $scope.customerGroups.push($scope.customerGroup);
            })
            .error(function (data, status) {
            })
    }

    // Update
    $scope.apiUpdate = function (id) {
        $http.put("/api/CustomerGroups/" + id, $scope.customerGroup)
            .success(function (data, status) {
            })
            .error(function (data, status) {
            })
    }

    // Delete
    $scope.apiDelete = function (id) {
        $http.delete("/api/CustomerGroups/" + id)
            .success(function (data, status) {
                $scope.customerGroups.splice($scope.selected, 1);
            })
            .error(function (data, status) {
            })
    }

    $scope.setSelected = function (i) {
        $scope.selected = i;
    }

    $scope.actionForm = function (action) {
        $scope.actionMode = action;
        switch ($scope.actionMode) {
            case "Create":
                $scope.customerGroup = {
                    "Name": "",
                    "Remarks": ""
                }
                $scope.viewOnly = false;
                $scope.openModalForm();
                break;
            case "Edit":
                $scope.customerGroup = $scope.customerGroups[$scope.selected]
                $scope.viewOnly = false;
                $scope.openModalForm();
                break;
            case "Delete":
                $scope.customerGroup = $scope.customerGroups[$scope.selected]
                $scope.viewOnly = true;
                $scope.openModalForm();
                break;
            case "View":
                $scope.customerGroup = $scope.customerGroups[$scope.selected]
                $scope.viewOnly = true;
                $scope.openModalForm();
                break;
        }
    }

    $scope.openModalForm = function () {
        //Open Modal Form/Panel
        jQuery.magnificPopup.open({
            removalDelay: 500, //delay removal by X to allow out-animation,
            items: { src: "#modal-panel" },
            callbacks: {
                beforeOpen: function (e) {
                    var Animation = "mfp-flipInY";
                    this.st.mainClass = Animation;
                }
            },
            midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
        })
    }

    $scope.submit = function () {
        switch ($scope.actionMode) {
            case "Create":
                $scope.apiCreate();
                break;
            case "Edit":
                $scope.apiUpdate($scope.customerGroup.Id);
                break;
            case "Delete":
                $scope.apiDelete($scope.customerGroup.Id);
                break;
        }
        jQuery.magnificPopup.close()
    }

});
