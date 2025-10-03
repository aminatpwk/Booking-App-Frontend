import { Component, signal } from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {Footer} from './shared/components/footer/footer';
import {Header} from './shared/components/header/header';

@Component({
  selector: 'app-root',
  imports: [ Footer, Header, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  headerTitle = '';
  showNavigation = true;
  showAuthButtons = true;
  currentUser: any = null;
  protected readonly title = signal('Booking-App-Frontend');

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects.startsWith('/register')) {
          this.headerTitle = 'Create Account';
          this.showNavigation = false;
          this.showAuthButtons = false;
        } else if (event.urlAfterRedirects.startsWith('/login')) {
          this.headerTitle = 'Login';
          this.showNavigation = false;
          this.showAuthButtons = false;
        } else {
          this.headerTitle = '';
          this.showNavigation = true;
          this.showAuthButtons = true;
        }
      }
    });
  }
}
