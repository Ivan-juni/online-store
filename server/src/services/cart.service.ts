import { Cart } from '../db/interfaces/cart.interface'
import CartModel from '../db/models/cart.model'
import GameModel from '../db/models/game.model'
import OrderModel from '../db/models/order.model'
import { updateCart } from './utils/update-cart.util'

export default class CartService {
  static async find(id: string) {
    const cart: Cart = await CartModel.findOne({
      userId: id,
    })

    if (!cart) throw new Error("Can't find a cart")

    return cart
  }

  static async get(id: string) {
    const cart: Cart = await CartModel.findOne({
      userId: id,
    })

    if (!cart) throw new Error("Can't find a cart")

    return GameModel.find({
      _id: { $in: cart.gameId },
    })
  }

  static async addGame(userId: string, gameId: string) {
    const cart: Cart = await updateCart(userId, gameId)

    if (!cart) throw new Error("Can't find a cart")

    return GameModel.find({
      _id: { $in: cart.gameId },
    })
  }

  static async removeGame(userId: string, gameId: string) {
    const cart: Cart = await updateCart(userId, gameId)

    return GameModel.find({
      _id: { $in: cart.gameId },
    })
  }

  static async order(id: string, email: string, gameId: string[]) {
    return OrderModel.create({
      user: {
        id: id,
        email: email,
      },
      games: gameId,
    })
  }

  static async getOrders() {
    return OrderModel.find()
  }
}
