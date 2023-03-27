import { User } from '../../db/interfaces/user.interface'
import UserDto from '../../dtos/user.dto'
import tokenService from '../token.service'

const generateUserInfo = async (
  user: User
): Promise<{
  user: UserDto
  accessToken: string
  refreshToken: string
}> => {
  // создаем модель пользователя, чтобы передать в generateTokens
  // туда нельзя передавать пароль и другую постороннюю ин-цию,
  // поэтому мы создаем data transfer object (dto) c email, id, role, isActivated
  const userDto = new UserDto(user)

  // генерируем пару токенов для пользователя
  const tokens = tokenService.generateTokens({ ...userDto })

  // сохраняем refreshToken для пользователя в бд
  await tokenService.saveToken(userDto.id, tokens.refreshToken)

  // объект - accessToken, refreshToken + user: id, email, role, isActivated
  return { ...tokens, user: userDto }
}

export default generateUserInfo
