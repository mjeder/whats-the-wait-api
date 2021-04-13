const mongoose = require('mongoose')

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  quote: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  table: {
    type: Number,
    default: ''
  },
  sat: {
    type: Boolean,
    default: false
  },
  cancel: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = guestSchema
