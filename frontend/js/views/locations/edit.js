define([
    'jquery',
    'underscore',
    'backbone',
    'models/user',
    'models/dispensary',
    'models/location',
    'models/latitude-longitude',
    'text!templates/locations/edit.html'
    ], function($, _, Backbone, User, Dispensary, Location, LatitudeLongitude, locationTemplate){
      var LocationView = Backbone.View.extend({
        events: {
                  'click #postLocation': 'postLocation',
                  'click #updateLocation': 'updateLocation',
                  'click #deleteLocation': 'deleteLocation',
                  'click #addressSearch' : 'addressSearch'
                },
        updateUser : function(userId) {
            //get user
            var user = new User({id : userId})
            user.fetch({success : function(data) {
              data.set("userType", "dispensary")
              data.save(null, {success : function(model, response) {
                                                   Backbone.history.navigate("adminHome", {
                                                     trigger : true
                                                   });
              }})
            }})
        },
        postLocation: function (event) {

          var that = this
          var latitude = parseFloat($('#latitude').val())
          var longitude = parseFloat($('#longitude').val())
          var dispensaryLatLon = new LatitudeLongitude({latitude : latitude,
                                                       longitude : longitude})
//TODO make these into funcs!
          dispensaryLatLon.save(null, {
            success : function(model, response) {
                       var dispensaryLatLonId = model.get('id')
                       var locale1 = $('#locale1').val()
                       var localeCode1 = parseInt($('#localeCode1').val())
                       var dispensaryLocation = new Location({latitudeLongitudesId : dispensaryLatLonId,
                                                                           locale1 : locale1,
                                                                       localeCode1 : localeCode1})
                       dispensaryLocation.save(null, {
                         success : function(dispensaryLocationResult, response) {
                                     var dispensaryLocationId = dispensaryLocationResult.get("id")
                                     var dispensaryName = $('#dispensary-name').val()
                                     var dispensaryUserId = parseInt($('#dispensary-user-id').val())
                                     var dispensary = new Dispensary({userId : dispensaryUserId, 
                                                                 locationsId : dispensaryLocationId, 
                                                                        name : dispensaryName})
                                     dispensary.save(null, {
                                       success : function(dispensaryResult, response) {
                                                   that.updateUser(dispensaryUserId)
                                                 } 
                                     })
                                   }
                       })
                     }
          })


        },
        updateLocation : function(event) {
          alert("update loc")
        }, 
        deleteLocation : function(event) {
          alert("delete loc")
        },
        addressSearch : function(event) {
            var that = this
            var locale1 = $('#locale1').val()
            var zipcode = $('#localeCode1').val()
            var addressSearchRequest = $.ajax({
              url : 'http://nominatim.openstreetmap.org/search?format=json&postalcode=' + zipcode + '&street=' + locale1,
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              type : 'GET'
            });
            addressSearchRequest.done(function(response){
              var firstObject = response[0]
              var latitude = firstObject.lat
              var longitude = firstObject.lon
              $('#latitude').val(latitude)
              $('#longitude').val(longitude)
              $('#locale1').addClass("success")
              $('#localeCode1').addClass("success")
            });
            addressSearchRequest.fail(function(){
              $('#locale1').addClass("failure")
              $('#localeCode1').addClass("failure")
            });
        },
        render: function(dispensary){
          var compiledTemplate = _.template(locationTemplate)({dispensary: dispensary})
          this.$el.html( compiledTemplate );
        }
      });
      return LocationView;
    });
