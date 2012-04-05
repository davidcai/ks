(function($) {

  $('section.entries article').on('click', function() {
    slide($(this)); 
  });

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
