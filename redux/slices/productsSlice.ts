import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';

export type SortOption = 'price_asc' | 'price_desc' | 'rating_desc' | 'best_sellers' | 'newest' | null;
export type PriceRange = 'under_20' | '20_to_100' | 'above_100' | null;

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  sortOption: SortOption;
  filterCategory: string | null;
  filterPriceRange: PriceRange;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  sortOption: null,
  filterCategory: null,
  filterPriceRange: null,
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const response = await fetch('https://fakestoreapi.com/products');
  return response.json() as Promise<Product[]>;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSortOption(state, action: PayloadAction<SortOption>) {
      state.sortOption = action.payload;
    },
    setFilterCategory(state, action: PayloadAction<string | null>) {
      state.filterCategory = action.payload;
    },
    setFilterPriceRange(state, action: PayloadAction<PriceRange>) {
      state.filterPriceRange = action.payload;
    },
    clearFilters(state) {
      state.filterCategory = null;
      state.filterPriceRange = null;
    },
    clearSort(state) {
      state.sortOption = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, state => {
        state.status = 'failed';
      });
  },
});

export const {
  setSortOption,
  setFilterCategory,
  setFilterPriceRange,
  clearFilters,
  clearSort,
} = productsSlice.actions;

export const selectFilteredSortedProducts = (state: { products: ProductsState }) => {
  let list = [...state.products.items];

  if (state.products.filterCategory) {
    list = list.filter(p => p.category === state.products.filterCategory);
  }

  switch (state.products.filterPriceRange) {
    case 'under_20':
      list = list.filter(p => p.price < 20);
      break;
    case '20_to_100':
      list = list.filter(p => p.price >= 20 && p.price <= 100);
      break;
    case 'above_100':
      list = list.filter(p => p.price > 100);
      break;
  }

  switch (state.products.sortOption) {
    case 'price_asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'rating_desc':
      list.sort((a, b) => b.rating.rate - a.rating.rate);
      break;
    case 'best_sellers':
      list.sort((a, b) => b.rating.count - a.rating.count);
      break;
    case 'newest':
      list.sort((a, b) => b.id - a.id);
      break;
  }

  return list;
};

export const selectCategories = (state: { products: ProductsState }) =>
  [...new Set(state.products.items.map(p => p.category))];

export const selectProductsStatus = (state: { products: ProductsState }) =>
  state.products.status;

export const selectHasActiveFilter = (state: { products: ProductsState }) =>
  !!state.products.filterCategory || !!state.products.filterPriceRange;

export default productsSlice.reducer;
