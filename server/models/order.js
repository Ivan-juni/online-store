const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  user: {
    id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  games: {
    type: [String],
    required: true,
  },
})

module.exports = mongoose.model('Order', orderSchema)
