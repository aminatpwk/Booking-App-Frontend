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
import {PaginatedResults} from './pages/paginatedresults/paginated-results.component';
import {ApartmentDetails} from './pages/apartment-details/apartmentdetails/apartment-details';

export const routes: Routes = [
  //lazy loading on the homepage component
  {path: '',loadComponent: () => import('./pages/home/home').then(c=>c.Home)},

  //static pages
  {path: 'about-bookingapp', component: About},
  {path: 'contact', component: Contact},
  {path: 'policies', component:  Policies},
  {path: 'terms',   component: Terms},
  {path: 'rights', component: Rights},

  //auth
  {path: 'register', component: Register},
  {path: 'login', component: Login},

  //uncomment for the booking e-mail confirmation link
  // {
  //   path: 'booking/confirm/:token',
  //   loadComponent: () =>
  //     import('./pages/booking-action/booking-action').then(c => c.BookingAction),
  //   data: { action: 'confirm' }
  // },
  // {
  //   path: 'booking/cancel/:token',
  //   loadComponent: () =>
  //     import('./pages/booking-action/booking-action').then(c => c.BookingAction),
  //   data: { action: 'cancel' }
  // },

  //protected routes
  {path: 'user-dashboard', component:Dashboard, canActivate: [authGuard]},
  {path: 'register-owner', component: RegisterOwner, canActivate: [authGuard]},
  {path: 'dashboard-owner', component: DashboardOwner, canActivate: [authGuard]},

  //search results and detail
  {path: 'results', component: PaginatedResults},
  {path: 'apartment/:id', component: ApartmentDetails},

  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then(c=>c.NotFound)
  }
];
