import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginCredentials, SignupRequest } from '../../communs/interfaces/auth.interface';
import { AuthService } from '../../communs/services/auth.services';


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

  // Mode : 'login' ou 'signup'
  mode = signal<'login' | 'signup'>('login');

  loginForm: FormGroup;
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isLoading = signal(false);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    });
  }

  // Changer de mode (Connexion / Inscription)
  switchMode(newMode: 'login' | 'signup') {
    this.mode.set(newMode);
    if (newMode === 'signup') {
      this.loginForm.get('confirmPassword')?.setValidators([Validators.required]);
    } else {
      this.loginForm.get('confirmPassword')?.clearValidators();
    }
    this.loginForm.get('confirmPassword')?.updateValueAndValidity();
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const formValue = this.loginForm.value;

    if (this.mode() === 'login') {
      const credentials: LoginCredentials = {
        email: formValue.email,
        password: formValue.password
      };

      this.authService.login(credentials).subscribe({
        next: (users) => {
          const user = users.find((u: any) =>
            u.User_Email?.toLowerCase() === credentials.email.toLowerCase() &&
            u.User_Password === credentials.password
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
      // Mode Inscription
      if (formValue.password !== formValue.confirmPassword) {
        alert('Les mots de passe ne correspondent pas');
        this.isLoading.set(false);
        return;
      }

      const signupData: SignupRequest = {
        firstName: '',      // non demandé
        lastName: '',       // non demandé
        email: formValue.email,
        password: formValue.password,
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
