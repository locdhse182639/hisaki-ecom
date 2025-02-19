import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BrowsingHistoryItem {
  id: string;
  category: string;
}

interface BrowsingHistoryState {
  products: BrowsingHistoryItem[];
}

const initialState: BrowsingHistoryState = {
  products: [],
};

const browsingHistorySlice = createSlice({
  name: "browsingHistory",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<BrowsingHistoryItem>) {
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) state.products.splice(index, 1); 
      state.products.unshift(action.payload); 
      if (state.products.length > 10) state.products.pop(); 
    },
    clearHistory(state) {
      state.products = [];
    },
  },
});

export const { addItem, clearHistory } = browsingHistorySlice.actions;
export default browsingHistorySlice.reducer;
