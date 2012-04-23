(function($) {

  /* ************************************************************************ */
  /* Page model                                                               */
  /* ************************************************************************ */

  var Model = function() {
    this.city = null;
    this.twitterMaxId = null;
  };

  Model.prototype.load = function() {
    var model = {};
    if (window.localStorage) {
      console.log('Has localStorage');
      var strModel = localStorage.getItem('mwa2.hw6.model');
      if (strModel) {
        model = JSON.parse(strModel) || {};
      }
    }
    else {
      console.log('No localStorage');
    }

    this.reset();
    if (model.city) {
      this.city = model.city;
    }
    if (model.twitterMaxId) {
      this.twitterMaxId = model.twitterMaxId;
    }
    console.log('Loaded model');
  };

  Model.prototype.save = function() {
    if (window.localStorage) {
      console.log('Has localStorage');
      var model = {
          'city': this.city
        , 'twitterMaxId': this.twitterMaxId
      };
      var strModel = JSON.stringify(model);
      localStorage.setItem('mwa2.hw6.model', strModel);
      console.log('Saved model');
    }
    else {
      console.log('No localStorage');
    }
  };

  Model.prototype.reset = function() {
    this.city = 'Waikiki';
    this.twitterMaxId = '0';
    console.log('Reset model');
  }


  /* ************************************************************************ */
  /* Tweet HTML template                                                      */
  /* ************************************************************************ */

  var TEMPLATE_ARTICLE =
    '<article>' + 
      '<img src="{image}"></img>' + 
      '<div class="content">' + 
        '<h2>{from}</h2><p>{text}</p>' + 
      '</div>' + 
    '</article>';


  /* ************************************************************************ */
  /* jQuery DOM nodes and other shared variables                              */
  /* ************************************************************************ */

  var $lstPages = $('.page');
  var $mapPages = {
      'page_list':      $('#page_list')
    , 'page_edit_city': $('#page_edit_city')
    , 'page_loading':   $('#page_loading')
  }
  var $lblCity = $('#city_name');
  var $lnkEdit = $('#lnk_city_edit');
  var $results = $('#results');
  var $loading = $('#loading');
  var $txtCity = $('#txt_city');
  var $btnAuto = $('#btn_city_auto');
  var $btnSave = $('#btn_city_save');
  var $btnCancel = $('#btn_city_cancel');

  var strCurrentPageId;
  var geocoder = new google.maps.Geocoder();
  var model = new Model();


  /* ************************************************************************ */
  /* Main function                                                            */
  /* ************************************************************************ */

  (function main() {
    model.load();

    // Update the list page 
    console.log('Updating list with stored model');
    updateList();

    // Event handling
    $lnkEdit.on('click', function() { editCity(); });
    $btnAuto.on('click', function() { findCity(); });
    $btnSave.on('click', function() { saveCity(); });
    $btnCancel.on('click', function() { updateList(true); });

    // Check appcache updates every 24 hours
    monitorAppCache();
  })();


  /* ************************************************************************ */
  /* Functions                                                                */
  /* ************************************************************************ */

  /**
   * Prompt user to input a city name.
   * @method editCity
   */
  function editCity() {
    $txtCity.val('');
    showPage('page_edit_city');
  }


  /**
   * Save user input, and update the list page.
   * @saveCity
   */
  function saveCity() {
    var strCity = $txtCity.val();
    console.log('Save city: ' + strCity);

    if (!!strCity.match(/\S/)) { // City name cannot be empty
      model.reset();
      model.city = strCity;
      model.save();

      updateList();
    }
  }


  /**
   * Update the list page. If bSilent is false or not specified, start a new search for the city.
   * @method updateList
   * @param {boolean} bSilent   A flag indicating whether to suppress a new search.
   */
  function updateList(bSilent) {
    console.log('Updating list for city ' + model.city);
    showPage('page_list');

    $lblCity.text(model.city);
    
    if (!!bSilent === false) {
      console.log('Starting a new search ...');
      search(model.city);
    }
    else {
      console.log('bSilent = true. Will not kick off a new search');
    }
  }


  /**
   * @method showPage
   * @param {string} strPageId  Page ID.
   */
  function showPage(strPageId) {
    console.log('Show page ' + strPageId);
    $lstPages.hide();
    $mapPages[strPageId].show();
    strCurrentPageId = strPageId;
  }


  /**
   * Display a loading page with specified message.
   * @method showLoading
   * @param {string} strMessage   Message.
   */
  function showLoading(strMessage) {
    console.log('Show loading page with message ' + strMessage);
    $lstPages.hide();
    $mapPages['page_loading'].show();
    $loading.text(strMessage);
  }


  /**
   * Hide the loading page.
   * @method hideLoading
   */
  function hideLoading() {
    console.log('Hide loading page');
    showPage(strCurrentPageId);
    $loading.text('');
  }


  /**
   * Use geolocation to find city.
   * @method findCity
   */
  function findCity() {
    showLoading('Detecting location');

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(

          // Success
          function(position) {
            console.log('Found geo location');
            var fLat = position.coords.latitude;
            var fLng = position.coords.longitude;
            console.log('(lat, lng) = (' + fLat + ', ' + fLng + ')');
            
            findCityByLatLng({
                lat: fLat
              , lng: fLng
              , success: findCitySuccess
              , error: findCityError
            });
          }

          // Error
        , function() {
            findCityError('Cannot find location');
          }
      );

    }
    else {
      findCityError('No geolocation support');
    }

    function findCitySuccess(strCity) {
      console.log('Found city: ' + strCity);
      hideLoading();
      $txtCity.val(strCity);
    }

    function findCityError(strError) {
      console.log(strError);
      hideLoading();
      $txtCity.val('Cannot find your location').one('click', function() {
        $txtCity.val('');
      });
    }
  }


  /**
   * Find city name by latitude and longitude.
   * @method findCityByLatLng
   * @param {object} cfg  Configuration object. 
   *  <ul>
   *    <li>{float} lat         Latitude</li>
   *    <li>{float} lng         Longitude</li>
   *    <li>{function} success  Success callback. Accepts a city name.</li>
   *    <li>{function} error    Error callback. Accepts an error message.</li>
   *  </ul>
   */
  function findCityByLatLng(cfg) {
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
    showLoading('Loading tweets');

    $.ajax({
        url: 'http://search.twitter.com/search.json?q=' + 
          encodeURIComponent(strCity) + 
          '&rpp=25&result_type=recent&include_entities=true'
      , dataType: 'jsonp'
      , success: list
      , error: function($xhr, stat, err) {
          console.log(stat);
          console.log(err);
          hideLoading();
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
    var strMaxId = data.max_id_str;
    console.log('max_id_str = ' + strMaxId);

    hideLoading();
    $results.empty();

    if (lstResults) {
      for (var i = lstResults.length - 1; i >= 0; i--) {
        var result = lstResults[i];

        // console.log('from: ' + result.from_user_name + ' text: ' + result.text);
        prepend(result);
      }
    }
  }


  /** 
   * Create HTML element for each result and prepend it to the results list.
   * @method prepend
   * @param {object} result     The tweet result to prepend.
   */
  function prepend(result) {
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


  /**
   * Monitor application cache updates every 24 hours. Prompt users if updates are found.
   * @method monitorAppCache
   */
  function monitorAppCache() {
    if (window.applicationCache) {
      console.log('Has applicationCache');
      
      $(document).ready(function() {
        applicationCache.addEventListener('updateready', function(e) {
          console.log('applicationCache: updateready');
          applicationCache.swapCache();
          console.log('applicationCache: swapped cache');
          if (confirm('A new version of this application is available. Do you want to use it?')) {
            location.reload();
          }
        }, false);
      });

      setInterval(function() { applicationCache.update() }, 24 * 60 * 60 * 1000);
    }
  }

})(jQuery);
