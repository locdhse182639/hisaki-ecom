import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/features/redux/types/product';

interface ProductState {
  products: Product[];
  isLoading: boolean;
}

const initialState: ProductState = {
  products: [],
  isLoading: false,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
  },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
