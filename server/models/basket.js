const mongoose = require("mongoose");

const basketSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  gameId: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("Basket", basketSchema);
