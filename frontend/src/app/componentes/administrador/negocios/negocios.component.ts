import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiService } from '../../../servicios/api.service';

interface Negocio {
  nombre: string;
  descripcion: string;
  direccion: string;
  estado: string;
  servicio_domicilio: boolean;
  logo_url: string;
  fecha_pago: string | null; 
  fecha_vencimiento: string | null;
  user_id: number | null;
}

@Component({
  selector: 'app-negocios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './negocios.component.html',
  styleUrls: ['./negocios.component.css']
})
export class NegociosComponent implements OnInit {
  negocios: any[] = [];
  usuarios: any[] = [];
  nuevoNegocio: Negocio = {
    nombre: '',
    descripcion: '',
    direccion: '',
    estado: 'inactivo',
    servicio_domicilio: false,
    logo_url: '',
    fecha_pago: null,
    fecha_vencimiento: null,
    user_id: null
  };
  negocioSeleccionado: any = null;
  filtro: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarNegocios();
    this.cargarUsuarios();
  }

  cargarNegocios(): void {
    this.apiService.obtenerNegocios(this.filtro).subscribe({
      next: (data) => {
        console.log('Datos recibidos de negocios:', data); // <-- Aquí

        this.negocios = data.map((negocio: any) => ({
          ...negocio,
          servicio_domicilio: negocio.servicio_domicilio === 1
        }));
      },
      error: () => Swal.fire('Error', 'No se pudieron cargar los negocios.', 'error')
    });
  }

  cargarUsuarios(): void {
    this.apiService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: () => Swal.fire('Error', 'No se pudieron cargar los usuarios.', 'error')
    });
  }

  buscarNegocio(): void {
    this.cargarNegocios();
  }

  guardarNegocio(): void {
    if (!this.nuevoNegocio.nombre) {
      Swal.fire('Campo requerido', 'El nombre del negocio es obligatorio.', 'warning');
      return;
    }

    if (!this.nuevoNegocio.user_id) {
      Swal.fire('Error', 'Debe seleccionar un usuario.', 'warning');
      return;
    }

    if (this.negocioSeleccionado) {
      this.apiService.actualizarNegocio(this.negocioSeleccionado.id, this.nuevoNegocio).subscribe({
        next: () => {
          this.limpiarFormulario();
          this.cargarNegocios();
          Swal.fire('Actualizado', 'El negocio fue actualizado.', 'success');
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar el negocio.', 'error')
      });
    } else {
      // Ya no se usa el userId de sessionStorage, se usa el seleccionado
      this.apiService.crearNegocio(this.nuevoNegocio).subscribe({
        next: () => {
          this.limpiarFormulario();
          this.cargarNegocios();
          Swal.fire('Creado', 'Negocio creado correctamente.', 'success');
        },
        error: () => Swal.fire('Error', 'No se pudo crear el negocio.', 'error')
      });
    }
  }

  eliminarNegocio(id: number): void {
    Swal.fire({
      title: '¿Eliminar negocio?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.eliminarNegocio(id).subscribe({
          next: () => {
            this.cargarNegocios();
            Swal.fire('Eliminado', 'Negocio eliminado correctamente.', 'success');
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el negocio.', 'error')
        });
      }
    });
  }

  seleccionarNegocio(negocio: any): void {
    this.negocioSeleccionado = negocio;
    this.nuevoNegocio = { ...negocio };
  }

  limpiarFormulario(): void {
    this.negocioSeleccionado = null;
    this.nuevoNegocio = {
      nombre: '',
      descripcion: '',
      direccion: '',
      estado: 'inactivo',
      servicio_domicilio: false,
      logo_url: '',
      fecha_pago: null,
      fecha_vencimiento: null,
      user_id: null
    };
  }
}
