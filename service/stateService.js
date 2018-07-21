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
  var getState = State.findOne({'data.userId': userId}, stateFindOneCallback).exec()
  getState.then(function (state) {
    console.log(state)
    return state
  });
}

exports.setStateGoogleAuthCode = (state, code) => {
  State.findOneAndUpdate({'data.userId': state.data.userId}, {'data.googleAuthCode': code})
}

exports.setStateGoogleAuthToken = (state, token) => {
  State.findOneAndUpdate({'data.userId': state.data.userId}, {'data.googleAuthToken': token, 'data.isConfirmedAuthGoogle': true})
}

function stateFindOneCallback (err, state) {
  console.log('stateService.stateFindOneCallback')
  console.log(`Error: ${err}`)
  console.log(`State: ${state}`)
  if (err || !state) { current_state = null }

  current_state = state
}
