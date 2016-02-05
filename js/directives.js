var app = angular.module('warhead');

app.directive('focusMe', function($timeout) {
  return {
    scope: { trigger: '@focusMe' },
    link: function(scope, element, attr) {
      var predicate = attr.focusMe || true;
      switch (predicate) {
        case "true": case "yes": case "1":
          predicate = true;
          break;
        case "false": case "no": case "0": case null:
          predicate = false;
          break;
        default:
          predicate = Boolean(predicate);
          break;
      }
      if (!predicate) {
        return;
      }
      scope.$watch('trigger', function(value) {
        $timeout(function() {
          element[0].focus();
        });
      });
    }
  };
});


app.directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if(event.which === 13) {
        scope.$apply(function(){
          scope.$eval(attrs.ngEnter, {'event': event});
        });
        event.preventDefault();
      }
    });
  };
});


app.filter('bytes', function() {
  return function(bytes, precision) {
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
    if (typeof precision === 'undefined') precision = 1;
    var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
      number = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
  }
});

app.filter("megaNumber", function() {
  return (number, fractionSize) => {
    if(number === null) return null;
    if(number === 0) return "0";
    if(!fractionSize || fractionSize < 0)
      fractionSize = 1;
    var abs = Math.abs(number);
    var rounder = Math.pow(10,fractionSize);
    var isNegative = number < 0;
    var key = '';
    var powers = [
      {key: "Q", value: Math.pow(10,15)},
      {key: "T", value: Math.pow(10,12)},
      {key: "B", value: Math.pow(10,9)},
      {key: "M", value: Math.pow(10,6)},
      {key: "K", value: 1000}
    ];
    for(var i = 0; i < powers.length; i++) {
      var reduced = abs / powers[i].value;
      reduced = Math.round(reduced * rounder) / rounder;
      if(reduced >= 1){
        abs = reduced;
        key = powers[i].key;
        break;
      }
    }
    return (isNegative ? '-' : '') + abs + key;
  };
});
