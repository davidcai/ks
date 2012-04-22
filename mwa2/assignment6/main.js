(function($) {

  var TEMPLATE_ARTICLE =
    '<article>' + 
      '<img src="{image}"></img>' + 
      '<div class="content">' + 
        '<h2>{from}</h2><p>{text}</p>' + 
      '</div>' + 
    '</article>';

  var geocoder = new google.maps.Geocoder();


  /**
   * Main function
   * @method main
   */
  function main() {
    findCity({
        success: function(strCityName) {
          console.log('City = ' + strCityName);
          search(strCityName);
        }
      , error: function(strMessage) {
          console.log(strMessage);
          var strCityName = promptForCityName();
          // search(strCityName);
        }
    });
  }


  /**
   * Get geo location to find city.
   * @method findCity
   * @param {object} cfg  Configuration object.
   *  <ul>
   *    <li>{function} success  Success callback. Accepts a city name.</li>
   *    <li>{function} error    Error callback. Accepts an error message.</li>
   *  </ul>
   */
  function findCity(cfg) {
    if (navigator.geolocation) {
      function success(position) {
        console.log('Found location');
        
        __findCity({
            lat: position.coords.latitude
          , lng: position.coords.longitude
          , success: cfg.success
          , error: cfg.error
        });
      }

      function error() {
        cfg.error('Cannot find location');
      }

      navigator.geolocation.getCurrentPosition(success, error);
    }
    else {
      cfg.error('No geolocation support');
    }
  }


  /**
   * Prompt user to input a city name.
   * @method promptForCityName
   * @return {string} City name
   */
  function promptForCityName() {
    var strCityName;

    // [start] For testing only
    __findCity({
        lat: 37.441883 
      , lng: -122.143019
      , success: search
      , error: function() { console.log('Cannot find city'); }
    });
    // [end]

    return strCityName;
  }


  /**
   * Find city name by latitude and longitude.
   * @method __findCity
   * @private
   * @param {object} cfg  Configuration object. 
   *  <ul>
   *    <li>{float} lat         Latitude</li>
   *    <li>{float} lng         Longitude</li>
   *    <li>{function} success  Success callback. Accepts a city name.</li>
   *    <li>{function} error    Error callback. Accepts an error message.</li>
   *  </ul>
   */
  function __findCity(cfg) {
    var latlng = new google.maps.LatLng(cfg.lat, cfg.lng);

    geocoder.geocode({latLng: latlng}, function(lstResults, status) {
      var strCityName;

      if (status === google.maps.GeocoderStatus.OK) {
        console.log(lstResults);

        // Looking for address component with type='locality'
        if (lstResults[0]) {
          var lstAddrComps = lstResults[0].address_components;
          for (var i = 0; i < lstAddrComps.length; i++) {

            var lstTypes = lstAddrComps[i].types;
            for (var j = 0; j < lstTypes.length; j++) {
              if (lstTypes[j] === 'locality') {
                strCityName = lstAddrComps[i].long_name;
                break;
              } 
            } // /for j
          } // /for i

        } // /if (lstResults[0])
      } // /if (status === ...)

      if (strCityName) {
        cfg.success(strCityName);
      }
      else {
        cfg.error('Cannot find city');
      }

    }); // /geocoder.geocode
  }


  /**
   * Search twitter by city name.
   * @method search
   * @param {string} strCityName  City name.
   */
  function search(strCityName) {
    $.ajax({
        url: 'http://search.twitter.com/search.json?q=' + 
          encodeURIComponent(strCityName) + 
          '&rpp=20&result_type=recent&include_entities=true'
      , dataType: 'jsonp'
      , success: list
      , error: function($xhr, stat, err) {
          console.log(stat);
          console.log(err);
        }
    });
  }


  /**
   * Parse twitter response and list all results.
   * @method list
   * @param {object} data   Twitter response data.
   */
  function list(data) {
    console.log(data);

    var $results = $('#results');
    var lstResults = data.results;

    $results.empty();

    if (lstResults) {
      for (var i = lstResults.length - 1; i >= 0; i--) {
        var result = lstResults[i];

        // console.log('from: ' + result.from_user_name + ' text: ' + result.text);
        prepend($results, result);
      }
    }
  }


  /** 
   * Create HTML element for each result and prepend it to the results list.
   * @method prepend
   * @param {object} $results   The jQuery enhanced results list.
   * @param {object} result     The tweet result to prepend.
   */
  function prepend($results, result) {
    var strText = result.text;
    
    if (result.entities && result.entities.urls) {

      for (var i = 0; i < result.entities.urls.length; i++) {
        var url = result.entities.urls[i]; 
        var strLink = 
          '<a href="' + url.expanded_url + '" target="_blank">' + 
            url.display_url + 
          '</a>';

        strText = strText.replace(url.url, strLink);
      }
    }

    $results.prepend(TEMPLATE_ARTICLE
      .replace('{image}', result.profile_image_url)
      .replace('{from}', result.from_user_name)
      .replace('{text}', strText)
    );
  }


  // Start rolling
  main();


})(jQuery);
