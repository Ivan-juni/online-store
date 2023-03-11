import express from 'express'
import createAuthRoutes from './auth.router'
import createCartRoutes from './cart.router'
import createGameRoutes from './games.router'

const router = express.Router()

router.use('/games', createGameRoutes())
router.use('/cart', createCartRoutes())
router.use('/auth', createAuthRoutes())

export default router
