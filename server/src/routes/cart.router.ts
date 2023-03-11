import express from 'express'
import cartController from '../controllers/cart.controller'
import asyncHandler from '../middleware/async-handler.middleware'
import authMiddleware from '../middleware/auth.middleware'
import checkRole from '../middleware/check-role.middleware'

export default function createCartRoutes() {
  const router = express.Router()
  router.use(authMiddleware)

  // @route GET /api/cart/     (?userId=51aqr2159)
  // @des Get cart by userId (to identify the cart)
  router.get('/', cartController.getCart)

  // @route GET /api/cart/order
  // @des Get cart by userId (to identify the cart)
  router.get('/order', checkRole('ADMIN'), asyncHandler(cartController.getOrders))

  // @route PUT /api/cart/:gameId
  // @des Add game to cart by gameId and userId (to identify the cart)
  router.put('/:gameId', asyncHandler(cartController.addGame))

  // @route POST /api/cart/order
  // @des make order
  router.post('/order', asyncHandler(cartController.makeOrder))

  // @route POST /api/cart/:gameId
  // @des Delete game from cart by gameId and userId (to identify the cart)
  router.delete('/:gameId', asyncHandler(cartController.removeGame))

  return router
}
