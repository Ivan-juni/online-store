import express from 'express'
import multer from 'multer'
import path from 'path'
import checkRole from '../middleware/check-role.middleware'
import GamesController from '../controllers/games.controller'
import asyncHandler from '../middleware/async-handler.middleware'

export default function createGameRoutes() {
  const router = express.Router()

  // Where store download files
  const storage = multer.diskStorage({
    destination: './assets/',
    filename: (req, file, callback) => {
      callback(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname))
    },
  })

  const upload = multer({ storage })

  // @route GET /api/games/gameInfo/:id
  // @des Get game info
  router.get('/gameInfo/:id', asyncHandler(GamesController.getGameInfo))

  // @route GET /api/games
  // @route GET /api/games?id=
  // @route GET /api/games?name=
  // @route GET /api/games?categoryName=
  // @des Get games
  router.get('/', asyncHandler(GamesController.getGames))

  // @route GET /api/games/accessKey?id=125123dsgsg,23t3imsv,6175383sgvmv4
  // @des Get game access key
  // router.get('/accessKey', authMiddleware, getAccessKey)

  // !Admin panel
  router.use(checkRole('ADMIN'))

  // @route DELETE /api/games/:id
  // @des Delete a game
  router.delete('/:id', asyncHandler(GamesController.removeGame))

  router.use(upload.single('image'))
  // @route POST /api/games/
  // @des Add a game
  router.post('/', asyncHandler(GamesController.addGame))

  // @route PUT /api/games/:id
  // @des Update game parameters
  router.put('/:id', asyncHandler(GamesController.updateGame))

  return router
}
