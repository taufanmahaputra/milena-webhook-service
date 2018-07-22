const mongoose = require('mongoose');

const stateSchema = mongoose.Schema({
  data: {
    userId: {type: String, unique: true},
    googleAuthCode: String,
    token: {
      access_token: String,
      token_type: String,
      refresh_token: String,
      expiry_date: Number
    },
    isConfirmedAuthGoogle: Boolean,
    isFollowingBot: Boolean
  }
});

module.exports = mongoose.model('State', stateSchema);