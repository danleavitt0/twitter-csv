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

  $scope.follow_button = "get followers";
  $scope.following_button = "get following";

  $scope.clickFollowers = function(){
    if ($scope.name == $scope.search_handle && $scope.data) {
      $scope.download($scope.data, 'followers', function(){
        $scope.follow_button = "Get Followers";
        $scope.data = null;
      });
    }
    else
      $scope.getData($scope.search_handle, function(){
        $scope.follow_button = 'Download ' + $scope.name + '\'s ' + $scope.data.length + ' followers';
      })
  }

  $scope.clickFollowing = function(){
    if ($scope.name == $scope.search_handle && $scope.friends) {
      $scope.download($scope.friends, 'friends', function(){
        $scope.following_button = "Get Friends";
        $scope.friends = null;
      });
    }
    else
      $scope.getFriends($scope.search_handle, function(){
        $scope.following_button = 'Download ' + $scope.name + '\'s ' + $scope.friends.length + ' friends';
      })
  }

  $scope.getFriends = function(name, cb){
    var events;
    var name = $scope.name = name || 'dleavs';
    cb = cb || function(){};
    $scope.loading = true;
    $http({
      'method':'GET', 
      'url':'/getFriends',
      'cache':followersCache,
      'params':{
        'screen_name':name
      }
    })
    .success(function(data,status,headers,config) {
      $scope.friends = data;
      localStorageService.set(name, dataToCsv($scope.friends));
      $scope.loading = false;
      cb();
    });
  };

  $scope.getData = function(name, cb){
    var events;
    var name = $scope.name = name || 'dleavs';
    cb = cb || function(){};
    $scope.loading = true;
    $http({
      'method':'GET', 
      'url':'/getFollowers',
      'cache':followersCache,
      'params':{
        'screen_name':name
      }
    })
    .success(function(data,status,headers,config) {
      $scope.data = data;
      localStorageService.set(name, dataToCsv($scope.data));
      $scope.loading = false;
      cb();
    });
  };

  function dataToCsv(data) {
    var data = data;
    var dataString;
    var csvContent = '';
    _.each(data, function(el, idx){
      dataString = el.join(',');
      csvContent += idx < data.length ? dataString + '\n' : dataString;
    })
    return csvContent;
  }

  $scope.download = function(data, type, cb) {
    cb = cb || function(){};
    var element = angular.element('<a/>');
     element.attr({
         href: 'data:attachment/csv;charset=utf-8,' + encodeURI(dataToCsv(data)),
         target: '_blank',
         download: $scope.search_handle + '_' + type + '.csv'
     })[0].click();
     cb();
  }

});