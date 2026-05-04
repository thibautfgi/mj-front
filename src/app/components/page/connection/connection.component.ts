import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../communs/services/auth.services';
import { LoginCredentials } from '../../communs/interfaces/auth.interface';
import { SignupModalComponent } from './signup-modal/signup-modal.component';


@Component({
  selector: 'app-connection',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SignupModalComponent],
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  showPassword = signal(false);
  isLoading = signal(false);
  showSignupModal = signal(false);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const credentials: LoginCredentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (users) => {
        const user = users.find((u: any) =>
          u.User_Email?.toLowerCase() === credentials.email.toLowerCase() &&
          u.User_Password === credentials.password
        );

        if (user) {
          document.cookie = `userId=${user.User_Id}; path=/; max-age=${60 * 60 * 24 * 7}`;
          alert('✅ Connexion réussie !');
          this.router.navigate(['/explorer']);   // ← Aligné avec tes routes
        } else {
          alert('❌ E-mail ou mot de passe incorrect');
        }
      },
      error: (err) => {
        console.error(err);
        alert('Erreur de connexion au serveur');
      },
      complete: () => this.isLoading.set(false)
    });
  }
}
