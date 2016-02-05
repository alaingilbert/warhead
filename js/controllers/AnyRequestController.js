var app = angular.module('warhead');

app.controller('AnyRequestController', function($scope, $http, $sce, $location, $stateParams, dialogs) {

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


  $scope.baseUriChanged = function() {
    $location.search('base_uri', $scope.input.baseUri);
  };


  $scope.pathChanged = function() {
    $location.search('path', $scope.input.path);
  };


  $scope.methodChanged = function() {
    $location.search('method', $scope.input.method);
  };


  $scope.bodyChanged = function() {
    $location.search('body', $scope.input.body);
  };


  $scope.btnRequestClicked = function() {
    var url = $scope.input.baseUri + $scope.input.path;
    var payload = $scope.input.body;
    $http[$scope.input.method](url, payload).then(function(res) {
      $scope.result = $sce.trustAsHtml(highlight(res.data));
    }).catch(function(err) {
      console.log(err);
    });
  };


  $scope.btnResetFormClicked = function() {
    dialogs.confirm().result.then(function() {
      $scope.input.baseUri = 'http://127.0.0.1:9200/';
      $scope.input.path = '_search';
      $scope.input.method = 'post';
      $scope.input.body = '{"query":{"match_all":{}}}';

      var keys = _.keys($location.search());
      _.each(keys, function(key) {
        $location.search(key, null);
      });
    });
  };


  (function constructor() {
    $scope.methods = ['post', 'get', 'put', 'head', 'delete'];
    $scope.input = {};
    $scope.input.baseUri = $stateParams.base_uri || 'http://127.0.0.1:9200/';
    $scope.input.path = $stateParams.path || '_search';
    $scope.input.method = $stateParams.method || 'post';
    $scope.input.body = $stateParams.body || '{"query":{"match_all":{}}}';
  })();

});
