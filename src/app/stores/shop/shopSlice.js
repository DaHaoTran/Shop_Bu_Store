const { createSlice } = require("@reduxjs/toolkit");

const shopSlice = createSlice({
    name: 'shop',
    initialState: {
        shops: []
    },
    reducers: {
        addShop: (state, action) => {
            const shop = state.shops.find(x => x.shopId === action.payload.shopId);
            if(shop) return
            state.shops.push(action.payload);
        }
    }
})

export const { addShop } = shopSlice.actions;
export default shopSlice.reducer;