const Game = require("../models/game");

const getGames = async (req, res) => {
  try {
    const { id, name, categoryName } = req.query;
    let games;

    if (!id && name && !categoryName) {
      games = await Game.find({
        name: { $in: name },
      });
    }
    if (id && !categoryName && !name) {
      games = await Game.find({
        _id: { $in: id },
      });
    }
    if (!id && !categoryName && !name) {
      games = await Game.find();
    }
    if (!id && !name && categoryName) {
      games = await Game.find({
        categoryName: { $in: categoryName },
      });
    }
    if ((id && categoryName) || (id && name) || (categoryName && name)) {
      res.status(400).json({ message: "You can't find by this params" });
    }

    res.status(200).json(games);
  } catch (error) {
    res.status(400).json({ message: "Can't find a game" });
  }
};

const getGameInfo = async (req, res) => {
  try {
    let game;
    const { id } = req.params;
    game = await Game.find(
      {
        _id: id,
      },
      { gameInfo: 1 }
    );

    res.status(200).json(game);
  } catch (error) {
    res.status(400).json({ message: "Can't find a game" });
  }
};

const addGame = async (req, res) => {
  const errors = {};

  // validation
  if (!req.body.name) {
    errors.name = { message: "Please, type the name of Game" };
  }
  if (!req.body.price) {
    errors.price = { message: "Please, type the price of Game" };
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
    const { name, price, categoryName, accessKey, gameInfo, available } =
      req.body;
    const game = await Game.create({
      name,
      price,
      categoryName,
      gameInfo,
      available,
      image: `http://localhost:${process.env.PORT}/static/${req.file.filename}`,
      accessKey,
    });

    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: "Can't add a game" });
  }
};

const deleteGame = async (req, res) => {
  try {
    const game = await Game.deleteOne({
      _id: req.params.id,
    });

    res.status(200).json(game);
  } catch (error) {
    res.status(400).json({ message: "Can't find and delete a game" });
  }
};

module.exports = {
  getGames,
  getGameInfo,
  addGame,
  deleteGame,
};
