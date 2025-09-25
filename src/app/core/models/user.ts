export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'User' | 'Owner';
  token: string;
}
