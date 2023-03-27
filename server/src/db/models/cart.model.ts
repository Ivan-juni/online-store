import mongoose from 'mongoose'
import { Cart } from '../interfaces/cart.interface'

const cartSchema = new mongoose.Schema<Cart>({
  userId: {
    type: String,
    required: true,
  },
  gameId: {
    type: [String],
    required: true,
  },
})

const CartModel = mongoose.model<Cart>('Cart', cartSchema)

export default CartModel
