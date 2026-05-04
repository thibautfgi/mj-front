import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginCredentials, SignupRequest, User } from '../interfaces/auth.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api';   // ← Aligné avec ton backend

  constructor(private http: HttpClient) {
  }

  // Login (méthode actuelle dans ton code)
  login(credentials: LoginCredentials): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  // Register
  register(request: SignupRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, {
      User_FirstName: request.firstName || '',
      User_LastName: request.lastName || '',
      User_Email: request.email,
      User_Password: request.password,
      User_Phone: request.phone || ''
    });
  }
}
