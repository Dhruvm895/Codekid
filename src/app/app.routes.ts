import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', loadComponent: () => import('./auth/auth').then(m => m.AuthComponent) },
  { path: 'login', loadComponent: () => import('./auth/auth').then(m => m.AuthComponent) },
  { path: 'auth/signup', loadComponent: () => import('./auth/signup/signup').then(m => m.SignupComponent) },
  { path: 'signup', loadComponent: () => import('./auth/signup/signup').then(m => m.SignupComponent) },
  { path: 'beginner', loadComponent: () => import('./beginner/beginner').then(m => m.BeginnerComponent) },


  { path: 'beginner/lesson/1', 
    loadComponent: () => import('./beginner/component/lesson1/lesson1').then(m => m.Lesson1Component) 
  },
  {
    path: 'beginner/lesson/2',
    loadComponent: () => import('./beginner/component/lesson2/lesson2').then(m => m.Lesson2Component)
   
  },
{
    path: 'beginner/lesson/2',
    loadComponent: () => import('./beginner/component/lesson3/lesson3').then(m => m.Lesson3Component)
    
  },
  
  { path: '**', redirectTo: '' }
];