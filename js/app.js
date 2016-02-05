var app = angular.module('warhead',
    ['ui.router',
     'ngSanitize',
     'ui.bootstrap',
     'ui-notification',
     'ui.select',
     'dialogs.main']);

app.constant('ENDPOINT', 'http://127.0.0.1:9200');

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
      statePromise: function($http, ENDPOINT) {
        return $http.get(ENDPOINT + '/_cluster/state');
      },
      statusPromise: function($http, ENDPOINT) {
        return $http.get(ENDPOINT + '/_status');
      },
    },
  })
  .state('structuredQuery', {
    url: '/structured-query',
    templateUrl: 'partials/structured-query.html',
    controller: 'StructuredQueryController',
    reloadOnSearch: false,
    resolve: {
      statusPromise: function($http, ENDPOINT) {
        return $http.get(ENDPOINT + '/_status');
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
  })
  .state('indices', {
    url: '/indices',
    templateUrl: 'partials/indices.html',
    controller: 'IndicesController',
    reloadOnSearch: false,
    resolve: {
      statusPromise: function($http, ENDPOINT) {
        return $http.get(ENDPOINT + '/_status');
      },
    },
  })
  .state('browser', {
    url: '/browser',
    templateUrl: 'partials/browser.html',
    controller: 'BrowserController',
    reloadOnSearch: false,
    resolve: {
    },
  });
});
