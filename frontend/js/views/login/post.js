define([
    'jquery',
    'underscore',
    'backbone',
    'models/user',
    'text!templates/login/post.html'
    ], function($, _, Backbone, User, loginTemplate){
      var LoginView = Backbone.View.extend({
        events: {
                  'click #postLogin': 'postLogin',
                  'keyup #password' : 'postLoginEnter'
                },
        postLogin: function (event) {
          var username = $('#username').val()
          var password = $('#password').val()
          var user = new User({username: username, password: password});
          user.login(username, password);
        },
        postLoginEnter: function(event) {
          if(event.keyCode == 13) {
            this.postLogin(event)
          }
        },
        render: function(){
          var compiledTemplate = _.template(loginTemplate)
          this.$el.html( compiledTemplate );
        }
      });
      return LoginView;
    });
