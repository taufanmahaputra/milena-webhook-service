function PostbackAction (label, data) {
  this.type = 'postback'
  this.label = label
  this.data = data
  this.isTextSet = false
  this.isDisplayTextSet = false
  this.displayText = ''
  this.isLabelSet = true
  this.text = ''
  this.setText = function (text) {
    this.isTextSet = true
    this.isDisplayTextSet = false
    this.text = text
  }
  this.setDisplayText = function (disText) {
    this.isTextSet = false
    this.isDisplayTextSet = true
    this.displayText = disText
  }
  this.setLabel = function (label) {
    this.isLabelSet = true
    this.label = label
  }
  this.setData = function (data) {
    this.data = data
  }
  this.toJSON = function () {
    var json = {
      type: this.type,
      data: this.data
    }
    if (this.isTextSet) {
      json.text = this.text
    }
    if (this.isDisplayTextSet) {
      json.displayText = this.displayText
    }
    if (this.isLabelSet) {
      json.label = this.label
    }
    return json
  }
}

module.exports = {
  postback: PostbackAction
}
