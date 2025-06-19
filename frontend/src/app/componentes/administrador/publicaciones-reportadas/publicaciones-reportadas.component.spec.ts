import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionesReportadasComponent } from './publicaciones-reportadas.component';

describe('PublicacionesReportadasComponent', () => {
  let component: PublicacionesReportadasComponent;
  let fixture: ComponentFixture<PublicacionesReportadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicacionesReportadasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicacionesReportadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
