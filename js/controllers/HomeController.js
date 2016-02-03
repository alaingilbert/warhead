var app = angular.module('warhead');

app.controller('HomeController', function($scope, statePromise) {

  (function constructor() {
    $scope.indices = statePromise.data.metadata.indices;
  })();

});
