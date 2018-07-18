const stringUtil = require('./../utils/stringUtil')

function Carousel (altText) {
  this.type = 'template'
  this.altText = altText
  this.template = {
    type: 'carousel',
    columns: [],
    imageAspectRatio: 'rectangle',
    imageSize: 'cover'
  }

  this.setAltText = function (altText) {
    this.altText = altText
  }

  this.setTemplateImageRation = function (ratio) {
    this.template.imageAspectRatio = ratio
  }

  this.setTemplatImageSize = function (size) {
    this.template.imageSize = size
  }

  this.setColumns = function (columns) {
    this.template.columns = columns
  }

  this.addColumns = function (column) {
    this.template.columns.push(column)
  }

  this.toJSON = function () {
    return {
      type: this.type,
      altText: this.altText,
      template: this.template
    }
  }
}

function Column (title, desc, actions) {
  this.thumbnailImageUrl = ''
  this.imageBackgroundColor = '#FFFFFF'
  this.title = stringUtil.trimString(title, 40)
  this.text = stringUtil.trimString(desc, 60)
  this.defaultAction = ''
  this.actions = actions

  this.addAction = function (action) {
    this.actions.push(action)
  }

  this.setActions = function (actions) {
    this.actions = actions
  }

  this.setBackgroundColor = function (color) {
    this.imageBackgroundColor = color
  }

  this.setThumbnailImageUrl = function (imageUrl) {
    this.thumbnailImageUrl = imageUrl
  }

  this.setTitle = function (title) {
    this.title = title
  }

  this.setText = function (text) {
    this.text = text
  }

  this.setDefaultAction = function (action) {
    this.defaultAction = action
  }

  this.toJSON = function () {
    var json = {
      thumbnailImageUrl: this.thumbnailImageUrl,
      imageBackgroundColor: this.imageBackgroundColor,
      title: this.title,
      text: this.text,
      actions: this.actions
    }
    if (this.defaultAction !== '') {
      json.defaultAction = this.defaultAction
    }
    return json
  }
}

module.exports = {
  carousel: Carousel,
  column: Column
}
