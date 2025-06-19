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
      import('./componentes/generales/vista-principal/vista-principal.component').then(m => m.VistaPrincipalComponent),
  },
  {
    path: 'roles',
    canActivate: [AuthGuard],  // <- agrega el guard aquí
    loadComponent: () =>
      import('./componentes/administrador/roles/roles.component').then(m => m.RolesComponent),
  },
  {
    path: 'usuarios',
    canActivate: [AuthGuard], // <- y aquí también
    loadComponent: () =>
      import('./componentes/administrador/usuarios/usuarios.component').then(m => m.UsuariosComponent),
  },
  {
    path: 'categorias',
    canActivate: [AuthGuard], // <- y aquí también
    loadComponent: () =>
      import('./componentes/administrador/categorias/categorias.component').then(m => m.CategoriasComponent),
  },
  {
    path: 'negocios',
    canActivate: [AuthGuard], // <- y aquí también
    loadComponent: () =>
      import('./componentes/administrador/negocios/negocios.component').then(m => m.NegociosComponent),
  },
  {
    path: 'perfil',
    canActivate: [AuthGuard], // <- y aquí también
    loadComponent: () =>
      import('./componentes/generales/perfil/perfil.component').then(m => m.PerfilComponent),
  },
  {
    path: 'negocio/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./componentes/generales/negocio/negocio.component').then(m => m.NegocioComponent),
  },
  {
    path: 'reportes',
    canActivate: [AuthGuard], // <- y aquí también
    loadComponent: () =>
      import('./componentes/administrador/publicaciones-reportadas/publicaciones-reportadas.component').then(m => m.PublicacionesReportadasComponent),
  }
  
  
];

