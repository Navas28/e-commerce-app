import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';

interface FavouritesState {
  items: Product[];
}

const initialState: FavouritesState = {
  items: [],
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addToFavourites(state, action: PayloadAction<Product>) {
      const exists = state.items.some(item => item.id === action.payload.id);
      if (!exists) state.items.push(action.payload);
    },
    removeFromFavourites(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    toggleFavourite(state, action: PayloadAction<Product>) {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },
  },
});

export const { addToFavourites, removeFromFavourites, toggleFavourite } = favouritesSlice.actions;

export const selectFavouriteItems = (state: { favourites: FavouritesState }) =>
  state.favourites.items;
export const selectFavouritesCount = (state: { favourites: FavouritesState }) =>
  state.favourites.items.length;
export const selectIsFavourite = (id: number) => (state: { favourites: FavouritesState }) =>
  state.favourites.items.some(item => item.id === id);

export default favouritesSlice.reducer;
