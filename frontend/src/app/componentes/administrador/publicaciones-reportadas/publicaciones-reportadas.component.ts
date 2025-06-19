import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../servicios/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-publicaciones-reportadas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './publicaciones-reportadas.component.html',
  styleUrls: ['./publicaciones-reportadas.component.css']
})
export class PublicacionesReportadasComponent implements OnInit {
  reportes: any;
  reportesFiltrados: any[] = [];
  filter: string = '';

  detalle: any = null;
  tipoDetalle: 'usuario' | 'negocio' | 'publicacion' | 'comentario' | null = null;

  modalAbierto = false;
  imagenActual = 0;
  imagenesModal: string[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarPage(1);
  }

  cargarPage(page: number): void {
    this.api.reportesPublicaciones(page).subscribe({
      next: data => {
        this.reportes = data;
        this.actualizarFiltro();
      },
      error: err => console.error(err)
    });
  }

  actualizarFiltro(): void {
    const texto = this.filter.toLowerCase();
    this.reportesFiltrados = this.reportes.data.filter((rep: any) =>
      rep.usuario.name.toLowerCase().includes(texto) ||
      rep.publicacion.descripcion.toLowerCase().includes(texto) ||
      rep.publicacion.negocio.nombre.toLowerCase().includes(texto)
    );
  }

  verDetalle(data: any, tipo: 'usuario' | 'negocio' | 'publicacion' | 'comentario') {
    this.detalle = data;
    this.tipoDetalle = tipo;
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

  marcarComoVisto(id: number) {
    this.api.marcarReporteComoVisto(id).subscribe({
      next: () => {
        const reporte = this.reportesFiltrados.find(r => r.id === id);
        if (reporte) reporte.visto = true;
  
        Swal.fire({
          icon: 'success',
          title: 'Reporte marcado como visto',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: err => {
        console.error('Error al marcar como visto', err);
        Swal.fire({
          icon: 'error',
          title: 'Ocurrió un error',
          text: 'No se pudo marcar el reporte como visto',
        });
      }
    });
  }


 // Llama cuando abres modal pasando índice
 abrirModal(indice: number) {
  if (!this.detalle?.imagenes?.length) return;
  this.imagenesModal = this.detalle.imagenes.map((img: { imagen: string }) => img.imagen);
  this.imagenActual = indice;
  this.modalAbierto = true;
}

cerrarModal() {
  this.modalAbierto = false;
}

anterior() {
  if (this.imagenActual > 0) {
    this.imagenActual--;
  }
}

siguiente() {
  if (this.imagenActual < this.imagenesModal.length - 1) {
    this.imagenActual++;
  }
}
  
  
}
