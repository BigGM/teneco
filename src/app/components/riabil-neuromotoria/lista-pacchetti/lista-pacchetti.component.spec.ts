import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPacchettiComponent } from './lista-pacchetti.component';

describe('ListaPacchettiComponent', () => {
  let component: ListaPacchettiComponent;
  let fixture: ComponentFixture<ListaPacchettiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaPacchettiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPacchettiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
