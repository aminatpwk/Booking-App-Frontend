import { Component } from '@angular/core';
import {AuthService} from '../../../../core/services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../../core/services/toast.service';

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

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder,
              private toastService: ToastService) {
  }

  ngOnInit(): void{
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password:  ['', [Validators.required]]
    });
  }

  onSubmit(){
    if(this.loginForm.invalid){
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (token) => {
        this.toastService.showSuccess("You have been successfully logged in!", "Success");

        this.router.navigate(['/user-dashboard']);
      },
      error: (error) => {
        this.toastService.showError("Error", "Wrong credentials or server error!");
      }
    });
  }
}
