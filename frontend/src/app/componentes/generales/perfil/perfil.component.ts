import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../servicios/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
  codigoVerificacion: string = '';
  mostrarModalVerificarCodigo: boolean = false;
  fotoPerfilSegura: SafeResourceUrl = '';
  password: string = '';
  confirmarPassword: string = '';
  fotoPerfilFile: File | null = null;


  constructor(private apiService: ApiService, private sanitizer: DomSanitizer, private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.warn('Token no disponible todavía, no se llamó a obtenerUsuario().');
      return;
    }
    this.obtenerUsuario();
  }
  

  obtenerUsuario(): void {
    const id = sessionStorage.getItem('user_id');
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
          created_at: data.created_at || '',
          email_verified_at: data.email_verified_at || null
        };
  
        console.log('Usuario actualizado:', this.usuario);
  
        if(this.usuario.foto_perfil) {
          this.fotoPerfilSegura = this.sanitizer.bypassSecurityTrustResourceUrl(this.usuario.foto_perfil);
        } else {
          this.fotoPerfilSegura = '';
        }
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
    // Limpiar input para permitir re-seleccionar el mismo archivo si se desea
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
  
    const formData = new FormData();
    formData.append('nombre', this.usuario.name);
    formData.append('correo', this.usuario.email);
  
    if (this.password) {
      formData.append('password', this.password);
    }
  
    if (this.fotoPerfilFile) {
      formData.append('foto', this.fotoPerfilFile, this.fotoPerfilFile.name);
    }
  
    const id = sessionStorage.getItem('user_id');
    if (!id) return;
  
    this.apiService.actualizarPerfil(id, formData).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Perfil actualizado',
          text: 'Tus datos se actualizaron correctamente.'
        }).then(() => {
          // 🔄 Refrescar la página completamente
          window.location.reload();
        });
  
        // Si NO recargaras, podrías actualizar la imagen sin recarga con esto:
        // this.usuario.foto_perfil = res.usuario.foto_perfil;
        // this.fotoPerfilSegura = this.sanitizer.bypassSecurityTrustResourceUrl(this.usuario.foto_perfil);
  
        this.password = '';
        this.confirmarPassword = '';
        this.fotoPerfilFile = null;
      },
      error: (err) => {
        console.error('Error completo:', err);
        if (err.status === 422) {
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


  accionParaEmailNoVerificado(): void {
    const id = sessionStorage.getItem('user_id');
          
    if (!id) {
      Swal.fire('Error', 'ID de usuario no disponible', 'error');
      return;
    }
  
    this.apiService.enviarCodigoVerificacion(id).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Código enviado',
          text: 'Revisa tu correo electrónico para verificar el código.'
        }).then(() => {
          this.abrirModalVerificarCodigo(); // <- aquí se abre el modal
        });
      },
      error: (err) => {
        console.error('Error al enviar código:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo enviar el código de verificación. Intenta de nuevo.'
        });
      }
    });
  }
  

  abrirModalVerificarCodigo(): void {
    this.mostrarModalVerificarCodigo = true;
  }
  
  
  // Función para cerrar el modal de verificar código (quita las clases y estilos)
  cerrarModalVerificarCodigo(): void {
    this.mostrarModalVerificarCodigo = false;
    this.codigoVerificacion = ''; // limpiar input
  }
  
  
  enviarCodigo(): void {
    if (!this.codigoVerificacion || this.codigoVerificacion.length !== 6) {
      Swal.fire('Error', 'Ingresa un código válido de 6 dígitos.', 'error');
      return;
    }
  
    const id = sessionStorage.getItem('user_id');
    if (!id) {
      Swal.fire('Error', 'ID de usuario no disponible', 'error');
      return;
    }
  
    this.apiService.verificarCodigoEmail(Number(id), this.codigoVerificacion).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Correo verificado',
          text: 'Tu correo fue verificado correctamente.'
        }).then(() => {
          this.cerrarModalVerificarCodigo();
  
          // Actualiza datos sin recargar la página
          this.obtenerUsuario();
        });
      },
      error: (err) => {
        console.error('Error al verificar código:', err);
        let mensaje = 'Código incorrecto o expirado.';
  
        if (err.status === 422 && err.error?.errors) {
          const errores = err.error.errors;
          mensaje = Object.values(errores).flat().join('\n');
        }
  
        Swal.fire('Error', mensaje, 'error');
      }
    });
  }
  
  
  
  
  
}
