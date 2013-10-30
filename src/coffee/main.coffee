$ ->

  URL_REGEX = '^(https:\/\/github.com)?\/([a-zA-Z0-9_\.\-]+)\/([a-zA-Z0-9_\.\-]+)\/?$'
  API_BASE = 'https://api.github.com'
  colors = {}

  $.getJSON(chrome.extension.getURL('/resources/colors.json'), (json) ->
    colors = json
  )

  $("a").on('mouseover', (e) ->
    url = $(@).attr('href')
    if url.match(URL_REGEX)
      user = RegExp.$2
      repository = RegExp.$3
      
      $.get("#{API_BASE}/repos/#{user}/#{repository}/languages", (languages) ->
        sorted = ([key, value] for key, value of languages).sort( (a, b) ->
          a[1] < b[1]
        )
        languages = (language[0] for language in sorted)
        major = languages[0]
        colorCode = colors[major]
        console.log colorCode
      )
  )
