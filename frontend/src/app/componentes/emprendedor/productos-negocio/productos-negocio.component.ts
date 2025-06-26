import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from '@angular/core';
import { ApiService } from '../../../servicios/api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos-negocio',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './productos-negocio.component.html',
  styleUrls: ['./productos-negocio.component.css']
})
// ... tus imports existentes
export class ProductosNegocioComponent implements OnInit {
  negocioId!: string;
  productos: any[] = [];
  filtroPublicado: string = 'todos';
  busqueda: string = '';
  cargando: boolean = false;
  menuIndex: number = -1;
  imagenGrandeUrl: string | null = null;
  menuTop: number = 0;
  menuLeft: number = 0;

  //Agregar y Editar
  fotoProductoFile: File | null = null;
  productoSeleccionado: any = {}; // O usa un modelo si tienes uno definido

  @ViewChild('menuDropdown') menuDropdown!: ElementRef;
  @ViewChild('menuButton') menuButton!: ElementRef;

  // 🔽 Paginación
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.negocioId = this.route.snapshot.paramMap.get('id') || '';
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.apiService.getProductosNegocio(this.negocioId).subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
        this.cargando = false;
      }
    });
  }

  aplicarFiltroPublicado(valor: string): void {
    this.filtroPublicado = valor;
    this.currentPage = 1;
    this.menuIndex = -1;
  }

  toggleMenu(index: number, event: MouseEvent): void {
    if (this.menuIndex === index) {
      this.menuIndex = -1;
      return;
    }
  
    this.menuIndex = index;
  
    const target = event.target as HTMLElement;
    const button = target.closest('.menu-button-custom') as HTMLElement;
  
    if (button) {
      const rect = button.getBoundingClientRect();
      this.menuTop = rect.bottom + window.scrollY;
      this.menuLeft = rect.left + window.scrollX - 150; // Ajusta para que el menú quede a la izquierda del botón
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const clickedInsideMenu = targetElement.closest('.dropdown-menu-custom');
    const clickedButton = targetElement.closest('.menu-button-custom');
    if (!clickedInsideMenu && !clickedButton) {
      this.menuIndex = -1;
    }
  }

  // 🔽 Datos filtrados
  get productosFiltrados(): any[] {
    return this.productos.filter(p =>
      (this.filtroPublicado === 'todos' || p.publicado === this.filtroPublicado) &&
      (p.nombre?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
       p.descripcion?.toLowerCase().includes(this.busqueda.toLowerCase()))
    );
  }

  // 🔽 Productos a mostrar por página
  get productosPaginados(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.productosFiltrados.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.productosFiltrados.length / this.pageSize);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
    }
  }

  get totalProductos(): number {
    return this.productos.length;
  }

  get publicados(): number {
    return this.productos.filter(p => p.publicado === 'si').length;
  }

  get borradores(): number {
    return this.productos.filter(p => p.publicado === 'no').length;
  }

    // Al hacer hover o click, abre la imagen grande
    abrirImagenGrande(url: string) {
      this.imagenGrandeUrl = url;
    }
  
    // Cierra la imagen grande
    cerrarImagenGrande() {
      this.imagenGrandeUrl = null;
    }


    ////Editar y Agregar

    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.fotoProductoFile = input.files[0];
        console.log('📦 Foto seleccionada:', this.fotoProductoFile.name);
      }
      input.value = '';
    }
    
    guardarProducto(): void {
      if (!this.productoSeleccionado) return;
    
      const formData = new FormData();
      formData.append('nombre', this.productoSeleccionado.nombre);
      formData.append('descripcion', this.productoSeleccionado.descripcion || '');
      formData.append('precio', this.productoSeleccionado.precio);
      formData.append('stock', this.productoSeleccionado.stock);
      formData.append('negocio_id', this.negocioId);
    
      if (this.fotoProductoFile) {
        formData.append('foto', this.fotoProductoFile, this.fotoProductoFile.name);
      }
    
      const observable = this.productoSeleccionado.id
        ? this.apiService.actualizarProducto(this.productoSeleccionado.id, formData)
        : this.apiService.crearProducto(formData);
    
      observable.subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Producto guardado',
            text: 'El producto fue procesado correctamente.'
          }).then(() => {
            this.cargarProductos();
            this.productoSeleccionado = {};
            this.fotoProductoFile = null;
            const modal = document.getElementById('editarProductoModal');
            if (modal) {
              const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
              bootstrapModal.hide();
            }
          });
        },
        error: (err) => {
          console.error('❌ Error al guardar producto:', err);
          Swal.fire('Error', 'No se pudo guardar el producto', 'error');
        }
      });
    }

    abrirModalProducto(producto?: any): void {
      this.productoSeleccionado = producto ? { ...producto } : {
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        foto: ''
      };
      this.fotoProductoFile = null;
    }

    getObjectURL(file: File): string {
      return URL.createObjectURL(file);
    }


    ////Publicar

    confirmarPublicacion(producto: any): void {
      Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas publicar el producto "${producto.nombre}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, publicar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          this.apiService.publicarProducto(producto.id).subscribe({
            next: () => {
              Swal.fire('Publicado', 'El producto fue publicado correctamente.', 'success');
              this.menuIndex = -1; // <- cerrar el menú
              this.cargarProductos();
            },
            error: (err) => {
              console.error('Error al publicar producto:', err);
              Swal.fire('Error', 'No se pudo publicar el producto.', 'error');
            }
          });
        }
      });
    }

    ////DESPUBLICAR

    confirmarDespublicacion(producto: any) {
      Swal.fire({
        title: '¿Despublicar producto?',
        text: 'Este producto ya no será visible públicamente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, despublicar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.apiService.actualizarEstadoPublicacion(producto.id, 'no').subscribe({
            next: () => {
              producto.publicado = 'no'; // Actualizar directamente en la vista
              this.menuIndex = -1;
              Swal.fire('Despublicado', 'El producto ha sido despublicado.', 'success');
            },
            error: () => {
              Swal.fire('Error', 'No se pudo despublicar el producto.', 'error');
            }
          });
        }
      });
    }

    ////ELIMINAR PRODUCTO

    confirmarEliminacion(producto: any) {
      Swal.fire({
        title: '¿Eliminar producto?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.apiService.eliminarProducto(producto.id).subscribe({
            next: () => {
              // Eliminarlo localmente sin recargar todo
              this.productos = this.productos.filter(p => p.id !== producto.id);
              this.menuIndex = -1;
              Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
            },
            error: () => {
              Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
            }
          });
        }
      });
    }

    

    
    
    
    
    
    
    
}

