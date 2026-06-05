import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // ✅ AJOUT
import { routes } from './app.routes';
import { authInterceptor } from './components/interceptors/auth.interceptor';
import { AuthService } from './components/communs/services/auth.services';
import { firstValueFrom } from 'rxjs';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return firstValueFrom(authService.initUser());
    })
  ]
};
