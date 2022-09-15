const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const basketSchema = mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true,
  },
});

const basketGameSchema = mongoose.Schema({
  gameId: {
    type: ObjectId,
    required: true,
  },
  basketId: {
    type: ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Basket", basketSchema);
module.exports = mongoose.model("BasketGame", basketGameSchema);
