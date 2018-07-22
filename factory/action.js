class Action {
  constructor (_type, _label) {
    this.type = _type
    this.label = _label
    this.otherAttr = {}
    this.setAttributeByType(_type)
  }
  setAttributeByType (_type) {
    switch (_type) {
      case 'postback' :
        this.otherAttr = {
          data: ''
        }
        break
      case 'message' :
        this.otherAttr = {
          text: ''
        }
        break
      case 'uri' :
        this.otherAttr = {
          uri: ''
        }
        break
      case 'datetimepicker' :
        this.otherAttr = {
          data: '',
          mode: 'datetime'
        }
        break
    }
  }

  setType (_type) {
    this.type = _type
  }

  setLabel (_label) {
    this.label = _label
  }

  setOtherAttr (_otherattr) {
    this.otherAttr = _otherattr
  }

  addOtherAttr (_otherattr) {
    for (var key in _otherattr) {
      this.otherAttr[key] = _otherattr[key]
    }
  }

  toJSON () {
    var json = {
      type: this.type,
      label: this.label
    }
    for (var key in this.otherAttr) {
      json[key] = this.otherAttr[key]
    }
    return json
  }
}

module.exports = Action
