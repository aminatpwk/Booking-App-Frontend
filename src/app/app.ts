import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Register} from './features/auth/components/register/register';
import {Footer} from './shared/footer/footer';

@Component({
  selector: 'app-root',
  imports: [ Register, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Booking-App-Frontend');
}
