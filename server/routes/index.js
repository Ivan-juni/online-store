const express = require('express')
const router = express.Router()
const authRouter = require('./authRouter')
const gamesRouter = require('./gamesRouter')
const cartRouter = require('./cartRouter')

router.use('/auth', authRouter)
router.use('/games', gamesRouter)
router.use('/cart', cartRouter)

module.exports = router
