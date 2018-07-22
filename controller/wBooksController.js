const carouselController = require('./carouselController')
const https = require('https');
const _ = require('lodash');
const querystring = require('querystring');

var BOOKS_API_BASE_URL = 'https://www.googleapis.com/books/v1'
// https://developers.google.com/books/docs/v1/using#st_params
var defaultOptions = {
  // Google API key
  key: null,
  // Search in a specified field
  field: null,
  // The position in the collection at which to start the list of results (startIndex)
  offset: 0,
  // The maximum number of elements to return with this request (Max 40) (maxResults)
  limit: 10,
  // Restrict results to books or magazines (or both) (printType)
  type: 'all',
  // Order results by relevance or newest (orderBy)
  order: 'relevance',
  // Restrict results to a specified language (two-letter ISO-639-1 code) (langRestrict)
  lang: 'en'
};


// Special Keywords
var fields = {
  title: 'intitle:',
  author: 'inauthor:',
  publisher: 'inpublisher:',
  subject: 'subject:',
  isbn: 'isbn:'
};

search = (query, options, callback) => {
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

lookup = (volumeId, options, callback) => {

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

var parseBook = function(data) {
  var book = _.pick(data.volumeInfo, [
      'title', 'subtitle', 'authors', 'publisher', 'publishedDate', 'description',
      'industryIdentifiers', 'pageCount', 'printType', 'categories', 'averageRating',
      'ratingsCount', 'maturityRating', 'language'
  ]);

  _.extend(book, {
      id: data.id,
      webReaderLink: data.accessInfo.webReaderLink,
      link: data.volumeInfo.canonicalVolumeLink,
      thumbnail: _.get(data, 'volumeInfo.imageLinks.thumbnail'),
      images: _.pick(data.volumeInfo.imageLinks, ['small', 'medium', 'large', 'extraLarge'])
  });

  return book;
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

sendBookRecommendation = (client, event, bookData) => {
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
    var columns = carouselController.newColumn(book.thumbnail, '#FFFFFF', book.title, book.description, book.link, actions)
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

exports.getBookRecommendation = (client, event, query) => {
  search(query, function(error, results) {
    if ( ! error ) {
      sendBookRecommendation(client, event, bookData)
    } else {
      console.log(error)
      client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'We got no recommendation books for you'
      })
    }
});
}

