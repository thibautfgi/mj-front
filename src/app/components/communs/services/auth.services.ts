import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginCredentials, SignupRequest, AuthResponse, WhoiamResponse } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  // Connexion — stocke le token dans localStorage
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, {
      userEmail: credentials.email,
      userPassword: credentials.password
    }).pipe(
      tap((res: AuthResponse) => localStorage.setItem('token', res.userToken))
    );
  }

  // Inscription — stocke le token dans localStorage
  register(request: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, {
      userFirstName: request.firstName || '',
      userLastName: request.lastName || '',
      userEmail: request.email,
      userPassword: request.password,
      userPhone: request.phone || ''
    }).pipe(
      tap((res: AuthResponse) => localStorage.setItem('token', res.userToken))
    );
  }

  // Qui suis-je ? (route protégée JWT)
  whoiam(): Observable<WhoiamResponse> {
    return this.http.get<WhoiamResponse>(`${this.baseUrl}/auth/whoiam`, {
      headers: { Authorization: `Bearer ${this.getToken()}` }
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}

