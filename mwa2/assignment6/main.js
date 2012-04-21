(function($) {

  var TEMPLATE_ARTICLE =
    '<article>' + 
      '<img src="{image}"></img>' + 
      '<div class="content">' + 
        '<h2>{from}</h2>' + 
        '<p>{text}</p>' + 
      '</div>' + 
    '</article>';


  function search() {
    $.ajax({
      url: 'http://search.twitter.com/search.json?q=%23guildwars2&rpp=20&result_type=recent&include_entities=true'
      , dataType: 'jsonp'
      , success: list
      , error: function($xhr, stat, err) {
        console.log(stat);
        console.log(err);
      }
    });
  }


  function list(data) {
    console.log(data);

    var $results = $('#results');
    var lstResults = data.results;
    var length = lstResults.length;

    $results.empty();

    for (var i = length - 1; i >= 0; i--) {
      var result = lstResults[i];

      console.log('from: ' + result.from_user_name + ' text: ' + result.text);
      prepend($results, result);
    }
  }


  function prepend($results, result) {
    var strText = result.text;
    
    if (result.entities && result.entities.urls) {

      var length = result.entities.urls.length;
      for (var i = 0; i < length; i++) {
        var url = result.entities.urls[i]; 
        var strLink = 
          '<a href=\u0022' + url.expanded_url + '\u0022 target=\u002_blank\u00222>' + 
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


  search();

})(jQuery);
