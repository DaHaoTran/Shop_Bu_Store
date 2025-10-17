"use client"
const { createSlice } = require("@reduxjs/toolkit");

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: []
    },
    reducers: {
        createOrder: (state, action) => {
            state.orders = action.payload;
        },
        addOrder: (state, action) => {
            const order = state.orders.find(x => x.orderId === action.payload.orderId)
            if(order) return 
            state.orders.push(action.payload);
        },
        deleteOrder: (state, action) => {
            const index = state.orders.findIndex(x => x.orderId === action.payload)
            if(!index) return 
            state.orders.splice(index, 1)
        }
    }
})

export const { createOrder, addOrder, deleteOrder } = orderSlice.actions;
export default orderSlice.reducer;