import { Types } from 'mongoose'

type GameInfo = {
  title: string
  description: string
}

export interface Game {
  _id: Types.ObjectId
  name: string
  price: number
  image: string
  categoryName: string[]
  isAvailable: boolean
  gameInfo?: GameInfo
}
