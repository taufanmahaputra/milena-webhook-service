class Template {
  constructor (_altText, _type) {
    this.type = 'template'
    this.altText = _altText
    this.template = {}
    this.setTemplateByType(_type)
  }

  setAltText (_altText) {
    this.altText = _altText
  }

  setType (_type) {
    this.type = _type
  }

  setTemplate (_template) {
    this.template = _template
  }

  setTemplateByType (_type) {
    switch (_type) {
      case 'buttons' : this.template = {
        type: 'buttons',
        thumbnailImageUrl: '',
        imageAspectRatio: 'rectangle',
        imageSize: 'cover',
        imageBackgroundColor: '#FFFFFF',
        title: 'Menu',
        text: 'Please select',
        defaultAction: {
          type: 'postback',
          label: 'click',
          uri: ''
        },
        actions: []
      }
        break
      case 'confirm' : this.template = {
        type: 'confirm',
        text: '',
        actions: [
          {
            type: 'message',
            label: 'Yes',
            text: 'yes'
          },
          {
            type: 'message',
            label: 'No',
            text: 'no'
          }
        ]
      }
        break
      case 'carousel' : this.template = {
        type: 'carousel',
        columns: [{
          thumbnailImageUrl: '',
          imageBackgroundColor: '#FFFFFF',
          title: '',
          text: '',
          defaultAction: {},
          actions: []
        }],
        imageAspectRatio: 'rectangle',
        imageSize: 'cover'
      }
        break
      case 'image_carousel' : this.template = {
        type: 'image_carousel',
        columns: []
      }
        break
    }
  }

  setTemplateImageRatio (_imageRatio) {
    this.template.imageAspectRatio = _imageRatio
  }

  setTemplateImageSize (_imageSize) {
    this.template.imageSize = _imageSize
  }

  setAddColumns (_column) {
    this.template.columns.push(_column)
  }

  toJSON () {
    let json = {
      type: this.type,
      altText: this.altText,
      template: this.template
    }
    return json
  }
}

module.exports = Template
