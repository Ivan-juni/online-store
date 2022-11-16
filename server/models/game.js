const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  categoryName: {
    type: [String],
    required: true,
  },
  gameInfo: {
    // type: {
    title: String,
    description: String,
    // },
    required: false,
  },
  isAvailable: {
    type: Boolean,
    required: true,
  },
  accessKey: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Game', gameSchema)
