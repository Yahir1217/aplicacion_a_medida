import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegocioOrdenesComponent } from './negocio-ordenes.component';

describe('NegocioOrdenesComponent', () => {
  let component: NegocioOrdenesComponent;
  let fixture: ComponentFixture<NegocioOrdenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NegocioOrdenesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NegocioOrdenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
