"use client"
import { configureStore } from '@reduxjs/toolkit'
import productReducer from './product/productSlice'
import cartReducer from './cart/cartSlice'
import userReducer from './user/userSlice'
import orderReducer from './order/orderSlice'
import shopReducer from './shop/shopSlice'

const store = configureStore({
    reducer : {
        product: productReducer,
        cart: cartReducer,
        user: userReducer,
        order: orderReducer,
        shop: shopReducer
    }
})

export default store