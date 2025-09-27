import { Component, Input } from '@angular/core';
import {RouterLink} from '@angular/router';

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

  constructor() { }

  onLogin(){
    //to be implemented
  }

  onRegister(){
    //to be implemented
  }

  onLogout(){
    //to be implemented
  }
}
