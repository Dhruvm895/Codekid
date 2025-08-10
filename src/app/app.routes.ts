import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', loadComponent: () => import('./auth/auth').then(m => m.AuthComponent) },
  { path: 'login', loadComponent: () => import('./auth/auth').then(m => m.AuthComponent) },
  { path: 'auth/signup', loadComponent: () => import('./auth/signup/signup').then(m => m.SignupComponent) },
  { path: 'signup', loadComponent: () => import('./auth/signup/signup').then(m => m.SignupComponent) },
  { path: 'beginner', loadComponent: () => import('./beginner/beginner').then(m => m.BeginnerComponent) },

  // ✅ RECOMMENDED: A single, clear, and logical path for the lesson.
  // This URL implies that "Lesson 1" is part of the "Beginner" section.
  { 
    path: 'beginner/lesson/1', 
    loadComponent: () => import('./beginner/component/lesson1/lesson1').then(m => m.Level1Component) 
    // Pro-tip: For consistency, consider renaming 'Level1Component' to 'Lesson1Component' in its own file.
  },

  // The wildcard route should always be the last one.
  { path: '**', redirectTo: '' }
];