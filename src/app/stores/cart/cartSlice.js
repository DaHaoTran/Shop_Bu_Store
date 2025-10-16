import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        productsInCart: [],
    },
    reducers: {
        addProduct: (state, action) => {
            var product = state.productsInCart.find(x => x.productId === action.payload.productId)
            if(product) {
                product.quantityInCart += action.payload.quantityInCart;
                return
            } 
            
            state.productsInCart.unshift(action.payload)
        },
        removeProduct: (state, action) => {
            var index = state.productsInCart.findIndex(x => x.productId === action.payload)
            if(index < 0) return
            state.productsInCart.splice(index, 1)
        },
        editProduct: (state, action) => {
            var index = state.productsInCart.findIndex(x => x.productId === action.payload.productId)
            if(index < 0) return
            state.productsInCart[index] = action.payload;
        },
        clearProduct: (state) => {
            state.productsInCart.splice(0, state.productsInCart.length);
        }
    }
})

export const { addProduct, removeProduct, editProduct, clearProduct } = cartSlice.actions
export default cartSlice.reducer