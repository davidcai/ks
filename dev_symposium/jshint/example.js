/* jshint curly: true, forin: true, undef: true, unused: false */
/* global console */

function doSomething() {
  var hello = '1',
      map = {};

  if (hello) {
    console.log('hello!');
    for (var key in map) {
      console.log(key);
    }
  }
}