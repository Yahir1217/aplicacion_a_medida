import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../servicios/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-carrito-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito-cliente.component.html',
  styleUrls: ['./carrito-cliente.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarritoClienteComponent implements OnInit, OnDestroy {
  usuario: any = null;
  carrito: any[] = [];
  carritoAgrupado: any[] = [];
  carritoCantidad: number = 0;
  private carritoSubscription!: Subscription;

  subtotalProductos: number = 0;
  comisionServicio: number = 0;
  comisionStripe: number = 0;
  totalClientePaga: number = 0;

  metodoPago: string = 'efectivo';
  direccionEntrega: string = '';

  mostrarOpcionesDomicilio: boolean = false;

  entregasPorNegocio: { [negocioId: number]: 'recoger' | 'domicilio' } = {};
  comentariosPorNegocio: { [negocioId: number]: { habilitado: boolean, texto: string } } = {};

  userId: string | null = null;
  nombreUsuario: string = '';
  emailUsuario: string = '';
  usuarioFotoPerfil: string | null = null;

  mapaLibre: any;
  latitudUsuario: number | null = null;
  longitudUsuario: number | null = null;
  latitudNegocio: number | null = null;
  longitudNegocio: number | null = null;
  direccionSeleccionada: any = null; // Guarda la dirección seleccionada del usuario

  tarjetas: any[] = [];
  tarjetaSeleccionadaId: string | null = null;



  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Obtener el token y decodificar el ID del usuario
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          this.userId = decoded.sub;
        } catch (error) {
          console.error('Error decodificando token:', error);
        }
      }
    } else {
      console.warn('sessionStorage no está disponible.');
    }
  
    // Suscribirse al observable del carrito (que trae usuario y carrito)
    this.carritoSubscription = this.apiService.carrito$.subscribe((data: any) => {
      console.log('Datos completos recibidos:', data);
  
      this.usuario = data.carrito?.usuario ?? {};
      this.tarjetas = this.usuario?.tarjetas ?? []; // 👈 Aquí la agregas
      this.nombreUsuario = this.usuario?.name ?? '';
      this.emailUsuario = this.usuario?.email ?? '';
      this.usuarioFotoPerfil = this.usuario?.foto_perfil ?? null;
  
      // Obtener coordenadas del usuario
      if (this.usuario?.direcciones?.length > 0) {
        this.latitudUsuario = parseFloat(this.usuario.direcciones[0].latitud);
        this.longitudUsuario = parseFloat(this.usuario.direcciones[0].longitud);
      }
  
      // Asignar carrito según si es arreglo o está anidado
      if (Array.isArray(data.carrito)) {
        this.carrito = data.carrito;
      } else if (data.carrito && Array.isArray((data.carrito as any).carrito)) {
        this.carrito = (data.carrito as any).carrito;
      } else {
        this.carrito = [];
      }
  
      // Obtener coordenadas del primer negocio (para el mapa)
      if (this.carrito.length > 0) {
        const primerNegocio = this.carrito[0]?.producto?.negocio;
        if (primerNegocio?.direcciones?.length > 0) {
          this.latitudNegocio = parseFloat(primerNegocio.direcciones[0].latitud);
          this.longitudNegocio = parseFloat(primerNegocio.direcciones[0].longitud);
        }
      }
  
      // Calcular cantidad total en carrito
      this.carritoCantidad = this.carrito.reduce((total: number, producto: any) => {
        return total + (producto.cantidad || 0);
      }, 0);
  
      // Agrupar carrito por negocio
      this.carritoAgrupado = this.agruparPorNegocio(this.carrito);
  
      // Inicializar entregas y comentarios por negocio si no existen
      this.carritoAgrupado.forEach(negocio => {
        if (!(negocio.id in this.entregasPorNegocio)) {
          this.entregasPorNegocio[negocio.id] = 'recoger';
        }
        if (!(negocio.id in this.comentariosPorNegocio)) {
          this.comentariosPorNegocio[negocio.id] = { habilitado: false, texto: '' };
        }
      });
  
      this.calcularTotales();
  
      // Inicializar mapa (esperar un poco para asegurar render del DOM)
      setTimeout(() => {
        this.inicializarMapa();
      }, 300);
    });
  
    this.apiService.refrescarCarrito();
  }
  

  ngOnDestroy(): void {
    this.carritoSubscription?.unsubscribe();
  }

  agruparPorNegocio(productos: any[]) {
    const negociosMap: { [key: string]: any } = {};
  
    productos.forEach(item => {
      const negocio = item.producto.negocio; // ✅ Se define primero
      const negocioId = negocio.id;
  
      if (!negociosMap[negocioId]) {
        negociosMap[negocioId] = {
          id: negocioId,
          nombre: negocio.nombre,
          logo_url: negocio.logo_url,
          servicio_domicilio: negocio.servicio_domicilio,
          direcciones: negocio.direcciones, // ✅ Ya puedes usarlo aquí sin error
          productos: []
        };
      }
  
      negociosMap[negocioId].productos.push(item);
    });
  
    return Object.values(negociosMap);
  }
  

  calcularTotales() {
    this.subtotalProductos = this.carrito.reduce(
      (acc, item) => acc + (item.cantidad * parseFloat(item.producto.precio)),
      0
    );

    if (this.metodoPago === 'efectivo') {
      this.totalClientePaga = this.subtotalProductos;
      this.comisionServicio = 0;
      this.comisionStripe = 0;
    } else {
      const cargosFijos = 10;
      const base = this.subtotalProductos + cargosFijos;
      this.totalClientePaga = (base + 3) / (1 - 0.036);
      this.comisionStripe = this.totalClientePaga * 0.036 + 3;
      this.comisionServicio = this.totalClientePaga - this.subtotalProductos;
    }
  }

  cambiarMetodoPago(valor: string) {
    this.metodoPago = valor;
    this.calcularTotales();
  }

  aumentarCantidad(item: any) {
    const nuevaCantidad = item.cantidad + 1;
    if (nuevaCantidad <= item.producto.stock) {
      this.apiService.actualizarCantidadEnCarrito(item.id, nuevaCantidad).subscribe(() => {
        item.cantidad = nuevaCantidad;
        this.apiService.refrescarCarrito();
      });
    }
  }

  disminuirCantidad(item: any) {
    if (item.cantidad > 1) {
      const nuevaCantidad = item.cantidad - 1;
      this.apiService.actualizarCantidadEnCarrito(item.id, nuevaCantidad).subscribe(() => {
        item.cantidad = nuevaCantidad;
        this.apiService.refrescarCarrito();
      });
    } else {
      this.eliminarDelCarrito(item);
    }
  }

  eliminarDelCarrito(item: any) {
    this.apiService.eliminarProductoDelCarrito(item.id).subscribe(() => {
      this.carrito = this.carrito.filter(p => p.id !== item.id);
      this.carritoCantidad = this.carrito.reduce((acc, el) => acc + el.cantidad, 0);
      this.carritoAgrupado = this.agruparPorNegocio(this.carrito);

      this.entregasPorNegocio = {};
      this.carritoAgrupado.forEach(grupo => {
        const negocioId = grupo.id;
        this.entregasPorNegocio[negocioId] = 'recoger';
      });

      this.calcularTotales();
    });
  }

  tieneEntregaDomicilio(): boolean {
    return Object.values(this.entregasPorNegocio).includes('domicilio');
  }

  seleccionarTodosADomicilio(): void {
    this.carritoAgrupado.forEach(negocio => {
      this.entregasPorNegocio[negocio.id] = 'domicilio';
    });
  
    this.actualizarMapa(); // 🔁 Llamada para redibujar los marcadores
  }
  

  ////MAPA

