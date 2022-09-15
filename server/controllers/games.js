const Game = require("../models/game");

const getGames = async (req, res) => {
  try {
    const games = await Game.find();

    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: "Can't get games list" });
  }
};

const addGame = async (req, res) => {
  try {
    const { name, price, image, categoryId } = req.body;
    const game = await Game.create({
      name,
      price,
      categoryId,
    });

    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: "Can't add a game" });
  }
};

module.exports = {
  getGames,
  addGame,
};
