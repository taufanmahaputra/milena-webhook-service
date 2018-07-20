const stringUtil = require('./../utils/stringUtil')

class ImageColumn {
  constructor (title, desc, actions) {
    this.thumbnailImageUrl = ''
    this.imageBackgroundColor = '#FFFFFF'
    this.title = stringUtil.trimString(title, 40)
    this.text = stringUtil.trimString(desc, 60)
    this.defaultAction = ''
    this.actions = actions
  }

  addAction (action) {
    this.actions.push(action)
  }

  setActions (actions) {
    this.actions = actions
  }

  setBackgroundColor (color) {
    this.imageBackgroundColor = color
  }

  setThumbnailImageUrl (imageUrl) {
    this.thumbnailImageUrl = imageUrl
  }

  setTitle (title) {
    this.title = title
  }

  setText (text) {
    this.text = text
  }

  setDefaultAction (action) {
    this.defaultAction = action
  }

  toJSON () {
    var json = {
      thumbnailImageUrl: this.thumbnailImageUrl,
      imageBackgroundColor: this.imageBackgroundColor,
      title: this.title,
      text: this.text,
      actions: this.actions
    }
    if (this.defaultAction !== '') {
      json['defaultAction'] = this.defaultAction
    }
    return json
  }
}

module.exports = ImageColumn
