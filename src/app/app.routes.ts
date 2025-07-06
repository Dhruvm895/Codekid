import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth';  // Adjust if file name differs

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' }, 
  { path: 'auth', component: AuthComponent },  // ✅ Add this route for login
];

