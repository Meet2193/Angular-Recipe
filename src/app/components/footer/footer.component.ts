import { Component, Inject, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxMailSenderService } from '../../service/ngx-mail-sender.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  toEmailID = '';
  ngxMailSenderServices = inject(NgxMailSenderService);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  StrongEmailRegx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  submitted = false;

  emailData: FormGroup = this.formBuilder.group({
    to: ['', [Validators.required, Validators.pattern(this.StrongEmailRegx)]],
    subject: ['Hello from MyApp'],
    text: ['This is a test email.'],
    host: ['smtp.gmail.com'],
    authUser: ['meetnimavat170@gmail.com'],
    authPass: ['xprd rire rutn kqww'], // Use an Google app  Password of 2-factor authentication is enabled
    fromTitle: ['MyApp Support'],
  });

  get getControl(): { [key: string]: AbstractControl } {
    return this.emailData.controls;
  }

  sendMail() {
    this.submitted = true;
    console.log(this.emailData, 'thisisemail');
    if (this.emailData.invalid) return;
    this.ngxMailSenderServices
      .sendMail(this.emailData.value)
      .subscribe((res: any) => {
        if (res) {
          this.toastr.success('Email sent successfully');
          this.submitted = false;
          this.emailData.patchValue({
            to: '',
          });
        } else {
          this.toastr.error('Something went wrong Please try again');
        }
      });
  }
}