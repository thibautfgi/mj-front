import { Routes } from '@angular/router';
import { HomeComponent } from './components/page/home/home.component';
import { ConnectionComponent } from './components/page/connection/connection.component';
import { NotFoundComponent } from './components/page/not-found/not-found.component';
import { MapsComponent } from './components/page/maps/maps.component';
import { authGuard } from './components/communs/guards/auth.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    // ✅ PUBLIC — accessible sans connexion
    path: 'home',
    component: HomeComponent
  },
  {
    // ✅ PUBLIC — page de connexion/inscription
    path: 'login',
    component: ConnectionComponent
  },
  {
    // ✅ PROTÉGÉ — nécessite un token JWT valide
    path: 'maps',
    component: MapsComponent,
    canActivate: [authGuard]
  },
  {
    // Ajouter canActivate: [authGuard] sur toutes les nouvelles routes protégées
    path: '**',
    component: NotFoundComponent
  }
];
