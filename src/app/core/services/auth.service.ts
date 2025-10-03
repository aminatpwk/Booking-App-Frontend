import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const API_BASE_URL = 'https://localhost:7157/api/v1'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) {

    }

    registerUser(userDto: any): Observable<any> {
      return this.http.post(`${API_BASE_URL}/User/register`, userDto);
    }

    registerOwner(ownerDto: any): Observable<any> {
      return this.http.post(`${API_BASE_URL}/Owner`, ownerDto);
    }

}
