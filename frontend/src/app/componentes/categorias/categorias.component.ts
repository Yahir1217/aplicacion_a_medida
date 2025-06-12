import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../servicios/api.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];
  nuevaCategoria = { nombre: '', descripcion: '' };
  categoriaSeleccionada: any = null;
  filtro: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.apiService.obtenerCategorias(this.filtro).subscribe({
      next: (data) => this.categorias = data,
      error: () => Swal.fire('Error', 'Error al cargar las categorías.', 'error')
    });
  }

  buscarCategoria(): void {
    this.cargarCategorias();
  }

  guardarCategoria(): void {
    if (!this.nuevaCategoria.nombre) {
      Swal.fire('Campo requerido', 'Por favor completa el nombre.', 'warning');
      return;
    }

    if (this.categoriaSeleccionada) {
      // Editar
      this.apiService.actualizarCategoria(this.categoriaSeleccionada.id, this.nuevaCategoria).subscribe({
        next: () => {
          this.limpiarFormulario();
          this.cargarCategorias();
          Swal.fire('Actualizado', 'La categoría se actualizó correctamente.', 'success');
        },
        error: () => Swal.fire('Error', 'Error al actualizar la categoría.', 'error')
      });
    } else {
      // Crear
      this.apiService.crearCategoria(this.nuevaCategoria).subscribe({
        next: () => {
          this.limpiarFormulario();
          this.cargarCategorias();
          Swal.fire('Creado', 'La nueva categoría fue creada exitosamente.', 'success');
        },
        error: () => Swal.fire('Error', 'Error al crear la categoría.', 'error')
      });
    }
  }

  eliminarCategoria(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.eliminarCategoria(id).subscribe({
          next: () => {
            this.cargarCategorias();
            Swal.fire('Eliminado', 'La categoría ha sido eliminada.', 'success');
          },
          error: () => Swal.fire('Error', 'Error al eliminar la categoría.', 'error')
        });
      }
    });
  }

  seleccionarCategoria(categoria: any): void {
    this.categoriaSeleccionada = categoria;
    this.nuevaCategoria = {
      nombre: categoria.nombre,
      descripcion: categoria.descripcion
    };
  }

  limpiarFormulario(): void {
    this.categoriaSeleccionada = null;
    this.nuevaCategoria = { nombre: '', descripcion: '' };
  }
}
