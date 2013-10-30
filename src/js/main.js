(function() {
  $(function() {
    return $("a").on('mouseover', function(e) {
      var URL_REGEX, repository, url, user;
      url = $(this).attr('href');
      URL_REGEX = '^(https:\/\/github.com)?\/([a-zA-Z0-9_\.\-]+)\/([a-zA-Z0-9_\.\-]+)\/?$';
      if (url.match(URL_REGEX)) {
        user = RegExp.$2;
        return repository = RegExp.$3;
      }
    });
  });

}).call(this);
