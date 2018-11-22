import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEserciziComponent } from './lista-esercizi.component';

describe('ListaEserciziComponent', () => {
  let component: ListaEserciziComponent;
  let fixture: ComponentFixture<ListaEserciziComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaEserciziComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaEserciziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
