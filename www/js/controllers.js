angular.module('starter.controllers', [])
.controller('MapCtrl', function($scope,$window) {
$scope.openMapView = function(){
  $window.open('http://vmjacobsen39.informatik.tu-muenchen.de/','_blank');
  };
})



.controller("CameraCtrl", function($scope,$state, $cordovaCamera , $cordovaGeolocation,typeFactory,$ionicLoading ,$http,tokenFactory) {

  $scope.type = typeFactory.getter();
  $scope.access_token = tokenFactory.getter();
  console.log('token : ' + $scope.access_token);
  //$scope.retakePicture = false;
  $scope.retake = function(){
   var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        console.log('position :' + position);
        $scope.latitude  = position.coords.latitude;
        $scope.longitude = position.coords.longitude;
        $scope.accuracy = position.coords.accuracy;
        $scope.timestamp = position.timestamp;
        $scope.altitude = position.coords.altitude;
        $scope.accuracy = parseInt($scope.accuracy, 10); 
        if($scope.accuracy > 50) {
            $scope.retakePicture = false;
         }else{
            $scope.retakePicture = true;
        }
          
           console.log('Latitude: '          + position.coords.latitude          + '\n' +
            'Longitude: '         + position.coords.longitude         + '\n' +
            'Altitude: '          + position.coords.altitude          + '\n' +
            'Accuracy: '          + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '           + position.coords.heading           + '\n' +
            'Speed: '             + position.coords.speed             + '\n' +
            'Timestamp: '         + position.timestamp                + '\n');
      }, function(err) {
        console.log(err);

      });

            var options = {
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 250,
            targetHeight: 250,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        }; 
        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
            $scope.srcImage = "data:"+imageData;
            $scope.object = {
              data_packet:{ 
               id_token : "",
               access_token:$scope.access_token,
               image : $scope.imgURI,
               number_of_points:"1",
                point : {
                  longitude : $scope.longitude,
                  latitude : $scope.latitude,
                  properties:{
                    tags :{
                      accuracy: $scope.accuracy,
                      altitude :  $scope.altitude,
                      timestamp : $scope.timestamp,
                      power_element_tags: $scope.type,
                      type: "point"
                    } 
                  }
                },
                submission_id : Math.floor(Math.random() * 1000000000)
              }
            }
        }, function(err) {
              $state.go('app.gamecrowd');
        });
     };
       
    $scope.retake();
    $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };
   $scope.success = function() {
    $ionicLoading.show({
      template: '<p>success...</p>'
    });
  };
   $scope.failed = function() {
    $ionicLoading.show({
      template: '<p>failed...</p>'
    });
  };

  $scope.hide = function(){
        $ionicLoading.hide();
  };

    $scope.upload = function(){
      //check for internet first to avoid problems .
      
    // if(window.Connection) {
    //   if(navigator.connection.type == Connection.NONE) {
    //       $ionicPopup.alert({
    //         title: 'No Internet Connection',
    //         content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
    //       }).then(function(){
    //         cordova.plugins.diagnostic.switchToWifiSettings();
    //       });
    //   }
    // }
    // else if (window.cordova) {
    //       cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {
    //           if(!enabled){
    //              $ionicPopup.alert({
    //                 title: 'No GPS Connection',
    //                 content: 'Sorry, no GPS connectivity detected. Please reconnect and try again.'
    //               }).then(function(){
    //                 cordova.plugins.diagnostic.switchToLocationSettings();
    //               });
    //           }
    //       }, function(error) {
    //           alert("The following error occurred: " + error);
    //       });
    //   }
    // else {
      $scope.show($ionicLoading);
      $scope.object = JSON.stringify($scope.object);
      console.log($scope.object);
      
      $http.post('http://vmjacobsen39.informatik.tu-muenchen.de/submissions/create',$scope.object,function(response){
           $scope.response = response; 
           $ionicLoading.show({
                template: '<p>success...</p>'
              });
            $state.go('app.gamecrowd');
             $scope.hide();
      }).catch(function(e){
           $scope.hide();
            $ionicLoading.show({
                template: '<p> submission failed ...</p>'
              });
        $scope.exception = e ;
          
          $scope.hide();
      });
      
     // };
   };
})

.controller('IndexCtrl', function($state){
 
})

.controller('GameCtrl', function($scope, $cordovaCamera, $cordovaFile,$state) {
 
 }
)


.controller('LoginCtrl',function($scope,$state, $ionicLoading , typeFactory,tokenFactory ) {
  
  $scope.setType = function(data){
    typeFactory.setter(data);
  }

  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };

  $scope.hide = function(){
        $ionicLoading.hide();
  };

  $scope.login = function() {

    //   if(navigator.connection.type == Connection.NONE) {
    //       $ionicPopup.alert({
    //         title: 'No Internet Connection',
    //         content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
    //       }).then(function(){
    //         cordova.plugins.diagnostic.switchToWifiSettings();
    //       });
    //   }
    // else{
      $scope.show($ionicLoading);
      var ref = new Firebase("https://gamecrowd.firebaseio.com/");
      ref.authWithOAuthPopup("google", function(error, authData) { 
        if (error) {
          console.log("Login Failed!", error);
          $scope.hide($ionicLoading); 
        } else {
          console.log("Authenticated successfully with payload:", authData);
          $scope.authData = authData;
          tokenFactory.setter(authData.google.accessToken);
        }}, {
        remember: "sessionOnly",
        scope: "email"
      }).then(function(){
        $scope.hide($ionicLoading); 
      });
      
  };
});

