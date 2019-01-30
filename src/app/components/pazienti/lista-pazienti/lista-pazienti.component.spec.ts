import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPazientiComponent } from './lista-pazienti.component';

describe('ListaPazientiComponent', () => {
  let component: ListaPazientiComponent;
  let fixture: ComponentFixture<ListaPazientiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaPazientiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPazientiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
