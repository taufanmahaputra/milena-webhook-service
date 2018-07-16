const echoController = require('./echoController')

exports.handleEvent = (client, event) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null)
  }

  // TODO: if your confidition, do return your result from your controller

  return client.replyMessage(event.replyToken, echoController.echoMessage(event))
}
