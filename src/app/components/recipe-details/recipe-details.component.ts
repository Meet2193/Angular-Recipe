import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
  RouterLink,
} from '@angular/router';
import { AllRecipeService } from '../../service/all-recipe.service';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css',
})
export class RecipeDetailsComponent {
  activatedRoute = inject(ActivatedRoute);
  getAllRecipe = inject(AllRecipeService);
  recipe!: any;
  router = inject(Router);
  toastr = inject(ToastrService);
  recipeID!: any;
  isAccess!: boolean;
  loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '');
  isFavorite = false;
  isConfirm = false;

  ngOnInit() {
    this.getSingleRecipe();
  }

  getSingleRecipe() {
    this.recipeID = this.activatedRoute.snapshot.params['id'];
    this.getAllRecipe.getRecipeById(this.recipeID).subscribe((res: any) => {
      let isCreatedLoggedUser =
        res.createdBy ===
        this.loggedUser.firstName + ' ' + this.loggedUser.lastName;
      this.recipe = res;
      // console.log(res, loggedUser.id);

      this.isFavorite = this.recipe.favorite?.includes(this.loggedUser.id);
      isCreatedLoggedUser ? (this.isAccess = true) : (this.isAccess = false);
    });
  }

  editRecipe(recipeID: any) {
    this.router.navigateByUrl('add-recipe/' + recipeID);
  }

  favoriteRecipes() {
    if (!this.loggedUser) return;
    // console.log(`call favoriteRecipe`, this.recipe);

    if (this.recipe?.favorite?.includes(this.loggedUser.id)) {
      let findIndex = this.recipe?.favorite?.indexOf(this.loggedUser.id);
      this.recipe?.favorite?.splice(findIndex, 1);
    } else {
      this.recipe?.favorite?.push(this.loggedUser.id);
    }
    this.getAllRecipe
      .favoriteRecipe(this.recipe)
      .subscribe((isFavorite: any) => {
        this.getSingleRecipe();
      });
  }

  deleteRecipes() {
    this.getAllRecipe.deleteRecipe(this.recipe.id).subscribe(() => {
      this.toastr.success('Recipe Deleted Successfully');
      this.router.navigateByUrl('/dashboard');
    });
  }
}
