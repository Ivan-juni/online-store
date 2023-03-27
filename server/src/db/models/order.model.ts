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

const OrderModel = mongoose.model<Order>('Order', orderSchema)

export default OrderModel
