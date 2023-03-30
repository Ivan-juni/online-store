import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import removePhoto from '../utils/remove-photo.util'
import { Game } from '../db/interfaces/game.interface'
import { addGameSchema } from './models/yup.schemas'
import { IUpdateGame } from './models/update-game.interface'
import gamesService from '../services/games.service'

export default class GamesController {
  static async getGames(req: Request, res: Response) {
    const games: Game[] = await gamesService.get(req.query)

    return res.status(200).json(games)
  }

  static async getGameInfo(req: Request, res: Response) {
    const { id } = req.params

    if (!id) throw ApiError.badRequest('Please, enter id')

    const game: Game = await gamesService.getInfo(id)

    return res.status(200).json(game)
  }

  static async addGame(req: Request, res: Response) {
    try {
      await addGameSchema.validate(req.body, { abortEarly: false })

      const game: Game = await gamesService.add(req.body, req.file.filename)

      return res.status(201).json(game)
    } catch (error) {
      removePhoto(`http://localhost:${process.env.PORT}/static/${req.file.filename}`)
      // yup validation error, return errors
      const errors = {}
      error.inner.forEach((e) => {
        errors[e.path] = { message: e.message }
      })
      return res.status(400).json(errors)
    }
  }

  static async removeGame(req: Request, res: Response) {
    const game: Game = await gamesService.remove(req.params.id)

    await removePhoto(game.image)

    return res.status(200).json(game)
  }

  static async updateGame(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const { price, gameInfo, isAvailable }: IUpdateGame = req.body
    const changingValues: IUpdateGame = {}

    if (!id) throw ApiError.badRequest('Please, type the product id')

    if (!price && !gameInfo && !req.file?.filename && !isAvailable) throw ApiError.badRequest('Type at least one parameter')

    if (req.file?.filename) {
      changingValues.image = `http://localhost:${process.env.PORT}/static/${req.file.filename}`
    }

    if (typeof isAvailable === 'string') {
      changingValues.isAvailable = isAvailable === 'true'
    }

    if (price) {
      changingValues.price = +price
    }

    if (gameInfo) {
      changingValues.gameInfo = gameInfo
    }

    try {
      const [oldGame, game] = await gamesService.update(id, changingValues)

      if (!oldGame) throw ApiError.badRequest('This game does not exist')

      if (changingValues.image) {
        await removePhoto(oldGame.image)
      }

      return res.status(200).json(game)
    } catch (error) {
      next(error)
    }
  }
}
