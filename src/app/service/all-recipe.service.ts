import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AllRecipeService {
  http = inject(HttpClient);
  getAPIUrl = environment.apiUrl;
  apiURL = `${this.getAPIUrl}/allrecipe/`;
  constructor() {}

  getAllRecipe() {
    return this.http.get(this.apiURL);
  }

  getRecipeById(Id: any) {
    return this.http.get(this.apiURL + Id);
  }

  addRecipe(recipeData: any) {
    return this.http.post(this.apiURL, recipeData);
  }

  editRecipe(recipeId: number, recipeData: any) {
    return this.http.put(this.apiURL + recipeId, recipeData);
  }

  favoriteRecipe(recipeData: any) {
    return this.http.put(this.apiURL + recipeData.id, recipeData);
  }

  deleteRecipe(id: any) {
    return this.http.delete(this.apiURL + id);
  }
}
