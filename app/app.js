'use strict';

// Declare app level module which depends on views, and core components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.car',
  'myApp.customer',
  'myApp.booking',
  'myApp.carlist',
  'myApp.customerlist',
  'myApp.bookinglist',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/carlist'});
}]);
