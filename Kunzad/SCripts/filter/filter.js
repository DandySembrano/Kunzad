kunzadApp.filter('ControlNo', function ($filter) {
    return function (value) {
        if (angular.isDefined(value)) {
            var formattedValue = value.toString();
            while (formattedValue.length < 15) {
                formattedValue = "0" + formattedValue;
            }
            return formattedValue;
        }
    }
});
kunzadApp.filter('Date', function ($filter) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        return $filter('date')(value, "MM/dd/yyyy");
    }
});
kunzadApp.filter('DateTime', function ($filter) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        return $filter('date')(value, "MM/dd/yyyy HH:mm:ss");
    }
});
kunzadApp.filter('Time1', function ($filter) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        return $filter('date')(value, "hh:mm:ss a");
    }
});
kunzadApp.filter('Time', function ($filter) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        return $filter('date')(value, "HH:mm:ss");
    }
});
kunzadApp.filter('Boolean', function ($filter) {
    return function (value) {
        if (value == true)
            return "Yes";
        else
            return "No";
    }
});
kunzadApp.filter('Bit', function ($filter) {
    return function (value) {
        if (value == 1)
            return "Yes";
        else
            return "No";
    }
});
kunzadApp.filter('Default', function ($filter) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        return value;
    }
});
kunzadApp.filter('StringUpper', function ($filter) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        return value.toUpperCase();
    }
});
kunzadApp.filter('ProperCase', function ($filter) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        var words = value.split(' ');
        for (var i = 0; i < words.length; i++) {
            words[i] = words[i].toLowerCase(); // lowercase everything to get rid of weird casing issues
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
        }
        return words.join(' ');
    }
});
kunzadApp.filter('Decimal', function ($filter) {
    return function (value) {
        if (value == "" || value == null || value == 0.0000)
            return 0.0000;
        else
            return $filter('number')(value, 4);

    }
});
kunzadApp.filter('PaymentMode', function ($filter, $rootScope) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        var paymentModeList = $rootScope.getPaymentModeList();
        for (var i = 0; i < paymentModeList.length; i++)
        {
            if (value == paymentModeList[i].Id)
                return paymentModeList[i].Name;
        }
    }
});
kunzadApp.filter('TransportStatus', function ($filter, $rootScope) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        var transportStatus = $rootScope.getTransportStatusList();
        for (var i = 0; i < transportStatus.length; i++) {
            if (value == transportStatus[i].Id) {
                return transportStatus[i].Name;
            }
        }
    }
});
kunzadApp.filter('TruckingType', function ($filter, $rootScope) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        var truckingType = $rootScope.getTruckingTypeList();
        for (var i = 0; i < truckingType.length; i++) {
            if (value == truckingType[i].Id)
                return truckingType[i].Name;
        }
    }
});
kunzadApp.filter('TruckingStatus', function ($filter, $rootScope) {
    return function (value) {
        if (value == "" || value == null)
            return "";
        var truckingStatus = $rootScope.getTruckingStatusList();
        for (var i = 0; i < truckingStatus.length; i++) {
            if (value == truckingStatus[i].Id) {
                return truckingStatus[i].Name;
            }
        }
    }
});