import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../../../core/services/auth.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-owner',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './register-owner.html',
  styleUrl: './register-owner.css'
})
export class RegisterOwner implements OnInit {
  ownerRegistrationForm!: FormGroup;
  userId: string | null = null;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private toastService: ToastService,
              private router: Router){

  }

  ngOnInit(){
    this.userId = this.authService.getUserId();

    if(!this.userId){
      this.toastService.showError('Error', 'User not authenticated. Please login again.');
      this.router.navigate(['/login']);
      return;
    }

    if(this.authService.getUserId() == "Owner"){
      this.toastService.showInfo('Info', 'You are already registered as an owner.');
      this.router.navigate(['/dashboard-owner']);
      return;
    }

    this.ownerRegistrationForm = this.formBuilder.group({
      identityCardNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z][0-9]{8}[A-Za-z]$/)
        ]
      ],
      bankAccount: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{16}$/)
        ]
      ],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(\+355|0)?[6-9][0-9]{7,8}$/)
        ]
      ]
    });
  }

  onSubmit(){
    if(this.ownerRegistrationForm.invalid){
      this.toastService.showWarning("Error", "Please fill all required fields!");
      return;
    }

    if(!this.userId){
      this.toastService.showError('Error', 'User ID not found. Please login again.');
      this.router.navigate(['/login']);
      return;
    }

    const payload = {
      userId: this.userId,
      ...this.ownerRegistrationForm.value
    };

    this.authService.registerOwner(payload).subscribe({
      next: (response) => {
        const newToken = response.token;
        if(newToken){
          localStorage.setItem('token', newToken);
        }
        this.toastService.showSuccess("Owner created successfully!", "Success");

        this.router.navigate(['/dashboard-owner']);
      },
      error: (error) => {
        const errorMessage = error.error?.message || "Owner registration failed!";
        this.toastService.showError("Error", errorMessage);
      }
    });
  }
}
