const carouselController = require('./carouselController')
const https = require('https');
const _ = require('lodash');
const querystring = require('querystring');

var BOOKS_API_BASE_URL = 'https://www.googleapis.com/books/v1'

exports.search = (query, options, callback) => {
  // Make the options object optional
  if (!_.isFunction(callback)) {
    callback = options
    options = {}
  }       

  var options = _.extend({}, defaultOptions, options)

  // Validate options
  if (!query) {
    return callback(new Error('Query is required'))
  }

  if (options.offset < 0) {
    return callback(new Error('Offset cannot be below 0'))
  }

  if (options.limit < 1 || options.limit > 40) {
    return callback(new Error('Limit must be between 1 and 40'))
  }

  // Set any special keywords
  if (options.field) {
    query = fields[options.field] + query
  }

  // Create the request uri
  var query = {
    q: query,
    startIndex: options.offset,
    maxResults: options.limit,
    printType: options.type,
    orderBy: options.order,
    langRestrict: options.lang
  }

  if (options.key) {
    query.key = options.key
  }

  sendRequest('/volumes', query, function(err, response) {
    if (err) {
        return callback(err)
    }

    if (!_.isArray(response.items)) {
        return callback(null, [])
    }

    var results = _.chain(response.items)
        .map(parseBook)
        .compact()
        .value();

    callback(null, results, response)
  })
}

exports.lookup = (volumeId, options, callback) => {

  var query = {};

  // Make the options object optional
  if (!_.isFunction(callback)) {
      callback = options;
      options = {};
  }

  if (!volumeId) {
      return callback(new Error('Volume ID is required'));
  }

  if (options.key) {
      query.key = options.key;
  }

  sendRequest('/volumes/' + volumeId, query, function(err, response) {
      if (err) {
          return callback(err);
      }

      if (!response.id || response.id !== volumeId) {
          return callback(null, null);
      }

      callback(null, parseBook(response), response);
  });
};
sendRequest = (path, params, callback) => {
  var url = BOOKS_API_BASE_URL

  if (path) {
      url += path
  }

  if (params) {
      url += '?' + querystring.stringify(params)
  }

  https.get(url, function(response) {
    if (response.statusCode !== 200) {
      return callback(new Error('Google Books API error. Status Code: ' + response.statusCode))
    }

    var body = ''

    response.on('data', function(data) {
      body += data
    });

    response.on('end', function() {
      var err, data;
      try {
          data = JSON.parse(body)
      } catch (e) {
          err = new Error('Invalid response from Google Books API.')
      }
      
      if (data.error) {
          callback(new Error(data.error.message));
      } else {
          callback(err, data)
      }            
    });
  }).on('error', function(error) {
      callback(error)
  })
}

exports.sendBookRecommendation = (client, event, bookData) => {
  var bookCarousel = carouselController.newCarouselMessage('Book Carousel')
  var defaultAnswer = {
    type: 'text',
    text: 'Books not found'
  }
  bookData.forEach(book => {
    var actions = [{
      type: 'postback',
      label: 'Add to Reading List',
      data: 'action=addbook&bookId=' + book.id
    },
    {
      type: 'uri',
      label: 'Read Now',
      uri: book.webReaderLink
    }]
    var columns = carouselController.newColumn(book.imageLinks.thumbnail, '#FFFFFF', book.title, book.description, book.infoLink, actions)
    bookCarousel.template.columns.push(columns)
  })
  if (bookCarousel.template.columns.length <= 0) {
    return client.replyMessage(event.replyToken, defaultAnswer)
  }
  return client.replyMessage(event.replyToken, bookCarousel)
    .then(() => {
      console.log('sukses reply books')
    })
    .catch((err) => {
      console.log(err)
    })
}
