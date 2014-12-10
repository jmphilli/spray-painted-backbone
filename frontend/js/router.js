define([
    'jquery',
    'underscore',
    'backbone',
    'views/login/post',
    'views/users/edit',
    'views/users/list',
    'views/locations/edit'
    ], function($, _, Backbone, LoginView, AdminView, UserView, UserListView, LocationView){
      var Router = Backbone.Router.extend({
        routes: {
                  'login': 'login',
                  'logout' : 'logout',

                  'notLoggedIn' : 'notLoggedIn',

                  'users': 'users',
                  'users/:id': 'getUser',

      // Default
                  '*actions': 'defaultAction'
                },

      login : function() {
                $("#header").empty();
                $("#root").empty();
                var element = $("<div id='LoginView'></div>").appendTo("#root");
                var loginView = new LoginView({el: element});
                loginView.render();
              },
      logout : function() {
                 localStorage.removeItem('login')
                 localStorage.removeItem("user")
                 Backbone.history.navigate("login", {
                    trigger: true
                 });
               },
     notLoggedIn : function() { this.login() },

parseQueryString : function(queryString){
    var params = {};
    if(queryString){
        _.each(
            _.map(decodeURI(queryString).split(/&/g),function(el,i){
                var aux = el.split('='), o = {};
                if(aux.length >= 1){
                    var val = undefined;
                    if(aux.length == 2)
                        val = aux[1];
                    o[aux[0]] = val;
                }
                return o;
            }),
            function(o){
                _.extend(params,o);
            }
        );
    }
    return params;
},

      users : function(){
                    $("#root").empty();
                var element = $("<div id='UsersListView'></div>").appendTo("#root");
                var userCreateView = new UserView({el: element});
                userCreateView.render();
              },
      getUser : function(userId){
                    $("#root").empty();
                    var element = $("<div id='UserView'></div>").appendTo("#root");
                    var userView = new UserView({el: element});
                    userView.renderUser(userId);
                },
      defaultAction : function(actions){
                        console.log('No route:', actions);
                      }
      });

      return Router
    });
