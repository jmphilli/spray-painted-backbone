define([ 'underscore', 'backbone', 'models/user' ], function(_, Backbone, User){
      var UsersCollection = Backbone.Collection.extend({
        model: User,
        url: '/api/users'
      });
      return UsersCollection;
});
