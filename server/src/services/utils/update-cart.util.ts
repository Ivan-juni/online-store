import CartModel from '../../db/models/cart.model'

export const updateCart = (userId: string, gameId: string) => {
  return CartModel.findOneAndUpdate(
    { userId },
    { $pull: { gameId } },
    { new: true } // return the updated document
  )
}
