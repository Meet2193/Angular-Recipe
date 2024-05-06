import { Routes } from '@angular/router';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './service/auth.guard';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { RecipeDetailsComponent } from './components/recipe-details/recipe-details.component';
import { AddRecipeComponent } from './components/add-recipe/add-recipe.component';
import { EditRecipeComponent } from './components/edit-recipe/edit-recipe.component';
import { FavoriteComponent } from './components/favorite/favorite.component';
export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'dashboard',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'recipe-details/:id',
    component: RecipeDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add-recipe/:id',
    component: AddRecipeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add-recipe',
    component: AddRecipeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'edit-recipe/:id',
    component: AddRecipeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'favorite-recipe',
    component: FavoriteComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: ErrorPageComponent,
  },
];
