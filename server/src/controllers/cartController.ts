import { Request, Response, NextFunction } from 'express'
import { Cart } from '../db/interfaces/cart.interface'
import { Game } from '../db/interfaces/game.interface'
import { Order } from '../db/interfaces/order.interface'
import CartModel from '../db/models/cart.model'
import GameModel from '../db/models/game.model'
import OrderModel from '../db/models/order.model'
import ApiError from '../errors/ApiError'
import generateKey from '../utils/generate-access-key.util'

export default class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    const { id } = req.user
    const cart: Cart = await CartModel.findOne({
      userId: id,
    })
    if (!cart) return ApiError.internal("Can't find a cart")

    const cartGames: Game[] = await GameModel.find({
      _id: { $in: cart.gameId },
    })

    return res.status(200).json(cartGames)
  }
  async addGame(req: Request, res: Response, next: NextFunction) {
    const { id } = req.user
    const { gameId } = req.params

    if (!id) return ApiError.badRequest("User doesn't authorized")
    if (!gameId) return ApiError.badRequest('Please, enter game id')

    const cart: Cart = await CartModel.findOneAndUpdate(
      {
        userId: id,
      },
      {
        $push: { gameId: gameId },
      },
      { new: true } // return the updated document
    )
    if (!cart) return ApiError.internal("Can't find a cart")

    const cartGames: Game[] = await GameModel.find({
      _id: { $in: cart.gameId },
    })

    return res.status(200).json(cartGames)
  }

  async makeOrder(req: Request, res: Response, next: NextFunction) {
    const { id, email } = req.user

    if (!id || !email) return ApiError.badRequest("User doesn't authorized")

    const result: Array<{
      name: string
      accessKey: string
    }> = []

    const cart: Cart = await CartModel.findOne({
      userId: id,
    })

    if (!cart) return ApiError.badRequest("Can't find a cart")
    if (cart.gameId.length == 0) return ApiError.badRequest('Your cart is empty')

    const order: Order = await OrderModel.create({
      user: {
        id: id,
        email: email,
      },
      games: cart.gameId,
    })

    for (let i = 0; i < order.games.length; i++) {
      const gameId = order.games[i]

      const game: Game = await GameModel.findById(gameId)

      const key = generateKey()

      result.push({
        name: game.name,
        accessKey: key,
      })
    }

    return res.status(200).send({ message: 'Ordered successfully', games: result })
  }
  async removeGame(req: Request, res: Response, next: NextFunction) {
    const { id } = req.user
    const { gameId } = req.params

    const cart: Cart = await CartModel.findOneAndUpdate(
      {
        userId: id,
      },
      {
        $pull: { gameId: gameId },
      },
      { new: true } // return the updated document
    )
    const cartGames: Game[] = await GameModel.find({
      _id: { $in: cart.gameId },
    })

    return res.status(200).json(cartGames)
  }
  async getOrders(req: Request, res: Response, next: NextFunction) {
    const orders: Order[] = await OrderModel.find()

    if (!orders) return ApiError.internal("Can't find an orders")

    return res.status(200).json(orders)
  }
}
