(function () {
    'use strict';
    var app = angular.module('app', []);

    config.$inject = ['$httpProvider'];
    app.config(config);
    function config ($httpProvider) {
        $httpProvider.defaults.headers.common['authorization'] = 'Bearer d555371e9ec45b285bd36d217d529d2b-5c81fd43bd0d469de144eb1a6489f566';
    }

    run.$inject = ['$http', 'data'];
    app.run(run);
    function run ($http, data) {
        var urlInstruments = 'https://api-fxpractice.oanda.com/v1/instruments?accountId=8897959'
        // var url = 'https://api-fxpractice.oanda.com/v1/prices?instruments=EUR_USD%2CUSD_JPY'
        $http.get(urlInstruments).success(function (resp) {
            console.log(resp);
            data.instruments = resp.instruments;
        });
    }


    app.factory('data', data);
    function data () {
        return {
            instruments: null
        };
    }

    mainCtrl.$inject = ['$scope', '$http', 'data'];
    app.controller('mainCtrl', mainCtrl);
    function mainCtrl ($scope, $http, data) {
        $scope.instruments = data.instruments;
        $scope.curInstrument = null;

    }
}());
