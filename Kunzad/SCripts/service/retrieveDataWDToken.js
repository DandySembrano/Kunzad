var restAPIWDToken = function ($rootScope, $http, $localForage, $interval) {
    this.data = getData;

    function getData(url, callback) {
        var returnValue;
        $localForage.getItem("Token").then(function (value) {
            $http.defaults.headers.common['Token'] = value;
            $http.get(url)
            .success(function (data, status) {
                returnValue = { status: "SUCCESS", value: data };
                callback(returnValue);
            })
            .error(function (response, status) {
                returnValue = { status: "FAILURE", value: status };
                callback(returnValue);
            })
        });
    };
};
kunzadApp.service('restAPIWDToken', restAPIWDToken);