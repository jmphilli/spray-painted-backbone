define([ 'underscore', 'backbone', 'models/authenticated-model' ], function(_, Backbone, AuthenticatedModel){
  var Location = AuthenticatedModel.extend({
    urlRoot : '/api/locations',
    defaults: {
      id: null,
      latitudeLongitudesId: null,
      locale1: "",
      localeCode1: 0
    }
  });
  return Location;
});
