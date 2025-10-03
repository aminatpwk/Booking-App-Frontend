import { Routes } from '@angular/router';
import {About} from './pages/about/about';
import {Register} from './features/auth/components/register/register';

export const routes: Routes = [
  {path: 'about-bookingapp', component: About},
  {path: 'register', component: Register}
];
