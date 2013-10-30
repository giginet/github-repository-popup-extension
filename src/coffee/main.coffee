$ ->
  $("a").on('mouseover', (e) ->
    url = $(@).attr('href')
    URL_REGEX = '^(https:\/\/github.com)?\/([a-zA-Z0-9_\.\-]+)\/([a-zA-Z0-9_\.\-]+)\/?$'
    if url.match(URL_REGEX)
      user = RegExp.$2
      repository = RegExp.$3
  )
