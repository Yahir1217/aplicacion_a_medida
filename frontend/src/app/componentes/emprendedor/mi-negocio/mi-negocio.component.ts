import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../servicios/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mi-negocio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mi-negocio.component.html',
  styleUrl: './mi-negocio.component.css'
})
export class MiNegocioComponent implements OnInit {
  negocios: any[] = [];
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getMiNegocio().subscribe({
      next: res => {
        this.negocios = res; // ahora es un array
        this.loading = false;
      },
      error: err => {
        console.error('Error al obtener los negocios', err);
        this.loading = false;
      }
    });
  }
}

