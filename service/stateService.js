const State = require('../models/state')
var co = require('co')
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
  return co(function *() {
    let getState = yield State.findOne({'data.userId': userId}, function (err, state) {
      if (err || !state) current_state = null

      current_state = state
      console.log(state)
    })
    return current_state
  })
}

exports.setStateGoogleAuthCode = (state, code) => {
  State.findOneAndUpdate({'data.userId': state.data.userId}, {'data.googleAuthCode': code})
}

exports.setStateGoogleAuthToken = (state, token) => {
  State.findOneAndUpdate({'data.userId': state.data.userId}, {'data.googleAuthToken': token, 'data.isConfirmedAuthGoogle': true})
}

