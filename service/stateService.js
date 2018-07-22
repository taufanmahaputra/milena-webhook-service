const State = require('../models/state')
let current_state

exports.initState = (data) => {
  let state = new State({
    data: {
      userId: data.userId,
      googleAuthCode: '',
      token: {
        access_token: '',
        token_type: '',
        refresh_token: '',
        expiry_date: 0
      },
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

exports.setStateGoogleAuthCode = (state, code) => {
  State.findOneAndUpdate({'data.userId': state.data.userId}, {'data.googleAuthCode': code}, function (err, code) {
    console.log(err)
    console.log(code)
  })
}

exports.setStateGoogleAuthToken = (state, token) => {
  State.findOneAndUpdate({'data.userId': state.data.userId},
    {
      'data.token.access_token': token.access_token, 'data.token.token_type': token.token_type,
      'data.token.refresh_token': token.refresh_token, 'data.token.expiry_date': token.expiry_date
    },
    function(err, code) {
      console.log(err)
      console.log(code)
    })
}

