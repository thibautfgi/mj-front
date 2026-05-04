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
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const { email, password } = this.loginForm.value;

    if (this.mode() === 'login') {
      // Connexion
      const credentials: LoginCredentials = { email, password };

      this.authService.login(credentials).subscribe({
        next: (users) => {
          const user = users.find((u: any) =>
            u.User_Email?.toLowerCase() === email.toLowerCase() &&
            u.User_Password === password
          );

          if (user) {
            document.cookie = `userId=${user.User_Id}; path=/; max-age=${60 * 60 * 24 * 7}`;
            alert('✅ Connexion réussie !');
            this.router.navigate(['/explorer']);
          } else {
            alert('❌ E-mail ou mot de passe incorrect');
          }
        },
        error: () => alert('Erreur de connexion au serveur'),
        complete: () => this.isLoading.set(false)
      });

    } else {
      // Inscription (simplifiée)
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
          this.switchMode('login'); // Retour automatique en mode connexion
        },
        error: () => alert('❌ Erreur lors de la création du compte'),
        complete: () => this.isLoading.set(false)
      });
    }
  }
}
