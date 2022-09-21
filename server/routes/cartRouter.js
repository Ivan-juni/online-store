const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// @route POST /api/cart?userId=51aqr2159
// @des Get cart by userId (to identify the cart)
router.get("/cart", cartController.getCart);

// @route POST /api/cart?userId=51aqr2159&gameId=0596sg8406
// @des Add game to cart by gameId and userId (to identify the cart)
router.post("/cart", cartController.addGame);

module.exports = router;
