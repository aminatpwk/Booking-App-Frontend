import {Owner} from './owner';

export interface User {
  id: string; //string because backend has it stored as Guid
  firstName: string;
  lastName: string;
  email: string;
  password?: string; //never store this in frontend. For register/login usage only!
  createdOnUtc: Date;
  owner?: Owner;
}

export interface UserRegistrationDto{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface UserLoginDto{
  email: string;
  password: string;
}

export type UserRole = 'USER' | 'OWNER';

export class UserHelper{
  static isOwner(user: User) : boolean {
    return user.owner != null && user.owner != undefined;
  }

  static getRole(user: User):UserRole{
    return UserHelper.isOwner(user) ? 'OWNER' : 'USER';
  }

  static getFullName(user: User): string{
    return `${user.firstName} ${user.lastName}`;
  }
}

export interface UserWithOwnerStatus extends User {
  isOwner: boolean;
}
