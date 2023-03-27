import { Types } from 'mongoose'

export interface Token {
  user: Types.ObjectId
  refreshToken: string
}
