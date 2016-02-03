var app = angular.module('warhead', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: '/partials/home.html',
    controller: 'HomeController',
  });
});
