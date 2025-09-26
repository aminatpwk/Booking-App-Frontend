import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  firstName = "";
  lastName = "";
  email = "";
  password = "";
  confirmPassword = "";

  onSubmit(){
    //implement register logic here :)
    console.log('Register form submitted');
  }
}
