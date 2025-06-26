import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../servicios/api.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { jwtDecode } from 'jwt-decode'; // asegúrate que esté importado
import maplibregl from 'maplibre-gl';
import { HttpClient } from '@angular/common/http'; // Asegúrate de tener esto al inicio

@Component({
  selector: 'app-negocio',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, DragDropModule, RouterModule],
  templateUrl: './negocio.component.html',
  styleUrls: ['./negocio.component.css']
})
export class NegocioComponent implements OnInit {

  negocioId!: number;
  negocio: any;
  mi_negocio: boolean = false;
  logoFile: File | null = null;

  negocioSeleccionado: any = null;
  nuevoNegocio: any = {};
  logoTemporal: string = '';

  diasSemana = [
    { index: 0, nombre: 'Domingo' },
    { index: 1, nombre: 'Lunes' },
    { index: 2, nombre: 'Martes' },
    { index: 3, nombre: 'Miércoles' },
    { index: 4, nombre: 'Jueves' },
    { index: 5, nombre: 'Viernes' },
    { index: 6, nombre: 'Sábado' }
  ];

  nuevoContacto: any = {
    correos: [],
    telefonos: [],
    redes_sociales: []
  };

  publicacion: any = {};
  previewImagenes: string[] = [];
  imagenes: File[] = [];
  pdf: File | null = null;

  imagenesAEliminar: string[] = []; // URLs de imágenes existentes a eliminar

  
  // Arreglo por día (index 0–6) con sus rangos de horario
  horariosEdit: { [key: number]: any[] } = {};
  estadoCerrado: { [key: number]: boolean } = {};


  form = {
    negocio_id: 0,    // debe asignarse antes de abrir modal
    historia_id: null as number | null,
    titulo: '',
    imagen: null as File | null,
  };
  previewImagen: string | null = null;
  historias: any[] = [];

  publicacionSeleccionada: any = null;
  publicacionesDestacadas: any[] = [];
  cargando = false;
  modalDestacadas: any;

  productos: any[] = [];
  userId: number = 0;


  //Direcciones

  direccion = {
    pais: '',
    estado: '',
    ciudad: '',
    colonia: '',
    calle: '',
    numero: '',
    cp: '',
    titulo: '',        
    referencia: ''    
  };

  direcciones: any[] = [];
  direccionSeleccionada: any = this.getDireccionVacia();
  modo: 'editar' | 'nuevo' = 'nuevo';

