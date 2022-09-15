const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const gameInfoSchema = mongoose.Schema({
  gameId: {
    type: ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("GameInfo", gameInfoSchema);
