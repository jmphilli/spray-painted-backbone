// Require.js allows us to configure shortcut alias
// // There usage will become more apparent further along in the tutorial.
require.config({
  paths: {
    jquery: 'libs/jquery',
    underscore: 'libs/underscore',
    backbone: 'libs/backbone',
    openlayers : 'libs/ol'
  },
  shim: {
    openlayers: {
        exports: 'OpenLayers',
        init: function() {
            return this.ol
        }
    }
  }
});

require([
  // Load our app module and pass it to our definition function
  'app',
], function(App){
  // The "app" dependency is passed in as "App"
  App.initialize();
});
