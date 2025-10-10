import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Header} from '../../../../shared/components/header/header';
import {ToastService} from '../../../../core/services/toast.service';
import {Observable} from 'rxjs';
import {AuthService} from '../../../../core/services/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  registrationForm!: FormGroup;
  formSubmitted = false;

  constructor(public formBuilder: FormBuilder,
              public toastService: ToastService,
              public authService: AuthService) {
  }

  ngOnInit(){

    this.registrationForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });

  }

  passwordMatchValidator(form: FormGroup){
    const password = form.get('password')!.value;
    const confirmPassword = form.get('confirmPassword')!.value;
    if(password && confirmPassword && password !== confirmPassword) {
      return {
        passwordsDoNotMatch: true
      };
    }
    return null;
  }

  onSubmit(){
    this.formSubmitted = true;
    this.registrationForm.markAllAsTouched();

    if(this.registrationForm.invalid) {
      this.toastService.showWarning("Something went wrong!", "Please fill all the fields in the form");
      return;
    }

    let observable: Observable<any>;
    const formValue = this.registrationForm.value;

    const baseUserData = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password
    };

    observable = this.authService.registerUser(baseUserData);

    observable.subscribe({
      next: (response) => {
        console.log("Successful register!",response);
        this.toastService.showSuccess("Successful register!", "Welcome!");
        this.registrationForm.reset();
        this.formSubmitted = false;
      },
      error: (error) => {
        console.log("Error register!", error);
        const errorMessage = error.error?.message || "Registration failed. Try again later.";
        this.toastService.showError('Error register!', errorMessage);
      }
    });
  }
}
