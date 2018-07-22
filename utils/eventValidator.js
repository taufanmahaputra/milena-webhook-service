exports.isFollowEvent = (event) => {
  return event.type === 'follow'
}

exports.isMessageEvent = (event) => {
  return event.type === 'message'
}

exports.isTextMessageType = (event) => {
  return event.message.type === 'text'
}

exports.isMessageAndTextMessageType = (event) => {
  return this.isMessageEvent(event) && this.isTextMessageType(event)
}