    latitud: number = 21.81233;
    longitud: number = -105.20639;
    
  
    mapaLibre!: maplibregl.Map;
    marcadorLibre!: maplibregl.Marker;


  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private http: HttpClient
  ) {}


  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.userId = decoded.sub;
      } catch (e) {
        console.error('Error al decodificar token', e);
      }
    }

    
  
    this.route.params.subscribe(params => {
      this.negocioId = +params['id'];
      this.cargarNegocio();
      this.cargarProductos(this.negocioId.toString());
    });
  }
  

  cargarNegocio(): void {
    const token = sessionStorage.getItem('token');
    let userIdFromToken: number | null = null;
  
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        userIdFromToken = Number(decoded.sub || decoded.user_id || null);
      } catch (error) {
        console.error('Error al decodificar token JWT:', error);
      }
    }
  
    this.apiService.obtenerDetalleNegocio(this.negocioId).subscribe({
      next: (data) => {
        this.negocio = data;
        this.negocioSeleccionado = this.negocio; // ← Corregido
  
        this.mi_negocio = userIdFromToken !== null && this.negocio.user_id === userIdFromToken;
  
        this.publicacionesDestacadas = this.negocio.publicaciones
          .filter((p: any) => p.destacado === 1)
          .sort((a: any, b: any) => (a.orden ?? 999) - (b.orden ?? 999));
  
        // Si hay direcciones, usar la primera
        if (this.negocio.direcciones && this.negocio.direcciones.length > 0) {
          this.direccionSeleccionada = this.negocio.direcciones[0];
  
          // Asegurar que lat/lng sean números válidos
          this.latitud = parseFloat(this.direccionSeleccionada.latitud);
          this.longitud = parseFloat(this.direccionSeleccionada.longitud);
  
          this.modo = 'editar';
        } else {
          this.direccionSeleccionada = this.getDireccionVacia();
          this.latitud = 0;
          this.longitud = 0;
          this.modo = 'nuevo';
        }
      },
      error: (err) => {
        console.error('Error al obtener datos del negocio', err);
      }
    });
  }
  
  
  

  abrirModalEditar(id: number): void {
    this.apiService.obtenerDetalleNegocio(id).subscribe({
      next: (respuesta) => {
        this.negocioSeleccionado = respuesta;
        this.nuevoNegocio = { ...respuesta };
        this.logoTemporal = this.nuevoNegocio.logo_url || '';
        const modal = document.getElementById('negocioModal');
        if (modal) {
          const bootstrapModal = new (window as any).bootstrap.Modal(modal);
          bootstrapModal.show();
        }
      },
      error: (err) => {
        console.error('Error al obtener el negocio', err);
      }
    });
  }

  guardarNegocio(): void {
    if (!this.negocioSeleccionado) return;
  
    const formData = new FormData();
    formData.append('nombre', this.nuevoNegocio.nombre);
    formData.append('descripcion', this.nuevoNegocio.descripcion);
    formData.append('direccion', this.nuevoNegocio.direccion);
    formData.append('servicio_domicilio', this.nuevoNegocio.servicio_domicilio ? '1' : '0');
  
    if (this.logoFile) {
      formData.append('logo', this.logoFile, this.logoFile.name);
    }
  
    // 🔍 Log para ver qué se está enviando a Laravel
    console.log('📦 Datos enviados a Laravel:');
    for (const pair of (formData as any).entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
  
    this.apiService.actualizarNegocioDetalle(this.negocioSeleccionado.id, formData).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'Negocio actualizado correctamente', 'success');
        this.cargarNegocio();
        this.limpiarFormulario();
        const modal = document.getElementById('negocioModal');
        if (modal) {
          const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
          bootstrapModal.hide();
        }
      },
      error: (err) => {
        console.error('Error al actualizar negocio:', err);
        Swal.fire('Error', 'No se pudo actualizar el negocio', 'error');
      }
    });
  }
  
  
  

  limpiarFormulario(): void {
    this.negocioSeleccionado = null;
    this.nuevoNegocio = {};
    this.logoTemporal = '';
  }

  actualizarLogo(url: string): void {
    this.nuevoNegocio.logo_url = url;
    this.logoTemporal = url;
  }

  getHorariosDia(index: number): any[] {
    return this.negocio?.horarios
      ?.filter((h: { dia_semana: number; cerrado: boolean }) => h.dia_semana === index && !h.cerrado)
      .sort((a: { hora_apertura: string }, b: { hora_apertura: string }) =>
        a.hora_apertura.localeCompare(b.hora_apertura)
      ) || [];
  }

  getRedSocialUrl(red: any): string {
    const tipo = red.tipo.toLowerCase();
    const url = red.url;

    switch (tipo) {
      case 'facebook':
      case 'instagram':
      case 'tiktok':
        return url.startsWith('http') ? url : `https://${url}`;
      case 'whatsapp':
        const numero = url.replace(/\D/g, '');
        return `https://wa.me/${numero}`;
      default:
        return '#';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.logoFile = input.files[0];
      console.log('Archivo seleccionado para logo:', this.logoFile.name);
    }
    input.value = '';
  }





  ///DATOS DE CONTACTO /////

  abrirModalContacto(): void {
    // Clonar la información actual para editar sin afectar directamente
    this.nuevoContacto = {
      correos: [...this.negocio.correos],
      telefonos: [...this.negocio.telefonos],
      redes_sociales: [...this.negocio.redes_sociales],
    };
  
    const modal = document.getElementById('modalContacto');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }
  
  agregarCorreo(): void {
    this.nuevoContacto.correos.push({ correo: '' });
  }
  
  eliminarCorreo(index: number): void {
    this.nuevoContacto.correos.splice(index, 1);
  }
  
  agregarTelefono(): void {
    this.nuevoContacto.telefonos.push({ telefono: '' });
  }
  
  eliminarTelefono(index: number): void {
    this.nuevoContacto.telefonos.splice(index, 1);
  }
  
  agregarRed(): void {
    this.nuevoContacto.redes_sociales.push({ tipo: 'Facebook', url: '' });
  }
  
  eliminarRed(index: number): void {
    this.nuevoContacto.redes_sociales.splice(index, 1);
  }


  
  
  guardarContacto(): void {
    const payload = {
      correos: this.nuevoContacto.correos,
      telefonos: this.nuevoContacto.telefonos,
      redes_sociales: this.nuevoContacto.redes_sociales
    };
  
    this.apiService.actualizarContactoNegocio(this.negocio.id, payload).subscribe({
      next: () => {
        Swal.fire('¡Actualizado!', 'Información de contacto actualizada correctamente', 'success');
        this.cargarNegocio();
        const modal = document.getElementById('modalContacto');
        if (modal) {
          const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
          bootstrapModal.hide();
        }
      },
      error: (err) => {
        console.error('Error al actualizar contacto', err);
        Swal.fire('Error', 'No se pudo actualizar el contacto', 'error');
      }
    });
  }

    ///DATOS DE HORARIO

    abrirModalHorarios(): void {
      if (!this.negocio || !this.negocio.horarios) return;
    
      this.horariosEdit = {};
      this.estadoCerrado = {};
    
      for (let dia of this.diasSemana) {
        const horariosDelDia = this.negocio.horarios.filter((h: any) => h.dia_semana === dia.index);
        
        if (horariosDelDia.length > 0) {
          this.horariosEdit[dia.index] = horariosDelDia.map((h: any) => ({
            hora_apertura: h.hora_apertura || '09:00',
            hora_cierre: h.hora_cierre || '18:00'
          }));
          this.estadoCerrado[dia.index] = horariosDelDia.every((h: any) => h.cerrado);
        } else {
          this.horariosEdit[dia.index] = [{
            hora_apertura: '09:00',
            hora_cierre: '18:00'
          }];
          this.estadoCerrado[dia.index] = false;
        }
      }
    
      const modal = document.getElementById('modalHorarios');
      if (modal) {
        const bootstrapModal = new (window as any).bootstrap.Modal(modal);
        bootstrapModal.show();
      }
    }
    
  
