(function () {
  var app = angular.module('app', []);

  Stripe.setPublishableKey('pk_test_2Au2loW9lRDjWnYmrDVgsvDA');

  mainCtrl.$inject = ['$scope', '$http'];
  app.controller('mainCtrl', mainCtrl);
  function mainCtrl ($scope, $http) {
    $scope.card = {
      number: 4242424242424242,
      exp_month: 12,
      exp_year: 2016,
      cvc: 123
    };

    $scope.submit = function () {
      $scope.oops = "";
      $scope.yay = "";
      $scope.data = undefined;
      Stripe.card.createToken($scope.card, function(status, token) {
        // asynchronously called
        if(status != 200) {
          $scope.$apply(function () {
            $scope.oops = token;
          });
          return;
        }
        console.log('good token', token);
        $http.post('/testCharge', {
          token: token,
          amount: $scope.amount
        }).
          success(function(data, status, headers, config) {
            console.log('success', data);
            if(data.success) {
              $scope.yay = "Charge was successful";
            } else {
              $scope.oops = "Charge was not successful";
            }
            $scope.data = data;
          }).
          error(function(data, status, headers, config) {
          console.log('failure', data);
          });
      });
    };
  }
}());
