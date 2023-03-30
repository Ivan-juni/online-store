import { Request, Response } from 'express'
import { Cart } from '../db/interfaces/cart.interface'
import { Game } from '../db/interfaces/game.interface'
import { Order } from '../db/interfaces/order.interface'
import ApiError from '../errors/ApiError'
import cartService from '../services/cart.service'
import gamesService from '../services/games.service'
import generateKey from '../utils/generate-access-key.util'

export default class CartController {
  static async getCart(req: Request, res: Response) {
    const cartGames: Game[] = await cartService.get(req.user.id)

    return res.status(200).json(cartGames)
  }

  static async addGame(req: Request, res: Response) {
    const { id } = req.user
    const { gameId } = req.params

    if (!id) throw ApiError.badRequest("User doesn't authorized")
    if (!gameId) throw ApiError.badRequest('Please, enter game id')

    const cartGames: Game[] = await cartService.addGame(id, gameId)

    return res.status(200).json(cartGames)
  }

  static async makeOrder(req: Request, res: Response) {
    const { id, email } = req.user

    if (!id || !email) throw ApiError.unauthorizedError()

    const result: Array<{
      name: string
      accessKey: string
    }> = []

    const cart: Cart = await cartService.find(id)

    if (!cart) throw ApiError.badRequest("Can't find a cart")
    if (cart.gameId.length == 0) throw ApiError.badRequest('Your cart is empty')

    const order: Order = await cartService.order(id, email, cart.gameId)

    for (let i = 0; i < order.games.length; i++) {
      const gameId = order.games[i]

      const game: Game = await gamesService.find(gameId)
      const key = generateKey()

      result.push({
        name: game.name,
        accessKey: key,
      })
    }

    return res.status(200).send({ message: 'Ordered successfully', games: result })
  }

  static async removeGame(req: Request, res: Response) {
    const { id } = req.user
    const { gameId } = req.params

    const cartGames: Game[] = await cartService.removeGame(id, gameId)

    return res.status(200).json(cartGames)
  }

  static async getOrders(req: Request, res: Response) {
    const orders: Order[] = await cartService.getOrders()

    if (!orders) throw ApiError.internal("Can't find an orders")

    return res.status(200).json(orders)
  }
}
