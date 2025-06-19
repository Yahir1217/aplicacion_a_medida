import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../servicios/api.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vista-principal',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './vista-principal.component.html',
  styleUrls: ['./vista-principal.component.css']
})
export class VistaPrincipalComponent implements OnInit {
  publicaciones: any[] = [];
  page = 1;
  loading = false;
  lastPage = false;

  // Para modal de imágenes
  modalAbierto = false;
  imagenesModal: string[] = [];
  imagenActual = 0;


  modalReporteAbierto = false;
  comentarioReporte = '';
  publicacionIdReporte: number = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarPublicaciones();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const threshold = 100;
    const position = window.innerHeight + window.scrollY;
    const height = document.body.offsetHeight;

    if (position >= height - threshold && !this.loading && !this.lastPage) {
      this.page++;
      this.cargarPublicaciones();
    }
  }

  cargarPublicaciones(): void {
    this.loading = true;
    this.apiService.getPublicaciones(this.page, 5).subscribe({
      next: (res) => {
        /*
        // Para probar el spinner con retardo, descomenta este bloque
        setTimeout(() => {
          this.publicaciones.push(...res.data);
          this.lastPage = !res.next_page_url;
          this.loading = false;
        }, 2000); // retardo 2 segundos
        */
  
        // Código normal sin retardo:
        this.publicaciones.push(...res.data);
        this.lastPage = !res.next_page_url;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar publicaciones', err);
        this.loading = false;
      }
    });
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



  ///GENERAR REPORTE

  abrirModalReporte(publicacionId: number): void {
    this.publicacionIdReporte = publicacionId;
    this.comentarioReporte = '';
    this.modalReporteAbierto = true;
  }
  
  cerrarModalReporte(): void {
    this.modalReporteAbierto = false;
  }
  
  // Enviar el reporte
  enviarReporte(): void {
    const userId = Number(sessionStorage.getItem('user_id')); // asegúrate de guardar esto en el login
  
    if (!this.comentarioReporte.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Comentario requerido',
        text: 'Escribe un comentario para reportar esta publicación.'
      });
      return;
    }
  
    const payload = {
      user_id: userId,
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
}
