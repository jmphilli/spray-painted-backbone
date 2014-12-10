define([ 'underscore', 'backbone', 'models/authenticated-model' ], function(_, Backbone, AuthenticatedModel){
  var User = AuthenticatedModel.extend({
    urlRoot: '/api/users',
    defaults: {
      id: null,
      username: "",
      email: "",
      password: "",
      userType: "consumer"
    },
    redirectHome : function(userType){
      if(userType == "consumer") {
        Backbone.history.navigate("consumerHome", {
          trigger: true
        });
      } else if(userType == "dispensary") {
        Backbone.history.navigate("dispensaryHome", {
          trigger: true
        });
      } else if(userType == "admin") {
        Backbone.history.navigate("adminHome", {
          trigger: true
        });
      }
    },
    login: function(username, password, callback) {
               var that = this;

               $('#password').removeClass()

               var login = $.ajax({
                 url : '/api/login',
                 data : JSON.stringify({'username' : username, 'password': password}),
                 contentType: "application/json; charset=utf-8",
                 dataType: "json",
                 type : 'POST'
               });
               login.done(function(response){
                 var loginKey = response.key
                 if(typeof loginKey != 'undefined' && loginKey != "") {

                   var user = response.user

                   localStorage.setItem("login",  response.key)
                   localStorage.setItem("user", JSON.stringify(user))

                   if(typeof callback !== "undefined" && callback != null) {
                     callback()
                   }
                   var userType = user.userType
                   that.redirectHome(userType)
                 } else {
                   $('#password').addClass('failure')
                 }
               });
               login.fail(function(){
                   $('#password').addClass('failure')
               });
             }
  });
  return User;
});
