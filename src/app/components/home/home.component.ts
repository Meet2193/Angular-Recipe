import { Component, inject } from '@angular/core';
import { AllRecipeService } from '../../service/all-recipe.service';
import { SearchComponent } from '../search/search.component';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SearchFilterPipe } from '../../search-filter.pipe';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../states-NGRX/app.state';
import { selectCount } from '../../states-NGRX/favcounter/favcounter.selector';
import { AsyncPipe } from '@angular/common';
import { totalRecipe } from '../../states-NGRX/favcounter/favcounter';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent, RecipeCardComponent, SearchFilterPipe, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  recipeServices = inject(AllRecipeService);
  recipe = [];
  router = inject(Router);
  allRecipeServices = inject(AllRecipeService);
  toastr = inject(ToastrService);
  searchText!: string;
  favCount$!: Observable<number>;

  constructor(private store: Store<AppState>) {
    this.favCount$ = this.store.select(selectCount);
  }

  ngOnInit() {
    this.getAllRecipe();
  }

  getAllRecipe() {
    // console.log('WINDOW', window.location.pathname);
    this.recipeServices.getAllRecipe().subscribe((response: any) => {
      if (response) {
        this.recipe = response;
        this.store.dispatch(totalRecipe({ count: response?.length }));
      }
    });
  }

  onSearch(search: any) {
    this.searchText = search;
  }

  onDeleteRecipe(id: any) {
    this.recipeServices.deleteRecipe(id).subscribe(() => {
      this.toastr.success('Recipe Deleted Successfully');
      this.getAllRecipe();
    });
  }

  onGetAllRecipe(event: any) {
    this.getAllRecipe();
  }
}
