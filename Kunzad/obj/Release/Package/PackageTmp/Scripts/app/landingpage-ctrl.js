var kunzadLandingPageApp = angular.module("KunzadLandingPage", ['ngRoute', 'LocalForageModule']);
kunzadLandingPageApp.config(['$routeProvider', function ($routeProvider) {
    //Setup routes to load partial templates from server. TemplateUrl is the location for the server view (Razor .cshtml view)
    $routeProvider
        .when('/main', {
            templateUrl: '/Main/Home'
        })

        .otherwise({
            redirectTo: '/main'
        });
}]);
kunzadLandingPageApp.config(['$localForageProvider', function ($localForageProvider) {
    $localForageProvider.config({
        name: 'myApp', // name of the database and prefix for your data, it is "lf" by default
        version: 1.0, // version of the database, you shouldn't have to use this
        storeName: 'keyvaluepairs', // name of the table
        description: 'some description'
    })
}]);
kunzadLandingPageApp.controller("MainController", function ($rootScope, $localForage, $scope, $http) {
    $scope.loginRequest = function () {
        window.location = document.URL.split('#')[0] + "Home/#/home"
        //Use UserId number 1 temporarily
        $http.get("/api/users?id=1")
        .success(function (response, status) {
            if (response.status == "SUCCESS") {
                $localForage.setItem("Menu", response.objParam2);
                $localForage.setItem("UserMenuAccess", response.objParam1);
                $localForage.setItem("Basic", response.stringParam1);
                $http.defaults.headers.common.Authorization = 'Basic ' + response.stringParam1;
                $http.get("/api/authenticate")
                .success(function (response, status, headers) {
                    $localForage.setItem("Token", headers().token);
                    window.location = document.URL.split('#')[0] + "Home/#/home"
                })
                .error(function (err) {
                    console.log("Login failure");
                })
            }
        })
        .error(function (err) { })
    };
});