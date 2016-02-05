var app = angular.module('warhead');

app.controller('IndicesController', function($scope, statusPromise, $uibModal,
      $state, Notification, ENDPOINT, dialogs, $http)
{

  $scope.btnNewIndexClicked = function() {
    var modalInstance = $uibModal.open({
      templateUrl: 'partials/new-index-modal.html',
      controller: 'NewIndexModalController',
    });
    modalInstance.result.then(function(newIndex) {
      var payload = {"settings":{"index":{"number_of_shards":newIndex.nbShards,"number_of_replicas":newIndex.nbReplicas}}};
      var url = ENDPOINT + '/' + newIndex.indexName;
      $http.put(url, payload).then(function(res) {
        console.log(res);
        Notification.success('Index created');
        $state.reload();
      }).catch(function(err) {
        dialogs.error(err.status + ' - ' + err.statusText, '<code><pre>' + angular.toJson(err.data, true) + '</pre></code>', {size: 'lg'});
        console.log(err);
      });
    });
  };


  (function constructor() {
    $scope.statusData = statusPromise.data;
    $scope.indices = _.reduce($scope.statusData.indices, function(memo, item, key) {
      memo.push(key);
      return memo;
    }, []);
  })();

});
