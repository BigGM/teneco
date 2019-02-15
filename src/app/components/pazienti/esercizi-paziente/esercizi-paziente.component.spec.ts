import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EserciziPazienteComponent } from './esercizi-paziente.component';

describe('EserciziPazienteComponent', () => {
  let component: EserciziPazienteComponent;
  let fixture: ComponentFixture<EserciziPazienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EserciziPazienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EserciziPazienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
