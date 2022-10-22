const ApiError = require("../error/ApiError");
const Cart = require("../models/cart");
const Game = require("../models/game");

class CartController {
  async getCart(req, res, next) {
    try {
      const { id } = req.user;
      const cart = await Cart.findOne({
        userId: id,
      });
      const cartGames = await Game.find({
        _id: { $in: cart.gameId },
      });
      res.status(200).json(cartGames);
    } catch (error) {
      next(ApiError.internal("Can't find a cart"));
    }
  }
  async addGame(req, res, next) {
    try {
      const { id } = req.user;
      const { gameId } = req.params;
      const cart = await Cart.findOneAndUpdate(
        {
          userId: id,
        },
        {
          $push: { gameId: gameId },
        },
        { new: true } // return the updated document
      );
      const cartGames = await Game.find({
        _id: { $in: cart.gameId },
      });
      res.status(200).json(cartGames);
    } catch (error) {
      next(ApiError.internal("Can't add a game to the cart"));
    }
  }
  async removeGame(req, res, next) {
    try {
      const { id } = req.user;
      const { gameId } = req.params;
      const cart = await Cart.findOneAndUpdate(
        {
          userId: id,
        },
        {
          $pull: { gameId: gameId },
        },
        { new: true } // return the updated document
      );
      const cartGames = await Game.find({
        _id: { $in: cart.gameId },
      });
      res.status(200).json(cartGames);
    } catch (error) {
      next(ApiError.internal("Can't remove a game from the cart"));
    }
  }
}

module.exports = new CartController();
