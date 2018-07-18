const echoController = require('./echoController')
const wBooksController = require('./wBooksController')

var bookResultDummy = [{
  'id': 'rXM1DgAAQBAJ',
  'title': 'Medical and Psychosocial Aspects of Chronic Illness and Disability',
  'authors': [
    'Carlene Harrison',
    'University of North Carolina North Carolina Donna Falvo',
    'Valerie Weiss',
    'Donna Falvo',
    'Beverley E. Holland'
  ],
  'publisher': 'Jones & Bartlett Learning',
  'publishedDate': '2017-01-15',
  'description': 'Medical and Psychosocial Aspects of Chronic Illness, Sixth Edition is intended to teach students, counselors and other medical professionals working with the chronically ill and disabled how to better understand the manifestations of common chronic illnesses and the disabilities among their clients.',
  'pageCount': 650,
  'printType': 'BOOK',
  'categories': [
    'Medical'
  ],
  'maturityRating': 'NOT_MATURE',
  'imageLinks': {
    'smallThumbnail': 'http://books.google.com/books/content?id=yjdQ8jTuCfgC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
    'thumbnail': 'http://books.google.com/books/content?id=yjdQ8jTuCfgC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
  },
  'language': 'en',
  'previewLink': 'http://books.google.co.id/books?id=rXM1DgAAQBAJ&printsec=frontcover&dq=medical&hl=&cd=1&source=gbs_api',
  'infoLink': 'http://books.google.co.id/books?id=rXM1DgAAQBAJ&dq=medical&hl=&source=gbs_api',
  'canonicalVolumeLink': 'https://books.google.com/books/about/Medical_and_Psychosocial_Aspects_of_Chro.html?hl=&id=rXM1DgAAQBAJ',
  'webReaderLink': 'http://play.google.com/books/reader?id=rXM1DgAAQBAJ&hl=&printsec=frontcover&source=gbs_api'
},
{
  'id': 'yjdQ8jTuCfgC',
  'title': 'Medical Multimedia',
  'authors': [
    'Roy Rada',
    'Claude Ghaoui'
  ],
  'publisher': 'Intellect Books',
  'publishedDate': '1995',
  'description': 'This volume asserts that multimedia plays an increasingly important role in training and development for high-technology medical techniques. It examines a broad range of methods for incorporating computer-based multimedia packages into the world of medicine.',
  'pageCount': 197,
  'printType': 'BOOK',
  'categories': [
    'Medical'
  ],
  'maturityRating': 'NOT_MATURE',
  'imageLinks': {
    'smallThumbnail': 'http://books.google.com/books/content?id=rXM1DgAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
    'thumbnail': 'http://books.google.com/books/content?id=rXM1DgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
  },
  'language': 'en',
  'previewLink': 'http://books.google.co.id/books?id=yjdQ8jTuCfgC&printsec=frontcover&dq=medical&hl=&cd=2&source=gbs_api',
  'infoLink': 'https://play.google.com/store/books/details?id=yjdQ8jTuCfgC&source=gbs_api',
  'canonicalVolumeLink': 'https://market.android.com/details?id=book-yjdQ8jTuCfgC',
  'webReaderLink': 'http://play.google.com/books/reader?id=yjdQ8jTuCfgC&hl=&printsec=frontcover&source=gbs_api'
}]

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
