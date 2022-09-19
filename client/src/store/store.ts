import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./reducers/cart-reducer";

const rootReducer = combineReducers({
    cart: cartReducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']