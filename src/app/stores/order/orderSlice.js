"use client"
const { createSlice } = require("@reduxjs/toolkit");

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: []
    },
    reducers: {
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

export const { addOrder, deleteOrder } = orderSlice.actions;
export default orderSlice.reducer;