var app = angular.module('warhead');

app.controller('DeleteModalController', function($scope, $uibModalInstance, indexName) {

  $scope.btnDeleteClicked = function() {
    $uibModalInstance.close($scope.input.text);
  };


  (function constructor() {
    $scope.indexName = indexName;
    $scope.input = {};
  })();


  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };

});
