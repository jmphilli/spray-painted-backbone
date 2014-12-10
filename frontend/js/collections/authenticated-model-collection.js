define([ 'underscore', 'backbone', 'router' ], function(_, Backbone, Router){
  var AuthenticatedModelCollection = Backbone.Collection.extend({
    sync : function(method, model, options) {

          if( model ) {
            options.contentType = 'application/json';
          }

          options.error = function(error){
            if (error.status == 401 || error.status == 403) {
              Backbone.history.navigate("login", {
                    trigger: true
                });
            }
          }

          var token = localStorage.getItem("login")
          options.headers = options.headers || {};
          _.extend(options.headers, { 'instantgram-auth': token });

          return Backbone.sync.call( this, method, model, options );
        }
  });
  return AuthenticatedModelCollection;
});
