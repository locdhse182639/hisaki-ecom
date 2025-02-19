/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCart, addToCart, removeFromCart, clearCart, updateCartItem } from "@/features/api/cart";


export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
    return await getCart();
  });
  
  // Add item to cart
  export const addItemToCart = createAsyncThunk(
    "cart/addItem",
    async (item: any) => {
      return await addToCart(item);
    }
  );
  
  export const updateItemInCart = createAsyncThunk(
    "cart/updateItem",
    async ({ userId, itemId, quantity }: { userId: string; itemId: string; quantity: number }) => {
      return await updateCartItem(userId, itemId, quantity);
    }
  );

  // Remove item from cart
  export const removeItemFromCart = createAsyncThunk(
    "cart/removeItem",
    async (itemId: string) => {
      return await removeFromCart(itemId);
    }
  );

  export const clearItemFromCart = createAsyncThunk(
    "cart/clearItem",
    async(userId: string) => {
      return await clearCart(userId);
    }
  )