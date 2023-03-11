import { Types } from 'mongoose'

export interface Cart {
  _id: Types.ObjectId
  userId: string
  gameId: string[]
}
