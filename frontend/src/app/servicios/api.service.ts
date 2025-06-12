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
    
    
    
 
}
