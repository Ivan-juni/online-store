const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

// @route POST /api/cart/     (?userId=51aqr2159)
// @des Get cart by userId (to identify the cart)
router.get("/", authMiddleware, cartController.getCart);

// @route POST /api/cart/:gameId
// @des Add game to cart by gameId and userId (to identify the cart)
router.put("/:gameId", authMiddleware, cartController.addGame);

// @route POST /api/cart/:gameId
// @des Delete game from cart by gameId and userId (to identify the cart)
router.delete("/:gameId", authMiddleware, cartController.removeGame);

module.exports = router;
