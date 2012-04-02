(function($) {

  // max-height transition. 
  // Inspired by http://jsfiddle.net/adambiggs/MAbD3/
  function toggleContent($contentWrapper) {
    var contentHeight = $('.content', $contentWrapper).outerHeight(true);

    $contentWrapper.toggleClass('open');
    if ($contentWrapper.hasClass('open')) {
      $contentWrapper.css('max-height', contentHeight);
    }
    else {
      $contentWrapper.css('max-height', 0);
    }
  }

  $('section.entries article').on('click', function(e) {
    e.preventDefault();

    toggleContent($('.content_w', this)); 
  });

})(jQuery);
