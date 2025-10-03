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
  isOwnerRegistration = false;
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
      confirmPassword: ['', [Validators.required]],
      isOwner: [false],
      identityCardNumber: [''],
      bankAccount: [''],
      phoneNumber: ['']
    }, {
      validators: this.passwordMatchValidator
    });
    this.registrationForm.get('isOwner')!.valueChanges.subscribe(isOwner => {
      this.isOwnerRegistration = isOwner;
      this.toggleOwnerValidations(isOwner);
    })
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

  toggleOwnerValidations(isOwner: boolean){
    const identityCardNo = this.registrationForm.get('identityCardNumber');
    const bankAccountNo = this.registrationForm.get('bankAccount');
    const phoneNo = this.registrationForm.get('phoneNumber');
    if(isOwner){
      identityCardNo?.setValidators([Validators.required, Validators.pattern(/^[0-9]{10}$/)]);
      bankAccountNo?.setValidators([Validators.required, Validators.minLength(16)]);
      phoneNo?.setValidators([Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]);
    }else{
      identityCardNo?.clearValidators();
      bankAccountNo?.clearValidators();
      phoneNo?.clearValidators();
      identityCardNo?.setValue('');
      bankAccountNo?.setValue('');
      phoneNo?.setValue('');
    }
    identityCardNo?.updateValueAndValidity();
    bankAccountNo?.updateValueAndValidity();
    phoneNo?.updateValueAndValidity();
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

    if(this.isOwnerRegistration) {
      const ownerPayload = {
        ...baseUserData,
        identityCardNumber: formValue.identityCardNumber,
        bankAccount: formValue.bankAccount,
        phoneNumber: formValue.phoneNumber
      }
      observable = this.authService.registerUser(ownerPayload);
    }else{
      observable = this.authService.registerUser(baseUserData);
    }

    observable.subscribe({
      next: (response) => {
        console.log("Successful register!",response);
        this.toastService.showSuccess("Successful register!", "Welcome!");
        this.registrationForm.reset({isOwner: false});
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
