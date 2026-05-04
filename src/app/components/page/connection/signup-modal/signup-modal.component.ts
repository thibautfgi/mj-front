import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupRequest } from '../../../communs/interfaces/auth.interface';
import { AuthService } from '../../../communs/services/auth.services';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss']
})
export class SignupModalComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  readonly closeModal = output<void>();

  signupForm: FormGroup;
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isLoading = signal(false);

  constructor() {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phone: ['']
    });
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update(v => !v);
  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    if (this.signupForm.value.password !== this.signupForm.value.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    this.isLoading.set(true);

    const signupData: SignupRequest = {
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      phone: this.signupForm.value.phone
    };

    this.authService.register(signupData).subscribe({
      next: () => {
        alert('✅ Compte créé avec succès !');
        this.closeModal.emit();
      },
      error: () => alert('❌ Erreur lors de la création du compte'),
      complete: () => this.isLoading.set(false)
    });
  }
}
