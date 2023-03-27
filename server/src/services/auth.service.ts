import UserModel from '../db/models/user.model'
import CartModel from '../db/models/cart.model'
import tokenService from './token.service'
import UserDto from '../dtos/user.dto'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import { User } from '../db/interfaces/user.interface'
import mailService from './mail.service'
import { IRegistration } from '../controllers/models/registration.interface'
import { ILogin } from '../controllers/models/login.interface'
import generateUserInfo from './utils/generate-user-info.util'

export default class AuthService {
  static async registration({ email, password }: IRegistration): Promise<{
    user: UserDto
    accessToken: string
    refreshToken: string
  }> {
    // хэшируем пароль
    const hashPassword = await bcrypt.hash(password, 3)

    // создаем ссылку для активации аккаунта
    const activationLink = v4()

    // создаем пользователя
    const user: User = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    })

    // создаем корзину пользователя
    await CartModel.create({
      userId: user._id,
      gameId: [],
    })

    // сообщение на почту для активации
    await mailService.sendActivationMail(email, `${process.env.API_URL}:${process.env.PORT}/api/auth/activate/${activationLink}`)

    return generateUserInfo(user)
  }

  static async activate(activationLink: string) {
    const user = await UserModel.findOne({ activationLink })
    if (!user) throw new Error('Invalid activation link')

    user.isActivated = true
    await user.save()
  }

  static async login({ email, password }: ILogin): Promise<{
    user: UserDto
    accessToken: string
    refreshToken: string
  }> {
    const user: User = await UserModel.findOne({ email })
    if (!user) throw new Error('User does not exist')

    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) throw new Error('Wrong password')

    return generateUserInfo(user)
  }

  static async logout(refreshToken: string): Promise<number> {
    // удаляем refreshToken из бд
    return tokenService.removeToken(refreshToken)
  }

  static async refresh(refreshToken: string): Promise<{
    user: UserDto
    accessToken: string
    refreshToken: string
  }> {
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)

    if (!userData || !tokenFromDb) throw new Error('User has not authorized')

    // получаем пользователя из бд (вдруг за это время
    // ин-ция про него изменилась и нужно зашить в токен новую)
    const user = await UserModel.findById(userData.id)

    return generateUserInfo(user)
  }
}
