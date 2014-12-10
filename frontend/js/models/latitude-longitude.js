define([ 'underscore', 'backbone', 'models/authenticated-model' ], function(_, Backbone, AuthenticatedModel){
  var LatitudeLongitude = AuthenticatedModel.extend({
    urlRoot : '/api/latitude-longitude',
    defaults: {
      id: null,
      latitude: 0.0,
      longitude:0.0
    }
  });
  return LatitudeLongitude;
});
