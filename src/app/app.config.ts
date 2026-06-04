import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // ✅ AJOUT
import { routes } from './app.routes';
import { authInterceptor } from './components/interceptors/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // ✅ HttpClient avec l'intercepteur JWT global
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
