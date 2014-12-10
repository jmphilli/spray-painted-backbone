define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/home/notLoggedIn.html'
    ], function($, _, Backbone, notLoggedInTemplate){
      var NotLoggedInView = Backbone.View.extend({
        render: function(){
          var compiledTemplate = _.template(notLoggedInTemplate)
          this.$el.html( compiledTemplate );
        }
      });
      return NotLoggedInView;
    });
