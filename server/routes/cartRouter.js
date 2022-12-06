const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

// @route GET /api/cart/     (?userId=51aqr2159)
// @des Get cart by userId (to identify the cart)
router.get('/', authMiddleware, cartController.getCart)

// @route GET /api/cart/order
// @des Get cart by userId (to identify the cart)
router.get('/order', checkRole('ADMIN'), cartController.getOrders)

// @route PUT /api/cart/:gameId
// @des Add game to cart by gameId and userId (to identify the cart)
router.put('/:gameId', authMiddleware, cartController.addGame)

// @route POST /api/cart/order
// @des make order
router.post('/order', authMiddleware, cartController.makeOrder)

// @route POST /api/cart/:gameId
// @des Delete game from cart by gameId and userId (to identify the cart)
router.delete('/:gameId', authMiddleware, cartController.removeGame)

module.exports = router
