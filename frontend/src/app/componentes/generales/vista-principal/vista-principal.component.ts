import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../servicios/api.service';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode'; // ✅ Importación correcta

@Component({
  selector: 'app-vista-principal',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './vista-principal.component.html',
  styleUrls: ['./vista-principal.component.css']
})
export class VistaPrincipalComponent implements OnInit {
  publicaciones: any[] = [];
  page = 1;
  loading = false;
  lastPage = false;

  modalAbierto = false;
  imagenesModal: string[] = [];
  imagenActual = 0;

  modalReporteAbierto = false;
  comentarioReporte = '';
  publicacionIdReporte: number = 0;

  mostrarModalUsuario = false;
  nuevaPublicacion = {
    descripcion: '',
    pdf: null as File | null
  };

  pdfSeleccionado: File | null = null;
  imagenesSeleccionadas: File[] = [];
  imagenesPreview: string[] = [];
  formPublicacion: FormGroup;

  publicacionesFiltradas: any[] = [];

  tipoBusqueda: 'publicacion' | 'negocio' | 'usuario' = 'publicacion';
  textoBusqueda: string = '';

  datos: any[] = [];
  datosFiltrados: any[] = [];

  userId: number | null = null; // ✅ Guardamos el ID extraído del token

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.formPublicacion = this.fb.group({
      descripcion: [''],
    });
  }

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.sub || decoded.user_id || null;
    }

    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    if (this.tipoBusqueda === 'publicacion') {
      this.apiService.getPublicaciones(this.page, 1000).subscribe(res => {
        this.datos.push(...res.data);
        this.datosFiltrados = [...this.datos];
        this.lastPage = !res.next_page_url;
        this.loading = false;
      });
    } else if (this.tipoBusqueda === 'negocio') {
      this.apiService.getNegocios(this.page, 1000).subscribe(res => {
        this.datos.push(...res.data);
        this.datosFiltrados = [...this.datos];
        this.lastPage = !res.next_page_url;
        this.loading = false;
      });
    } else if (this.tipoBusqueda === 'usuario') {
      this.apiService.getUsuarios(this.page, 1000).subscribe(res => {
        this.datos.push(...res.data);
        this.datosFiltrados = [...this.datos];
        this.lastPage = !res.next_page_url;
        this.loading = false;
      });
    }
  }

  filtrar(): void {
    const texto = this.textoBusqueda.toLowerCase();

    if (!texto) {
      this.datosFiltrados = [...this.datos];
      return;
    }

    this.datosFiltrados = this.datos.filter(item => {
      if (this.tipoBusqueda === 'publicacion') {
        return item.descripcion?.toLowerCase().includes(texto);
      } else if (this.tipoBusqueda === 'negocio') {
        return item.nombre?.toLowerCase().includes(texto);
      } else if (this.tipoBusqueda === 'usuario') {
        return item.name?.toLowerCase().includes(texto);
      }
      return false;
    });
  }

  onTipoBusquedaChange() {
    this.page = 1;
    this.datos = [];
    this.datosFiltrados = [];
    this.cargarDatos();
  }

  abrirModal(imagenes: any[], index: number, event: Event): void {
    event.preventDefault();
    this.imagenesModal = imagenes.map(img => img.imagen);
    this.imagenActual = index;
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  anterior(): void {
    if (this.imagenActual > 0) this.imagenActual--;
  }

  siguiente(): void {
    if (this.imagenActual < this.imagenesModal.length - 1) this.imagenActual++;
  }

  abrirModalReporte(publicacionId: number): void {
    this.publicacionIdReporte = publicacionId;
    this.comentarioReporte = '';
    this.modalReporteAbierto = true;
  }

  cerrarModalReporte(): void {
    this.modalReporteAbierto = false;
  }

  enviarReporte(): void {
    if (!this.userId) {
      console.warn('No se pudo obtener el ID del usuario del token.');
      return;
    }

    if (!this.comentarioReporte.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Comentario requerido',
        text: 'Escribe un comentario para reportar esta publicación.'
      });
      return;
    }

    const payload = {
      user_id: this.userId,
      publicacion_id: this.publicacionIdReporte,
      comentario: this.comentarioReporte.trim()
    };

    this.apiService.reportarPublicacion(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Reporte enviado',
          text: 'Gracias por ayudarnos a mantener la comunidad segura.',
          timer: 2000,
          showConfirmButton: false
        });
        this.cerrarModalReporte();
      },
      error: err => {
        console.error('Error al reportar publicación', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al enviar el reporte. Intenta nuevamente más tarde.'
        });
      }
    });
  }

  onPdfSelected(event: any) {
    const file = event.target.files[0];
    this.pdfSeleccionado = file;
  }

  onImagenesSeleccionadas(event: any) {
    this.imagenesSeleccionadas = Array.from(event.target.files);
    this.imagenesPreview = this.imagenesSeleccionadas.map(file => URL.createObjectURL(file));
  }

  guardarPublicacion() {
    if (this.formPublicacion.invalid || !this.userId) return;
    const form = this.formPublicacion.value;

    const formData = new FormData();
    formData.append('descripcion', form.descripcion);
    if (this.pdfSeleccionado) formData.append('pdf', this.pdfSeleccionado);
    formData.append('user_id', this.userId.toString());

    this.imagenesSeleccionadas.forEach(img => formData.append('imagenes[]', img));

    this.loading = true;
    this.apiService.guardarPublicacionUsuario(formData).subscribe({
      next: res => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'La publicación se guardó correctamente.',
          showConfirmButton: true,
        }).then(() => {
          this.cerrarModal();
          this.formPublicacion.reset();
          this.cargarDatos();
        });
      },
      error: err => {
        this.loading = false;
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema al guardar la publicación. Intenta nuevamente.',
        });
      }
    });
  }
}
