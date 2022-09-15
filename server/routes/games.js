const express = require("express");
const router = express.Router();
const path = require("path");
const { getGames } = require("../controllers/games");

// @route GET /api/games
// @des Get all games
router.get("/", getGames);

// @route GET /api/games/:id
// @des Get one game by id
router.get("/:id", (req, res) => res.send("Get game by id"));

// @route GET /api/games/:id/gameInfo
// @des Get game info
router.get("/gameInfo/:gameId", (req, res) => res.send("Get game info by id"));

// @route GET /api/games/category/:name
// @des Get games by Category
router.get("/category/:name", (req, res) => res.send("Get games by category"));

// @route POST /api/games
// @des Add a game
router.post("/", (req, res) => res.send("Create (add) game"));

module.exports = router;
