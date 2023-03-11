import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import UserDto from '../dtos/user.dto'

export default function (req: Request, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    next()
  }
  try {
    const token = req.headers.authorization.split(' ')[1] // Bearer gfhdfhdhd
    if (!token) {
      return res.status(401).json({ message: 'User has not authorized' })
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY) as unknown as UserDto
    req.user = decoded
    next()
  } catch (e) {
    res.status(401).json({ message: 'User has not authorized' })
  }
}
