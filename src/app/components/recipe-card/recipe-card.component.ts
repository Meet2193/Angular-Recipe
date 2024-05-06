import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AllRecipeService } from '../../service/all-recipe.service';
import { ToastrService } from 'ngx-toastr';
import { AddRecipeComponent } from '../add-recipe/add-recipe.component';
import { RecipeDetailsComponent } from '../recipe-details/recipe-details.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [
    RouterLink,
    AddRecipeComponent,
    RecipeDetailsComponent,
    MatIconModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
})
export class RecipeCardComponent {
  @Input() recipe!: any;
  service = inject(AllRecipeService);
  @Output() GetAllRecipe = new EventEmitter<any>();

  router = inject(Router);
  toastr = inject(ToastrService);
  loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '');
  isFavorite = false;
  ngOnInit() {
    this.isFavorite = this.recipe.favorite?.includes(this.loggedUser.id);
  }

  view() {
    this.router.navigateByUrl('recipe-details/' + this.recipe.id);
  }

  favoriteRecipes() {
    console.log('click favoriteRecipes -56');

    if (!this.loggedUser) return;
    if (this.recipe.favorite?.includes(this.loggedUser?.id)) {
      let findIndex = this.recipe?.favorite?.indexOf(this.loggedUser.id);
      this.recipe?.favorite?.splice(findIndex, 1);
    } else {
      this.recipe?.favorite?.push(this.loggedUser.id);
    }
    this.service.favoriteRecipe(this.recipe).subscribe(() => {
      this.GetAllRecipe.emit();
    });
  }
}