// Cargar datos cuando abras el modal
cargarHorariosDesdeBackend(horariosBackend: any[]) {
  // Limpiar
  this.horariosEdit = {};
  this.estadoCerrado = {};

  for (let dia of this.diasSemana) {
    const horariosDelDia = horariosBackend.filter(h => h.dia_semana === dia.index);
    this.horariosEdit[dia.index] = horariosDelDia.map(h => ({
      id: h.id,
      hora_apertura: h.hora_apertura,
      hora_cierre: h.hora_cierre
    }));

    // Si todos los horarios del día están marcados como cerrados, marcar el checkbox
    const cerrados = horariosDelDia.every(h => h.cerrado);
    this.estadoCerrado[dia.index] = cerrados;

    // Si no hay horarios para ese día, inicializar como vacío
    if (!this.horariosEdit[dia.index]) {
      this.horariosEdit[dia.index] = [];
    }
  }
}

agregarHorario(diaIndex: number) {
  if (!this.horariosEdit[diaIndex]) {
    this.horariosEdit[diaIndex] = [];
  }
  this.horariosEdit[diaIndex].push({
    hora_apertura: '',
    hora_cierre: ''
  });
}

eliminarHorario(diaIndex: number, index: number) {
  this.horariosEdit[diaIndex].splice(index, 1);
}

guardarHorarios() {
  const horariosParaGuardar = [];

  for (let dia of this.diasSemana) {
    const cerrado = this.estadoCerrado[dia.index];

    if (cerrado) {
      // Mandar un solo registro marcado como cerrado
      horariosParaGuardar.push({
        dia_semana: dia.index,
        cerrado: true,
        hora_apertura: null,
        hora_cierre: null
      });
    } else {
      for (let horario of this.horariosEdit[dia.index]) {
        if (horario.hora_apertura && horario.hora_cierre) {
          horariosParaGuardar.push({
            dia_semana: dia.index,
            cerrado: false,
            hora_apertura: horario.hora_apertura,
            hora_cierre: horario.hora_cierre
          });
        }
      }
    }
  }

  this.apiService.actualizarHorarios(this.negocioId, horariosParaGuardar).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: '¡Horarios actualizados!',
        text: 'Los horarios se guardaron correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
      this.cargarNegocio();

      // Cerrar modal si quieres
      const modal = document.getElementById('modalHorarios');
      if (modal) {
        const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
        bootstrapModal.hide();
      }
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron guardar los horarios. Intenta de nuevo.',
      });
      console.error('Error al guardar horarios:', error);
    }
  });
  
}





///Publicacion editar y agregar: 

