import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../servicios/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: any = {
    name: '',
    email: '',
    foto_perfil: '',
    roles: [],
    negocios: []
  };

  password: string = '';
  confirmarPassword: string = '';
  fotoPerfilFile: File | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    const id = sessionStorage.getItem('user_id');

    if (!token) {
      console.warn('Token no disponible todavía, no se llamó a obtenerUsuario().');
      return;
    }

    if (!id) {
      console.warn('ID de usuario no encontrado en sessionStorage.');
      return;
    }

    this.apiService.obtenerUsuarioPerfil(id).subscribe({
      next: (data) => {
        this.usuario = {
          name: data.name || '',
          email: data.email || '',
          foto_perfil: data.foto_perfil || '',
          roles: data.roles || [],
          negocios: data.negocios || [],
          created_at: data.created_at || ''
        };
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fotoPerfilFile = input.files[0];
      console.log('Archivo seleccionado:', this.fotoPerfilFile.name);
    } else {
      console.warn('No se seleccionó ningún archivo.');
    }
    // Limpiar input para que permita re-seleccionar el mismo archivo si se desea
    input.value = '';
  }
  
  

  guardarCambios(): void {
    if (this.password && this.password !== this.confirmarPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.'
      });
      return;
    }
    console.log('Usuario:', this.usuario);

    const formData = new FormData();
    formData.append('nombre', this.usuario.name);
    formData.append('correo', this.usuario.email);
  
    if (this.password) {
      formData.append('password', this.password);
    }
  
    if (this.fotoPerfilFile) {
      formData.append('foto', this.fotoPerfilFile, this.fotoPerfilFile.name);
    }
  
    // Verifica lo que se está agregando al FormData (sin usar .entries())
    console.log('FormData:');
    console.log('nombre:', this.usuario.name);
    console.log('correo:', this.usuario.email);
    console.log('password:', this.password);
    console.log('foto:', this.fotoPerfilFile?.name ?? 'No seleccionada');
  
    const id = sessionStorage.getItem('user_id');
    if (!id) return;
  
    this.apiService.actualizarPerfil(id, formData).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Perfil actualizado',
          text: 'Tus datos se actualizaron correctamente.'
        });
        if(res.foto_url) {
          this.usuario.foto_perfil = res.foto_url;
        }
        this.password = '';
        this.confirmarPassword = '';
        this.fotoPerfilFile = null;
      },
      error: (err) => {
        console.error('Error completo:', err);
        if (err.status === 422) {
          console.error('Errores de validación:', err.error.errors);
          const errores = err.error.errors;
          let mensaje = '';
          for (let campo in errores) {
            mensaje += `${campo}: ${errores[campo][0]}\n`;
          }
          Swal.fire('Error de validación', mensaje, 'error');
        } else {
          Swal.fire('Error', 'Ocurrió un error al actualizar el perfil', 'error');
        }
      }
      
      
    });
  }
  
  
  
}
