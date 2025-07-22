import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', loadComponent: () => import('./auth/auth').then(m => m.AuthComponent) },
  { path: 'login', loadComponent: () => import('./auth/auth').then(m => m.AuthComponent) },
  { path: 'auth/signup', loadComponent: () => import('./auth/signup/signup').then(m => m.SignupComponent) },
  { path: 'signup', loadComponent: () => import('./auth/signup/signup').then(m => m.SignupComponent) },
  { path: '**', redirectTo: '' }
];
