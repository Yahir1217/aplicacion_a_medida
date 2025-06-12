import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../servicios/api.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  roles: any[] = [];
  nuevoRol = { nombre: '', descripcion: '' };
  rolSeleccionado: any = null;
  filtro: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.apiService.obtenerRoles(this.filtro).subscribe({
      next: (data) => this.roles = data,
      error: () => Swal.fire('Error', 'Error al cargar los roles.', 'error')
    });
  }

  buscarRol(): void {
    this.cargarRoles();
  }

  guardarRol(): void {
    if (!this.nuevoRol.nombre || !this.nuevoRol.descripcion) {
      Swal.fire('Campos requeridos', 'Por favor completa todos los campos.', 'warning');
      return;
    }

    if (this.rolSeleccionado) {
      // Editar
      const rolActualizado = {
        id: this.rolSeleccionado.id,
        nombre: this.nuevoRol.nombre,
        descripcion: this.nuevoRol.descripcion
      };

      this.apiService.actualizarRol(rolActualizado.id, rolActualizado).subscribe({
        next: () => {
          this.limpiarFormulario();
          this.cargarRoles();
          Swal.fire('Actualizado', 'El rol se actualizó correctamente.', 'success');
        },
        error: () => Swal.fire('Error', 'Error al actualizar el rol.', 'error')
      });
    } else {
      // Crear
      this.apiService.crearRol(this.nuevoRol).subscribe({
        next: () => {
          this.limpiarFormulario();
          this.cargarRoles();
          Swal.fire('Creado', 'El nuevo rol fue creado exitosamente.', 'success');
        },
        error: () => Swal.fire('Error', 'Error al crear el rol.', 'error')
      });
    }
  }

  eliminarRol(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.eliminarRol(id).subscribe({
          next: () => {
            this.cargarRoles();
            Swal.fire('Eliminado', 'El rol ha sido eliminado.', 'success');
          },
          error: () => Swal.fire('Error', 'Error al eliminar el rol.', 'error')
        });
      }
    });
  }

  seleccionarRol(rol: any): void {
    this.rolSeleccionado = rol;
    this.nuevoRol = {
      nombre: rol.nombre,
      descripcion: rol.descripcion
    };
  }

  limpiarFormulario(): void {
    this.rolSeleccionado = null;
    this.nuevoRol = { nombre: '', descripcion: '' };
  }
}
