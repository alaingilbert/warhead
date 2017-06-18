var app = angular.module('warhead');

app.controller('StructuredQueryController', function($scope, statusPromise, $sce,
      $http, ENDPOINT, statePromise)
{

  $scope.trustAsHtml = function(value) {
    return $sce.trustAsHtml(value);
  };


  $scope.indexChanged = function() {
    $scope.fieldsOptions = getFieldsOptions();
  };


  $scope.opChanged = function($index) {
  };


  $scope.opIsText = function($index) {
    var op = $scope.input.filters[$index].op;
    return _.indexOf(['term', 'wildcard', 'prefix', 'query_string', 'text'], op) >= 0;
  };


  $scope.fieldChanged = function($index) {
    switch ($scope.input.filters[$index].field.type) {
      case 'match_all':
        $scope.ops = []; break;
      case '_all':
        $scope.ops = ['query_string']; break;
      case 'string':
        $scope.ops = ['term', 'wildcard', 'prefix', 'fuzzy', 'range', 'query_string', 'text', 'missing']; break;
      case 'long':
      case 'integer':
      case 'float':
      case 'byte':
      case 'short':
      case 'double':
      case 'date':
      case 'ip':
        $scope.ops = ['term', 'range', 'fuzzy', 'query_string', 'missing']; break;
      case 'geo_point':
        $scope.ops = ['missing']; break;
      case 'boolean':
        $scope.ops = ['term']; break;
    }
    $scope.input.filters[$index].op = $scope.ops[0];
  };


  var processFilter = function(filter) {
    console.log(filter);
    if (filter.field.label == 'match_all') {
      return {match_all: {}};
    } else {
      var obj = {};
      var value = {};
      value[filter.field.label] = filter.qual;
      obj[filter.op] = value;
      return obj;
    }
  };


  var extractQuery = function() {
    var query = {
      query: {
        bool: {
          must: [],
          must_not: [],
          should: []
        }
      },
      from: 0,
      size: 10,
      sort: [],
      facets: {}
    };

    _.each($scope.input.filters, function(filter) {
      var processedFilter = processFilter(filter);
      query.query.bool[filter.bool].push(processedFilter);
    });
    return query;
  };


  $scope.btnSearchClicked = function() {
    var payload = extractQuery();
    var url = ENDPOINT + '/' + $scope.input.index + '/_search';
    $http.post(url, payload).then(function(res) {
      $scope.table = {};
      var baseHeaders = _.chain(res.data.hits.hits[0]).keys().reject(function(item) { return item == '_source'; }).value();
      var sourceHeaders = _.keys(res.data.hits.hits[0]._source);
      $scope.table.headers = _.concat(baseHeaders, sourceHeaders);
      $scope.table.headers = _.reject($scope.table.headers, function(header) { return header == '_source'; });
      $scope.table.rows = _.chain(res.data.hits.hits).reduce(function(memo, item) {
        var baseData = _.
        memo.push(item);
        return memo;
      }, []).value();
      $scope.result = res.data;
      return;
      $scope.result = angular.toJson(res.data, true);
    });
  };


  var extractFieldsKeysRecursive = function(mapping, baseKey) {
    var results = [];
    _.each(mapping, function(value, key) {
      if (_.isObject(value) && _.isObject(value.properties)) {
        results = _.concat(results, extractFieldsKeysRecursive(value.properties, baseKey + key + '.'));
      } else {
        results.push({label: baseKey + key, type: value.type});
      }
    });
    return results;
  };


  var getFieldsOptions = function() {
    var mapping = $scope.stateData.metadata.indices[$scope.input.index].mappings;
    var keys = extractFieldsKeysRecursive(mapping, '');
    var baseFields = [{type: 'match_all', label: 'match_all'}, {type: '_all', label: '_all'}];
    return _.concat(baseFields, keys);
  };


  (function constructor() {
    $scope.stateData = statePromise.data;
    $scope.indices = _.keys(statusPromise.data.indices);
    $scope.input = {};
    $scope.input.index = $scope.indices[0];
    $scope.input.showQuerySource = false;
    $scope.input.nbResults = 10;
    $scope.input.outputResult = 'table';
    $scope.input.filters = [{bool: 'must', field: {type: 'match_all', label: 'match_all'}}];
    $scope.boolOptions = ['must', 'must_not', 'should'];
    $scope.fieldsOptions = getFieldsOptions();
    $scope.ops = [];
    $scope.filterLogics = ['must', 'must_not', 'should'];
    $scope.outputs = ['table', 'json', 'csv'];
    $scope.nbResults = [10, 50, 250, 1000, 5000, 25000];
  })();

});