abrirModal(pub: any = null) {
  if (pub) {
    this.publicacion = { ...pub };
    this.previewImagenes = pub.imagenes?.map((img: any) => img.imagen) || [];
  } else {
    this.publicacion = { descripcion: '', negocio_id: this.negocio.id };
    this.previewImagenes = [];
  }

  this.imagenes = [];
  this.imagenesAEliminar = [];
  this.pdf = null;

  const modal = document.getElementById('modalPublicacion');
  if (modal) {
    const bootstrapModal = (window as any).bootstrap.Modal.getOrCreateInstance(modal);
    bootstrapModal.show();
  }
}

onImagenesChange(event: any) {
  const archivos = Array.from(event.target.files) as File[];
  archivos.forEach(file => {
    this.imagenes.push(file);
    this.previewImagenes.push(URL.createObjectURL(file));
  });
}

onPdfChange(event: any) {
  this.pdf = event.target.files[0];
}

eliminarImagen(index: number) {
  const url = this.previewImagenes[index];

  // Si la imagen no es un blob, entonces es una existente en el backend
  if (!url.startsWith('blob:')) {
    this.imagenesAEliminar.push(url);
  } else {
    // Si es blob, elimina el archivo asociado
    const fileIndex = this.imagenes.findIndex((file, i) => URL.createObjectURL(file) === url);
    if (fileIndex !== -1) this.imagenes.splice(fileIndex, 1);
  }

  this.previewImagenes.splice(index, 1);
}

guardarPublicacion() {
  const formData = new FormData();
  formData.append('negocio_id', this.publicacion.negocio_id);
  formData.append('descripcion', this.publicacion.descripcion || '');

  if (this.publicacion.id) {
    formData.append('id', this.publicacion.id);
  }

  if (this.pdf) formData.append('pdf', this.pdf);

  this.imagenes.forEach((img) => formData.append('imagenes[]', img));

  if (this.imagenesAEliminar && this.imagenesAEliminar.length > 0) {
    this.imagenesAEliminar.forEach(url => formData.append('imagenes_a_eliminar[]', url));
  }

  this.apiService.postConToken('/publicaciones', formData).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: '¡Publicación guardada!',
        showConfirmButton: false,
        timer: 1500
      });
  
      // Recargar publicaciones sin refrescar la página
      this.cargarNegocio();
  
      // Cerrar el modal
      const modal = document.getElementById('modalPublicacion');
      if (modal) {
        const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
        bootstrapModal.hide();
      }
    },
    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error al guardar la publicación. Intenta de nuevo.'
      });
    }
  });
  
}

confirmarEliminarPublicacion(publicacion: any): void {
  Swal.fire({
    title: '¿Eliminar publicación?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.apiService.eliminarPublicacion(publicacion.id).subscribe({
        next: () => {
          Swal.fire('Eliminada', 'La publicación fue eliminada correctamente.', 'success');
          this.cargarNegocio(); // refresca la lista de publicaciones
        },
        error: (err) => {
          console.error('Error al eliminar publicación', err);
          Swal.fire('Error', 'No se pudo eliminar la publicación.', 'error');
        }
      });
    }
  });
}

abrirModalPublicacion(pub: any): void {
  this.publicacionSeleccionada = pub;
}


confirmarToggleDestacado(pub: any) {
  const accion = pub.destacado ? 'quitar de destacados' : 'destacar';

  Swal.fire({
    title: `¿Estás seguro?`,
    text: `Vas a ${accion} esta publicación`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      this.apiService.toggleDestacadoPublicacion(pub.id).subscribe({
        next: (resp: any) => {
          Swal.fire('Hecho', 'La publicación ha sido actualizada', 'success');
          pub.destacado = resp.publicacion.destacado;
          pub.orden = resp.publicacion.orden;

          // Aquí recargas la lista completa
          this.cargarNegocio();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar la publicación', 'error');
        }
      });
    }
  });
}


/////PUBLICACIONES DESTACADAS//////


abrirModalDestacadas() {
  if (!this.negocio || !this.negocio.publicaciones) {
    Swal.fire('Información', 'No hay publicaciones para ordenar.', 'info');
    return;
  }

  // Filtrar y ordenar publicaciones destacadas
  this.publicacionesDestacadas = this.negocio.publicaciones
    .filter((p: any) => p.destacado === 1)
    .sort((a: any, b: any) => (a.orden ?? 999) - (b.orden ?? 999));

  if (this.publicacionesDestacadas.length === 0) {
    Swal.fire('Información', 'No hay publicaciones destacadas para ordenar.', 'info');
    return;
  }

  const modal = document.getElementById('modalDestacadas');
  if (modal) {
    const bootstrapModal = (window as any).bootstrap.Modal.getOrCreateInstance(modal);
    bootstrapModal.show();
  }
}