// Método para comparar objetos en el select (para que Angular reconozca la selección)
compareDirecciones(dir1: any, dir2: any): boolean {
  if (!dir1 || !dir2) return false;
  return dir1.titulo === dir2.titulo && dir1.referencia === dir2.referencia;
}

// Retorna true si al menos un negocio está en modo 'domicilio'
hayDomicilioSeleccionado(): boolean {
  return Object.values(this.entregasPorNegocio).some(valor => valor === 'domicilio');
}

// Modifica la función inicializarMapa para usar la dirección seleccionada y negocios con domicilio
inicializarMapa(): void {
  const mapContainer = document.getElementById('map');
  if (!mapContainer || !this.direccionSeleccionada) return;

  if (this.mapaLibre) {
    this.mapaLibre.remove(); // eliminar mapa anterior
  }

  this.mapaLibre = new maplibregl.Map({
    container: mapContainer,
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    center: [parseFloat(this.direccionSeleccionada.longitud), parseFloat(this.direccionSeleccionada.latitud)],
    zoom: 13
  });

  // 📍 Marcador del usuario (dirección seleccionada)
  const elUsuario = document.createElement('div');
  elUsuario.style.backgroundImage = 'url("https://cdn-icons-png.flaticon.com/512/6735/6735939.png")';
  elUsuario.style.width = '40px';
  elUsuario.style.height = '40px';
  elUsuario.style.backgroundSize = 'cover';
  elUsuario.style.backgroundRepeat = 'no-repeat';
  elUsuario.style.borderRadius = '50%';

  new maplibregl.Marker({ element: elUsuario })
    .setLngLat([
      parseFloat(this.direccionSeleccionada.longitud),
      parseFloat(this.direccionSeleccionada.latitud)
    ])
    .addTo(this.mapaLibre);

  // 📍 Marcadores de negocios con entrega a domicilio
  this.carritoAgrupado.forEach(negocio => {
    const direccionNegocio = negocio?.direcciones?.[0];

    if (
      this.entregasPorNegocio[negocio.id] === 'domicilio' &&
      direccionNegocio?.latitud &&
      direccionNegocio?.longitud
    ) {
      const latNeg = parseFloat(direccionNegocio.latitud);
      const lngNeg = parseFloat(direccionNegocio.longitud);

      if (!isNaN(latNeg) && !isNaN(lngNeg)) {
        const elNegocio = document.createElement('div');
        elNegocio.style.backgroundImage = 'url("https://cdn-icons-png.flaticon.com/512/420/420199.png")';
        elNegocio.style.width = '40px';
        elNegocio.style.height = '40px';
        elNegocio.style.backgroundSize = 'cover';
        elNegocio.style.backgroundRepeat = 'no-repeat';
        elNegocio.style.borderRadius = '50%';

        new maplibregl.Marker({ element: elNegocio })
          .setLngLat([lngNeg, latNeg])
          .addTo(this.mapaLibre);
      }
    }
  });

  this.mapaLibre.on('load', () => {
    this.mapaLibre.resize();
  });
}


// Método para actualizar el mapa cuando cambian las selecciones
actualizarMapa() {
  if (this.hayDomicilioSeleccionado() && this.direccionSeleccionada) {
    setTimeout(() => {
      this.inicializarMapa();
    }, 100); // permite que el DOM se actualice
  } else if (this.mapaLibre) {
    this.mapaLibre.remove();
    this.mapaLibre = null;
  }
}

}  
