import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../servicios/api.service';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

declare var bootstrap: any;

@Component({
  selector: 'app-mis-tarjetas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-tarjetas.component.html',
  styleUrls: ['./mis-tarjetas.component.css']
})
export class MisTarjetasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('modalTarjetaRef') modalTarjetaRef!: ElementRef;
  @ViewChild('modalOnboardingRef') modalOnboardingRef!: ElementRef;

  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;

  tarjetasCliente: any[] = [];
  negocios: any[] = [];
  negocioSeleccionado: any = null;
  mostrarTarjetasCliente: boolean = false;
  cardErrors: string = '';
  modalInstance: any;
  modalOnboardingInstance: any;
  onboardingUrl: string = '';
  mostrarTarjetas = false;

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    this.stripe = await loadStripe(environment.stripePublicKey);
    this.cargarNegocios();
    this.cargarTarjetasCliente();
  }

  ngAfterViewInit() {
    this.setupStripeElements();
  }

  ngOnDestroy() {
    if (this.cardElement) {
      this.cardElement.unmount();
    }
  }

  async setupStripeElements() {
    if (!this.stripe) return;

    this.elements = this.stripe.elements();

    if (this.cardElement) {
      this.cardElement.unmount();
    }

    this.cardElement = this.elements.create('card', {
      style: {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': { color: '#aab7c4' }
        },
        invalid: { color: '#fa755a', iconColor: '#fa755a' }
      }
    });

    this.cardElement.mount('#card-element');

    this.cardElement.on('change', event => {
      this.cardErrors = event.error ? event.error.message : '';
    });
  }

  cargarNegocios() {
    this.apiService.getMiNegocio().subscribe({
      next: (res) => {
        this.negocios = res;
        console.log('Negocios cargados:', this.negocios);

        this.cargarTarjetasNegocios();
      },
      error: (err) => {
        console.error('Error al obtener negocios:', err);
      }
    });
  }

  cargarTarjetasCliente() {
    this.apiService.obtenerTarjetasStripe('cliente').subscribe({
      next: (res) => {
        this.tarjetasCliente = res.tarjetas || [];
      },
      error: (err) => {
        console.error('Error al obtener tarjetas del cliente', err);
      }
    });
  }

  cargarTarjetasNegocios() {
    this.negocios.forEach((negocio) => {
      this.apiService.obtenerTarjetasStripe('negocio', negocio.id).subscribe({
        next: (res) => {
          negocio.tarjetas = res.tarjetas || [];
        },
        error: (err) => {
          console.error(`Error al obtener tarjetas del negocio ${negocio.nombre}`, err);
          negocio.tarjetas = null;
        }
      });
    });
  }

  abrirModalCliente() {
    this.negocioSeleccionado = null;
    this.mostrarModal();
  }

  abrirModalNegocio(negocio: any) {
    this.negocioSeleccionado = negocio;
    this.mostrarModal();
  }

  mostrarModal() {
    if (!this.modalInstance) {
      this.modalInstance = new bootstrap.Modal(this.modalTarjetaRef.nativeElement);
    }
    this.modalInstance.show();
    this.cardErrors = '';
    this.setupStripeElements();
  }

  cerrarModal() {
    if (this.modalInstance) this.modalInstance.hide();
  }

  cerrarModalOnboarding() {
    if (this.modalOnboardingInstance) this.modalOnboardingInstance.hide();
  }

  async registrarTarjeta(event: Event) {
    event.preventDefault();

    if (!this.stripe || !this.cardElement) return;

    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.cardElement,
    });

    if (error) {
      this.cardErrors = error.message || '';
      return;
    }

    const tipo = this.negocioSeleccionado ? 'negocio' : 'cliente';

    this.apiService.crearTarjetaStripe({
      payment_method_id: paymentMethod?.id,
      tipo,
      negocio_id: this.negocioSeleccionado?.id ?? null
    }).subscribe({
      next: (res) => {
        console.log('Respuesta backend:', res);
        this.cerrarModal();
        this.cargarNegocios();
        this.cargarTarjetasCliente();

        // Si hay link de onboarding, mostrar modal
        if (res.onboarding_url) {
          this.onboardingUrl = res.onboarding_url;
          if (!this.modalOnboardingInstance) {
            this.modalOnboardingInstance = new bootstrap.Modal(this.modalOnboardingRef.nativeElement);
          }
          this.modalOnboardingInstance.show();
        }
      },
      error: (err) => {
        console.error('Error al registrar tarjeta', err);
        this.cardErrors = err?.error?.detalle || 'Error al registrar la tarjeta.';
      }
    });
  }

  contarTarjetasNegocios(): number {
    return this.negocios.reduce((acc, negocio) => acc + (negocio.tarjetas?.length || 0), 0);
  }

  eliminarTarjeta(id: number) {
    console.log('Eliminar tarjeta con id:', id);
    // Aquí puedes implementar la lógica para eliminar la tarjeta
  }

  verTarjetasCliente() {
    this.mostrarTarjetasCliente = true;
    this.negocioSeleccionado = null;
  }

  verTarjetas(negocio: any) {
    this.negocioSeleccionado = negocio;
    this.mostrarTarjetasCliente = false;
  }

  generarOnboardingLink(negocioId: number) {
    this.apiService.generarOnboardingLink(negocioId).subscribe({
      next: (res) => {
        if (res.url) {
          this.onboardingUrl = res.url;
          if (!this.modalOnboardingInstance) {
            this.modalOnboardingInstance = new bootstrap.Modal(this.modalOnboardingRef.nativeElement);
          }
          this.modalOnboardingInstance.show();
        }
      },
      error: (err) => {
        console.error('Error al generar onboarding link', err);
      }
    });
  }
  
}
