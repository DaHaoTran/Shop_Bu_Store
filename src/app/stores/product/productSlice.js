"use client"
import { createSlice } from "@reduxjs/toolkit"

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
    },
    reducers: {
        addProduct: (state, action) => {
            var product = state.products.find(x => x.productId === action.payload.productId)
            if(product) return
            state.products.push(action.payload)
        },
        clearProduct: (state) => {
            state.products = []
        }
    }
})

export const { addProduct, clearProduct } = productSlice.actions
export default productSlice.reducer