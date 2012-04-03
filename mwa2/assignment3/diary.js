(function($) {

  $('section.entries article').on('click', function() {
    slide($('.content', this)); 
  });

  function slide($content) {
    var $wrapper = $content.parent();
    var contentHeight = $content.outerHeight(true);
    var wrapperHeight = $wrapper.height();

    $wrapper.toggleClass('open');
    if ($wrapper.hasClass('open')) {
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
      if($wrapper.hasClass('open')) {
        $wrapper.removeClass('transition').css('height', 'auto');
      }
    });
  }

})(jQuery);
