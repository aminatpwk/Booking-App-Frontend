import { Routes } from '@angular/router';
import {About} from './pages/about/about';
import {Register} from './features/auth/components/register/register';
import {Login} from './features/auth/components/login/login';
import {Dashboard} from './features/dashboard/dashboard';
import {authGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  {path: 'about-bookingapp', component: About},
  {path: 'register', component: Register},
  {path: 'login', component: Login},
  {path: 'dashboard', component:Dashboard, canActivate: [authGuard]}
];
