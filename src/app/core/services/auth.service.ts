import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Router} from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import {environment} from '../../environment/environment';

interface DecodedToken{
  userId?: string;
  role: string;
  email: string;
  expirationDate: Date;
  sub?: string;
}

interface OwnerCheckResponse{
  hasOwnerProfile: boolean;
  ownerId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private readonly userRole = 'User';
    private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {

    }

    registerUser(userDto: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/User/register`, userDto);
    }

    registerOwner(ownerDto: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/Owner`, ownerDto);
    }

    login(credentials: any): Observable<string> {
      const loginPayload = {
        ...credentials,
        role: this.userRole
      }
      return this.http.post(`${this.apiUrl}/User/login`, loginPayload, {responseType: 'text'})
        .pipe(tap(token => {
          if(token){
            localStorage.setItem('token', token);
          }
        }));
    }

    checkOwnerProfile() : Observable<OwnerCheckResponse> {
      return this.http.get<OwnerCheckResponse>(`${this.apiUrl}/Owner/check-owner-profile`);
    }

    getToken(): string | null {
      return localStorage.getItem('token');
    }

    getDecodedToken(): DecodedToken | null{
      const token = this.getToken();
      if(!token) {
        return null;
      }

      try{
        return jwtDecode<DecodedToken>(token);
      }catch(error) {
        return null;
      }
    }

    getUserId(): string | null{
      const decoded = this.getDecodedToken();
      if(!decoded){
        return null;
      }

      return decoded.userId || decoded.sub || decoded.email || null;
    }

    role(): string{
      const  decoded = this.getDecodedToken();
      if(!decoded){
        return "";
      }

      return decoded.role;
    }

    isLoggedIn(): boolean{
      return !!this.getToken();
    }

    logOut(): void{
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
}
