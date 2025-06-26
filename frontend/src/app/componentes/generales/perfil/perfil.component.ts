import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { ApiService } from '../../../servicios/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import maplibregl from 'maplibre-gl';

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
    telefono: '',
    foto_perfil: '',
    roles: [],
    negocios: [],
    direccion: '',
    latitud: '',
    longitud: '',
    visible: 1
  };

  direccion = {
    pais: '',
    estado: '',
    ciudad: '',
    colonia: '',
    calle: '',
    numero: '',
    cp: '',
    titulo: '',        
    referencia: ''    
  };

  direcciones: any[] = [];
  direccionSeleccionada: any = this.getDireccionVacia();
  modo: 'editar' | 'nuevo' = 'nuevo';

  

  codigoVerificacion: string = '';
  mostrarModalVerificarCodigo: boolean = false;
  fotoPerfilSegura: SafeResourceUrl = '';
  fotoPerfilFile: File | null = null;
  puedeEditar: boolean = false;
  userId: string | null = null;

  latitud: number = 21.81233;
  longitud: number = -105.20639;
  

  mapaLibre!: maplibregl.Map;
  marcadorLibre!: maplibregl.Marker;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.sub || decoded.user_id || null;

      const idRuta = this.route.snapshot.paramMap.get('id');
      if (!idRuta) return;

      this.puedeEditar = idRuta === this.userId;
      this.obtenerUsuario(idRuta);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  }

  activarTabDireccion(): void {
    setTimeout(() => {
      if (!this.mapaLibre) {
        this.inicializarMapa();
      } else {
        const nuevaPos: [number, number] = [this.longitud, this.latitud];
        this.marcadorLibre.setLngLat(nuevaPos);
        this.mapaLibre.setCenter(nuevaPos);
        this.mapaLibre.resize();
      }
    }, 600);
  }

  getDireccionVacia() {
    return {
      id: null,
      pais: '',
      estado: '',
      ciudad: '',
      colonia: '',
      calle: '',
      numero: '',
      cp: '',
      titulo: '',
      referencia: '',
      latitud: this.latitud,
      longitud: this.longitud
    };
  }

  seleccionarDireccion(direccion: any): void {
    this.direccionSeleccionada = { ...direccion };
    this.latitud = parseFloat(direccion.latitud);
    this.longitud = parseFloat(direccion.longitud);
    this.modo = 'editar';
  
    if (this.marcadorLibre) {
      const nuevaPos: [number, number] = [this.longitud, this.latitud];
      this.marcadorLibre.setLngLat(nuevaPos);
      this.mapaLibre.setCenter(nuevaPos);
    }
  }
  

  inicializarMapa(): void {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    this.mapaLibre = new maplibregl.Map({
      container: mapContainer,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [this.longitud, this.latitud],
      zoom: 14
    });

    const el = document.createElement('div');
    el.style.backgroundImage = 'url("https://cdn-icons-png.flaticon.com/512/6735/6735939.png")';
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.backgroundSize = 'cover';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.borderRadius = '50%';

    this.marcadorLibre = new maplibregl.Marker({ element: el, draggable: true })
      .setLngLat([this.longitud, this.latitud])
      .addTo(this.mapaLibre);

    this.marcadorLibre.on('dragend', () => {
      const lngLat = this.marcadorLibre.getLngLat();
      this.longitud = lngLat.lng;
      this.latitud = lngLat.lat;
      // Puedes limpiar la dirección si quieres:
    });

    this.mapaLibre.on('load', () => {
      this.mapaLibre.resize();
    });
  }

  limpiarDireccion() {
    for (const key in this.direccion) {
      if (Object.prototype.hasOwnProperty.call(this.direccion, key)) {
        this.direccion[key as keyof typeof this.direccion] = '';
      }
    }
  }

  getDireccionCompleta(): string {
    const partes = [
      this.direccionSeleccionada.calle + (this.direccionSeleccionada.numero ? ` ${this.direccionSeleccionada.numero}` : ''),
      this.direccionSeleccionada.colonia,
      this.direccionSeleccionada.cp,
      this.direccionSeleccionada.ciudad,
      this.direccionSeleccionada.estado,
      this.direccionSeleccionada.pais,
    ].filter(p => p && p.trim() !== '');
    return partes.join(', ');
  }
  

  buscarDireccion(event?: Event): void {
    // Evita que el formulario se recargue si se ejecuta desde un <form>
    if (event) event.preventDefault();
  
    const direccionParaBuscar = this.getDireccionCompleta().trim();
  
    if (!direccionParaBuscar) {
      Swal.fire('Atención', 'Por favor ingresa una dirección para buscar.', 'warning');
      return;
    }
  
    const encoded = encodeURIComponent(direccionParaBuscar);
    const url = `http://localhost:8000/api/geocodificar?q=${encoded}`;
  
    const token = sessionStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };
  
    this.http.get<any[]>(url, { headers }).subscribe({
      next: (respuesta) => {
        if (respuesta.length > 0) {
          const lugar = respuesta[0];
          this.latitud = parseFloat(lugar.lat);
          this.longitud = parseFloat(lugar.lon);
  
          const nuevaPos: [number, number] = [this.longitud, this.latitud];
  
          if (this.marcadorLibre) this.marcadorLibre.setLngLat(nuevaPos);
          if (this.mapaLibre) this.mapaLibre.setCenter(nuevaPos);
  
        } else {
          Swal.fire('No encontrado', 'No se encontraron resultados para la dirección ingresada.', 'info');
        }
      },
      error: (error) => {
        console.error('Error al buscar dirección:', error);
        Swal.fire('Error', 'No se pudo realizar la búsqueda. Intenta más tarde.', 'error');
      }
    });
  }
  

  guardarDireccion(): void {
    if (!this.userId) return;
  
    const payload = {
      titulo: this.direccionSeleccionada.titulo,
      referencia: this.direccionSeleccionada.referencia,
      latitud: this.latitud,
      longitud: this.longitud,
    };
  
    if (this.modo === 'nuevo') {
      this.apiService.crearDireccionUsuario(this.userId, payload).subscribe({
        next: () => {
          Swal.fire('Listo', 'Dirección creada correctamente.', 'success');
          this.obtenerUsuario(this.userId!);
          this.modo = 'editar';
        },
        error: (err) => {
          console.error('Error al crear dirección:', err);
          Swal.fire('Error', 'No se pudo crear la dirección.', 'error');
        },
      });
    } else if (this.modo === 'editar' && this.direccionSeleccionada.id) {
      this.apiService
        .actualizarDireccionUsuario(this.userId, this.direccionSeleccionada.id, payload)
        .subscribe({
          next: () => {
            Swal.fire('Listo', 'Dirección actualizada correctamente.', 'success');
            this.obtenerUsuario(this.userId!);
          },
          error: (err) => {
            console.error('Error al actualizar dirección:', err);
            Swal.fire('Error', 'No se pudo actualizar la dirección.', 'error');
          },
        });
    }
  }
  
  
  
  
  

  obtenerUsuario(id: string): void {
    this.apiService.obtenerUsuarioPerfil(id).subscribe({
      next: (data) => {
        this.usuario = {
          name: data.name || '',
          email: data.email || '',
          telefono: data.telefono || '',
          visible: data.visible || 1,
          foto_perfil: data.foto_perfil || '',
          roles: data.roles || [],
          negocios: data.negocios || [],
          created_at: data.created_at || '',
          email_verified_at: data.email_verified_at || null,
          direccion: data.direccion || '',
          latitud: parseFloat(data.latitud) || this.latitud,
          longitud: parseFloat(data.longitud) || this.longitud
        };
  
        // 1. Cargar direcciones
        this.direcciones = [];
  
        if (data.direcciones && Array.isArray(data.direcciones)) {
          this.direcciones = data.direcciones;
        } else if (data.direccion_desglosada) {
          this.direcciones = [data.direccion_desglosada];
        }
  
        // 2. Seleccionar primera dirección si existe, si no dejar vacía
        if (this.direcciones.length > 0) {
          const dir = this.direcciones[0];
          this.direccionSeleccionada = {
            id: dir.id || null,
            pais: dir.pais || '',
            estado: dir.estado || '',
            ciudad: dir.ciudad || '',
            colonia: dir.colonia || '',
            calle: dir.calle || '',
            numero: dir.numero || '',
            cp: dir.cp || '',
            titulo: dir.titulo || '',
            referencia: dir.referencia || '',
            latitud: parseFloat(dir.latitud) || this.latitud,
            longitud: parseFloat(dir.longitud) || this.longitud
          };
          this.modo = 'editar';
        } else {
          this.direccionSeleccionada = this.getDireccionVacia();
          this.modo = 'nuevo';
        }
  
        // 3. Asignar lat y long para mapa
        this.latitud = parseFloat(this.direccionSeleccionada.latitud) || this.latitud;
        this.longitud = parseFloat(this.direccionSeleccionada.longitud) || this.longitud;
  
        // 4. Actualizar mapa
        if (this.mapaLibre && this.marcadorLibre) {
          const nuevaPos: [number, number] = [this.longitud, this.latitud];
          this.marcadorLibre.setLngLat(nuevaPos);
          this.mapaLibre.setCenter(nuevaPos);
        }
  
        // 5. Foto perfil segura
        this.fotoPerfilSegura = this.usuario.foto_perfil
          ? this.sanitizer.bypassSecurityTrustResourceUrl(this.usuario.foto_perfil)
          : '';
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err);
      }
    });
  }
  

  crearNuevaDireccion(): void {
    this.direccionSeleccionada = this.getDireccionVacia();
    this.modo = 'nuevo';
  
    if (this.marcadorLibre) {
      const nuevaPos: [number, number] = [this.longitud, this.latitud];
      this.marcadorLibre.setLngLat(nuevaPos);
      this.mapaLibre.setCenter(nuevaPos);
    }
  }

  onDireccionSeleccionada(): void {
    this.latitud = parseFloat(this.direccionSeleccionada.latitud) || this.latitud;
    this.longitud = parseFloat(this.direccionSeleccionada.longitud) || this.longitud;
  
    if (this.marcadorLibre && this.mapaLibre) {
      const nuevaPos: [number, number] = [this.longitud, this.latitud];
      this.marcadorLibre.setLngLat(nuevaPos);
      this.mapaLibre.setCenter(nuevaPos);
    }
  
    this.modo = this.direccionSeleccionada?.id ? 'editar' : 'nuevo';
  }
  

  
  

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fotoPerfilFile = input.files[0];
    }
    input.value = '';
  }

  guardarCambios(): void {
    const formData = new FormData();
    formData.append('nombre', this.usuario.name);
    formData.append('correo', this.usuario.email);

    if (this.usuario.telefono) {
      formData.append('telefono', this.usuario.telefono);
    }

    if (this.fotoPerfilFile) {
      formData.append('foto', this.fotoPerfilFile, this.fotoPerfilFile.name);
    }

    if (!this.userId) return;

    this.apiService.actualizarPerfil(this.userId, formData).subscribe({
      next: () => {
        Swal.fire('Perfil actualizado', 'Tus datos se actualizaron.', 'success').then(() => {
          window.location.reload();
        });
      },
      error: (err) => {
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
    if (!this.userId) return;

    this.apiService.enviarCodigoVerificacion(this.userId).subscribe({
      next: () => {
        Swal.fire('Código enviado', 'Revisa tu correo.', 'success').then(() => {
          this.abrirModalVerificarCodigo();
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo enviar el código.', 'error');
      }
    });
  }

  abrirModalVerificarCodigo(): void {
    this.mostrarModalVerificarCodigo = true;
  }

  cerrarModalVerificarCodigo(): void {
    this.mostrarModalVerificarCodigo = false;
    this.codigoVerificacion = '';
  }

  enviarCodigo(): void {
    if (!this.codigoVerificacion || this.codigoVerificacion.length !== 6) {
      Swal.fire('Error', 'Ingresa un código válido de 6 dígitos.', 'error');
      return;
    }

    if (!this.userId) return;

    this.apiService.verificarCodigoEmail(Number(this.userId), this.codigoVerificacion).subscribe({
      next: () => {
        Swal.fire('Correo verificado', 'Tu correo fue verificado correctamente.', 'success').then(() => {
          this.cerrarModalVerificarCodigo();
          this.obtenerUsuario(this.userId!);
        });
      },
      error: (err) => {
        let mensaje = 'Código incorrecto o expirado.';
        if (err.status === 422 && err.error?.errors) {
          const errores = err.error.errors;
          mensaje = Object.values(errores).flat().join('\n');
        }
        Swal.fire('Error', mensaje, 'error');
      }
    });
  }

  toggleVisibilidad(): void {
    if (!this.userId) return;
    const nuevoValor = this.usuario.visible == 1 ? 0 : 1;
    this.apiService.actualizarVisibilidadUsuario(this.userId, nuevoValor).subscribe({
      next: () => {
        this.usuario.visible = nuevoValor;
        Swal.fire({
          icon: 'success',
          title: nuevoValor === 1 ? 'Información visible' : 'Información oculta',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cambiar la visibilidad', 'error');
      }
    });
  }
}