dropDestacadas(event: CdkDragDrop<any[]>) {
  moveItemInArray(this.publicacionesDestacadas, event.previousIndex, event.currentIndex);
}

guardarOrdenDestacadas() {
  const orden = this.publicacionesDestacadas.map((pub, index) => ({
    id: pub.id,
    orden: index + 1
  }));

  this.apiService.actualizarOrdenDestacadas(orden).subscribe({
    next: () => {
      Swal.fire('Guardado', 'El orden se ha actualizado correctamente', 'success');
      this.cargarNegocio(); // refresca la lista de publicaciones
      const modal = document.getElementById('modalDestacadas');
      if (modal) {
        const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
        bootstrapModal.hide();
      }
    },
    error: () => {
      Swal.fire('Error', 'No se pudo guardar el nuevo orden', 'error');
    }
  });
}



    ////CARGAR NEGOCIO
    cargarProductos(negocioId: string): void {
      this.cargando = true;
      this.apiService.getProductosNegocio(negocioId, 'si').subscribe({
        next: (respuesta) => {
          // Si la respuesta es un array, se le agrega la propiedad `cantidad`
          if (Array.isArray(respuesta)) {
            this.productos = respuesta.map((producto: any) => ({
              ...producto,
              cantidad: 1 // Valor inicial por defecto
            }));
          } else {
            this.productos = [];
            console.warn('La respuesta no es un arreglo de productos:', respuesta);
          }
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al obtener productos del negocio:', error);
          this.cargando = false;
        }
      });
    } 
    

    ////AGREGAR PRODUCTO AL CARRITO

    validarCantidad(producto: any): void {
      let cantidad = Number(producto.cantidad);
    
      // Si no es número o es menor a 1
      if (isNaN(cantidad) || cantidad < 1) {
        producto.cantidad = 1;
      } else if (cantidad > producto.stock) {
        producto.cantidad = producto.stock;
      } else {
        producto.cantidad = Math.floor(cantidad); // Solo valores enteros válidos
      }
    }
    
    
    
    incrementarCantidad(producto: any): void {
      if (producto.cantidad < producto.stock) {
        producto.cantidad++;
      }
    }
    
    decrementarCantidad(producto: any): void {
      if (producto.cantidad > 1) {
        producto.cantidad--;
      }
    }
    
    
    
    agregarAlCarrito(producto: any): void {
      const cantidad = producto.cantidad || 1;
    
      if (cantidad > producto.stock) {
        return; // No hacer nada si excede el stock
      }
    
      const data = {
        user_id: this.userId,
        producto_id: producto.id,
        cantidad: cantidad
      };
    
      this.apiService.agregarProductoAlCarrito(data).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Agregado!',
            text: 'Producto agregado al carrito correctamente.',
            showConfirmButton: false,
            timer: 1500, // Se cierra solo después de 1.5 segundos
            timerProgressBar: true
          });
        },
        error: (err) => {
          console.error('Error al agregar al carrito', err);
        }
      });
    }



    ////AGREGAR DIRECCION


    getDireccionCompleta(): string {
      const partes = [
        this.direccionSeleccionada.calle + (this.direccionSeleccionada.numero ? ` ${this.direccionSeleccionada.numero}` : ''),
        this.direccionSeleccionada.colonia,
        this.direccionSeleccionada.cp,
        this.direccionSeleccionada.ciudad,
        this.direccionSeleccionada.estado,
        this.direccionSeleccionada.pais,
      ].filter(p => p && p.trim() !== '');
      return partes.join(', ');
    }
    
    activarTabDireccion(): void {
      setTimeout(() => {
        if (!this.mapaLibre) {
          this.inicializarMapa();
        } else {
          const nuevaPos: [number, number] = [this.longitud, this.latitud];
          this.marcadorLibre.setLngLat(nuevaPos);
          this.mapaLibre.setCenter(nuevaPos);
          this.mapaLibre.resize();
        }
      }, 600);
    }
    
    getDireccionVacia() {
      return {
        id: null,
        pais: '',
        estado: '',
        ciudad: '',
        colonia: '',
        calle: '',
        numero: '',
        cp: '',
        titulo: '',
        referencia: '',
        latitud: this.latitud,
        longitud: this.longitud
      };
    }
    
    inicializarMapa(): void {
      const mapContainer = document.getElementById('map');
      if (!mapContainer) return;
    
      this.mapaLibre = new maplibregl.Map({
        container: mapContainer,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [this.longitud, this.latitud],
        zoom: 14
      });
    
      const el = document.createElement('div');
      el.style.backgroundImage = 'url("https://cdn-icons-png.flaticon.com/512/6735/6735939.png")';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.backgroundSize = 'cover';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.borderRadius = '50%';
    
      this.marcadorLibre = new maplibregl.Marker({ element: el, draggable: true })
        .setLngLat([this.longitud, this.latitud])
        .addTo(this.mapaLibre);
    
      this.marcadorLibre.on('dragend', () => {
        const lngLat = this.marcadorLibre.getLngLat();
        this.longitud = lngLat.lng;
        this.latitud = lngLat.lat;
      });
    
      this.mapaLibre.on('load', () => {
        this.mapaLibre.resize();
      });
    }
    
    guardarDireccion(): void {
      console.log('Ejecutando guardarDireccion...');
    
      if (!this.negocioSeleccionado || !this.negocioSeleccionado.id) {
        console.warn('No hay negocioSeleccionado.id');
        Swal.fire('Error', 'No se ha cargado el negocio correctamente.', 'error');
        return;
      }
    
      if (!this.direccionSeleccionada) {
        console.warn('direccionSeleccionada está null o indefinida');
        Swal.fire('Error', 'No hay información de dirección para guardar.', 'error');
        return;
      }
    
      const payload = {
        titulo: this.direccionSeleccionada.titulo,
        referencia: this.direccionSeleccionada.referencia,
        latitud: this.latitud,
        longitud: this.longitud,
        tipo: 'negocio'
      };
    
      if (!this.direccionSeleccionada.id) {
        console.log('Creando nueva dirección...', payload);
        this.apiService.crearDireccionNegocio(this.negocioSeleccionado.id, payload).subscribe({
          next: () => {
            Swal.fire('Listo', 'Dirección creada correctamente.', 'success');
            this.cargarNegocio();
            this.modo = 'editar';
          },
          error: (err) => {
            console.error('Error al crear dirección:', err);
            Swal.fire('Error', 'No se pudo crear la dirección.', 'error');
          },
        });
      } else {
        console.log('Actualizando dirección existente...', payload);
        this.apiService.actualizarDireccionNegocio(
          this.negocioSeleccionado.id,
          this.direccionSeleccionada.id,
          payload
        ).subscribe({
          next: () => {
            Swal.fire('Listo', 'Dirección actualizada correctamente.', 'success');
            this.cargarNegocio();
          },
          error: (err) => {
            console.error('Error al actualizar dirección:', err);
            Swal.fire('Error', 'No se pudo actualizar la dirección.', 'error');
          },
        });
      }
    }
    
    
    
    
    buscarDireccion(event?: Event): void {
      if (event) event.preventDefault();
    
      const direccionParaBuscar = this.getDireccionCompleta().trim();
    
      if (!direccionParaBuscar) {
        Swal.fire('Atención', 'Por favor ingresa una dirección para buscar.', 'warning');
        return;
      }
    
      const encoded = encodeURIComponent(direccionParaBuscar);
      const url = `http://localhost:8000/api/geocodificar?q=${encoded}`;
    
      const token = sessionStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
    
      this.http.get<any[]>(url, { headers }).subscribe({
        next: (respuesta) => {
          if (respuesta.length > 0) {
            const lugar = respuesta[0];
            this.latitud = parseFloat(lugar.lat);
            this.longitud = parseFloat(lugar.lon);
    
            const nuevaPos: [number, number] = [this.longitud, this.latitud];
            if (this.marcadorLibre) this.marcadorLibre.setLngLat(nuevaPos);
            if (this.mapaLibre) this.mapaLibre.setCenter(nuevaPos);
          } else {
            Swal.fire('No encontrado', 'No se encontraron resultados para la dirección ingresada.', 'info');
          }
        },
        error: (error) => {
          console.error('Error al buscar dirección:', error);
          Swal.fire('Error', 'No se pudo realizar la búsqueda.', 'error');
        }
      });
    }
    

    
  
}
