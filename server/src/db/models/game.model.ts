import mongoose from 'mongoose'
import { Game } from '../interfaces/game.interface'

const gameSchema = new mongoose.Schema<Game>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  categoryName: {
    type: [String],
    required: true,
  },
  gameInfo: {
    type: {
      title: String,
      description: String,
    },
    required: false,
  },
  isAvailable: {
    type: Boolean,
    required: true,
  },
})

const GameModel = mongoose.model<Game>('Game', gameSchema)

export default GameModel
