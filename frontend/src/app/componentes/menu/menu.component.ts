import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '../../servicios/api.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  imports: [CommonModule, RouterModule, HttpClientModule]
})
export class MenuComponent implements OnInit, OnDestroy {
  @ViewChild('carritoScroll', { static: false }) carritoScroll!: ElementRef;
  @ViewChild('dropdownButton', { static: false }) dropdownButton!: ElementRef;

  mobileMenuOpen = false;
  dropdownOpen = false;
  carrito: any[] = [];

  nombreUsuario: string = '';
  emailUsuario: string = '';
  usuarioFotoPerfil: string | null = null;
  userId: string | null = null;
  carritoCantidad: number = 0;
  totalCarrito: number = 0;

  mostrarCarritoDropdown: boolean = false;

  private carritoSubscription!: Subscription;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && sessionStorage) {
      const token = sessionStorage.getItem('token');

      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          this.userId = decoded?.sub || null;

          if (this.userId) {
            this.apiService.obtenerUsuario(this.userId).subscribe({
              next: (data) => {
                this.nombreUsuario = data.name;
                this.emailUsuario = data.email;
                this.usuarioFotoPerfil = data.foto_perfil;
              },
              error: (err) => {
                console.error('Error al obtener usuario:', err);
              }
            });
          }
        } catch (error) {
          console.error('Token inválido o expirado:', error);
          sessionStorage.clear();
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    }

    this.carritoSubscription = this.apiService.carrito$.subscribe((data: any) => {
      const scrollElement = this.carritoScroll?.nativeElement;
      const currentScrollTop = scrollElement?.scrollTop || 0;

      this.carrito = Array.isArray(data.carrito)
        ? data.carrito
        : (Array.isArray(data.carrito?.carrito) ? data.carrito.carrito : []);

      this.actualizarTotales();

      // Restaurar scroll sin saltar
      setTimeout(() => {
        if (scrollElement) scrollElement.scrollTop = currentScrollTop;
      }, 50);
    });

    this.apiService.refrescarCarrito();
  }

  ngOnDestroy(): void {
    if (this.carritoSubscription) {
      this.carritoSubscription.unsubscribe();
    }
  }

  isMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth <= 768;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenus() {
    this.dropdownOpen = false;
    this.mobileMenuOpen = false;
    this.mostrarCarritoDropdown = false;
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

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.dropdownOpen = false;
      this.mobileMenuOpen = false;
      this.mostrarCarritoDropdown = false;
    }
  }

  // CARRITO

  aumentarCantidad(item: any) {
    const nuevaCantidad = item.cantidad + 1;
    if (nuevaCantidad <= item.producto.stock) {
      this.apiService.actualizarCantidadEnCarrito(item.id, nuevaCantidad).subscribe(() => {
        item.cantidad = nuevaCantidad;
        this.actualizarTotales();
      });
    }
  }

  disminuirCantidad(item: any) {
    if (item.cantidad > 1) {
      const nuevaCantidad = item.cantidad - 1;
      this.apiService.actualizarCantidadEnCarrito(item.id, nuevaCantidad).subscribe(() => {
        item.cantidad = nuevaCantidad;
        this.actualizarTotales();
      });
    } else {
      this.eliminarDelCarrito(item);
    }
  }

  eliminarDelCarrito(item: any) {
    this.apiService.eliminarProductoDelCarrito(item.id).subscribe(() => {
      this.carrito = this.carrito.filter(p => p.id !== item.id);
      this.actualizarTotales();
      this.apiService.refrescarCarrito();
    });
  }

  actualizarTotales() {
    this.carritoCantidad = this.carrito.reduce((total, item) => total + (item.cantidad || 0), 0);
    this.totalCarrito = this.carrito.reduce((total, item) => total + (item.cantidad * (item.producto?.precio || 0)), 0);
  }

  irACarrito() {
    // Cierra el dropdown del carrito
    const btn = this.dropdownButton?.nativeElement;
    if (btn) btn.click();

    this.router.navigate(['/carrito-cliente']);
  }
}
