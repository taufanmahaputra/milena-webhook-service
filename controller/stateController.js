const stateService = require('../service/stateService')

exports.initStateUser = (event) => {
  let state = {}
  state.userId = event.source.userId;

  stateService.initState(state)
}

exports.getStateByUserId = (event) => {
  // let state = new Promise((reject, resolve) => {
  //   resolve(stateService.getStateByUserId(event.source.userId))
  // })
  // state.then((result) => {
  //   console.log(result)
  // })
  // noinspection JSAnnotator
  return yield stateService.getStateByUserId(event.source.userId)
}

exports.setStateGoogleAuthCode = (state, code) => {
  stateService.setStateGoogleAuthCode(state, code)
}

exports.setStateGoogleAuthToken = (state, token) => {
  stateService.setStateGoogleAuthToken(state, token)
}