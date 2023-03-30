import { AddGameBody } from '../controllers/models/add-game.interface'
import { GamesQuery } from '../controllers/models/games-query.interface'
import { IUpdateGame } from '../controllers/models/update-game.interface'
import GameModel from '../db/models/game.model'

export default class GamesService {
  static async find(id: string) {
    return GameModel.findById(id)
  }

  static async get(query: GamesQuery) {
    const { id, name, categoryName, price = '0-10000', limit: limitParam = '5', page: pageParam = '1' }: GamesQuery = query

    const limit: number = +limitParam
    const page: number = +pageParam
    const offset = (page - 1) * limit

    const priceRange: number[] = price
      .toString()
      .split('-')
      .map((range) => +range)
    const findByPrice = { $gte: priceRange[0], $lte: priceRange[1] }

    switch (true) {
      case !!id && !categoryName && !name && !price:
        return GameModel.find({ _id: id }).limit(limit).skip(offset)
      case !id && !categoryName && !name && !price:
        return GameModel.find().limit(limit).skip(offset)
      case !id && categoryName && !name:
        return GameModel.find({
          categoryName: { $in: categoryName },
          price: findByPrice,
        })
          .limit(limit)
          .skip(offset)
      case !id && !categoryName && !!name:
        return GameModel.find({
          name: { $regex: name, $options: 'i' },
          price: findByPrice,
        })
          .limit(limit)
          .skip(offset)
      case !id && !categoryName && !name && !!price:
        return GameModel.find({
          price: findByPrice,
        })
          .limit(limit)
          .skip(offset)
      default:
        throw new Error("You can't find by this params")
    }
  }

  static async getInfo(id: string) {
    return GameModel.findOne(
      {
        _id: id,
      },
      { gameInfo: 1 }
    )
  }

  static async add(body: AddGameBody, filename: string) {
    const { name, price, categoryName, gameInfo, isAvailable } = body

    return GameModel.create({
      name,
      price: Number(price),
      image: `http://localhost:${process.env.PORT}/static/${filename}`,
      categoryName,
      gameInfo: JSON.parse(gameInfo),
      isAvailable: isAvailable === 'true',
    })
  }

  static async remove(id: string) {
    return GameModel.findOneAndDelete({
      _id: id,
    })
  }

  static async update(id: string, changingValues: IUpdateGame) {
    return Promise.all([GameModel.findById(id), GameModel.findOneAndUpdate({ _id: id }, { $set: changingValues }, { returnDocument: 'after' })])
  }
}
