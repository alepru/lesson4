(function(angular) {


    angular.module('todoApp', ['ngMaterial']).config(function($mdThemingProvider) {

  $mdThemingProvider.theme('default')
    .primaryPalette('blue', {
      'default': '500', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '600', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '700', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': '900' // use shade A100 for the <code>md-hue-3</code> class
    })
    // If you specify less than all of the keys, it will inherit from the
    // default shades
    .accentPalette('red', {
      'default': '500' // use shade 200 for default, and keep all other shades the same
    });
    })

 
}(angular));