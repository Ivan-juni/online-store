import mongoose from 'mongoose'
import { Order } from '../interfaces/order.interface'

const orderSchema = new mongoose.Schema<Order>({
  user: {
    id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  games: {
    type: [String],
    required: true,
  },
})

const Order = mongoose.model<Order>('Order', orderSchema)

export default Order
