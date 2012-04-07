(function($) {

  $('#page_list #btn_add').on('click', add);

  $('#page_add #btn_save').on('click', save);

  $('#page_add #btn_cancel').on('click', cancel);

  $('#page_list .entries article').on('click', function() { slide($(this)); });


  function add() {
    $('body').attr('data-mode', 'add');

    if (navigator.geolocation) {
      var $status = $('#geo_status');

      function success(position) {
        $status.text('Your location:');
        $('#geo_coords').show();
        $('#geo_coords_latitude').text('Latitude: ' + (position.coords.latitude || 'unknown'));
        $('#geo_coords_longitude').text('Longitude: ' + (position.coords.longitude || 'unknown'));
        $('#geo_coords_altitude').text('Altitude: ' + (position.coords.altitude || 'unknown'));
      }

      function error(msg) {
        $status.text('Cannot locate your location');
        $('#geo_coords').hide();
      }

      navigator.geolocation.getCurrentPosition(success, error);
    }
  }


  function save() {
    $('body').attr('data-mode', 'list');
    clearNewEntry();
  }


  function cancel() {
    $('body').attr('data-mode', 'list');
    clearNewEntry();
  }


  function clearNewEntry() {
    $('#new_entry_title').val('');
    $('#new_entry_body').val('');
  }


  function slide($article) {
    var $wrapper = $('.content_w', $article);
    var $content = $('.content', $wrapper);
    var wrapperHeight = $wrapper.height();
    var contentHeight = $content.outerHeight(true);

    $article.toggleClass('open');
    if ($article.hasClass('open')) {
      setTimeout(function() {
        $wrapper.addClass('transition').css('height', contentHeight);
      }, 10);
    }
    else {
      setTimeout(function() {
        $wrapper./*removeClass('transition').*/css('height', wrapperHeight);
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

})(jQuery);
