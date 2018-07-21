const stateService = require('../service/stateService')

exports.initStateUser = (event) => {
  let state = {}
  state.userId = event.source.userId;

  stateService.initState(state)
}

exports.getStateByUserId = (event, cb) => {
  let state = stateService.getStateByUserId(event.source.userId)
  state.then((err, result) => {
    console.log('StateController.getStateByUserId')
    console.log(err)
    console.log(result)
    if (err || !result) {cb(null)}

    cb(result)
  })
}

exports.setStateGoogleAuthCode = (state, code) => {
  stateService.setStateGoogleAuthCode(state, code)
}

exports.setStateGoogleAuthToken = (state, token) => {
  stateService.setStateGoogleAuthToken(state, token)
}