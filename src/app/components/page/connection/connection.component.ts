import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../communs/services/auth.services';
import { LoginCredentials, SignupRequest } from '../../communs/interfaces/auth.interface';

@Component({
  selector: 'app-connection',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent {
  get passwordTooShort(): boolean {
    const pwd = this.loginForm.get('password')?.value;
    return typeof pwd === 'string' && pwd.length > 0 && pwd.length < 6;
  }

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  mode = signal<'login' | 'signup'>('login');
  loginForm: FormGroup;
  showPassword = signal(false);
  isLoading = signal(false);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  switchMode(newMode: 'login' | 'signup') {
    this.mode.set(newMode);
    this.loginForm.get('password')?.reset();
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const { email, password } = this.loginForm.value;

    if (this.mode() === 'login') {
      const credentials: LoginCredentials = { email, password };

      this.authService.login(credentials).subscribe({
        next: (res) => {
          // Le token est déjà stocké dans localStorage via le service
          alert(`✅ Connexion réussie ! Bonjour ${res.userFirstName}`);
          this.router.navigate(['/explorer']);
          this.isLoading.set(false);
        },
        error: (err) => {
          const msg = err?.error?.message || 'E-mail ou mot de passe incorrect';
          alert(`❌ ${msg}`);
          this.isLoading.set(false);
        }
      });

    } else {
      const signupData: SignupRequest = {
        firstName: '',
        lastName: '',
        email,
        password,
        phone: ''
      };

      this.authService.register(signupData).subscribe({
        next: () => {
          alert('✅ Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
          this.switchMode('login');
          this.isLoading.set(false);
        },
        error: (err) => {
          const msg = err?.error?.message || 'Erreur lors de la création du compte';
          alert(`❌ ${msg}`);
          this.isLoading.set(false);
        }
      });
    }
  }
}


