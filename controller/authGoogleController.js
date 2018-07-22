const stateController = require('./stateController')
const {google} = require('googleapis')
const credentials = require('./credentials')

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
const TOKEN_PATH = 'token.json'

let result

function authorize (credentials, callback) {
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken({state: oAuth2Client, oAuth2Client: callback})
    oAuth2Client.setCredentials(JSON.parse(token))
    callback(oAuth2Client)
  })
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

getAccessCodeUrl = (oAuth2Client) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  return authUrl
}


getAccessToken = (parameters) => {
  let {state, oAuth2Client, code} = parameters
  return new Promise((resolve, reject) => {
    oAuth2Client.getToken(code, (err, token) => {
      stateController.setStateGoogleAuthCode(state, code)
      if (err) reject(false)
      console.log(token)
      stateController.setStateGoogleAuthToken(state, token)
      resolve(true)
    })
  })
}

exports.setupAuthClientGoogle = async (client, event) => {
  const {client_secret, client_id, redirect_uris} = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
  const inputs = event.message.text.split(' ')

  const state = await stateController.getStateByUserId(event)

  if ((state.data.googleAuthCode === '') && inputs.length == 1) {
    const url = getAccessCodeUrl(oAuth2Client)
    const message =  {
      type: 'template',
      altText: 'Get your access code here',
      template: {
        type: 'buttons',
        text: 'Please go to this link, and save following code for next step.',
        actions: [
          {
            type: 'uri',
            label: 'Get Code',
            uri: url
          }
        ]
      }
    }
    client.replyMessage(event.replyToken, message)
  }
  else if (state.data.token.access_token === '' && inputs.length > 1) {
    getAccessToken({state: state, oAuth2Client: oAuth2Client, code: inputs[1]}).then((result) => {
      client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'Congratulations! Succesfully registered to this xxxx@gmail.com account'
      })
    }, (error) => {
      console.log(`Error get access token: ${error}`)
      client.replyMessage(event.replyToken,{
        type: 'text',
        text: 'Code error/expire. Please try \'/init_google\' again'
      })
    })
  }
  else if (state.data.isConfirmedAuthGoogle) {
    return client.replyMessage(event.replyToken, {type: 'text', text: 'Already authenticated. You are ready to go!'})
  }
}