const stateController = require('./stateController')
const {google} = require('googleapis')
const credentials = require('./credentials')

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
const TOKEN_PATH = 'token.json'

const {client_secret, client_id, redirect_uris} = credentials.installed
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

let result

function listEvents (client, event, auth) {
  const calendar = google.calendar({version: 'v3', auth})
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, (err, res) => {
    if (err) client.replyMessage(event.replyToken, {type: 'text', text: 'Not authenticated.'})
    const events = res.data.items
    if (events.length) {
      let message = `Upcoming 10 events:\n`
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date
        message += `${start} - ${event.summary}\n`
      })
      client.replyMessage(event.replyToken, {type: 'text', text: message})
    } else {
      client.replyMessage(event.replyToken, {type: 'text', text: 'No upcoming events found..'})
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
      console.log(`Error token ${err}`)
      if (err) reject(false)
      console.log(`Token result ${token}`)
      stateController.setStateGoogleAuthCode(state, code)
      stateController.setStateGoogleAuthToken(state, token)
      resolve(true)
    })
  })
}

exports.listEventsOnCalendar = async (client, event) => {
  const state = await stateController.getStateByUserId(event)

  if (state.data.token) {
    oAuth2Client.setCredentials(state.data.token)
    listEvents(client, event, oAuth2Client)
  }
  else {
    client.replyMessage(event.replyToken, {type: 'text', text: 'Not authenticated.'})
  }
}

exports.setupAuthClientGoogle = async (client, event) => {
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
        text: 'Congratulations! Succesfully registered to your account.'
      })
    }, (error) => {
      console.log(`Error get access token: ${error}`)
      client.replyMessage(event.replyToken,{
        type: 'text',
        text: 'Code error or expires. Please try \'/init_google\' again.'
      })
    })
  }
  else if (state.data.isConfirmedAuthGoogle) {
    return client.replyMessage(event.replyToken, {type: 'text', text: 'Already authenticated. You are ready to go!'})
  }
}