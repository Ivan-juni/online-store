import { Response } from 'express'

const setCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expires after 30 days
    httpOnly: true, // чтобы нельзя было получить/изменить внутри браузера
  })
}

export default setCookie
