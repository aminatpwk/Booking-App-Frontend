import { Routes } from '@angular/router';
import {About} from './pages/about/about';
import {Register} from './features/auth/components/register/register';
import {Login} from './features/auth/components/login/login';
import {Dashboard} from './features/dashboard/dashboard';
import {authGuard} from './core/guards/auth.guard';
import {RegisterOwner} from './features/auth/components/register/register-owner/register-owner';
import {Contact} from './pages/contact/contact';
import {Policies} from './pages/policies/policies';
import {Terms} from './pages/terms/terms';
import {Rights} from './pages/rights/rights';
import {DashboardOwner} from './features/dashboard/dashboard-owner/dashboard-owner';

export const routes: Routes = [
  //lazy loading on the homepage component
  {path: '',loadComponent: () => import('./pages/home/home').then(c=>c.Home)},

  //pages routes
  {path: 'about-bookingapp', component: About},
  {path: 'contact', component: Contact},
  {path: 'policies', component:  Policies},
  {path: 'terms',   component: Terms},
  {path: 'rights', component: Rights},

  {path: 'register', component: Register},
  {path: 'login', component: Login},
  {path: 'user-dashboard', component:Dashboard, canActivate: [authGuard]},
  {path: 'register-owner', component: RegisterOwner, canActivate: [authGuard]},
  {path: 'dashboard-owner', component: DashboardOwner, canActivate: [authGuard]}
];
