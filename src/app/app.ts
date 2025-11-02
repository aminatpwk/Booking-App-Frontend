import {Component, OnInit, signal} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {Footer} from './shared/components/footer/footer';
import {Header} from './shared/components/header/header';
import {AuthService} from './core/services/auth.service';

const IDLE_TIMEOUT_MS = 300000;

@Component({
  selector: 'app-root',
  imports: [ Footer, Header, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  headerTitle = '';
  showNavigation = true;
  showAuthButtons = true;
  currentUser: any = null;
  isUserDashboard = true;
  protected readonly title = signal('Booking-App-Frontend');
  private timeoutId: any;
  private eventListener!: () => void;

  constructor(private router: Router,  private authService: AuthService) {
    if(this.authService.isLoggedIn()) {
      this.currentUser = {};
      this.startIdleTimer();
    }

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
        } else if(event.urlAfterRedirects.startsWith('/user-dashboard')) {
          this.headerTitle = '';
          this.showNavigation = false;
          this.showAuthButtons = false;
          this.isUserDashboard = true;
        }
      }
    });
  }

  startIdleTimer(): void {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      if(this.authService.isLoggedIn()) {
        this.currentUser = null;
        this.authService.logOut();
      }
    }, IDLE_TIMEOUT_MS);
  }

  handleActivity = (): void => {
    if(this.authService.isLoggedIn()) {
      this.startIdleTimer();
    }
  }

  ngOnInit(): void{
    this.eventListener = this.handleActivity;
    document.addEventListener('mousedown', this.eventListener, true);
    document.addEventListener('mousemove', this.eventListener, true);
    document.addEventListener('keypress', this.eventListener, true);
    document.addEventListener('scroll', this.eventListener, true);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    document.removeEventListener('mousedown', this.eventListener, true);
    document.removeEventListener('mousemove', this.eventListener, true);
    document.addEventListener('keypress', this.eventListener, true);
    document.removeEventListener('scroll', this.eventListener, true);
  }

}
