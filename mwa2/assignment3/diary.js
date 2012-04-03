(function($) {

  $('section.entries article').on('click', function() {
    slide($('.content_w', this)); 
  });

  function slide($wrapper) {
    var contentHeight = $('.content', $wrapper).outerHeight(true);
    var height = $wrapper.height();

    $wrapper.toggleClass('open');
    if ($wrapper.hasClass('open')) {
      setTimeout(function() {
        $wrapper.addClass('transition').css('height', contentHeight);
      }, 10);
    }
    else {
      $wrapper.css('height', height);
      setTimeout(function() {
        $wrapper.addClass('transition').css('height', 0);
      }, 10);
    }

    $wrapper.one('transitionEnd webkitTransitionEnd transitionend oTransitionEnd msTransitionEnd', function() {
      if($wrapper.hasClass('open')) {
        $wrapper.removeClass('transition').css('height', 'auto');
      }
    });
  }

})(jQuery);
