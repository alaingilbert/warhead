var app = angular.module('warhead');

app.controller('StructuredQueryController', function($scope, statusPromise, $sce) {

  $scope.trustAsHtml = function(value) {
    return $sce.trustAsHtml(value);
  };


  (function constructor() {
    $scope.input = {};
    $scope.indices = _.keys(statusPromise.data.indices);
    $scope.filters = [1];
    $scope.filterLogics = ['must', 'must_not', 'should'];
  })();

});
