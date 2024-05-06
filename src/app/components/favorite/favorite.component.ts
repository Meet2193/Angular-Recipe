import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { AllRecipeService } from '../../service/all-recipe.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [SearchComponent, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css',
})
export class FavoriteComponent {
  recipe!: any;
  filterdRecipe!: any;
  recipeServices = inject(AllRecipeService);
  router = inject(Router);
  toastr = inject(ToastrService);
  ngOnInit() {
    this.getAllFavoriteRecipe();
  }

  getAllFavoriteRecipe() {
    let loginUser = JSON.parse(localStorage.getItem('loggedUser') || '');
    if (!loginUser) return;
    this.recipeServices.getAllRecipe().subscribe((response: any) => {
      this.recipe = response?.filter((filterRecipe: any) =>
        filterRecipe?.favorite?.includes(loginUser?.id)
      );
      this.filterdRecipe = this.recipe;
    });
  }

  view(recipeId: number) {
    this.router.navigateByUrl('recipe-details/' + recipeId);
  }

  favoriteRecipes(favoriteRecipe: any) {
    let loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '');

    if (!loggedUser) return;
    if (favoriteRecipe.favorite?.includes(loggedUser?.id)) {
      let findIndex = favoriteRecipe.favorite?.indexOf(loggedUser.id);
      favoriteRecipe.favorite?.splice(findIndex, 1);
    }
    this.recipeServices.favoriteRecipe(favoriteRecipe).subscribe(() => {
      this.getAllFavoriteRecipe();
    });
  }
}
