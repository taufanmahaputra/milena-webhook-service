const util = require('./util')

exports.newCarouselMessage = (altText) => {
  var message = {
    'type': 'template',
    'altText': altText,
    'template': {
      'type': 'carousel',
      'columns': [],
      'imageAspectRatio': 'rectangle',
      'imageSize': 'cover'
    }
  }
  return message
}

exports.newColumn = (imageUrl, backgroundColor, title, desc, defUrl, actions) => {
  var col = {
    'thumbnailImageUrl': imageUrl,
    'imageBackgroundColor': backgroundColor,
    'title': util.trimString(title, 40),
    'text': util.trimString(desc, 60),
    'defaultAction': {
      'type': 'uri',
      'label': 'View detail',
      'uri': defUrl
    },
    'actions': actions
  }
  return col
}

exports.newPostbackAction = (type, label, data, text, displayText) => {
  var action = {
    'type': type,
    'label': label,
    'data': data
  }
  if (text !== '') {
    action.text = text
  }
  if (displayText !== '') {
    action.displayText = displayText
  }
  return action
}
