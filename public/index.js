// Code goes here

var app = angular.module('twitterCsv', ['ngMaterial']);

app.controller('getTwitter', function($filter,$scope,$http,$mdSidenav, $location){

  $scope.getData = function(name){
    var events;
    console.log(name);
    var name = name || 'dleavs';
    console.log(name);
    $http({
      'method':'GET', 
      'url':'/getFollowers',
      'params':{
        'screen_name':name
      }
    })
    .success(function(data,status,headers,config) {
      $scope.showLoading = false;
      events = data.events;
      console.log(data.events);
      $scope.pagination = data.pagination;
      cb(events);
    });
    return events;
  };
  $scope.getData();
});