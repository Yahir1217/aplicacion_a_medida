// usuarios.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../servicios/api.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  roles: any[] = [];
  filtro: string = '';
  nuevoUsuario: any = { name: '', email: '', role_id: '' };
  usuarioSeleccionado: any = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  cargarUsuarios(): void {
    this.apiService.obtenerUsuarios(this.filtro).subscribe({
      next: (data) => {
        // Protege que data sea un array antes de asignar
        this.usuarios = Array.isArray(data) ? data : [];
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.usuarios = [];
        Swal.fire('Error', 'No se pudieron cargar los usuarios.', 'error');
      }
    });
  }

  cargarRoles(): void {
    this.apiService.obtenerRoles().subscribe({
      next: (data) => {
        this.roles = Array.isArray(data) ? data : [];
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        this.roles = [];
        Swal.fire('Error', 'No se pudieron cargar los roles.', 'error');
      }
    });
  }

  limpiarFormulario(): void {
    this.nuevoUsuario = { name: '', email: '', role_id: '' };
    this.usuarioSeleccionado = null;
  }

  seleccionarUsuario(user: any): void {
    if (user) {
      this.usuarioSeleccionado = user;
      this.nuevoUsuario = {
        id: user.id, // ← FALTA ESTO
        name: user.name ?? '',
        email: user.email ?? '',
        role_id: user.roles?.[0]?.id ?? '' // ← corregido también
      };
    }
  }
  

  guardarUsuario(): void {
    if (this.usuarioSeleccionado && this.usuarioSeleccionado.id) {
      this.apiService.actualizarUsuario(this.nuevoUsuario.id, this.nuevoUsuario).subscribe({
        next: () => {
          this.cargarUsuarios();
          Swal.fire('Éxito', 'Usuario actualizado', 'success');
          this.limpiarFormulario();
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
        }
      });
    } else {
      this.apiService.crearUsuario(this.nuevoUsuario).subscribe({
        next: () => {
          this.cargarUsuarios();
          Swal.fire('Éxito', 'Usuario creado', 'success');
          this.limpiarFormulario();
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo crear el usuario', 'error');
        }
      });
    }
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.apiService.eliminarUsuario(id).subscribe({
        next: () => {
          this.cargarUsuarios();
          Swal.fire('Éxito', 'Usuario eliminado', 'success');
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
        }
      });
    }
  }
}
