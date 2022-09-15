const { ObjectId } = require("bson");
const mongoose = require("mongoose");

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
  categoryId: {
    type: ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Game", gameSchema);
