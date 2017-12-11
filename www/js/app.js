// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngCordova', 'ngStorage', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

// Define an Angular service to wrap the plugin
.service('$cordovaLaunchNavigator', ['$q', function ($q) {
  "use strict";

  var $cordovaLaunchNavigator = {};
  $cordovaLaunchNavigator.navigate = function (destination, options) {
    var q = $q.defer(),
      isRealDevice = ionic.Platform.isWebView();

    if (!isRealDevice) {
      q.reject("launchnavigator will only work on a real mobile device! It is a NATIVE app launcher.");
    } else {
      try {

        var successFn = options.successCallBack || function () {
            },
          errorFn = options.errorCallback || function () {
            },
          _successFn = function () {
            successFn();
            q.resolve();
          },
          _errorFn = function (err) {
            errorFn(err);
            q.reject(err);
          };

        options.successCallBack = _successFn;
        options.errorCallback = _errorFn;

        launchnavigator.navigate(destination, options);
      } catch (e) {
        q.reject("Exception: " + e.message);
      }
    }
    return q.promise;
  };

  return $cordovaLaunchNavigator;
}])