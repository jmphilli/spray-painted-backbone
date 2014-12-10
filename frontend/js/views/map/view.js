define([
    'jquery',
    'underscore',
    'backbone',
    'openlayers',
    'text!templates/map/map.html'
    ], function($, _, Backbone, OpenLayers, mapTemplate){
      var MapView = Backbone.View.extend({
        initialize : function(options) {
                       _.extend(this, _.pick(options, "latitudeLongitude"))
                       //_.extend(this, _.pick(options, "productDetails"))
                       this.hasLocation = false
                       this.lat = 0
                       this.lon = 0
                       this.zoomLevel = 2
                       if(typeof this.latitudeLongitude != "undefined") {
                         this.lat = this.latitudeLongitude.latitude
                         this.lon = this.latitudeLongitude.longitude
                         this.hasLocation = true
                         this.zoomLevel = 15
                       }
                     },
        latLonToCoordinate : function(latitude, longitude) {
          var coords = OpenLayers.proj.transform([longitude, latitude], "EPSG:4326", "EPSG:900913")
          return coords
        },
        privateRender : function() {
          var compiledTemplate = _.template(mapTemplate)
          this.$el.html( compiledTemplate );
          var view = new ol.View({
            center: this.latLonToCoordinate(this.lat, this.lon),
            zoom: this.zoomLevel
          });

          var map = new ol.Map({
            layers: [
              new ol.layer.Tile({
                source: new ol.source.OSM({url : 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'})
              })
            ],
            target: 'map',
            controls: ol.control.defaults({
              attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
              })
            }),
            view: view
          });
        
          this.view = view;
          this.map = map;
            
        },
        renderOrders : function(orders) {
          this.privateRender()
          var that = this
          var view = this.view
          var map = this.map
    
          var token = localStorage.getItem("login")
          var i = 0;
          var j = 0;
          var featuresArray = [];
          for (i = 0; i < orders.length; i++) {
            $.ajax({
              url : '/api/locations/' + orders[i].locationId + '/latitudeLongitude',
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              beforeSend: function (request) {
                request.setRequestHeader("instantgram-auth", token);
              },
              success : function(data) {
                j++;
                var lat = data.latitude
                var lon = data.longitude
                var coords = that.latLonToCoordinate(lat, lon)
                var positionFeature = new ol.Feature();
                positionFeature.setGeometry(new ol.geom.Point(coords))
                featuresArray.push(positionFeature)
                if(j == orders.length) {
                  //we're done
                  that.addFeatures(map, featuresArray)
                }
              },
              type : 'GET'
            })
          }

        },
        addFeatures : function(map, featuresArray) {
          var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
              anchor: [0.5, 46],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              opacity: 0.75,
              src: 'http://ol3js.org/en/master/examples/data/icon.png'
            }))
          });
          var vectorSource = new ol.source.Vector({ features : featuresArray })
          var vectorLayer = new ol.layer.Vector({source : vectorSource, style : iconStyle })

          map.addLayer(vectorLayer)

          var bounds = vectorSource.getExtent()
          map.getView().fitExtent(bounds, map.getSize())
        },
        render: function(){

         this.privateRender()
         var map = this.map
         var view = this.view

         // update the HTML page when the position changes.
         var positionFeature = new ol.Feature();
         var that = this
         if(!this.hasLocation) {
           var geolocation = new ol.Geolocation({
             projection: view.getProjection(),
             tracking: true
           });
           geolocation.on('change', function() {
             view.setCenter(geolocation.getPosition());
             view.setZoom(15);
             var pair = OpenLayers.proj.transform(geolocation.getPosition(), "EPSG:900913", "EPSG:4326")
             var lat = pair[1]
             var lon = pair[0]
             that.lat = lat
             that.lon = lon
             that.reverseGeocode()
           });
           // handle geolocation error.
           geolocation.on('error', function(error) {
             var info = $('#info');
             info.innerHTML = error.message;
             info.style.display = '';
           });
           positionFeature.bindTo('geometry', geolocation, 'position')
             .transform(function() {}, function(coordinates) {
               return coordinates ? new ol.geom.Point(coordinates) : null;
             });
         } else {
           positionFeature.setGeometry(new ol.geom.Point(this.latLonToCoordinate(this.lat, this.lon)))
         }

                  
         var featuresOverlay = new ol.FeatureOverlay({
           map: map,
           features: [positionFeature]
         });

        },
        reverseGeocode : function() {
          var that = this
          var addressSearchRequest = $.ajax({
            url : 'http://nominatim.openstreetmap.org/reverse?format=json&zoom=18&addressdetails=1&lat=' + this.lat + '&lon=' + this.lon,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type : 'GET'
          });
          addressSearchRequest.done(function(response) {
            var house = response.address.house
            var road = response.address.road
            if(typeof house != 'undefined' && typeof road != 'undefined') {
              that.locale1 = house + ' ' + road
            } else if(typeof road != 'undefined') {
              that.locale1 = road
            } else {
              that.locale1 = ""
            }
            that.localeCode1 = parseInt(response.address.postcode)
            $('#checkout').removeClass("disabled")
            $('#checkout').addClass("enabled")
          })
        },
      });
      return MapView;
    });
