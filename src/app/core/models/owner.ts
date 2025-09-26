import {Apartment} from './apartment';

export interface Owner{
  id: string;
  userId: string; //fk
  identityCardNumber: string;
  bankAccount: string;
  phoneNumber: string;
  apartments?: Apartment[]; //apartment entity to define later!!
}

export interface OwnerRegistrationDto{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  identityCardNumber: string;
  bankAccount: string;
  phoneNumber: string;
}
