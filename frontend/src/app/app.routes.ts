import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./componentes/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'inicio',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./componentes/vista-principal/vista-principal.component').then(m => m.VistaPrincipalComponent),
  },

];
