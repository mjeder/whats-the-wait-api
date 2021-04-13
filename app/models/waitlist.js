const mongoose = require('mongoose')
const guestSchema = require('./guest')

const waitlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  guests: [guestSchema],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Waitlist', waitlistSchema)
