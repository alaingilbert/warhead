var app = angular.module('warhead');

app.controller('NewAliasModalController', function($scope, $uibModalInstance) {

  $scope.btnCreateAliasClicked = function() {
    $uibModalInstance.close($scope.input.alias);
  };


  (function constructor() {
    $scope.input = {};
  })();


  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };

});
