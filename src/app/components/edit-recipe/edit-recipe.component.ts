import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AllRecipeService } from '../../service/all-recipe.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './edit-recipe.component.html',
  styleUrl: './edit-recipe.component.css',
})
export class EditRecipeComponent {
  formBuilder = inject(FormBuilder);
  editRecipeServices = inject(AllRecipeService);
  toastr = inject(ToastrService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  recipeId = this.activatedRoute.snapshot.params['id'];

  editRecipe: FormGroup = this.formBuilder.group({
    CookTime: ['', [Validators.required]],
    ReadyIn: ['', [Validators.required]],
    Ingredients: [[], [Validators.required]],
    RecipeType: ['', [Validators.required]],
    image: ['', [Validators.required]],
    price: ['', [Validators.required]],
    description: ['', [Validators.required]],
    createdBy: [''],
    favorite: [[]],
  });

  ngOnInit() {
    this.editRecipeServices.getRecipeById(this.recipeId).subscribe((res) => {
      // console.log('REsS', res);
      this.editRecipe.patchValue(res);
    });
  }

  doEditRecipe() {
    // console.log('doAddRecipe', this.editRecipe.value);
    let loginUser = JSON.parse(localStorage.getItem('loggedUser') || '');

    if (!loginUser) return;
    let loginName = loginUser.firstName + ' ' + loginUser.lastName;

    if (loginName === this.editRecipe.value['createdBy']) {
      if (this.editRecipe.status === 'VALID') {
        // console.log(`loginUser`, loginUser);
        this.editRecipe.patchValue({
          createdBy: loginUser.firstName + ' ' + loginUser.lastName,
        });
        this.editRecipeServices
          .editRecipe(this.recipeId, this.editRecipe.value)
          .subscribe((response: any) => {
            this.toastr.success('Recipe Updated Successfully');
            this.router.navigateByUrl('recipe-details/' + this.recipeId);
          });
      } else {
        this.toastr.error('Please provide all reuired filed');
      }
    } else {
      this.toastr.error('Recipe Should be edit only By Author');
    }
  }
}
