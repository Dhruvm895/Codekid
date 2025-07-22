import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true, // ✅ Add this
  selector: 'app-signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
  imports: [CommonModule, ReactiveFormsModule] // ✅ Required for forms and *ngIf
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get name() {
    return this.signupForm.get('name');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    setTimeout(() => {
      this.isLoading = false;
      const { name, email, password } = this.signupForm.value;
      console.log('SignUp success:', { name, email, password });

      this.router.navigate(['/auth']);
    }, 1500);
  }

  signUpWithGoogle() {
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?...';
  }
}
