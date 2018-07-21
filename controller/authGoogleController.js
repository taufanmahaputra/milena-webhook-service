const stateController = require('./stateController')
const {google} = require('googleapis')
const credentials = require('./credentials')

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
const TOKEN_PATH = 'token.json'

function authorize (credentials, callback) {
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback)
    oAuth2Client.setCredentials(JSON.parse(token))
    callback(oAuth2Client)
  })
}

function getAccessToken (oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  console.log('Authorize this app by visiting this url:', authUrl)

  return authUrl
  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });
  // rl.question('Enter the code from that page here: ', (code) => {
  //   rl.close();
  //   oAuth2Client.getToken(code, (err, token) => {
  //     if (err) return callback(err);
  //     oAuth2Client.setCredentials(token);
  //     // Store the token to disk for later program executions
  //     fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
  //       if (err) console.error(err);
  //       console.log('Token stored to', TOKEN_PATH);
  //     });
  //     callback(oAuth2Client);
  //   });
  // });
}

exports.setupCalendar = (event) => {
  console.log('setup calendar start')
  // Load client secrets from a local file.
  // fs.readFile('credentials.json', (err, content) => {
  //   if (err) {
  //     console.log(err)
  //     return {type: 'text', text: 'error read file'}
  //   }
  // Authorize a client with credentials, then call the Google Calendar API.
  // authorize(JSON.parse(content), listEvents);

  const {client_secret, client_id, redirect_uris} = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0])

  const url = getAccessToken(oAuth2Client)
  console.log(url)
  console.log('setup calendar stop')
  return {
    type: 'template',
    altText: 'this is a confirm template',
    template: {
      type: 'buttons',
      text: 'Please go to this link, and save following token for next step.',
      actions: [
        {
          type: 'uri',
          label: 'get token',
          uri: url
        }
      ]
    }
  }
  // });
}

function listEvents (auth) {
  const calendar = google.calendar({version: 'v3', auth})
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err)
    const events = res.data.items
    if (events.length) {
      console.log('Upcoming 10 events:')
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date
        console.log(`${start} - ${event.summary}`)
      })
    } else {
      console.log('No upcoming events found.')
    }
  })
}

getAccessCode = (state, oAuth2Client) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  console.log('Authorize this app by visiting this url:', authUrl)

  return {
    type: 'template',
    altText: 'Get your access code here',
    template: {
      type: 'buttons',
      text: 'Please go to this link, and save following code for next step.',
      actions: [
        {
          type: 'uri',
          label: 'Get Code',
          uri: authUrl
        }
      ]
    }
  }
}

getAccessToken = (state, oAuth2Client, code) => {
  oAuth2Client.getToken(code, (err, token) => {
    stateController.setStateGoogleAuthCode(state, code)
    if (err) return {type: 'text', text: 'Code error/expire. Please try \'/init_google\' again'}

    stateController.setStateGoogleAuthToken(state, token)
    oAuth2Client.setCredentials(token)
    return {type: 'text', text: 'Congratulations! Succesfully registered to this xxxx@gmail.com account'};
  });
}

exports.setupAuthClientGoogle = (event) => {
  const state = stateController.getStateByUserId(event)
  const {client_secret, client_id, redirect_uris} = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0])

  const inputs = event.message.text.split(' ')

  if (state.data.googleAuthCode === '') {
    return getAccessCode(state, oAuth2Client)
  }
  else if (state.data.googleAuthToken === '' && inputs.length > 1) {
    return getAccessToken(state, oAuth2Client,  inputs[1])
  }
  else if (state.data.isConfirmedAuthGoogle){
    return {type: 'text', text: 'Already authenticated. You are ready to go!'}
  }
  else {
    return {type: 'text', text: 'Command error. Please input correctly \'/init_google {your_code}\''}
  }
}