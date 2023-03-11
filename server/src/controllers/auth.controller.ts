import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../db/models/user.model'
import Cart from '../db/models/cart.model'
import { loginSchema, registrationSchema } from './models/yup.schemas'
import UserDto from '../dtos/user.dto'
import { IRegistration } from './models/registration.interface'
import { ILogin } from './models/login.interface'

const generateJwt = ({ id, email, role }: UserDto) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: '24h',
  })
}

export default class AuthController {
  async registration(req: Request, res: Response) {
    await registrationSchema.validate(req.body)

    const { email, password, role }: IRegistration = req.body

    if (!email || !password) throw ApiError.badRequest('Incorect email or password')

    const candidate = await User.findOne({
      email,
    })

    if (candidate) throw ApiError.badRequest('User with this email already exists')

    // Hash password
    const hashPassword = await bcrypt.hash(password, 5)

    const user: User = await User.create({
      email,
      password: hashPassword,
      role,
    })

    await Cart.create({
      userId: user._id,
      gameId: [],
    })
    const token = generateJwt({ id: user._id.toString(), email: user.email, role: user.role })

    return res.json({ token })
  }
  async login(req: Request, res: Response) {
    const { email, password }: ILogin = req.body
    await loginSchema.validate({ email, password })

    const user = await User.findOne({
      email: email,
    })

    if (!user) throw ApiError.internal("User doesn't exist")

    const comparePassword = bcrypt.compareSync(password, user.password)
    if (!comparePassword) throw ApiError.internal('Incorrect password')

    const token = generateJwt({ id: user._id.toString(), email: user.email, role: user.role })
    return res.json({ token })
  }
  async check(req: Request, res: Response) {
    res.json({ token: generateJwt({ id: req.user.id, email: req.user.email, role: req.user.role }) })
  }
  async changeRole(req: Request, res: Response) {
    const { id, role } = req.query

    if (!id || !role) throw ApiError.badRequest('Error: type the id and role')

    const user = await User.findByIdAndUpdate(id, { role }, { new: true })

    res.status(200).send(user)
  }
}
