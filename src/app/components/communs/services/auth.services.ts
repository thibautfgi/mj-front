import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginCredentials, SignupRequest, AuthResponse, WhoiamResponse } from '../interfaces/auth.interface';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.authApiUrl + '/api/auth';
  private readonly TOKEN_KEY = environment.tokenKey;

  private _isLoggedIn = signal<boolean>(this.hasValidToken());
  private _user = signal<WhoiamResponse | null>(null); // ← signal user

  readonly isAuthenticated = computed(() => this._isLoggedIn());
  readonly user = this._user.asReadonly(); // ← exposé en lecture seule

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

  whoiam(): Observable<WhoiamResponse> {
    return this.http.get<WhoiamResponse>(`${this.baseUrl}/whoiam`).pipe(
      tap(res => this._user.set(res)) // ← stocke dans le signal
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this._isLoggedIn.set(false);
    this._user.set(null); // ← vide le signal user
    this.router.navigate(['/connection']);
  }

  private saveToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  private hasValidToken(): boolean {
    const token = sessionStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}
