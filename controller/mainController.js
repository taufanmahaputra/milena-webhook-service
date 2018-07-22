const eventValidator = require('../utils/eventValidator')
const authGoogleController = require('./authGoogleController')
const echoController = require('./echoController')
const calendarController = require('./calendarController')
const wBooksController = require('./wBooksController')
const stateController = require('./stateController')

exports.handleEvent = (client, event) => {
  if (eventValidator.isFollowEvent(event)) {
    stateController.initStateUser(event)
  }
  else if (eventValidator.isMessageAndTextMessageType(event) && event.message.text.toLowerCase().includes('/init_google')) {
    authGoogleController.setupAuthClientGoogle(event).then((message) => {
      client.replyMessage(event.replyToken, message)
    })
  }

  // TODO: if your confidition, do return your result from your controller

  // return client.replyMessage(event.replyToken, echoController.echoMessage(event))
}
