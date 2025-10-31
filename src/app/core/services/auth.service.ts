import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Router} from '@angular/router';

const API_BASE_URL = 'https://localhost:7157/api/v1'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly userRole = 'User';

    constructor(private http: HttpClient, private router: Router) {

    }

    registerUser(userDto: any): Observable<any> {
      return this.http.post(`${API_BASE_URL}/User/register`, userDto);
    }

    registerOwner(ownerDto: any): Observable<any> {
      return this.http.post(`${API_BASE_URL}/Owner`, ownerDto);
    }

    login(credentials: any): Observable<string> {
      const loginPayload = {
        ...credentials,
        role: this.userRole
      }
      return this.http.post(`${API_BASE_URL}/User/login`, loginPayload, {responseType: 'text'})
        .pipe(tap(token => {
          if(token){
            localStorage.setItem('token', token);
          }
        }));
    }

    getToken(): string | null {
      return localStorage.getItem('token');
    }

    isLoggedIn(): boolean{
      return !!this.getToken();
    }

    logOut(): void{
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
}
