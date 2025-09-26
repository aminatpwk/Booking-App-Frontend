import {User} from './user';

export interface AuthResponseDto{
  user: User;
  token: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: string[];
  statusCode: number;
}
