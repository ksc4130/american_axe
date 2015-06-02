(function () {
    'use strict';
    var app = angular.module('app', []);

    app.controller('mainCtrl', mainCtrl);
    mainCtrl.$inject = ['$scope', '$http'];
    function mainCtrl($scope, $http) {
        $scope.submitted = false;
        $scope.submit = function () {
            $scope.submitted = true;
            $http.post('/subscribe', {email: $scope.email}).then(function (data) {
                console.log('data', data);
            });
        }
    }
}());