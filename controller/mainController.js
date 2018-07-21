const eventValidator = require('../utils/eventValidator')
const authGoogleController = require('./authGoogleController')
const echoController = require('./echoController')
const calendarController = require('./calendarController')
const stateController = require('./stateController')

exports.handleEvent = (client, event) => {
  if (eventValidator.isFollowEvent(event)) {
    stateController.initStateUser(event)
  }
  else if (eventValidator.isMessageAndTextMessageType(event) && event.message.text.toLowerCase().includes('/init_google')) {
    return client.replyMessage(event.replyToken, authGoogleController.setupAuthClientGoogle(event))
  }
  else {
    return Promise.resolve(null)
  }
  // TODO: if your confidition, do return your result from your controller

  return client.replyMessage(event.replyToken, echoController.echoMessage(event))
}
