const express = require('express')
const multer = require('multer')
const router = express.Router()
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
const path = require('path')
const {
  getGames,
  getAccessKey,
  getGameInfo,
  addGame,
  deleteGame,
  changeAvailibility,
} = require('../controllers/gamesController')

// Where store download files
const storage = multer.diskStorage({
  destination: './assets/',
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  },
})

const upload = multer({ storage })

// @route GET /api/games/gameInfo/:id
// @des Get game info
router.get('/gameInfo/:id', getGameInfo)

// @route GET /api/games
// @route GET /api/games?id=
// @route GET /api/games?name=
// @route GET /api/games?categoryName=
// @des Get games
router.get('/', getGames)

// @route GET /api/games/accessToken?id=125123dsgsg,23t3imsv,6175383sgvmv4
// @des Get game access key
router.get('/accessKey', authMiddleware, getAccessKey)

// !Admin panel
// @route POST /api/games/
// @des Add a game
router.post('/', checkRole('ADMIN'), upload.single('image'), addGame)
// router.post("/", addGame);

// @route DELETE /api/games/:id
// @des Delete a game
router.delete('/:id', checkRole('ADMIN'), deleteGame)

// @route PUT /api/games/:id?isAvailable=(true, false)
// @des Set availibility
router.put('/:id', changeAvailibility)

module.exports = router
