const eventValidator = require('../utils/eventValidator')
const googleController = require('./authGoogleController')
const echoController = require('./echoController')
const calendarController = require('./calendarController')
const wBooksController = require('./wBooksController')
const stateController = require('./stateController')

exports.handleEvent = (client, event) => {
  if (eventValidator.isFollowEvent(event)) {
    stateController.initStateUser(event)
  }
  else if (eventValidator.isMessageAndTextMessageType(event) && event.message.text.toLowerCase().includes('/init_google')) {
    googleController.setupAuthClientGoogle(client, event)
  }
  else if (eventValidator.isMessageAndTextMessageType(event) && event.message.text.toLowerCase() === '/list_events') {
    googleController.listEventsOnCalendar(client, event)
  }else if (eventValidator.isMessageAndTextMessageType(event) && event.message.text.toLowerCase() === '/books') {
    wBooksController.getBookRecommendation(client, event, 'database')
  }

  // TODO: if your confidition, do return your result from your controller

  // return client.replyMessage(event.replyToken, echoController.echoMessage(event))
}
