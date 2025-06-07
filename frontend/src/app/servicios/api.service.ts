import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { Usuario } from '../interface/usuario';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';
  private apiUrlUsuario = 'http://localhost:8000/api/usuarios';
  private apiUrlReserva = 'http://localhost:8000/api/reservas'; 

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
 
  private getAuthHeaders(): HttpHeaders {
    let token = '';
    if (this.isBrowser) {
      token = sessionStorage.getItem('token') || '';
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }



  // Usuarios


  obtenerUsuario(id: string) {
    return this.http.get<any>(`http://localhost:8000/api/usuario/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
  
}
