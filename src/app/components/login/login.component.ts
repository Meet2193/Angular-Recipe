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
import { CredentialService } from '../../service/credential.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  formBuilder = inject(FormBuilder);
  allUserCred = inject(CredentialService);
  toastr = inject(ToastrService);
  router = inject(Router);
  allUsercred = [];
  submitted = false;

  StrongEmailRegx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  loginUser: FormGroup = this.formBuilder.group({
    email: [
      '',
      [Validators.required, Validators.pattern(this.StrongEmailRegx)],
    ],
    password: ['', [Validators.required]],
  });

  ngOnInit() {
    this.getAllUserCred();
  }

  getAllUserCred() {
    this.allUserCred.getAllUserCred().subscribe((allUsercred: any) => {
      this.allUsercred = allUsercred;
    });
  }

  get getControl(): { [key: string]: AbstractControl } {
    return this.loginUser.controls;
  }

  doLogin() {
    this.submitted = true;
    console.log('all user credential', this.allUsercred);
    if (this.loginUser.invalid) return;

    let findUser = this.allUsercred?.find((cred: any) => {
      if (
        cred.email === this.loginUser.value['email'] &&
        cred.password === this.loginUser.value['password']
      ) {
        return cred;
      }
    });
    if (findUser) {
      localStorage.setItem('authToken', Date.now().toLocaleString());
      localStorage.setItem('loggedUser', JSON.stringify(findUser));
      this.toastr.success('Login Successfully');
      this.router.navigateByUrl('/dashboard');
    } else {
      this.toastr.error('This details are not match with our database');
    }
  }
}
