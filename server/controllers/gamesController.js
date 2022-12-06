const ApiError = require('../error/ApiError')
const removePhoto = require('../utils/removePhoto')
const Game = require('../models/game')

const getGames = async (req, res, next) => {
  try {
    let { id, name, categoryName, price, limit, page } = req.query
    let games

    // pagination
    page = page || 1
    limit = limit || 5
    let offset = page * limit - limit
    //

    if (!id && price && !categoryName && !name) {
      let priceRange = price.split('-')
      games = await Game.find({
        price: { $gte: +priceRange[0], $lte: +priceRange[1] },
      })
        .limit(limit)
        .skip(offset)
    }

    if (!id && name && !categoryName) {
      if (!price) {
        let priceRange = ['0', '10000']
        games = await Game.find({
          name: { $regex: name, $options: 'i' },
          price: { $gte: +priceRange[0], $lte: +priceRange[1] },
        })
          .limit(limit)
          .skip(offset)
      } else if (price) {
        let priceRange = price.split('-')
        games = await Game.find({
          name: { $regex: name, $options: 'i' },
          price: { $gte: +priceRange[0], $lte: +priceRange[1] },
        })
          .limit(limit)
          .skip(offset)
      }
    }
    if (id && !categoryName && !name && !price) {
      games = await Game.find({
        _id: { $in: id },
      })
        .limit(limit)
        .skip(offset)
    }
    if (!id && !categoryName && !name && !price) {
      games = await Game.find().limit(limit).skip(offset)
    }
    if (!id && !name && categoryName) {
      if (!price) {
        games = await Game.find({
          categoryName: { $in: categoryName },
        })
          .limit(limit)
          .skip(offset)
      } else if (price) {
        let priceRange = price.split('-')
        games = await Game.find({
          categoryName: { $in: categoryName },
          price: { $gte: +priceRange[0], $lte: +priceRange[1] },
        })
          .limit(limit)
          .skip(offset)
      }
    }
    if ((id && categoryName) || (id && name) || (categoryName && name) || (id && price)) {
      res.status(400).json({ message: "You can't find by this params" })
    }

    res.status(200).json(games)
  } catch (error) {
    next(error)
  }
}

const getGameInfo = async (req, res, next) => {
  try {
    let game
    const { id } = req.params
    if (!id) {
      return next(ApiError.badRequest('Please, enter id'))
    }
    game = await Game.find(
      {
        _id: id,
      },
      { gameInfo: 1 }
    )

    res.status(200).json(game)
  } catch (error) {
    // res.status(400).json({ message: "Can't find a gameInfo" });
    next(error)
  }
}

const addGame = async (req, res, next) => {
  const errors = {}
  // validation
  if (!req.body.name) {
    errors.name = { message: 'Please, type the name of Game' }
  }
  if (!req.body.price) {
    errors.price = { message: 'Please, type the price of Game' }
  }
  if (!req.body.isAvailable) {
    errors.price = { message: 'Please, type availability of Game' }
  }
  if (!req.body.categoryName) {
    errors.categoryName = { message: 'Please, type the category of Game' }
  }
  if (!req.file) {
    errors.image = { message: 'Please, add the Game image' }
  }
  if (req.body.gameInfo.description && req.body.gameInfo.description.length > 400) {
    errors.gameInfo = { message: 'Too long description' }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors)
  }

  try {
    let { name, price, categoryName, gameInfo, isAvailable } = req.body
    if (isAvailable == 'true') {
      isAvailable = true
    } else {
      isAvailable = false
    }

    const game = await Game.create({
      name,
      price: Number(price),
      image: `http://localhost:${process.env.PORT}/static/${req.file.filename}`,
      categoryName,
      gameInfo: JSON.parse(gameInfo),
      isAvailable,
    })
    res.status(201).json(game)
  } catch (error) {
    // res.status(400).json({ message: "Can't add a game" });
    next(error)
  }
}

const deleteGame = async (req, res, next) => {
  try {
    const game = await Game.findOneAndDelete({
      _id: req.params.id,
    })

    removePhoto(game.image)

    res.status(200).json(game)
  } catch (error) {
    next(error)
  }
}

const updateGame = async (req, res, next) => {
  try {
    const { id } = req.params
    const changingValues = req.body

    if (Object.keys(changingValues).length == 0) {
      return next(ApiError.badRequest('Type at least one parameter'))
    }

    if (req.file !== undefined && req.file !== null) {
      changingValues.image = `http://localhost:${process.env.PORT}/static/${req.file.filename}`
    }

    if (!id) {
      return next(ApiError.badRequest('Please, type the product id'))
    }

    if (changingValues.isAvailable) {
      if (changingValues.isAvailable == 'true') {
        changingValues.isAvailable = true
      } else {
        changingValues.isAvailable = false
      }
    }

    if (changingValues.price) {
      changingValues.price = Number(changingValues.price)
    }

    if (changingValues.gameInfo) {
      changingValues.gameInfo = JSON.parse(changingValues.gameInfo)
    }

    const oldGame = await Game.findById(id)

    if (!oldGame) {
      return next(ApiError.badRequest('This game does not exist'))
    }

    const game = await Game.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: changingValues,
      },
      { returnDocument: 'after' }
    )

    removePhoto(oldGame.image)

    res.status(200).json(game)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getGames,
  getGameInfo,
  addGame,
  deleteGame,
  updateGame,
}
