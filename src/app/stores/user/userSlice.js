"use client"
import { createSlice } from "@reduxjs/toolkit";
import { act, useState } from "react";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {},
        addresses: []
    },
    reducers: {
        createUser: (state, action) => {
            state.user = action.payload
        },
        deleteUser: (state, action) => {
            state.user = null
        },
        addAddress: (state, action) => {
            const address = state.addresses.find(x => x.id === action.payload.id)
            if(address) return
            state.addresses.push(action.payload)
        },
        editAddress: (state, action) => {
            const index = state.addresses.findIndex(x => x.id === action.payload.id)
            if(index < 0) return
            state.addresses[index] = action.payload
        },
        removeAddress: (state, action) => {
            const index = state.addresses.findIndex(x => x.id === action.payload)
            if(index < 0) return
            state.addresses.splice(index, 1)
        }
    }
})

export const { createUser, deleteUser, addAddress, editAddress, removeAddress } = userSlice.actions
export default userSlice.reducer