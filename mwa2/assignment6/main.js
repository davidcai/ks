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
      url: 'http://search.twitter.com/search.json?q=%23guildwars2&rpp=20&result_type=recent'
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

    var $results = $('#results')
      , lstResults = data.results
      , i
      , length = lstResults.length
      , result;

    $results.empty();

    for(i = 0; i < length; i++) {
      result = lstResults[i];

      console.log('from: ' + result.from_user_name + ' text: ' + result.text);

      $results.append(TEMPLATE_ARTICLE
        .replace('{image}', result.profile_image_url)
        .replace('{from}', result.from_user_name)
        .replace('{text}', result.text));
    }
  }


  search();

})(jQuery);
