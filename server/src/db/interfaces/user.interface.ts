import { Types } from 'mongoose'

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
}

export interface User {
  _id: Types.ObjectId
  email: string
  password: string
  isActivated: boolean
  activationLink: string
  role: 'USER' | 'ADMIN' | 'OWNER'
}
