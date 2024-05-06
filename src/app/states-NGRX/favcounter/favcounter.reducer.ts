import { createReducer, on } from '@ngrx/store';
import { totalRecipe } from './favcounter';

export interface FavCounterState {
  favCount: number;
}

export const initialFavCounterState: FavCounterState = {
  favCount: 0,
};

export const favCounterReducer = createReducer(
  initialFavCounterState,
  on(totalRecipe, (state, action) => {
    const newState = { ...state, favCount: action.payload.count };
    return newState;
  })
);
