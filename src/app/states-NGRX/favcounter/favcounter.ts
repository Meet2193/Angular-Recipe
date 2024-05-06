import { createAction } from '@ngrx/store';

export const totalRecipe = createAction(
  '[FavCount Component] TotalRecipe',
  (payload) => ({ payload })
);
