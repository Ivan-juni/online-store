const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  gameId: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
