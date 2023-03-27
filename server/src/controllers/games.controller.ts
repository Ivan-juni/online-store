import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import removePhoto from '../utils/remove-photo.util'
import GameModel from '../db/models/game.model'
import { Game } from '../db/interfaces/game.interface'
import { addGameSchema } from './models/yup.schemas'
import { IUpdateGame } from './models/update-game.interface'

export default class GamesController {
  static async getGames(req: Request, res: Response) {
    const { id, name, categoryName, price = '0-10000', limit: limitParam = '5', page: pageParam = '1' } = req.query

    const limit: number = +limitParam
    const page: number = +pageParam
    const offset = (page - 1) * limit

    const priceRange: number[] = price
      .toString()
      .split('-')
      .map((range) => +range)
    const findByPrice = { $gte: priceRange[0], $lte: priceRange[1] }

    let games: Game[] = []

    switch (true) {
      case !!id && !categoryName && !name && !price:
        games = await GameModel.find({ _id: id }).limit(limit).skip(offset)
        break
      case !id && !categoryName && !name && !price:
        games = await GameModel.find().limit(limit).skip(offset)
        break
      case !id && categoryName && !name:
        games = await GameModel.find({
          categoryName: { $in: categoryName },
          price: findByPrice,
        })
          .limit(limit)
          .skip(offset)
        break
      case !id && !categoryName && !!name:
        games = await GameModel.find({
          name: { $regex: name, $options: 'i' },
          price: findByPrice,
        })
          .limit(limit)
          .skip(offset)
        break
      case !id && !categoryName && !name && !!price:
        games = await GameModel.find({
          price: findByPrice,
        })
          .limit(limit)
          .skip(offset)
        break
      default:
        return res.status(400).json({
          message: "You can't find by this params",
        })
    }

    return res.status(200).json(games)
  }

  static async getGameInfo(req: Request, res: Response) {
    const { id } = req.params

    if (!id) throw ApiError.badRequest('Please, enter id')

    const game: Game = await GameModel.findOne(
      {
        _id: id,
      },
      { gameInfo: 1 }
    )

    return res.status(200).json(game)
  }

  static async addGame(req: Request, res: Response) {
    try {
      await addGameSchema.validate(req.body, { abortEarly: false })

      const { name, price, categoryName, gameInfo, isAvailable } = req.body

      const game: Game = await GameModel.create({
        name,
        price: Number(price),
        image: `http://localhost:${process.env.PORT}/static/${req.file.filename}`,
        categoryName,
        gameInfo: JSON.parse(gameInfo),
        isAvailable: isAvailable === 'true',
      })

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

  static async deleteGame(req: Request, res: Response) {
    const game: Game = await GameModel.findOneAndDelete({
      _id: req.params.id,
    })

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
      const [oldGame, game] = await Promise.all([
        GameModel.findById(id),
        GameModel.findOneAndUpdate({ _id: id }, { $set: changingValues }, { returnDocument: 'after' }),
      ])

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
