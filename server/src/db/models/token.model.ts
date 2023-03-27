import { Schema, model } from 'mongoose'
import { Token } from '../interfaces/token.interface'

const tokenSchema = new Schema<Token>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  refreshToken: {
    type: String,
    required: true,
  },
})

const TokenModel = model<Token>('Token', tokenSchema)

export default TokenModel
