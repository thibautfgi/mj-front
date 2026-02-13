import {Routes} from '@angular/router';
import {HomeComponent} from './components/page/home/home.component';
import {ConnectionComponent} from './components/page/connection/connection.component';
import {NotFoundComponent} from './components/page/not-found/not-found.component';

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
    path: 'connection',
    component: ConnectionComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
