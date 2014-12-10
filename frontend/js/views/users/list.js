define([
    'jquery',
    'underscore',
    'backbone',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    'collections/users',
    'text!templates/users/list.html'
    ], function($, _, Backbone, UsersCollection, userListTemplate){
      var UserListView = Backbone.View.extend({
        el: $('#root'),
      render: function(){
        // Using Underscore we can compile our template with data
        var data = {};
        this.collection = new UsersCollection();
        var compiledTemplate = _.template( userListTemplate, data );
        // Append our compiled template to this Views "el"
        this.$el.append( compiledTemplate );
      }
      });
      // Our module now returns our view
      return UserListView;
    });
