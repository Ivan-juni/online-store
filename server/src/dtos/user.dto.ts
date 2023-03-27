import { User } from '../db/interfaces/user.interface'

export default class UserDto {
  id: string
  email: string
  isActivated: boolean
  role: string

  constructor(model: User) {
    this.id = model._id.toString()
    this.email = model.email
    this.isActivated = model.isActivated
    this.role = model.role
  }
}
