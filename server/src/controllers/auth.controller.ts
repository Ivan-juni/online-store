import { Request, Response } from 'express'
import ApiError from '../errors/ApiError'
import UserModel from '../db/models/user.model'
import { loginSchema, registrationSchema } from './models/yup.schemas'
import { IRegistration } from './models/registration.interface'
import { ILogin } from './models/login.interface'
import authService from '../services/auth.service'
import setCookie from '../utils/set-cookie.util'

export default class AuthController {
  static async registration(req: Request, res: Response) {
    try {
      await registrationSchema.validate(req.body)
    } catch (err) {
      throw ApiError.internal(`Validation error: ${err.message}`)
    }

    const { email, password }: IRegistration = req.body

    if (!email || !password) throw ApiError.badRequest('Incorect email or password')

    const candidate = await UserModel.findOne({ email })

    if (candidate) throw ApiError.badRequest('User with this email already exists')

    const userData = await authService.registration({ email, password })

    // храним refreshToken в куках
    setCookie(res, userData.refreshToken)

    return res.json(userData)
  }

  static async activate(req: Request, res: Response) {
    await authService.activate(req.params.link)

    return res.redirect(process.env.CLIENT_URL)
  }

  static async login(req: Request, res: Response) {
    const { email, password }: ILogin = req.body
    try {
      await loginSchema.validate({ email, password })
    } catch (err) {
      throw ApiError.internal(`Validation error: ${err.message}`)
    }

    const userData = await authService.login({ email, password })

    if (!userData) throw ApiError.badRequest(`Login error`)

    // храним refreshToken в куках
    setCookie(res, userData.refreshToken)

    return res.json(userData)
  }

  static async logout(req: Request, res: Response) {
    const { refreshToken } = req.cookies

    if (!refreshToken) throw ApiError.unauthorizedError()

    const token = await authService.logout(refreshToken)
    res.clearCookie('refreshToken')

    if (token === 1) {
      return res.json({ message: 'Logout successfully' })
    } else {
      return res.json({ message: 'Something goes wrong...' })
    }
  }

  static async refresh(req: Request, res: Response) {
    const { refreshToken } = req.cookies

    if (!refreshToken) throw ApiError.unauthorizedError()

    const userData = await authService.refresh(refreshToken)

    if (!userData) throw ApiError.badRequest(`Refresh error`)

    // храним refreshToken в куках
    setCookie(res, userData.refreshToken)

    return res.json(userData)
  }

  static async changeRole(req: Request, res: Response) {
    const { id, role } = req.query

    if (!id || !role) throw ApiError.badRequest('Error: type the id and role')

    const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true })

    res.status(200).send(user)
  }
}
