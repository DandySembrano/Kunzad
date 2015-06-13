kunzadApp.directive('dirExport', function () {
    return {
        restrict: 'C',
        link: function ($scope, elm, attr) {
            $scope.$on('export-excel', function (e, d) {
                elm.tableExport({ type: 'excel', escape: 'false' });
            });

            $scope.$on('export-doc', function (e, d) {
                elm.tableExport({ type: 'doc', escape: 'false' });
            });

            $scope.$on('export-png', function (e, d) {
                elm.tableExport({ type: 'png', escape: 'false' });
            });
        }
    }
});