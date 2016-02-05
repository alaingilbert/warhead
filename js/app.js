var app = angular.module('warhead',
    ['ui.router',
     'ngSanitize',
     'ui.bootstrap',
     'ui.select',
     'dialogs.main']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, dialogsProvider) {
  dialogsProvider.useBackdrop(true);
  dialogsProvider.useAnimation(true);
  dialogsProvider.useFontAwesome();
  dialogsProvider.setSize('sm');
  $urlRouterProvider.otherwise("/");
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'partials/home.html',
    controller: 'HomeController',
    resolve: {
      statePromise: function($http) {
        return $http.get('http://127.0.0.1:9200/_cluster/state');
      },
    },
  })
  .state('structuredQuery', {
    url: '/structured-query',
    templateUrl: 'partials/structured-query.html',
    controller: 'StructuredQueryController',
    reloadOnSearch: false,
    resolve: {
      statusPromise: function($http) {
        return $http.get('http://127.0.0.1:9200/_status');
      },
    },
  })
  .state('anyRequest', {
    url: '/any-request?base_uri&path&method&body',
    templateUrl: 'partials/any-request.html',
    controller: 'AnyRequestController',
    reloadOnSearch: false,
    resolve: {
    },
  });
});
