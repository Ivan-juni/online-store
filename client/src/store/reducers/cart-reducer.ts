import { createSlice } from "@reduxjs/toolkit";
import { ICart } from '../../models/ICart';

interface CartState {
    cart: ICart;
    isActive: boolean;
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        itemsInCart: []
    },
    reducers: {
        addItemInCart: (state: any, action) => {
            state.itemsInCart.push(action.payload)
        },
        removeItemFromCart: (state: any, action) => {
            state.itemsInCart.filter((game: { id: any }) => game.id !== action.payload)
        }
        // setCartActive: (state: any, action) => {

        // }
    }
})

export const { addItemInCart, removeItemFromCart }  = cartSlice.actions;
export default cartSlice.reducer;