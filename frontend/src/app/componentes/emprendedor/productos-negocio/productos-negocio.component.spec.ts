import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosNegocioComponent } from './productos-negocio.component';

describe('ProductosNegocioComponent', () => {
  let component: ProductosNegocioComponent;
  let fixture: ComponentFixture<ProductosNegocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosNegocioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductosNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
