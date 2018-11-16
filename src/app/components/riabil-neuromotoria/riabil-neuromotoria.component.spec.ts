import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiabilNeuromotoriaComponent } from './riabil-neuromotoria.component';

describe('RiabilNeuromotoriaComponent', () => {
  let component: RiabilNeuromotoriaComponent;
  let fixture: ComponentFixture<RiabilNeuromotoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiabilNeuromotoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiabilNeuromotoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
