var app = angular.module('warhead');

app.controller('NewIndexModalController', function($scope, $uibModalInstance)
{

  $scope.btnCreateIndexClicked = function() {
    $uibModalInstance.close($scope.input);
  };


  (function constructor() {
    $scope.input = {};
    $scope.input.nbShards = 5;
    $scope.input.nbReplicas = 1;
  })();


  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };

});
