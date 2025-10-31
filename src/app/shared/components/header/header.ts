import { Component, Input } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  @Input() title: string= '';
  @Input() showNavigation: boolean = false;
  @Input() showAuthButtons: boolean = false;
  @Input() currentUser: any = null;

  constructor(private router: Router,  private authService: AuthService) {

  }

  onLogin(){
    this.router.navigateByUrl('/login');
  }

  onRegister(){
    this.router.navigate(['/register']);
  }

  onLogout() {
    this.authService.logOut();
    this.currentUser = null;
    this.router.navigateByUrl('/login');
  }
}
