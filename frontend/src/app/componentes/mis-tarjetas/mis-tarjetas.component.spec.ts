import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisTarjetasComponent } from './mis-tarjetas.component';

describe('MisTarjetasComponent', () => {
  let component: MisTarjetasComponent;
  let fixture: ComponentFixture<MisTarjetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisTarjetasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MisTarjetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
