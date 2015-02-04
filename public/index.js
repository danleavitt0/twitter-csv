// Code goes here

var app = angular.module('twitterCsv', ['ngMaterial', 'LocalStorageModule']);

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('myApp')
    .setStorageType('localStorage')
    .setNotify(true, true)
});

app.factory('followersCache', ['$cacheFactory', function($cacheFactory) {
  return $cacheFactory('followers-cache');
}]);

app.controller('getTwitter', function($filter,$scope,$http,localStorageService,followersCache){



  $scope.getData = function(name){
    var events;
    var name = $scope.name = name || 'dleavs';
    $scope.loading = true;
    $scope.finishLoading = false;
    $http({
      'method':'GET', 
      'url':'/getFollowers',
      'cache':followersCache,
      'params':{
        'screen_name':name
      }
    })
    .success(function(data,status,headers,config) {
      console.log(headers);
      $scope.data = data;
      localStorageService.set(name, dataToCsv());
      $scope.loading = false;
      $scope.finishLoading = true;
    });
  };

  function dataToCsv() {
    var dataString;
    var csvContent = '';
    _.each($scope.data, function(el, idx){
      dataString = el.join(',');
      csvContent += idx < $scope.data.length ? dataString + '\n' : dataString;
    })
    return csvContent;
  }

  $scope.download = function() {
    var element = angular.element('<a/>');
     element.attr({
         href: 'data:attachment/csv;charset=utf-8,' + encodeURI(dataToCsv()),
         target: '_blank',
         download: $scope.search_handle + '_followers.csv'
     })[0].click();
     $scope.search_handle = '';
     $scope.finishLoading = false;
  }

});