// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js



angular.module('starter', ['ionic','ngCordova', 'starter.controllers','services','firebase'])

.run(function($ionicPlatform,$ionicPopup) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

        // Check for network connection
    if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
          $ionicPopup.alert({
            title: 'No Internet Connection',
            content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
          }).then(function(){
            cordova.plugins.diagnostic.switchToWifiSettings();
          });
      }
    }

    if (window.cordova) {
        if (window.cordova) {
          cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {
              if(!enabled){
                 $ionicPopup.alert({
                    title: 'No GPS Connection',
                    content: 'Sorry, no GPS connectivity detected. Please reconnect and try again.'
                  }).then(function(){
                    cordova.plugins.diagnostic.switchToLocationSettings();
                  });
              }
          }, function(error) {
              alert("The following error occurred: " + error);
          });
      }
    }

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
      })

  .state('app.gamecrowd', {
    url: '/gamecrowd',
    views: {
      'menuContent': {
        templateUrl: 'templates/gamecrowd.html',
        controller : 'GameCtrl'
      }
    }
  })
    .state('app.photo', {
   cache: false,
    url: '/photo',
    views: {
      'menuContent': {
        templateUrl: 'templates/photo.html',
        controller : 'CameraCtrl'
      }
    }
  })

  .state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html'
      }
    }
  })

  .state('app.gamify', {
      url: '/gamify',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.maps', {
      url: '/maps',
      views: {
        'menuContent': {
          templateUrl: 'templates/maps.html',
          controller: 'mapsCtrl'
        }
      }
    })


     .state('login', {
    url: '/login',
    templateUrl: "/login.html",
    controller: 'LoginCtrl'
  })
  .state('index', {
    url: '/index',
    templateUrl: "/index.html",
    controller: 'IndexCtrl'
  })

.state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeCtrl'
      }
    }
  }) 
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('app/gamecrowd');
});
