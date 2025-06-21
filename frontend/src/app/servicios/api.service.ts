import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';


  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
 
  private getAuthHeaders(includeJson: boolean = true): HttpHeaders {
    let token = '';
    if (this.isBrowser) {
      token = sessionStorage.getItem('token') || '';
    }
  
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    // Solo agrega el Content-Type si es JSON
    if (includeJson) {
      headers = headers.set('Content-Type', 'application/json');
    }
  
    return headers;
  }
  
  



  // Usuarios


  obtenerUsuario(id: string) {
    return this.http.get<any>(`http://localhost:8000/api/usuario/${id}`, {
      headers: this.getAuthHeaders()
    });
  }


  obtenerRoles(search: string = '') {
    let params = '';
    if (search.trim() !== '') {
      params = `?search=${encodeURIComponent(search)}`;
    }
    return this.http.get<any[]>(`${this.apiUrl}/roles${params}`, {
      headers: this.getAuthHeaders()
    });
  }
  
  
    

  crearRol(rol: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/roles`, rol, {
      headers: this.getAuthHeaders()
    });
  }

  eliminarRol(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/roles/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarRol(id: number, rol: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/roles/${id}`, rol, {
      headers: this.getAuthHeaders()
    });
  }


    // Usuarios
    obtenerUsuarios(filtro: string = ''): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/usuarios?filtro=${filtro}`, {
        headers: this.getAuthHeaders()
      });
    }
    

    crearUsuario(data: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/usuarios`, data, {
        headers: this.getAuthHeaders()
      });
    }

    actualizarUsuario(id: number, data: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/usuarios/${id}`, data, {
        headers: this.getAuthHeaders()
      });
    }

    eliminarUsuario(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/usuarios/${id}`, {
        headers: this.getAuthHeaders()
      });
    }


    obtenerCategorias(search: string = '') {
      let params = '';
      if (search.trim() !== '') {
        params = `?search=${encodeURIComponent(search)}`;
      }
      return this.http.get<any[]>(`${this.apiUrl}/categorias${params}`, {
        headers: this.getAuthHeaders()
      });
    }
    
    crearCategoria(categoria: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/categorias`, categoria, {
        headers: this.getAuthHeaders()
      });
    }
    
    actualizarCategoria(id: number, categoria: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/categorias/${id}`, categoria, {
        headers: this.getAuthHeaders()
      });
    }
    
    eliminarCategoria(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/categorias/${id}`, {
        headers: this.getAuthHeaders()
      });
    }

    obtenerNegocios(search: string = ''): Observable<any[]> {
      let params = '';
      if (search.trim() !== '') {
        params = `?search=${encodeURIComponent(search)}`;
      }
      return this.http.get<any[]>(`${this.apiUrl}/negocios${params}`, {
        headers: this.getAuthHeaders()
      });
    }
    
    crearNegocio(negocio: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/negocios`, negocio, {
        headers: this.getAuthHeaders()
      });
    }
    
    actualizarNegocio(id: number, negocio: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/negocios/${id}`, negocio, {
        headers: this.getAuthHeaders()
      });
    } 
    
    eliminarNegocio(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/negocios/${id}`, {
        headers: this.getAuthHeaders()
      });
    }

    obtenerUsuarioPerfil(id: string) {
      return this.http.get<any>(`http://localhost:8000/api/usuario/perfil/${id}`, {
        headers: this.getAuthHeaders()
      });
    }

    actualizarPerfil(id: string, data: FormData): Observable<any> {
      const token = sessionStorage.getItem('token') || '';
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
        // No agregues Content-Type aquí
      });
    
      return this.http.post(`${this.apiUrl}/usuarios/${id}/actualizar`, data, { headers });
    }
    
    enviarCodigoVerificacion(id: string): Observable<any> {
      return this.http.post(`${this.apiUrl}/enviar-codigo-verificacion/${id}`, {}, {
        headers: this.getAuthHeaders()
      });
    }
    
    

    verificarCodigoEmail(id: number, codigo: string): Observable<any> {
      return this.http.post(`${this.apiUrl}/verificar-codigo-email`, { id, codigo }, {
        headers: this.getAuthHeaders()
      });
    }

    obtenerDetalleNegocio(id: number): Observable<any> {
      return this.http.get(`${this.apiUrl}/negocios/${id}`, {
        headers: this.getAuthHeaders()
      });
    }

    actualizarNegocioDetalle(id: number, data: FormData): Observable<any> {
      const token = sessionStorage.getItem('token') || '';
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.post(`${this.apiUrl}/negocios/${id}`, data, { headers });
    }

    actualizarContactoNegocio(id: number, data: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/negocios/${id}/actualizar-contacto`, data, {
        headers: this.getAuthHeaders()
      });
    }

    actualizarHorarios(negocioId: number, horarios: any[]): Observable<any> {
      return this.http.put(`${this.apiUrl}/negocios/${negocioId}/horarios`, { horarios }, {
        headers: this.getAuthHeaders()
      });
    }


    postConToken(ruta: string, data: any): Observable<any> {
      const token = sessionStorage.getItem('token') || '';
      const isFormData = data instanceof FormData;
    
      let headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    
      if (!isFormData) {
        headers = headers.set('Content-Type', 'application/json');
      }
    
      return this.http.post(`${this.apiUrl}${ruta.startsWith('/') ? ruta : '/' + ruta}`, data, { headers });
    }

    eliminarPublicacion(id: number): Observable<any> {
      const token = sessionStorage.getItem('token') || '';
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    
      return this.http.delete(`${this.apiUrl}/publicaciones/${id}`, { headers });
    }
    

    toggleDestacadoPublicacion(publicacionId: number): Observable<any> {
      return this.http.put(`${this.apiUrl}/publicaciones/${publicacionId}/destacar`, {}, {
        headers: this.getAuthHeaders()
      });
    }

    actualizarOrdenDestacadas(orden: { id: number; orden: number }[]): Observable<any> {
      return this.http.put(
        `${this.apiUrl}/publicaciones/destacadas/orden`,
        { orden },
        { headers: this.getAuthHeaders() }
      );
    }


    getPublicaciones(page: number, limit: number = 5): Observable<any> {
      const token = sessionStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
      // Nota: en la ruta no usas "limit" sino "cantidad", ajusta si quieres
      return this.http.get<any>(`${this.apiUrl}/publicaciones?page=${page}&cantidad=${limit}`, { headers });
    }
    
    getNegocios(page: number, limit: number = 5): Observable<any> {
      const headers = this.getAuthHeaders();
      return this.http.get<any>(`${this.apiUrl}/negocios_generales?page=${page}&cantidad=${limit}`, { headers });
    }
    
    getUsuarios(page: number, limit: number = 5): Observable<any> {
      const headers = this.getAuthHeaders();
      return this.http.get<any>(`${this.apiUrl}/usuarios_generales?page=${page}&cantidad=${limit}`, { headers });
    }
    

    reportarPublicacion(reporte: { user_id: number; publicacion_id: number; comentario: string }): Observable<any> {
      return this.http.post(
        `${this.apiUrl}/reportes`,
        reporte,
        { headers: this.getAuthHeaders() }
      );
    }

    reportesPublicaciones(page: number = 1, perPage: number = 10): Observable<any> {
      return this.http.get(
        `${this.apiUrl}/reportes-publicaciones?page=${page}&per_page=${perPage}`,
        { headers: this.getAuthHeaders() }
      );
    }

    marcarReporteComoVisto(id: number) {
      const headers = this.getAuthHeaders();
      return this.http.post(`${this.apiUrl}/reportes/${id}/marcar-visto`, {}, { headers });
    }


// publicacion.service.ts
guardarPublicacionUsuario(data: FormData) {
  const token = localStorage.getItem('token');
  return this.http.post(`${this.apiUrl}/publicaciones/usuario`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

getMiNegocio(): Observable<any> {
  const user_id = sessionStorage.getItem('user_id');
  const headers = this.getAuthHeaders();
  return this.http.get<any>(`${this.apiUrl}/mi-negocio?user_id=${user_id}`, { headers });
}



    
    
    


}
