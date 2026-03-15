import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../store/auth.store';
import { RouterModule } from '@angular/router';
import { LoaderService } from '../../core/services/loading.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  public loginForm: FormGroup;
  showPassword: boolean = false;

  private fb = inject(FormBuilder);
  store = inject(AuthStore);
  loader = inject(LoaderService);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,12}$")]
      ]
    })
  }

  get f() {
    return this.loginForm.controls;
  }

  onFormSubmit(): void {

    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    const formValue = this.loginForm.value;

    this.store.login(formValue);

  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
