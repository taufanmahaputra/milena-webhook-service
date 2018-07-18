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
  return client.replyMessage(event.replyToken,
    {
      type: 'template',
      altText: 'Carousel alt text',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: 'https://cdn0.iconfinder.com/data/icons/tutor-icon-set/512/set_of_three_books-512.png',
            title: 'hoge',
            text: 'fuga',
            actions: [
              { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
              { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
            ],
          },
          {
            thumbnailImageUrl: 'https://cdn0.iconfinder.com/data/icons/tutor-icon-set/512/set_of_three_books-512.png',
            title: 'hoge',
            text: 'fuga',
            actions: [
              { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
              { label: 'Say message', type: 'message', text: 'Rice=米' },
            ],
          },
        ],
      },
    }).
    then(() => {
      console.log('sukses')
    })
    .catch((err) => {
      console.log(err);
    });
}
