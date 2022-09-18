const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const {
  getGames,
  getGameInfo,
  addGame,
  deleteGame,
} = require("../controllers/games");

// Where store download files
const storage = multer.diskStorage({
  destination: "./assets/",
  filename: (req, file, callback) => {
    callback(
      null,
      file.filename + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// @route GET /api/games/:id/gameInfo
// @des Get game info
router.get("/:id/gameInfo", getGameInfo);

// @route GET /api/games
// @route GET /api/games?id=
// @route GET /api/games?name=
// @route GET /api/games?categoryName=
// @des Get games
router.get("", getGames);

// !Admin panel
// @route POST /api/games
// @des Add a game
router.post("/", upload.single("image"), addGame);

// @route DELETE /api/games/:id
// @des Delete a game
router.delete("/:id", deleteGame);

// @route PUT /api/games/:id
// @des Set available/unavailable
router.put("/:id", (req, res) => res.send("Availibilyty of Game was changed"));

module.exports = router;
