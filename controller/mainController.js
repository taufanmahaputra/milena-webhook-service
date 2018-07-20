const echoController = require('./echoController')
const calendarController = require('./calendarController')
const wBooksController = require('./wBooksController')

exports.handleEvent = (client, event) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null)
  }

  if (event.message.text.toLowerCase() === '/books') {
    return wBooksController.sendBookRecommendation(client, event, bookResultDummy)
  }

  // TODO: if your confidition, do return your result from your controller

  return client.replyMessage(event.replyToken, echoController.echoMessage(event))
}
