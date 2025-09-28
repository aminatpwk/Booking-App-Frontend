import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Header} from '../../../../shared/components/header/header';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Header
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registrationForm!: FormGroup;
  isOwnerRegistration = false;

  constructor(public formBuilder: FormBuilder) {
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
    if(this.registrationForm.valid) {
      console.log('Form sent successfully', this.registrationForm.value);
    }else{

      console.log('Error in the form');
    }
  }
}
