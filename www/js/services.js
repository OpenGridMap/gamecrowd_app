angular.module('services', [])

.factory('typeFactory', [ function()
  {
    var type ='other';
    return {
     setter: function(data) {
      type = data;
      },
     getter: function(){return type}
   };
  }])

.factory('tokenFactory', [ function()
  {
    var id ;
    return {
     setter: function(data) {
      id = data;
      },
     getter: function(){return id}
   };
  }]);