const State = require('../models/state')
let current_state

exports.initState = (data) => {
  let state = new State({
    data: {
      userId: data.userId,
      googleAuthCode: '',
      googleAuthToken: '',
      isConfirmedAuthGoogle: false,
      isFollowingBot: true
    }
  })
  state.save()
}

exports.getStateByUserId = async (userId) => {
  await State.findOne({'data.userId': userId}, function (err, state) {
    if (err || !state) current_state = null

    current_state = state
  })
  console.log('stateService.getStateByUserId')
  console.log(current_state)
  return current_state
}

exports.setStateGoogleAuthCode = async (state, code) => {
  await State.findOneAndUpdate({'data.userId': state.data.userId}, {'data.googleAuthCode': code})
}

exports.setStateGoogleAuthToken = async (state, token) => {
  await State.findOneAndUpdate({'data.userId': state.data.userId}, {'data.googleAuthToken': token, 'data.isConfirmedAuthGoogle': true})
}

