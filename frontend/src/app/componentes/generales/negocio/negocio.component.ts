import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../servicios/api.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-negocio',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, DragDropModule],
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

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.negocioId = +params['id'];
      this.cargarNegocio();
    });
  }

  cargarNegocio(): void {
    this.apiService.obtenerDetalleNegocio(this.negocioId).subscribe({
      next: (data) => {
        this.negocio = data;
        const userIdSession = Number(sessionStorage.getItem('user_id'));
        this.mi_negocio = (this.negocio.user_id === userIdSession);
  
        // Extraer publicaciones destacadas ordenadas
        this.publicacionesDestacadas = this.negocio.publicaciones
          .filter((p: any) => p.destacado === 1)
          .sort((a: any, b: any) => (a.orden ?? 999) - (b.orden ?? 999));
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
  
}
