const carouselController = require('./carouselController')

exports.sendBookRecommendation = (client, event, bookData) => {
  var bookCarousel = carouselController.newCarouselMessage('Book Carousel')
  var defaultAnswer = {
    'type': 'text',
    'text': 'Books not found'
  }
  console.log(bookData)
  if (bookData.length <= 0) {
    return client.replyMessage(event.replyToken, defaultAnswer)
  }
  bookData.forEach(book => {
    var actions = [{
      'type': 'postback',
      'label': 'Add to Reading List',
      'data': 'action=addbook&bookId=' + book.id
    },
    {
      'type': 'uri',
      'label': 'Read Now',
      'url': book.webReaderLink
    }]
    var columns = carouselController.newColumn(book.imageLinks.thumbnail, '#FFFFFF', book.title, book.description, book.infoLink, actions)
    bookCarousel.template.columns.concat(columns)
  })
  console.log(bookCarousel)
  return client.replyMessage(event.replyToken, bookCarousel)
}
