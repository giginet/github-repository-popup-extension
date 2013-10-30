(function() {
  $(function() {
    var $powerTip, API_BASE, UNKNOWN_COLOR, URL_REGEX, cache, colors;
    URL_REGEX = '^(https:\/\/github.com)?\/([a-zA-Z0-9_\.\-]+)\/([a-zA-Z0-9_\.\-]+)\/?$';
    API_BASE = 'https://api.github.com';
    UNKNOWN_COLOR = '#333';
    colors = {};
    cache = {};
    $powerTip = $('<div>');
    $powerTip.attr('id', 'powerTip');
    $('body').append($powerTip);
    $.getJSON(chrome.extension.getURL('/resources/colors.json'), function(json) {
      return colors = json;
    });
    return $("a").on('mouseenter', function(e) {
      var $link, addToolTip, id, name, repository, url, user;
      $link = $(this);
      url = $link.attr('href');
      if (url.match(URL_REGEX)) {
        user = RegExp.$2;
        repository = RegExp.$3;
        id = "" + user + "/" + repository;
        addToolTip = function(name) {
          var $circle, $languageLabel, $target, $tip, colorCode, isUnknown, _ref;
          if (name == null) {
            name = 'Unknown';
          }
          isUnknown = name === 'Unknown';
          colorCode = (_ref = colors[name]) != null ? _ref : UNKNOWN_COLOR;
          $tip = $('<div>');
          $circle = $('<div>').addClass('language_circle');
          $circle.css({
            'background': colorCode
          });
          $tip.append($circle);
          $languageLabel = $('<span>').addClass('language_name');
          if (isUnknown) {
            $languageLabel.addClass('unknown');
          }
          $languageLabel.text(name);
          $tip.append($languageLabel);
          $target = $link;
          if ($link.hasClass('repo-list-item')) {
            $target = $link.find('span.repo-and-owner');
          }
          $target.data('powertipjq', $tip);
          $target.powerTip({
            placement: 'n'
          });
          return $.powerTip.show($target);
        };
        if (cache[id] != null) {
          name = cache[id];
          return addToolTip(name);
        } else {
          return $.get("" + API_BASE + "/repos/" + user + "/" + repository + "/languages", function(languages) {
            var key, language, major, sorted, value;
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
            addToolTip(major);
            return cache[id] = major != null ? major : 'Unknown';
          });
        }
      }
    });
  });

}).call(this);
