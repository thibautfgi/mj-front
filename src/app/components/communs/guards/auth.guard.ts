import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.services';


export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // ✅ Utilisateur connecté → accès autorisé
  }

  // ❌ Non connecté → redirection vers /login
  return router.createUrlTree(['/login']);
};
