import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiNegocioComponent } from './mi-negocio.component';

describe('MiNegocioComponent', () => {
  let component: MiNegocioComponent;
  let fixture: ComponentFixture<MiNegocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiNegocioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MiNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
