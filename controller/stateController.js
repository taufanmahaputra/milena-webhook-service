const stateService = require('../service/stateService')

exports.initStateUser = (event) => {
  let state = {}
  state.userId = event.source.userId;

  stateService.initState(state)
}

exports.getStateByUserId = (event, cb) => {
  let state = stateService.getStateByUserId(event.source.userId)
  state.then((result) => {
    if (!result) {cb(null)}

    cb(result)
  })
}

exports.setStateGoogleAuthCode = (state, code) => {
  stateService.setStateGoogleAuthCode(state, code)
}

exports.setStateGoogleAuthToken = (state, token) => {
  stateService.setStateGoogleAuthToken(state, token)
}