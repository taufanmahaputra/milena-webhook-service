const stateService = require('../service/stateService')

exports.initStateUser = (event) => {
  let state = {}
  state.userId = event.source.userId;

  stateService.initState(state)
}

exports.getStateByUserId = async (event) => {
  const state = await stateService.getStateByUserId(event.source.userId)
  console.log('stateController.getStateByUserId')
  console.log(state)
  return state
}

exports.setStateGoogleAuthCode = async (state, code) => {
  await stateService.setStateGoogleAuthCode(state, code)
}

exports.setStateGoogleAuthToken = async (state, token) => {
  await stateService.setStateGoogleAuthToken(state, token)
}