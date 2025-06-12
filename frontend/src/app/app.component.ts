import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MenuComponent } from './componentes/menu/menu.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <!-- Layout completo (header + menú + contenido) -->
    <div *ngIf="!isLoginPage" id="layout-wrapper">
      <header id="page-topbar">
        <div class="layout-width">
          <!-- Header content -->
        </div>
      </header>

      <app-menu></app-menu>

      <div class="main-content">
        <div class="page-content">
          <div class="container-fluid">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
    </div>

    <!-- Solo login: pantalla completa -->
    <div *ngIf="isLoginPage" class="login-wrapper">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5; /* puedes personalizar */
    }
  `],
  imports: [RouterModule, MenuComponent, CommonModule],
})
export class AppComponent {
  isLoginPage = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.isLoginPage = event.urlAfterRedirects === '/login';
    });
  }
}
