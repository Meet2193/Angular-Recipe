import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AllRecipeService } from '../../service/all-recipe.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-recipe',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-recipe.component.html',
  styleUrl: './add-recipe.component.css',
})
export class AddRecipeComponent {
  @Input() recipeID!: any;

  formBuilder = inject(FormBuilder);
  addRecipeService = inject(AllRecipeService);
  toastr = inject(ToastrService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  isRecipeId: any;
  title = '';
  submitted = false;
  stepRecipe: [] | any = [];

  addRecipe: FormGroup = this.formBuilder.group({
    CookTime: ['', [Validators.required]],
    ReadyIn: ['', [Validators.required]],
    Ingredients: [[]],
    RecipeType: ['', [Validators.required]],
    image: ['', [Validators.required]],
    price: ['', [Validators.required]],
    description: ['', [Validators.required]],
    createdBy: [''],
    favorite: [[]],
    addRecipeStep: [''],
    steps: new FormArray([]),
  });

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  ingredients: [] | any = [];

  ngOnInit() {
    this.getAddEditRecipe();
  }

  // convenience getters for easy access to form fields
  get f() {
    return this.addRecipe.controls;
  }
  get t() {
    return this.f['steps'] as FormArray;
  }
  get stepFormGroup() {
    return this.t.controls as FormGroup[];
  }

  get stepFormControl() {
    return this.t.value?.length > 0 ? false : true;
  }

  getAddEditRecipe() {
    this.isRecipeId = this.activatedRoute.snapshot.params['id'];
    console.log(this.recipeID, this.isRecipeId);

    if (this.isRecipeId) {
      this.title = 'Update';
      // console.log(this.stepFormGroup, 'stepFormGroup');

      this.addRecipeService
        .getRecipeById(this.isRecipeId)
        .subscribe((res: any) => {
          console.log('REsS', res);
          this.ingredients = res.Ingredients;
          this.addRecipe.patchValue(res);
          const stepsArray = this.addRecipe.get('steps') as FormArray;
          stepsArray.clear();

          // Add steps from res.steps
          res.steps.forEach((step: any) => {
            stepsArray.push(
              this.formBuilder.group({
                step: [step.step, [Validators.required]],
              })
            );
          });
          // console.log('STEPS', this.addRecipe, res, this.stepFormGroup, res);
        });
    } else {
      this.title = 'Add';
    }
  }

  get getControl(): { [key: string]: AbstractControl } {
    return this.addRecipe.controls;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our ingredients
    if (value) {
      this.ingredients.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(ingredients: any): void {
    const index = this.ingredients.indexOf(ingredients);

    if (index >= 0) {
      this.ingredients.splice(index, 1);
    }
  }

  edit(ingredients: any, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove ingredients if it no longer has a name
    if (!value) {
      this.remove(ingredients);
      return;
    }

    // Edit existing ingredients
    const index = this.ingredients.indexOf(ingredients);
    if (index >= 0) {
      this.ingredients[index] = value;
    }
  }

  addEditRecipe() {
    if (this.title === 'Add') {
      this.doAddRecipe();
    } else if (this.title === 'Update') {
      this.doEditRecipe();
    }
  }

  doAddRecipe() {
    this.submitted = true;
    if (this.addRecipe.invalid) return;

    if (this.ingredients?.length > 0 && !this.stepFormControl) {
      let loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '');
      this.addRecipe.patchValue({
        Ingredients: this.ingredients,
        createdBy: loggedUser.firstName + ' ' + loggedUser.lastName,
      });
      this.addRecipeService.addRecipe(this.addRecipe.value).subscribe(() => {
        this.toastr.success('Added new Recipe Successfully');
        this.router.navigateByUrl('/dashboard');
      });
    }
  }

  doEditRecipe() {
    this.submitted = true;
    console.log('doEditRecipe', this.addRecipe, this.ingredients);
    let loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '');

    if (!loggedUser) return;
    if (this.addRecipe.invalid) return;
    let loginName = loggedUser.firstName + ' ' + loggedUser.lastName;

    if (loginName === this.addRecipe.value['createdBy']) {
      if (this.ingredients.length > 0 && !this.stepFormControl) {
        this.addRecipe.patchValue({
          Ingredients: this.ingredients,
          createdBy: loggedUser.firstName + ' ' + loggedUser.lastName,
        });
        this.addRecipeService
          .editRecipe(this.isRecipeId, this.addRecipe.value)
          .subscribe(() => {
            this.toastr.success('Recipe Updated Successfully');
            this.router.navigateByUrl('recipe-details/' + this.isRecipeId);
          });
      }
    } else {
      this.toastr.error('Recipe Should be edit only By Author');
    }
  }

  addStepRecipe() {
    if (!this.addRecipe.value['addRecipeStep']) return;
    let stepOfRecipe = this.addRecipe.value['addRecipeStep'];
    this.t.push(
      this.formBuilder.group({
        step: [stepOfRecipe, [Validators.required]],
      })
    );
    this.addRecipe.patchValue({
      addRecipeStep: '',
    });
  }

  deleteStepReicpe(index: any) {
    console.log(index, 'deleteStep');
    this.t.removeAt(index);
  }
}
