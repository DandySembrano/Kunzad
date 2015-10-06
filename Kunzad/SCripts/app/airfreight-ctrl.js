
kunzadApp.controller("AirFreightsController", AirFreightsController);
function AirFreightsController($scope, $http, $interval, $filter, $rootScope) {
    $scope.modelName = "Air Freight";
    $scope.modelhref = "#/airfreight";
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
    $scope.showMenu = false;
    $scope.truckingList = [];
    $scope.businessUnitList = [];
    $scope.trkgDeliveryList = [];
    var pageSize = 20;

   
    // Initialization routines
    var init = function () {
        //$scope.focusOnTop();
        //$scope.initTruckingItem();
        //$scope.initBusinessUnits();
        //$scope.loadDataTruckings();
        //$scope.loadData($scope.currentPage);
        //$scope.addNewBooking();
    };

    init();
};