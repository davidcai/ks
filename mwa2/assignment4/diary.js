(function($) {

  var TEMPLATE_ENTRY = 
    '<article>' + 
      '<h2>{title}</h2>' + 
      '<div class="content_w">' + 
        '<div class="content">{body}</div>' + 
      '</div>' + 
    '</article>';

  var TEMPLATE_LOCATION = 
    '<div class="lbl_location">' + 
      '<label>Lat: </label><span>{latitude}</span>' + 
      '<label>Lng: </label><span>{longitude}</span>' + 
    '</div>';

  var bFoundLocation = false;


  function getEntries() {
    var lstEntries = [];

    var strEntries = localStorage.getItem('entries');
    if (strEntries) {
      lstEntries = JSON.parse(strEntries) || [];
    }

    console.log('# of entries = ' + lstEntries.length);
    return lstEntries;
  }


  function list() {
    var lstEntries = getEntries();
    var nLength = lstEntries.length;

    for(var i = 0; i < nLength; i++) {
      show(lstEntries[i]);
    }
  }


  function show(entry) {
    var strBody = entry.body;
    if (entry.hasLocation === true) {
      strBody += TEMPLATE_LOCATION
        .replace('{latitude}', entry.latitude)
        .replace('{longitude}', entry.longitude);
    }

    var strEntry = TEMPLATE_ENTRY.replace('{title}', entry.title).replace('{body}', strBody);

    $('section.entries').prepend(strEntry);
    console.log('Prepended entry: ' + entry.title);
  }


  function add() {
    $('body').attr('class', 'mode_add');

    var $statusBar = $('#geo_status');
    $statusBar.html('Detecting your location...');
    console.log('Detecting loction...');

    bFoundLocation = false;
    if (navigator.geolocation) {
      function success(position) {
        console.log('Found location');
        bFoundLocation = true;
        $statusBar.html('Your location:');
        $('#geo_coords').show();
        $('#geo_coords_latitude span').html(position.coords.latitude || 'unknown');
        $('#geo_coords_longitude span').html(position.coords.longitude || 'unknown');
      }

      function error() {
        console.log('Cannot find location');
        bFoundLocation = false;
        $statusBar.html('Cannot find your location');
        $('#geo_coords').hide();
      }

      navigator.geolocation.getCurrentPosition(success, error);
    }
  }


  function save() {
    var entry = {
      title: $('#new_entry_title').val() || 'empty'
    , body: $('#new_entry_body').val() || 'empty'
    };

    if (bFoundLocation === true) {
      entry.hasLocation = true;
      entry.latitude = $('#geo_coords_latitude span').text();
      entry.longitude = $('#geo_coords_longitude span').text();

      console.log('Saved location');
    }

    var lstEntries = getEntries();
    lstEntries.push(entry);
    localStorage.setItem('entries', JSON.stringify(lstEntries));
    console.log('Saved new entry to localStorage');

    show(entry);

    $('body').attr('class', 'mode_list');
    clearNewEntry();
  }


  function cancel() {
    $('body').attr('class', 'mode_list');
    clearNewEntry();
  }


  function clearNewEntry() {
    $('#new_entry_title').val('');
    $('#new_entry_body').val('');
    $('#geo_coords').hide();
  }


  function slide($article) {
    var $wrapper = $('.content_w', $article);
    var $content = $('.content', $wrapper);
    var nWrapperHeight = $wrapper.height();
    var nContentHeight = $content.outerHeight(true);
    console.log('Wrapper height = ' + nWrapperHeight + ' Content height = ' + nContentHeight);

    $article.toggleClass('open');
    if ($article.hasClass('open')) {
      setTimeout(function() {
        $wrapper.addClass('transition').css('height', nContentHeight);
      }, 10);
    }
    else {
      setTimeout(function() {
        $wrapper./*removeClass('transition').*/css('height', nWrapperHeight);
        setTimeout(function() {
          $wrapper.addClass('transition').css('height', 0);
        }, 10);
      }, 10);
    }

    $wrapper.one('transitionEnd webkitTransitionEnd transitionend oTransitionEnd msTransitionEnd', function() {
      if ($article.hasClass('open')) {
        $wrapper.removeClass('transition').css('height', 'auto');
        console.log('Changed height back to auto');
      }
    });
  }


  (function init() {
    list();
    console.log('Displayed all entries');

    $('#page_list #btn_add').on('click', add);

    $('#page_add #btn_save').on('click', save);

    $('#page_add #btn_cancel').on('click', cancel);

    $('#page_list .entries article').live('click', function() { slide($(this)); });
  })();
  
})(jQuery);
