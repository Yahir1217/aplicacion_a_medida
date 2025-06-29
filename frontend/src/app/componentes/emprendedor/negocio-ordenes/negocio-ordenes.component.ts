import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor, NgClass, DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../servicios/api.service';

import maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-negocio-ordenes',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    DatePipe,
    FormsModule,
    CommonModule
  ],
  templateUrl: './negocio-ordenes.component.html',
  styleUrl: './negocio-ordenes.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NegocioOrdenesComponent implements OnInit {
  ordenes: any[] = [];
  ordenesFiltradas: any[] = [];
  negocioId!: number;
  estadoSeleccionado: string = '';
  textoBusqueda: string = '';
  fechaSeleccionada: string = '';
  pagoSeleccionado: string = '';
  ordenSeleccionada: any = null;
  seleccionadas: Set<number> = new Set();

  vistaDetalle: boolean = false;
  metodoPago: string = 'efectivo'; // puedes cambiar según selección

  mapaLibre: any = null; // para guardar la instancia del mapa

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.negocioId = Number(this.route.snapshot.paramMap.get('id'));
    this.apiService.obtenerOrdenesNegocio(this.negocioId).subscribe(
      data => {
        this.ordenes = data.map((o: any) => {
          if (o.estado) {
            o.estado = o.estado.charAt(0).toUpperCase() + o.estado.slice(1).toLowerCase();
          }
          return o;
        });
        this.ordenesFiltradas = [...this.ordenes];
        console.log('Órdenes normalizadas:', this.ordenes);
      },
      error => console.error('Error cargando órdenes', error)
    );
  }
  
  

  filtrarOrdenes(): void {
    console.log('Estado seleccionado:', this.estadoSeleccionado); // imprime el estado seleccionado
    console.log('Datos originales:', this.ordenes); // imprime los datos que llegan
  
    this.ordenesFiltradas = this.ordenes.filter(o => {
      const estado = o.estado?.toLowerCase();  // normalizamos a minúsculas
      const coincideEstado = this.estadoSeleccionado
        ? estado === this.estadoSeleccionado.toLowerCase()
        : true;
      const coincidePago = this.pagoSeleccionado
        ? o.pedido?.metodo_pago?.toLowerCase() === this.pagoSeleccionado.toLowerCase()
        : true;
      const coincideTexto = this.textoBusqueda
        ? JSON.stringify(o).toLowerCase().includes(this.textoBusqueda.toLowerCase())
        : true;
      const coincideFecha = this.fechaSeleccionada
        ? o.created_at?.startsWith(this.fechaSeleccionada)
        : true;
  
      return coincideEstado && coincidePago && coincideTexto && coincideFecha;
    });
  
    console.log('Ordenes filtradas:', this.ordenesFiltradas); // imprime el resultado
  }
  

  filtroEstado(estado: string): void {
    this.estadoSeleccionado = estado;
    this.filtrarOrdenes();
  }

  contarEnCamino(): number {
    return this.ordenes.filter(o => o.estado === 'En camino').length;
  }





  toggleSeleccion(orden: any): void {
    if (this.seleccionadas.has(orden.pedido_id)) {
      this.seleccionadas.delete(orden.pedido_id);
    } else {
      this.seleccionadas.add(orden.pedido_id);
    }
  }


  ///VER DETALLE

  verDetalle(orden: any): void {
    this.ordenSeleccionada = orden;
    this.vistaDetalle = true;
  
    setTimeout(() => {
      this.inicializarMapaDetalle();
    }, 100); // espera a que el DOM renderice
  }
  
  
  regresarLista(): void {
    this.vistaDetalle = false;
  }

  ///MAPA

  inicializarMapaDetalle(): void {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || !this.ordenSeleccionada) return;
  
    const direccionCliente = this.ordenSeleccionada.pedido?.direccion;
    const direccionNegocio = this.ordenSeleccionada.negocio?.direcciones?.[0];
  
    if (!direccionCliente || !direccionNegocio) return;
  
    // Si ya existe un mapa, quitarlo
    if (this.mapaLibre) {
      this.mapaLibre.remove();
    }
  
    this.mapaLibre = new maplibregl.Map({
      container: mapContainer,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [
        parseFloat(direccionCliente.longitud),
        parseFloat(direccionCliente.latitud)
      ],
      zoom: 13
    });
  
    // 📍 Marcador del cliente
    const elCliente = document.createElement('div');
    elCliente.style.backgroundImage = 'url("https://cdn-icons-png.flaticon.com/512/6735/6735939.png")';
    elCliente.style.width = '40px';
    elCliente.style.height = '40px';
    elCliente.style.backgroundSize = 'cover';
    elCliente.style.backgroundRepeat = 'no-repeat';
    elCliente.style.borderRadius = '50%';
  
    new maplibregl.Marker({ element: elCliente })
      .setLngLat([
        parseFloat(direccionCliente.longitud),
        parseFloat(direccionCliente.latitud)
      ])
      .addTo(this.mapaLibre);
  
    // 🏠 Marcador del negocio
    const elNegocio = document.createElement('div');
    elNegocio.style.backgroundImage = 'url("https://cdn-icons-png.flaticon.com/512/420/420199.png")';
    elNegocio.style.width = '40px';
    elNegocio.style.height = '40px';
    elNegocio.style.backgroundSize = 'cover';
    elNegocio.style.backgroundRepeat = 'no-repeat';
    elNegocio.style.borderRadius = '50%';
  
    new maplibregl.Marker({ element: elNegocio })
      .setLngLat([
        parseFloat(direccionNegocio.longitud),
        parseFloat(direccionNegocio.latitud)
      ])
      .addTo(this.mapaLibre);
  
    this.mapaLibre.on('load', () => {
      this.mapaLibre.resize();
    });
  }

  ///PAGOS

  getSubtotal(): number {
    if (!this.ordenSeleccionada?.productos) return 0;
    return this.ordenSeleccionada.productos.reduce((acc: number, producto: any) => {
      return acc + (producto.precio_unitario * producto.cantidad);
    }, 0);
  }
  
  getTotal(): number {
    const subtotal = this.getSubtotal();
  
    if (this.metodoPago === 'efectivo') {
      return subtotal;
    } else if (this.metodoPago === 'tarjeta') {
      // Ejemplo comisión stripe: 3.6% + $3
      const comisionFija = 3;
      const porcentajeComision = 0.036;
      // Total con comisión aplicada
      // Para saber cuánto cobrar para recibir el subtotal, se calcula así:
      // total = (subtotal + comisionFija) / (1 - porcentajeComision)
      return (subtotal + comisionFija) / (1 - porcentajeComision);
    }
    return subtotal; // fallback
  }
  


}
