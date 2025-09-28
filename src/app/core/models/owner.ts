import {Apartment} from './apartment';
import {UserRegistrationDto} from './user';

export interface Owner{
  id: string;
  userId: string; //fk
  identityCardNumber: string;
  bankAccount: string;
  phoneNumber: string;
  apartments?: Apartment[];
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

export interface CombinedRegistrationDto extends UserRegistrationDto {
  identityCardNumber: string;
  bankAccount: string;
  phoneNumber: string;
}
