import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { LoaderService } from '../../core/services/loading.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  singUpForm!: FormGroup;
  showPassword: boolean = false;

  private fb = inject(FormBuilder);
  store = inject(AuthStore);
  loader = inject(LoaderService);

  constructor() {
    this.singUpForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.pattern("^[a-zA-Z]{5,12}$")]
      ],
      email: ['', [Validators.required, Validators.email]],
      mobilenumber: ['', [
        Validators.required,
        Validators.pattern("^[0-9]{10}$")]
      ],
      password: ['', [
        Validators.required,
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,12}$")]
      ]
    })
  }

  get f() {
    return this.singUpForm.controls;
  }

  onFormSubmit(): void {

    this.singUpForm.markAllAsTouched();

    if (this.singUpForm.invalid) {
      return;
    }

    const formValue = this.singUpForm.value;

    this.store.register(formValue);

  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
