import { Routes } from '@angular/router';
import { HomeComponent } from './components/page/home/home.component';
import { ConnectionComponent } from './components/page/connection/connection.component';
import { NotFoundComponent } from './components/page/not-found/not-found.component';
import { authGuard } from './components/communs/guards/auth.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    // PUBLIC
    path: 'home',
    component: HomeComponent
  },
  {
    // PUBLIC
    path: 'login',
    component: ConnectionComponent
  },
  {
    path: 'maps',
    canActivate: [authGuard], // protégé
    loadComponent: () => import('./components/page/maps/maps.component').then(m => m.MapsComponent)
  },
  {
    // Ajouter canActivate: [authGuard] sur toutes les nouvelles routes protégées
    path: '**',
    component: NotFoundComponent
  }
];
