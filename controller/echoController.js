exports.echoMessage = (event) => {
  return {type: 'text', text: event.message.text}
}
