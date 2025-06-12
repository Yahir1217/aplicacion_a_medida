import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '../../servicios/api.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  imports: [CommonModule, RouterModule, HttpClientModule]
})
export class MenuComponent implements OnInit {
  mobileMenuOpen = false;
  dropdownOpen = false;

  nombreUsuario: string = '';
  emailUsuario: string = '';
  usuarioFotoPerfil: string | null = null;  


  constructor(
    private router: Router,
    private apiService: ApiService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('token');
      if (token) {
        const id = sessionStorage.getItem('user_id');
        if (id) {
          this.apiService.obtenerUsuario(id).subscribe({
            next: (data) => {
              this.nombreUsuario = data.name;
              this.emailUsuario = data.email;
              this.usuarioFotoPerfil = data.foto_perfil;

            },
            error: (err) => {
              console.error('Error al obtener usuario:', err);
            }
          });
        } else {
          console.warn('ID de usuario no encontrado en sessionStorage.');
        }
      } else {
        console.warn('Token no disponible todavía, no se llamó a obtenerUsuario().');
      }
    }
  }

  isMobile(): boolean {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenus() {
    this.dropdownOpen = false;
    this.mobileMenuOpen = false;
  }

  logout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  isCollapsed: { [key: string]: boolean } = {
    sidebarLayouts: false,
    sidebarTables: false
  };

  toggleCollapse(menu: string) {
    this.isCollapsed[menu] = !this.isCollapsed[menu];
  }

  toggleUserDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Cierra el dropdown si se hace clic fuera
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }
}
