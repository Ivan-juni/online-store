const ApiError = require("../error/ApiError");
const Game = require("../models/game");

const getGames = async (req, res, next) => {
  try {
    let { id, name, categoryName, price, limit, page } = req.query;
    let games;

    // pagination
    page = page || 1;
    limit = limit || 5;
    let offset = page * limit - limit;
    //

    if (!id && price && !categoryName && !name) {
      let priceRange = price.split("-");
      games = await Game.find({
        price: { $gte: +priceRange[0], $lte: +priceRange[1] },
      })
        .limit(limit)
        .skip(offset);
    }

    if (!id && name && !categoryName) {
      if (!price) {
        let priceRange = ["0", "10000"];
        games = await Game.find({
          name: { $regex: name, $options: "i" },
          price: { $gte: +priceRange[0], $lte: +priceRange[1] },
        })
          .limit(limit)
          .skip(offset);
      } else if (price) {
        let priceRange = price.split("-");
        games = await Game.find({
          name: { $regex: name, $options: "i" },
          price: { $gte: +priceRange[0], $lte: +priceRange[1] },
        })
          .limit(limit)
          .skip(offset);
      }
    }
    if (id && !categoryName && !name && !price) {
      games = await Game.find({
        _id: { $in: id },
      })
        .limit(limit)
        .skip(offset);
    }
    if (!id && !categoryName && !name && !price) {
      games = await Game.find().limit(limit).skip(offset);
    }
    if (!id && !name && categoryName) {
      if (!price) {
        games = await Game.find({
          categoryName: { $in: categoryName },
        })
          .limit(limit)
          .skip(offset);
      } else if (price) {
        let priceRange = price.split("-");
        games = await Game.find({
          categoryName: { $in: categoryName },
          price: { $gte: +priceRange[0], $lte: +priceRange[1] },
        })
          .limit(limit)
          .skip(offset);
      }
    }
    if (
      (id && categoryName) ||
      (id && name) ||
      (categoryName && name) ||
      (id && price)
    ) {
      res.status(400).json({ message: "You can't find by this params" });
    }

    res.status(200).json(games);
  } catch (error) {
    // res.status(400).json({ message: "Can't find a game" });
    console.log(error);
    next(ApiError.internal("Can't find a game"));
  }
};

const getGameInfo = async (req, res, next) => {
  try {
    let game;
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest("Id wasn't typed"));
    }
    game = await Game.find(
      {
        _id: id,
      },
      { gameInfo: 1 }
    );

    res.status(200).json(game);
  } catch (error) {
    // res.status(400).json({ message: "Can't find a gameInfo" });
    next(ApiError.internal("Can't find a gameInfo"));
  }
};

const addGame = async (req, res, next) => {
  const errors = {};
  // validation
  if (!req.body.name) {
    errors.name = { message: "Please, type the name of Game" };
  }
  if (!req.body.price) {
    errors.price = { message: "Please, type the price of Game" };
  }
  if (!req.body.isAvailable) {
    errors.price = { message: "Please, type availability of Game" };
  }
  if (!req.body.categoryName) {
    errors.categoryName = { message: "Please, type the category of Game" };
  }
  if (!req.body.accessKey) {
    errors.accessKey = { message: "Please, type the accessKey of Game" };
  }
  if (!req.file) {
    errors.image = { message: "Please, add the Game image" };
  }
  if (
    req.body.gameInfo.description &&
    req.body.gameInfo.description.length > 400
  ) {
    errors.gameInfo = { message: "Too long description" };
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  try {
    let { name, price, categoryName, accessKey, gameInfo, isAvailable } =
      req.body;
    if (isAvailable == "true") {
      isAvailable = true;
    } else {
      isAvailable = false;
    }

    const game = await Game.create({
      name,
      price: Number(price),
      image: `http://localhost:${process.env.PORT}/static/${req.file.filename}`,
      categoryName,
      gameInfo,
      isAvailable,
      accessKey,
    });
    res.status(201).json(game);
  } catch (error) {
    // res.status(400).json({ message: "Can't add a game" });
    next(ApiError.badRequest(error.message));
  }
};

const deleteGame = async (req, res, next) => {
  try {
    const game = await Game.deleteOne({
      _id: req.params.id,
    });

    res.status(200).json(game);
  } catch (error) {
    // res.status(400).json({ message: "Can't find and delete a game" });
    next(ApiError.badRequest("Can't find and delete a game"));
  }
};

const changeAvailibility = async (req, res, next) => {
  try {
    if (req.query.isAvailable == "true") {
      isTrueSet = true;
    } else {
      isTrueSet = false;
    }
    const game = await Game.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: { available: isTrueSet },
      }
    );
    res.status(200).json(game);
  } catch (error) {
    // res.status(400).json({ message: "Can't update an availibility of the game" });
    next(ApiError.badRequest("Can't update an availibility of the game"));
  }
};

module.exports = {
  getGames,
  getGameInfo,
  addGame,
  changeAvailibility,
  deleteGame,
};
