/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCart,
  addItemToCart,
  updateItemInCart,
  removeItemFromCart,
  clearItemFromCart,
} from "../thunks/cartThunks";

interface CartState {
  items: any[];
  itemsPrice: number;
  totalPrice: number;
  status: "idle" | "loading" | "failed";
}

const initialState: CartState = {
  items: [],
  itemsPrice: 0,
  totalPrice: 0,
  status: "idle",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.itemsPrice = action.payload.itemsPrice;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.itemsPrice = action.payload.itemsPrice;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(updateItemInCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.itemsPrice = action.payload.itemsPrice;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.itemsPrice = action.payload.itemsPrice;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(clearItemFromCart.fulfilled, (state) => {
        state.items = [];
        state.itemsPrice = 0;
        state.totalPrice = 0;
      });
  },
});

export default cartSlice.reducer;
