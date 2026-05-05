import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginCredentials, SignupRequest, User } from '../interfaces/auth.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '/api'; // Utilise le proxy Angular

  constructor(private http: HttpClient) {
  }

  // Connexion
  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, {
      userEmail: credentials.email,
      userPassword: credentials.password
    });
  }

  // Inscription
  register(request: SignupRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, {
      userFirstName: request.firstName || '',
      userLastName: request.lastName || '',
      userEmail: request.email,
      userPassword: request.password,
      userPhone: request.phone || ''
    });
  }
}
