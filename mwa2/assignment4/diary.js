(function($) {

  $('#page_list #btn_add').on('click', add);

  $('#page_add #btn_save').on('click', save);

  $('#page_add #btn_cancel').on('click', cancel);

  $('#page_list .entries article').on('click', function() { slide($(this)); });


  function add() {
    $('body').attr('data-mode', 'add');
  }


  function save() {
    $('body').attr('data-mode', 'list');
  }


  function cancel() {
    $('body').attr('data-mode', 'list');
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
