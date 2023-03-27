import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import tokenService from '../services/token.service'

export default function (req: Request, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    next()
  }
  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) return next(ApiError.unauthorizedError())

    const accessToken = authorizationHeader.split(' ')[1] // Bearer gfhdfhdhd
    if (!accessToken) return next(ApiError.unauthorizedError())

    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData) return next(ApiError.unauthorizedError())

    req.user = userData
    next()
  } catch (e) {
    console.log(e)
    return next(ApiError.unauthorizedError())
  }
}
