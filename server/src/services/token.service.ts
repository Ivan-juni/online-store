import jwt from 'jsonwebtoken'
import { Token } from '../db/interfaces/token.interface'
import TokenModel from '../db/models/token.model'
import UserDto from '../dtos/user.dto'

export default class TokenService {
  static generateTokens(payload: UserDto): {
    accessToken: string
    refreshToken: string
  } {
    // генерируем пару токенов
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    })
    // токен, который обновляет access token, когда мы заходим на сайт. Если не заходить 30 дней, нужно будет снова логиниттся
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    })

    return {
      accessToken,
      refreshToken,
    }
  }

  static validateAccessToken(token: string): UserDto {
    // получаем payload из токена после верефикации, который мы в него вшивали
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET) as unknown as UserDto
  }

  static validateRefreshToken(token: string): UserDto {
    // получаем payload из токена после верефикации, который мы в него вшивали
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET) as unknown as UserDto
  }

  // сохраняем refresh token конкретного пользователя в бд
  // по одному пользователю - один токен
  // при логине на другом устройстве, вас выкинет с того, на котором вы были залогинены
  static async saveToken(userId: string, refreshToken: string) {
    const tokenData = await TokenModel.findOne({ user: userId })

    if (tokenData) {
      // перезаписываем refreshToken, если был старый
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }

    // создаем refreshToken, если его нет в бд для этого пользователя
    return TokenModel.create({ user: userId, refreshToken })
  }

  // удаляем refreshToken токен
  static async removeToken(refreshToken: string): Promise<number> {
    return (await TokenModel.deleteOne({ refreshToken })).deletedCount
  }

  // ищем в бд refreshToken
  static async findToken(refreshToken: string): Promise<Token> {
    return TokenModel.findOne({ refreshToken })
  }
}
