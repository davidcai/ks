(function($) {

  var TEMPLATE_ENTRY = 
    '<article>' + 
      '<h2>{title}</h2>' + 
      '<div class="content_w">' + 
        '<div class="content">{body}</div>' + 
      '</div>' + 
    '</article>';


  function list() {
    var lstEntries = JSON.parse(localStorage.getItem('entries')) || [];
    var nLength = lstEntries.length;

    for(var i = 0; i < nLength; i++) {
      show(lstEntries[i]);
    }
  }


  function show(entry) {
    var $section = $('section.entries');
    var strEntry = TEMPLATE_ENTRY.replace('{title}', entry.title).replace('{body}', entry.body);

    $section.prepend(strEntry);
  }


  function add() {
    $('body').attr('class', 'mode_add');

    if (navigator.geolocation) {
      var $statusBar = $('#geo_status');

      function success(position) {
        $statusBar.html('Your location:');
        $('#geo_coords').show();
        $('#geo_coords_latitude').html('Latitude: ' + (position.coords.latitude || 'unknown'));
        $('#geo_coords_longitude').html('Longitude: ' + (position.coords.longitude || 'unknown'));
        $('#geo_coords_altitude').html('Altitude: ' + (position.coords.altitude || 'unknown'));
      }

      function error() {
        $statusBar.html('Cannot find your location');
        $('#geo_coords').hide();
      }

      navigator.geolocation.getCurrentPosition(success, error);
    }
  }


  function save() {
    var entry = {
      title: $('#new_entry_title').val() || 'empty', 
      body: $('#new_entry_body').val() || 'empty'
    };

    var lstEntries = JSON.parse(localStorage.getItem('entries')) || [];
    lstEntries.push(entry);
    localStorage.setItem('entries', JSON.stringify(lstEntries));

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
  }


  function slide($article) {
    var $wrapper = $('.content_w', $article);
    var $content = $('.content', $wrapper);
    var strWrapperHeight = $wrapper.height();
    var strContentHeight = $content.outerHeight(true);

    $article.toggleClass('open');
    if ($article.hasClass('open')) {
      setTimeout(function() {
        $wrapper.addClass('transition').css('height', strContentHeight);
      }, 10);
    }
    else {
      setTimeout(function() {
        $wrapper./*removeClass('transition').*/css('height', strWrapperHeight);
        setTimeout(function() {
          $wrapper.addClass('transition').css('height', 0);
        }, 10);
      }, 10);
    }

    $wrapper.one('transitionEnd webkitTransitionEnd transitionend oTransitionEnd msTransitionEnd', function() {
      if ($article.hasClass('open')) {
        $wrapper.removeClass('transition').css('height', 'auto');
      }
    });
  }


  (function init() {
    list();

    $('#page_list #btn_add').on('click', add);

    $('#page_add #btn_save').on('click', save);

    $('#page_add #btn_cancel').on('click', cancel);

    $('#page_list .entries article').live('click', function() { slide($(this)); });
  })();
  
})(jQuery);
