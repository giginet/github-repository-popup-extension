(function() {
  $(function() {
    var $powerTip, API_BASE, URL_REGEX, colors;
    URL_REGEX = '^(https:\/\/github.com)?\/([a-zA-Z0-9_\.\-]+)\/([a-zA-Z0-9_\.\-]+)\/?$';
    API_BASE = 'https://api.github.com';
    colors = {};
    $powerTip = $('<div>');
    $powerTip.attr('id', 'powerTip');
    $('body').append($powerTip);
    $.getJSON(chrome.extension.getURL('/resources/colors.json'), function(json) {
      return colors = json;
    });
    return $("a").on('mouseover', function(e) {
      var $link, repository, url, user;
      $link = $(this);
      url = $link.attr('href');
      if (url.match(URL_REGEX)) {
        user = RegExp.$2;
        repository = RegExp.$3;
        return $.get("" + API_BASE + "/repos/" + user + "/" + repository + "/languages", function(languages) {
          var $circle, $languageLabel, $tip, colorCode, key, language, major, sorted, value;
          sorted = ((function() {
            var _results;
            _results = [];
            for (key in languages) {
              value = languages[key];
              _results.push([key, value]);
            }
            return _results;
          })()).sort(function(a, b) {
            return a[1] < b[1];
          });
          languages = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = sorted.length; _i < _len; _i++) {
              language = sorted[_i];
              _results.push(language[0]);
            }
            return _results;
          })();
          major = languages[0];
          if (!major) {
            return;
          }
          colorCode = colors[major];
          $tip = $('<div>');
          $circle = $('<div>').addClass('language_circle');
          $circle.css({
            'background': colorCode
          });
          $tip.append($circle);
          $languageLabel = $('<span>').addClass('language_name');
          $languageLabel.text(major);
          $tip.append($languageLabel);
          $link.data('powertipjq', $tip);
          $link.powerTip({
            placement: 'nw'
          });
          console.log(major);
          return console.log(colorCode);
        });
      }
    });
  });

}).call(this);
