import { Schema, model } from 'mongoose'
import { User } from '../interfaces/user.interface'

const userSchema = new Schema<User>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  activationLink: {
    type: String,
  },
  role: {
    type: String,
    default: 'USER',
    required: true,
  },
})

const UserModel = model<User>('User', userSchema)

export default UserModel
