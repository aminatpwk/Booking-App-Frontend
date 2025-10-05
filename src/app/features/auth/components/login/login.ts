import { Component } from '@angular/core';
import {AuthService} from '../../../../core/services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit(): void{
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password:  ['', [Validators.required]]
    });
  }

  onSubmit(){
    this.errorMessage = null;

    if(this.loginForm.invalid){
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (token) => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = 'Wrong credentials or server error!'
      }
    });
  }
}
