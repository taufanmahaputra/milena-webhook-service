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

exports.getStateByUserId = (userId) => {
  return State.findOne({'data.userId': userId}).exec()
}

exports.setStateGoogleAuthCode = (state, code) => {
  State.findOneAndUpdate({'data.userId': state.data.userId}, {'data.googleAuthCode': code})
}

exports.setStateGoogleAuthToken = (state, token) => {
  State.findOneAndUpdate({'data.userId': state.data.userId}, {'data.googleAuthToken': token, 'data.isConfirmedAuthGoogle': true})
}

