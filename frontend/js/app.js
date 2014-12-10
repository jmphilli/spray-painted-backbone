define([
  'jquery',
  'underscore',
  'backbone',
  'openlayers',
  'router', // Request router.js
  'models/user'
], function($, _, Backbone, OpenLayers, Router, User){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
    var router = new Router()
    //Router.initialize();
    Backbone.history.start()

    var dbUser = JSON.parse(localStorage.getItem("user"))
    if(typeof dbUser != 'undefined' && dbUser != null) {
      var user = new User({id: dbUser.id})
      user.fetch({
        success : function(model, response) {
          var userId = model.get("id")
          if(typeof userId != 'undefined') {
            model.redirectHome(model.get("userType"))
          }
        }
      })
      //if it successfully fetches, then we can redirect to the userType home page
    } else {
      Backbone.history.navigate("notLoggedIn", {
        trigger: true
      });
    }
  }
  
  return {
    initialize: initialize
  };
});
