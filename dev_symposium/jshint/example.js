/* jshint
    curly: true,
    forin: true,
    latedef: nofunc,
    plusplus: true,
    undef: true,
    unused: false,
    laxcomma: true
*/
/* global console */

function hello() {

  test(hello);

  function test(msg) {
    $('#test').html(msg); // global
    console.log(msg);
  }

  var hello = 'David'; //latedef
  if (hello)
    console.log('hello!'); // curly

  var map = {};
  for (var key in map) { // forin
    console.log(key);
  }

  var i = 0;
  i--; // plusplus

  var firstName = "David";
  console.log(firstname); //undef

  var a = 1
    , b = 2; // laxcomma
}

var FE = {};