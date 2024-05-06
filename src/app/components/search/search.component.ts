import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AddRecipeComponent } from '../add-recipe/add-recipe.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink, FormsModule, AddRecipeComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  @Output() SearchingRecipe = new EventEmitter<string>();
  @Output() GetAllRecipe = new EventEmitter<any>();

  text = '';
  isAddNewRecipe = false;

  userQuestionUpdate = new Subject<string>();

  constructor() {
    // Debounce search.
    this.userQuestionUpdate
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        this.onSearch();
      });
  }
  onSearch() {
    this.SearchingRecipe.emit(this.text);
  }
}
