const mongoose = require('mongoose');

const stateSchema = mongoose.Schema({
  data: {
    userId: {type: String, unique: true},
    googleAuthCode: String,
    googleAuthToken: String,
    isConfirmedAuthGoogle: Boolean,
    isFollowingBot: Boolean
  }
});

module.exports = mongoose.model('State', stateSchema);