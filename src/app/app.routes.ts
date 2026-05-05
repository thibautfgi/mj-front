import {Routes} from '@angular/router';
import {HomeComponent} from './components/page/home/home.component';
import {ConnectionComponent} from './components/page/connection/connection.component';
import {NotFoundComponent} from './components/page/not-found/not-found.component';
import { MapsComponent } from './components/page/maps/maps.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: ConnectionComponent
  },
  {
    path: 'maps',
    component: MapsComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
