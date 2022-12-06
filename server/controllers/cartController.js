const ApiError = require('../error/ApiError')
const Cart = require('../models/cart')
const Game = require('../models/game')
const Order = require('../models/order')
const generateKey = require('../utils/generateAccessKey')

class CartController {
  async getCart(req, res, next) {
    try {
      const { id } = req.user
      const cart = await Cart.findOne({
        userId: id,
      })
      const cartGames = await Game.find({
        _id: { $in: cart.gameId },
      })
      res.status(200).json(cartGames)
    } catch (error) {
      next(ApiError.internal("Can't find a cart"))
    }
  }
  async addGame(req, res, next) {
    try {
      const { id } = req.user
      const { gameId } = req.params

      if (!id) {
        next(ApiError.badRequest("User doesn't authorized"))
      }

      if (!gameId) {
        next(ApiError.badRequest('Please, enter game id'))
      }

      const cart = await Cart.findOneAndUpdate(
        {
          userId: id,
        },
        {
          $push: { gameId: gameId },
        },
        { new: true } // return the updated document
      )
      const cartGames = await Game.find({
        _id: { $in: cart.gameId },
      })
      res.status(200).json(cartGames)
    } catch (error) {
      next(ApiError.internal("Can't add a game to the cart"))
    }
  }
  async makeOrder(req, res, next) {
    try {
      const { id, email } = req.user

      if (!id || !email) {
        next(ApiError.badRequest("User doesn't authorized"))
      }

      var result = []

      const cart = await Cart.findOne({
        userId: id,
      })

      if (cart.gameId.length == 0) {
        return next(ApiError.badRequest('Your cart is empty'))
      }

      if (!cart) {
        return next(ApiError.badRequest("Can't find a cart"))
      }

      const order = await Order.create({
        user: {
          id: id,
          email: email,
        },
        games: cart.gameId,
      })

      for (let index = 0; index < order.games.length; index++) {
        const gameId = order.games[index]

        const game = await Game.findById(gameId)

        const key = generateKey()

        result.push({
          name: game.name,
          accessKey: key,
        })
      }

      res.status(200).send({ message: 'Ordered successfully', games: result })
    } catch (error) {
      next(ApiError.internal("Can't make an order"))
    }
  }
  async removeGame(req, res, next) {
    try {
      const { id } = req.user
      const { gameId } = req.params
      const cart = await Cart.findOneAndUpdate(
        {
          userId: id,
        },
        {
          $pull: { gameId: gameId },
        },
        { new: true } // return the updated document
      )
      const cartGames = await Game.find({
        _id: { $in: cart.gameId },
      })
      res.status(200).json(cartGames)
    } catch (error) {
      next(ApiError.internal("Can't remove a game from the cart"))
    }
  }
  async getOrders(req, res, next) {
    try {
      const orders = await Order.find()

      if (!orders) {
        return next(ApiError.internal("Can't find an orders"))
      }

      res.status(200).json(orders)
    } catch (error) {
      next(ApiError.badRequest(error))
    }
  }
}

module.exports = new CartController()
