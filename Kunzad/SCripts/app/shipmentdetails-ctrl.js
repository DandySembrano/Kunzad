var kunzadApp = angular.module('kunzadApp', ['LocalForageModule']);
kunzadApp.run(function ($rootScope, $localForage, $filter) {
    $localForage.getItem("Token").then(function (value) {
        $http.defaults.headers.common['Token'] = value;
    });
    $rootScope.formatControlNo = function (prefix, length, value) {
        var formattedValue = prefix + value.toString();
        while (formattedValue.length < length) {
            formattedValue = "0" + formattedValue;
        }
        return formattedValue;
    };
    //Payment Mode List
    $rootScope.getPaymentModeList = function () {
        return [{ "Id": "A", "Name": "Account" },
                { "Id": "P", "Name": "Prepaid" },
                { "Id": "C", "Name": "Collect Account" },
                { "Id": "D", "Name": "Cash On Delivery" }
        ];
    };

    $localForage.getItem('PopUpData').then(function (details) {
        if (!angular.isUndefined(details)) {
            document.title = "Shipment Number: " + $rootScope.formatControlNo("", 8, details.Id);
            $rootScope.shipmentItem = details;
            var paymentModeList = $rootScope.getPaymentModeList();

            $rootScope.shipmentItem.Id = $rootScope.formatControlNo("", 8, details.Id);
            $rootScope.shipmentItem.PickupDate = $filter('Date')($rootScope.shipmentItem.PickupDate);
            $rootScope.shipmentItem.PickupTime = $filter('Time')($rootScope.shipmentItem.PickupTime);
            for (var i = 0; i < paymentModeList.length; i++) {
                if (paymentModeList[i].Id == $rootScope.shipmentItem.PaymentMode) {
                    $rootScope.shipmentItem.PaymentModeName = paymentModeList[i].Name;
                    break;
                }
            }
        }
    });

})
kunzadApp.config(['$localForageProvider', function ($localForageProvider) {
    $localForageProvider.config({
        name: 'myApp', // name of the database and prefix for your data, it is "lf" by default
        version: 1.0, // version of the database, you shouldn't have to use this
        storeName: 'keyvaluepairs', // name of the table
        description: 'some description'
    })
}])