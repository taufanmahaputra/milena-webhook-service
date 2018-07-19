const echoController = require('./echoController')
const calendarController = require('./calendarController')

exports.handleEvent = (client, event) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null)
  }

  if (event.message.text.toLowerCase() === '/init_calendar') {
    return client.replyMessage(event.replyToken, calendarController.setupCalendar(event))
  }
  // TODO: if your confidition, do return your result from your controller

  return client.replyMessage(event.replyToken, echoController.echoMessage(event))
}
