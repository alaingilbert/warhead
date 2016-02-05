var app = angular.module('warhead');

app.controller('HomeController', function($scope, statePromise, $uibModal,
      $http, $state, Notification, dialogs, ENDPOINT, statusPromise)
{

  $scope.btnNewAliasClicked = function(index) {
    var modalInstance = $uibModal.open({
      templateUrl: 'partials/new-alias-modal.html',
      controller: 'NewAliasModalController',
    });
    modalInstance.result.then(function(alias) {
      var payload = {"actions":[{"add":{"index":index,"alias":alias}}]};
      var url = ENDPOINT + '/_aliases';
      $http.post(url, payload).then(function(res) {
        console.log(res);
        Notification.success('Alias created');
        $state.reload();
      }).catch(function(err) {
        console.log(err);
      });
    });
  };


  $scope.btnRemoveAliasClicked = function(index, alias) {
    dialogs.confirm().result.then(function() {
      var payload = {"actions":[{"remove":{"index":index,"alias":alias}}]};
      var url = ENDPOINT + '/_aliases';
      $http.post(url, payload).then(function(res) {
        console.log(res);
        Notification.success('Alias deleted');
        $state.reload();
      }).catch(function(err) {
        console.log(err);
      });
    });
  };


  $scope.btnDeleteClicked = function(index) {
    var modalInstance = $uibModal.open({
      templateUrl: 'partials/delete-modal.html',
      controller: 'DeleteModalController',
      resolve: {
        indexName: function() { return index; },
      }
    });
    modalInstance.result.then(function(text) {
      if (text == 'DELETE') {
        var url = ENDPOINT + '/' + index;
        $http.delete(url).then(function(res) {
          Notification.success('Index ' + index + ' deleted');
          $state.reload();
        }).catch(function(err) {
          dialogs.error(err.status + ' - ' + err.statusText, '<code><pre>' + angular.toJson(err.data, true) + '</pre></code>', {size: 'lg'});
          console.log(err);
        });
      }
    });
  };


  $scope.btnRefreshClicked = function(indexName) {
    var url = ENDPOINT + '/' + indexName + '/_refresh';
    $http.post(url).then(function(res) {
      Notification.success('Index refreshed');
      $state.reload();
    }).catch(function(err) {
      dialogs.error(err.status + ' - ' + err.statusText, '<code><pre>' + angular.toJson(err.data, true) + '</pre></code>', {size: 'lg'});
      console.log(err);
    });
  };


  $scope.btnFlushClicked = function(indexName) {
    var url = ENDPOINT + '/' + indexName + '/_flush';
    $http.post(url).then(function(res) {
      Notification.success('Index flushed');
      $state.reload();
    }).catch(function(err) {
      dialogs.error(err.status + ' - ' + err.statusText, '<code><pre>' + angular.toJson(err.data, true) + '</pre></code>', {size: 'lg'});
      console.log(err);
    });
  };


  $scope.btnCloseIndexClicked = function(indexName) {
    var url = ENDPOINT + '/' + indexName + '/_close';
    $http.post(url).then(function(res) {
      Notification.success('Index closed');
      $state.reload();
    }).catch(function(err) {
      dialogs.error(err.status + ' - ' + err.statusText, '<code><pre>' + angular.toJson(err.data, true) + '</pre></code>', {size: 'lg'});
      console.log(err);
    });
  };


  $scope.btnOpenIndexClicked = function(indexName) {
    var url = ENDPOINT + '/' + indexName + '/_open';
    $http.post(url).then(function(res) {
      Notification.success('Index opened');
      $state.reload();
    }).catch(function(err) {
      dialogs.error(err.status + ' - ' + err.statusText, '<code><pre>' + angular.toJson(err.data, true) + '</pre></code>', {size: 'lg'});
      console.log(err);
    });
  };


  var highlightJson = function(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  };


  var highlight = function(obj) {
    return highlightJson(angular.toJson(obj, true))
  };


  $scope.btnIndexStatusClicked = function(indexName) {
    var data = $scope.statusData.indices[indexName];
    dialogs.notify('Index Status', '<code><pre>' + highlight(data) + '</pre></code>', {size: 'lg'});
  };


  $scope.btnIndexMetadataClicked = function(indexName) {
    var data = $scope.stateData.metadata.indices[indexName];
    dialogs.notify('Index Metadata', '<code><pre>' + highlight(data) + '</pre></code>', {size: 'lg'});
  };


  (function constructor() {
    $scope.sorts = [
      {label: 'By Name', value: 'name'},
      {label: 'By Address', value: 'address'},
      {label: 'By Type', value: 'type'},
    ];
    $scope.stateData = statePromise.data;
    $scope.statusData = statusPromise.data;
    $scope.indexes = _.reduce($scope.stateData.metadata.indices, function(memo, item, key) {
      item.name = key;
      memo.push(item);
      return memo;
    }, []);
  })();

});
