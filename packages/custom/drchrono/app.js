'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Drchrono = new Module('drchrono');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Drchrono.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Drchrono.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Drchrono.menus.add({
    title: 'drchrono example page',
    link: 'drchrono example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Drchrono.aggregateAsset('css', 'drchrono.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Drchrono.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Drchrono.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Drchrono.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Drchrono;
});
