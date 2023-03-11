import { Schema, model } from 'mongoose'
import { User } from '../interfaces/user.interface'

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'USER',
    required: true,
  },
})

const User = model<User>('User', userSchema)

export default User
