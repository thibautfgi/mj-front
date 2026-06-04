// auth.services.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginCredentials, SignupRequest, AuthResponse, WhoiamResponse } from '../interfaces/auth.interface';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.authApiUrl+'/api/auth';
  private readonly TOKEN_KEY = environment.tokenKey;

  // ✅ Signal réactif — les composants se mettent à jour automatiquement
  private _isLoggedIn = signal<boolean>(this.hasValidToken());
  readonly isAuthenticated = computed(() => this._isLoggedIn());

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, {
      userEmail: credentials.email,
      userPassword: credentials.password
    }).pipe(
      tap((res: AuthResponse) => {
        this.saveToken(res.userToken);
        this._isLoggedIn.set(true);
      })
    );
  }

  register(request: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, {
      userFirstName: request.firstName || '',
      userLastName: request.lastName || '',
      userEmail: request.email,
      userPassword: request.password,
      userPhone: request.phone || ''
    }).pipe(
      tap((res: AuthResponse) => {
        this.saveToken(res.userToken);
        this._isLoggedIn.set(true);
      })
    );
  }

  // ✅ Plus besoin d'ajouter le header manuellement — l'intercepteur s'en charge
  whoiam(): Observable<WhoiamResponse> {
    return this.http.get<WhoiamResponse>(`${this.baseUrl}/whoiam`);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY); // ✅ sessionStorage : plus sûr que localStorage
  }

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this._isLoggedIn.set(false);
    // Navigation gérée par l'appelant ou l'intercepteur
  }

  private saveToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  private hasValidToken(): boolean {
    const token = sessionStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;
    try {
      // Vérification basique de l'expiration côté client (sans vérifier la signature)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}
