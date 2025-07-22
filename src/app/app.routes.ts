import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth';
import { HomeComponent } from './home/home';
import { SignupComponent } from './auth/signup/signup'; // ✅ Import directly

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'auth/signup', loadComponent: () => import('./auth/signup/signup').then(m => m.SignupComponent) }, // ✅ Standalone component routing
  { path: '**', redirectTo: '' }
];
