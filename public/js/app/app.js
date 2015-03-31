var dudes;
(function() {
    dudes = dudes || angular.module('dudes', ['ngRoute']);

    dudes.config(config);
    config.$inject = ['$locationProvider', '$routeProvider'];
    function config($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider.when('/', {
            templateUrl: '/app/tmpls/home.html'
        })
        .otherwise({
            redirectTo: '/'
        });
    }
}());