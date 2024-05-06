import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CredentialService } from '../../service/credential.service';
import { CommonModule } from '@angular/common';
import Validation from '../../util/validation';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  router = inject(Router);
  userCredService = inject(CredentialService);
  submitted = false;

  StrongPasswordRegx: RegExp =
    /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  StrongEmailRegx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  signUpForm: FormGroup = this.formBuilder.group(
    {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.pattern(this.StrongEmailRegx)],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [Validation.match('password', 'confirmPassword')],
    }
  );

  get getControl(): { [key: string]: AbstractControl } {
    return this.signUpForm.controls;
  }

  doSignUpUser() {
    this.submitted = true;
    console.log(`this.signUpForm.value`, this.signUpForm);
    if (this.signUpForm.invalid) return;
    this.userCredService
      .doSignUpData(this.signUpForm.value)
      .subscribe((res) => {
        if (!res) return;
        this.router.navigateByUrl('');
      });
  }
}
