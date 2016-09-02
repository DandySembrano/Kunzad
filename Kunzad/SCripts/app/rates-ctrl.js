
kunzadApp.controller("RatesController", function ($scope, $http, $interval, $filter, $rootScope, $compile) {
    $scope.modelName = "Rates Maintenance";
    $scope.modelhref = "#/rates";
    $scope.viewOnly = false;
    $scope.submitButtonText = "Submit";
    $scope.tabPages = ["Information", "List"];
    $scope.selectedTab = "Information";
    //Initialize needed functions during page load
    //init();
});
