import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth';
import { HomeComponent } from './home/home';   // ✅ Import HomeComponent

export const routes: Routes = [
  { path: '', component: HomeComponent },        // ✅ Home page (shows Navbar)
  { path: 'auth', component: AuthComponent },    // ✅ Login page (no Navbar)
  { path: '**', redirectTo: '' }                 // ✅ Wildcard redirect to home
];






