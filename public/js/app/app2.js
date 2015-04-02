(function () {
  var app = angular.module('app', ['ui.router', 'ngAnimate']);

  app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");

    $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "tmpl/home"
    })
    .state('store', {
      url: "/store",
      templateUrl: "tmpl/store"
    });
  });
}());
