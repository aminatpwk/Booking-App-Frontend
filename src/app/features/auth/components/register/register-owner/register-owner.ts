import { Component } from '@angular/core';
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
export class RegisterOwner {
  ownerRegistrationForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private toastService: ToastService,
              private router: Router){

  }

  ngOnInit(){
    this.ownerRegistrationForm = this.formBuilder.group({
      identityCardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      bankAccount: ['', [Validators.required, Validators.minLength(16)]],
      phoneNumber:['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]]
    });
  }

  onSubmit(){
    if(this.ownerRegistrationForm.invalid){
      this.toastService.showWarning("Error", "Please fill all required fields!");
      return;
    }

    const payload = this.ownerRegistrationForm.value;

    this.authService.registerUser(payload).subscribe({
      next: (response) => {
        const newToken = response.token;
        if(newToken){
          localStorage.setItem('token', newToken);
        }
        this.toastService.showSuccess("Success", "Owner created successfully!");

        //TODO: change into owner specific dashboard here
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        const errorMessage = error.error?.message || "Owner registration failed!";
        this.toastService.showError("Error", errorMessage);
      }
    });
  }
}
