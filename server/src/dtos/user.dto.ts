import { User } from '../db/interfaces/user.interface'

export default class UserDto {
  id: string
  email: string
  role: string

  constructor(model: User & { _id: string }) {
    this.id = model._id
    this.email = model.email
    this.role = model.role
  }
}
