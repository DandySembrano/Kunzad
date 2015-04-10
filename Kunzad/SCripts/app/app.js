// app.js
var kunzadApp = angular.module('kunzadApp', ['ui.router', 'ng-context-menu']);

kunzadApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state("home", {
            url: "/home",
            template: '<h1>Transport Management System</h>'
        })

        // Customer State ======================================================
        .state('Customer', {
            url: '/customer',
            templateUrl: '/References/_DataTables'
        })

        // CustomerGroups State ================================================
        .state('CustomerGroups', {
            url: '/customergroups',
            templateUrl: '/References/_CustomerGroups',
            controller: 'CustomerGroupController'
        })

});

