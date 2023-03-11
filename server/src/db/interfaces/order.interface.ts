import { Types } from 'mongoose'

export interface Order {
  _id: Types.ObjectId
  user: {
    id: string
    enail: string
  }
  games: string[]
}
