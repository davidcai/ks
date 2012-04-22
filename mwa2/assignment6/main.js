(function($) {

  // Tweet HTML template
  var TEMPLATE_ARTICLE =
    '<article>' + 
      '<img src="{image}"></img>' + 
      '<div class="content">' + 
        '<h2>{from}</h2><p>{text}</p>' + 
      '</div>' + 
    '</article>';

  // Google Geocoder
  var geocoder = new google.maps.Geocoder();

  // jQuery DOM nodes
  var $lstPages = $('.page');
  var $mapPages = {
      'page_list':      $('#page_list')
    , 'page_edit_city': $('#page_edit_city')
  }
  var $lblCity = $('#city_name');
  var $lnkEdit = $('#lnk_city_edit');
  var $results = $('#results');
  var $txtCity = $('#txt_city');
  var $btnSave = $('#btn_city_save');
  var $btnCancel = $('#btn_city_cancel');


  /**
   * Main function
   * @method main
   */
  function main() {
    findCity(success, error);

    // Found city
    function success(strCity) {
      updateCity(strCity);
    }
    
    // Cannot find city
    function error(strMessage) {
      console.log(strMessage);
      askCity();
    }

    // Edit city
    $lnkEdit.on('click', function() {
      showPage('page_edit_city');
    });

    // Save city
    $btnSave.on('click', function() {
      var strCity = $txtCity.val();
      console.log('Save city: ' + strCity);

      if (!!strCity.match(/\S/)) { // City name is not empty
        showPage('page_list');
        updateCity(strCity);
        // updateCity(strCity, true);

        // TODO: Save city in localstorage
      }
    });

    // Cancel editing city
    $btnCancel.on('click', function() {
      $txtCity.val('');
      showPage('page_list');
    });
  }


  /**
   * Get geo location to find city.
   * @method findCity
   * @param {function} fnSuccess  Success callback. Accepts a city name.
   * @param {function} fnError    Error callback. Accepts an error message.
   */
  function findCity(fnSuccess, fnError) {
    if (navigator.geolocation) {

      function success(position) {
        console.log('Found location');
        
        __findCity({
            lat: position.coords.latitude
          , lng: position.coords.longitude
          , success: fnSuccess
          , error: fnError
        });
      }

      function error() {
        fnError('Cannot find location');
      }

      navigator.geolocation.getCurrentPosition(success, error);
    }
    else {
      fnError('No geolocation support');
    }
  }


  /**
   * Prompt user to input a city name.
   * @method askCity
   */
  function askCity() {
    showPage('page_edit_city');

    // [start] For testing only
    // __findCity({
    //     lat: 37.441883 
    //   , lng: -122.143019
    //   , success: search
    //   , error: function() { console.log('Cannot find city'); }
    // });
    // [end]
  }


  /**
   * Update city. If bSilent is false or not specified, start a new search for the city.
   * @method updateCity
   * @param {string} strCity    City name.
   * @param {boolean} bSilent   A flag indicating whether to suppress a new search.
   */
  function updateCity(strCity, bSilent) {
    console.log('City = ' + strCity);

    if (strCity && !!strCity.match(/\S/)) { // City name is not empty
      $lblCity.text(strCity);
      
      if (!!bSilent === false) {
        console.log('Starting a new search ...');
        search(strCity);
      }
      else {
        console.log('bSilent = true. Will not kick off a new search');
      }
    }
  }


  /**
   * @method showPage
   * @param {string} strPageId  Page ID.
   */
  function showPage(strPageId) {
    $lstPages.hide();
    $mapPages[strPageId].show();
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
      var strCity;

      if (status === google.maps.GeocoderStatus.OK) {
        console.log(lstResults);

        // Looking for address component with type='locality'
        if (lstResults[0]) {
          var lstAddrComps = lstResults[0].address_components;
          for (var i = 0; i < lstAddrComps.length; i++) {

            var lstTypes = lstAddrComps[i].types;
            for (var j = 0; j < lstTypes.length; j++) {
              if (lstTypes[j] === 'locality') {
                strCity = lstAddrComps[i].long_name;
                break;
              } 
            } // /for j
          } // /for i

        } // /if (lstResults[0])
      } // /if (status === ...)

      if (strCity) {
        cfg.success(strCity);
      }
      else {
        cfg.error('Cannot find city');
      }

    }); // /geocoder.geocode
  }


  /**
   * Search twitter by city name.
   * @method search
   * @param {string} strCity  City name.
   */
  function search(strCity) {
    $.ajax({
        url: 'http://search.twitter.com/search.json?q=' + 
          encodeURIComponent(strCity) + 
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
