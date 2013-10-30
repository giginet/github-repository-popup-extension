$ ->

  URL_REGEX = '^(https:\/\/github.com)?\/([a-zA-Z0-9_\.\-]+)\/([a-zA-Z0-9_\.\-]+)\/?$'
  API_BASE = 'https://api.github.com'
  colors = {}
  cache = {}

  $powerTip = $('<div>');
  $powerTip.attr('id', 'powerTip')
  $('body').append($powerTip)

  $.getJSON(chrome.extension.getURL('/resources/colors.json'), (json) ->
    colors = json
  )

  $("a").on('mouseenter', (e) ->
    $link = $(@)
    url = $link.attr('href')
    if url.match(URL_REGEX)
      user = RegExp.$2
      repository = RegExp.$3
      id = "#{user}/#{repository}"

      addToolTip = (name) ->
        colorCode = colors[name]
        $tip = $('<div>')
        $circle = $('<div>').addClass('language_circle')
        $circle.css('background': colorCode)
        $tip.append($circle)
        $languageLabel = $('<span>').addClass('language_name')
        $languageLabel.text(name)
        $tip.append($languageLabel)

        $target = $link
        if $link.hasClass('repo-list-item')
          $target = $link.find('span.repo-and-owner')

        $target.data('powertipjq', $tip)
        $target.powerTip
          placement : 'n'
        $.powerTip.show($target)

      if cache[id]?
        name = cache[id]
        addToolTip(name)
      else
        $.get("#{API_BASE}/repos/#{user}/#{repository}/languages", (languages) ->
          sorted = ([key, value] for key, value of languages).sort( (a, b) ->
            a[1] < b[1]
          )
          languages = (language[0] for language in sorted)
          major = languages[0]
          
          return unless major
          addToolTip(major)
          cache[id] = major
        )
  )
