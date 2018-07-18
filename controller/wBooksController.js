const carouselController = require('./carouselController')

exports.sendBookRecommendation = (client, event, bookData) => {
  var bookCarousel = carouselController.newCarouselMessage('Book Carousel')
  var defaultAnswer = {
    'type': 'text',
    'text': 'Books not found'
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
    bookCarousel.template.columns.push(columns)
  })
  console.log("WKWKKWKWKWKWKW");
  console.log(bookCarousel);
  console.log("WKWKKWKWKWKWKW");
  if (bookCarousel.template.columns.length <= 0) {
    return client.replyMessage(event.replyToken, defaultAnswer)
  }
  console.log(bookCarousel)
  return client.replyMessage(event.replyToken, bookCarousel).
    then(() => {
      console.log('sukses')
    })
    .catch((err) => {
      console.log(err);
    });
}
