const stateService = require('../service/stateService')

exports.initStateUser = (event) => {
  let state = {}
  state.userId = event.source.userId;

  stateService.initState(state)
}

exports.getStateByUserId = (event, cb) => {
  let state = stateService.getStateByUserId(event.source.userId)
  state.then((err, state) => {
    if (err || !state) {cb(null)}

    cb(state)
  })
}

exports.setStateGoogleAuthCode = (state, code) => {
  stateService.setStateGoogleAuthCode(state, code)
}

exports.setStateGoogleAuthToken = (state, token) => {
  stateService.setStateGoogleAuthToken(state, token)
}