const State = require('../models/state')

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
  State.findOne({'data.userId': userId}, stateFindOneCallback(err, state))
}

exports.setStateGoogleAuthCode = (state, code) => {
  State.findOneAndUpdate({'data.userId': state.data.userId}, {'data.googleAuthCode': code})
}

exports.setStateGoogleAuthToken = (state, token) => {
  State.findOneAndUpdate({'data.userId': state.data.userId}, {'data.googleAuthToken': token, 'data.isConfirmedAuthGoogle': true})
}

function stateFindOneCallback (err, state) {
  if (err || !state) { return null }

  return state
}
